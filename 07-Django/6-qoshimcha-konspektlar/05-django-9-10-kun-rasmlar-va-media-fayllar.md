# 📚Django 9-10 Kun✅

# Django 9-10 Kun: Rasmlar va Media Fayllar

## Tasvirlar Bilan Ishlash! 📸

---

## **1-Qism: Media Fayllar Nima? (15 daqiqa)**

### **Static vs Media - Farqi Nima?**

**Static fayllar:**

```
CSS, JavaScript, rasmlar (logo, icon, dizayn)
Dasturchi qo'shadi
O'zgarmaydi
```

**Media fayllar:**

```
Foydalanuvchi yuklagan fayllar
Profil rasmlari, post rasmlari, hujjatlar
Har kuni yangilari qo'shiladi
```

---

### **Misol:**

```
Static:
- Logo.png (siz qo'shasiz)
- Sayt dizayni rasmlari
- Icon lar

Media:
- Foydalanuvchi profil rasmi (ular yuklaydi)
- Post rasmlari (ular yuklaydi)
- Yuklangan fayllar
```

---

## **2-Qism: Media Sozlamalari (20 daqiqa)**

### **1-Qadam: Pillow O'rnatish**

Django rasm bilan ishlash uchun Pillow kerak!

```bash
pip install Pillow
```

Kutamiz... Tayyor! ✅

---

### **2-Qadam: Settings.py Sozlash**

`saytim/settings.py` ning oxiriga qo'shing:

```python
# Media fayllar sozlamalari
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

**Tushuntirish:**

```python
MEDIA_URL = '/media/'
```

Brauzerda qanday ko'rinadi: `http://127.0.0.1:8000/media/rasm.jpg`

```python
MEDIA_ROOT = BASE_DIR / 'media'
```

Qayerda saqlanadi: `mening_birinchi_django/media/`

---

### **3-Qadam: URLs.py Sozlash**

`saytim/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('blog.urls')),
]

# Development da media fayllar uchun
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

**Muhim:** Bu faqat development uchun! Production da nginx/Apache ishlatiladi.

---

### **4-Qadam: Media Papkasini Yaratish**

```bash
mkdir media
```

Ichida yangi papkalar:

```bash
mkdir media/postlar
mkdir media/profillar
```

**Natija:**

```
mening_birinchi_django/
├── media/
│   ├── postlar/
│   └── profillar/
├── blog/
├── saytim/
└── manage.py
```

---

## **3-Qism: Post Modeliga Rasm Qo'shamiz (25 daqiqa)**

### **Model-ni Yangilaymiz**

`blog/models.py`:

```python
from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    sarlavha = models.CharField(max_length=200)
    matn = models.TextField()
    muallif = models.ForeignKey(User, on_delete=models.CASCADE)
    rasm = models.ImageField(upload_to='postlar/', blank=True, null=True)  # YANGI!
    yaratilgan_sana = models.DateTimeField(auto_now_add=True)
    yangilangan_sana = models.DateTimeField(auto_now=True)
    nashr_etilgan = models.BooleanField(default=True)
    ko1rildi = models.IntegerField(default=0)

    def __str__(self):
        return self.sarlavha
```

---

### **Tushuntirish:**

```python
rasm = models.ImageField(upload_to='postlar/', blank=True, null=True)
```

**ImageField:**

- Rasm maydoni
- Faqat rasm formatlarini qabul qiladi (jpg, png, gif)

**upload_to='postlar/':**

- `media/postlar/` ga yuklanadi

**blank=True:**

- Forma bo'sh bo'lishi mumkin (majburiy emas)

**null=True:**

- Bazada NULL bo'lishi mumkin

---

### **Migratsiya**

```bash
python manage.py makemigrations
python manage.py migrate
```

**Tayyor!** ✅

---

## **4-Qism: Forma va Rasm Yuklash (30 daqiqa)**

### **Formani Yangilaymiz**

`blog/forms.py`:

```python
class PostForma(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['sarlavha', 'matn', 'rasm']  # rasm qo'shildi!
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
            'rasm': forms.FileInput(attrs={
                'class': 'forma-file',
            }),
        }
        labels = {
            'sarlavha': '📝 Sarlavha',
            'matn': '✍️ Post Matni',
            'rasm': '🖼️ Rasm (ixtiyoriy)',
        }
```

---

### **View ni O'zgartirish**

`blog/views.py`:

```python
@login_required
def post_yaratish(request):
    if request.method == 'POST':
        forma = PostForma(request.POST, request.FILES)  # request.FILES qo'shildi!
        if forma.is_valid():
            post = forma.save(commit=False)
            post.muallif = request.user
            post.save()
            messages.success(request, '✅ Post yaratildi!')
            return redirect('bosh_sahifa')
    else:
        forma = PostForma()

    return render(request, 'blog/post_yaratish.html', {'forma': forma})
```

**Muhim:**

```python
forma = PostForma(request.POST, request.FILES)
```

`request.FILES` - bu rasm va fayllar uchun!

---

### **Shablonni O'zgartirish**

`blog/templates/blog/post_yaratish.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Yangi Post Yaratish{% endblock %}

{% block kontent %}
    <h2>✍️ Yangi Post Yozing</h2>

    <form method="POST" enctype="multipart/form-data" class="post-form">
        {% csrf_token %}

        {{ forma.as_p }}

        <button type="submit" class="btn">📤 Nashr Etish</button>
        <a href="{% url 'bosh_sahifa' %}" class="btn btn-secondary">❌ Bekor Qilish</a>
    </form>
{% endblock %}
```

**Juda muhim:**

```html
<form method="POST" enctype="multipart/form-data">
```

`enctype="multipart/form-data"` - bu fayllar yuklash uchun zarur!

Bunsiz rasm yuklanmaydi! ⚠️

---

### **CSS Qo'shamiz**

`blog/static/blog/css/uslub.css`:

```css
.forma-file {
    display: block;
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 2px dashed #667eea;
    border-radius: 8px;
    background-color: #f8f9fa;
    cursor: pointer;
    transition: all 0.3s;
}

.forma-file:hover {
    border-color: #764ba2;
    background-color: #e9ecef;
}
```

---

### **Sinab Ko'ring!**

1. `/yangi/` ga boring
2. Post yarating
3. Rasm tanlang
4. Nashr eting!

`media/postlar/` papkasiga qarang - rasm shu yerda! 📸

## Self- experience

```sql
- Since I actually have two PostForma classes in my forms.py it didn't work.
- 
```

---

## **5-Qism: Rasmni Ko'rsatish (25 daqiqa)**

### **Bosh Sahifada**

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
    {% endfor %}
{% endblock %}
```

---

### **Muhim:**

```html
{% if post.rasm %}
    <img src="{{ post.rasm.url }}" alt="{{ post.sarlavha }}">
{% endif %}
```

- `post.rasm` - Rasm bormi yo'qmi tekshiradi
- `post.rasm.url` - Rasmning URL manzili (post - Model, rasm - ImageField)

---

### **CSS - Rasmni Chiroyli Qilish**

```css
.post-card {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 0;  /* O'zgartiramiz */
    margin: 20px 0;
    border-radius: 10px;
    border-left: 5px solid #667eea;
    overflow: hidden;
    transition: transform 0.3s;
}

.post-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
    display: block;
}

.post-card-content {
    padding: 25px;
}

.post-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}
```

---

### **Post Batafsil Sahifasida**

`blog/templates/blog/post_batafsil.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}{{ post.sarlavha }}{% endblock %}

{% block kontent %}
    <article class="post-detail">
        <h1>{{ post.sarlavha }}</h1>

        {% if post.rasm %}
            <img src="{{ post.rasm.url }}" alt="{{ post.sarlavha }}" class="post-detail-image">
        {% endif %}

        <div class="post-meta">
            <p>👤 <strong>Muallif:</strong> {{ post.muallif.username }}</p>
            <p>📅 <strong>Sana:</strong> {{ post.yaratilgan_sana|date:"d F Y, H:i" }}</p>
            <p>👁 <strong>Ko'rildi:</strong> {{ post.korildi }} marta</p>
        </div>

        <div class="post-content">
            {{ post.matn|linebreaks }}
        </div>

        <div class="post-actions">
            {% if user == post.muallif %}
                <a href="{% url 'post_tahrirlash' post.id %}" class="btn">✏️ Tahrirlash</a>
                <a href="{% url 'post_ochirish' post.id %}" class="btn btn-danger">🗑️ O'chirish</a>
            {% endif %}
            <a href="{% url 'bosh_sahifa' %}" class="btn btn-secondary">⬅ Orqaga</a>
        </div>
    </article>
{% endblock %}
```

---

### **CSS**

```css
.post-detail-image {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
    border-radius: 10px;
    margin: 20px 0;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
```

---

### **Sinab Ko'ring!**

## **6-Qism: Profil Modeli (35 daqiqa)**

### **Yangi Model Yaratamiz**

`blog/models.py`:

```python
class Profil(models.Model):
    foydalanuvchi = models.OneToOneField(User, on_delete=models.CASCADE)
    rasm = models.ImageField(upload_to='profillar/', default='profillar/default.jpg')
    bio = models.TextField(max_length=500, blank=True)
    tugilgan_sana = models.DateField(null=True, blank=True)
    manzil = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.foydalanuvchi.username} profili"
```

---

### **Tushuntirish:**

```python
foydalanuvchi = models.OneToOneField(User, on_delete=models.CASCADE)
```

**OneToOneField:**

- Har bir User ga BITTA Profil
- Bir-biriga bog'langan

---

```python
rasm = models.ImageField(upload_to='profillar/', default='profillar/default.jpg')
```

**default:**
Agar foydalanuvchi rasm yuklamasa, default rasm ko'rsatiladi.

---

### **Default Rasmni Qo'yamiz**

1. Internet dan oddiy avatar rasmi yuklab oling
2. Nomi: `default.jpg`
3. `media/profillar/` ga qo'ying

---

### **Migratsiya**

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## **7-Qism: Profil Avtomatik Yaratish (30 daqiqa)**

### **Signal - Nima Bu?**

User yaratilganda avtomatik Profil yaratish kerak!

**Signal** = "Biror narsa bo'lganda meni xabardor qil!"

---

### **Signals.py Fayli Yaratish**

`blog/signals.py` yarating:

```python
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profil

@receiver(post_save, sender=User)
def profil_yaratish(sender, instance, created, **kwargs):
    if created:
        Profil.objects.create(foydalanuvchi=instance)

@receiver(post_save, sender=User)
def profil_saqlash(sender, instance, **kwargs):
    instance.profil.save()
```

---

### **Tushuntirish:**

```python
@receiver(post_save, sender=User)
```

"User saqlanganda meni ishga tushir"

---

```python
def profil_yaratish(sender, instance, created, **kwargs):
    if created:
        Profil.objects.create(foydalanuvchi=instance)
```

- `created` = Yangi yaratilganmi?
- Agar ha bo'lsa → Profil yarat!

---

### **Signal ni Ulash**

`blog/apps.py`:

```python
from django.apps import AppConfig

class BlogConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blog'

    def ready(self):
        import blog.signals  # Signal ni import qilamiz
```

---

### **Sinab Ko'ring!**

1. Yangi foydalanuvchi yarating
2. Admin panelga kiring
3. Profil lar bo'limiga qarang
4. Avtomatik profil yaratilgan! 🎉

---

## **8-Qism: Profil Sahifasi (40 daqiqa)**

### **View**

`blog/views.py`:

```python
from django.contrib.auth.models import User
from .models import Post, Profil

def profil(request, username):
    foydalanuvchi = get_object_or_404(User, username=username)
    postlar = Post.objects.filter(muallif=foydalanuvchi, nashr_etilgan=True).order_by('-yaratilgan_sana')

    context = {
        'profil_egasi': foydalanuvchi,
        'postlar': postlar,
        'postlar_soni': postlar.count()
    }
    return render(request, 'blog/profil.html', context)
```

---

### **Shablon**

`blog/templates/blog/profil.html`:

```html
{% extends 'blog/asosiy.html' %}
{% load static %}

{% block sarlavha %}{{ profil_egasi.username }} - Profil{% endblock %}

{% block kontent %}
    <div class="profil-container">
        <div class="profil-header">
            {% if profil_egasi.profil.rasm %}
                <img src="{{ profil_egasi.profil.rasm.url }}"
                    alt="{{ profil_egasi.username }}"
                    class="profil-rasm">
            {% else %}
                <img src="/media/profillar/default.jpg"
                    alt="{{ profil_egasi.username }}"
                    class="profil-rasm">
            {% endif %}

            <div class="profil-info">
                <h1>{{ profil_egasi.username }}</h1>

                {% if profil_egasi.first_name or profil_egasi.last_name %}
                    <p class="profil-ism">
                        {{ profil_egasi.first_name }} {{ profil_egasi.last_name }}
                    </p>
                {% endif %}

                {% if profil_egasi.profil.bio %}
                    <p class="profil-bio">{{ profil_egasi.profil.bio }}</p>
                {% endif %}

                <div class="profil-stats">
                    <div class="stat">
                        <strong>{{ postlar_soni }}</strong>
                        <span>Postlar</span>
                    </div>
                    <div class="stat">
                        <strong>{{ profil_egasi.date_joined|date:"M Y" }}</strong>
                        <span>Qo'shilgan</span>
                    </div>
                </div>

                {% if user == profil_egasi %}
                    <a href="{% url 'profil_tahrirlash' %}" class="btn">
                        ✏️ Profilni Tahrirlash
                    </a>
                {% endif %}
            </div>
        </div>

        <hr>

        <h2>📝 Postlari</h2>

        {% if postlar %}
            {% for post in postlar %}
                <div class="post-card">
                    {% if post.rasm %}
                        <img src="{{ post.rasm.url }}" alt="{{ post.sarlavha }}" class="post-image">
                    {% endif %}

                    <div class="post-card-content">
                        <h3>{{ post.sarlavha }}</h3>
                        <p class="post-meta">
                            📅 {{ post.yaratilgan_sana|date:"d-M-Y" }} |
                            👁 {{ post.korildi }} ko'rilgan
                        </p>
                        <p>{{ post.matn|truncatewords:20 }}</p>
                        <a href="{% url 'post_batafsil' post.id %}" class="btn">
                            O'qish →
                        </a>
                    </div>
                </div>
            {% endfor %}
        {% else %}
            <p class="no-posts">Hali postlar yo'q.</p>
        {% endif %}
    </div>
{% endblock %}
```

---

### **CSS**

```css
.profil-container {
    max-width: 900px;
    margin: 0 auto;
}

.profil-header {
    display: flex;
    gap: 30px;
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    margin-bottom: 30px;
}

.profil-rasm {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid #667eea;
}

.profil-info {
    flex: 1;
}

.profil-info h1 {
    color: #667eea;
    margin: 0 0 10px 0;
}

.profil-ism {
    color: #666;
    font-size: 1.1em;
    margin: 5px 0;
}

.profil-bio {
    color: #444;
    margin: 15px 0;
    line-height: 1.6;
}

.profil-stats {
    display: flex;
    gap: 30px;
    margin: 20px 0;
}

.stat {
    text-align: center;
}

.stat strong {
    display: block;
    font-size: 1.5em;
    color: #667eea;
}

.stat span {
    color: #666;
    font-size: 0.9em;
}

.no-posts {
    text-align: center;
    color: #999;
    padding: 40px;
    font-size: 1.2em;
}
```

---

### **URL-ga qo’shing.**

```python
path('profil/<str:username>/', views.profil, name='profil'),
```

---

### **Menudan Profil ga Havola**

`asosiy.html`:

```html
{% if user.is_authenticated %}
    <a href="{% url 'post_yaratish' %}">✍️ Yangi Post</a>
    <a href="{% url 'profil' user.username %}">👤 {{ user.username }}</a>
    <a href="{% url 'chiqish' %}">🚪 Chiqish</a>
{% endif %}
```

---

## **9-Qism: Profilni Tahrirlash (35 daqiqa)**

### **Formalar**

`blog/forms.py`:

```python
from .models import Profil

class FoydalanuvchiYangilashForma(forms.ModelForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
        labels = {
            'username': 'Foydalanuvchi nomi',
            'email': 'Email',
            'first_name': 'Ism',
            'last_name': 'Familiya',
        }

class ProfilYangilashForma(forms.ModelForm):
    class Meta:
        model = Profil
        fields = ['rasm', 'bio', 'tugilgan_sana', 'manzil']
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 4}),
            'tugilgan_sana': forms.DateInput(attrs={'type': 'date'}),
        }
        labels = {
            'rasm': '📷 Profil Rasmi',
            'bio': '📝 Bio (o\'zingiz haqingizda)',
            'tugilgan_sana': '🎂 Tug\'ilgan Sana',
            'manzil': '📍 Manzil',
        }
```

---

### **View**

```python
from .forms import FoydalanuvchiYangilashForma, ProfilYangilashForma

@login_required
def profil_tahrirlash(request):
    if request.method == 'POST':
        f_forma = FoydalanuvchiYangilashForma(request.POST, instance=request.user)
        p_forma = ProfilYangilashForma(request.POST, request.FILES, instance=request.user.profil)

        if f_forma.is_valid() and p_forma.is_valid():
            f_forma.save()
            p_forma.save()
            messages.success(request, '✅ Profilingiz yangilandi!')
            return redirect('profil', username=request.user.username)
    else:
        f_forma = FoydalanuvchiYangilashForma(instance=request.user)
        p_forma = ProfilYangilashForma(instance=request.user.profil)

    context = {
        'f_forma': f_forma,
        'p_forma': p_forma
    }
    return render(request, 'blog/profil_tahrirlash.html', context)
```

---

### **Shablon**

`blog/templates/blog/profil_tahrirlash.html`:

```html
{% extends 'blog/asosiy.html' %}

{% block sarlavha %}Profilni Tahrirlash{% endblock %}

{% block kontent %}
    <div class="profil-edit-container">
        <h2>✏️ Profilni Tahrirlash</h2>

        <div class="current-profile-pic">
            <img src="{{ user.profil.rasm.url }}" alt="Hozirgi rasm">
            <p>Hozirgi profil rasmi</p>
        </div>

        <form method="POST" enctype="multipart/form-data" class="post-form">
            {% csrf_token %}

            <fieldset>
                <legend>Foydalanuvchi Ma'lumotlari</legend>
                {{ f_forma.as_p }}
            </fieldset>

            <fieldset>
                <legend>Profil Ma'lumotlari</legend>
                {{ p_forma.as_p }}
            </fieldset>

            <button type="submit" class="btn">💾 Saqlash</button>
            <a href="{% url 'profil' user.username %}" class="btn btn-secondary">
                ❌ Bekor Qilish
            </a>
        </form>
    </div>
{% endblock %}
```

---

### **CSS**

```css
.profil-edit-container {
    max-width: 600px;
    margin: 0 auto;
}

.current-profile-pic {
    text-align: center;
    margin: 20px 0;
}

.current-profile-pic img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #667eea;
}

fieldset {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

legend {
    color: #667eea;
    font-weight: bold;
    padding: 0 10px;
}
```

---

### **URL-ga qo’shing**

```python
path('profil/tahrirlash/', views.profil_tahrirlash, name='profil_tahrirlash'),
```

---

### **Admin panelga hozircha oddiy holda ro’yxatdan o’tqazing**

`blog/templates/blog/admin.py`

```sql
from django.contrib import admin
from .models import Post, Izoh, Profil

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('sarlavha', 'muallif', 'yaratilgan_sana', 'nashr_etilgan')
    list_filter = ('nashr_etilgan', 'yaratilgan_sana')
    search_fields = ('sarlavha', 'matn')
    date_hierarchy = 'yaratilgan_sana'

@admin.register(Izoh)
class IzohAdmin(admin.ModelAdmin):
    list_display = ('post', 'muallif', 'yaratilgan')
    list_filter = ('yaratilgan',)
    search_fields = ('matn',)

@admin.register(Profil)
class ProfilAdmin(admin.ModelAdmin):
    list_display = ('foydalanuvchi', 'tugilgan_sana')
    search_fields = ('foydalanuvchi__username',)
```

### **Sinab Ko'ring!**

## **10-Qism: Rasm O'lchamini Kamaytirish (25 daqiqa)**

### **Muammo:**

Foydalanuvchi 10MB rasm yuklasa, sahifa sekin yuklanadi! 😟

---

### **Yechim: Avtomatik Kichraytirish**

`blog/models.py`:

```python
from PIL import Image

class Profil(models.Model):
    foydalanuvchi = models.OneToOneField(User, on_delete=models.CASCADE)
    rasm = models.ImageField(upload_to='profillar/', default='profillar/default.jpg')
    bio = models.TextField(max_length=500, blank=True)
    tugilgan_sana = models.DateField(null=True, blank=True)
    manzil = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.foydalanuvchi.username} profili"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Rasmni kichraytirish
        img = Image.open(self.rasm.path)

        if img.height > 300 or img.width > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(self.rasm.path)
```

---

### **Tushuntirish:**

```python
def save(self, *args, **kwargs):
    super().save(*args, **kwargs)
```

Avval oddiy saqlaymiz.

---

```python
img = Image.open(self.rasm.path)
```

Rasmni ochamiz.

---

```python
if img.height > 300 or img.width > 300:
    output_size = (300, 300)
    img.thumbnail(output_size)
    img.save(self.rasm.path)
```

Agar 300px dan katta bo'lsa → 300x300 ga kichraytir!

---

### **Post Rasmlari Uchun Ham**

```python
class Post(models.Model):
    # ... barcha maydonlar

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.rasm:
            img = Image.open(self.rasm.path)

            if img.height > 800 or img.width > 800:
                output_size = (800, 800)
                img.thumbnail(output_size)
                img.save(self.rasm.path)
```

---

## **9-10 Kun Xulosasi**

### **Nima O'rgandik:**

✅ Static vs Media fayllar

✅ Media sozlamalari

✅ Pillow kutubxonasi

✅ ImageField va FileField

✅ Rasm yuklash formalar

✅ `enctype="multipart/form-data"`

✅ Rasmlarni ko'rsatish

✅ Profil modeli

✅ OneToOneField

✅ Signals (avtomatik profil yaratish)

✅ Rasmni kichraytirish (PIL)

✅ Default rasmlar

---

## **Amaliy Mashqlar**

### **1. Ko'p Rasmli Post**

Post ga bir nechta rasm qo'shish:

```python
class PostRasm(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    rasm = models.ImageField(upload_to='post_rasmlari/')
```

---

### **2. Cover Rasm**

Profil ga cover (orqa fon) rasm:

```python
cover_rasm = models.ImageField(upload_to='cover/', blank=True, null=True)
```

---

### **3. Rasm Galereya**

Alohida galereya sahifa - barcha rasmlar.

[Secret](https://app.notion.com/p/Secret-45c6021d9a128324becd8105ddfe08eb?pvs=21)

---

## **Uy Vazifasi**

### **1. Rasm Formatlari Cheklash**

Faqat JPG va PNG qabul qilish:

```python
from django.core.validators import FileExtensionValidator

rasm = models.ImageField(
    upload_to='postlar/',
    validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])]
)
```

---

### **2. Rasm Hajmini Cheklash**

Max 5MB:

```python
def validate_file_size(value):
    limit = 5 * 1024 * 1024  # 5MB
    if value.size > limit:
        raise ValidationError('Rasm 5MB dan kichik bo\'lishi kerak!')

rasm = models.ImageField(
    upload_to='postlar/',
    validators=[validate_file_size]
)
```

---

### **3. Rasm Yuklash Progress Bar**

JavaScript bilan yuklash jarayonini ko'rsatish.

---

## **Keyingi Darsda:**

**11-12 Kun: PostgreSQL va Production**

- SQLite dan PostgreSQL ga o'tish
- PostgreSQL o'rnatish va sozlash
- Environment variables
- Production uchun tayyorlanish
- Debug=False sozlamalari

**Nihoyat haqiqiy ma'lumotlar bazasi!** 🗄️

---

**Jami vaqt:** 6-7 soat tanaffuslar bilan

**Esda tuting:** Rasmlar saytni jonlantiradi, lekin optimizatsiya qilish kerak! 📸💪