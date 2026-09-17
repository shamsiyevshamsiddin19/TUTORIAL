# Testlash, Static/Media fayllar va Xavfsizlik cheklisti

## Bu darsda nimalarni o'rganasiz

- `TestCase` va `Client` orqali model va view'larni sinay olasiz
- STATIC va MEDIA fayllar orasidagi farqni tushuntira olasiz
- `collectstatic` buyrug'ining vazifasini tushuntira olasiz
- Production'ga chiqarishdan oldin xavfsizlik cheklistini qo'llay olasiz

## Nazariy qism

### Nega test yozish kerak

Loyiha kattalashgani sari, bitta joydagi o'zgarish boshqa joyni "sindirib qo'yishi" ehtimoli oshadi. Test — kodning kutilganidek ishlashini **avtomatik** tekshiradigan, siz har safar qo'lda brauzerda sinab ko'rish o'rniga bitta buyruq bilan ishga tushiradigan tekshiruv.

```python
# apps/blog/tests.py
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Post

User = get_user_model()

class PostModelTest(TestCase):
    def setUp(self):   # har bir test metodidan OLDIN ishga tushadi — toza boshlang'ich holat
        self.user = User.objects.create_user(username="test", password="pass12345")
        self.post = Post.objects.create(
            title="Test post", slug="test-post", body="Matn",
            author=self.user, status=Post.Status.PUBLISHED
        )

    def test_post_str(self):
        self.assertEqual(str(self.post), "Test post")

    def test_post_absolute_url(self):
        self.assertEqual(self.post.get_absolute_url(), f"/post/{self.post.slug}/")


class PostViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username="test", password="pass12345")
        self.post = Post.objects.create(
            title="Test", slug="test", body="Matn", author=self.user,
            status=Post.Status.PUBLISHED
        )

    def test_post_list_status_code(self):
        response = self.client.get(reverse("blog:post_list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test")

    def test_post_create_requires_login(self):
        response = self.client.get(reverse("blog:post_create"))
        self.assertEqual(response.status_code, 302)   # login sahifasiga redirect
```

`setUp()` — har bir test metodidan **oldin** avtomatik ishga tushadi, va har bir test o'zining **alohida**, boshqa testlardan mustaqil ma'lumotlar bazasida ishlaydi (Django har test uchun DB'ni tozalab, qayta tuzadi). `Client` — haqiqiy brauzerni simulyatsiya qiladi: sahifaga so'rov yuboradi, javobni (status kod, HTML mazmuni) tekshirish imkonini beradi.

```bash
python manage.py test
```

Katta loyihalarda `pytest-django` (qulayroq fixture, parallel test ishga tushirish) ko'proq tavsiya etiladi, lekin standart `TestCase` har qanday loyiha uchun yetarli boshlang'ich nuqta.

### STATIC va MEDIA — ikki xil fayl turi

| | STATIC | MEDIA |
|---|---|---|
| Nima uchun | CSS, JS, loyihaning o'z rasmlari (dizayner qo'ygan) | Foydalanuvchi yuklagan fayllar (avatar, post rasmi) |
| Sozlama | `STATIC_URL`, `STATICFILES_DIRS`, `STATIC_ROOT` | `MEDIA_URL`, `MEDIA_ROOT` |
| Production'da kim xizmat qiladi | Nginx yoki WhiteNoise | Nginx yoki bulutli saqlash (S3) |

Bu farqni tushunish muhim: STATIC fayllar — dasturchi tomonidan yaratilib, Git orqali deploy qilinadi; MEDIA fayllar — foydalanuvchilar tomonidan, ilova ishlab turgan paytda yuklanadi, shuning uchun ular server qayta deploy qilinganda **yo'qolib ketmasligi** kerak (odatda alohida, doimiy saqlash joyida turadi).

```bash
python manage.py collectstatic   # barcha static fayllarni STATIC_ROOT'ga yig'adi (production deploy oldidan)
```

Bu buyruq har bir app'ning ichidagi `static/` papkalarini, shuningdek loyiha darajasidagi `STATICFILES_DIRS`ni **bitta** joyga (`STATIC_ROOT`) yig'adi — production'da veb-server (Nginx) aynan shu yig'ilgan papkadan xizmat ko'rsatadi, Django'ning o'zi emas (Django development serveri sekin, production uchun mos emas).

Agar Nginx sozlashning iloji bo'lmasa (masalan, oddiy PaaS xizmatida), **WhiteNoise** eng oson yechim:

```bash
pip install whitenoise
```
```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",   # SecurityMiddleware'dan keyin, eng yuqorida
    ...
]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
```

### Xavfsizlik cheklisti — production'ga chiqarishdan oldin

- [ ] `SECRET_KEY` `.env`da, hech qachon Git'ga tushmagan
- [ ] Production'da `DEBUG = False` (aks holda xato sahifalarda butun kod va sozlamalar ko'rinib qoladi)
- [ ] `ALLOWED_HOSTS` aniq domenlar bilan to'ldirilgan (`["*"]` emas)
- [ ] `python manage.py check --deploy` production'ga chiqarishdan oldin ishga tushirilgan
- [ ] Barcha `POST` formalarda `{% csrf_token %}` bor
- [ ] SQL so'rovlar faqat ORM orqali (xom SQL kerak bo'lsa, `%s` parametrlash orqali — hech qachon f-string bilan birlashtirish emas)
- [ ] Fayl yuklashda hajm va turi tekshiriladi
- [ ] `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_SSL_REDIRECT` production'da yoqilgan (HTTPS orqali)
- [ ] Parollar `AbstractUser`ning o'zi hash qiladi — hech qachon parolni oddiy matnda saqlamang yoki loglamang
- [ ] Kutubxonalar muntazam yangilanadi (xavfsizlik yamoqlari uchun)

`python manage.py check --deploy` — Django'ning o'zi sozlamalaringizni tekshirib, xavfsizlik bo'yicha ogohlantirish beradigan tayyor buyruq — buni har bir production deploy'dan oldin ishga tushirish odat qilinishi kerak.

## Amaliy misol

To'liq test to'plami — model, view va forma validatsiyasini birga qamrab oluvchi:

```python
# apps/blog/tests.py
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Post, Category
from .forms import PostForm

User = get_user_model()


class PostFormTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Tech", slug="tech")

    def test_short_title_invalid(self):
        form = PostForm(data={
            "title": "Ab", "slug": "ab", "body": "Matn",
            "category": self.category.id, "status": "draft",
        })
        self.assertFalse(form.is_valid())
        self.assertIn("title", form.errors)

    def test_valid_data_creates_post(self):
        form = PostForm(data={
            "title": "To'liq sarlavha", "slug": "toliq-sarlavha", "body": "Matn",
            "category": self.category.id, "status": "draft",
        })
        self.assertTrue(form.is_valid())


class PostPermissionTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.author = User.objects.create_user(username="author", password="pass12345")
        self.other = User.objects.create_user(username="other", password="pass12345")
        self.post = Post.objects.create(
            title="Test", slug="test", body="Matn", author=self.author,
            status=Post.Status.PUBLISHED
        )

    def test_non_author_cannot_edit(self):
        self.client.login(username="other", password="pass12345")
        response = self.client.get(reverse("blog:post_update", kwargs={"slug": self.post.slug}))
        self.assertEqual(response.status_code, 404)   # get_object_or_404 filter'da author=request.user bo'lsa
```

Ishga tushirish va natijani ko'rish:

```bash
python manage.py test apps.blog
# Ran 4 tests in 0.045s
# OK
```

## Keng tarqalgan xatolar

**Xato 1:** testlarni faqat "baxtli yo'l" (happy path) uchun yozib, xato holatlarni tekshirmaslik.
❌ Faqat `test_valid_data_creates_post` bor, lekin noto'g'ri ma'lumot kiritilganda forma haqiqatan rad etishini hech kim tekshirmagan — kod noto'g'ri validatsiya bilan ham "test o'tdi" deb ko'rinishi mumkin.
✅ To'g'ri: har bir muhim funksiya uchun kamida bitta "to'g'ri holat" va bitta "noto'g'ri holat" testini yozing — ikkalasi ham muhim.

**Xato 2:** STATIC va MEDIA sozlamalarini production'da aralashtirib yuborish yoki `collectstatic`ni unutish.
❌ Production serverga deploy qilingan, lekin `collectstatic` ishga tushirilmagan — CSS/JS fayllar yuklanmaydi, sayt "chiroyi ketgan" holda ko'rinadi.
✅ To'g'ri: deploy jarayoniga (masalan, `Dockerfile`ga yoki CI/CD skriptiga) `python manage.py collectstatic --noinput` buyrug'ini doimiy qadam sifatida qo'shib qo'ying.

**Xato 3:** `DEBUG = True` bilan production serverga chiqib ketish.
❌ Xatolik yuz berganda, foydalanuvchi butun stack trace, sozlamalar va hatto DB parolini (agar xato xabarida chiqib qolsa) ko'rishi mumkin — bu jiddiy xavfsizlik teshigi.
✅ To'g'ri: `.env`da production uchun **doim** `DEBUG=False` bo'lishini tasdiqlang, va bu holatni `python manage.py check --deploy` orqali avtomatik tekshiring.

## Mashq/topshiriq

**(Oson)** `Book` modeli uchun `BookModelTest(TestCase)` yozing — `setUp()`da bitta kitob yarating, `test_book_str`da uning `__str__()` natijasini tekshiring.

**(O'rtacha)** `BookViewTest`da, tizimga kirmagan foydalanuvchi `book_create` sahifasiga kirishga uringanda `302` (redirect) status kod qaytishini tasdiqlovchi test yozing.

**(Qiyin)** `python manage.py check --deploy` buyrug'ini `DEBUG=True` va `DEBUG=False` holatlarida ishga tushirib, natijalar farqini tavsiflab bering. So'ng loyihangizga `collectstatic` va WhiteNoise'ni sozlab, `python manage.py collectstatic` orqali qancha fayl yig'ilganini ko'ring.

<details>
<summary>Javoblarni ko'rish</summary>

1. `class BookModelTest(TestCase): def setUp(self): self.book = Book.objects.create(title="Test", price=10); def test_book_str(self): self.assertEqual(str(self.book), "Test")`.
2. `def test_create_requires_login(self): response = self.client.get(reverse("book_create")); self.assertEqual(response.status_code, 302)`.
3. `DEBUG=True` bilan `check --deploy` ko'plab ogohlantirish beradi (masalan, `SECURE_SSL_REDIRECT` yo'q, `DEBUG` yoqilgan); `DEBUG=False` va boshqa xavfsizlik sozlamalari to'g'ri qo'yilgach, ogohlantirishlar soni kamayadi yoki "System check identified no issues" deb chiqadi; `collectstatic` ishga tushirilgach, terminalda nechta fayl `STATIC_ROOT`ga nusxalanganini ko'rsatuvchi xabar chiqadi.

</details>

## Qisqacha xulosa

Django'ning `TestCase` va `Client` klasslari orqali model va view'larni avtomatik, har bir test alohida toza DB holatida sinab ko'rish mumkin — har bir muhim funksiya uchun ham "to'g'ri", ham "noto'g'ri" holatni tekshirish shart; STATIC (dasturchi tomonidan yaratilgan CSS/JS) va MEDIA (foydalanuvchi yuklagan fayllar) fayllar boshqa-boshqa sozlanadi va production'da `collectstatic` orqali yig'ilib, Nginx yoki WhiteNoise orqali xizmat ko'rsatiladi; va har qanday production deploy'dan oldin xavfsizlik cheklisti (ayniqsa `DEBUG=False`, `.env`dagi maxfiy ma'lumotlar, `python manage.py check --deploy`) albatta tekshirilishi kerak.
