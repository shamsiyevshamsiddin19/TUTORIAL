# Production: Docker, Gunicorn, Nginx, PostgreSQL

## Bu darsda nimalarni o'rganasiz

- Nega development serveri (`runserver`) production uchun mos emasligini tushuntira olasiz
- `Dockerfile` va `docker-compose.yml` orqali loyihani konteynerlashtira olasiz
- Gunicorn va Nginx'ning har biri qanday vazifa bajarishini farqlay olasiz
- SQLite'dan PostgreSQL'ga o'tishning nima uchun kerakligini tushuntira olasiz

## Nazariy qism

### Nega runserver production uchun mos emas

`python manage.py runserver` — Django rasmiy hujjatida ham aniq yozilganidek, **faqat development uchun** mo'ljallangan: u bir vaqtning o'zida faqat bitta so'rovni qayta ishlaydi (yoki juda cheklangan parallellik bilan), xatoliklarni chiroyli qayta ishlamaydi, va xavfsizlik jihatidan optimallashtirilmagan. Production'da minglab foydalanuvchi bir vaqtda kirishi mumkin bo'lgan tizim uchun boshqa vositalar kerak.

### Uch qatlamli production arxitekturasi

Real production tizimida uchta alohida komponent birga ishlaydi:

```
Foydalanuvchi brauzeri
        │
        ▼
     Nginx (veb-server) ── static/media fayllarni to'g'ridan-to'g'ri beradi
        │
        ▼ (dinamik so'rovlarni Gunicorn'ga uzatadi)
     Gunicorn (WSGI server) ── Django kodini ishga tushiradi, bir nechta "worker" bilan
        │
        ▼
     Django ilova (views, models)
        │
        ▼
     PostgreSQL (ma'lumotlar bazasi)
```

**Nginx** — tashqi dunyo bilan aloqa qiluvchi "old eshik": u statik fayllarni (CSS, JS, rasm) o'zi to'g'ridan-to'g'ri beradi (bu Django orqali berilishidan ancha tez), dinamik so'rovlarni esa Gunicorn'ga yo'naltiradi. **Gunicorn** — Python WSGI server, Django kodini bir nechta parallel "worker" jarayoni orqali ishga tushiradi, bu bir vaqtda ko'p so'rovni qayta ishlash imkonini beradi. **PostgreSQL** — SQLite'dan farqli, ko'p foydalanuvchi bir vaqtda yozish/o'qishni ishonchli boshqaradigan, production-darajadagi ma'lumotlar bazasi.

### Nega SQLite emas, PostgreSQL

Development paytida standart `db.sqlite3` juda qulay — o'rnatish shart emas, bitta fayl. Lekin production'da PostgreSQL afzal, chunki: SQLite bir vaqtning o'zida faqat bitta yozish operatsiyasiga ruxsat beradi (ko'p foydalanuvchili tizimda bu tiqilinch yaratadi), PostgreSQL esa parallel yozish/o'qishni, tranzaksiyalarni, murakkab so'rovlarni ancha yaxshi boshqaradi.

```python
# settings.py — PostgreSQL sozlamasi
DATABASES = {
    "default": env.db("DATABASE_URL", default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}")
}
```

`django-environ`ning `env.db()` metodi `DATABASE_URL` formatidagi qatorni (`postgres://user:password@host:port/dbname`) avtomatik Django DB sozlamalariga aylantiradi — shu bitta qator orqali development'da SQLite, production'da PostgreSQL ishlatish mumkin, kod o'zgarmaydi.

### Dockerfile — loyihani konteynerlashtirish

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
```

`--workers 3` — Gunicorn'ning uchta parallel jarayon bilan ishlashini bildiradi (odatda `(2 x CPU yadro soni) + 1` formula tavsiya etiladi).

### docker-compose.yml — bir nechta xizmatni birga ishga tushirish

```yaml
version: "3.9"
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - pgdata:/var/lib/postgresql/data

  web:
    build: .
    env_file: .env
    depends_on:
      - db
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    depends_on:
      - web

volumes:
  pgdata:
  static_volume:
  media_volume:
```

`volumes` — konteyner o'chirilib qayta yaratilganda ham ma'lumot (DB, static, media) saqlanib qolishini ta'minlaydi.

```nginx
server {
    listen 80;

    location /static/ {
        alias /app/staticfiles/;
    }
    location /media/ {
        alias /app/media/;
    }
    location / {
        proxy_pass http://web:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Amaliy misol

Blog loyihasini to'liq production'ga tayyorlash va ishga tushirish ketma-ketligi:

```bash
# 1. requirements.txt ga production kutubxonalarini qo'shish
pip install gunicorn psycopg2-binary
pip freeze > requirements.txt

# 2. .env faylida production qiymatlari
# DEBUG=False
# SECRET_KEY=production-uchun-uzun-tasodifiy-kalit
# ALLOWED_HOSTS=mysite.uz,www.mysite.uz
# DATABASE_URL=postgres://user:password@db:5432/mydb

# 3. Dockerfile va docker-compose.yml loyiha ildiziga yoziladi (yuqoridagidek)

# 4. Ishga tushirish
docker compose up -d --build

# 5. Migratsiya va superuser (konteyner ichida)
docker compose exec web python manage.py migrate
docker compose exec web python manage.py createsuperuser

# 6. Loglarni kuzatish (muammo bo'lsa)
docker compose logs -f web
```

Bu buyruqlardan so'ng, `http://localhost/` (yoki domen orqali) — Nginx orqali xizmat ko'rsatiladigan, Gunicorn tomonidan ishga tushirilgan, PostgreSQL'ga ulangan to'liq production tizim ishlaydi.

## Keng tarqalgan xatolar

**Xato 1:** production serverda ham `python manage.py runserver` bilan ishga tushirish.
❌ Bir nechta foydalanuvchi bir vaqtda kirganda sayt sekinlashadi yoki "osilib qoladi", chunki development server bunga mo'ljallanmagan.
✅ To'g'ri: production'da har doim Gunicorn (yoki uWSGI) + Nginx kombinatsiyasidan foydalaning, `runserver`ni faqat lokal development uchun ishlating.

**Xato 2:** `docker-compose.yml`da `volumes` ishlatmaslik.
❌ Konteyner qayta ishga tushirilganda (masalan, yangi versiya deploy qilinganda), barcha ma'lumotlar bazasi ma'lumotlari va yuklangan media fayllar **yo'qolib ketadi** — chunki konteyner ichidagi fayl tizimi vaqtinchalik.
✅ To'g'ri: DB ma'lumotlari, static va media fayllar uchun har doim `volumes` belgilang — bu ma'lumotni konteyner hayot davridan mustaqil, doimiy saqlaydi.

**Xato 3:** production `.env`da development qiymatlarini (masalan, `DEBUG=True`, SQLite manzili) qoldirish.
❌ Production PostgreSQL o'rniga hali ham SQLite ishlatilib qoladi — bu bir nechta Gunicorn worker bir vaqtda yozishga uringanda DB qulflanish (`database is locked`) xatolariga olib keladi.
✅ To'g'ri: production `.env` faylini alohida, `DEBUG=False` va to'g'ri `DATABASE_URL` (PostgreSQL) bilan tayyorlang, uni development `.env`dan hech qachon aralashtirmang.

## Mashq/topshiriq

**(Oson)** O'zingizning Django loyihangiz uchun `Dockerfile` yozing (yuqoridagi namunaga asoslanib) va `docker build -t mening-loyiham .` orqali imidj yasang.

**(O'rtacha)** `docker-compose.yml` yozing — `db` (PostgreSQL) va `web` (Django + Gunicorn) xizmatlari bilan, `.env` fayl orqali sozlamalarni ulang. `docker compose up -d --build` orqali ishga tushiring va `docker compose exec web python manage.py migrate` bajaring.

**(Qiyin)** Yuqoridagi tizimga `nginx` xizmatini qo'shing, `nginx.conf` yozing (static/media va proxy_pass sozlamalari bilan). So'ng ataylab `web` xizmatini to'xtatib (`docker compose stop web`) va qayta ishga tushirib (`docker compose start web`), PostgreSQL'dagi ma'lumotlar saqlanib qolganini tasdiqlang — nega bu ma'lumot yo'qolmasligini `volumes` orqali tushuntirib bering.

<details>
<summary>Javoblarni ko'rish</summary>

1. `Dockerfile` yuqoridagi namunaga mos, `docker build -t mening-loyiham .` muvaffaqiyatli imidj yasashi kerak.
2. `docker-compose.yml`da ikkita xizmat, `db` uchun `postgres:16` imidji va environment o'zgaruvchilari, `web` uchun `build: .` va `env_file: .env`; `migrate` muvaffaqiyatli bajarilishi kerak.
3. `nginx.conf`da `location /static/`, `location /media/`, `location /` (proxy_pass) bo'limlari; `web`ni to'xtatib-ishga tushirgandan keyin ham PostgreSQL'dagi ma'lumotlar saqlanib qoladi, chunki `db` xizmati alohida `pgdata` volume'ga yozadi — bu volume konteynerning o'zidan mustaqil, Docker tomonidan alohida boshqariladigan doimiy saqlash joyi, `web` konteyneri qayta ishga tushirilishi unga hech qanday ta'sir qilmaydi.

</details>

## Qisqacha xulosa

Production Django tizimi uchtadan iborat: **Nginx** (static/media fayllarni beradi, dinamik so'rovlarni uzatadi), **Gunicorn** (Django kodini bir nechta parallel worker orqali ishga tushiradi) va **PostgreSQL** (ko'p foydalanuvchili, ishonchli ma'lumotlar bazasi) — bularning barchasi `Dockerfile` va `docker-compose.yml` orqali konteynerlashtirilib, bitta buyruq (`docker compose up -d --build`) bilan ishga tushiriladi; development'dagi `runserver` va SQLite hech qachon production'ga olib chiqilmaydi, va ma'lumotlar (DB, media) `volumes` orqali konteyner hayot davridan mustaqil saqlanadi.
