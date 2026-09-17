# Django 1-2 Kun

# 📚Django 1-2 Kun: Sizning Birinchi Django Loyihangiz

## Keling, Biror Narsa Quramiz! 🚀

---

## **1-Qism: Django Nima? (20 daqiqa)**

### **Hikoya: Nega Django Paydo Bo'lgan**

Tasavvur qiling, siz Instagram qurmoqchisiz. Sizga kerak:

- Foydalanuvchilar ro'yxatdan o'tishi va kirishi
- Rasm yuklash
- Like va izoh qoldirish
- Boshqa foydalanuvchilarni kuzatish
- Asosiy sahifa

**Django'siz:** Faqat login tizimini qurish uchun 6 oy sarflaysiz!

**Django bilan:** Login tizimi allaqachon tayyor. Shunchaki foydalaning!

```
Django = Har bir veb-saytga kerak bo'lgan narsalarning 80% i tayyor
```

---

### **Haqiqiy Misol:**

**Instagram Django ishlatadi! Pinterest Django ishlatadi! Spotify Django ishlatadi!**

Nega? Chunki Django sizga beradi:

- ✅ Foydalanuvchi tizimi (tayyor!)
- ✅ Admin panel (tayyor!)
- ✅ Ma'lumotlar bazasi (tayyor!)
- ✅ Xavfsizlik (tayyor!)

Siz faqat o'zingizning noyob qismlarini qurasiz.

---

### **Ko'rib Chiqamiz:**

Bugun nima qurishimizni ko'rsataman:

```
Bugun: Django'ni "Salom Dunyo" deyishiga o'rgatamiz
Shu hafta: Blog qilamiz
Keyingi hafta: Foydalanuvchilar va izohlar qo'shamiz
```

Oddiy qadamlar. Bittadan-bittalab.

---

## **2-Qism: O'rnatish (30 daqiqa)**

### **1-Qadam: Papka Yaratish**

Terminal/command prompt ni oching:

```bash
mkdir mening_birinchi_django
cd mening_birinchi_django
```

**Nima qildik?**

- `mening_birinchi_django` nomli papka yaratdik
- Ichiga kirdik

Bu xuddi kompyuterda yangi papka ochib, ichiga kirishga o'xshaydi.

---

### **2-Qadam: Virtual Muhit**

**Nega bu kerak?**

Tasavvur qiling, sizda 3 ta loyiha bor:

- A loyihasi Django versiya 3 ishlatadi
- B loyihasi Django versiya 4 ishlatadi
- C loyihasi Django versiya 5 ishlatadi

Virtual muhitsiz = 💥 XATO! Ular bir-biri bilan urushadi!

Virtual muhit bilan = 😊 Har bir loyihaning o'z joyi bor

---

**Yaratamiz:**

```bash
python -m venv muhit
```

**Nima bo'ldi?**
Django `muhit` papkasini yaratdi. Bu sizning loyihangiz uchun alohida xona.

---

**Faollashtirish:**

```bash
# Mac/Linux:
source muhit/bin/activate

# Windows:
muhit\Scripts\activate
```

**Ko'rasiz:**

```bash
(muhit) kompyuteringiz:~
```

Bu `(muhit)` degani: "Men endi alohida xonadaman!"

---

### **3-Qadam: Django O'rnatish**

```bash
pip install django
```

30 soniya kuting... Tayyor!

**Tekshiramiz:**

```bash
django-admin --version
```

Ko'rsatishi kerak: `5.0.1` yoki shunga o'xshash

🎉 **Django o'rnatildi!**

---

## **3-Qism: Birinchi Loyihani Yaratish (20 daqiqa)**

### **Sehr Buyrug'i:**

```bash
django-admin startproject saytim .
```

**Muhim:** Oxiridagi nuqtani (`.`) unutmang!

---

### **Django nima yaratdi?**

```
mening_birinchi_django/
├── saytim/
│   ├── settings.py
│   ├── urls.py
│   └── (boshqa fayllar)
└── manage.py
```

**Bu xuddi:**

- `saytim` papkasi = Loyihangizning miyasi (hammasini boshqaradi)
- `manage.py` = Sizning pultingiz (buni KO'P ishlatamiz)

---

### **Sinab ko'ramiz!**

```bash
python manage.py runserver
```

**Qizil yozuvlar ko'rasiz - bu ODDIY!** Hozircha e'tibor bermang.

Quyidagi qatorni toping:

```
Starting development server at http://127.0.0.1:8000/
```

---

### **Brauzerni oching:**

Manzil: `http://127.0.0.1:8000/`

**RAKETA ko'rishingiz kerak! 🚀**

```
The install worked successfully! Congratulations!
```

**👏 SIZ DJANGO'NI ISHGA TUSHIRDINGIZ!**

Terminalda `Ctrl+C` bosing, server to'xtaydi.

---

## **4-Qism: Nima Borligini Tushunish (15 daqiqa)**

Keling `saytim/settings.py` ichiga qaraymiz

**Kod editorida oching.**

Qo'rqmang! Faqat 3 narsaga qaraymiz:

---

### **1-Narsa: DEBUG**

```python
DEBUG = True
```

**Bu nimani anglatadi?**

- `True` = Ishlab chiqish rejimi (xatolarni aniq ko'rsatadi)
- `False` = Ishlab chiqarish rejimi (haqiqiy saytlar uchun)

**Hozircha:** `True` qoldiring

---

### **2-Narsa: INSTALLED_APPS**

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
```

**Bular nima?**

Telefondagi ilovalar kabi! Har biri biror narsani qiladi:

- `admin` = Admin panel (bepul!)
- `auth` = Foydalanuvchi kirish tizimi (bepul!)
- `staticfiles` = CSS, rasmlar, JavaScript

**Hozir tegishimiz shart emas.**

---

### **3-Narsa: DATABASES**

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

**Bu nimani anglatadi?**

Django biz uchun kichik ma'lumotlar bazasi yaratdi.

PostgreSQL bilasizmi? Bu PostgreSQL ning kichik ukasi.

- Oddiyroq
- O'rnatish kerak emas
- O'rganish uchun ajoyib!

**Keyinroq:** PostgreSQL ga o'tamiz

---

## **5-Qism: Ma'lumotlar Bazasini Sozlash (10 daqiqa)**

INSTALLED_APPS larga eslaydimi? Ularga ma'lumotlar bazasi jadvallari kerak!

```bash
python manage.py migrate
```

**Ko'rasiz:**

```
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
```

**Nima bo'ldi?**

Django foydalanuvchilar, sessiyalar va boshqalar uchun jadvallar yaratdi.

**Yangi fayl paydo bo'ldi:** `db.sqlite3` (sizning ma'lumotlar bazangiz!)

---

## **6-Qism: Admin Panel! (15 daqiqa)**

### **Admin Foydalanuvchi Yaratish:**

```bash
python manage.py createsuperuser
```

**Savol beradi:**

```
Username: admin
Email: admin@example.com
Password: ****
Password (again): ****
```

**Maslahat:** O'rganish uchun parol oddiy bo'lishi mumkin. Masalan: `admin123`

---

### **Serverni ishga tushiring:**

```bash
python manage.py runserver
```

### **Admin ga kiring:**

`http://127.0.0.1:8000/admin/`

**Username va parol bilan KIRING!**

---

### **🎉 BEPUL nima oldingiz qarang:**

- To'liq admin panel!
- Foydalanuvchi boshqaruvi!
- Foydalanuvchilarni qo'shish/o'zgartirish/o'chirish mumkin!

**Buning uchun HECH QANDAY kod yozmadingiz!**

---

## **7-Qism: Birinchi Ilovani Yaratish (20 daqiqa)**

### **Loyiha vs Ilova - Oddiy Tushuntirish:**

```
Loyiha = Butun veb-sayt (masalan "Facebook")
Ilova = Bitta funksiya (masalan "rasmlar", "xabarlar", "do'stlar")
```

**Misol:**

```
Loyiha: onlayn_do'kon
├── Ilova: mahsulotlar (mahsulotlarni boshqaradi)
├── Ilova: savat (savatni boshqaradi)
└── Ilova: to'lovlar (to'lovlarni boshqaradi)
```

Har bir ilova BITTA narsani qiladi.

---

### **"blog" ilovasini yaratamiz:**

```bash
python manage.py startapp blog
```

**Yangi papka paydo bo'ldi!**

```
blog/
├── models.py
├── views.py
├── admin.py
└── (boshqa fayllar)
```

---

### **Django'ga ilovangiz haqida ayting:**

`saytim/settings.py` ni oching

`INSTALLED_APPS` ni toping va ilovangizni qo'shing:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'blog',  # 👈 BU QATORNI QO'SHING
]
```

**Faylni saqlang!**

---

## **8-Qism: Birinchi Sahifani Qiling! (30 daqiqa)**

### **1-Qadam: View Yaratish**

VIEW degani: "Sahifa nimani ko'rsatishi kerak?"

`blog/views.py` ni oching va yozing:

```python
from django.http import HttpResponse

def bosh_sahifa(request):
    return HttpResponse("Salom! Mening blogimga xush kelibsiz!")
```

**Bu nima qiladi?**

- Kimdir saytingizga kiradi
- Django bu funksiyani ishga tushiradi
- U "Salom! Mening blogimga xush kelibsiz!" qaytaradi

Oddiy!

---

### **2-Qadam: URL Yaratish**

Endi Django'ga aytishimiz kerak: "Kimdir asosiy sahifaga kirsa, bu view'ni ko'rsat"

**Yangi fayl yarating:** `blog/urls.py`

Buni yozing:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.bosh_sahifa, name='bosh_sahifa'),
]
```

**Tarjima:**

- `''` = asosiy sahifa (bo'sh = asosiy)
- `views.bosh_sahifa` = yaratgan funksiyamizni ishlatamiz
- `name='bosh_sahifa'` = nom beramiz (keyinroq kerak)

---

### **3-Qadam: Hammasini Bog'lash**

`saytim/urls.py` ni oching

Buni o'zgartiring:

```python
from django.contrib import admin
from django.urls import path, include  # 👈 include qo'shing

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('blog.urls')),  # 👈 BU QATORNI QO'SHING
]
```

**Nima qildik?**

- Django'ga aytdik: "Asosiy sahifa uchun blog ning URL lariga qara"

---

### **4-Qadam: SINAB KO'RING!**

```bash
python manage.py runserver
```

Manzil: `http://127.0.0.1:8000/`

**Ko'rishingiz kerak:**

```
Salom! Mening blogimga xush kelibsiz!
```

### **🎉 SIZ BIRINCHI DJANGO SAHIFANGIZNI QILDINGIZ!**

---

## **9-Qism: Yaxshiroq Qilamiz! (20 daqiqa)**

### **Biz Haqimizda Sahifasini Qo'shing**

`blog/views.py` ni oching:

```python
from django.http import HttpResponse

def bosh_sahifa(request):
    return HttpResponse("Salom! Mening blogimga xush kelibsiz!")

def biz_haqimizda(request):  # 👈 YANGI FUNKSIYA
    return HttpResponse("Bu blog Django o'rganish haqida!")
```

---

`blog/urls.py` ni oching:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.bosh_sahifa, name='bosh_sahifa'),
    path('biz-haqimizda/', views.biz_haqimizda, name='biz_haqimizda'),  # 👈 QO'SHING
]
```

---

**Sinab ko'ring!**

- `http://127.0.0.1:8000/` → "Salom! Mening blogimga..." ko'rsatadi
- `http://127.0.0.1:8000/biz-haqimizda/` → "Bu blog Django..." ko'rsatadi

**Endi 2 ta sahifangiz bor!**

---

## **10-Qism: Jarayonni Tushunish (15 daqiqa)**

### **Sahifaga kirganda nima bo'ladi?**

Oddiy diagramma bilan ko'rsataman:

```
1. Siz yozasiz: http://127.0.0.1:8000/biz-haqimizda/
                    ↓
2. Django urls.py ga qaradi: "biz-haqimizda/ views.biz_haqimizda ga ketadi"
                    ↓
3. Django ishga tushiradi: def biz_haqimizda(request)
                    ↓
4. Funksiya qaytaradi: "Bu blog Django..."
                    ↓
5. Siz brauzerda ko'rasiz!
```

**Hammasi shu! Oddiy jarayon.**

---

### **Ism bilan sinab ko'ramiz:**

`blog/views.py` ga qo'shing:

```python
def salomlash(request, ism):
    return HttpResponse(f"Salom {ism}! Tanishganimdan xursandman!")
```

`blog/urls.py` ga qo'shing:

```python
urlpatterns = [
    path('', views.bosh_sahifa, name='bosh_sahifa'),
    path('biz-haqimizda/', views.biz_haqimizda, name='biz_haqimizda'),
    path('salom/<str:ism>/', views.salomlash, name='salomlash'),  # 👈 YANGI
]
```

---

**Bularni sinab ko'ring:**

- `http://127.0.0.1:8000/salom/Bobur/` → "Salom Bobur!"
- `http://127.0.0.1:8000/salom/Dilnoza/` → "Salom Dilnoza!"
- `http://127.0.0.1:8000/salom/Ahmad/` → "Salom Ahmad!"

**Zo'r-da?** 😎

---

## **1-2 Kun Xulosasi**

### **Nima o'rgandingiz:**

✅ Django o'rnatdik
✅ Loyiha yaratdik
✅ Ishlab chiqish serverini ishga tushirdik
✅ Admin panelni ko'rdik
✅ Ilova yaratdik
✅ View'lar bilan sahifa qildik
✅ URL larni bog'ladik

### **Nima qurdingiz:**

```
Veb-sayt:
- Asosiy sahifa
- Biz haqimizda sahifa
- Isimlar bilan salomlashuvchi sahifa
- Admin panel
```

**1-kun uchun yomon emas!** 🎉

---

## **Amaliy Mashqlar**

### **Oson:**

1. `/aloqa/` sahifasini yarating, u "Email: aloqa@mengblog.com" ko'rsatsin

### **O'rta:**

1. `/yil/<int:yil>/` yarating, u "Yil: 2024" ko'rsatsin

### **Qiyin:**

1. `/post/<int:raqam>/` yarating, u "Sizning post raqam: 5 o'qiyapsiz" ko'rsatsin

---

## **Mashqlar uchun Maslahatlar:**

**Mashq 1:**

```python
# views.py da
def aloqa(request):
    return HttpResponse("Email: aloqa@mengblog.com")

# urls.py da
path('aloqa/', views.aloqa, name='aloqa'),
```

---

## **Ertangi Kun:**

Ertaga chiroyli qilamiz!

Zerikarli matn o'rniga qo'shamiz:

- HTML sahifalar
- Ranglar va uslublar
- Haqiqiy bosh sahifa dizayni

**Hozircha:** Bugun o'rganganlaringizni mashq qiling!

---

## **O'zingizni Sinash Uchun Savollar:**

1. Yangi Django loyiha qanday buyruq bilan yaratiladi?
2. `python manage.py runserver` nima qiladi?
3. Loyiha va ilova o'rtasidagi farq nima?
4. Sahifalarni ko'rsatadigan funksiyalarni qayerga yozasiz?
5. URL larni view larga qayerda bog'laysiz?

**Agar javob bera olsangiz, 3-kun uchun tayyorsiz!**

---

## **Eslab Qolish Kerak Bo'lgan Buyruqlar:**

```bash
# Virtual muhit yaratish
python -m venv muhit

# Faollashtirish
source muhit/bin/activate  # Mac/Linux
muhit\Scripts\activate     # Windows

# Django o'rnatish
pip install django

# Loyiha yaratish
django-admin startproject saytim .

# Ilova yaratish
python manage.py startapp blog

# Server ishga tushirish
python manage.py runserver

# Ma'lumotlar bazasini sozlash
python manage.py migrate

# Admin foydalanuvchi yaratish
python manage.py createsuperuser
```

**Bularni yozib qo'ying!** Har kuni ishlatamiz.

---

[**Uy Vazifasi:**](https://app.notion.com/p/Uy-Vazifasi-3d86021d9a1280209223e74bd4da09ae?pvs=21)