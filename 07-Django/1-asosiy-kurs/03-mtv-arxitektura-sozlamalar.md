# MTV arxitektura va sozlamalar (settings/.env)

## Bu darsda nimalarni o'rganasiz

- Django'ning MTV (Model-Template-View) arxitekturasini tushuntira olasiz
- Bitta so'rovning Django ichida qanday yo'l bosib o'tishini tasvirlay olasiz
- `.env` fayl orqali maxfiy sozlamalarni kod'dan ajrata olasiz
- `django-environ` kutubxonasi orqali sozlamalarni o'qiy olasiz

## Nazariy qism

### MTV — Django o'z yo'li bilan boradi

Ko'plab freymvorklar klassik **MVC** (Model-View-Controller) naqshiga amal qiladi. Django esa shunga o'xshash, lekin nomlanishi boshqacha **MTV** (Model-Template-View) tuzilmasini ishlatadi:

| Django'dagi nomi | Vazifasi | Klassik MVC'dagi muqobili |
|---|---|---|
| **Model** | Ma'lumotlar tuzilishi va DB bilan ishlash (ORM) | Model |
| **Template** | HTML — foydalanuvchiga ko'rinadigan qism | View |
| **View** | Biznes mantiq: so'rovni qabul qiladi, Model'dan ma'lumot oladi, Template'ga uzatadi | Controller |

Bu — faqat atama farqi emas, tushunish uchun muhim: Django'da **View** so'z sifatida "nima ko'rinadi" emas, balki "qanday mantiq ishlaydi" degan ma'noni bildiradi. Aksincha, klassik MVC'dagi "View" so'zi Django'da **Template** deb ataladi.

### So'rovning to'liq yo'li

Foydalanuvchi brauzerda biror manzilni ochganda, Django ichida quyidagi ketma-ketlik ishga tushadi:

```
Brauzer so'rov yuboradi
        │
        ▼
   urls.py — qaysi view chaqirilishini aniqlaydi (manzilga qarab)
        │
        ▼
   views.py — biznes mantiq: kerakli ma'lumotni so'raydi
        │
        ▼
   models.py — ma'lumotlar bazasidan kerakli ma'lumotni oladi
        │
        ▼
   templates/*.html — olingan ma'lumot HTML shakliga "quyiladi"
        │
        ▼
   Natija HTML sifatida brauzerga qaytadi
```

Bu zanjirni yodda tutish — Django'da xatolik qidirishning eng birinchi vositasi: agar sahifa noto'g'ri ko'rinsa, avval `urls.py`ni (to'g'ri view chaqirilyaptimi?), keyin `views.py`ni (to'g'ri ma'lumot olinyaptimi?), so'ng `templates/`ni (to'g'ri ko'rsatilyaptimi?) tekshirasiz.

### Nega maxfiy sozlamalarni kod ichida saqlamaslik kerak

`settings.py` faylida `SECRET_KEY` (Django'ning ichki kriptografik kaliti) va ma'lumotlar bazasi paroli kabi juda muhim ma'lumotlar bo'ladi. Agar bu qiymatlarni to'g'ridan-to'g'ri kod ichiga yozib, Git'ga yuklab yuborsangiz — ular butun dunyoga (agar repozitoriya ochiq bo'lsa) yoki hech bo'lmaganda loyihangizga kirish huquqi bor har bir odamga ko'rinadi. Bundan tashqari, development va production muhitlarida turlicha sozlamalar (masalan, `DEBUG=True`/`False`) kerak bo'ladi — buni kod ichida qattiq yozib qo'ysangiz, har safar deploy qilishda kodni qo'lda o'zgartirish kerak bo'ladi.

**Yechim:** maxfiy va muhitga bog'liq qiymatlarni alohida `.env` faylida saqlash, uni `.gitignore`ga qo'shish (Git bu faylni hech qachon kuzatmaydi), va `settings.py` ichida ularni **o'qib** olish.

### django-environ bilan ishlash

```bash
pip install django-environ
```

`.env` fayli (loyiha ildizida):

```
DEBUG=True
SECRET_KEY=django-insecure-shu-yerga-uzun-tasodifiy-satr-yoziladi
ALLOWED_HOSTS=localhost,127.0.0.1
```

`config/settings.py`:

```python
from pathlib import Path
import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(DEBUG=(bool, False))       # DEBUG standart holatda False bo'lsin
environ.Env.read_env(BASE_DIR / ".env")       # .env faylini o'qish

SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])
```

`.gitignore` fayliga qo'shish:

```
.env
venv/
__pycache__/
*.pyc
db.sqlite3
```

## Amaliy misol

To'liq ishlaydigan sozlash jarayoni, noldan:

```bash
pip install django-environ
```

Loyiha ildizida `.env`:

```
DEBUG=True
SECRET_KEY=x8k2mq9p-shu-yerga-uzun-random-satr-yoziladi-3f7d
ALLOWED_HOSTS=localhost,127.0.0.1
```

`config/settings.py`ning tegishli qismi:

```python
from pathlib import Path
import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])

LANGUAGE_CODE = "uz"
TIME_ZONE = "Asia/Tashkent"
```

Tekshirish uchun Django shell orqali:

```bash
python manage.py shell
```
```python
>>> from django.conf import settings
>>> settings.DEBUG
True
>>> settings.ALLOWED_HOSTS
['localhost', '127.0.0.1']
```

Agar `.env`dagi `DEBUG=False` ga o'zgartirsangiz va serverni qayta ishga tushirsangiz, `settings.DEBUG` ham `False` bo'lib qoladi — kodga tegmasdan, faqat `.env` orqali muhitni almashtirdingiz.

## Keng tarqalgan xatolar

**Xato 1:** `.env` faylini `.gitignore`ga qo'shishni unutish.
❌ `SECRET_KEY` va boshqa maxfiy ma'lumotlar Git tarixida abadiy qolib ketadi — hatto keyin `.gitignore`ga qo'shsangiz ham, oldingi commit'larda u hali ham ko'rinadi.
✅ To'g'ri: loyihani boshlagan **birinchi kunidanoq** `.gitignore` faylini yarating va `.env` qatorini eng birinchi qo'shing, keyin birorta commit qilmasdan oldin tekshiring.

**Xato 2:** `env("DEBUG")` ni `bool` turini ko'rsatmasdan o'qish.
❌ `.env`dagi `DEBUG=False` matn ko'rinishida `"False"` deb o'qiladi, va Python'da bo'sh bo'lmagan har qanday satr `True` deb hisoblanadi — natijada `DEBUG` doim `True` bo'lib qoladi, hatto `.env`da `False` yozilgan bo'lsa ham.
✅ To'g'ri: `environ.Env(DEBUG=(bool, False))` orqali turini oldindan belgilang — shunda `django-environ` `"False"` satrini to'g'ri `False` mantiqiy qiymatga aylantiradi.

**Xato 3:** production serverga `.env` faylini unutib qoldirish yoki development qiymatlar bilan yuborish.
❌ Production serverda `DEBUG=True` qolib ketsa, xatolik yuz berganda butun kod, sozlamalar va hatto ma'lumotlar bazasi paroli xato sahifasida ko'rinib qolishi mumkin — bu jiddiy xavfsizlik teshigi.
✅ To'g'ri: production serverga alohida, `DEBUG=False` va haqiqiy domen bilan to'ldirilgan `.env` fayl qo'lda yoki xavfsiz usulda (masalan, server sozlamalari orqali) joylashtiring, hech qachon development `.env`ni ko'chirmang.

## Mashq/topshiriq

**(Oson)** O'zingizning loyihangizda `.env` fayl yarating va `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS` qiymatlarini shu yerga ko'chiring. `python manage.py shell` orqali `settings.DEBUG` qiymatini tekshiring.

**(O'rtacha)** `.env`ga yangi `SITE_NAME=Mening Blogim` qatorini qo'shing va `settings.py`da `SITE_NAME = env("SITE_NAME")` orqali o'qing. Keyin `python manage.py shell`da `settings.SITE_NAME`ni chiqarib ko'ring.

**(Qiyin)** MTV zanjirini qog'ozga (yoki matn ko'rinishida) chizib bering: foydalanuvchi `/blog/1/` manzilini ochganda, so'rov Django ichida qaysi fayllardan (aniq nomlar bilan: `urls.py` → `views.py` → `models.py` → `templates/...`) qanday tartibda o'tishini tasvirlab bering, va har bir bosqichda nima sodir bo'lishini bir gapda tushuntiring.

<details>
<summary>Javoblarni ko'rish</summary>

1. `.env`dagi qiymatlar to'g'ri o'qilgan bo'lsa, `settings.DEBUG` — `.env`da yozilgan qiymatga mos (`True` yoki `False`, mantiqiy tur sifatida, matn emas) bo'lishi kerak.
2. `settings.SITE_NAME` chaqirilganda `"Mening Blogim"` satri qaytishi kerak.
3. Namunaviy javob: (1) `urls.py` — `/blog/1/` manzilini qaysi view'ga tegishli ekanini aniqlaydi; (2) `views.py` — shu view funksiyasi/klassi ishga tushadi, `id=1` bo'lgan postni so'raydi; (3) `models.py` — ORM orqali ma'lumotlar bazasidan mos yozuv olinadi; (4) `templates/blog/post_detail.html` — olingan post ma'lumoti HTML shabloniga joylashtiriladi; (5) tayyor HTML brauzerga javob sifatida qaytariladi.

</details>

## Qisqacha xulosa

Django klassik MVC o'rniga **MTV** (Model-Template-View) arxitekturasidan foydalanadi, bunda har bir so'rov `urls.py → views.py → models.py → templates/` ketma-ketligi bo'ylab o'tadi va HTML natija sifatida qaytadi; `SECRET_KEY`, DB paroli kabi maxfiy ma'lumotlarni esa hech qachon kod ichida emas, alohida `.env` faylida saqlab, `django-environ` orqali `settings.py`ga o'qitish — development va production muhitlarini kodga tegmasdan almashtirish, hamda maxfiy ma'lumotlarni Git'dan himoya qilish imkonini beradi.
