# 13. Xatolarni Boshqarish

## Bu darsda nimalarni o'rganasiz
- Nega global xato ushlagich kerak
- `@router.errors()` orqali barcha xatolarni bitta joyda ushlash
- Eng ko'p uchraydigan Telegram exception turlari
- Ommaviy xabar yuborishda (broadcast) xatolarni to'g'ri boshqarish

## Nazariy qism

### Nega bu muhim?
Har bir handlerni alohida `try/except` bilan o'rash — takrorlanuvchi va unutilishi oson. Aiogram butun bot uchun **yagona, markazlashgan** xato ushlagich yozish imkonini beradi — bu Django'dagi global exception handler'ga o'xshaydi.

Agar xato ushlanmasa, foydalanuvchi hech qanday javob olmaydi (bot "jim qoladi"), bu esa yomon tajriba va aniqlash qiyin bo'lgan muammolarga olib keladi.

### Global error handler yozish

```python
from aiogram import Router
from aiogram.types import ErrorEvent
import logging

router = Router(name="errors")

@router.errors()
async def global_error_handler(event: ErrorEvent):
    logging.exception(f"Xatolik: {event.exception}\nUpdate: {event.update}")
    if event.update.message:
        await event.update.message.answer("⚠️ Kutilmagan xatolik yuz berdi. Keyinroq urinib ko'ring.")
```

Bu handler boshqa routerlar bilan birga `main.py`da ulanadi:
```python
dp.include_router(errors.router)
```

> 📌 Bu router'ni **eng oxirida** ulash yaxshi amaliyot — u faqat boshqa hech qaysi handler ushlamagan xatolarni ushlaydi.

### Eng ko'p uchraydigan Telegram exception turlari

```python
from aiogram.exceptions import (
    TelegramForbiddenError,   # bot bloklangan yoki chatdan chiqarilgan
    TelegramBadRequest,       # noto'g'ri so'rov (masalan, xabar juda uzun)
    TelegramRetryAfter,       # flood-limit — biroz kutish talab qilinadi
    TelegramNotFound,         # chat/xabar topilmadi
)

@dp.message(Command("send_test"))
async def send_test(message: Message, bot: Bot):
    try:
        await bot.send_message(chat_id=999999999, text="test")
    except TelegramForbiddenError:
        await message.answer("❌ Foydalanuvchi botni bloklagan.")
    except TelegramBadRequest as e:
        await message.answer(f"❌ Noto'g'ri so'rov: {e}")
    except TelegramRetryAfter as e:
        await message.answer(f"⏳ {e.retry_after} soniya kutish kerak.")
```

### Broadcast'da xatolarni to'g'ri boshqarish
Barcha foydalanuvchilarga xabar yuborishda ikkita narsani hisobga olish shart: **(1)** foydalanuvchi botni bloklagan bo'lishi mumkin, **(2)** Telegram sekundiga taxminan 30 ta xabar limitini qo'yadi.

```python
import asyncio
from aiogram.exceptions import TelegramForbiddenError, TelegramRetryAfter

async def broadcast(bot: Bot, user_ids: list[int], text: str) -> tuple[int, int]:
    success, blocked = 0, 0
    for user_id in user_ids:
        try:
            await bot.send_message(user_id, text)
            success += 1
        except TelegramForbiddenError:
            blocked += 1  # foydalanuvchi botni bloklagan — statistikaga yozib, davom etamiz
        except TelegramRetryAfter as e:
            await asyncio.sleep(e.retry_after)  # Telegram qancha kutish kerakligini o'zi aytadi
            await bot.send_message(user_id, text)
            success += 1
        await asyncio.sleep(0.05)  # ~20 xabar/soniya — limitdan xavfsiz chegara
    return success, blocked
```

### Alohida handlerda mahalliy try/except
Global handler — "so'nggi himoya chizig'i". Ba'zan aniq bir xatoni **shu yerning o'zida**, foydalanuvchiga aniqroq javob berish uchun ushlash kerak:

```python
@dp.message(Command("weather"))
async def get_weather(message: Message):
    try:
        # tashqi API'ga so'rov (masalan, ob-havo xizmati)
        data = await fetch_weather_api()
        await message.answer(f"Harorat: {data['temp']}°C")
    except TimeoutError:
        await message.answer("⏳ Ob-havo xizmati javob bermayapti, keyinroq urinib ko'ring.")
    except Exception as e:
        logging.exception("Ob-havo olishda xato")
        await message.answer("❌ Nimadir noto'g'ri ketdi.")
```

## Amaliy misol
To'liq xato boshqaruv tizimi bilan mini-bot:

```python
import logging
from aiogram import Router
from aiogram.types import ErrorEvent
from aiogram.exceptions import TelegramForbiddenError

logging.basicConfig(level=logging.INFO, filename="bot.log")  # loglarni faylga yozish

errors_router = Router(name="errors")

@errors_router.errors()
async def on_error(event: ErrorEvent):
    logging.exception(f"Xato turi: {type(event.exception).__name__}, xabar: {event.exception}")

    # Foydalanuvchiga xabar berish, lekin faqat u bilan aloqa saqlangan bo'lsa
    if event.update.message:
        try:
            await event.update.message.answer("⚠️ Xatolik yuz berdi, tez orada tuzatamiz.")
        except TelegramForbiddenError:
            pass  # foydalanuvchi botni bloklagan — xabar yuborishga urinmaymiz
```

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **Global error handler yozmaslik** — biror handlerda kutilmagan xato bo'lsa, bot "jim" qolib, foydalanuvchi hech narsa tushunmaydi.
- **`except Exception:` bilan hamma narsani "yutib yuborish"** — xato haqida hech qanday log qoldirmasdan bostirish, keyinchalik muammoni topishni deyarli imkonsiz qiladi. Har doim `logging.exception(...)` bilan loglang.
- **Broadcast'da `TelegramForbiddenError`ni ushlamaslik** — bitta bloklagan foydalanuvchi butun broadcast jarayonini to'xtatib qo'yishi mumkin.
- **Flood-limit (`TelegramRetryAfter`)ni e'tiborsiz qoldirish** — Telegram vaqtincha botni bloklab qo'yishi mumkin.

## Mashq/topshiriq
1. **(Oson)** Global error handler yozing va uni ataylab xato beradigan handler bilan sinab ko'ring (masalan, `1/0` yozib).
2. **(O'rtacha)** `/broadcast <matn>` komandasi yozing — u oldindan tayyorlangan foydalanuvchi ID'lar ro'yxatiga xabar yuboradi va oxirida "X ta yuborildi, Y ta bloklangan" deb hisobot beradi.
3. **(Qiyin)** Loglarni konsol o'rniga alohida faylga (`bot_errors.log`) yozadigan, va har bir xatoda vaqt belgisi (timestamp) ham qo'shadigan logging konfiguratsiyasini sozlang.

## Qisqacha xulosa
Xatolarni professional boshqarish — botning barqarorligi uchun muhim. `@router.errors()` orqali butun bot uchun yagona, markazlashgan xato ushlagich yaratiladi. Aiogram'ning maxsus exception turlari (`TelegramForbiddenError`, `TelegramRetryAfter` va h.k.) orqali muayyan vaziyatlarga mos javob berish mumkin. Broadcast kabi ommaviy operatsiyalarda bloklangan foydalanuvchilar va flood-limitni hisobga olish — production botning zaruriy sharti.
