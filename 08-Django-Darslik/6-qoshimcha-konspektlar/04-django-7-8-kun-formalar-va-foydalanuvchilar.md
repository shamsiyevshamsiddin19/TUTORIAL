# 📚Django 7-8 Kun✅

# Django 7-8 Kun: Formalar va Foydalanuvchilar

## Ma'lumot Qabul Qilish va Kiritish! 📝

---

## **1-Qism: Forma Nima? (15 daqiqa)**

### **Oddiy Tushuntirish:**

Hozircha faqat ma'lumotlarni **ko'rsatdik**.

Endi **ma'lumot kiritishni** o'rganamiz!

```
Ko'rsatish: Baza → View → Shablon → Foydalanuvchi
Kiritish:  Foydalanuvchi → Forma → View → Baza
```

---

### **Forma Misollari:**

```
- Yangi post yozish
- Izoh qoldirish
- Ro'yxatdan o'tish
- Login qilish
- Profilni tahrirlash
```

**Hammasi FORMA orqali!**

---

### **Oddiy HTML Forma:**

```html
<form method="POST">
    <input type="text" name="ism" placeholder="Ismingiz">
    <input type="email" name="email" placeholder="Email">
    <button type="submit">Yuborish</button>
</form>
```

**Muammo:** Django da bunday yozish xavfli va qiyin!

**Yechim:** Django Formalari! 🎉

---

## **2-Qism: Birinchi Django Formasini Yaratamiz (30 daqiqa)**

### **1-Qadam: forms.py Fayli Yaratish**

`blog` papkasida yangi fayl: `blog/forms.py`

```python
from django import forms
from .models import Post

class PostForma(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['sarlavha', 'matn', 'muallif']
```

**Shuncha oddiy!** 😍

---

### **Tushuntirish:**

```python
class PostForma(forms.ModelForm):
```

"Post modeli uchun forma yarat"

---

```python
class Meta:
    model = Post
```

"Qaysi modeldan?"

---

```python
    fields = ['sarlavha', 'matn', 'muallif']
```

"Qaysi maydonlar ko'rinsin?"

---

### **Django Avtomatik Yaratadi:**

✅ Forma maydonlari

✅ Maydon turlari (CharField → text input)

✅ Validatsiya (tekshirish)

✅ Xato xabarlari

**Hammasi avtomatik!**

---

## **3-Qism: Yangi Post Qo'shish Sahifasi (40 daqiqa)**

### **1-Qadam: View Yaratish**

`blog/views.py`:

```python
from django.shortcuts import render, redirect
from .models import Post
from .forms import PostForma

def post_yaratish(request):
    if request.method == 'POST':
        # Foydalanuvchi formani yubordi
        forma = PostForma(request.POST)
        if forma.is_valid():
            forma.save()
            return redirect('bosh_sahifa')
    else:
        # Foydalanuvchi sahifani ochdi
        forma = PostForma()

		return render(request, 'blog/post_yaratish.html', {'forma': forma})
```

---

### **Keling Tushuntiramiz:**

```python
if request.method == 'POST':
```

**Ikkita holat:**

- `GET` = Foydalanuvchi sahifani ochdi (formani ko'rmoqchi)
- `POST` = Foydalanuvchi tugmani bosdi (ma'lumot yubormoqchi)

---

```python
forma = PostForma(request.POST)
```

Forma yaratdik va foydalanuvchi yuborgan ma'lumotlarni berdik.

---

```python
if forma.is_valid():
```

"Forma to'g'rimi?" tekshiramiz.

Tekshiradi:

- Barcha kerakli maydonlar to'ldirilganmi?
- Email email formatidami?
- Raqam haqiqatan raqammi?

---

```python
forma.save()
```

Bazaga saqlaymiz! Shuncha oddiy! 🎉

---

```python
return redirect('bosh_sahifa')
```

Saqlangandan keyin bosh sahifaga yo'naltiramiz.

---

### **2-Qadam: Shablon Yaratish**

`blog/templates/blog/post_yaratish.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Yangi Post Yaratish{% endblock %}

{% block kontent %}
    <h2>✍️ Yangi Post Yozing</h2>

    <form method="POST" class="post-form">
        {% csrf_token %}

        {{ forma.as_p }}

        <button type="submit" class="btn">📤 Nashr Etish</button>
        <a href="{% url 'bosh_sahifa' %}" class="btn btn-secondary">❌ Bekor Qilish</a>
    </form>
{% endblock %}
```

---

### **Tushuntirish:**

```html
{% csrf_token %}
```

**Juda muhim!** Bu xavfsizlik tokeni.

Django busiz formani qabul qilmaydi. CSRF hujumlaridan himoya.

---

```html
{{ forma.as_p }}
```

Formani avtomatik chiqaradi!

- `as_p` = Har bir maydon `<p>` ichida
- `as_table` = Jadval shaklida
- `as_ul` = Ro'yxat shaklida

---

### **3-Qadam: CSS Qo'shamiz**

`blog/static/blog/css/uslub.css` ga:

```css
.post-form {
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 10px;
    margin: 20px 0;
}

.post-form input[type="text"],
.post-form textarea {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
}

.post-form input[type="text"]:focus,
.post-form textarea:focus {
    border-color: #667eea;
    outline: none;
}

.post-form textarea {
    min-height: 200px;
    font-family: Arial, sans-serif;
}

.post-form label {
    font-weight: bold;
    color: #333;
    display: block;
    margin-top: 15px;
}

.btn-secondary {
    background-color: #6c757d;
    margin-left: 10px;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

.errorlist {
    color: red;
    list-style: none;
    padding: 0;
    margin: 5px 0;
}
```

---

### **4-Qadam: URL Qo'shamiz**

`blog/urls.py`:

```python
urlpatterns = [
    path('', views.bosh_sahifa, name='bosh_sahifa'),
    path('post/<int:post_id>/', views.post_batafsil, name='post_batafsil'),
    path('yangi/', views.post_yaratish, name='post_yaratish'),
    # ... boshqalar
]
```

---

### **5-Qadam: Menu ga Qo'shamiz**

`blog/templates/blog/asosiy.html`:

```html
<div class="menu">
    <a href="{% url 'bosh_sahifa' %}">🏠 Bosh Sahifa</a>
    <a href="{% url 'post_yaratish' %}">✍️ Yangi Post</a>
    <a href="{% url 'ommabop' %}">🔥 Ommabop</a>
    <a href="{% url 'aloqa' %}">📧 Aloqa</a>
</div>
```

---

### **Sinab Ko'ramiz! 🎉**

1. `http://127.0.0.1:8000/yangi/` ga boring
2. Forma ko'rinadi!
3. Ma'lumot kiriting
4. "Nashr Etish" bosing
5. Bosh sahifada yangi post paydo bo'ladi!

**ISHLADIII!** 🎊

---

## **4-Qism: Formani Chiroyliroq Qilish (25 daqiqa)**

### **Hozirgi Muammo:**

Forma oddiy va xunuk.

---

### **Yechim: Qo'lda Chiqarish**

`blog/forms.py`:

```python
from django import forms
from .models import Post

class PostForma(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['sarlavha', 'matn', 'muallif']
        widgets = {
            'sarlavha': forms.TextInput(attrs={
                'class': 'forma-input',
                'placeholder': 'Post sarlavhasini kiriting...'
            }),
            'matn': forms.Textarea(attrs={
                'class': 'forma-textarea',
                'placeholder': 'Post matnini yozing...',
                'rows': 10
            }),
            'muallif': forms.TextInput(attrs={
                'class': 'forma-input',
                'placeholder': 'Muallif ismi...'
            }),
        }
        labels = {
            'sarlavha': '📝 Sarlavha',
            'matn': '✍️ Post Matni',
            'muallif': '👤 Muallif',
        }
```

---

### **Yanada Chiroyli CSS**

`uslub.css` ga:

```css
.forma-input,
.forma-textarea {
    width: 100%;
    padding: 15px;
    margin: 10px 0;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s;
    box-sizing: border-box;
}

.forma-input:focus,
.forma-textarea:focus {
    border-color: #667eea;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.2);
    outline: none;
}

.forma-textarea {
    min-height: 200px;
    font-family: Arial, sans-serif;
    resize: vertical;
}

.post-form label {
    font-weight: bold;
    color: #333;
    font-size: 1.1em;
    display: block;
    margin-top: 20px;
    margin-bottom: 5px;
}
```

---

## **5-Qism: Postni Tahrirlash (35 daqiqa)**

### **1-Qadam: View Yaratish**

`blog/views.py`:

```python
def post_tahrirlash(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    if request.method == 'POST':
        forma = PostForma(request.POST, instance=post)
        if forma.is_valid():
            forma.save()
            return redirect('post_batafsil', post_id=post.id)
    else:
        forma = PostForma(instance=post)

    context = {
        'forma': forma,
        'post': post
    }
    return render(request, 'blog/post_tahrirlash.html', context)
```

**Farq:**

```python
forma = PostForma(instance=post)
```

Mavjud postni formaga yuklaymiz!

---

### **2-Qadam: Shablon**

`blog/templates/blog/post_tahrirlash.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Postni Tahrirlash{% endblock %}

{% block kontent %}
    <h2>✏️ Postni Tahrirlash</h2>
    <p><strong>Tahrirlayotgan post:</strong> {{ post.sarlavha }}</p>

    <form method="POST" class="post-form">
        {% csrf_token %}

        {{ forma.as_p }}

        <button type="submit" class="btn">💾 Saqlash</button>
        <a href="{% url 'post_batafsil' post.id %}" class="btn btn-secondary">
            ❌ Bekor Qilish
        </a>
    </form>
{% endblock %}
```

---

### **3-Qadam: URL**

`blog/urls.py`:

```python
urlpatterns = [
    path('', views.bosh_sahifa, name='bosh_sahifa'),
    path('post/<int:post_id>/', views.post_batafsil, name='post_batafsil'),
    path('yangi/', views.post_yaratish, name='post_yaratish'),
    path('post/<int:post_id>/tahrirlash/', views.post_tahrirlash, name='post_tahrirlash'),
]
```

---

### **4-Qadam: Post Sahifasiga Tugma**

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

        <div class="post-actions">
            <a href="{% url 'post_tahrirlash' post.id %}" class="btn">
                ✏️ Tahrirlash
            </a>
            <a href="{% url 'bosh_sahifa' %}" class="btn">
                ⬅ Orqaga
            </a>
        </div>

    </article>
{% endblock %}
```

CSS:

```css
.post-actions {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 2px solid #eee;
}

.post-actions .btn {
    margin-right: 10px;
}
```

---

## **6-Qism: Postni O'chirish (20 daqiqa)**

### **1-Qadam: View**

`blog/views.py`:

```python
def post_ochirish(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    if request.method == 'POST':
        post.delete()
        return redirect('bosh_sahifa')

    context = {'post': post}
    return render(request, 'blog/post_ochirish.html', context)
```

---

### **2-Qadam: Shablon**

`blog/templates/blog/post_ochirish.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Postni O'chirish{% endblock %}

{% block kontent %}
    <div class="delete-confirm">
        <h2>⚠️ Ogohlik!</h2>
        <p>Siz haqiqatan ham bu postni o'chirmoqchimisiz?</p>

        <div class="post-card">
            <h3>{{ post.sarlavha }}</h3>
            <p>{{ post.matn|truncatewords:30 }}</p>
        </div>

        <form method="POST">
            {% csrf_token %}
            <button type="submit" class="btn btn-danger">
                🗑️ Ha, O'chirish
            </button>
            <a href="{% url 'post_batafsil' post.id %}" class="btn btn-secondary">
                ❌ Yo'q, Bekor Qilish
            </a>
        </form>
    </div>
{% endblock %}
```

---

### **CSS**

```css
.delete-confirm {
    text-align: center;
    padding: 40px;
}

.delete-confirm h2 {
    color: #dc3545;
}

.btn-danger {
    background-color: #dc3545;
}

.btn-danger:hover {
    background-color: #c82333;
}
```

---

### **URL**

```python
path('post/<int:post_id>/ochirish/', views.post_ochirish, name='post_ochirish'),
```

---

### **Post Sahifasiga Tugma**

```html
<div class="post-actions">
    <a href="{% url 'post_tahrirlash' post.id %}" class="btn">✏️ Tahrirlash</a>
    <a href="{% url 'post_ochirish' post.id %}" class="btn btn-danger">🗑️ O'chirish</a>
    <a href="{% url 'bosh_sahifa' %}" class="btn btn-secondary">⬅ Orqaga</a>
</div>
```

---

## **7-Qism: Xabarlar (Messages) (25 daqiqa)**

### **Muammo:**

Post yaratilganda foydalanuvchi bilmaydi "Saqlandi" yoki "Xato bo'ldi"

---

### **Yechim: Django Messages!**

`blog/views.py`:

```python
from django.contrib import messages

def post_yaratish(request):
    if request.method == 'POST':
        forma = PostForma(request.POST)
        if forma.is_valid():
            forma.save()
            messages.success(request, '✅ Post muvaffaqiyatli yaratildi!')
            return redirect('bosh_sahifa')
        else:
            messages.error(request, '❌ Xato! Iltimos qaytadan urinib koring.')
    else:
        forma = PostForma()

    return render(request, 'blog/post_yaratish.html', {'forma': forma})
```

---

### **Tahrirlash va O'chirishga Ham**

```python
def post_tahrirlash(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    if request.method == 'POST':
        forma = PostForma(request.POST, instance=post)
        if forma.is_valid():
            forma.save()
            messages.success(request, '✅ Post yangilandi!')
            return redirect('post_batafsil', post_id=post.id)
    else:
        forma = PostForma(instance=post)

    context = {'forma': forma, 'post': post}
    return render(request, 'blog/post_tahrirlash.html', context)

def post_ochirish(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    if request.method == 'POST':
        post.delete()
        messages.success(request, '✅ Post o\'chirildi!')
        return redirect('bosh_sahifa')

    return render(request, 'blog/post_ochirish.html', {'post': post})
```

---

### **Asosiy Shablonda Ko'rsatish**

`blog/templates/blog/asosiy.html`:

```html
<div class="content">
    {% if messages %}
        <div class="messages">
            {% for message in messages %}
                <div class="alert alert-{{ message.tags }}">
                    {{ message }}
                </div>
            {% endfor %}
        </div>
    {% endif %}

    {% block kontent %}
    {% endblock %}
</div>
```

---

### **CSS**

```css
.messages {
    margin: 20px 0;
}

.alert {
    padding: 15px 20px;
    border-radius: 8px;
    margin: 10px 0;
    font-weight: bold;
}

.alert-success {
    background-color: #d4edda;
    color: #155724;
    border-left: 5px solid #28a745;
}

.alert-error {
    background-color: #f8d7da;
    color: #721c24;
    border-left: 5px solid #dc3545;
}

.alert-warning {
    background-color: #fff3cd;
    color: #856404;
    border-left: 5px solid #ffc107;
}

.alert-info {
    background-color: #d1ecf1;
    color: #0c5460;
    border-left: 5px solid #17a2b8;
}
```

---

## **8-Qism: Foydalanuvchi Tizimi (45 daqiqa)**

### **Django User Modeli**

Django avtomatik foydalanuvchi tizimi bor!

```python
from django.contrib.auth.models import User
```

Ichida:

- `username` - Foydalanuvchi nomi
- `email` - Email
- `password` - Parol (shifrlangan)
- `first_name`, `last_name` - Ism, familiya

---

### **1-Qadam: Ro'yxatdan O'tish Formasini Yaratish**

`blog/forms.py`:

```python
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class RoyxatdanOtishForma(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        labels = {
            'username': 'Foydalanuvchi nomi',
            'email': 'Email',
        }
```

---

### **2-Qadam: Ro'yxatdan O'tish View**

`blog/views.py`:

```python
from django.contrib.auth import login
from .forms import RoyxatdanOtishForma

def royxatdan_otish(request):
    if request.method == 'POST':
        forma = RoyxatdanOtishForma(request.POST)
        if forma.is_valid():
            user = forma.save()
            login(request, user)
            messages.success(request, f'✅ Xush kelibsiz, {user.username}!')
            return redirect('bosh_sahifa')
    else:
        forma = RoyxatdanOtishForma()

    return render(request, 'blog/royxatdan_otish.html', {'forma': forma})
```

---

### **3-Qadam: Shablon**

`blog/templates/blog/royxatdan_otish.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Ro'yxatdan O'tish{% endblock %}

{% block kontent %}
    <div class="auth-form">
        <h2>👤 Ro'yxatdan O'ting</h2>

        <form method="POST">
            {% csrf_token %}

            {{ forma.as_p }}

            <button type="submit" class="btn">📝 Ro'yxatdan O'tish</button>
        </form>

        <p class="auth-link">
            Hisobingiz bormi?
            <a href="#">Kirish</a>
        </p>
    </div>
{% endblock %}
```

---

### **CSS**

```css
.auth-form {
    max-width: 500px;
    margin: 50px auto;
    background-color: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.auth-form h2 {
    text-align: center;
    color: #667eea;
    margin-bottom: 30px;
}

.auth-form input {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
}

.auth-form .btn {
    width: 100%;
    margin-top: 20px;
}

.auth-link {
    text-align: center;
    margin-top: 20px;
    color: #666;
}

.auth-link a {
    color: #667eea;
    text-decoration: none;
    font-weight: bold;
}

.auth-link a:hover {
    text-decoration: underline;
}

.helptext {
    font-size: 0.85em;
    color: #666;
    display: block;
    margin: 5px 0;
}
```

---

### **URL**

```python
path('royxatdan-otish/', views.royxatdan_otish, name='royxatdan_otish'),
```

---

## **9-Qism: Kirish va Chiqish (30 daqiqa)**

### **Kirish View**

`blog/views.py`:

```python
from django.contrib.auth import authenticate, login, logout

def kirish(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, f'✅ Xush kelibsiz, {user.username}!')
            return redirect('bosh_sahifa')
        else:
            messages.error(request, '❌ Noto\'g\'ri foydalanuvchi nomi yoki parol!')

    return render(request, 'blog/kirish.html')
```

---

### **Kirish Shablon**

`blog/templates/blog/kirish.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Kirish{% endblock %}

{% block kontent %}
    <div class="auth-form">
        <h2>🔐 Tizimga Kirish</h2>

        <form method="POST">
            {% csrf_token %}

            <label>Foydalanuvchi nomi:</label>
            <input type="text" name="username" required>

            <label>Parol:</label>
            <input type="password" name="password" required>

            <button type="submit" class="btn">🚀 Kirish</button>
        </form>

        <p class="auth-link">
            Hisobingiz yo'qmi?
            <a href="{% url 'royxatdan_otish' %}">Ro'yxatdan o'ting</a>
        </p>
    </div>
{% endblock %}
```

---

### **Chiqish View**

```python
def chiqish(request):
    logout(request)
    messages.info(request, '👋 Xayr! Tez orada qaytib keling!')
    return redirect('bosh_sahifa')
```

---

### **URL lar**

```python
urlpatterns = [
    # ... boshqalar
    path('royxatdan-otish/', views.royxatdan_otish, name='royxatdan_otish'),
    path('kirish/', views.kirish, name='kirish'),
    path('chiqish/', views.chiqish, name='chiqish'),
]
```

---

### **Menuni Yangilaymiz**

`blog/templates/blog/asosiy.html`:

```html
<div class="menu">
    <!-- Always visible -->
    <a href="{% url 'bosh_sahifa' %}">🏠 Bosh Sahifa</a>
    <a href="{% url 'ommabop' %}">🔥 Ommabop</a>
    <a href="{% url 'biz_haqimizda' %}">👥 Biz Haqimizda</a>
    <a href="{% url 'portfolio' %}">💼 Portfolio</a>

    {% if user.is_authenticated %}
        <!-- Only if logged in -->
        <a href="{% url 'post_yaratish' %}">✍️ Yangi Post</a>
        <span style="color: white;">👤 {{ user.username }}</span>
        <a href="{% url 'chiqish' %}">🚪 Chiqish</a>
    {% else %}
        <!-- Only if NOT logged in -->
        <a href="{% url 'kirish' %}">🔐 Kirish</a>
        <a href="{% url 'royxatdan_otish' %}">📝 Ro'yxatdan O'tish</a>
    {% endif %}

    <!-- Always visible -->
    <a href="{% url 'aloqa' %}">📧 Aloqa</a>
</div>

```

---

## **10-Qism: Faqat Kirganlargina Post Yaza Olsin (20 daqiqa)**

### **Login Required Decorator**

`blog/views.py`:

```python
from django.contrib.auth.decorators import login_required

@login_required
def post_yaratish(request):
    if request.method == 'POST':
        forma = PostForma(request.POST)
        if forma.is_valid():
            forma.save()
            messages.success(request, '✅ Post muvaffaqiyatli yaratildi!')
            return redirect('bosh_sahifa')
    else:
        forma = PostForma()

    return render(request, 'blog/post_yaratish.html', {'forma': forma})

@login_required
def post_tahrirlash(request, post_id):
    # ... kod

@login_required
def post_ochirish(request, post_id):
    # ... kod
```

---

### **Sozlamalar**

`saytim/settings.py` ga qo'shing:

```python
LOGIN_URL = 'kirish'
```

**Nima bo'ladi?**

Kimdir tizimga kirmasdan `/yangi/` ga kirmoqchi bo'lsa, avtomatik `/kirish/` ga yo'naltiriladi!

---

## **11-Qism: Post Muallifi (30 daqiqa)**

### **Model ni O'zgartirish**

`blog/models.py`:

```python
~~from django.contrib.auth.models import User~~

class Post(models.Model):
    sarlavha = models.CharField(max_length=200)
    matn = models.TextField()
    muallif = models.ForeignKey(User, on_delete=models.CASCADE)  # O'zgardi!
    yaratilgan_sana = models.DateTimeField(auto_now_add=True)
    yangilangan_sana = models.DateTimeField(auto_now=True)
    nashr_etilgan = models.BooleanField(default=True)
    korildi = models.IntegerField(default=0)

    def __str__(self):
        return self.sarlavha
```

**Farq:**

Oldin:

```python
muallif = models.CharField(max_length=100)  # Oddiy matn
```

Hozir:

```python
muallif = models.ForeignKey(User, on_delete=models.CASCADE)  # Foydalanuvchiga bog'langan!
```

---

### **Migratsiya**

```bash
#Before running this command please make user every object is deleted in DB, including superuser

python manage.py makemigrations
```

**Savol beradi:** "Mavjud postlar uchun qaysi foydalanuvchini belgilash?"

**1 ni bosing**, keyin superuser ID sini kiriting (odatda `1`)

```bash
python manage.py migrate
```

---

### **Forma ni O'zgartirish**

`blog/forms.py`:

```python
class PostForma(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['sarlavha', 'matn']  # muallif yo'q!
        # ... widgets va labels
```

**Nega muallif yo'q?**

Chunki avtomatik qo'shamiz!

---

### **View da Muallif Qo'shish**

```python
@login_required
def post_yaratish(request):
    if request.method == 'POST':
        forma = PostForma(request.POST)
        if forma.is_valid():
            post = forma.save(commit=False)
            post.muallif = request.user  # Avtomatik!
            post.save()
            messages.success(request, '✅ Post yaratildi!')
            return redirect('bosh_sahifa')
    else:
        forma = PostForma()

    return render(request, 'blog/post_yaratish.html', {'forma': forma})
```

**Tushuntirish:**

```python
post = forma.save(commit=False)
```

Formani saqla, lekin hali bazaga yozma (kutib tur)

```python
post.muallif = request.user
```

Muallifni o'rnat

```python
post.save()
```

Endi bazaga yoz!

---

### **Faqat O'z Postini Tahrirlash**

```python
@login_required
def post_tahrirlash(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    # Faqat muallif tahrirlay oladi
    if post.muallif != request.user:
        messages.error(request, '❌ Siz faqat o\'z postingizni tahrirlashingiz mumkin!')
        return redirect('post_batafsil', post_id=post.id)

    if request.method == 'POST':
        forma = PostForma(request.POST, instance=post)
        if forma.is_valid():
            forma.save()
            messages.success(request, '✅ Post yangilandi!')
            return redirect('post_batafsil', post_id=post.id)
    else:
        forma = PostForma(instance=post)

    context = {'forma': forma, 'post': post}
    return render(request, 'blog/post_tahrirlash.html', context)
```

---

### **Shablonda Shartli Tugmalar**

`blog/templates/blog/post_batafsil.html`:

```html
<div class="post-actions">
    {% if user == post.muallif %}
        <a href="{% url 'post_tahrirlash' post.id %}" class="btn">
            ✏️ Tahrirlash
        </a>
        <a href="{% url 'post_ochirish' post.id %}" class="btn btn-danger">
            🗑️ O'chirish
        </a>
    {% endif %}

    <a href="{% url 'bosh_sahifa' %}" class="btn btn-secondary">
        ⬅ Orqaga
    </a>
</div>
```

**Faqat muallif ko'radi!**

---

## **7-8 Kun Xulosasi**

### **Nima O'rgandik:**

✅ Django formalari yaratish

✅ ModelForm ishlatish

✅ Ma'lumot qabul qilish (POST)

✅ Validatsiya (tekshirish)

✅ Post yaratish, tahrirlash, o'chirish

✅ Django messages tizimi

✅ Foydalanuvchi tizimi (User)

✅ Ro'yxatdan o'tish va kirish

✅ `login_required` decorator

✅ ForeignKey (bog'lanishlar)

✅ Faqat muallif tahrirlashi

---

## **Amaliy Mashqlar**

### **1. Profil Sahifasi**

Har bir foydalanuvchining profil sahifasini yarating:

- Uning barcha postlari
- Jami postlar soni
- Birinchi post sanasi

---

### **2. Izoh Tizimi**

Postlarga izoh qoldirish:

```python
class Izoh(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    muallif = models.ForeignKey(User, on_delete=models.CASCADE)
    matn = models.TextField()
    yaratilgan = models.DateTimeField(auto_now_add=True)
```

Forma yarating va post sahifasiga qo'shing!

---

### **3. Like Tizimi**

Postlarni like qilish:

```python
class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['post', 'user']  # Bir marta like
```

---

## **Uy Vazifasi**

### **1. Parol O'zgartirish**

Django'ning `PasswordChangeForm` dan foydalaning.

---

### **2. Qidiruv Formasi**

Headerda qidiruv input i:

```html
<form method="GET" action="{% url 'qidiruv' %}">
    <input type="text" name="q" placeholder="Qidirish...">
    <button type="submit">🔍</button>
</form>
```

---

### **3. Kategoriya Tanlash**

Post yaratishda kategoriya tanlash dropdown i qo'shing.

---

## **Keyingi Darsda:**

**9-10 Kun: Rasmlar va Media Fayllar**

- Rasm yuklash
- Profil rasmi
- Post rasmlari
- Media sozlamalari
- Pillow kutubxonasi

**Juda qiziqarli!** 📸

---

**Jami vaqt:** 6-7 soat tanaffuslar bilan

**Esda tuting:** Formalar va foydalanuvchilar - har qanday ijtimoiy platformaning asosi! 💪