# PostgreSQL ulanishini boshqarish va async ORM asoslari

## Bu darsda nimalarni o'rganasiz

- Aiogram'ning uzluksiz ishlashi PostgreSQL ulanishiga qanday ta'sir qilishini tushuntira olasiz
- `DjangoDBMiddleware`ni yozib, botga ulay olasiz
- Django'ning `a`-prefiksli asinxron ORM metodlarini to'g'ri qo'llay olasiz
- Handler ichida tovarlar ro'yxatini xavfsiz, async tarzda ola olasiz

## Nazariy qism

### Muammo: Aiogram uzluksiz, Django DB ulanishini "so'rov oxirida" yopadi

Bu — ko'p qo'llanmalarda e'tibordan chetda qoladigan, lekin production'da botning **"vaqti-vaqti bilan o'lib qolishiga"** sabab bo'ladigan muhim nozik joy.

Django odatiy holatda har bir HTTP so'rovi tugagach, DB ulanishini yopadi (yoki `CONN_MAX_AGE` sozlamasiga qarab qayta ishlatadi) — bu **so'rov-javob** sikliga mo'ljallangan xatti-harakat. Aiogram esa **uzluksiz** asyncio tsiklida ishlaydi — bu yerda "so'rov tugashi" degan tushuncha yo'q, bot doimo ishlab turadi. Natijada, agar PostgreSQL ulanishni vaqt bo'yicha uzib qo'ysa (masalan, tarmoq tanaffusi yoki DB qayta ishga tushishi) yoki uzoq vaqt operatsiya bo'lmasa, bot eskirgan ("stale") ulanish orqali so'rov yuborishga urinib, xatoga uchraydi.

### Yechim: DjangoDBMiddleware

Har bir yangilikdan oldin/keyin Django'ning `close_old_connections()` funksiyasini chaqiruvchi middleware yozamiz — bu aynan Django o'zi har bir web-so'rovda **avtomatik** bajaradigan ishni, bot uchun "qo'lda" takrorlaydi:

```python
# apps/bot/middlewares.py
from typing import Callable, Dict, Any, Awaitable

from aiogram import BaseMiddleware
from aiogram.types import TelegramObject
from asgiref.sync import sync_to_async
from django.db import close_old_connections


class DjangoDBMiddleware(BaseMiddleware):
    """
    Aiogram uzluksiz asyncio tsiklida ishlagani uchun, Django'ning
    "har bir so'rov oxirida ulanishni yopish" mexanizmi ishlamaydi.
    Shu middleware har bir yangilikdan oldin/keyin eskirgan yoki
    uzilgan PostgreSQL ulanishlarini tozalab turadi.
    """

    async def __call__(
        self,
        handler: Callable[[TelegramObject, Dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: Dict[str, Any],
    ) -> Any:
        await sync_to_async(close_old_connections)()
        try:
            return await handler(event, data)
        finally:
            await sync_to_async(close_old_connections)()
```

> ⚠️ `close_old_connections` — sinxron (sync) Django funksiyasi. Uni async middleware ichida **to'g'ridan-to'g'ri** emas, `sync_to_async(...)()` orqali chaqiramiz — bu keyingi darsda tushuntiriladigan qoidaning aynan o'zi: **sync kodni async dunyoda chaqirish uchun har doim `sync_to_async` kerak.**

Bu middleware `dp.update.middleware(...)` orqali **barcha turdagi yangiliklarga** (xabar, callback va h.k.) ulanadi — 25-darsdagi `runbot.py`da ko'rasiz.

### Async ORM — Django 4.1+ ning asinxron metodlari

Django ORM'ga `a` prefiksli asinxron metodlar qo'shilgan: `aget()`, `acreate()`, `aget_or_create()`, `aupdate_or_create()`, `adelete()`, `aiterator()`, `acount()`, `aexists()` va h.k. **Har doim shularni ishlating** — oddiy `get()`, `create()`, `filter().first()` kabi sinxron metodlarni to'g'ridan-to'g'ri `async def` handler ichida chaqirish xatoga olib keladi (23-darsda batafsil).

**Eng ko'p ishlatiladigan async ORM metodlari:**

| Sinxron (❌ async handlerda ishlatmang) | Asinxron muqobili (✅) |
|---|---|
| `Model.objects.get(...)` | `await Model.objects.aget(...)` |
| `Model.objects.create(...)` | `await Model.objects.acreate(...)` |
| `Model.objects.get_or_create(...)` | `await Model.objects.aget_or_create(...)` |
| `for obj in queryset:` | `async for obj in queryset.aiterator():` |
| `queryset.first()` | `await queryset.afirst()` |
| `queryset.count()` | `await queryset.acount()` |
| `instance.save()` | `await instance.asave()` |
| `instance.delete()` | `await instance.adelete()` |

### Birinchi handler — /start va /shop

```python
# apps/bot/handlers/user.py
from aiogram import Router
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.filters.callback_data import CallbackData

from apps.shop.models import TelegramUser, Product

router = Router(name="user")


@router.message(CommandStart())
async def cmd_start(message: Message):
    # aget_or_create — Django ORM'ning asinxron "topish yoki yaratish" metodi
    user, created = await TelegramUser.objects.aget_or_create(
        telegram_id=message.from_user.id,
        defaults={
            "full_name": message.from_user.full_name,
            "username": message.from_user.username or "",
        },
    )
    if created:
        await message.answer(f"Xush kelibsiz, {user.full_name}! Siz ro'yxatdan o'tdingiz.")
    else:
        await message.answer(f"Yana xush kelibsiz, {user.full_name}!")


class ProductCallback(CallbackData, prefix="product"):
    id: int


@router.message(Command("shop"))
async def cmd_shop(message: Message):
    # QuerySet'ni QURISH (filter) — DB'ga hali murojaat qilmaydi, sinxron xavfsiz.
    # Uni HAQIQIY bajarish (iteratsiya) — aynan shu joyda async kerak bo'ladi.
    products = [p async for p in Product.objects.filter(is_active=True).aiterator()]

    if not products:
        await message.answer("Hozircha tovarlar mavjud emas.")
        return

    builder = InlineKeyboardBuilder()
    for product in products:
        builder.button(
            text=f"{product.name} — {product.price} so'm",
            callback_data=ProductCallback(id=product.pk),
        )
    builder.adjust(1)

    await message.answer("🛍 Mavjud tovarlar:", reply_markup=builder.as_markup())
```

`[p async for p in queryset.aiterator()]` — bu Python'ning **asinxron ro'yxat kompilyatsiyasi** (async list comprehension) sintaksisi, `aiterator()` bilan birga ishlatilib, katta natijalarni xotirani tejab, oqim (stream) sifatida qayta ishlaydi.

## Amaliy misol

Handlerlarni Router orqali tashkil qilish va ularni tekshirish uchun oddiy shell sinovi:

```python
# apps/bot/handlers/__init__.py — bo'sh, faqat papkani Python package qiladi
```

```python
python manage.py shell
```
```python
>>> import asyncio
>>> from apps.shop.models import Product

>>> async def test_fetch():
...     products = [p async for p in Product.objects.filter(is_active=True).aiterator()]
...     return products
...
>>> asyncio.run(test_fetch())
[<Product: Simsiz quloqchin>]
```

Bu — `aiterator()` va async list comprehension'ning haqiqatan ishlashini, botning o'zisiz ham, shell orqali tekshirish usuli.

## Keng tarqalgan xatolar

**Xato 1:** `DjangoDBMiddleware`ni yozib, lekin uni `dp`ga ulashni unutish (25-darsgacha).
❌ Middleware kodi to'g'ri yozilgan, lekin `runbot.py`da `dp.update.middleware(DjangoDBMiddleware())` chaqirilmasa, u hech qachon ishga tushmaydi.
✅ To'g'ri: middleware'ni yozgach, uni albatta `Dispatcher`ga ulashni unutmang (bu 25-darsda ko'rsatiladi) — kodning o'zi yetarli emas, uni "ro'yxatga olish" ham kerak.

**Xato 2:** `close_old_connections()`ni to'g'ridan-to'g'ri (`sync_to_async`siz) chaqirish.
❌ `async def __call__(self, ...): close_old_connections()` — bu Django'ning sinxron funksiyasini asinxron kontekstda to'g'ridan-to'g'ri chaqiradi, bu esa `SynchronousOnlyOperation` xatosiga olib kelishi mumkin (23-darsda batafsil).
✅ To'g'ri: har doim `await sync_to_async(close_old_connections)()` — sync funksiyani async dunyoga "o'tkazib" chaqiring.

**Xato 3:** `aiterator()`siz, oddiy `for product in Product.objects.filter(...)` yozish.
❌ Bu — sinxron iteratsiya, async handler ichida ishlatilganda xatolikka olib keladi (keyingi darsda ko'rasiz).
✅ To'g'ri: async handler ichida ro'yxat bo'ylab yurish kerak bo'lsa, har doim `async for x in queryset.aiterator():` yoki `[x async for x in queryset.aiterator()]` shaklidan foydalaning.

## Mashq/topshiriq

**(Oson)** `apps/bot/handlers/user.py`da `cmd_start` handlerini yozing va `manage.py shell` orqali (asyncio yordamida, botsiz) `TelegramUser.objects.aget_or_create(...)`ni sinab ko'ring.

**(O'rtacha)** `DjangoDBMiddleware`ni yozib, uni alohida test funksiyasida (`asyncio.run` orqali, soxta `handler` va `event` bilan) chaqirib, `close_old_connections` ikki marta (oldin va keyin) chaqirilishini tasdiqlang (masalan, `print` qo'shib kuzatish orqali).

**(Qiyin)** `cmd_shop` handleriga o'xshash, lekin `Order`larni (`TelegramUser`ning barcha buyurtmalarini) `aiterator()` orqali ko'rsatuvchi `cmd_my_orders` handlerini yozing — bu yerda `select_related("product")`ni ham (13-darsdagi bilim) qo'shib, N+1 muammosining oldini oling. Nega async ORM'da ham `select_related`/`prefetch_related` texnikalari muhimligini tushuntirib bering.

<details>
<summary>Javoblarni ko'rish</summary>

1. Shell orqali: `asyncio.run(TelegramUser.objects.aget_or_create(telegram_id=111, defaults={"full_name": "Test"}))` — natija `(<TelegramUser: ...>, True)` bo'lishi kerak.
2. Middleware to'g'ri chaqirilganda, konsolda "oldin" va "keyin" chiqishlar ikkalasi ham ko'rinishi, va ular orasida `handler(event, data)` bajarilishi kerak.
3. `orders = [o async for o in Order.objects.filter(user__telegram_id=message.from_user.id).select_related("product").aiterator()]`. `select_related`/`prefetch_related` async ORM'da ham xuddi sync ORM'dagi kabi muhim, chunki N+1 muammosi optimallashtirish texnikasi emas — bu SQL darajasidagi masala, sync yoki async bo'lishidan qat'i nazar bir xil qoladi; farq faqat so'rovni **qanday chaqirish** (await bilan yoki bevosita) kerakligida.

</details>

## Qisqacha xulosa

Aiogram'ning uzluksiz asyncio tsikli Django'ning "har so'rov oxirida DB ulanishini yopish" mexanizmi bilan mos kelmaydi, shu sababli `DjangoDBMiddleware` yozilib, u har bir yangilikdan oldin/keyin `sync_to_async(close_old_connections)()` chaqiradi — bu botni uzoq muddat ishlaganda "PostgreSQL bilan aloqani yo'qotishdan" saqlaydi; handlerlar ichida esa Django ORM'ning `a`-prefiksli metodlari (`aget`, `acreate`, `aget_or_create`, `aiterator` va h.k.) ishlatilishi shart — oddiy sinxron metodlar async handler ichida to'g'ridan-to'g'ri ishlamaydi.
