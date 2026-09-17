<div align="center">

# 🌐 Django

**Modul 07** · 6 bo'lim · 95 dars

<sub>[⬅ 🐘 PostgreSQL](../06-PostgreSQL/) &nbsp;·&nbsp; [🏠 Bosh sahifa](../README.md) &nbsp;·&nbsp; [⚡ FastAPI ➡](../08-FastAPI/)</sub>

</div>

---

> Bu papka (`08-Django/`) Django bo'yicha oltita alohida darslikdan iborat:

| № | Darslik | Papka | Mazmuni |
|---|---|---|---|
| 1 | Django asosiy kursi | [`1-asosiy-kurs/`](1-asosiy-kurs/) | Noldan (muhit tayyorlash) production'gacha to'liq, mustaqil yo'l (17 dars) |
| 2 | Django + Aiogram + PostgreSQL bot | [`2-aiogram-postgresql-bot/`](2-aiogram-postgresql-bot/) | 1-qism bilimiga tayanib real Telegram bot (Do'kon boti) yaratish (10 dars) |
| 3 | Django kod o'qish darsligi | [`3-kod-oqish-darsligi/`](3-kod-oqish-darsligi/) | Tayyor/notanish Django loyihasini o'qish va xavfsiz o'zgartirish mahorati (o'z mundarijasi: `3-kod-oqish-darsligi/README.md`) |
| 4 | Django kutubxonalar bilan ishlash | [`4-kutubxonalar-bilan-ishlash/`](4-kutubxonalar-bilan-ishlash/) | Kutubxona tanlash, integratsiya va bog'liqliklarni boshqarish — `onlayn_dokon` loyihasini kutubxonalar bilan boyitish (o'z mundarijasi: `4-kutubxonalar-bilan-ishlash/README.md`) |
| 5 | Django standart kutubxona modullari | [`5-standart-kutubxona-modullari/`](5-standart-kutubxona-modullari/) | Python standart kutubxonasi (`os`, `datetime`, `json`, `logging`, `secrets` va h.k.) Django loyihasida qanday ishlatilishi va Django'ning o'zi ular ustiga qanday qurilgani — `onlayn_dokon` loyihasida (o'z mundarijasi: `5-standart-kutubxona-modullari/README.md`) |
| 6 | Qo'shimcha konspektlar | [`6-qoshimcha-konspektlar/`](6-qoshimcha-konspektlar/) | Kurs davomida kunma-kun yozib borilgan erkin formatdagi Django konspektlari (o'z mundarijasi: `6-qoshimcha-konspektlar/README.md`) |

_Tavsiya etilgan tartib: 1 → 2, kod o'qish darsligini (3), kutubxonalar darsligini (4) va standart kutubxona darsligini (5) esa asoslarni o'zlashtirgach istalgan vaqtda (3, 4 va 5 bir-biridan mustaqil, istalgan tartibda o'tilishi mumkin)._

---

## 1-QISM — Django asosiy kursi (`1-asosiy-kurs/`)

| № | Mavzu | Fayl |
|---|---|---|
| 01 | Django nima va muhitni tayyorlash | 01-django-nima-muhit-tayyorlash.md |
| 02 | Loyiha yaratish va professional struktura | 02-loyiha-yaratish-struktura.md |
| 03 | MTV arxitektura va sozlamalar (settings/.env) | 03-mtv-arxitektura-sozlamalar.md |
| 04 | Models — maydonlar va relatsiyalar | 04-models-maydonlar-relatsiyalar.md |
| 05 | Migratsiyalar | 05-migratsiyalar.md |
| 06 | Django Admin panel | 06-django-admin-panel.md |
| 07 | Views — Function-based va Class-based | 07-views-fbv-cbv.md |
| 08 | URLs — marshrutlash | 08-urls-marshrutlash.md |
| 09 | Templates — shablon tizimi | 09-templates-shablon-tizimi.md |
| 10 | Forms va ModelForm | 10-forms-modelform.md |
| 11 | Autentifikatsiya, ruxsatlar va Custom User model | 11-autentifikatsiya-custom-user.md |
| 12 | Middleware va Signals | 12-middleware-signals.md |
| 13 | QuerySet optimallashtirish | 13-queryset-optimallashtirish.md |
| 14 | Django REST Framework — API yaratish | 14-django-rest-framework.md |
| 15 | Testlash, Static/Media fayllar va Xavfsizlik cheklisti | 15-testlash-static-xavfsizlik.md |
| 16 | Production: Docker, Gunicorn, Nginx, PostgreSQL | 16-production-docker-gunicorn-nginx.md |
| 17 | Yakuniy loyiha — to'liq Blog ilovasi | 17-yakuniy-loyiha-blog.md |

---

## 2-QISM — Django + Aiogram + PostgreSQL bilan Telegram Bot (`2-aiogram-postgresql-bot/`)

_Ushbu qism 1-qismning to'liq o'zlashtirilishini talab qiladi (ayniqsa models, admin, migratsiya). Bundan tashqari, Aiogram 3'ning asosiy tushunchalari (handler, filter, FSM) bilan oldindan tanishlik tavsiya etiladi._

| № | Mavzu | Fayl |
|---|---|---|
| 18 | Arxitektura g'oyasi va muhitni tayyorlash | 18-arxitektura-muhit-tayyorlash.md |
| 19 | PostgreSQL (Docker) va loyiha strukturasi | 19-postgresql-docker-loyiha-strukturasi.md |
| 20 | Django sozlamalari va modellar (botning "miyasi") | 20-sozlamalar-modellar.md |
| 21 | Migratsiyalar, admin panel va botni Django bilan bog'lash | 21-migratsiya-admin-loader.md |
| 22 | PostgreSQL ulanishini boshqarish va async ORM asoslari | 22-postgresql-ulanish-async-orm.md |
| 23 | SynchronousOnlyOperation xatosi va sync_to_async | 23-synchronousonlyoperation-xatosi.md |
| 24 | FSM + PostgreSQL: bosqichma-bosqich buyurtma olish | 24-fsm-postgresql-buyurtma.md |
| 25 | Management command — botni ishga tushirish (runbot) | 25-management-command-runbot.md |
| 26 | Admin paneldan botga xabar yuborish (async_to_sync) | 26-admin-panel-bot-xabar.md |
| 27 | Docker Compose, production tavsiyalari va yakuniy loyiha (Do'kon boti) | 27-docker-compose-yakuniy-loyiha.md |

---

## 3-QISM — Django kod o'qish darsligi (`3-kod-oqish-darsligi/`)

_Alohida, mustaqil darslik: tayyor yoki notanish Django loyihasini tez o'qib tushunish, xatolarni traceback orqali topish va kodni buzmasdan o'zgartirish mahorati. To'liq mavzular ro'yxati shu papkadagi `README.md` faylida._

| Bob | Mavzu |
|---|---|
| 00 | Kirish — kod o'qish nega alohida mahorat |
| 01 | Loyiha skeleti (settings.py, databases) |
| 02 | App anatomiyasi va import grafi |
| 03 | So'rov hayot yo'li (URL → response) |
| 04 | Models o'qish |
| 05 | Views va templates o'qish |
| 06 | Admin va forms o'qish |
| 07 | Notanish kod o'qish (DRF serializers/viewset) |
| 08 | Xatolarni o'qish (traceback, logging) |
| 09 | Xavfsiz o'zgartirish |
| 10 | Yakuniy imtihon |

---

## 4-QISM — Django kutubxonalar bilan ishlash (`4-kutubxonalar-bilan-ishlash/`)

_Alohida, mustaqil darslik: bir xil vazifa uchun kutubxona tanlash mezonlari, bog'liqliklarni (`requirements.txt`, pip-tools/Poetry) boshqarish, va eng ko'p ishlatiladigan Django kutubxonalarini (sozlash, forma, autentifikatsiya, media, API, fon vazifalar, test) `onlayn_dokon` loyihasiga birma-bir integratsiya qilish. To'liq mavzular ro'yxati shu papkadagi `README.md` faylida._

| Bob | Mavzu |
|---|---|
| 00 | Kirish — pip/PyPI asoslari, kutubxona tanlash mezonlari |
| 01 | Paket va bog'liqliklarni boshqarish (requirements.txt, pip-tools/Poetry) |
| 02 | Sozlash kutubxonalari (django-environ, ko'p muhitli sozlamalar) |
| 03 | Forma va frontend kutubxonalari (crispy-forms, whitenoise) |
| 04 | Autentifikatsiya kutubxonalari (django-allauth, django-axes) |
| 05 | Media va fayllar bilan ishlash (Pillow, django-storages) |
| 06 | API qo'shimchalari (drf-spectacular, django-filter, cors-headers) |
| 07 | Fon vazifalar va kesh (Celery+Redis, django-redis) |
| 08 | Test va kod sifati kutubxonalari (pytest-django, pip-audit) |
| 09 | Yakuniy loyiha — barcha kutubxonalarni birlashtirish |

---

## 5-QISM — Django standart kutubxona modullari (`5-standart-kutubxona-modullari/`)

_Alohida, mustaqil darslik: Python bilan birga keladigan, `pip install` talab qilmaydigan standart kutubxona modullari (`pathlib`, `os`, `datetime`, `zoneinfo`, `re`, `decimal`, `uuid`, `json`, `csv`, `enum`, `secrets`, `hashlib`, `io`, `tempfile`, `shutil`, `logging`, `functools`, `collections`, `argparse`, `subprocess`) Django loyihasida qanday ishlatilishi, va Django'ning o'z imkoniyatlari (`timezone.now()`, `TextChoices`, `UUIDField`, `JSONField`, `LOGGING` sozlamasi, parol hashlash) aynan shu modullar ustiga qanday qurilgani — `onlayn_dokon` loyihasida. To'liq mavzular ro'yxati shu papkadagi `README.md` faylida._

| Bob | Mavzu |
|---|---|
| 00 | Kirish — standart kutubxona va Django asosi, `sys`/`platform` |
| 01 | Fayl tizimi va yo'llar (`pathlib`, `os`) |
| 02 | Sana va vaqt (`datetime`, `zoneinfo`) |
| 03 | Matn va nozik turlar (`re`, `decimal`, `uuid`) |
| 04 | Ma'lumot formatlari (`json`, `csv`, `enum`) |
| 05 | Xavfsizlik va tasodifiylik (`secrets`, `hashlib`) |
| 06 | Xotira va vaqtinchalik fayllar (`io`, `tempfile`, `shutil`) |
| 07 | Diagnostika va unumdorlik (`logging`, `functools`, `collections`) |
| 08 | Buyruq qatori vositalari (`argparse`, `subprocess`) |
| 09 | Yakuniy loyiha — xavfsiz eksport funksiyasi va modul xaritasi |

## Umumiy ma'lumot

- **1-qism (`1-asosiy-kurs/`, 01-17):** Django asosiy kursi — muhit, MTV, models/migratsiya, admin, views (FBV/CBV), URL, templates, forms, autentifikatsiya/Custom User, middleware/signals, QuerySet optimallashtirish, DRF (API), testlash/static/xavfsizlik, production (Docker/Gunicorn/Nginx), yakuniy Blog loyihasi.
- **2-qism (`2-aiogram-postgresql-bot/`, 18-27):** Django+Aiogram+PostgreSQL integratsiyasi — arxitektura, PostgreSQL (Docker), botning modellari, admin+loader, async ORM, sync/async ko'prigi (`sync_to_async`/`async_to_sync`), FSM orqali buyurtma, `runbot` management command, admin→bot aloqasi, Docker Compose orqali yakuniy Do'kon boti.
- **3-qism (`3-kod-oqish-darsligi/`):** notanish Django kodini o'qish, xatolarni topish va xavfsiz o'zgartirish — 11 bob.
- **4-qism (`4-kutubxonalar-bilan-ishlash/`):** kutubxona tanlash, bog'liqliklarni boshqarish va eng ko'p ishlatiladigan Django kutubxonalarini `onlayn_dokon` loyihasiga integratsiya qilish — 10 bob, 20 dars.
- **5-qism (`5-standart-kutubxona-modullari/`):** Python standart kutubxonasi modullarini Django loyihasida qo'llash va Django'ning o'z imkoniyatlari ular ustiga qanday qurilganini tushunish — 10 bob, 20 dars.
- **1+2 qism jami: 27 dars**, noldan (muhitni tayyorlashdan) to production-darajadagi Django loyihasi va Telegram bot integratsiyasigacha to'liq qamrab olingan.
- Har bir dars bir xil tuzilmaga ega: **Bu darsda nimalarni o'rganasiz** → **Nazariy qism** → **Amaliy misol** → **Keng tarqalgan xatolar** (har biri ❌/✅ va SABAB bilan) → **Mashq/topshiriq** (Oson/O'rtacha/Qiyin, javoblari bilan) → **Qisqacha xulosa**.
