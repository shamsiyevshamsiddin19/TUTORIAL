# Docker Compose, production tavsiyalari va yakuniy loyiha — Do'kon boti

## Bu darsda nimalarni o'rganasiz

- `web` va `bot` xizmatlarini Docker Compose orqali bitta umumiy DB bilan birga ishga tushira olasiz
- `healthcheck` va `depends_on` orqali xizmatlar ketma-ketligini to'g'ri boshqara olasiz
- Butun 2-bo'lim davomida o'rgangan bilimni bitta ishlaydigan Do'kon botida birlashtira olasiz
- Production'ga chiqarishdan oldingi xavfsizlik cheklistini qo'llay olasiz

## Nazariy qism

### Docker Compose — uchta xizmatni birga boshqarish

18-darsda ko'rgan arxitektura (bitta DB, ikkita jarayon) — production'da Docker Compose orqali amalga oshiriladi. 1-bo'limning 16-darsida ko'rgan `Dockerfile` bu yerda ham deyarli o'zgarishsiz ishlatiladi, faqat endi **ikkita** xizmat (`web` va `bot`) bitta imidjdan, lekin turli buyruq (`command`) bilan ishga tushiriladi:

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
```

```yaml
# docker-compose.yml
version: "3.9"
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: botdb
      POSTGRES_USER: botuser
      POSTGRES_PASSWORD: botpassword
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U botuser -d botdb"]
      interval: 5s
      timeout: 5s
      retries: 5

  web:
    build: .
    command: >
      sh -c "python manage.py migrate &&
             gunicorn config.wsgi:application --bind 0.0.0.0:8000"
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8000:8000"

  bot:
    build: .
    command: python manage.py runbot
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
      web:
        condition: service_started   # migratsiyalar web tomonidan bajarilishini kutadi

volumes:
  pgdata:
```

### healthcheck va depends_on — nega muhim

`healthcheck` — Docker'ga "PostgreSQL haqiqatan **tayyor** (so'rov qabul qilishga tayyor), shunchaki ishga tushgan emas" ekanini tekshirish usulini beradi. `pg_isready` — PostgreSQL'ning o'z buyrug'i, bu ma'lumotlar bazasi ulanishlarni qabul qilishga tayyor ekanini tasdiqlaydi.

`depends_on: db: condition: service_healthy` — `web` va `bot` xizmatlari, `db`ning shunchaki "ishga tushishini" emas, **healthcheck muvaffaqiyatli o'tishini** kutadi. Bu muhim, chunki PostgreSQL konteyneri "ishga tushdi" deb belgilanishi va u haqiqatan so'rov qabul qilishga tayyor bo'lishi orasida bir necha soniyalik farq bo'lishi mumkin — agar bu farqni hisobga olmasangiz, Django birinchi urinishda DB'ga ulanolmay xato berishi mumkin.

`web: condition: service_started` — `bot` xizmati `web`ning **tugashini** emas, faqat **boshlanishini** kutadi (chunki `web` uzluksiz ishlaydi, hech qachon "tugamaydi"). Bu yerdagi maqsad — migratsiyalar odatda `web` tomonidan bajarilgani uchun, `bot` biroz keyinroq, DB tuzilmasi allaqachon tayyor bo'lgan holatda ishga tushishi.

```bash
docker compose up -d --build
docker compose exec web python manage.py createsuperuser
```

Ikki alohida servis (`web` — admin panel, `bot` — Telegram bot) bitta `db` servisiga ulanadi — aynan 18-darsdagi arxitektura shu tarzda haqiqiy hayotga tatbiq etiladi.

### Production va xavfsizlik tavsiyalari — bo'lim yakuni

- [ ] `SECRET_KEY` va `BOT_TOKEN` `.env`da, `.gitignore`ga qo'shilgan
- [ ] Production'da `DEBUG = False`, `ALLOWED_HOSTS` aniq domen bilan
- [ ] PostgreSQL foydalanuvchisiga faqat kerakli DB ustida huquq berilgan (superuser emas)
- [ ] `DjangoDBMiddleware` (22-dars) botga har doim ulangan — aks holda uzoq muddat ishlagan bot PostgreSQL bilan aloqani yo'qotishi mumkin
- [ ] Har bir yangi ORM chaqiruvida `a`-prefiksli metod ishlatilganiga ishonch hosil qilingan (22-23-darslar)
- [ ] `bot.delete_webhook(drop_pending_updates=True)` polling boshlashdan oldin chaqirilgan (25-dars)
- [ ] Docker Compose'da PostgreSQL uchun `healthcheck` bor — `web`/`bot` DB tayyor bo'lishini kutib ishga tushadi
- [ ] Muntazam DB backup (`pg_dump`) sozlangan — bot va admin panel bitta DB'ga tayanadi, uni yo'qotish ikkalasini ham to'xtatadi

## Amaliy misol

Butun bo'lim davomida qurgan barcha qismlarni birlashtiruvchi, to'liq ishlaydigan "Do'kon boti" — fayl-fayl:

**`apps/shop/models.py`, `apps/shop/admin.py`** — 20 va 21-darslardagidek (`TelegramUser`, `Product`, `Order` + admin ro'yxatdan o'tkazish).

**`apps/bot/loader.py`** — 21-darsdagidek (`Bot`, `Dispatcher`).

**`apps/bot/middlewares.py`** — 22-darsdagidek (`DjangoDBMiddleware`).

**`apps/bot/states.py`:**
```python
from aiogram.fsm.state import StatesGroup, State

class OrderState(StatesGroup):
    quantity = State()
```

**`apps/bot/handlers/user.py`** — 22 va 24-darslardagi barcha handlerlar birlashtirilgan holda (`cmd_start`, `cmd_shop`, `product_selected`, `process_quantity`).

**`apps/bot/management/commands/runbot.py`** — 25-darsdagidek.

**`apps/shop/admin.py`ga qo'shimcha** — 26-darsdagi `confirm_orders` action.

**Ishga tushirish (mahalliy, Docker'siz, development uchun):**
```bash
python manage.py migrate
python manage.py createsuperuser

# 1-terminalda:
python manage.py runserver

# 2-terminalda:
python manage.py runbot
```

**Ishga tushirish (production, Docker Compose orqali):**
```bash
docker compose up -d --build
docker compose exec web python manage.py createsuperuser
```

**To'liq sinov ssenariysi:**

1. `/admin/`dan bir nechta `Product` qo'shing (masalan, "Simsiz quloqchin — 250000", "Klaviatura — 180000").
2. Telegram'da botga `/start`, so'ng `/shop` yuboring.
3. Tovarni tanlang → miqdorni kiriting → buyurtma yaratiladi.
4. `/admin/`dagi **Order** bo'limida yangi buyurtma darhol paydo bo'ladi.
5. Buyurtmani tanlab, "Tanlangan buyurtmalarni tasdiqlash..." action'ini bajaring.
6. Telegram'da foydalanuvchi darhol "✅ Buyurtma tasdiqlandi" xabarini oladi.

Bu ssenariy — 18-darsdan boshlab qurilgan butun arxitekturaning (bitta DB, ikkita jarayon, ikki yo'nalishli aloqa: bot→DB va admin→bot) to'liq, uchdan-uchga ishlashini isbotlaydi.

## Keng tarqalgan xatolar

**Xato 1:** `docker-compose.yml`da `bot` xizmatiga `ports` qo'shishga urinish.
❌ Bot Telegram serveriga **o'zi** so'rov yuboradi (polling), tashqi dunyodan unga to'g'ridan-to'g'ri kirish shart emas — `ports` qo'shish keraksiz va potentsial xavfsizlik teshigi.
✅ To'g'ri: faqat `web` xizmatiga (HTTP orqali kirish kerak bo'lgani uchun) `ports` qo'shing, `bot` xizmatiga umuman kerak emas.

**Xato 2:** `healthcheck`siz `depends_on` ishlatib, DB hali tayyor bo'lmay turib `web`/`bot`ni ishga tushirishga urinish.
❌ `depends_on: - db` (shartsiz) faqat konteynerning **ishga tushirilganini**, DB'ning **tayyor bo'lishini emas** kafolatlaydi — bu ayniqsa sekin kompyuterlarda, ilk ishga tushirishda tasodifiy xatolarga olib keladi.
✅ To'g'ri: har doim `healthcheck` + `condition: service_healthy` birgalikda ishlatilsin — bu DB haqiqatan tayyor bo'lguncha boshqa xizmatlarni "kutib turadi".

**Xato 3:** bo'lim yakunida, xavfsizlik cheklistini "keyinroq qilaman" deb o'tkazib yuborish.
❌ Development'da hammasi ishlaydi, lekin production'ga chiqarilganda `DEBUG=True` qolib ketishi yoki `BOT_TOKEN` Git'ga tushib qolishi kabi jiddiy muammolar keyinroq aniqlanadi.
✅ To'g'ri: xavfsizlik cheklistini loyihaning oxirgi "qo'shimcha" qadami emas, balki **har bir** deploy'dan oldin qat'iy bajariladigan tekshiruv sifatida ko'ring.

## Mashq/topshiriq

**(Oson)** Yuqoridagi to'liq Do'kon botini o'z kompyuteringizda, mahalliy (Docker'siz) rejimda ishga tushiring va to'liq sinov ssenariysini (1-6 qadamlar) bajaring.

**(O'rtacha)** `docker-compose.yml`, `Dockerfile` va `.env` fayllarini yozib, botni Docker Compose orqali ishga tushiring. `docker compose logs -f bot` orqali bot loglarini kuzatib, Telegram'da `/start` yuborganda log yozuvi paydo bo'lishini tasdiqlang.

**(Qiyin)** Xavfsizlik cheklistidagi barcha bandlarni o'z loyihangizga nisbatan tekshiring va har biriga "bajarilgan"/"bajarilmagan" deb belgi qo'ying. Bajarilmagan bandlar bo'lsa, ularni tuzating (masalan, agar hali `DjangoDBMiddleware` ulanmagan bo'lsa, uni ulang). So'ng `docker compose stop bot && docker compose start bot` orqali botni qayta ishga tushirib, u hamon PostgreSQL bilan muammosiz ishlashini (bir necha buyurtma yaratib) tasdiqlang.

<details>
<summary>Javoblarni ko'rish</summary>

1. Barcha 6 qadam muvaffaqiyatli bajarilishi, buyurtma yaratilishi va tasdiqlash xabari Telegram'da ko'rinishi kerak.
2. `docker compose logs -f bot` orqali `INFO:aiogram...` kabi loglar ko'rinishi, `/start` yuborilganda yangi log qatori paydo bo'lishi kerak.
3. Cheklistning barcha bandlari amalda tekshirilib, kamida `DEBUG=False`, `.env`dagi maxfiy ma'lumotlar va `DjangoDBMiddleware` ulanishi tasdiqlanishi kerak; bot qayta ishga tushirilgandan keyin ham (agar middleware to'g'ri ulangan bo'lsa) muammosiz davom etishi kerak — bu aynan 22-darsdagi middleware'ning maqsadga muvofiq ishlayotganining amaliy isboti.

</details>

## Qisqacha xulosa

Docker Compose orqali `db` (PostgreSQL, `healthcheck` bilan), `web` (Django + Gunicorn, migratsiya va admin uchun) va `bot` (Aiogram polling) xizmatlari bitta buyruq bilan, to'g'ri ketma-ketlikda (`depends_on` + `condition: service_healthy`) ishga tushiriladi — bu 18-darsdan boshlangan "bitta DB, ikkita jarayon" arxitekturasining production'dagi yakuniy shakli. Ushbu yakuniy Do'kon boti — model (20-dars) → migratsiya va admin (21-dars) → async ORM va middleware (22-dars) → sync/async ko'prigi (23-dars) → FSM (24-dars) → management command (25-dars) → admin→bot aloqasi (26-dars) → Docker Compose (27-dars) — to'liq zanjirni birlashtiradi, va bu zanjirni chuqur o'zlashtirgan dasturchi endi istalgan Django+Telegram bot integratsiyasini mustaqil qura oladi.
