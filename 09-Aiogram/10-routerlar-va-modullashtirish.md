# 10. Routerlar va Modullashtirish

## Bu darsda nimalarni o'rganasiz
- Nega bitta faylga yozilgan bot muammoli
- `Router` nima va u qanday ishlaydi
- Botni fayllarga (modullarga) qanday bo'lish
- `dp.include_router()` tartibi nega muhim

## Nazariy qism

### Nega modullashtirish kerak?
Kichik botda 5-10 ta handler bitta `main.py` faylida yaxshi ko'rinadi. Lekin real loyihada handlerlar soni o'nlab, hattoki yuzlab bo'lishi mumkin — bitta faylda bularning barchasini boshqarish **qiyin va xatoga moyil** bo'lib qoladi.

Django'da buni "app"larga bo'lish orqali hal qilasiz (masalan, `users`, `orders`, `products`). Aiogram'da xuddi shunday vazifani **Router** bajaradi.

### Router nima?
`Router` — `Dispatcher`ning "kichik nusxasi". U o'z handlerlariga ega bo'ladi, va keyin `Dispatcher`ga **ulanadi**. Har bir modul (masalan, `user.py`, `admin.py`) — o'z Router'iga ega bo'ladi.

```python
from aiogram import Router

router = Router(name="user")  # nom - ixtiyoriy, lekin debugda foydali
```

### Amaliy misol: botni ikkita modulga bo'lish

**`handlers/user.py`:**
```python
from aiogram import Router, F
from aiogram.filters import CommandStart
from aiogram.types import Message

router = Router(name="user")

@router.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer(f"Salom, {message.from_user.first_name}!")

@router.message(F.text == "📞 Aloqa")
async def contact(message: Message):
    await message.answer("+998 90 123 45 67")
```

**`handlers/admin.py`:**
```python
from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message

router = Router(name="admin")

ADMIN_IDS = [123456789]

# Bu router ostidagi BARCHA handlerlarga qo'llanadigan filter
router.message.filter(lambda message: message.from_user.id in ADMIN_IDS)

@router.message(Command("stats"))
async def stats(message: Message):
    await message.answer("📊 Statistika: 1234 ta foydalanuvchi")
```

**`main.py`:**
```python
import asyncio
from aiogram import Bot, Dispatcher

from handlers import user, admin

async def main():
    bot = Bot(token="TOKEN")
    dp = Dispatcher()

    dp.include_router(user.router)
    dp.include_router(admin.router)

    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
```

### include_router() tartibi nega muhim
`Dispatcher` — o'zi ham Router hisoblanadi (u "ildiz" Router). Xabar kelganda, u ulangan Routerlar bo'ylab **tartib bilan** (yuqoridan pastga) qidiriladi — birinchi mos kelgan handler ishga tushadi.

Shuning uchun **tor/maxsus** routerlarni yuqoriga, **umumiy** routerni pastga ulash kerak:

```python
dp.include_router(admin.router)   # avval — aniqroq, tor filter
dp.include_router(user.router)    # keyin — umumiyroq
```

Agar aksincha qilsangiz va `user.router`da filtrsiz umumiy handler bo'lsa, u `admin.router`dagi handlerlardan **oldin** ishlab, ularni hech qachon ishga tushirmasligi mumkin.

### Sub-routerlar (ichma-ich Router)
Routerlarni bir-biriga ham ulash mumkin — bu katta loyihalarda mavzular bo'yicha guruhlashga yordam beradi:

```python
# handlers/admin/__init__.py
from aiogram import Router
from .stats import router as stats_router
from .broadcast import router as broadcast_router

router = Router(name="admin")
router.include_router(stats_router)
router.include_router(broadcast_router)
```

## Amaliy misol
Uch modulli oddiy loyiha strukturasi:

```
mybot/
├── main.py
└── handlers/
    ├── __init__.py
    ├── user.py       # oddiy foydalanuvchi komandalari
    ├── admin.py       # faqat admin uchun
    └── errors.py       # xatoliklarni ushlash (13-darsda)
```

`handlers/__init__.py` (bo'sh bo'lishi ham mumkin, yoki qulaylik uchun):
```python
from . import user, admin, errors
```

`main.py`:
```python
from handlers import user, admin, errors

dp.include_router(admin.router)   # tor filter - yuqorida
dp.include_router(user.router)    # umumiy - pastda
dp.include_router(errors.router)  # xato ushlagich - eng oxirida
```

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **Barcha handlerlarni bitta faylda saqlashda davom etish** — loyiha kattalashgani sayin bu boshqarib bo'lmaydigan holga keladi.
- **Router'larni noto'g'ri tartibda ulash** — umumiy router avval ulansa, tor/maxsus handlerlar hech qachon ishlamaydi.
- **Bir xil nomdagi Router obyektini ikki marta import qilish** — `Router already attached` xatosiga olib keladi. Har bir Router faqat bitta joyga ulanishi mumkin.
- **`router.message.filter(...)` ni butun routerga emas, har bir handlerga alohida yozishga urinish** — bu ortiqcha kod takrorlanishiga olib keladi; router darajasidagi filter ancha toza yechim.

## Mashq/topshiriq
1. **(Oson)** `handlers/user.py` faylida `Router` yarating, unga `/start` handlerini ko'chiring va `main.py`da ulang.
2. **(O'rtacha)** `handlers/admin.py` yarating, unda faqat sizning Telegram ID'ingiz uchun ishlaydigan `/stats` komandasini yozing (router darajasidagi filter bilan).
3. **(Qiyin)** Uchinchi modul — `handlers/shop.py` yarating (8-darsdagi CallbackData savdo misolini ko'chiring) va uni ham `main.py`ga ulang. Barcha uchta routerni to'g'ri tartibda ulaganingizni tekshiring.

## Qisqacha xulosa
`Router` — handlerlarni mantiqiy modullarga (masalan, `user.py`, `admin.py`) bo'lish imkonini beradi, bu katta loyihani boshqarib bo'ladigan holatda saqlaydi. Har bir Router `dp.include_router()` orqali asosiy Dispatcher'ga ulanadi, va ulash **tartibi muhim** — tor/aniq filterli routerlar yuqorida, umumiy routerlar pastda bo'lishi kerak. Bu — real, professional aiogram loyihasining asosiy arxitektura printsipi.
