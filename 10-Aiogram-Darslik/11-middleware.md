# 11. Middleware

## Bu darsda nimalarni o'rganasiz
- Middleware nima va u qachon ishlatiladi
- Outer va inner middleware farqi
- Anti-flood (throttling) middleware yozish
- Dependency Injection — DB session'ni handlerga avtomatik uzatish

## Nazariy qism

### Middleware nima?
Middleware — handlerga yetib borishidan **oldin** (yoki keyin) ishga tushadigan "oraliq qatlam". Django'da middleware tushunchasini bilsangiz, bu deyarli bir xil g'oya: har bir so'rov (bu yerda — Telegram update) handlerga yetib borishidan oldin qandaydir umumiy ishni bajarish (loglash, tekshirish, ma'lumot qo'shish).

Oddiy tashbeh: middleware — bu ofis binosi kirish eshigidagi **qorovul**. Har bir kiruvchi (xabar) avval undan o'tadi — qorovul uni tekshirishi, ro'yxatga olishi yoki kirishini taqiqlashi mumkin, keyingina ichkariga (handlerga) o'tkaziladi.

### Ikki turi
- **Outer middleware** — filterlardan **oldin** ishlaydi, har doim chaqiriladi (filtr mos kelmasa ham).
- **Inner middleware** (odatiy) — filterlar mos kelgandan **keyin**, handlerdan oldin ishlaydi.

Aksariyat holatlarda oddiy (inner) middleware yetarli.

### Middleware yaratish qolipi
Har qanday middleware — `BaseMiddleware`dan meros oluvchi klass:

```python
from aiogram import BaseMiddleware
from aiogram.types import Message
from typing import Callable, Dict, Any, Awaitable

class MyMiddleware(BaseMiddleware):
    async def __call__(
        self,
        handler: Callable[[Message, Dict[str, Any]], Awaitable[Any]],
        event: Message,
        data: Dict[str, Any]
    ) -> Any:
        # === Handlerdan OLDIN bajariladigan kod ===
        print("Xabar keldi!")

        result = await handler(event, data)  # handlerni chaqirish

        # === Handlerdan KEYIN bajariladigan kod ===
        print("Handler tugadi!")

        return result
```

Ulash:
```python
dp.message.middleware(MyMiddleware())
```

### 1. Anti-flood (throttling) middleware
Foydalanuvchi bir necha soniyada o'nlab xabar yuborib, botni "buzishi"ning oldini olish:

```python
from cachetools import TTLCache

class ThrottlingMiddleware(BaseMiddleware):
    def __init__(self, rate_limit: float = 0.7):
        self.cache = TTLCache(maxsize=10_000, ttl=rate_limit)

    async def __call__(self, handler, event: Message, data: Dict[str, Any]) -> Any:
        if event.chat.id in self.cache:
            return  # tezkor takroriy xabarni jimgina e'tiborsiz qoldiramiz
        self.cache[event.chat.id] = True
        return await handler(event, data)

dp.message.middleware(ThrottlingMiddleware(rate_limit=0.7))
```

Bu middleware — bitta foydalanuvchi 0.7 soniyada bir martadan ko'p xabar yubora olmasligini ta'minlaydi.

### 2. Dependency Injection — DB session'ni handlerga uzatish
Bu — aiogram 3'ning eng qulay imkoniyatlaridan biri: middleware orqali handlerga tayyor obyekt (masalan, DB session) "avtomatik" uzatish mumkin:

```python
class DbSessionMiddleware(BaseMiddleware):
    def __init__(self, session_pool):
        self.session_pool = session_pool

    async def __call__(self, handler, event, data: Dict[str, Any]):
        async with self.session_pool() as session:
            data["session"] = session  # endi har bir handler shu argumentni "sehrli" oladi
            return await handler(event, data)

dp.update.middleware(DbSessionMiddleware(session_pool=async_session))
```

Handlerda ishlatish — hech qanday qo'shimcha kod kerak emas, aiogram avtomatik uzatadi:
```python
@dp.message(Command("me"))
async def cmd_me(message: Message, session):  # 'session' avtomatik keladi!
    user = await session.get(User, message.from_user.id)
    await message.answer(f"Siz: {user.full_name}")
```

Bu texnika sizning Django + PostgreSQL loyihalaringizda ham juda foydali bo'ladi — masalan, har bir handlerga tayyor DB ulanishini shu tarzda "in'yeksiya" qilishingiz mumkin.

### 3. Logging middleware
```python
import logging

class LoggingMiddleware(BaseMiddleware):
    async def __call__(self, handler, event: Message, data):
        logging.info(f"{event.from_user.id}: {event.text}")
        return await handler(event, data)
```

## Amaliy misol
Bir nechta middleware'ni birga ulash:

```python
import logging
from aiogram import Bot, Dispatcher

logging.basicConfig(level=logging.INFO)

bot = Bot(token="TOKEN")
dp = Dispatcher()

dp.message.middleware(LoggingMiddleware())
dp.message.middleware(ThrottlingMiddleware(rate_limit=0.5))

# Endi har bir xabar avval loglanadi, keyin flood tekshiriladi, so'ng handlerga yetadi
```

> 📌 Middleware'lar ulangan **tartibda** ishlaydi — birinchi ulangan birinchi bajariladi.

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **`return await handler(event, data)` ni yozishni unutish** — bu holda handler umuman chaqirilmaydi, bot "jim" qoladi.
- **Middleware'ni noto'g'ri obyektga ulash**: `dp.message.middleware(...)` — faqat xabarlar uchun, `dp.callback_query.middleware(...)` — faqat callback uchun, `dp.update.middleware(...)` — barcha update turlari uchun (eng keng qamrovli).
- **Og'ir operatsiyalarni (masalan, uzoq davom etadigan tarmoq so'rovi) har bir xabar uchun middleware'da bajarish** — bu botni sekinlashtiradi. Middleware yengil va tez bo'lishi kerak.
- **TTLCache o'lchamini juda kichik qilib qo'yish** — ko'p foydalanuvchili botda xotira yetishmovchiligi yoki noto'g'ri throttling'ga olib kelishi mumkin.

## Mashq/topshiriq
1. **(Oson)** Har bir kelgan xabarni konsolga (`from_user.id` va `text` bilan) chop etuvchi oddiy LoggingMiddleware yozing.
2. **(O'rtacha)** Faqat ma'lum ID'lar ro'yxatidagi foydalanuvchilarga botdan foydalanishga ruxsat beruvchi (qolganlariga "Kechirasiz, sizga ruxsat yo'q" deb javob beruvchi) middleware yozing.
3. **(Qiyin)** Yuqoridagi ThrottlingMiddleware'ni shunday o'zgartiring — flood qilgan foydalanuvchiga jim qolish o'rniga "Iltimos, biroz sekinroq yozing 🐢" degan ogohlantirish xabari yuborilsin (lekin har safar emas, masalan 5 soniyada bir marta).

## Qisqacha xulosa
Middleware — har bir xabar handlerga yetib borishidan oldin (yoki keyin) ishlaydigan umumiy qatlam — loglash, flood'dan himoya, ruxsatlarni tekshirish va DB session kabi obyektlarni handlerlarga avtomatik uzatish uchun ishlatiladi. `BaseMiddleware`dan meros olinadi, `__call__` metodida `await handler(event, data)` chaqirilishi shart. Dependency Injection texnikasi — middleware'ning eng kuchli imkoniyatlaridan biri, u kodni ancha toza va takrorlanishsiz qiladi.
