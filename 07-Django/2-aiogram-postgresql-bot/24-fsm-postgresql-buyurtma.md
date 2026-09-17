# FSM + PostgreSQL: bosqichma-bosqich buyurtma olish

## Bu darsda nimalarni o'rganasiz

- Aiogram FSM'ni Django async ORM bilan birga qo'llay olasiz
- Callback orqali tovar tanlash va FSM holatiga o'tishni tashkil qila olasiz
- Foydalanuvchi kiritgan ma'lumotni tekshirib, noto'g'ri bo'lsa qayta so'ray olasiz
- FSM va DB'ning har biri qaysi vazifani bajarishini aniq ажrata olasiz

## Nazariy qism

### FSM va DB — ikki xil "xotira"

22-darsda oddiy "bitta bosishda buyurtma" ko'rgan edingiz. Endi foydalanuvchidan miqdorni so'rab, keyin PostgreSQL'ga yozadigan **to'liq FSM jarayonini** quramiz. Bu yerda muhim tushuncha: FSM (Finite State Machine, holatlar mashinasi) va DB — ikkita **butunlay boshqa** vazifani bajaradi:

| | FSM (aiogram) | DB (PostgreSQL, Django ORM) |
|---|---|---|
| Nima saqlaydi | **Vaqtinchalik** muloqot holati (foydalanuvchi qaysi bosqichda) | **Doimiy** ma'lumot (buyurtma, tovar, foydalanuvchi) |
| Qachon o'chadi | Jarayon tugagach (`state.clear()`) yoki bot qayta ishga tushganda (agar `MemoryStorage` bo'lsa) | Hech qachon, faqat aniq `delete()` chaqirilganda |
| Kim boshqaradi | Aiogram | Django ORM |

FSM — "hozir foydalanuvchi nima kutyapti" degan savolga javob beradi (masalan, "miqdor kiritishini kutyapmiz"), DB esa "yakuniy natija nima bo'lishi kerak" ni saqlaydi.

### Holatlarni belgilash

```python
# apps/bot/states.py
from aiogram.fsm.state import StatesGroup, State

class OrderState(StatesGroup):
    quantity = State()
```

Agar buyurtma jarayoni ko'proq bosqichdan iborat bo'lsa (masalan, manzil, telefon raqami ham so'ralsa), shunchaki yangi `State()` qo'shiladi: `address = State()`, `phone = State()` va h.k.

### To'liq jarayon — tovar tanlashdan buyurtma yaratishgacha

```python
# apps/bot/handlers/user.py ga qo'shimcha
from aiogram.fsm.context import FSMContext
from apps.shop.models import TelegramUser, Product, Order
from apps.bot.states import OrderState


@router.callback_query(ProductCallback.filter())
async def product_selected(call: CallbackQuery, callback_data: ProductCallback, state: FSMContext):
    product = await Product.objects.aget(pk=callback_data.id)
    await state.update_data(product_id=product.pk)   # FSM "xotirasiga" vaqtinchalik ma'lumot yozish
    await state.set_state(OrderState.quantity)         # keyingi bosqichga o'tish

    await call.answer()   # Telegram'ga "tugma bosildi, kutish belgisini olib tashla" signali
    await call.message.answer(f"«{product.name}» — nechta dona buyurtma qilmoqchisiz?")


@router.message(OrderState.quantity)
async def process_quantity(message: Message, state: FSMContext):
    if not message.text.isdigit() or int(message.text) < 1:
        await message.answer("Iltimos, musbat butun son kiriting:")
        return   # state o'zgarmaydi — hali "quantity" bosqichida qolamiz, qayta so'raymiz

    data = await state.get_data()
    product = await Product.objects.aget(pk=data["product_id"])
    user = await TelegramUser.objects.aget(telegram_id=message.from_user.id)

    order = await Order.objects.acreate(user=user, product=product, quantity=int(message.text))
    await state.clear()   # jarayon tugadi — FSM holatini tozalash

    await message.answer(
        f"✅ Buyurtma #{order.pk} qabul qilindi!\n"
        f"{product.name} — {order.quantity} dona\n"
        f"Holat: {order.get_status_display()} (admin tasdiqlaydi)"
    )
```

Bu yerda muhim naqsh: **FSM (aiogram'ning o'zi)** — foydalanuvchi bilan muloqot bosqichlarini ("hozir nimani kutamiz") boshqaradi; **Django ORM** — yakuniy natijani PostgreSQL'ga ishonchli saqlashni bajaradi. Ikkala freymvork o'z kuchli tomoni bilan ishlaydi, biri ikkinchisining vazifasini bajarmaydi.

### call.answer() — nega har doim kerak

`@router.callback_query` handlerlarida `call.answer()`ni chaqirish **deyarli har doim** zarur — bu Telegram'ga "tugma bosilgani qabul qilindi" signalini beradi, aks holda foydalanuvchi tugmani bossa, Telegram interfeysida tugma "yuklanmoqda" holatida (soat belgisi bilan) bir necha soniya osilib qoladi.

### Noto'g'ri kiritilgan ma'lumotni qayta so'rash

`process_quantity`da, agar foydalanuvchi son o'rniga matn kiritsa, funksiya oddiygina `return` qiladi — `state.set_state()` chaqirilmagani uchun, foydalanuvchi hamon `OrderState.quantity` holatida qoladi, va Aiogram uning **keyingi** xabarini yana shu `process_quantity` handleriga yuboradi. Bu — qo'shimcha kod yozmasdan, "to'g'ri javob kelguncha qayta so'rash" mantig'ini oddiy tarzda amalga oshiradi.

## Amaliy misol

To'liq, ishlaydigan FSM zanjiri — tovar ro'yxatidan tortib, tasdiqlangan buyurtmagacha:

```python
# apps/bot/states.py
from aiogram.fsm.state import StatesGroup, State

class OrderState(StatesGroup):
    quantity = State()
    confirm = State()   # qo'shimcha bosqich — tasdiqlash


# apps/bot/handlers/user.py
from aiogram.fsm.context import FSMContext
from aiogram.utils.keyboard import InlineKeyboardBuilder
from apps.shop.models import TelegramUser, Product, Order
from apps.bot.states import OrderState


@router.callback_query(ProductCallback.filter())
async def product_selected(call: CallbackQuery, callback_data: ProductCallback, state: FSMContext):
    product = await Product.objects.aget(pk=callback_data.id)
    await state.update_data(product_id=product.pk, product_name=product.name, product_price=str(product.price))
    await state.set_state(OrderState.quantity)
    await call.answer()
    await call.message.answer(f"«{product.name}» — nechta dona buyurtma qilmoqchisiz?")


@router.message(OrderState.quantity)
async def process_quantity(message: Message, state: FSMContext):
    if not message.text.isdigit() or int(message.text) < 1:
        await message.answer("Iltimos, musbat butun son kiriting:")
        return

    await state.update_data(quantity=int(message.text))
    data = await state.get_data()
    total = int(message.text) * float(data["product_price"])

    builder = InlineKeyboardBuilder()
    builder.button(text="✅ Tasdiqlayman", callback_data="confirm_order")
    builder.button(text="❌ Bekor qilish", callback_data="cancel_order")

    await state.set_state(OrderState.confirm)
    await message.answer(
        f"«{data['product_name']}» — {message.text} dona\nJami: {total:.0f} so'm\nTasdiqlaysizmi?",
        reply_markup=builder.as_markup(),
    )


@router.callback_query(OrderState.confirm, lambda c: c.data == "confirm_order")
async def confirm_order(call: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    product = await Product.objects.aget(pk=data["product_id"])
    user = await TelegramUser.objects.aget(telegram_id=call.from_user.id)

    order = await Order.objects.acreate(user=user, product=product, quantity=data["quantity"])
    await state.clear()

    await call.answer()
    await call.message.edit_text(f"✅ Buyurtma #{order.pk} qabul qilindi!")


@router.callback_query(OrderState.confirm, lambda c: c.data == "cancel_order")
async def cancel_order_flow(call: CallbackQuery, state: FSMContext):
    await state.clear()
    await call.answer()
    await call.message.edit_text("❌ Buyurtma bekor qilindi.")
```

Bu misolda ikkinchi bosqich (`confirm`) qo'shildi — foydalanuvchi miqdorni kiritgach, yakuniy narxni ko'rib, tasdiqlash yoki bekor qilish imkoniga ega bo'ladi, faqat shundan keyin DB'ga yozuv yaratiladi.

## Keng tarqalgan xatolar

**Xato 1:** `state.clear()`ni faqat muvaffaqiyatli yakunlangan jarayonda chaqirib, bekor qilingan holatda unutish.
❌ Foydalanuvchi "❌ Bekor qilish" tugmasini bossa-yu, `state.clear()` chaqirilmasa, u hamon `OrderState.confirm` holatida qolib ketadi va keyingi har qanday xabari noto'g'ri handlerga tushadi.
✅ To'g'ri: FSM jarayonining **har bir** yakuniy nuqtasida (muvaffaqiyatli ham, bekor qilingan ham) `state.clear()`ni chaqirishni unutmang.

**Xato 2:** callback handlerlarida `call.answer()`ni chaqirmaslik.
❌ Foydalanuvchi tugmani bossa, Telegram interfeysida tugma bir necha soniya "yuklanmoqda" holatda qolib turadi — bu tajribani yomonlashtiradi.
✅ To'g'ri: har bir `@router.callback_query` handlerida, iloji boricha eng boshida yoki oxirida, `await call.answer()` chaqiring.

**Xato 3:** FSM orqali olingan ma'lumotni (`state.get_data()`) tekshirmasdan to'g'ridan-to'g'ri ishlatish.
❌ Agar foydalanuvchi biror sabab bilan (masalan, botni qayta ishga tushirilgandan keyin, `MemoryStorage` bilan holat yo'qolgan bo'lsa) `data["product_id"]`ga murojaat qilsa, `KeyError` xatosi chiqishi mumkin.
✅ To'g'ri: production kodda `data.get("product_id")` va uning `None` bo'lish holatini tekshirib, foydalanuvchiga tushunarli xabar bilan jarayonni qaytadan boshlashni taklif qiling.

## Mashq/topshiriq

**(Oson)** `OrderState`ga yangi `comment = State()` bosqichini qo'shing — buyurtma miqdori kiritilgandan so'ng, foydalanuvchidan ixtiyoriy izoh (masalan, "yetkazib berish vaqti") so'rang, keyin buyurtmani yarating.

**(O'rtacha)** `process_quantity`ga qo'shimcha tekshiruv qo'shing — agar foydalanuvchi juda katta son (masalan, 1000 dan ortiq) kiritsa, "Bu qiymat juda katta, qaytadan kiriting" deb qayta so'rang.

**(Qiyin)** Yuqoridagi "tasdiqlash" bosqichli (`confirm`) misolga, `cancel_order` callback handleriga — bekor qilingan holatni **DB'ga ham** yozib qo'yishni qo'shing (masalan, alohida `CancelledAttempt` modeli yaratib, statistika uchun). Buni to'g'ri, `sync_to_async` yoki `acreate` orqali (23-darsdagi bilim asosida) amalga oshiring, va nega bu ma'lumotni FSM emas, aynan DB'da saqlash to'g'ri qaror ekanini tushuntirib bering.

<details>
<summary>Javoblarni ko'rish</summary>

1. `OrderState.comment = State()` qo'shiladi, `process_quantity`da `state.set_state(OrderState.comment)` ga o'tkaziladi, yangi handler `@router.message(OrderState.comment)` orqali izohni oladi va keyin buyurtma yaratiladi.
2. `if int(message.text) > 1000: await message.answer("Bu qiymat juda katta, qaytadan kiriting:"); return`.
3. `CancelledAttempt.objects.acreate(user_telegram_id=call.from_user.id, product_id=data.get("product_id"))` — `cancel_order_flow` ichida, `state.clear()`dan oldin yoki keyin chaqiriladi. Bu ma'lumotni DB'da saqlash to'g'ri, chunki FSM holati vaqtinchalik va jarayon tugagach (`state.clear()`) yo'qoladi — agar kelajakda "necha marta bekor qilingan" statistikasi kerak bo'lsa, bu faqat **doimiy** saqlashda (DB) mumkin.

</details>

## Qisqacha xulosa

FSM va DB — botda ikkita butunlay boshqa vazifani bajaradi: FSM (aiogram) foydalanuvchi bilan muloqotning **vaqtinchalik** bosqichini ("hozir nima kutilyapti") boshqaradi, Django ORM esa yakuniy, **doimiy** natijani PostgreSQL'ga ishonchli saqlaydi; `state.update_data()`/`state.get_data()` orqali bosqichlar orasida vaqtinchalik ma'lumot uzatiladi, har bir jarayon yakuniy nuqtasida (muvaffaqiyatli yoki bekor qilingan) `state.clear()` chaqirilishi, va har bir callback handlerida `call.answer()` chaqirilishi — botning to'g'ri va silliq ishlashi uchun zarur odatlar.
