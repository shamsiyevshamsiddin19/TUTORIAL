# 4. Birinchi Bot

## Bu darsda nimalarni o'rganasiz
- `Bot` va `Dispatcher` obyektlari nima uchun kerak
- Birinchi handler yozish (`/start` komandasi)
- Botni ishga tushirish (polling)
- `parse_mode` va `DefaultBotProperties` nima

## Nazariy qism

### Aiogram'ning uchta asosiy obyekti

| Obyekt | Vazifasi |
|---|---|
| **Bot** | Telegram API bilan bevosita "gaplashadi" — xabar yuborish, fayl yuklash va h.k. |
| **Dispatcher** | Kelgan yangiliklarni (update — yangi xabar, tugma bosilishi va h.k.) qabul qiladi va mos handlerga yo'naltiradi |
| **Router** | Handlerlar guruhi (bu haqda 10-darsda batafsil) |

Oddiy tashbeh: **Bot** — bu "og'iz va qulog'ingiz" (gapiradi va eshitadi), **Dispatcher** — bu "miyangiz" (kelgan xabarni tahlil qilib, qaysi javobni berish kerakligini hal qiladi).

### Bot va Dispatcher yaratish

```python
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

bot = Bot(
    token="SIZNING_TOKENINGIZ",
    default=DefaultBotProperties(parse_mode=ParseMode.HTML)
)
dp = Dispatcher()
```

> ⚠️ **Muhim:** Aiogram 3.7+ versiyasida `parse_mode` endi `Bot(parse_mode=...)` orqali emas, balki `DefaultBotProperties` orqali beriladi. Bu eski (internetdagi ko'p) misollarda ko'p uchraydigan chalkashlik joyi. `parse_mode=ParseMode.HTML` — bu botning xabarlarida `<b>qalin</b>`, `<i>qiya</i>` kabi HTML teglaridan foydalanish imkonini beradi.

### Handler — botning "javob beruvchisi"
Handler — ma'lum bir hodisaga (masalan, `/start` komandasi kelganda) javob beruvchi `async` funksiya. U **dekorator** (`@dp.message(...)`) yordamida "ro'yxatdan o'tkaziladi":

```python
from aiogram.filters import CommandStart
from aiogram.types import Message

@dp.message(CommandStart())
async def start_handler(message: Message):
    await message.answer(f"Salom, {message.from_user.first_name}!")
```

Bu yerda:
- `@dp.message(CommandStart())` — "foydalanuvchi `/start` yozganda, quyidagi funksiyani chaqir" degan ma'noni bildiradi.
- `message: Message` — kelgan xabar haqidagi barcha ma'lumot (matn, yuboruvchi, chat va h.k.) shu obyektda.
- `message.answer(...)` — o'sha foydalanuvchiga javob yozish.

### Botni ishga tushirish (polling)
**Polling** — bot Telegram serveriga muntazam ravishda "yangilik bormi?" deb so'rab turadigan usul (rivojlantirish uchun eng oson usul; webhook haqida 16-darsda):

```python
import asyncio

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
```

## Amaliy misol
To'liq, ishga tushiriladigan birinchi bot (barcha qismlar birga):

```python
import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import Message

logging.basicConfig(level=logging.INFO)  # konsolda nima bo'layotganini ko'rish uchun

TOKEN = "SIZNING_TOKENINGIZ"

bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()


@dp.message(CommandStart())
async def start_handler(message: Message):
    await message.answer(
        f"Assalomu alaykum, <b>{message.from_user.first_name}</b>!\n"
        f"Men aiogram yordamida yaratilgan birinchi botman. 🚀"
    )


async def main():
    await bot.delete_webhook(drop_pending_updates=True)  # eski so'rovlarni tozalash (yaxshi odat)
    logging.info("Bot ishga tushdi...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Bot to'xtatildi")
```

Ishga tushirish: `python main.py`. Endi Telegram'da botingizga `/start` yuboring — u sizga salom beradi!

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **`Bot(token=..., parse_mode=ParseMode.HTML)` deb yozish** — bu eski (aiogram 3.7'dan oldingi) sintaksis, hozir xato beradi. `DefaultBotProperties` ishlatilishi shart.
- **Handler funksiyasini `async def` qilib yozmaslik** — aiogram uni ishga tushira olmaydi.
- **`message.answer()` o'rniga `message.reply()` bilan chalkashtirish** — `answer()` oddiy javob yozadi, `reply()` esa Telegram'da "javob berish" (xabarga bog'langan) shaklida yuboradi. Ikkalasi ham to'g'ri, lekin vizual natijasi farq qiladi.
- **Token noto'g'ri kiritilgan** — `Unauthorized` xatosi chiqadi. Tokenni BotFather'dan qayta tekshiring.
- **`asyncio.run(main())` ni `if __name__ == "__main__":` bloki ichiga yozmaslik** — odatda muammo bermaydi, lekin bu Python'ning yaxshi odati hisoblanadi.

## Mashq/topshiriq
1. **(Oson)** Yuqoridagi to'liq botni nusxa oling, o'z tokeningizni qo'yib ishga tushiring va `/start` yuboring.
2. **(O'rtacha)** `/start` handleriga qo'shimcha ma'lumot qo'shing — foydalanuvchining Telegram ID raqamini (`message.from_user.id`) ham xabar sifatida qaytaring.
3. **(Qiyin)** Ikkinchi handler qo'shing: `/hello` komandasiga `<i>Salom, qanday yordam bera olaman?</i>` deb HTML formatida javob beradigan.

## Qisqacha xulosa
Har bir aiogram bot uchtta asosiy qismdan iborat: **Bot** (Telegram bilan gaplashuvchi), **Dispatcher** (xabarlarni yo'naltiruvchi) va **handlerlar** (aniq javob beruvchi funksiyalar). Bot `dp.start_polling(bot)` orqali ishga tushiriladi va Telegram'dan kelgan yangiliklarni doimiy kuzatib turadi. Endi botingiz sizga javob berishini o'z ko'zingiz bilan ko'rdingiz — keyingi darslarda handlerlar va filterlarni chuqurroq o'rganamiz.
