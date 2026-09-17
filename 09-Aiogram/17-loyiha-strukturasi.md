# 17. Loyiha Strukturasi

## Bu darsda nimalarni o'rganasiz
- Professional aiogram loyihasining papka tuzilmasi
- Har bir papkaning vazifasi
- `.env`, `.gitignore`, `requirements.txt` fayllarining o'rni
- Bu darslikda o'rgangan barcha mavzularning strukturadagi joyi

## Nazariy qism

### Nega tuzilma muhim?
Bitta faylga (`main.py`) 500-1000 qatorlik kod yozish kichik test uchun yaroqli, lekin real loyihada bu **boshqarib bo'lmaydigan** holga keladi. Aiogram jamoasi va tajribali dasturchilar tomonidan sinovdan o'tgan tuzilma quyidagicha:

```
mybot/
├── .env                     # Maxfiy ma'lumotlar (token, DB parol) — Git'ga qo'shilmaydi
├── .gitignore
├── requirements.txt
├── main.py                  # Kirish nuqtasi — botni ishga tushiradi
├── config.py                # .env'ni o'qib, sozlamalarni beradi
│
├── handlers/                # Foydalanuvchi xabarlariga javob beruvchi funksiyalar
│   ├── __init__.py
│   ├── user.py               # Oddiy foydalanuvchi komandalari
│   ├── admin.py               # Faqat admin uchun komandalar
│   └── errors.py              # Xatoliklarni ushlash
│
├── keyboards/                # Klaviaturalar shu yerda generatsiya qilinadi
│   ├── __init__.py
│   ├── reply.py
│   └── inline.py
│
├── middlewares/               # Har bir xabardan oldin ishlaydigan qatlamlar
│   ├── __init__.py
│   ├── throttling.py
│   └── db.py
│
├── filters/                   # Maxsus (custom) filterlar
│   ├── __init__.py
│   └── admin.py
│
├── states/                    # FSM holatlari
│   ├── __init__.py
│   └── registration.py
│
├── database/                  # Ma'lumotlar bazasi qatlami
│   ├── __init__.py
│   ├── models.py
│   └── requests.py
│
└── downloads/                  # Yuklab olingan fayllar (bo'sh papka, .gitkeep bilan)
```

### Har bir papkaning vazifasi

| Papka/fayl | Vazifasi | Qaysi darsda ko'rgansiz |
|---|---|---|
| `main.py` | Bot, Dispatcher yaratish, routerlarni ulash, `start_polling` chaqirish | 4-dars |
| `config.py` | `.env`dan tokenni va boshqa sozlamalarni o'qish | 2-dars |
| `handlers/` | Har bir modul o'z `Router`iga ega | 10-dars |
| `keyboards/` | Reply va Inline klaviaturalarni generatsiya qiluvchi funksiyalar | 7, 8-darslar |
| `middlewares/` | Throttling, logging, DB session in'yeksiyasi | 11-dars |
| `filters/` | `IsAdmin` kabi custom filterlar | 14-dars |
| `states/` | FSM `StatesGroup` klasslari | 9-dars |
| `database/` | ORM modellari va so'rovlar | (Django loyihalarida — Django ORM shu vazifani bajaradi) |

### .gitignore — nima Git'ga tushmasligi kerak
```
venv/
.env
__pycache__/
*.pyc
db.sqlite3
downloads/*
!downloads/.gitkeep
```

### Amal qilish tartibi — qadam-baqadam qurish
Loyihani noldan qurishda tavsiya etiladigan ketma-ketlik:
1. `main.py` + `config.py` — asosiy skelet (4, 2-darslar)
2. `keyboards/` — klaviaturalar (7, 8-darslar)
3. `states/` — FSM jarayonlari kerak bo'lsa (9-dars)
4. `handlers/` — barcha handlerlarni modullarga bo'lib joylashtirish (10-dars)
5. `middlewares/` — throttling, logging (11-dars)
6. `filters/` — custom filterlar (14-dars)
7. `database/` — DB qatlami (yoki Django ORM integratsiyasi)

## Amaliy misol
`config.py` — barcha sozlamalarni bir joyda saqlovchi fayl:

```python
import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    bot_token: str
    admin_ids: list[int]


def load_config() -> Config:
    return Config(
        bot_token=os.getenv("BOT_TOKEN"),
        admin_ids=[int(x) for x in os.getenv("ADMIN_IDS", "").split(",") if x],
    )
```

`main.py` — hammasini birlashtiruvchi kirish nuqtasi:

```python
import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage

from config import load_config
from handlers import user, admin, errors
from middlewares.throttling import ThrottlingMiddleware

logging.basicConfig(level=logging.INFO)


async def main():
    config = load_config()

    bot = Bot(token=config.bot_token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher(storage=MemoryStorage())

    dp.message.middleware(ThrottlingMiddleware())

    dp.include_router(admin.router)  # tor filter — yuqorida
    dp.include_router(user.router)   # umumiy — pastda
    dp.include_router(errors.router) # xato ushlagich — eng oxirida

    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Bot to'xtatildi")
```

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **Barcha kodni bitta faylda qoldirish** — loyiha o'sishi bilan tez orada boshqarib bo'lmaydigan holga keladi.
- **`__init__.py` fayllarini yaratishni unutish** — Python paketlar sifatida import qilish uchun bu fayllar zarur (bo'sh bo'lishi mumkin).
- **`.env`ni `.gitignore`ga qo'shishni unutish** — token GitHub'ga tushib qolishi mumkin.
- **Papka nomlarini izchil ushlamaslik** (masalan, ba'zida `handler`, ba'zida `handlers`) — bu import xatolariga olib keladi.

## Mashq/topshiriq
1. **(Oson)** Yuqoridagi papka tuzilmasini o'z kompyuteringizda yarating (bo'sh fayllar bilan) va har bir papkaga `__init__.py` qo'shing.
2. **(O'rtacha)** `config.py` va `.env` fayllarini yozib, `main.py`da tokenni muvaffaqiyatli o'qiganingizni tekshiring.
3. **(Qiyin)** Ushbu darslikning 4-14 darslarida yozgan barcha handler, klaviatura va middleware kodlaringizni shu tuzilmaga mos ravishda alohida fayllarga joylashtirib, botni shu strukturada ishga tushiring.

## Qisqacha xulosa
Professional aiogram loyihasi `handlers/`, `keyboards/`, `middlewares/`, `filters/`, `states/`, `database/` kabi mantiqiy papkalarga bo'linadi, `main.py` esa faqat ularni birlashtiruvchi kirish nuqtasi bo'lib qoladi. Bu tuzilma — Django'dagi "app"larga bo'linish g'oyasiga juda o'xshash, shuning uchun sizga tanish bo'lishi kerak. Ushbu darslikning barcha oldingi mavzulari (handlerlar, klaviaturalar, FSM, middleware, filterlar) — aynan shu tuzilmaning tegishli bo'laklariga joylashadi.
