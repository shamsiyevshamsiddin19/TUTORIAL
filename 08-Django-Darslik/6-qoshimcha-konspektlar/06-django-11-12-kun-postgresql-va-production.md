# 📚Django 11-12 Kun: PostgreSQL va Production Tayyorligi✅

## Haqiqiy Ma'lumotlar Bazasi! 🗄️

---

## **1-Qism: Nega PostgreSQL? (15 daqiqa)**

### **SQLite vs PostgreSQL**

**SQLite (hozir ishlatayotganimiz):**

```
✅ Oddiy
✅ O'rnatish kerak emas
✅ O'rganish uchun ajoyib

❌ Bitta fayl (db.sqlite3)
❌ Bir vaqtda ko'p foydalanuvchi muammo
❌ Production da ishlatilmaydi
❌ Murakkab querylar sekin
```

**PostgreSQL:**

```
✅ Professional
✅ Minglab foydalanuvchi
✅ Tez va kuchli
✅ Instagram, Spotify ishlatadi
✅ Ko'p funksiyalar

❌ O'rnatish kerak
❌ Biroz murakkab
```

---

### **Qachon O'tish Kerak?**

```
SQLite da qoling:
- O'rganayotgan bo'lsangiz
- Shaxsiy loyiha
- 1-2 ta foydalanuvchi

PostgreSQL ga o'ting:
- Haqiqiy loyiha
- Ko'p foydalanuvchi
- Production (internet ga chiqarish)
```

**Bizning holatimiz:** O'rganish tugadi, endi haqiqiy loyiha vaqti! 🚀

---

## **2-Qism: PostgreSQL O'rnatish (20 daqiqa)**

### **Windows uchun:**

1. **PostgreSQL yuklab olish:**
    - https://www.postgresql.org/download/windows/
    - Eng yangi versiyani yuklab oling
    - Installer ni ishga tushiring
2. **O'rnatish:**
    - Next, Next...
    - **Port:** 5432 (o'zgartirmang!)
    - **Parol o'rnating:** `postgres123` (yoki o'zingizniki)
    - **Eslab qoling bu parolni!** ⚠️
3. **Tekshirish:**
    
    ```bash
    psql --version
    ```
    
    Ko'rsatsa: `psql (PostgreSQL) 16.x` - Tayyor! ✅
    

---

### **Mac uchun:**

1. **Homebrew bilan:**
    
    ```bash
    brew install postgresql@16
    brew services start postgresql@16
    ```
    
2. **Yoki Postgres.app:**
    - https://postgresapp.com/
    - Yuklab oling va ishga tushiring
3. **Tekshirish:**
    
    ```bash
    psql --version
    ```
    

---

### **Linux (Ubuntu/Debian) uchun:**

```bash
# Yangilash
sudo apt update

# O'rnatish
sudo apt install postgresql postgresql-contrib

# Ishga tushirish
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Tekshirish
psql --version
```

---

## **3-Qism: PostgreSQL Sozlash (25 daqiqa)**

### **1-Qadam: PostgreSQL ga Kirish**

**Windows:**

```bash
psql -U postgres
```

**Mac/Linux:**

```bash
sudo -u postgres psql
```

Parolni so'raydi - o'rnatishda belgilagan parolni kiriting.

**Ko'rasiz:**

```
postgres=#
```

Bu PostgreSQL konsoli! 🎉

---

### **2-Qadam: Ma'lumotlar Bazasi Yaratish**

```sql
CREATE DATABASE blog_db;
```

**Javob:**

```
CREATE DATABASE
```

---

### **3-Qadam: Foydalanuvchi Yaratish (Optional, you can skip this step)**

```sql
CREATE USER blog_user WITH PASSWORD 'blog_parol123';
```

**Esda tuting:**

- Foydalanuvchi: `postgres`
- Parol: `....`

---

### **4-Qadam: Huquqlar Berish**

```sql
GRANT ALL PRIVILEGES ON DATABASE blog_db TO blog_user;
```

---

### **5-Qadam: Qo'shimcha Sozlamalar**

```sql
ALTER ROLE blog_user SET client_encoding TO 'utf8';
ALTER ROLE blog_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE blog_user SET timezone TO 'UTC';
```

---

### **6-Qadam: Chiqish**

```sql
\q
```

yoki `exit`

**Tayyor!** Database yaratildi! ✅

---

### **Tekshirish:**

```bash
# Kirish
psql -U blog_user -d blog_db -h localhost

# Parol: blog_parol123
```

Agar kirsa - hammasi to'g'ri! 🎊

---

## **4-Qism: Django-ni PostgreSQL-ga Ulash (30 daqiqa)**

### **1-Qadam: Kutubxona O'rnatish**

```bash
# Virtual muhitda ekanligingizga ishonch hosil qiling
# (venv) ko'rinishi kerak

pip install psycopg2-binary
```

Kutamiz... Tayyor! ✅

---

### **2-Qadam: Environment Variables (Muhim! 🔐)**

**Muammo:**

```python
# settings.py da
DATABASES = {
    'default': {
        'PASSWORD': 'blog_parol123',  # ❌ Parolni hammaga ko'rsatyapmiz!
    }
}
```

Agar Github ga yuklasangiz - parol hammaga ko'rinadi! 😱

---

### **Yechim: .env Fayli**

**1. django-environ o'rnatish:**

```bash
pip install django-environ
```

---

**2. .env fayli yaratish:**

Loyiha asosida `.env` fayli yarating:

```
mening_birinchi_django/
├── .env          ← Bu yerda
├── blog/
├── saytim/
├── manage.py
└── db.sqlite3
```

`.env` ichiga:

```
SECRET_KEY=django-insecure-sizning-maxfiy-kalitingiz
DEBUG=True
DB_NAME=blog_db
DB_USER=blog_user
DB_PASSWORD=blog_parol123
DB_HOST=localhost
DB_PORT=5432
```

---

**3. .gitignore ga qo'shish:**

`.gitignore` fayliga qo'shing:

```
# Environment variables
.env
.env.local

# Database
db.sqlite3
*.sqlite3

# Virtual Environment
venv/
env/

# Python
__pycache__/
*.pyc
```

**Juda muhim!** ⚠️ `.env` faylini hech qachon Github ga yuklamang!

---

### **3-Qadam: Settings.py ni O'zgartirish**

`saytim/settings.py`:

```python
from pathlib import Path
import environ  # Qo'shamiz

# Environ sozlash
env = environ.Env(
    DEBUG=(bool, False)
)

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# .env faylini o'qish
environ.Env.read_env(BASE_DIR / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = []

# ... INSTALLED_APPS va hokazo

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    }
}

# ... qolgan sozlamalar
```

---

### **Tushuntirish:**

```python
import environ

env = environ.Env(
    DEBUG=(bool, False)
)
```

Environment o'zgaruvchilarni o'qish uchun tayyor.

---

```python
environ.Env.read_env(BASE_DIR / '.env')
```

`.env` faylini o'qiymiz.

---

```python
SECRET_KEY = env('SECRET_KEY')
DEBUG = env('DEBUG')
```

`.env` dan qiymatlarni olamiz.

---

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    }
}
```

PostgreSQL sozlamalari `.env` dan!

---

## **5-Qism: Ma'lumotlarni Ko'chirish (20 daqiqa)**

### **1-Qadam: Migratsiyalarni Tozalash**

Eski migratsiyalarni o'chiramiz (ixtiyoriy):

```bash
# DIQQAT: Buni faqat development da qiling!

# Eski migratsiya fayllarini o'chirish
# blog/migrations/ ichidagi __init__.py dan boshqa hamma faylni o'chiring
```

yoki shunchaki davom etamiz.

---

### **2-Qadam: Migratsiya Qilish**

```bash
python manage.py migrate
```

**Ko'rasiz:**

```
Operations to perform:
  Apply all migrations: admin, auth, blog, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  ...
  Applying blog.0001_initial... OK
  ...
```

**PostgreSQL da jadvallar yaratildi!** 🎉

---

### **3-Qadam: Superuser Yaratish**

```bash
python manage.py createsuperuser
```

```
Username: admin
Email: admin@example.com
Password: admin123
Password (again): admin123
```

---

### **4-Qadam: Serverni Ishga Tushirish**

```bash
python manage.py runserver
```

Admin ga kiring: `http://127.0.0.1:8000/admin/`

**Ishlaydi!** 🎊

---

### **SQLite Ma'lumotlarini Ko'chirish (Agar Kerak Bo'lsa)**

**1. SQLite dan ma'lumotni export qilish:**

```bash
# SQLite ga qaytish (vaqtincha)
# settings.py da DATABASES ni eski holiga qaytaring
# Keyin:

python manage.py dumpdata --output data.json --indent 4
```

---

**2. PostgreSQL ga qaytish:**

`settings.py` ni PostgreSQL sozlamalariga qaytaring.

---

**3. Ma'lumotni import qilish:**

```bash
python manage.py migrate
python manage.py loaddata data.json
```

**Hammasi ko'chirildi!** ✅

---

## **6-Qism: PostgreSQL Admin Panel (pgAdmin) (15 daqiqa)**

### **pgAdmin Nima?**

PostgreSQL uchun grafik interfeys - xuddi Django admin kabi!

---

### **O'rnatish:**

**Windows/Mac:**
PostgreSQL bilan birga keladi, Desktop da "pgAdmin 4" ni toping.

**Linux:**

```bash
sudo apt install pgadmin4
```

---

### **Ishlatish:**

1. **pgAdmin 4 ni oching**
2. **Server qo'shing:**
    - Server yaratish → Add New Server
    - Name: `Blog Database`
    - Host: `localhost`
    - Port: `5432`
    - Username: `blog_user`
    - Password: `blog_parol123`
3. **Jadvallarni ko'ring:**
    - Servers → Blog Database → Databases → blog_db → Schemas → public → Tables

**Barcha Django jadvallaringiz ko'rinadi!** 📊

---

## **7-Qism: Production Sozlamalari (35 daqiqa)**

### **DEBUG = False**

`.env` faylida:

```
DEBUG=False
```

**Endi xatolar batafsil ko'rinmaydi!**

---

### **ALLOWED_HOSTS**

`settings.py`:

```python
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost',  '127.0.0.1'])
```

`.env` da:

```
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
```

---

### **Static Files Yig'ish**

`settings.py` ga qo'shing:

```python
# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_DIRS = [
    BASE_DIR / 'blog/static',
]
```

---

**Barcha static fayllarni bir joyga yig'ish:**

```bash
python manage.py collectstatic
```

**Javob:**

```
You have requested to collect static files...
This will overwrite existing files!
Are you sure you want to do this?

Type 'yes' to continue: yes

Copying '/path/to/static/...'
...
123 static files copied to '/path/to/staticfiles'.
```

---

### **Media Files Production**

`settings.py`:

```python
# Media fayllar
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

Bu development da ishlaydi, lekin production da nginx/Apache kerak.

---

### **Security Settings**

`settings.py` ga qo'shing:

```python
# Security settings for production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
	  SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
```

---

## **8-Qism: Requirements.txt Yangilash (10 daqiqa)**

### **Barcha Paketlarni Saqlash**

```bash
pip freeze > requirements.txt
```

**requirements.txt ko'rinishi:**

```
asgiref==3.7.2
Django==5.0.1
django-environ==0.11.2
Pillow==10.1.0
psycopg2-binary==2.9.9
sqlparse==0.4.4
```

---

### **Boshqa Kompyuterda O'rnatish**

```bash
pip install -r requirements.txt
```

Barcha paketlar avtomatik o'rnatiladi! 📦

---

## **9-Qism: PostgreSQL Backup (20 daqiqa)**

### **Backup Yaratish (pgAdmin 4 bilan)**

1. pgAdmin 4 ni oching.
2. Chap tomonda `Servers` → `localhost` → `Databases` → `blog_db` ni tanlang.
3. O‘ng tugmani bosing va **Backup…** ni tanlang.
4. **Format**: `Plain` yoki `Custom` (odatda `Plain` SQL file uchun ishlatiladi).
5. **Filename**: Fayl joylashuvini belgilang, masalan:
    
    ```
    D:\Django projects\BOTS\Najot Talim (kafe_bot)\mening_birinchi_django\backup.sql
    ```
    
6. **Role / Username**: `blog_user`
Parolni kiriting: `blog_parol123`
7. **Backup** tugmasini bosing.

**Natija:** `backup.sql` fayli tanlangan joyga yaratiladi. 💾

---

### **Backup dan Tiklash**

```bash
# Avval bazani tozalash
psql -U postgres

DROP DATABASE blog_db;
CREATE DATABASE blog_db;
GRANT ALL PRIVILEGES ON DATABASE blog_db TO blog_user;
\q

# Tiklash
psql -U blog_user -h localhost blog_db < backup.sql
```

---

## **12-Qism: Performance Optimizatsiya (25 daqiqa)**

### **Database Indexlar**

`blog/models.py`:

```python
class Post(models.Model):
    sarlavha = models.CharField(max_length=200, db_index=True)  # Index
    matn = models.TextField()
    muallif = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    rasm = models.ImageField(upload_to='postlar/', blank=True, null=True)
    yaratilgan_sana = models.DateTimeField(auto_now_add=True, db_index=True)
    # ... boshqalar

    class Meta:
        ordering = ['-yaratilgan_sana']
        indexes = [
            models.Index(fields=['-yaratilgan_sana', 'nashr_etilgan']),
        ]
```

**Migratsiya:**

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### **Query Optimizatsiya**

**Yomon (N+1 muammo):**

```python
def bosh_sahifa(request):
    postlar = Post.objects.all()
    # Har bir post uchun alohida query!
```

**Yaxshi:**

```python
def bosh_sahifa(request):
    postlar = Post.objects.select_related('muallif').filter(
        nashr_etilgan=True
    ).order_by('-yaratilgan_sana')
```

---

### **Pagination (Sahifalash)**

`blog/views.py`:

```python
from django.core.paginator import Paginator

def bosh_sahifa(request):
    postlar_list = Post.objects.select_related('muallif').filter(
        nashr_etilgan=True
    ).order_by('-yaratilgan_sana')

    # Har sahifada 5 ta post
    paginator = Paginator(postlar_list, 5)

    sahifa_raqami = request.GET.get('sahifa')
    postlar = paginator.get_page(sahifa_raqami)

    return render(request, 'blog/bosh.html', {'postlar': postlar})
```

---

**Shablon:**

`blog/templates/blog/bosh.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block kontent %}
    <h2>📝 So'nggi Postlar</h2>

    {% for post in postlar %}
        <div class="post-card">
            {% if post.rasm %}
                <img src="{{ post.rasm.url }}" alt="{{ post.sarlavha }}" class="post-image">
            {% endif %}

            <div class="post-card-content">
                <h3>{{ post.sarlavha }}</h3>
                <p class="post-meta">
                    👤 {{ post.muallif.username }} |
                    📅 {{ post.yaratilgan_sana|date:"d-M-Y" }}
                </p>
                <p>{{ post.matn|truncatewords:30 }}</p>
                <a href="{% url 'post_batafsil' post.id %}" class="btn">
                    Batafsil o'qish →
                </a>
            </div>
        </div>
    {% empty %}
        <p>Hozircha postlar mavjud emas.</p>
    {% endfor %}

    <!-- Sahifalash -->
    <div class="pagination">
        {% if postlar.has_previous %}
            <a href="?sahifa=1" class="btn btn-secondary">⏮ Birinchi</a>
            <a href="?sahifa={{ postlar.previous_page_number }}" class="btn btn-secondary">⬅ Oldingi</a>
        {% endif %}

        <span class="current-page">
            Sahifa {{ postlar.number }} / {{ postlar.paginator.num_pages }}
        </span>

        {% if postlar.has_next %}
            <a href="?sahifa={{ postlar.next_page_number }}" class="btn btn-secondary">Keyingi ➡</a>
            <a href="?sahifa={{ postlar.paginator.num_pages }}" class="btn btn-secondary">Oxirgi ⏭</a>
        {% endif %}
    </div>
{% endblock %}
```

---

**CSS:**

```css
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 40px 0;
}

.current-page {
    padding: 10px 20px;
    background-color: #667eea;
    color: white;
    border-radius: 5px;
    font-weight: bold;
}
```

---

## **11-12 Kun Xulosasi**

### **Nima O'rgandik:**

✅ SQLite vs PostgreSQL

✅ PostgreSQL o'rnatish

✅ Database va user yaratish

✅ psycopg2-binary

✅ Environment variables (.env)

✅ django-environ

✅ Production sozlamalari

✅ DEBUG=False

✅ ALLOWED_HOSTS

✅ collectstatic

✅ Security settings

✅ Database backup

✅ PostgreSQL buyruqlari

✅ Query optimizatsiya

✅ Pagination

---

## **Keyingi Darsda:**

**13-14 Kun: REST API (Django REST Framework)**

- API nima?
- DRF o'rnatish
- Serializers
- APIView, ViewSets
- Authentication
- Permissions
- JSON ma'lumotlar

**Mobile va frontend uchun API!** 📱

---

## **Bonus: .env.example Yaratish**

`.env.example` fayli yarating (Github ga yuklanadi):

```
SECRET_KEY=sizning-maxfiy-kalitingiz-shu-yerda
DEBUG=True
DB_NAME=blog_db
DB_USER=blog_user
DB_PASSWORD=sizning-parolingiz
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
```

**README.md ga ko'rsatma:**

```markdown
## Sozlash

1. `.env.example` ni `.env` ga nusxalang
2. `.env` dagi qiymatlarni o'zgartiring
3. `python manage.py migrate`
```

---

**Jami vaqt:** 6-7 soat tanaffuslar bilan

**Esda tuting:** PostgreSQL - professional dasturchilarning tanlovi! Endi siz ham professionallar qatorida! 💪🗄️