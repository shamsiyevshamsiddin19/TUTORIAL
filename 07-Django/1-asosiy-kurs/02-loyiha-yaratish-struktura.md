# Loyiha yaratish va professional struktura

## Bu darsda nimalarni o'rganasiz

- `django-admin startproject` va `manage.py startapp` buyruqlari orasidagi farqni tushuntira olasiz
- Yangi Django loyihasini to'g'ri yarata olasiz
- "Project" va "App" tushunchalarini farqlay olasiz
- Professional loyiha papkasi tuzilmasini qura olasiz

## Nazariy qism

### Project va App — ikki xil tushuncha

Django'da ikki darajali tuzilma bor, va bu farqni birinchi kundanoq tushunish keyingi hamma narsani osonlashtiradi:

| Tushuncha | Nima | Misol |
|---|---|---|
| **Project** | Butun sayt/tizim — global sozlamalar, bosh URL marshrutizatori | `config` yoki `myproject` |
| **App** | Loyiha ichidagi bitta mustaqil modul, bitta mas'uliyat bilan | `blog`, `users`, `shop` |

Bitta project ichida ko'plab app bo'lishi mumkin. Masalan, onlayn-do'kon loyihasida: `users` (foydalanuvchilar), `products` (tovarlar), `orders` (buyurtmalar) — har biri alohida app, lekin hammasi bitta project ichida ishlaydi.

### Loyiha yaratish

```bash
django-admin startproject config .
```

Bu yerda oxiridagi **nuqta (`.`)** juda muhim — u Django'ga "loyihani joriy papkaning o'zida yarat, yana bitta ichki papka ochma" deydi. Agar nuqtani qoldirsangiz, Django ikkita bir xil nomli ichma-ich papka yaratadi (`config/config/`), bu keyinchalik chalkashlik keltirib chiqaradi.

Natijada quyidagi fayllar paydo bo'ladi:

```
config/
├── __init__.py
├── settings.py      # Loyihaning barcha global sozlamalari
├── urls.py           # Bosh URL marshrutizatori
├── wsgi.py            # Production serverlar (Gunicorn) uchun kirish nuqtasi
└── asgi.py            # Async serverlar uchun kirish nuqtasi
manage.py              # Loyiha bilan ishlash uchun buyruq-qatori vositasi
```

### App yaratish

```bash
python manage.py startapp blog
```

Bu buyruq `blog/` nomli yangi papka yaratadi:

```
blog/
├── migrations/       # DB o'zgarishlari tarixi (6-darsda batafsil)
├── __init__.py
├── admin.py           # Admin panelga ro'yxatdan o'tkazish
├── apps.py             # App konfiguratsiyasi
├── models.py            # Ma'lumotlar tuzilishi
├── tests.py              # Testlar
└── views.py               # Biznes mantiq
```

> ⚠️ Yangi yaratilgan app'ni ishlatish uchun uni **`settings.py`dagi `INSTALLED_APPS` ro'yxatiga qo'shish shart** — aks holda Django uning `models.py`, `admin.py` fayllarini umuman ko'rmaydi.

### Professional loyiha strukturasi

Kichik o'quv loyihasida yuqoridagi oddiy tuzilma yetarli. Lekin real loyihada, ayniqsa bir nechta app bo'lganda, quyidagi tuzilma tavsiya etiladi — bu keyingi barcha darslarda asos sifatida ishlatiladi:

```
myproject/
├── .env                        # Maxfiy sozlamalar — Git'ga qo'shilmaydi
├── .gitignore
├── requirements.txt
├── manage.py
│
├── config/                     # Loyiha "miyasi"
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── apps/                        # Barcha ilovalar shu yerda jamlanadi
│   ├── users/
│   ├── blog/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── admin.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── templates/blog/
│   └── core/                      # Umumiy narsalar (base template, utils)
│
├── templates/                    # Global shablonlar
├── static/                       # CSS/JS/rasm
└── media/                        # Foydalanuvchi yuklagan fayllar
```

Agar app'larni `apps/` papkasi ichiga joylashtirsangiz, `INSTALLED_APPS`da va import qilganda to'liq yo'lni ko'rsatish kerak bo'ladi: `apps.blog` (shunchaki `blog` emas).

## Amaliy misol

Blog loyihasini noldan yaratish, to'liq ketma-ketlik:

```bash
mkdir blog_loyiha && cd blog_loyiha
python -m venv venv
source venv/bin/activate
pip install django

# Project yaratish (joriy papkada, nuqta bilan!)
django-admin startproject config .

# apps/ papkasini yaratib, ichiga app qo'shish
mkdir apps
python manage.py startapp blog apps/blog
```

`config/settings.py` ichida `INSTALLED_APPS`ga qo'shish:

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "apps.blog",   # yangi app — to'liq yo'l bilan
]
```

Ishga tushirib tekshirish:

```bash
python manage.py runserver
```

Brauzerda `http://127.0.0.1:8000/` ochilsa — Django'ning "raketa" sarlavhali standart sahifasi ko'rinadi. Bu — loyihangiz to'g'ri sozlanganining birinchi belgisi.

## Keng tarqalgan xatolar

**Xato 1:** `startproject` buyrug'ida oxiridagi nuqtani unutish.
❌ `django-admin startproject config` — bu `config/config/settings.py` kabi ikki qavatli, keraksiz tuzilma yaratadi.
✅ To'g'ri: `django-admin startproject config .` — nuqta loyihani joriy papkada, bitta qavatda yaratadi.

**Xato 2:** yangi app yaratilgach, uni `INSTALLED_APPS`ga qo'shishni unutish.
❌ App yaratilgan, lekin `python manage.py makemigrations` ishga tushirilganda u hech qanday o'zgarishni ko'rmaydi, chunki Django bu app haqida umuman bilmaydi.
✅ To'g'ri: har bir yangi app yaratilgandan so'ng, darhol `settings.py`dagi `INSTALLED_APPS`ga qo'shib qo'ying — bu odatni darhol shakllantiring.

**Xato 3:** app'ni `apps/` papkasi ichiga joylashtirib, lekin `INSTALLED_APPS`da to'liq yo'lni ko'rsatmaslik.
❌ `INSTALLED_APPS = [..., "blog"]` — Django `blog` nomli app'ni ildiz papkada qidiradi va topolmaydi (`ModuleNotFoundError`).
✅ To'g'ri: `INSTALLED_APPS = [..., "apps.blog"]` — to'liq Python yo'li ko'rsatilishi shart, xuddi shunday `apps.py`dagi `name` maydonida ham.

## Mashq/topshiriq

**(Oson)** Yangi `portfolio` nomli loyiha yarating (project nomi — `config`), ichida `projects` nomli app yarating. `python manage.py runserver` orqali standart Django sahifasini ko'ring.

**(O'rtacha)** Yuqoridagi loyihada `apps/` papkasi tuzilmasiga o'ting: `projects` app'ini `apps/projects/` ga ko'chiring (yoki qayta yarating), `INSTALLED_APPS` va `apps/projects/apps.py`dagi `name` maydonini to'g'ri sozlang.

**(Qiyin)** Bitta project ichida ikkita app yarating: `blog` va `comments`. `comments` app'i kelajakda `blog` bilan bog'lanishi kerak (buni 4-darsda ForeignKey orqali ko'rasiz). Hozircha ikkalasini ham to'g'ri `INSTALLED_APPS`ga qo'shib, `python manage.py runserver` xatosiz ishga tushishini tasdiqlang.

<details>
<summary>Javoblarni ko'rish</summary>

1. `django-admin startproject config .` va `python manage.py startapp projects` buyruqlaridan so'ng, `INSTALLED_APPS`ga `"projects"` qo'shilgan bo'lishi kerak. Server ishga tushganda standart "raketa" sahifasi ko'rinadi.
2. `apps/projects/apps.py` ichidagi `name = "apps.projects"` bo'lishi, `INSTALLED_APPS`da esa `"apps.projects"` yozilishi kerak — ikkalasi mos kelmasa, Django xato beradi.
3. Ikkala app ham (`"apps.blog"`, `"apps.comments"`) `INSTALLED_APPS`da bo'lishi, va `python manage.py runserver` hech qanday `ModuleNotFoundError` bermasdan ishga tushishi kerak.

</details>

## Qisqacha xulosa

Django'da **project** — butun tizimning global sozlamalarini o'z ichiga oladigan qobiq, **app** esa loyiha ichidagi bitta mustaqil, mas'uliyati aniq modul (masalan, faqat blog yoki faqat foydalanuvchilar) hisoblanadi; `django-admin startproject config .` (nuqta bilan!) orqali project, `python manage.py startapp` orqali app yaratiladi, va har bir yangi app albatta `INSTALLED_APPS` ro'yxatiga qo'shilishi shart — aks holda Django u haqida hech narsa bilmaydi. Professional loyihalarda barcha app'lar `apps/` papkasi ostida jamlanadi, bu esa loyiha kattalashganda tartibni saqlab qoladi.
