# Management command — botni ishga tushirish (runbot)

## Bu darsda nimalarni o'rganasiz

- Django management command yaratish tuzilmasini tushuntira olasiz
- `runbot` buyrug'ini yozib, botni to'liq ishga tushira olasiz
- Middleware va routerlarni to'g'ri ketma-ketlikda ulay olasiz
- Botni ishga tushirishdan oldin webhook'ni tozalash nima uchun kerakligini tushuntira olasiz

## Nazariy qism

### Nega management command, nega oddiy skript emas

21-darsda ko'rganingizdek, botni oddiy `python bot.py` sifatida emas, Django'ning **management command** mexanizmi orqali ishga tushiramiz. Bu tanlov quyidagi afzalliklarni beradi: (1) Django avtomatik `django.setup()`ni chaqiradi, shuning uchun `settings.BOT_TOKEN`, modellar va boshqa Django imkoniyatlaridan erkin foydalanish mumkin; (2) botni boshqa Django buyruqlari (`migrate`, `createsuperuser`) bilan bir xil, tanish tarzda (`python manage.py <nom>`) ishga tushirish mumkin; (3) production'da (Docker, systemd) buyruqni boshqarish osonroq.

### Management command fayl tuzilmasi

Django management command'lar qat'iy papka tuzilmasiga amal qilishi kerak:

```
apps/bot/
└── management/
    ├── __init__.py              # bo'sh, lekin MAJBURIY
    └── commands/
        ├── __init__.py           # bo'sh, lekin MAJBURIY
        └── runbot.py              # buyruq nomi = fayl nomi
```

`__init__.py` fayllari bo'sh bo'lsa ham, ularsiz Django bu papkalarni Python package sifatida tanimaydi, va buyruq "ko'rinmay" qoladi (19-darsdagi mashqda ko'rgan "Unknown command" xatosining aynan sababi shu).

### runbot.py — to'liq buyruq

```python
# apps/bot/management/commands/runbot.py
import asyncio
import logging

from django.core.management.base import BaseCommand

from apps.bot.loader import bot, dp
from apps.bot.middlewares import DjangoDBMiddleware
from apps.bot.handlers.user import router as user_router

logging.basicConfig(level=logging.INFO)


class Command(BaseCommand):
    help = "Aiogram Telegram botni ishga tushiradi"

    def handle(self, *args, **options):
        asyncio.run(self._main())

    async def _main(self):
        dp.update.middleware(DjangoDBMiddleware())    # 22-darsdagi middleware — barcha yangiliklarga
        dp.include_router(user_router)                  # handlerlarni ro'yxatga olish

        await bot.delete_webhook(drop_pending_updates=True)
        self.stdout.write(self.style.SUCCESS("Bot ishga tushdi..."))
        await dp.start_polling(bot)
```

Har bir `Command` klassi `django.core.management.base.BaseCommand`dan meros olishi va `handle()` metodini amalga oshirishi **shart** — bu Django'ning barcha management command'lar uchun umumiy talabi.

`asyncio.run(self._main())` — Django'ning `handle()` metodi **sinxron** kontekstda chaqiriladi (chunki `manage.py` o'zi sinxron), shuning uchun Aiogram'ning asinxron ishga tushirish kodini `asyncio.run()` orqali "ishga tushiramiz" — bu Python'da sync koddan async kodni ishga tushirishning standart usuli.

### delete_webhook(drop_pending_updates=True) — nega kerak

Telegram bot ikki xil rejimda ishlashi mumkin: **polling** (bot o'zi doimiy ravishda Telegram serveridan "yangi xabar bormi?" deb so'raydi) va **webhook** (Telegram bot serveriga o'zi xabar yuboradi). Agar oldin webhook sozlangan bo'lsa-yu, endi polling'ga o'tmoqchi bo'lsangiz, avval webhook'ni o'chirish kerak — aks holda Telegram ikkalasini bir vaqtda ishlatishga ruxsat bermaydi va xato beradi.

`drop_pending_updates=True` — bot o'chiq turgan paytda to'plangan eski xabarlarni **tashlab yuborish**ni bildiradi. Bu ayniqsa development paytida foydali: botni qayta-qayta ishga tushirganda, eski test xabarlari to'planib, bot ishga tushgan zahoti ularni birma-bir qayta ishlab chiqishga urinib, chalkashlik keltirib chiqarmasligi uchun.

## Amaliy misol

Botni noldan ishga tushirishning to'liq ketma-ketligi:

```bash
# 1. Papka tuzilmasini tayyorlash (agar hali qilinmagan bo'lsa)
mkdir -p apps/bot/management/commands
touch apps/bot/management/__init__.py
touch apps/bot/management/commands/__init__.py
```

`apps/bot/management/commands/runbot.py` faylini yuqoridagi to'liq kod bilan yaratamiz.

`apps/bot/handlers/user.py`da 22 va 24-darslardagi barcha handlerlar (`cmd_start`, `cmd_shop`, `product_selected`, `process_quantity` va h.k.) bitta `router` ostida yig'ilgan bo'lishi kerak.

```bash
# 2. Botni ishga tushirish
python manage.py runbot
```

Konsolda quyidagiga o'xshash chiqish ko'rinishi kerak:

```
INFO:aiogram.dispatcher:Start polling
Bot ishga tushdi...
INFO:aiogram.event:Update id=... is handled. Duration ... ms by bot id=...
```

Endi Telegram'da botga o'ting, `/start` yuboring — `cmd_start` handleri ishga tushib, `TelegramUser` yaratiladi (yoki mavjudi topiladi). `/shop` yuboring — agar admin panelda (21-darsda qo'shgan) tovarlar bo'lsa, ular tugmalar sifatida ko'rinadi.

Botni to'xtatish — terminalda `Ctrl+C`.

### Ikkita jarayonni parallel ishga tushirish (development uchun)

```bash
# 1-terminalda:
python manage.py runserver

# 2-terminalda:
python manage.py runbot
```

Endi admin panelda (`http://127.0.0.1:8000/admin/`) tovar qo'shsangiz, u darhol botda (`/shop` buyrug'i orqali) ko'rina boshlaydi — bu butun 18-darsdan boshlab qurilgan arxitekturaning amaliy natijasi.

## Keng tarqalgan xatolar

**Xato 1:** `management/__init__.py` yoki `commands/__init__.py` fayllarini yaratishni unutish.
❌ `runbot.py` to'g'ri yozilgan, lekin `python manage.py runbot` — `Unknown command: 'runbot'` xatosini beradi.
✅ To'g'ri: har ikkala papkada ham (`management/` va `management/commands/`) bo'sh `__init__.py` fayli borligini tekshiring — bu Python'ga bu papkalarni "package" sifatida ko'rsatadi.

**Xato 2:** `dp.include_router(user_router)`ni chaqirishni unutish.
❌ Bot ishga tushadi, hech qanday xato bermaydi, lekin foydalanuvchi `/start` yuborganda bot **hech qanday javob bermaydi** — chunki handlerlar `Dispatcher`ga umuman ulanmagan.
✅ To'g'ri: har bir yangi `Router` yaratganingizda, uni `runbot.py` ichida albatta `dp.include_router(...)` orqali ro'yxatga oling.

**Xato 3:** `delete_webhook()`ni chaqirmasdan `start_polling()`ga o'tish, agar oldin webhook sozlangan bo'lsa.
❌ Agar bot avval boshqa muhitda (masalan, production serverda) webhook rejimida ishlatilgan bo'lsa, polling ishga tushganda `TelegramConflictError` yoki hech qanday yangilik kelmasligi kabi tushunarsiz muammolar chiqishi mumkin.
✅ To'g'ri: `start_polling()`dan **oldin** har doim `await bot.delete_webhook(drop_pending_updates=True)` chaqiring — bu odat sizni ko'plab tushunarsiz xatolardan qutqaradi.

## Mashq/topshiriq

**(Oson)** `apps/bot/management/commands/runbot.py`ni yuqoridagi namuna bo'yicha yozing va `python manage.py runbot` orqali botni ishga tushiring. Telegram'da `/start` yuborib, javob kelishini tasdiqlang.

**(O'rtacha)** `runbot.py`ga qo'shimcha `Command.help` matnini batafsilroq yozing, va `python manage.py help runbot` buyrug'i orqali bu matn qanday ko'rsatilishini tekshiring.

**(Qiyin)** Ikkinchi `Router` (masalan, `admin_router` — faqat ma'lum `telegram_id`lar uchun maxsus buyruqlar) yarating va uni ham `runbot.py`da `dp.include_router()` orqali ulang. Agar bitta xabar ikkala router mos kelsa (masalan, ikkalasida ham `/start` uchun handler bo'lsa), qaysi router **birinchi** ishlov berishini sinab ko'ring va nega shunday bo'lishini (routerlarning `include_router()`ga qo'shilish tartibi) tushuntirib bering.

<details>
<summary>Javoblarni ko'rish</summary>

1. `python manage.py runbot` konsolida "Bot ishga tushdi..." xabari chiqishi, va Telegram'da `/start` yuborilganda `TelegramUser` yaratilib, xush kelibsiz xabari qaytishi kerak.
2. `help = "Aiogram Telegram botni PostgreSQL orqali ishga tushiradi va foydalanuvchi buyurtmalarini qabul qiladi."` kabi batafsil matn; `python manage.py help runbot` shu matnni ko'rsatadi.
3. Aiogram routerlarni **qo'shilgan tartibda** tekshiradi — birinchi `include_router()` orqali qo'shilgan router, agar handler mos kelsa, birinchi ishlov beradi va ikkinchisiga navbat yetmaydi (agar birinchisida mos handler ishlov bersa). Shuning uchun `dp.include_router(user_router); dp.include_router(admin_router)` tartibida, `user_router`dagi mos handler birinchi ishga tushadi.

</details>

## Qisqacha xulosa

`runbot.py` — Django management command mexanizmi orqali botni ishga tushiruvchi, `management/commands/` papkasida (ikkala `__init__.py` bilan) joylashgan, `BaseCommand`dan meros oluvchi maxsus buyruq; u ichida `DjangoDBMiddleware` va barcha handler routerlari `Dispatcher`ga ulanadi, `bot.delete_webhook(drop_pending_updates=True)` orqali eski webhook/xabarlar tozalanadi, va `dp.start_polling(bot)` orqali bot uzluksiz ishlay boshlaydi — shu buyruqdan so'ng, admin panel va Telegram bot bitta umumiy PostgreSQL orqali real vaqtda sinxron ishlaydi.
