# 📚Django 3-4 Kun: Shablonlar va Chiroyli Sahifalar ✅👨‍🎓

## HTML va Dizayn Qo'shamiz! 🎨

---

## **1-Qism: Shablonlar Nima? (15 daqiqa)**

### **Hozirgi Muammomiz:**

Eslaydimi, biz buni yozdik:

```python
def bosh_sahifa(request):
    return HttpResponse("Salom! Mening blogimga xush kelibsiz!")
```

**Muammo:** Faqat oddiy matn! Rasm, rang, dizayn yo'q! 😞

**Yechim:** SHABLONLAR (Templates)! 🎉

---

### **Shablon degani nima?**

```
Shablon = HTML fayl + Django maxsus kodlari

Oddiy HTML: <h1>Salom</h1>
Django shablon: <h1>Salom {{ ism }}</h1>
```

**Misol:**

```html
<html>
<body>
    <h1>Salom {{ foydalanuvchi_ismi }}!</h1>
    <p>Bugun {{ bugungi_sana }}</p>
</body>
</html>
```

Django `{{ }}` ichidagi qiymatlarni o'zgartiradi!

---

## **2-Qism: Birinchi Shablonni Yaratamiz (30 daqiqa)**

### **1-Qadam: Papka Tuzilmasi**

`blog` papkasi ichida yangi papkalar yarating:

```bash
cd blog
mkdir templates
cd templates
mkdir blog
```

**Natija:**

```
blog/
├── templates/
│   └── blog/
│       └── (bu yerda HTML fayllar bo'ladi)
├── views.py
├── urls.py
└── ...
```

---

### **Nega ikki marta blog?**

```
templates/
└── blog/           ← Bu ilova nomi
    └── bosh.html   ← Bu shablon
```

**Sabab:** Agar 10 ta ilovangiz bo'lsa, har birining o'z `bosh.html` fayli bo'lishi mumkin. Django qaysi birini biladi?

```
templates/
├── blog/
│   └── bosh.html      ← blog ilovasining boshi
└── magazin/
    └── bosh.html      ← magazin ilovasining boshi
```

Ajraladi! Chalkashmaydi!

---

### **2-Qadam: Birinchi HTML Faylni Yaratish**

`blog/templates/blog/bosh.html` fayl yarating:

```html
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <title>Mening Blogim</title>
</head>
<body>
    <h1>Mening Ajoyib Blogimga Xush Kelibsiz! 🎉</h1>
    <p>Bu Django bilan yaratilgan.</p>
    <p>Bu yerda ko'p qiziqarli postlar bo'ladi!</p>
</body>
</html>
```

**Saqlab qo'ying!**

---

### **3-Qadam: View'ni O'zgartirish**

`blog/views.py` ni oching:

```python
from django.shortcuts import render  # ← render import qiling

def bosh_sahifa(request):
    return render(request, 'blog/bosh.html')
```

**Nima o'zgardi?**

Ilgari:

```python
return HttpResponse("Salom!")  # Oddiy matn
```

Hozir:

```python
return render(request, 'blog/bosh.html')  # HTML shablon!
```

---

### **4-Qadam: Sinab Ko'ring!**

```bash
python manage.py runserver
```

`http://127.0.0.1:8000/` ga boring

**🎉 CHIROYLI SAHIFA KO'RASIZ!**

Katta sarlavha, paragraflar, endi oddiy matn emas!

---

## **3-Qism: O'zgaruvchilarni Yuborish (25 daqiqa)**

### **Django'dan HTML'ga Ma'lumot Yuborish**

**Misol:** Foydalanuvchi ismini ko'rsatmoqchimiz

`blog/views.py`:

```python
def bosh_sahifa(request):
    context = {
        'ism': 'Ahmad',
        'yosh': 25,
        'shahar': 'Toshkent'
    }
    return render(request, 'blog/bosh.html', context)
```

**Tushuntirish:**

```python
context = {
    'ism': 'Ahmad',      # ← Bu o'zgaruvchi
    'yosh': 25,          # ← Bu ham
}
```

`context` - bu lug'at (dictionary). HTML'ga ma'lumot yuboramiz.

---

### **HTML'da Ishlatish**

`blog/templates/blog/bosh.html`:

```html
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <title>Mening Blogim</title>
</head>
<body>
    <h1>Salom {{ ism }}! 👋</h1>
    <p>Siz {{ yosh }} yoshdasiz.</p>
    <p>{{ shahar }} shahridan keldingiz.</p>
</body>
</html>
```

**Natija brauzerda:**

```
Salom Ahmad! 👋
Siz 25 yoshdasiz.
Toshkent shahridan keldingiz.
```

---

### **Ko'proq Misol:**

```python
def bosh_sahifa(request):
    context = {
        'sarlavha': 'Django Blog',
        'xabar': 'Bugun ajoyib kun!',
        'postlar_soni': 10,
        'yangi_post': True
    }
    return render(request, 'blog/bosh.html', context)
```

```html
<body>
    <h1>{{ sarlavha }}</h1>
    <p>{{ xabar }}</p>
    <p>Jami {{ postlar_soni }} ta post bor.</p>
</body>
```

---

## **4-Qism: Ro'yxatlar bilan Ishlash (30 daqiqa)**

### **Ro'yxatni Yuborish**

`blog/views.py`:

```python
def bosh_sahifa(request):

    context = {
        'mevalar_royxati': ['Olma', 'Nok', 'Uzum', 'Anor', 'Shaftoli']
    }
    return render(request, 'blog/bosh.html', context)
```

---

### **HTML'da Ro'yxatni Ko'rsatish**

`blog/templates/blog/bosh.html`:

```html
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <title>Mevalar</title>
</head>
<body>
    <h1>Sevimli Mevalarim</h1>

    <ul>
        {% for meva in mevalar_royxati %}
            <li>{{ meva }}</li>
        {% endfor %}
    </ul>
</body>
</html>
```

**Natija:**

```
Sevimli Mevalarim
• Olma
• Nok
• Uzum
• Anor
• Shaftoli
```

---

### **Tushuntirish:**

```html
{% for meva in mevalar_royxati %}
    <li>{{ meva }}</li>
{% endfor %}
```

**Python bilan solishtiring:**

```python
for meva in mevalar_royxati:
    print(f"<li>{meva}</li>")
```

Deyarli bir xil!

**Farqi:**

- Python: `for ... in ...:`
- Django: `{% for ... in ... %} ... {% endfor %}`

---

### **Haqiqiy Blog Misoli:**

```python
def bosh_sahifa(request):
    postlar = [
        {'sarlavha': 'Django o\'rganish', 'muallif': 'Ahmad'},
        {'sarlavha': 'Python maslahatlar', 'muallif': 'Dilnoza'},
        {'sarlavha': 'Web dizayn', 'muallif': 'Bobur'},
    ]

    context = {'postlar': postlar}
    return render(request, 'blog/bosh.html', context)
```

```html
<body>
    <h1>Blog Postlari</h1>

    {% for post in postlar %}
        <div>
            <h2>{{ post.sarlavha }}</h2>
            <p>Muallif: {{ post.muallif }}</p>
            <hr>
        </div>
    {% endfor %}
</body>
```

---

## **5-Qism: Shartlar (If/Else) (20 daqiqa)**

### **Shartli Ko'rsatish**

```python
def bosh_sahifa(request):
    context = {
        'foydalanuvchi_kirgan': True,
        'ism': 'Ahmad'
    }
    return render(request, 'blog/bosh.html', context)
```

```html
<body>
    {% if foydalanuvchi_kirgan %}
        <h1>Salom {{ ism }}!</h1>
        <p>Xush kelibsiz, qaytib!</p>
    {% else %}
        <h1>Iltimos, tizimga kiring</h1>
    {% endif %}
</body>
```

---

### **Raqamlarni Solishtirish**

```python
def bosh_sahifa(request):
    context = {
        'yosh': 17
    }
    return render(request, 'blog/bosh.html', context)
```

```html
<body>
    {% if yosh >= 18 %}
        <p>Siz kattasiz, xush kelibsiz!</p>
    {% else %}
        <p>Uzr, siz 18 yoshdan kichik ekan.</p>
    {% endif %}
</body>
```

---

### **Ko'p Shartlar**

```python
def bosh_sahifa(request):
    context = {
        'postlar_soni': 0
    }
    return render(request, 'blog/bosh.html', context)
```

```html
<body>
    {% if postlar_soni > 10 %}
        <p>Juda ko'p postlar bor!</p>
    {% elif postlar_soni > 0 %}
        <p>Bir nechta postlar bor.</p>
    {% else %}
        <p>Hali postlar yo'q.</p>
    {% endif %}
</body>
```

---

## **6-Qism: Asosiy Shablon (Base Template) (35 daqiqa)**

### **Muammo:**

Har bir sahifada qayta-qayta yozamiz:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Sahifa</title>
</head>
<body>
    <!-- har doim bir xil -->
</body>
</html>
```

**Yechim:** Asosiy shablon yaratamiz, boshqalar undan foydalanadi!

---

### **1-Qadam: Asosiy Shablon Yaratish**

`blog/templates/blog/asosiy.html` yarating:

```html
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <title>{% block sarlavha %}Mening Blogim{% endblock %}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            background-color: white;
            padding: 20px;
            margin-top: 20px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Mening Ajoyib Blogim</h1>
    </div>

    <div class="content">
        {% block kontent %}
        <!-- Bu yerda har bir sahifa o'z kontentini qo'yadi -->
        {% endblock %}
    </div>
</body>
</html>
```

---

### **Tushuntirish:**

```html
{% block sarlavha %}Mening Blogim{% endblock %}
```

Bu **joy band qilish**. Boshqa sahifalar bu joyni o'zgartirishi mumkin.

```html
{% block kontent %}
{% endblock %}
```

Bu **bo'sh joy**. Har bir sahifa bu yerga o'z kontentini qo'yadi.

---

### **2-Qadam: Asosiy Shablondan Foydalanish**

`blog/templates/blog/bosh.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Bosh Sahifa{% endblock %}

{% block kontent %}
    <h2>Xush Kelibsiz! 👋</h2>
    <p>Bu mening Django blogim.</p>
    <p>Bu yerda texnologiya haqida yozaman.</p>
{% endblock %}
```

**Shuncha qisqa! 😍**

---

### **3-Qadam: Yana Sahifa Yaratamiz**

`blog/templates/blog/biz_haqimizda.html` yarating:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Biz Haqimizda{% endblock %}

{% block kontent %}
    <h2>Biz Haqimizda</h2>
    <p>Men Ahmad. Django dasturchiman.</p>
    <p>Bu blogda texnologiya haqida yozaman.</p>
{% endblock %}
```

---

### **View Qo'shamiz**

`blog/views.py`:

```python
def bosh_sahifa(request):
    return render(request, 'blog/bosh.html')

def biz_haqimizda(request):  # ← Yangi
    return render(request, 'blog/biz_haqimizda.html')
```

`blog/urls.py`:

```python
urlpatterns = [
    path('', views.bosh_sahifa, name='bosh_sahifa'),
    path('biz-haqimizda/', views.biz_haqimizda, name='biz_haqimizda'),
]
```

---

### **Sinab Ko'ring:**

- `http://127.0.0.1:8000/` → Bosh sahifa
- `http://127.0.0.1:8000/biz-haqimizda/` → Biz haqimizda

**Ikkalasida ham bir xil dizayn!** 🎨

---

## **7-Qism: Navigatsiya (Menu) (20 daqiqa)**

### **Menu Qo'shamiz**

`blog/templates/blog/asosiy.html` ga qo'shing:

```html
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <title>{% block sarlavha %}Mening Blogim{% endblock %}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .menu {
            background-color: #0056b3;
            padding: 10px;
            text-align: center;
        }
        .menu a {
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            margin: 0 5px;
        }
        .menu a:hover {
            background-color: #003d82;
        }
        .content {
            background-color: white;
            padding: 20px;
            margin: 20px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Mening Ajoyib Blogim</h1>
    </div>

    <div class="menu">
        <a href="/">Bosh Sahifa</a>
        <a href="/biz-haqimizda/">Biz Haqimizda</a>
        <a href="/aloqa/">Aloqa</a>
    </div>

    <div class="content">
        {% block kontent %}
        {% endblock %}
    </div>
</body>
</html>
```

---

### **Aloqa Sahifasini Qo'shamiz**

`blog/templates/blog/aloqa.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Aloqa{% endblock %}

{% block kontent %}
    <h2>Biz Bilan Bog'laning</h2>
    <p>Email: info@mengblog.uz</p>
    <p>Telefon: +998 90 123 45 67</p>
    <p>Manzil: Toshkent, O'zbekiston</p>
{% endblock %}
```

`blog/views.py`:

```python
def aloqa(request):
    return render(request, 'blog/aloqa.html')
```

`blog/urls.py`:

```python
urlpatterns = [
    path('', views.bosh_sahifa, name='bosh_sahifa'),
    path('biz-haqimizda/', views.biz_haqimizda, name='biz_haqimizda'),
    path('aloqa/', views.aloqa, name='aloqa'),
]
```

---

### **Endi 3 ta sahifa bor:**

- Bosh sahifa
- Biz haqimizda
- Aloqa

**Hammasi bir xil dizayn va menu!** 🎉

---

## **8-Qism: URL Nomlari (20 daqiqa)**

### **Muammo:**

```html
<a href="/biz-haqimizda/">Biz Haqimizda</a>
```

Agar URL o'zgarsa? `/about/` bo'lsa? Hammasini o'zgartirish kerak! 😰

---

### **Yechim: URL Nomlaridan Foydalanish**

Eslaydimi, biz nom berdik:

```python
path('biz-haqimizda/', views.biz_haqimizda, name='biz_haqimizda'),
```

HTML da ishlatamiz:

```html
<a href="{% url 'bosh_sahifa' %}">Bosh Sahifa</a>
<a href="{% url 'biz_haqimizda' %}">Biz Haqimizda</a>
<a href="{% url 'aloqa' %}">Aloqa</a>
```

---

### **Asosiy Shablonni Yangilaymiz**

`blog/templates/blog/asosiy.html`:

```html
<div class="menu">
    <a href="{% url 'bosh_sahifa' %}">Bosh Sahifa</a>
    <a href="{% url 'biz_haqimizda' %}">Biz Haqimizda</a>
    <a href="{% url 'aloqa' %}">Aloqa</a>
</div>
```

**Endi URL o'zgarsa, kod o'zgarmaydi!** ✅

---

## **9-Qism: Statik Fayllar (CSS, Images) (30 daqiqa)**

### **1-Qadam: Statik Papka Yaratish**

```
blog/
├── static/
│   └── blog/
│       ├── css/
│       │   └── uslub.css
│       └── images/
│           └── logo.png
├── templates/
└── ...
```

`blog/static/blog/css/uslub.css` yarating:

```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.header {
    background-color: rgba(255, 255, 255, 0.95);
    color: #333;
    padding: 30px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header h1 {
    margin: 0;
    font-size: 2.5em;
    color: #667eea;
}

.menu {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 15px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.menu a {
    color: #667eea;
    text-decoration: none;
    padding: 10px 25px;
    margin: 0 10px;
    border-radius: 25px;
    transition: all 0.3s;
    font-weight: bold;
}

.menu a:hover {
    background-color: #667eea;
    color: white;
}

.content {
    background-color: white;
    padding: 40px;
    margin: 30px auto;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    max-width: 800px;
}

h2 {
    color: #667eea;
    border-bottom: 3px solid #667eea;
    padding-bottom: 10px;
}
```

---

### **2-Qadam: CSS ni Ulash**

`blog/templates/blog/asosiy.html`:

```html
{% load static %}
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <title>{% block sarlavha %}Mening Blogim{% endblock %}</title>
    <link rel="stylesheet" href="{% static 'blog/css/uslub.css' %}">
</head>
<body>
    <div class="header">
        <h1>🚀 Mening Ajoyib Blogim</h1>
    </div>

    <div class="menu">
        <a href="{% url 'bosh_sahifa' %}">🏠 Bosh Sahifa</a>
        <a href="{% url 'biz_haqimizda' %}">👥 Biz Haqimizda</a>
        <a href="{% url 'aloqa' %}">📧 Aloqa</a>
    </div>

    <div class="content">
        {% block kontent %}
        {% endblock %}
    </div>
</body>
</html>
```

**Muhim:**

```html
{% load static %}  ← Eng yuqorida!
```

```html
<link rel="stylesheet" href="{% static 'blog/css/uslub.css' %}">
```

---

### **Sinab Ko'ring:**

```bash
python manage.py runserver
```

**🎨 CHIROYLI GRADIENT DIZAYN KO'RASIZ!**

---

## **10-Qism: To'liq Blog Post Sahifasi (40 daqiqa)**

### **Postlar Ro'yxatini Yaratamiz**

`blog/views.py`:

```python
def bosh_sahifa(request):
    postlar = [
        {
            'id': 1,
            'sarlavha': 'Django o\'rganish',
            'matn': 'Django - bu ajoyib web framework. U bilan tez va oson dastur yozish mumkin.',
            'muallif': 'Ahmad Valiyev',
            'sana': '2024-01-15'
        },
        {
            'id': 2,
            'sarlavha': 'Python maslahatlar',
            'matn': 'Python da clean code yozish uchun PEP 8 ga amal qiling.',
            'muallif': 'Dilnoza Karimova',
            'sana': '2024-01-14'
        },
        {
            'id': 3,
            'sarlavha': 'Web dizayn asoslari',
            'matn': 'Yaxshi web dizayn uchun CSS Flexbox va Grid o\'rganing.',
            'muallif': 'Bobur Toshmatov',
            'sana': '2024-01-13'
        }
    ]

    context = {'postlar': postlar}
    return render(request, 'blog/bosh.html', context)
```

---

### **Chiroyli Post Kartalari**

`blog/templates/blog/bosh.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Bosh Sahifa - Blog{% endblock %}

{% block kontent %}
    <h2>📝 So'nggi Postlar</h2>

    {% for post in postlar %}
        <div class="post-card">
            <h3>{{ post.sarlavha }}</h3>
            <p class="post-meta">
                👤 {{ post.muallif }} | 📅 {{ post.sana }}
            </p>
            <p>{{ post.matn }}</p>
            <a href="#" class="btn">Batafsil o'qish →</a>
        </div>
    {% endfor %}
{% endblock %}
```

---

### **CSS Qo'shamiz**

`blog/static/blog/css/uslub.css` ga qo'shing:

```css
.post-card {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 25px;
    margin: 20px 0;
    border-radius: 10px;
    border-left: 5px solid #667eea;
    transition: transform 0.3s;
}

.post-card:hover {
    transform: translateX(10px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.post-card h3 {
    color: #333;
    margin-top: 0;
    font-size: 1.5em;
}

.post-meta {
    color: #666;
    font-size: 0.9em;
    margin: 10px 0;
}

.btn {
    display: inline-block;
    background-color: #667eea;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 10px;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #764ba2;
}
```

---

### **🎉 Natija:**

Ajoyib post kartalari:

- Gradient orqa fon
- Hover effekt
- Chiroyli tugma
- Meta ma'lumotlar

---

[🏡Uy vazifasi](https://app.notion.com/p/Uy-vazifasi-3d86021d9a128093b704c78c8b7d187a?pvs=21)