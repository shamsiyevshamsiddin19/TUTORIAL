# SynchronousOnlyOperation xatosi va sync_to_async

## Bu darsda nimalarni o'rganasiz

- `SynchronousOnlyOperation` xatosi qachon va nega yuzaga kelishini tushuntira olasiz
- Bu xatoni ikki xil yo'l bilan (a-prefiksli metod yoki `sync_to_async`) to'g'ri hal qila olasiz
- Tranzaksiya kabi murakkab operatsiyalarni async handler ichida xavfsiz bajara olasiz
- Qaysi holatda qaysi yechimni tanlashni bila olasiz

## Nazariy qism

### Xato qachon paydo bo'ladi

Agar `async def` handler ichida oddiy (a-prefikssiz) ORM metodini ishlatsangiz:

```python
@router.message(Command("shop"))
async def cmd_shop(message: Message):
    products = Product.objects.filter(is_active=True)   # bu qatorning o'zi muammo emas (lazy, DB'ga hali murojaat qilinmagan)
    for product in products:                             # ❌ MANA SHU YERDA XATOLIK: haqiqiy DB so'rovi
        ...
```

...quyidagi xatolikka duch kelasiz:

```
SynchronousOnlyOperation: You cannot call this from an async context - use a thread or sync_to_async.
```

**Nima uchun bu xatolik umuman mavjud?** Django bu himoyani ataylab qo'shgan: agar sinxron DB so'rovi to'g'ridan-to'g'ri asinxron kod ichida (ya'ni event loop ishlab turgan paytda) bajarilsa, bu butun event loop'ni **bloklab qo'yishi** mumkin — natijada bot shu vaqt ichida boshqa hech qanday foydalanuvchiga javob bera olmay qoladi. Django bu xavfli holatni oldindan sezib, aniq xato bilan to'xtatadi — "sokin" ishlab, keyin production'da tushunarsiz sekinlik yoki qulflanishlar berish o'rniga.

### Diqqat: QuerySet yaratish va uni bajarish orasidagi farq

Muhim nozik joy: `Product.objects.filter(is_active=True)` qatorining **o'zi** hali DB'ga murojaat qilmaydi — bu **lazy** (kechiktirilgan) operatsiya, faqat "reja" tuzadi. Xatolik faqat QuerySet **haqiqatan bajarilganda** (iteratsiya qilinganda, `.first()`, `.count()` va h.k. chaqirilganda) yuzaga keladi. Shuning uchun QuerySet yaratishning o'zi xavfsiz, lekin uni **noto'g'ri** (sync) usulda bajarish xato beradi.

### Ikki yechim bor

**1. Tavsiya etiladigan: `a`-prefiksli metodlar** (22-darsda ko'rgan):

```python
products = [p async for p in Product.objects.filter(is_active=True).aiterator()]
```

**2. Agar `a`-prefiksli muqobil hali mavjud emas bo'lsa** (masalan, murakkab `bulk_update` yoki tranzaksiya bloki — Django async ORM'da tranzaksiyalar hali to'liq qo'llab-quvvatlanmaydi), uni **alohida sinxron funksiyaga** chiqarib, `sync_to_async` bilan o'rang:

```python
from asgiref.sync import sync_to_async
from django.db import transaction


def _create_order_with_transaction(user, product, quantity):
    with transaction.atomic():
        order = Order.objects.create(user=user, product=product, quantity=quantity)
        Product.objects.filter(pk=product.pk).update(stock=product.stock - quantity)
        return order


@router.message(...)
async def some_handler(message: Message):
    order = await sync_to_async(_create_order_with_transaction)(user, product, 2)
```

`sync_to_async` — sinxron funksiyani alohida oqim (thread)da ishga tushiradi, natijani esa `await` orqali asinxron dunyoga qaytaradi. Bu — sinxron va asinxron kod orasidagi "ko'prik".

### Qaysi yechimni qachon tanlash

| Holat | Yechim |
|---|---|
| Oddiy `get`/`create`/`filter`/`count` kabi operatsiyalar | `a`-prefiksli metod (`aget`, `acreate` va h.k.) |
| Bir nechta operatsiyani **atomik** (bari yoki hech biri) bajarish kerak (`transaction.atomic()`) | `sync_to_async` bilan o'ralgan alohida funksiya |
| `bulk_create`, `bulk_update` kabi hali async muqobili yo'q metodlar | `sync_to_async` bilan o'ralgan alohida funksiya |
| Murakkab, ko'p qatorli biznes mantiq (validatsiya + bir nechta model bilan ishlash) | `sync_to_async` bilan o'ralgan alohida funksiya — kodni ham tushunarli saqlaydi |

## Amaliy misol

To'liq buyurtma yaratish jarayoni — ombordan kamaytirish bilan birga, tranzaksiya ichida:

```python
# apps/bot/services.py
from asgiref.sync import sync_to_async
from django.db import transaction
from apps.shop.models import Order, Product, TelegramUser


def _create_order_atomic(telegram_id: int, product_id: int, quantity: int):
    """
    Bu funksiya TO'LIQ SINXRON — u sync_to_async orqali chaqiriladi.
    Ichida transaction.atomic() ishlatilgani uchun, agar biror qadam
    muvaffaqiyatsiz bo'lsa, HAMMA o'zgarish bekor qilinadi (rollback).
    """
    with transaction.atomic():
        user = TelegramUser.objects.get(telegram_id=telegram_id)
        product = Product.objects.select_for_update().get(pk=product_id)   # qulflab olish — parallel buyurtmalardan himoya

        if product.stock < quantity:
            raise ValueError("Omborda yetarli mahsulot yo'q")

        product.stock -= quantity
        product.save()

        order = Order.objects.create(user=user, product=product, quantity=quantity)
        return order


async def create_order(telegram_id: int, product_id: int, quantity: int):
    return await sync_to_async(_create_order_atomic)(telegram_id, product_id, quantity)
```

```python
# apps/bot/handlers/user.py ichida ishlatish
from apps.bot.services import create_order

@router.message(OrderState.quantity)
async def process_quantity(message: Message, state: FSMContext):
    data = await state.get_data()
    try:
        order = await create_order(
            telegram_id=message.from_user.id,
            product_id=data["product_id"],
            quantity=int(message.text),
        )
        await message.answer(f"✅ Buyurtma #{order.pk} qabul qilindi!")
    except ValueError as e:
        await message.answer(f"❌ {e}")
    await state.clear()
```

Bu misolda: biznes mantiq (`_create_order_atomic`) — oddiy, tushunarli, **sinxron** Python funksiyasi, xuddi Django view ichida yozilgandek; `create_order` — uni async dunyoga "ochib beruvchi" nozik qatlam. Bu ajratish kodni ham tushunarli, ham xavfsiz qiladi.

## Keng tarqalgan xatolar

**Xato 1:** `sync_to_async`ni har bir kichik ORM chaqiruviga alohida-alohida qo'llash.
❌ `user = await sync_to_async(TelegramUser.objects.get)(telegram_id=id); product = await sync_to_async(Product.objects.get)(pk=pid)` — bu ishlaydi, lekin nomaqbul: har biri alohida thread band qiladi, va agar orada tranzaksiya kerak bo'lsa, ular **bir xil tranzaksiyada bo'lolmaydi**.
✅ To'g'ri: agar bir nechta operatsiya bog'liq bo'lsa (ayniqsa tranzaksiya kerak bo'lsa), ularni **bitta** sinxron funksiyaga jamlang va shu funksiyaning **o'zini** bir marta `sync_to_async` bilan o'rang (yuqoridagi misoldagi kabi).

**Xato 2:** `SynchronousOnlyOperation` xatosini ko'rib, uni "tushunmasdan" `a`-prefiks qo'shib "tuzatishga" urinish.
❌ `Product.objects.select_for_update()` kabi metodlarning `a`-prefiksli versiyasi mavjud emas — `aselect_for_update()` deb yozish import xatosi beradi.
✅ To'g'ri: agar metodning `a`-prefiksli versiyasi mavjud emasligini bilsangiz (Django hujjatidan tekshiring), darhol `sync_to_async` yechimiga o'ting — har doim ham "a" qo'shish yordam bermaydi.

**Xato 3:** `select_for_update()`ni tranzaksiyasiz ishlatish.
❌ `select_for_update()` faqat `transaction.atomic()` bloki **ichida** ma'noga ega — aks holda Django xato beradi (`TransactionManagementError`).
✅ To'g'ri: `select_for_update()` har doim `with transaction.atomic():` bloki ichida chaqirilishi kerak — yuqoridagi `_create_order_atomic` namunasidagi kabi.

## Mashq/topshiriq

**(Oson)** Handler ichida ataylab `for p in Product.objects.all():` (sinxron, `a`-prefikssiz) yozib, `SynchronousOnlyOperation` xatosini o'z ko'zingiz bilan ko'ring. Keyin uni `aiterator()` bilan tuzating.

**(O'rtacha)** `apps/bot/services.py`ga `_update_user_phone(telegram_id, phone)` nomli sinxron funksiya yozing (`TelegramUser.objects.filter(telegram_id=telegram_id).update(phone_number=phone)`), va uni `sync_to_async` orqali async handlerdan chaqiring.

**(Qiyin)** `Order`ni bekor qilish (`cancel_order`) funksiyasini yozing — bu tranzaksiya ichida: (1) buyurtma holatini `"cancelled"`ga o'zgartirsin, (2) mos mahsulotning `stock`ini `quantity` miqdoriga oshirsin (F() ishlatib, 13-darsdagi bilim). Nega bu ikki amal **albatta** bitta tranzaksiyada bo'lishi kerakligini (agar ikkinchisi muvaffaqiyatsiz bo'lsa, birinchisi ham bekor qilinishi kerakligini) tushuntirib bering.

<details>
<summary>Javoblarni ko'rish</summary>

1. Sinxron `for` sikli `SynchronousOnlyOperation: You cannot call this from an async context` xatosini berishi kerak; `aiterator()` bilan almashtirilgach, xato yo'qoladi.
2. `def _update_user_phone(telegram_id, phone): TelegramUser.objects.filter(telegram_id=telegram_id).update(phone_number=phone)`; handlerda `await sync_to_async(_update_user_phone)(message.from_user.id, message.contact.phone_number)`.
3. `def _cancel_order_atomic(order_id): with transaction.atomic(): order = Order.objects.select_for_update().get(pk=order_id); order.status = Order.Status.CANCELLED; order.save(); Product.objects.filter(pk=order.product_id).update(stock=F("stock") + order.quantity)`. Ikkala amal bitta tranzaksiyada bo'lishi shart, chunki agar status yangilanib, lekin stock yangilanmasa (yoki aksincha), ma'lumotlar bazasi **nomuvofiq holatga** tushib qoladi — masalan, buyurtma bekor qilingan, lekin mahsulot hali "band" holida qolib ketadi, bu esa keyingi hisob-kitoblarni buzadi.

</details>

## Qisqacha xulosa

`SynchronousOnlyOperation` xatosi — Django'ning async handler ichida sinxron DB operatsiyasi bajarilishini oldindan sezib, event loop'ni bloklashning oldini oluvchi himoya mexanizmi; buni hal qilishning ikki yo'li bor — oddiy operatsiyalar uchun `a`-prefiksli ORM metodlari (tavsiya etiladi), murakkab, ko'p qadamli yoki tranzaksiya talab qiladigan operatsiyalar uchun esa butun mantiqni **bitta** sinxron funksiyaga jamlab, uni `sync_to_async` bilan o'rash — bu yondashuv kodni ham tushunarli, ham xavfsiz saqlaydi.
