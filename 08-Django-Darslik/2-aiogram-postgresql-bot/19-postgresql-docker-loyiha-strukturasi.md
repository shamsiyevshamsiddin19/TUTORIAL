# PostgreSQL (Docker) va loyiha strukturasi

## Bu darsda nimalarni o'rganasiz

- PostgreSQL'ni Docker orqali, o'rnatmasdan ishga tushira olasiz
- Django+Aiogram loyihasi uchun professional papka tuzilmasini qura olasiz
- `shop` (ma'lumotlar) va `bot` (Telegram mantig'i) app'larini nega alohida ajratish kerakligini tushuntira olasiz

## Nazariy qism

### PostgreSQL'ni Docker orqali ishga tushirish

Mahalliy kompyuteringizga PostgreSQL'ni to'g'ridan-to'g'ri o'rnatish (versiya moslashtirish, xizmatni sozlash) ancha vaqt olishi mumkin. Docker orqali bu ancha tezroq:

```bash
docker run -d \
  --name pg_bot_db \
  -e POSTGRES_DB=botdb \
  -e POSTGRES_USER=botuser \
  -e POSTGRES_PASSWORD=botpassword \
  -p 5432:5432 \
  postgres:16
```

Bu buyruq: `postgres:16` rasmiy imidjidan konteyner ishga tushiradi, `botdb` nomli ma'lumotlar bazasini, `botuser`/`botpassword` login ma'lumotlari bilan yaratadi, va `5432` portini kompyuteringizga (localhost) ochadi. Endi Django (yoki boshqa har qanday DB klient) `localhost:5432` orqali shu PostgreSQL'ga ulana oladi — xuddi u to'g'ridan-to'g'ri kompyuteringizga o'rnatilgandek.

Ishlab turganini tekshirish:

```bash
docker ps
# CONTAINER ID   IMAGE          ...   PORTS                    NAMES
# a1b2c3d4e5f6   postgres:16    ...   0.0.0.0:5432->5432/tcp   pg_bot_db
```

To'liq `docker-compose.yml` orqali PostgreSQL, Django va botni birga boshqarish — 27-darsda ko'riladi, hozircha yuqoridagi oddiy `docker run` development uchun yetarli.

### Loyiha strukturasi — data qatlami va bot qatlami ajratilgan

```
telegram_shop_bot/
├── .env
├── .gitignore
├── requirements.txt
├── manage.py
├── docker-compose.yml
│
├── config/                       # Django loyiha sozlamalari
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
└── apps/
    ├── shop/                      # DATA QATLAMI — faqat models + admin
    │   ├── models.py               # TelegramUser, Product, Order
    │   ├── admin.py
    │   └── migrations/
    │
    └── bot/                        # BOT QATLAMI — faqat aiogram kodi
        ├── loader.py                # Bot, Dispatcher obyektlari
        ├── middlewares.py           # PostgreSQL ulanishini boshqaruvchi middleware
        ├── states.py                 # FSM holatlari
        ├── handlers/
        │   ├── __init__.py
        │   └── user.py                # /start, /shop, buyurtma handlerlari
        └── management/
            └── commands/
                └── runbot.py           # `python manage.py runbot`
```

### Nega ikkita alohida app — shop va bot

Bu ajratish — ushbu bo'limning eng muhim arxitektura qarorlaridan biri: **`shop`** — sof ma'lumotlar qatlami, faqat `models.py` va `admin.py` bilan shug'ullanadi, Telegram haqida **hech narsa** bilmaydi. **`bot`** — faqat Telegram bilan gaplashish mantig'i, `shop.models`dan foydalanadi, lekin o'z modelini yaratmaydi.

Bu ajratishning amaliy foydasi: agar kelajakda web-sayt yoki mobil ilova qo'shsangiz, ular ham xuddi shu `shop.models`dan (`TelegramUser`, `Product`, `Order`) foydalana oladi — bot kodiga umuman tegmasdan. Aksincha, agar hammasi bitta app ichida aralashtirilgan bo'lsa, keyinchalik ma'lumot va mantiqni ajratish og'ir refaktoring talab qiladi.

## Amaliy misol

To'liq loyihani noldan yaratish ketma-ketligi:

```bash
mkdir telegram_shop_bot && cd telegram_shop_bot
python -m venv venv
source venv/bin/activate
pip install django aiogram django-environ psycopg2-binary asgiref

# PostgreSQL'ni Docker orqali ishga tushirish
docker run -d --name pg_bot_db \
  -e POSTGRES_DB=botdb -e POSTGRES_USER=botuser -e POSTGRES_PASSWORD=botpassword \
  -p 5432:5432 postgres:16

# Django loyihasi va app'lar
django-admin startproject config .
mkdir apps
python manage.py startapp shop apps/shop
python manage.py startapp bot apps/bot

# bot app'i uchun qo'shimcha papkalar
mkdir -p apps/bot/handlers apps/bot/management/commands
touch apps/bot/handlers/__init__.py
touch apps/bot/management/__init__.py
touch apps/bot/management/commands/__init__.py
```

Natijada yuqoridagi to'liq papka tuzilmasi hosil bo'ladi. `apps/shop/apps.py` va `apps/bot/apps.py` fayllarida `name` maydonini to'liq yo'l bilan yozishni unutmang (2-darsda ko'rgan qoidangiz):

```python
# apps/shop/apps.py
class ShopConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.shop"

# apps/bot/apps.py
class BotConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.bot"
```

## Keng tarqalgan xatolar

**Xato 1:** PostgreSQL konteynerini ishga tushirgach, `-p 5432:5432` portini ko'rsatishni unutish.
❌ Konteyner ishlab turibdi (`docker ps`da ko'rinadi), lekin Django `localhost:5432`ga ulanolmaydi, chunki port kompyuterga "ochilmagan".
✅ To'g'ri: `docker run` buyrug'ida har doim `-p <tashqi_port>:<ichki_port>` formatini aniq ko'rsating — `5432:5432` eng oddiy va tez-tez ishlatiladigan variant.

**Xato 2:** `bot` app'ini yaratib, lekin unga tegishli `models.py`ni ham to'ldirishga urinish.
❌ `Product`, `Order` kabi modellarni `apps/bot/models.py`ga yozib qo'yish — bu 19-darsdagi asosiy arxitektura printsipini (data va bot mantig'ini ajratish) buzadi va kelajakda qiyinchilik tug'diradi.
✅ To'g'ri: barcha modellar **faqat** `apps/shop/models.py`da, `bot` app'i esa ularni faqat **import qilib ishlatadi** (`from apps.shop.models import Product`).

**Xato 3:** Docker konteynerini `--name` bermasdan ishga tushirish, keyin uni topa olmay qolish.
❌ Nomsiz konteynerlar tasodifiy generatsiya qilingan nom (`festive_einstein` kabi) oladi, keyinroq uni to'xtatish yoki o'chirish uchun `docker ps` orqali qidirish kerak bo'ladi.
✅ To'g'ri: har doim `--name pg_bot_db` kabi aniq, tushunarli nom bering — bu keyingi `docker stop pg_bot_db`, `docker logs pg_bot_db` kabi buyruqlarni osonlashtiradi.

## Mashq/topshiriq

**(Oson)** Docker orqali `library_db` nomli PostgreSQL konteynerini (`libuser`/`libpassword` bilan) ishga tushiring va `docker ps` orqali uning ishlab turganini tasdiqlang.

**(O'rtacha)** Yangi Django loyiha yarating, ichida `catalog` (ma'lumotlar) va `telegram` (bot mantig'i) nomli ikkita app tashkil qiling — 19-darsdagi `shop`/`bot` naqshiga o'xshab. Har ikkalasini ham `INSTALLED_APPS`ga to'liq yo'l bilan qo'shing.

**(Qiyin)** `apps/bot/handlers/`, `apps/bot/management/commands/` papkalarini to'liq to'g'ri (`__init__.py` fayllari bilan) qurib, `python manage.py runbot` buyrug'ini ishga tushirishga urinib ko'ring (hali `runbot.py` yozilmagani uchun "Unknown command" xatosi chiqishi kutiladi). Bu xato xabarini o'qib, nima uchun aynan shu xato chiqayotganini (25-darsda hal qilinadigan muammoni) tushuntirib bering.

<details>
<summary>Javoblarni ko'rish</summary>

1. `docker run -d --name library_db -e POSTGRES_DB=library -e POSTGRES_USER=libuser -e POSTGRES_PASSWORD=libpassword -p 5432:5432 postgres:16`; `docker ps` natijasida `library_db` ko'rinishi kerak.
2. Ikkala app ham `startapp` orqali yaratilib, `INSTALLED_APPS`ga `"apps.catalog"`, `"apps.telegram"` sifatida qo'shiladi (`apps.py`dagi `name` mos ravishda sozlangan holda).
3. `python manage.py runbot` — `Unknown command: 'runbot'` xatosini beradi, chunki Django management command'larni faqat `INSTALLED_APPS`ga kiritilgan app'larning `management/commands/` papkasidan qidiradi, va hozircha bu papkada `runbot.py` fayli mavjud emas (yoki `bot` app'i hali `INSTALLED_APPS`ga qo'shilmagan) — bu muammo 25-darsda `runbot.py` yozilgach hal bo'ladi.

</details>

## Qisqacha xulosa

PostgreSQL'ni Docker orqali (`docker run` bilan, aniq `--name`, `-e` muhit o'zgaruvchilari va `-p` port bog'lanishi bilan) ishga tushirish — mahalliy o'rnatishdan tezroq va toza yechim; loyiha strukturasida esa **`shop`** (sof ma'lumotlar qatlami — modellar va admin) va **`bot`** (faqat Telegram mantig'i) app'larini qat'iy ajratish — bu kelajakda loyihaga web-sayt yoki boshqa interfeys qo'shilganda, ma'lumotlar qatlamini qayta yozmasdan qayta ishlatish imkonini beruvchi muhim arxitektura qarori hisoblanadi.
