# 📚Django 5-6 Kun: Modellar va Ma'lumotlar Bazasi✅

## Haqiqiy Ma'lumotlar Bilan Ishlash! 💾

---

## **1-Qism: Model Nima? (20 daqiqa)**

### **Oddiy Tushuntirish:**

Hozircha biz ma'lumotlarni qayerda saqladik?

```python
postlar = [
    {'sarlavha': 'Django', 'matn': '...'},
    {'sarlavha': 'Python', 'matn': '...'},
    {'sarlavha': 'SQL', 'matn': '...'},
]
```

**View ichida!** 😅

**Muammo:**

- Server yopilsa = hammasi yo'qoladi
- Yangi post qo'shish = kodni o'zgartirish kerak
- 1000 ta post = kod juda uzun bo'ladi

---

### **Yechim: Ma'lumotlar Ombori! 🎉**

```
Model = Ma'lumotlar bazasidagi jadval

Misol:
Kitob modeli = Kitoblar jadvali
Har bir kitob = Jadvalda bitta qator
```

**Oddiy misol:**

```
KITOBLAR JADVALI:
+----+-----------------+------------------+------+
| ID | NOM             | MUALLIF          | NARX |
+----+-----------------+------------------+------+
| 1  | Python asoslari | Ahmad Valiyev    | 50   |
| 2  | Django qo'llan. | Dilnoza Karimova | 70   |
| 3  | Web dizayn      | Bobur Toshmatov  | 60   |
+----+-----------------+------------------+------+
```

Django bilan bu jadvalni kod bilan yasaymiz!

---

## **2-Qism: Birinchi Modelni Yaratamiz (30 daqiqa)**

### **Post Modeli**

`blog/models.py` ni oching:

```python
from django.db import models

class Post(models.Model):
    sarlavha = models.CharField(max_length=200)
    matn = models.TextField()
    muallif = models.CharField(max_length=100)
    yaratilgan_sana = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sarlavha
```

**Keling tushuntiramiz:**

---

### **Qator-qator tushuntirish:**

```python
class Post(models.Model):
```

**Tarjima:** "Post nomli model yaratamiz"

---

```python
sarlavha = models.CharField(max_length=200)
```

**Tarjima:**

- `CharField` = Matn maydoni (qisqa)
- `max_length=200` = Maksimum 200 ta harf

Masalan: "Django o'rganish bo'yicha qo'llanma"

---

```python
matn = models.TextField()
```

**Tarjima:**

- `TextField` = Katta matn maydoni
- Uzunligi cheklanmagan

Masalan: Butun maqola matni

---

```python
muallif = models.CharField(max_length=100)
```

**Tarjima:** Muallif ismi, 100 ta belgigacha

---

```python
yaratilgan_sana = models.DateTimeField(auto_now_add=True)
```

**Tarjima:**

- `DateTimeField` = Sana va vaqt
- `auto_now_add=True` = Avtomatik hozirgi sana qo'yiladi

---

```python
def __str__(self):
    return self.sarlavha
```

**Tarjima:** "Post ni chiqarganda sarlavhasini ko'rsat"

Bu admin panelda kerak bo'ladi.

---

## **3-Qism: Migratsiya - Model ni Bazaga Yuborish (20 daqiqa)**

### **1-Qadam: Migratsiya Fayli Yaratish**

```bash
python manage.py makemigrations
```

**Ko'rasiz:**

```
Migrations for 'blog':
  blog/migrations/0001_initial.py
    - Create model Post
```

**Nima bo'ldi?**

Django "Hey, Post modeli yaratildi, bazaga qo'shaman!" degan fayl yaratdi.

---

### **Fayl Ichiga Qaraymiz**

`blog/migrations/0001_initial.py` oching:

```python
# Django tomonidan yaratilgan
class Migration(migrations.Migration):
    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('sarlavha', models.CharField(max_length=200)),
                ('matn', models.TextField()),
                ('muallif', models.CharField(max_length=100)),
                ('yaratilgan_sana', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
```

**Diqqat:** `id` maydonini biz yozmagandik! Django avtomatik qo'shdi!

---

### **2-Qadam: Migratsiyani Bajarish**

```bash
python manage.py migrate
```

**Ko'rasiz:**

```
Running migrations:
  Applying blog.0001_initial... OK
```

**🎉 JADVAL YARATILDI!**

Endi bazada `blog_post` jadvali bor!

---

## **4-Qism: Admin Panelda Ko'rish (15 daqiqa)**

### **Admin ga Ro'yxatdan O'tkazish**

`blog/admin.py` ni oching:

```python
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```

**Shuncha oddiy!**

---

### **Sinab Ko'ramiz**

```bash
python manage.py runserver
```

`http://127.0.0.1:8000/admin/` ga kiring

**Post lar bo'limini ko'rasiz!** 🎉

---

### **Birinchi Post Qo'shamiz**

1. "Post" ga bosing
2. "ADD POST" tugmasini bosing
3. Ma'lumot kiriting:
    - Sarlavha: "Django bilan tanishish"
    - Matn: "Django - bu Python da yozilgan web framework..."
    - Muallif: "Ahmad Valiyev"
4. "SAVE" bosing

**Birinchi postingiz yaratildi!** 🎊

Yana 2-3 ta post qo'shing.

---

## **5-Qism: Bazadan Ma'lumot Olish (35 daqiqa)**

### **Django Shell - Tajriba Maydoni**

```bash
python manage.py shell
```

Python konsoli ochiladi, lekin Django bilan!

---

### **Barcha Postlarni Olish**

```python
>>> from blog.models import Post

>>> Post.objects.all()
<QuerySet [<Post: Django bilan tanishish>, <Post: Python maslahatlar>]>
```

**Tushuntirish:**

```python
Post.objects.all()
```

- `Post` = Model nomimiz
- `objects` = Model menejeri
- `all()` = Hammasini ol

---

### **Bitta Post Olish**

```python
>>> post = Post.objects.get(id=1)
>>> post.sarlavha
'Django bilan tanishish'

>>> post.muallif
'Ahmad Valiyev'

>>> post.matn
'Django - bu Python da yozilgan web framework...'
```

---

### **Yangi Post Yaratish (Python orqali)**

```python
>>> yangi_post = Post(sarlavha='PostgreSQL darslari', matn='PostgreSQL eng yaxshi ma\'lumotlar bazasi', muallif='Dilnoza Karimova')
>>> yangi_post.save()
```

**Tekshiramiz:**

```python
>>> Post.objects.all()
<QuerySet [<Post: Django bilan...>, <Post: Python...>, <Post: PostgreSQL...>]>
```

**Ishladi!** ✅

---

### **Qidirish (Filter)**

```python
>>> # Ahmad ning postlari
>>> Post.objects.filter(muallif='Ahmad Valiyev')

>>> # Sarlavhada "Django" bor postlar
>>> Post.objects.filter(sarlavha__contains='Django')

>>> # ID si 2 dan katta bo'lgan postlar
>>> Post.objects.filter(id__gt=2)
```

---

### **Shell dan chiqish**

```python
>>> exit()
```

---

## **6-Qism: View da Bazadan Foydalanish (25 daqiqa)**

### **Haqiqiy Postlarni Ko'rsatish**

`blog/views.py`:

```python
from django.shortcuts import render
from .models import Post  # ← Model ni import qilamiz

def bosh_sahifa(request):
    # Bazadan barcha postlarni olamiz
    postlar = Post.objects.all()

    context = {'postlar': postlar}
    return render(request, 'blog/bosh.html', context)
```

**Farq ko'rdingizmi?**

**Oldin:**

```python
postlar = [
    {'sarlavha': '...', 'matn': '...'},  # Qo'lda yozgan
]
```

**Hozir:**

```python
postlar = Post.objects.all()  # Bazadan olinyapti!
```

---

### **Shablon O'zgarmaydi!**

`blog/templates/blog/bosh.html` **AYNAN SHUDAY QOLADI:**

```html
{% extends 'blog/asosiy.html' %}

{% block kontent %}
    <h2>📝 So'nggi Postlar</h2>

    {% for post in postlar %}
        <div class="post-card">
            <h3>{{ post.sarlavha }}</h3>
            <p class="post-meta">
                👤 {{ post.muallif }} | 📅 {{ post.yaratilgan_sana }}
            </p>
            <p>{{ post.matn }}</p>
        </div>
    {% endfor %}
{% endblock %}
```

**Sinab ko'ring!**

`http://127.0.0.1:8000/`

**Admin panelda qo'shgan postlaringiz ko'rinadi!** 🎉

## **7-Qism: Sana Formatlash (15 daqiqa)**

### **Muammo:**

```
📅 2024-01-15 14:23:45.123456+00:00
```

Juda uzun va chalkash! 😕

---

### **Yechim: Django Filtrlari**

```html
<p class="post-meta">
    👤 {{ post.muallif }} | 📅 {{ post.yaratilgan_sana|date:"d-M-Y" }}
</p>
```

**Natija:**

```
📅 15-Jan-2024
```

---

### **Boshqa Formatlar:**

```html
{{ post.yaratilgan_sana|date:"d.m.Y" }}
Natija: 15.01.2024

{{ post.yaratilgan_sana|date:"d F Y" }}
Natija: 15 January 2024

{{ post.yaratilgan_sana|date:"H:i" }}
Natija: 14:23
```

---

## **8-Qism: Matnni Qisqartirish (10 daqiqa)**

### **Muammo:**

Post matni juda uzun bo'lsa, bosh sahifada hammasi chiqadi.

---

### **Yechim: Truncate Filtri**

```html
<p>{{ post.matn|truncatewords:20 }}</p>
```

**Natija:** Faqat birinchi 20 ta so'z, keyin "..."

---

### **Misol:**

**Asl matn:**

```
Django - bu Python da yozilgan web framework.
U bilan tez va oson web ilova yaratish mumkin.
Django juda kuchli va ko'p funksiyali.
```

**truncatewords:10 dan keyin:**

```
Django - bu Python da yozilgan web framework.
U bilan tez va oson...
```

---

## **9-Qism: Alohida Post Sahifasi (40 daqiqa)**

### **Maqsad:**

Har bir postning o'z sahifasi bo'lsin!

Misol: `http://127.0.0.1:8000/post/1/`

---

### **1-Qadam: View Yaratish**

`blog/views.py`:

```python
from django.shortcuts import render, get_object_or_404
from .models import Post

def post_batafsil(request, post_id):
    # ID orqali postni topamiz
    post = get_object_or_404(Post, id=post_id)

    context = {'post': post}
    return render(request, 'blog/post_batafsil.html', context)
```

**Tushuntirish:**

```python
get_object_or_404(Post, id=post_id)
```

- Post ni topishga harakat qil
- Topilmasa → 404 xato ko'rsat
- Topilsa → qaytargin

---

### **2-Qadam: URL Qo'shish**

`blog/urls.py`:

```python
urlpatterns = [
    path('', views.bosh_sahifa, name='bosh_sahifa'),
    path('post/<int:post_id>/', views.post_batafsil, name='post_batafsil'),
    # ... boshqa URL lar
]
```

**Tushuntirish:**

```python
path('post/<int:post_id>/', ...)
```

- `<int:post_id>` = Raqam kutadi
- `/post/1/` → `post_id=1`
- `/post/5/` → `post_id=5`

---

### **3-Qadam: Shablon Yaratish**

`blog/templates/blog/post_batafsil.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}{{ post.sarlavha }}{% endblock %}

{% block kontent %}
    <article class="post-detail">
        <h1>{{ post.sarlavha }}</h1>

        <div class="post-meta">
            <p>👤 <strong>Muallif:</strong> {{ post.muallif }}</p>
            <p>📅 <strong>Sana:</strong> {{ post.yaratilgan_sana|date:"d F Y, H:i" }}</p>
        </div>

        <div class="post-content">
            {{ post.matn|linebreaks }}
        </div>

        <a href="{% url 'bosh_sahifa' %}" class="btn">⬅ Orqaga</a>
    </article>
{% endblock %}
```

**Yangi filtr:** `linebreaks` - enter larni `<p>` ga aylantiradi

---

### **4-Qadam: CSS Qo'shish**

`blog/static/blog/css/uslub.css` ga:

```css
.post-detail h1 {
    color: #667eea;
    font-size: 2.5em;
    margin-bottom: 20px;
    border-bottom: 3px solid #667eea;
    padding-bottom: 10px;
}

.post-meta {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
}

.post-meta p {
    margin: 5px 0;
    color: #555;
}

.post-content {
    font-size: 1.1em;
    line-height: 1.8;
    color: #333;
    margin: 30px 0;
}
```

---

### **5-Qadam: Bosh Sahifaga Havola Qo'shamiz**

`blog/templates/blog/bosh.html`:

```html
{% for post in postlar %}
    <div class="post-card">
        <h3>{{ post.sarlavha }}</h3>
        <p class="post-meta">
            👤 {{ post.muallif }} | 📅 {{ post.yaratilgan_sana|date:"d-M-Y" }}
        </p>
        <p>{{ post.matn|truncatewords:30 }}</p>
        <a href="{% url 'post_batafsil' post.id %}" class="btn">
            Batafsil o'qish →
        </a>
    </div>
{% endfor %}
```

**Muhim:**

```html
{% url 'post_batafsil' post.id %}
```

`post.id` ni URL ga yuboramiz!

---

### **Sinab Ko'ring! 🎉**

1. Bosh sahifaga boring
2. "Batafsil o'qish" tugmasini bosing
3. Alohida sahifa ochiladi!

URL: `http://127.0.0.1:8000/post/1/`

---

## **10-Qism: Model Maydonlari (30 daqiqa)**

### **Ko'proq Maydonlar Qo'shamiz**

`blog/models.py`:

```python
from django.db import models

class Post(models.Model):
    sarlavha = models.CharField(max_length=200)
    matn = models.TextField()
    muallif = models.CharField(max_length=100)
    yaratilgan_sana = models.DateTimeField(auto_now_add=True)
    yangilangan_sana = models.DateTimeField(auto_now=True)  # YANGI
    nashr_etilgan = models.BooleanField(default=True)       # YANGI
    korildi = models.IntegerField(default=0)               # YANGI

    def __str__(self):
        return self.sarlavha
```

---

### **Yangi Maydonlar:**

**1. yangilangan_sana:**

```python
yangilangan_sana = models.DateTimeField(auto_now=True)
```

- `auto_now=True` = Har safar yangilanganda sana o'zgaradi
- Post tahrirlanganida avtomatik yangilanadi

---

**2. nashr_etilgan:**

```python
nashr_etilgan = models.BooleanField(default=True)
```

- `BooleanField` = Ha/Yo'q (True/False)
- `default=True` = Sukut bo'yicha "Ha"

Nima uchun kerak? Draft (qoralama) postlar uchun!

---

**3. ko'rildi:**

```python
korildi = models.IntegerField(default=0)
```

- `IntegerField` = Butun son
- Nechta kishi ko'rgani

---

### **Migratsiya Qilamiz**

```bash
python manage.py makemigrations
```

**Savol beradi:**

```
You are trying to add a non-nullable field 'yangilangan_sana'
to post without a default...

1) Provide a one-off default now
2) Quit
```

**1 ni tanlang**, keyin `timezone.now()` yozing.

Yana bir marta savol bersa, yana 1 ni tanlab `timezone.now()` yozing.

---

```bash
python manage.py migrate
```

**Tayyor!** ✅

---

## **11-Qism: Faqat Nashr Etilganlarni Ko'rsatish (15 daqiqa)**

### **View ni Yangilaymiz**

`blog/views.py`:

```python
def bosh_sahifa(request):
    # Faqat nashr etilgan postlar
    postlar = Post.objects.filter(nashr_etilgan=True)

    context = {'postlar': postlar}
    return render(request, 'blog/bosh.html', context)
```

---

### **Eng Yangilar Birinchi**

```python
def bosh_sahifa(request):
	    postlar = Post.objects.filter(nashr_etilgan=True).order_by('-yaratilgan_sana')

    context = {'postlar': postlar}
    return render(request, 'blog/bosh.html', context)
```

**Tushuntirish:**

```python
.order_by('-yaratilgan_sana')
```

- `order_by()` = Tartiblash
- = Teskari (yangilar birinchi)
- Minussiz bo'lsa = Eskilar birinchi

---

## **12-Qism: Admin Panelni Chiroyliroq Qilish (20 daqiqa)**

### **Hozirgi Holat:**

Admin panelda faqat post sarlavhasi ko'rinadi.

---

### **Yaxshiroq Qilamiz**

`blog/admin.py`:

```python
from django.contrib import admin
from .models import Post

class PostAdmin(admin.ModelAdmin):
    list_display = ('sarlavha', 'muallif', 'yaratilgan_sana', 'nashr_etilgan')
    list_filter = ('nashr_etilgan', 'yaratilgan_sana')
    search_fields = ('sarlavha', 'matn')
    date_hierarchy = 'yaratilgan_sana'

admin.site.register(Post, PostAdmin)
```

---

### **Tushuntirish:**

**1. list_display:**

```python
list_display = ('sarlavha', 'muallif', 'yaratilgan_sana', 'nashr_etilgan')
```

Ro'yxatda qaysi ustunlar ko'rinsin

---

**2. list_filter:**

```python
list_filter = ('nashr_etilgan', 'yaratilgan_sana')
```

O'ng tomonda filtrlash paneli qo'shadi

---

**3. search_fields:**

```python
search_fields = ('sarlavha', 'matn')
```

Qidiruv qutisi qo'shadi

---

**4. date_hierarchy:**

```python
date_hierarchy = 'yaratilgan_sana'
```

Yuqorida sana bo'yicha navigatsiya

---

### **Sinab Ko'ring!**

Admin panelga kiring: `http://127.0.0.1:8000/admin/blog/post/`

**Ajoyib admin panel!** 🎨

- Qidiruv
- Filtrlar
- Ko'p ustunlar
- Sana bo'yicha navigatsiya

---

## **13-Qism: Ko'rildi Sonini Ko'paytirish (20 daqiqa)**

### **Har safar ko'rilganda +1**

`blog/views.py`:

```python
def post_batafsil(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    # Ko'rildi sonini oshiramiz
    post.korildi += 1
    post.save()

    context = {'post': post}
    return render(request, 'blog/post_batafsil.html', context)
```

---

### **Shablonda Ko'rsatamiz**

`blog/templates/blog/post_batafsil.html`:

```html
<div class="post-meta">
    <p>👤 <strong>Muallif:</strong> {{ post.muallif }}</p>
    <p>📅 <strong>Sana:</strong> {{ post.yaratilgan_sana|date:"d F Y" }}</p>
    <p>👁 <strong>Ko'rildi:</strong> {{ post.korildi }} marta</p>
</div>
```

---

### **Sinab Ko'ring!**

1. Postni oching
2. Sahifani yangilang (F5)
3. Ko'rildi soni oshadi! 📈

---

## **14-Qism: Eng Ommabop Postlar (25 daqiqa)**

### **Yangi View**

`blog/views.py`:

```python
def ommabop_postlar(request):
    postlar = Post.objects.filter(
        nashr_etilgan=True
    ).order_by('-korildi')[:5]  # Eng ko'p ko'rilgan 5 ta

    context = {'postlar': postlar}
    return render(request, 'blog/ommabop.html', context)
```

**Tushuntirish:**

```python
.order_by('-korildi')[:5]
```

- Ko'rildi bo'yicha tartiblash (ko'pdan kamga)
- Faqat birinchi 5 tasini olish

---

### **Shablon**

`blog/templates/blog/ommabop.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Ommabop Postlar{% endblock %}

{% block kontent %}
    <h2>🔥 Eng Ko'p O'qilgan Postlar</h2>

    {% for post in postlar %}
        <div class="post-card">
            <h3>{{ post.sarlavha }}</h3>
            <p class="post-meta">
                👁 {{ post.korildi }} marta ko'rilgan
            </p>
            <p>{{ post.matn|truncatewords:20 }}</p>
            <a href="{% url 'post_batafsil' post.id %}" class="btn">
                O'qish →
            </a>
        </div>
    {% endfor %}
{% endblock %}
```

---

### **URL**

`blog/urls.py`:

```python
urlpatterns = [
    path('', views.bosh_sahifa, name='bosh_sahifa'),
    path('post/<int:post_id>/', views.post_batafsil, name='post_batafsil'),
    path('ommabop/', views.ommabop_postlar, name='ommabop'),
    # ... boshqalar
]
```

---

### **Menu ga Qo'shamiz**

`blog/templates/blog/asosiy.html`:

```html
<div class="menu">
    <a href="{% url 'bosh_sahifa' %}">🏠 Bosh Sahifa</a>
    <a href="{% url 'ommabop' %}">🔥 Ommabop</a>
    <a href="{% url 'biz_haqimizda' %}">👥 Biz Haqimizda</a>
    <a href="{% url 'aloqa' %}">📧 Aloqa</a>
</div>
```

---

## **5-6 Kun Xulosasi**

### **Nima O'rgandik:**

✅ Model nima va nega kerak
✅ Model yaratish (`models.py`)
✅ Migratsiya qilish
✅ Admin panelda model bilan ishlash
✅ Bazadan ma'lumot olish (`objects.all()`, `filter()`)
✅ View da model ishlatish
✅ Django filtrlari (`date`, `truncatewords`)
✅ Alohida sahifalar (`get_object_or_404`)
✅ Model maydonlari turlari
✅ Tartiblash (`order_by`)
✅ Admin panelni sozlash

---

## **Amaliy Mashqlar**

### **1. Kategoriya Qo'shing**

Model ga yangi maydon:

```python
kategoriya = models.CharField(
    max_length=50,
    choices=[
        ('texnologiya', 'Texnologiya'),
        ('hayot', 'Hayot'),
        ('sport', 'Sport'),
    ]
)
```

Migratsiya qiling va ishlatib ko'ring!

---

### **2. Qidiruv Sahifasi**

Foydalanuvchi so'z yozsa, postlarni qidirsin:

```python
def qidiruv(request):
    so'z = request.GET.get('q', '')
    postlar = Post.objects.filter(sarlavha__icontains=so'z)
    return render(request, 'blog/qidiruv.html', {'postlar': postlar})
```

---

### **3. Oxirgi 3 Ta Post**

Sidebar yarating, oxirgi 3 ta postni ko'rsating.

---

## **Uy Vazifasil**

### **1. Izoh Modeli Yarating**

```python
class Izoh(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    ism = models.CharField(max_length=100)
    matn = models.TextField()
    yaratilgan = models.DateTimeField(auto_now_add=True)
```

Admin ga qo'shing.

---

### **2. Postga Rasm Qo'shing**

```python
rasm = models.ImageField(upload_to='postlar/', blank=True, null=True)
```

`Pillow` kutubxonasini o'rnatish kerak:

```bash
pip install Pillow
```

---

### **3. Draft Postlar Sahifasi**

Faqat `nashr_etilgan=False` bo'lgan postlarni ko'rsatadigan sahifa.

---

## **Keyingi Darsda:**

**7-8 Kun: Formalar va Foydalanuvchilar**

- Yangi post qo'shish formasi
- Tahrirlash va o'chirish
- Foydalanuvchi ro'yxatdan o'tishi
- Login/Logout
- Faqat o'z postingni tahrirlash

**Juda qiziqarli bo'ladi!** 🚀

---

**Jami vaqt:** 5-6 soat tanaffuslar bilan

**Esda tuting:** Ma'lumotlar bazasi - har qanday dasturning asosi. Yaxshi tushunib oling! 💪