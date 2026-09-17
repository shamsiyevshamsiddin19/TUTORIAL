# 1. Kirish — Aiogram va Telegram Bot API

## Bu darsda nimalarni o'rganasiz
- Telegram Bot API nima va u qanday ishlaydi
- Aiogram nima va nega u eng ko'p tanlanadigan Python Telegram bot freymvorki
- Aiogram'ning asosiy afzalliklari
- Bu darslikda nimalarni o'rganib borishingiz

## Nazariy qism

### Telegram Bot API nima?
Telegram — oddiy chat ilovasi bo'lish bilan birga, dasturchilarga **Bot API** taqdim etadi. Bu API orqali siz Telegram ichida avtomatik ishlaydigan "bot" (dastur) yaratishingiz mumkin — bot xabarlarga javob beradi, buyruqlarni bajaradi, ma'lumot yig'adi, hatto to'lov qabul qiladi.

Botlar juda ko'p sohalarda ishlatiladi: onlayn-do'kon (buyurtma qabul qilish), til o'rganish (Duolingo-simon botlar), xabar yuborish tizimlari, moliyaviy hisobotlar, guruh moderatsiyasi va h.k.

### Aiogram nima?
**Aiogram** — Telegram Bot API bilan ishlash uchun yozilgan Python kutubxonasi (freymvork). U Telegram serverlariga so'rov yuborish, javoblarni qabul qilish va ularga qulay tarzda reaksiya yozish imkonini beradi — siz HTTP so'rovlar bilan qo'lda ishlashingiz shart emas.

Aiogram **to'liq asinxron** (`async/await`) texnologiyada qurilgan. Bu shuni anglatadiki, bot bir vaqtning o'zida minglab foydalanuvchi bilan **bir-biriga xalaqit bermay** muloqot qila oladi.

### Nega aynan aiogram?
Python'da Telegram bot yozish uchun bir nechta kutubxona bor (`python-telegram-bot`, `pyTelegramBotAPI`, `aiogram`), lekin aiogram quyidagi sabablarga ko'ra eng ko'p tanlanadi:

1. **Tezlik** — asinxron arxitektura tufayli yuqori yuklamaga chidamli.
2. **Zamonaviy Python** — type hints, dataclass, Pydantic asosidagi modellardan foydalanadi — kodni yozish va xatolarni topish osonlashadi.
3. **Modulli tuzilma** — `Router` orqali katta loyihani mayda, boshqariladigan bo'laklarga bo'lish mumkin.
4. **FSM (holatlar mashinasi)** — ko'p bosqichli suhbatlarni (masalan, ro'yxatdan o'tish) qulay boshqarish imkonini beradi.
5. **Faol jamiyat** — muntazam yangilanadi, hujjatlari va misollari ko'p.
6. **Django/PostgreSQL bilan mos ishlaydi** — sizning stack'ingizga (Django + aiogram + PostgreSQL) tabiiy ravishda qo'shiladi, chunki ikkalasi ham Python asosida.

### Bu darslik qanday tuzilgan
Darslik 18 ta mavzudan iborat — eng oddiy tushunchalardan boshlab (bot yaratish, birinchi handler), asta-sekin murakkabroq mavzularga (FSM, middleware, loyiha strukturasi) o'tib, oxirida to'liq ishlaydigan amaliy loyiha bilan yakunlanadi. Har bir mavzu — alohida fayl, oldingi bilim ustiga quriladi, shuning uchun tartib bilan o'rganish tavsiya etiladi.

## Amaliy misol
Keyingi darslarda yozadigan eng sodda botning ko'rinishi qanday bo'lishini oldindan ko'rib qo'yaylik:

```python
from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message
import asyncio

bot = Bot(token="SIZNING_TOKENINGIZ")
dp = Dispatcher()

@dp.message(CommandStart())
async def start_handler(message: Message):
    await message.answer("Salom! Men aiogram botman.")

async def main():
    await dp.start_polling(bot)

asyncio.run(main())
```

Bu kod nima qilishini hozircha tushunmasangiz — hech qanday muammo yo'q, keyingi darslarda har bir qatorni batafsil ko'rib chiqamiz.

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **Aiogram va Telegram Bot API'ni aralashtirib yuborish**: Bot API — Telegram'ning o'zi taqdim etgan interfeys, aiogram esa shu interfeys bilan qulay ishlash uchun yozilgan Python vositasi.
- **"Bot" va "userbot"ni chalkashtirish**: Bot API orqali yaratilgan bot — alohida, cheklangan huquqli akkaunt turi (masalan, u boshqa botlarga xabar yoza olmaydi). Userbot — bu butunlay boshqa texnologiya (Telegram Client API), bu darslikka kirmaydi.

## Mashq/topshiriq
1. **(Oson)** Telegram'da @BotFather'ni toping va u nima ekanligini profilida o'qing (keyingi darsda undan foydalanamiz).
2. **(O'rtacha)** Telegram'da sizga tanish 3 ta botni toping (masalan, @like, @vote va h.k.) va ular qanday funksiyalarni bajarishini kuzating.
3. **(Qiyin)** Aiogram'ning rasmiy hujjatini oching ([docs.aiogram.dev](https://docs.aiogram.dev)) va "Dispatcher" so'zi qaysi bo'limlarda tilga olinganini toping — hali tushunmasangiz ham, atamaga ko'zingiz o'rganib qolsin.

## Qisqacha xulosa
Telegram Bot API — Telegram ichida avtomatik dasturlar (botlar) yaratish imkonini beruvchi interfeys. Aiogram — shu API bilan Python'da qulay, tez va zamonaviy tarzda ishlash uchun yaratilgan asinxron freymvork. U Django bilan bir xil tilda (Python) yozilgani uchun, sizning Django + aiogram + PostgreSQL stack'ingizga tabiiy mos keladi. Ushbu darslik sizni noldan to'liq ishlaydigan, professional tuzilishga ega botgacha olib boradi.
