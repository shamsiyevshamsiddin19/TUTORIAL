# 🚀 FastAPI: 20 Kunlik Amaliy Intensiv Kurs — Noldan Production Loyihagacha

> _Ushbu darslik zamonaviy, yuqori tezlikka ega **FastAPI** framework'ini bosqichma-bosqich, to'liq amaliyot asosida o'rgatuvchi 20 kunlik intensiv dasturdir. Noldan (HTTP va API asoslaridan) boshlab, PostgreSQL, SQLAlchemy ORM, JWT autentifikatsiya, Alembic migratsiyalari, Pytest bilan testlash, WebSockets, Background Tasks, Redis keshlash, Docker va Docker Compose orqali to'liq ishlab turgan **Blog API** loyihasini production darajasida yaratish va internetga deploy qilishgacha bo'lgan barcha bosqichlarni qamrab oladi._

---

## 📌 Darslik Haqida

Bugungi kunda **FastAPI** — Python ekotizimida yuqori unumdorlikka ega backend tizimlar, mikroxizmatlar (microservices), sun'iy intellekt (ML/AI) API'lari va zamonaviy web ilovalar yaratishda eng ommabop va talabgir framework hisoblanadi. U **Starlette** (asinxronlik va tezlik) hamda **Pydantic** (kuchli ma'lumotlar validatsiyasi va serializatsiya) asosiga qurilgan bo'lib, Node.js va Go bilan bellasha oladigan tezlikni taqdim etadi.

### Kursning o'ziga xosligi va formati:
1. **Intensiv sprint tizimi (Har 2 kun = bitta modul):** Kurs 10 ta 2 kunlik intensiv bloklarga bo'lingan. Har bir blokda aniq bitta texnologiya o'rganiladi va loyihaga qo'shiladi.
2. **"Qadam-baqadam qurish" metodologiyasi:** Darslarda alohida-alohida parcha misollar emas, balki birinchi kundan boshlab bosqichma-bosqich kengayib boruvchi **yagona yirik Blog API loyihasi** quriladi.
3. **Nazariya + Amaliyot + Xatolar bilan ishlash:** Har bir dars o'rtacha 3–5 soatlik vaqtga mo'ljallangan bo'lib, unda tushunchalar oddiy hayotiy misollar, to'liq ishchi kodlar, yuzaga keladigan xatolar va ularning yechimlari bilan yoritilgan.
4. **To'liq platformalar qamrovi:** Barcha buyruqlar **Linux (Ubuntu)**, **macOS** va **Windows** uchun batafsil keltirilgan.

---

## 🎯 Kurs Kimlar Uchun Mo'ljallangan?

- **Python dasturchilar:** Python sintaksisi va OOP asoslarini bilib, backend yo'nalishida professional API ishlab chiqishni o'rganmoqchi bo'lganlar;
- **Django va Flask foydalanuvchilari:** Og'ir monolitlardan yoki sinxron kodlardan zamonaviy asinxron (async/await) microframework'larga o'tmoqchi bo'lganlar;
- **Frontend dasturchilar:** React, Vue, Next.js yoki mobil (Flutter, React Native) ilovalari uchun mustaqil ravishda tezkor va xavfsiz REST API yaratishni istovchilar;
- **DevOps va Junior Backend'chilar:** Ma'lumotlar bazasi bilan ishlash, JWT token xavfsizligi, kesh (Redis), konteynerlar (Docker) va CI/CD orqali deploy qilishni noldan o'z qo'llari bilan amalda ko'rishni xohlovchilar.

### Boshlang'ich talablar (Prerequisites):
- Python asoslari (o'zgaruvchilar, funksiyalar, lug'atlar, sikllar, klasslar);
- Terminal / Buyruqlar satri (Command Line) bilan ishlash bo'yicha boshlang'ich tushuncha;
- Internet, HTTP va brauzer qanday ishlashi haqida umumiy tasavvur.

---

## 📋 To'liq Darslar Mundarijasi (20 Kunlik Reja)

Quyidagi jadvalda darslikning barcha 10 ta moduli, o'rganiladigan kunlar va tegishli fayllar keltirilgan:

| № | Kunlar | Mavzu nomi | Asosiy Ko'nikmalar & Texnologiyalar | Darslik Fayli |
|:---:|:---:|:---|:---|:---:|
| **01** | **1-2 Kun** | **FastAPI: Boshlanish va Asoslar** | FastAPI nima, Virtual muhit, Path & Query parametrlar, Pydantic modellar, Response Model, `.env` | [01-02-kun-fastapi-asoslari.md](file:///home/shamsiddin/Documents/shamsiyev/darsliklar/Dasturlash/FastAPI-Darslik/FastAPI-20-Kunlik-Amaliy-Darslik/01-02-kun-fastapi-asoslari.md) |
| **02** | **3-4 Kun** | **SQLAlchemy va PostgreSQL** | PostgreSQL o'rnatish, SQLAlchemy ORM, Models, Schemas, CRUD amaliyotlari, Pagination, Search | [03-04-kun-sqlalchemy-va-postgresql.md](file:///home/shamsiddin/Documents/shamsiyev/darsliklar/Dasturlash/FastAPI-Darslik/FastAPI-20-Kunlik-Amaliy-Darslik/03-04-kun-sqlalchemy-va-postgresql.md) |
| **03** | **5-6 Kun** | **Autentifikatsiya — JWT Token va Xavfsizlik** | JWT tuzilishi, Parollarni bcrypt bilan xeshlash, OAuth2PasswordRequestForm, `get_current_user` dependency | [05-06-kun-autentifikatsiya-jwt-token.md](file:///home/shamsiddin/Documents/shamsiyev/darsliklar/Dasturlash/FastAPI-Darslik/FastAPI-20-Kunlik-Amaliy-Darslik/05-06-kun-autentifikatsiya-jwt-token.md) |
| **04** | **7-8 Kun** | **Alembic — Database Migration Tizimi** | Migratsiya nima, `alembic init`, `env.py` sozlash, autogenerate, `upgrade head`, `downgrade`, Rollback | [07-08-kun-alembic-migratsiyalar.md](file:///home/shamsiddin/Documents/shamsiyev/darsliklar/Dasturlash/FastAPI-Darslik/FastAPI-20-Kunlik-Amaliy-Darslik/07-08-kun-alembic-migratsiyalar.md) |
| **05** | **9-10 Kun** | **CORS va Deployment — Internetga Chiqamiz** | CORS nima, CORSMiddleware, Gunicorn + Uvicorn workerlar, EC2/Render deploy, Environment boshqaruvi | [09-10-kun-cors-va-deployment.md](file:///home/shamsiddin/Documents/shamsiyev/darsliklar/Dasturlash/FastAPI-Darslik/FastAPI-20-Kunlik-Amaliy-Darslik/09-10-kun-cors-va-deployment.md) |
| **06** | **11-12 Kun** | **Pytest bilan Testing — Ishonchli API** | Pytest asoslari, TestClient, Test DB (SQLite/PostgreSQL), Fixtures, CRUD & Auth testlari, Coverage (`pytest-cov`) | [11-12-kun-pytest-bilan-testing.md](file:///home/shamsiddin/Documents/shamsiyev/darsliklar/Dasturlash/FastAPI-Darslik/FastAPI-20-Kunlik-Amaliy-Darslik/11-12-kun-pytest-bilan-testing.md) |
| **07** | **13-14 Kun** | **Real-Time va Asinxron Vazifalar** | WebSockets (jonli chat), ConnectionManager, JWT WebSocket himoyasi, `BackgroundTasks` (Email), Fayl yuklash | [13-14-kun-websockets-va-background-tasks.md](file:///home/shamsiddin/Documents/shamsiyev/darsliklar/Dasturlash/FastAPI-Darslik/FastAPI-20-Kunlik-Amaliy-Darslik/13-14-kun-websockets-va-background-tasks.md) |
| **08** | **15-16 Kun** | **Redis va Caching — 10x Tezlik** | Redis RAM kesh, Redis CLI, GET endpoint kesh, Cache invalidation, Rate Limiting (slowapi), Session saqlash | [15-16-kun-redis-va-caching.md](file:///home/shamsiddin/Documents/shamsiyev/darsliklar/Dasturlash/FastAPI-Darslik/FastAPI-20-Kunlik-Amaliy-Darslik/15-16-kun-redis-va-caching.md) |
| **09** | **17-18 Kun** | **Docker — Istalgan Joyda Ishlaydi** | Dockerfile, `docker-compose.yml` (FastAPI + Postgres + Redis), Volumes, Networks, Multi-stage builds, CI auto build | [17-18-kun-docker-va-konteynerlashtirish.md](file:///home/shamsiddin/Documents/shamsiyev/darsliklar/Dasturlash/FastAPI-Darslik/FastAPI-20-Kunlik-Amaliy-Darslik/17-18-kun-docker-va-konteynerlashtirish.md) |
| **10** | **19-20 Kun** | **Yakuniy Katta Loyiha — Blog API** | Barcha modullarni birlashtirish: Postlar, Foydalanuvchilar, Kategoriyalar, Izohlar, Likelar, Docker & Cloud deploy | [19-20-kun-yakuniy-loyiha-blog-api.md](file:///home/shamsiddin/Documents/shamsiyev/darsliklar/Dasturlash/FastAPI-Darslik/FastAPI-20-Kunlik-Amaliy-Darslik/19-20-kun-yakuniy-loyiha-blog-api.md) |

---

## 📖 Modullar Bo'yicha Batafsil Sharh ("Haqida")

### 🔹 01-modul (1-2 Kun): FastAPI Boshlanish va Asoslar
Bu modulda siz FastAPI falsafasi, uning Flask va Django'dan farqlari, virtual muhit yaratish va birinchi API endpoint yozishni o'rganasiz. Python 3.6+ Type Hint'lari, Pydantic kutubxonasi orqali kiruvchi ma'lumotlarni qat'iy tekshirish, Path va Query parametrlar, HTTP status kodlari (`200 OK`, `201 Created`, `404 Not Found`), biznes xatoliklarini `HTTPException` orqali to'g'ri qaytarish va Pydantic Settings yordamida `.env` konfiguratsiya fayllari bilan ishlash to'liq o'zlashtiriladi.

### 🔹 02-modul (3-4 Kun): SQLAlchemy va PostgreSQL
Haqiqiy ma'lumotlar bazasi bilan ishlash vaqti! PostgreSQL ma'lumotlar bazasini o'rnatish, unga ulanish satri (Connection String), SQLAlchemy ORM yordamida jadvallar modelini (`models.py`) yaratish va Pydantic sxemalari (`schemas.py`) bilan ORM obyektlari o'rtasidagi farqni tushunasiz. To'liq CRUD (Create, Read, Update, Delete) operatsiyalari, server tomonda qidiruv (Search) va katta hajmdagi ma'lumotlar uchun sahifalash (Pagination: `skip`, `limit`) mexanizmlari quriladi.

### 🔹 03-modul (5-6 Kun): Autentifikatsiya — JWT Token va Xavfsizlik
Backend tizimining eng muhim bo'g'ini — xavfsizlik. HTTP "stateless" (xotirasiz) protokol bo'lgani sababli, foydalanuvchini har bir so'rovda qanday tanish mumkinligi o'rganiladi. Parollarni ochiq holda saqlamasdan, `passlib` va `bcrypt` orqali bir tomonlama xeshlash, kirish (Login) endpointida JSON Web Token (JWT) yaratish, maxfiy kalit (`SECRET_KEY`) bilan imzolash va FastAPI ning kuchli `Depends` mexanizmi orqali himoyalangan endpointlar (`get_current_user`) yaratiladi. Foydalanuvchi faqat o'zi yaratgan postlarni tahrirlashi yoki o'chira olishi ta'minlanadi.

### 🔹 04-modul (7-8 Kun): Alembic — Database Migration Tizimi
Ma'lumotlar bazasi jadvallariga o'zgartirish kiritish real hayotda doimiy uchraydigan holat. `create_all` faqat jadval bo'lmaganda yaratadi, lekin mavjud jadvalga yangi ustun qo'sha olmaydi. Ushbu modulda Alembic migratsiya vositasi o'rganiladi: `alembic init`, `env.py` faylini loyihamiz modellari bilan bog'lash, avtomatik migratsiyalar yaratish (`--autogenerate`), bazani yangilash (`upgrade head`) hamda kutilmagan xatoliklarda versiyani ortga qaytarish (`downgrade`).

### 🔹 05-modul (9-10 Kun): CORS va Deployment
Brauzerlarning Same-Origin xavfsizlik siyosati tufayli Frontend (masalan: `http://localhost:3000`) va Backend (`http://localhost:8000`) bir-biri bilan to'g'ridan-to'g'ri gaplasha olmaydi. `CORSMiddleware` orqali ruxsat berilgan domenlarni sozlash o'rganiladi. So'ngra production muhiti uchun Gunicorn serverini Uvicorn workerlari bilan sozlash, loyihani GitHub omboriga yuklash va uni Render / AWS EC2 bulutli serverlariga deploy qilish jarayoni amalda bajariladi.

### 🔹 06-modul (11-12 Kun): Pytest bilan Testing
Katta backend tizimlarida bir yangi qator kod avvalgi o'nlab funksiyalarni buzib qo'ymasligiga kafolat beruvchi yagona narsa — bu avtomatlashtirilgan testlardir. FastAPI ning `TestClient` vositasi, `pytest` framework'i, testlar uchun alohida SQLite xotiradagi (in-memory) yoki vaqtinchalik test bazasi sozlash, `@pytest.fixture`lar yaratish, ro'yxatdan o'tish, login, post yaratish va ruxsatlarni tekshiruvchi testlar yoziladi. Kod qamrovi (`pytest --cov`) hisoboti tuziladi.

### 🔹 07-modul (13-14 Kun): Real-Time va Asinxron Vazifalar
An'anaviy HTTP protokoli real-vaqtli aloqa (chat, jonli xabarlar) uchun sekin va og'ir. Ushbu modulda ikki tomonlama doimiy kanal ochuvchi **WebSockets** texnologiyasi o'rganiladi: `ConnectionManager` klassi orqali yuzlab faol ulanishlarni boshqarish, xabarlarni barchaga tarqatish (broadcast) va tokenni tekshirish. Shuningdek, so'rov vaqtida foydalanuvchini kuttirib qo'ymaslik uchun og'ir vazifalarni (email jo'natish, faylni qayta ishlash) fonda bajaruvchi `BackgroundTasks` mexanizmi amalda tatbiq etiladi.

### 🔹 08-modul (15-16 Kun): Redis va Caching (10x Tezlik)
Har safar bir xil postlar ro'yxatini PostgreSQL diskidan o'qish server resurslarini zoe ketkazadi. Redis — tezkor xotira (RAM) ma'lumotlar ombori orqali tez-tez so'raladigan ma'lumotlar keshlashni o'rganasiz. Kesh muddati (TTL), ma'lumot yangilanganda keshni tozalash (Cache Invalidation), foydalanuvchilar serverni so'rovlar bilan "bombardimon" qilmasligi uchun so'rovlarni cheklash (Rate Limiting) va xavfsiz sessiyalarni boshqarish ko'rib chiqiladi.

### 🔹 09-modul (17-18 Kun): Docker va Konteynerlashtirish
"Mening kompyuterimda ishlayotgan edi, lekin serverda ishlamadi" muammosiga abadiy chek qo'yish! Docker nima, Dockerfile qanday yoziladi, `.dockerignore` nima uchun muhim. So'ngra bitta `docker compose up` buyrug'i bilan FastAPI serveri, PostgreSQL ma'lumotlar bazasi va Redis kesh tizimini bitta virtual tarmoqda (network) bir zumda ishga tushirish, hajmlar (volumes) orqali ma'lumotlarni saqlab qolish va Multi-stage build orqali yakuniy konteyner hajmini 100MB gacha qisqartirish o'rganiladi.

### 🔹 10-modul (19-20 Kun): Yakuniy Katta Loyiha — Blog API
Barcha 18 kun davomida o'rganilgan barcha bilimlar bitta yirik, to'laqonli ishlab turgan tizimga birlashtiriladi:
- Foydalanuvchilar (Registration, Login, Rollar, JWT)
- Postlar (CRUD, Qidiruv, Pagination, Rasm yuklash)
- Kategoriyalar va Teglar (ko'pga-ko'p bog'lanish)
- Izohlar (Comments) va WebSockets orqali jonli yangilanish
- Likelar tizimi
- Redis bilan kesh va Rate Limiting
- Loglar tizimi (Logging Middleware)
- Docker bilan konteynerlashtirish va production bulutga deploy qilish.

---

## 🏗️ Yakuniy Loyiha Arxitekturasi

Quyidagi diagrammada siz 20 kun davomida quradigan tizimning umumiy ishlash chizmasi tasvirlangan:

```mermaid
graph TD
    Client["Mijoz (Brauzer / Mobil ilova / Postman)"] -->|HTTP / REST API| Nginx["Nginx Teskari Proksi"]
    Client -->|WebSocket (Jonli aloqa)| Nginx
    Nginx -->|Proxy Pass| FastAPI["FastAPI Ilovasi (Uvicorn / Gunicorn)"]

    subgraph "FastAPI Ichki Arxitekturasi"
        FastAPI --> Auth["JWT Autentifikatsiya & RBAC"]
        FastAPI --> Routers["APIRouter (Posts, Users, Comments)"]
        FastAPI --> Validation["Pydantic Validatsiya (Schemas)"]
        FastAPI --> BgTasks["BackgroundTasks (Email / Fayllar)"]
        FastAPI --> WSManager["WebSocket ConnectionManager"]
    end

    Routers -->|ORM So'rovlari| SQLAlchemy["SQLAlchemy ORM + Alembic"]
    SQLAlchemy -->|Ma'lumotlarni saqlash| Postgres[("PostgreSQL Ma'lumotlar Bazasi")]

    Routers -->|Tezkor Kesh & Rate Limit| Redis[("Redis (In-Memory Kesh)")]

    subgraph "DevOps Muhiti"
        FastAPI -.-> Docker["Docker & Docker Compose"]
        Postgres -.-> Docker
        Redis -.-> Docker
    end
```

---

## 📁 Yakuniy Loyiha Papkalar Tuzilmasi

```
fastapi_blog/
├── app/
│   ├── __init__.py
│   ├── main.py              # Asosiy ilova, middleware va marshrutlar
│   ├── config.py            # Pydantic Settings (.env konfiguratsiya)
│   ├── database.py          # SQLAlchemy engine va get_db dependency
│   ├── models.py            # Ma'lumotlar bazasi jadvallari (SQLAlchemy)
│   ├── schemas.py           # Pydantic validatsiya sxemalari
│   ├── oauth2.py            # JWT token yaratish, parollar va autentifikatsiya
│   ├── redis_client.py      # Redis ulanishi va kesh yordamchilari
│   ├── websocket.py         # WebSocket ConnectionManager
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # /login va ro'yxatdan o'tish
│       ├── users.py         # Foydalanuvchilar profili
│       ├── posts.py         # Postlar CRUD, kesh va qidiruv
│       ├── categories.py    # Kategoriyalar
│       ├── comments.py      # Izohlar
│       └── likes.py         # Likelar
├── alembic/                 # Alembic migratsiyalar papkasi
│   ├── versions/
│   └── env.py
├── tests/                   # Pytest testlar to'plami
│   ├── conftest.py          # Test ma'lumotlar bazasi va fixturelar
│   ├── test_auth.py
│   ├── test_posts.py
│   └── test_users.py
├── uploads/                 # Yuklangan rasmlar va fayllar
├── logs/                    # Server log fayllari
├── .env                     # Muhit o'zgaruvchilari (maxfiy)
├── .env.example             # Shablon o'zgaruvchilar
├── .gitignore
├── .dockerignore
├── Dockerfile               # Konteyner yaratish ko'rsatmasi
├── docker-compose.yml       # Dev muhit uchun (FastAPI + Postgres + Redis)
├── docker-compose.prod.yml  # Production muhit uchun
├── requirements.txt         # Kerakli Python kutubxonalari
└── alembic.ini              # Alembic asosiy konfiguratsiyasi
```

---

## 💡 O'rganish Bo'yicha Oltin Qoidalar va Maslahatlar

1. ✍️ **Kodni shunchaki o'qimang, qo'lda yozing:** Dasturlashni faqat o'qish bilan o'rganib bo'lmaydi. Har bir darsdagi kodlarni o'z IDE'ingizda (VS Code, PyCharm yoki Antigravity) noldan qo'lda yozing.
2. 🐞 **Xatoliklardan qo'rqmang, ularni o'rganing:** Terminaldagi qizil yozuvlar — sizning eng katta ustozingiz. `Traceback`ni pastdan yuqoriga qarab o'qing. Har bir darsda "Keng tarqalgan xatolar" bo'limi aynan sizga yordam berish uchun kiritilgan.
3. 🌐 **Swagger UI dan to'liq foydalaning:** Har bir yozgan endpointingizni darhol brauzerda `http://localhost:8000/docs` manziliga kirib tekshiring va sinab ko'ring.
4. ⏰ **Kun tartibiga rioya qiling:** Har bir darsga 3–5 soat vaqt ajrating. Modullarni ketma-ket, tartib bilan o'rganing — darslar zanjir kabi bir-biriga bog'langan.

---

## ⚡ Tezkor Ma'lumotnoma (Cheatsheet)

### 🔹 Uvicorn Serverni ishga tushirish:
```bash
# Avtomatik qayta yuklanish (hot-reload) bilan ishga tushirish
python -m uvicorn app.main:app --reload

# Aniq port va host bilan ishga tushirish
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 🔹 Alembic Migratsiya buyruqlari:
```bash
# Migratsiya tizimini birinchi marta sozlash
alembic init alembic

# Modellarga kiritilgan o'zgarishlarni avtomatik aniqlash
alembic revision --autogenerate -m "yangi_ozgarish_tavsifi"

# Migratsiyani bazaga tatbiq etish
alembic upgrade head

# Oxirgi migratsiyani 1 qadam ortga qaytarish
alembic downgrade -1
```

### 🔹 Docker va Docker Compose:
```bash
# Barcha xizmatlarni fonda ishga tushirish
docker compose up -d

# Konteynerlarni qayta build qilib ishga tushirish
docker compose up --build -d

# Loglarni jonli kuzatish
docker compose logs -f api

# Barcha konteynerlarni to'xtatish
docker compose down
```

### 🔹 Pytest bilan testlarni yurgizish:
```bash
# Barcha testlarni ishga tushirish
pytest -v

# Kodning test bilan qamrab olinganlik darajasini ko'rish
pytest --cov=app --cov-report=term-missing
```

---

## 🏆 Kurs Yakunida Siz Nimalarga Ega Bo'lasiz?

- ✅ Zamonaviy RESTful API arxitekturasini chuqur tushunasiz;
- ✅ Asinxron Python dasturlash (`async`/`await`) bo'yicha kuchli amaliy tajriba;
- ✅ PostgreSQL va SQLAlchemy ORM bilan professional ishlash ko'nikmasi;
- ✅ Haqiqiy production xavfsizlik (JWT, Bcrypt, Role-Based Access Control);
- ✅ Redis orqali yuqori yuklamali tizimlarni tezlashtirish (Caching & Rate Limiting);
- ✅ WebSockets orqali real-time ilovalar (Chatlar, Jonli bildirishnomalar);
- ✅ Docker va Docker Compose orqali konteynerlashtirish va bulutga deploy qilish;
- ✅ **Portfoliongiz uchun GitHub'da to'liq tayyor, chiroyli va mukammal Blog API loyihasi!**

🚀 **Keling, 1-kundan boshlaymiz: [01-02-kun-fastapi-asoslari.md](file:///home/shamsiddin/Documents/shamsiyev/darsliklar/Dasturlash/FastAPI-Darslik/FastAPI-20-Kunlik-Amaliy-Darslik/01-02-kun-fastapi-asoslari.md) ga o'ting!**
