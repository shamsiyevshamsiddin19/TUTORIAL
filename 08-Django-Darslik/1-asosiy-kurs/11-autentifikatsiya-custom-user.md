# Autentifikatsiya, ruxsatlar va Custom User model

## Bu darsda nimalarni o'rganasiz

- Django'ning tayyor login/logout tizimidan foydalana olasiz
- `@login_required` va `LoginRequiredMixin` orqali sahifalarni himoyalay olasiz
- `permission_required` orqali ruxsatlarni tekshira olasiz
- Loyiha boshida **Custom User model** yaratish nima uchun muhimligini tushuntira va amalga oshira olasiz

## Nazariy qism

### Tayyor autentifikatsiya tizimi

Django `django.contrib.auth` orqali login, logout, parolni tiklash kabi funksiyalarni tayyor holda beradi — buni noldan yozish shart emas:

```python
# config/urls.py
from django.contrib.auth import views as auth_views

urlpatterns += [
    path("login/", auth_views.LoginView.as_view(template_name="registration/login.html"), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
]
```

`LoginView` — shablonni siz taqdim etasiz (`registration/login.html`), qolgan mantiq (forma tekshirish, sessiya yaratish) Django'ning o'zida.

**Ro'yxatdan o'tish** uchun tayyor `UserCreationForm`dan foydalanish mumkin:

```python
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views.generic import CreateView

class SignUpView(CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"
```

### Sahifalarni himoyalash — faqat tizimga kirganlar uchun

FBV uchun dekorator, CBV uchun mixin ishlatiladi:

```python
from django.contrib.auth.decorators import login_required, permission_required

@login_required                                   # faqat tizimga kirganlar uchun
def dashboard(request):
    ...

@permission_required("blog.add_post", raise_exception=True)  # muayyan ruxsatga ega bo'lganlar
def post_create(request):
    ...
```

```python
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

class PostCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    permission_required = "blog.add_post"
    login_url = "login"        # login qilmagan foydalanuvchi qayerga yo'naltirilishi
```

`login_required` — foydalanuvchi tizimga kirmagan bo'lsa, uni avtomatik `settings.LOGIN_URL` (odatda `/accounts/login/`) manziliga, keyin qaytib kelish uchun `?next=` parametri bilan yo'naltiradi. `permission_required` — Django'ning o'rnatilgan ruxsat tizimidan (`<app>.<action>_<model>` formatida, masalan `blog.add_post`) foydalanadi.

Shablonda muallifni tekshirish (masalan, faqat o'z postini tahrirlash huquqi):

```html
{% if post.author == user %}
    <a href="{% url 'blog:post_update' post.slug %}">Tahrirlash</a>
{% endif %}
```

### Custom User model — nega loyiha boshidanoq kerak

Django'ning standart `User` modeli faqat `username`, `email`, `first_name`, `last_name`, `password` kabi asosiy maydonlarga ega — telefon raqami, avatar, tug'ilgan sana kabi qo'shimcha ma'lumot yo'q. Muammo shundaki, **Django standart `User` modelini loyiha o'rtasida almashtirishni qo'llab-quvvatlamaydi** — chunki ko'plab ichki jadval (ruxsatlar, sessiyalar) allaqachon standart `User`ga bog'langan bo'ladi, va uni keyinroq almashtirish amalda **butun ma'lumotlar bazasini qayta qurish** kabi og'ir jarayon talab qiladi.

Shu sababli, qat'iy qoida: **har qanday yangi Django loyihasida, birinchi migratsiyadan OLDIN**, hatto qo'shimcha maydon hozircha kerak bo'lmasa ham, Custom User model yaratib qo'yish tavsiya etiladi — bu "ehtiyot chorasi", kelajakda erkinlik beradi.

```python
# apps/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)

    def __str__(self):
        return self.username
```

`AbstractUser`dan meros olish — barcha standart maydonlar (`username`, `password`, `is_staff` va h.k.) va login/permission mantig'i saqlanib qoladi, siz faqat **qo'shimcha** maydon qo'shasiz.

`settings.py`da:

```python
AUTH_USER_MODEL = "users.User"
```

```python
# apps/users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

admin.site.register(User, UserAdmin)
```

> ⚠️ `AUTH_USER_MODEL` sozlamasi **faqat birinchi `migrate` chaqirishdan oldin** o'zgartirilishi mumkin. Agar loyiha allaqachon standart `User` bilan migratsiyalarni qo'llagan bo'lsa, buni keyin o'zgartirish amalda mumkin emas (yoki juda murakkab qo'lda ish talab qiladi) — shuning uchun bu qaror **eng birinchi kunda** qabul qilinishi shart.

## Amaliy misol

Loyihani noldan Custom User bilan boshlash, to'liq ketma-ketlik:

```bash
python manage.py startapp users apps/users
```

```python
# apps/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self):
        return self.username
```

```python
# config/settings.py
INSTALLED_APPS = [
    ...
    "apps.users",
]
AUTH_USER_MODEL = "users.User"
```

```bash
python manage.py makemigrations users
python manage.py migrate           # bu — LOYIHADAGI BIRINCHI migrate chaqiruvi bo'lishi kerak
python manage.py createsuperuser
```

Boshqa app'larda `User`ga murojaat qilishning **to'g'ri** usuli — hech qachon to'g'ridan-to'g'ri `from apps.users.models import User` deb import qilmang, o'rniga:

```python
# apps/blog/models.py
from django.conf import settings
from django.db import models

class Post(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,   # to'g'ridan-to'g'ri import emas — sozlama orqali
        on_delete=models.CASCADE,
        related_name="posts"
    )
```

```python
# views.py ichida joriy foydalanuvchiga murojaat qilish uchun esa
from django.contrib.auth import get_user_model
User = get_user_model()
```

Bu ikki usul (`settings.AUTH_USER_MODEL` modelda, `get_user_model()` kodda) — loyihangiz qaysi Custom User model ishlatayotganidan qat'i nazar, kod har doim to'g'ri ishlashini ta'minlaydi.

## Keng tarqalgan xatolar

**Xato 1:** loyihani standart `User` bilan boshlab, keyinroq Custom User'ga o'tishga urinish.
❌ Birinchi `migrate` allaqachon bajarilgan, DB'da ma'lumot bor — endi `AUTH_USER_MODEL`ni o'zgartirsangiz, Django ko'plab `ForeignKey` bog'lanishlarida ziddiyat va xatolik chiqaradi.
✅ To'g'ri: Custom User modelni **har doim** loyihaning eng boshida, birinchi `migrate`dan oldin yarating — hatto qo'shimcha maydon hozircha shart bo'lmasa ham.

**Xato 2:** boshqa app'da `User`ni to'g'ridan-to'g'ri import qilish.
❌ `from apps.users.models import User` — bu loyihani boshqa (masalan, standart `User` ishlatuvchi) loyihaga ko'chirishda yoki `AUTH_USER_MODEL`ni almashtirishda muammo tug'diradi, chunki kod qattiq bog'langan.
✅ To'g'ri: modellarda `settings.AUTH_USER_MODEL`, kodda (view, funksiya) esa `django.contrib.auth.get_user_model()` ishlatilsin — bu ikkalasi Django'ning tavsiya etadigan, "moslashuvchan" usuli.

**Xato 3:** `LoginRequiredMixin` bilan `PermissionRequiredMixin`ni noto'g'ri tartibda yozish yoki `login_url`ni sozlamaslik.
❌ `login_url` ko'rsatilmasa, Django standart `/accounts/login/` manziliga yo'naltiradi — agar sizning login sahifangiz boshqa manzilda bo'lsa, foydalanuvchi 404 xatosiga uchraydi.
✅ To'g'ri: agar login sahifangiz standart manzildan farqli bo'lsa, `settings.py`da `LOGIN_URL = "login"` deb global sozlang, yoki har bir CBV'da alohida `login_url` ko'rsating.

## Mashq/topshiriq

**(Oson)** Yangi loyihada `apps/users` app'ini yarating, `AbstractUser`dan meros olgan `User` modelini `phone_number` maydoni bilan yozing, `AUTH_USER_MODEL`ni sozlang va birinchi migratsiyani bajaring.

**(O'rtacha)** `book_create` view'ini `@login_required` bilan himoyalang. So'ng uni `LoginRequiredMixin` bilan CBV (`BookCreateView`) ko'rinishiga o'tkazing va ikkalasining natijasi bir xil ekanini tekshiring (login qilmagan foydalanuvchi login sahifasiga yo'naltirilishi kerak).

**(Qiyin)** `Book` modeliga `can_publish` degan maxsus ruxsat (`Meta.permissions`) qo'shing va faqat shu ruxsatga ega foydalanuvchilar kitobni "chop etilgan" holatga o'tkaza olishini `permission_required` orqali cheklang. Admin panelda ushbu ruxsatni bitta foydalanuvchiga qo'lda berib, sinab ko'ring.

<details>
<summary>Javoblarni ko'rish</summary>

1. `class User(AbstractUser): phone_number = models.CharField(max_length=20, blank=True)`; `AUTH_USER_MODEL = "users.User"`; `makemigrations users && migrate` — bu birinchi migratsiya bo'lishi kerak, boshqa app migratsiyalaridan oldin yoki ular bilan birga.
2. FBV: `@login_required\ndef book_create(request): ...`; CBV: `class BookCreateView(LoginRequiredMixin, CreateView): ...` — ikkalasida ham login qilmagan foydalanuvchi `/accounts/login/?next=/book/create/` ga yo'naltiriladi.
3. `class Book(models.Model): ... class Meta: permissions = [("can_publish", "Kitobni chop etish huquqi")]`; view'da `@permission_required("app_nomi.can_publish", raise_exception=True)`; admin panelda foydalanuvchi tahrirlash sahifasida "User permissions" bo'limidan shu ruxsatni qo'lda tanlab berish mumkin.

</details>

## Qisqacha xulosa

Django `django.contrib.auth` orqali login, logout va ro'yxatdan o'tish uchun tayyor vositalar beradi, `@login_required`/`LoginRequiredMixin` va `permission_required`/`PermissionRequiredMixin` esa sahifalarni tizimga kirish yoki maxsus ruxsat talab qilib himoyalaydi; eng muhimi — Django'ning standart `User` modelini loyiha o'rtasida almashtirib bo'lmasligi sababli, **har qanday yangi loyihada birinchi `migrate`dan oldin** `AbstractUser`dan meros olgan Custom User model yaratish qat'iy tavsiya etiladi, va uni har doim `settings.AUTH_USER_MODEL` (modellarda) va `get_user_model()` (kodda) orqali, hech qachon to'g'ridan-to'g'ri import qilmasdan ishlatish kerak.
