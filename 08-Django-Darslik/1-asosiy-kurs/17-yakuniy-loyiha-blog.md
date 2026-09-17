# Yakuniy loyiha — to'liq Blog ilovasi

## Bu darsda nimalarni o'rganasiz

- 1-16-darslarda o'rgangan barcha bilimlarni **bitta ishlaydigan loyihada** birlashtira olasiz
- Model → Admin → View → URL → Template zanjirini noldan, mustaqil qura olasiz
- Loyihani boshidan oxirigacha ishga tushirib, brauzerda sinab ko'ra olasiz
- Keyingi qadam sifatida qo'shimcha funksiyalarni (izohlar, qidiruv, API) mustaqil qo'sha olasiz

## Nazariy qism

Bu — 1-bo'limning yakuniy darsi, va bu yerda yangi nazariya yo'q — bu yerda **hammasi birlashadi**. Quyidagi fayllar to'plami to'liq ishlaydigan "Blog" ilovasini tashkil qiladi: model (4-dars), admin (6-dars), CBV asosidagi CRUD (7-dars), URL (8-dars), shablon (9-dars) va autentifikatsiya (11-dars) — barchasi bitta real loyihada.

Yakuniy loyihani qurishdan oldin, quyidagi ketma-ketlikni yodda tuting — bu Django'da har qanday yangi funksiya qo'shishning **umumiy algoritmi**:

```
1. Model yozish (models.py)         → makemigrations, migrate
2. Admin ro'yxatdan o'tkazish (admin.py)  → sinov uchun ma'lumot kiritish
3. View yozish (views.py)            → mantiq
4. URL bog'lash (urls.py)             → manzil
5. Shablon yozish (templates/)         → ko'rinish
```

Bu besh qadam — Django'da deyarli har qanday yangi feature (blog, do'kon, forum, izoh tizimi) qo'shishning universal tartibi.

## Amaliy misol

**`apps/blog/models.py`:**
```python
from django.conf import settings
from django.db import models
from django.urls import reverse


class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Qoralama"
        PUBLISHED = "published", "Chop etilgan"

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    body = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PUBLISHED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("blog:post_detail", kwargs={"slug": self.slug})
```

**`apps/blog/admin.py`:**
```python
from django.contrib import admin
from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("title", "body")
    prepopulated_fields = {"slug": ("title",)}
```

**`apps/blog/views.py`:**
```python
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Post


class PostListView(ListView):
    model = Post
    template_name = "blog/post_list.html"
    context_object_name = "posts"
    paginate_by = 10

    def get_queryset(self):
        return Post.objects.filter(status=Post.Status.PUBLISHED).select_related("author")


class PostDetailView(DetailView):
    model = Post
    template_name = "blog/post_detail.html"
    context_object_name = "post"


class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ["title", "slug", "body", "status"]
    template_name = "blog/post_form.html"

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)


class PostUpdateView(LoginRequiredMixin, UpdateView):
    model = Post
    fields = ["title", "body", "status"]
    template_name = "blog/post_form.html"


class PostDeleteView(LoginRequiredMixin, DeleteView):
    model = Post
    template_name = "blog/post_confirm_delete.html"
    success_url = reverse_lazy("blog:post_list")
```

**`apps/blog/urls.py`:**
```python
from django.urls import path
from . import views

app_name = "blog"

urlpatterns = [
    path("", views.PostListView.as_view(), name="post_list"),
    path("post/create/", views.PostCreateView.as_view(), name="post_create"),
    path("post/<slug:slug>/", views.PostDetailView.as_view(), name="post_detail"),
    path("post/<slug:slug>/edit/", views.PostUpdateView.as_view(), name="post_update"),
    path("post/<slug:slug>/delete/", views.PostDeleteView.as_view(), name="post_delete"),
]
```

**`templates/base.html`:**
```html
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <title>{% block title %}Blog{% endblock %}</title>
</head>
<body>
    <nav>
        {% if user.is_authenticated %}
            Salom, {{ user.username }}! <a href="{% url 'logout' %}">Chiqish</a> |
            <a href="{% url 'blog:post_create' %}">➕ Yangi post</a>
        {% else %}
            <a href="{% url 'login' %}">Kirish</a>
        {% endif %}
    </nav>
    {% block content %}{% endblock %}
</body>
</html>
```

**`apps/blog/templates/blog/post_list.html`:**
```html
{% extends "base.html" %}
{% block content %}
    <h1>Maqolalar</h1>
    {% for post in posts %}
        <article>
            <h2><a href="{{ post.get_absolute_url }}">{{ post.title }}</a></h2>
            <small>{{ post.author.username }} — {{ post.created_at|date:"d.m.Y" }}</small>
        </article>
    {% empty %}
        <p>Maqolalar yo'q.</p>
    {% endfor %}
{% endblock %}
```

**`apps/blog/templates/blog/post_detail.html`:**
```html
{% extends "base.html" %}
{% block content %}
    <h1>{{ post.title }}</h1>
    <p>{{ post.body|linebreaks }}</p>
    {% if post.author == user %}
        <a href="{% url 'blog:post_update' post.slug %}">Tahrirlash</a>
        <a href="{% url 'blog:post_delete' post.slug %}">O'chirish</a>
    {% endif %}
{% endblock %}
```

**`apps/blog/templates/blog/post_form.html`:**
```html
{% extends "base.html" %}
{% block content %}
    <h1>Maqola</h1>
    <form method="post">
        {% csrf_token %}
        {{ form.as_p }}
        <button type="submit">Saqlash</button>
    </form>
{% endblock %}
```

**`apps/blog/templates/blog/post_confirm_delete.html`:**
```html
{% extends "base.html" %}
{% block content %}
    <h1>"{{ post.title }}" haqiqatan o'chirilsinmi?</h1>
    <form method="post">
        {% csrf_token %}
        <button type="submit">Ha, o'chirish</button>
    </form>
{% endblock %}
```

**Ishga tushirish:**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

`http://127.0.0.1:8000/` — maqolalar ro'yxati, `/admin/` — boshqaruv paneli, tizimga kirgan holda `➕ Yangi post` orqali maqola qo'shish, o'z maqolangizni tahrirlash/o'chirish — barchasi ishlaydi.

## Keng tarqalgan xatolar

**Xato 1:** yakuniy loyihani yig'ishda, darslar orasidagi kichik farqlarni (masalan, `related_name`, `app_name`) e'tiborsiz qoldirish.
❌ Turli darslardagi kod parchalarini ko'chirib, ularni bir-biriga moslashtirmasdan qo'shib qo'yish — `NoReverseMatch` yoki `FieldError` kabi xatolarga olib keladi.
✅ To'g'ri: har bir faylni yozgach, darhol `python manage.py runserver` bilan tekshiring — xatoni katta loyihaning oxirida emas, har bir qadamda aniqlang.

**Xato 2:** `LOGIN_URL` sozlanmagan holda, `LoginRequiredMixin` ishlashini kutish.
❌ `PostCreateView`ga kirilganda `django.contrib.auth.views` standart bo'yicha sozlanmagan bo'lsa, `/accounts/login/` manzili 404 xatosi beradi.
✅ To'g'ri: `config/urls.py`ga `django.contrib.auth.urls`ni yoki alohida `login`/`logout` view'larini (11-darsdagi kabi) qo'shishni unutmang, va `settings.py`da `LOGIN_URL = "login"` sozlang.

**Xato 3:** loyihani "tugadi" deb hisoblab, testlarsiz qoldirish.
❌ Loyiha ishlayotgandek ko'rinadi, lekin keyinchalik kichik o'zgarish (masalan, `urls.py`da nom o'zgartirish) boshqa joyni sindirib qo'yishi mumkin, buni darhol sezmaysiz.
✅ To'g'ri: 15-darsda o'rgangan `TestCase`ni shu yakuniy loyihaga ham qo'llang — hech bo'lmaganda `post_list` va `post_detail` sahifalari uchun asosiy testlar yozing.

## Mashq/topshiriq

**(Oson)** Yuqoridagi loyihani xuddi shu ko'rinishda, o'zingizning kompyuteringizda noldan yarating va ishga tushiring — barcha bosqichlarni (model → admin → view → url → template) o'zingiz qo'lda bajaring, ko'chirib-joylashtirmang.

**(O'rtacha)** Loyihaga `Comment` modelini qo'shing (`Post`ga `ForeignKey`, `author_name`, `body`, `created_at` maydonlari bilan). Uni admin panelda `TabularInline` sifatida `PostAdmin`ga qo'shing (6-dars), va `post_detail.html`da izohlar ro'yxatini ko'rsating.

**(Qiyin)** Loyihaga qidiruv funksiyasini qo'shing: `post_list` sahifasiga qidiruv formasi (`GET` parametri `?q=...`) qo'shib, `Q(title__icontains=q) | Q(body__icontains=q)` orqali filtrlang (13-dars). Bundan tashqari, 14-darsdagi bilim asosida, `Post` uchun oddiy `/api/posts/` API endpoint ham qo'shing — shu bitta loyihada web interfeys va API ikkalasi birga ishlasin.

<details>
<summary>Javoblarni ko'rish</summary>

1. Loyiha `http://127.0.0.1:8000/` va `/admin/` manzillarida xatosiz ishlashi, maqola yaratish/tahrirlash/o'chirish to'liq funksional bo'lishi kerak.
2. `Comment` modeli yaratilib, migratsiya qilingach, `PostAdmin.inlines = [CommentInline]` qo'shiladi; `post_detail.html`da `{% for comment in post.comment_set.all %}` (yoki `related_name` belgilangan bo'lsa, shu nom) orqali izohlar chiqariladi.
3. `PostListView.get_queryset()`da `q = self.request.GET.get("q"); if q: queryset = queryset.filter(Q(title__icontains=q) | Q(body__icontains=q))`; API uchun `PostSerializer`, `PostViewSet` va `router.register("posts", PostViewSet)` — 14-darsdagi namunaning aynan o'zi, shu loyihaga ulangan holda.

</details>

## Qisqacha xulosa

Ushbu yakuniy loyiha 1-bo'limda o'rgangan barcha bilimni — model, migratsiya, admin, view (FBV va CBV), URL marshrutlash, shablon merosxo'rligi, forma va autentifikatsiya — bitta, boshidan oxirigacha ishlaydigan Blog ilovasida birlashtiradi; Model → Admin → View → URL → Template ketma-ketligi Django'da yangi funksiya qo'shishning universal algoritmi bo'lib, bu ketma-ketlikni chuqur o'zlashtirgan har qanday dasturchi endi istalgan murakkablikdagi Django loyihasini mustaqil qura oladi. Keyingi bo'limda esa aynan shu bilim asosida, Django'ni Aiogram va PostgreSQL bilan birlashtirib, Telegram bot yaratishni o'rganasiz.
