# Models — maydonlar va relatsiyalar

## Bu darsda nimalarni o'rganasiz

- Model klassi orqali ma'lumotlar bazasi jadvalini tasvirlab bera olasiz
- Eng ko'p ishlatiladigan maydon turlarini (`CharField`, `TextField`, `ForeignKey` va h.k.) to'g'ri tanlay olasiz
- `ForeignKey`, `ManyToManyField`, `OneToOneField` relatsiyalari orasidagi farqni tushuntira olasiz
- `on_delete` parametrining har bir variantini to'g'ri qo'llay olasiz

## Nazariy qism

### Model — Python klassi, DB jadvali

Django ORM (Object-Relational Mapping) — SQL yozmasdan, oddiy Python klassi orqali ma'lumotlar bazasi bilan ishlash imkonini beradi. Har bir **Model klassi** — bitta DB jadvaliga, har bir **atribut** — shu jadvalning bitta ustuniga mos keladi.

```python
# apps/blog/models.py
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name
```

Bu kod orqali Django avtomatik ravishda `blog_category` nomli jadval yaratadi (`makemigrations`/`migrate` orqali — keyingi darsda), ikkita ustun bilan: `name` (matn) va `slug` (URL-do'st matn).

### Eng ko'p ishlatiladigan maydon turlari

| Maydon turi | Nima uchun | Misol |
|---|---|---|
| `CharField(max_length=N)` | Qisqa matn (sarlavha, ism) | `title = models.CharField(max_length=200)` |
| `TextField()` | Uzun matn (maqola matni) | `body = models.TextField()` |
| `IntegerField()` / `PositiveIntegerField()` | Butun son | `views_count = models.PositiveIntegerField(default=0)` |
| `DecimalField(max_digits, decimal_places)` | Aniq kasr son (pul) | `price = models.DecimalField(max_digits=10, decimal_places=2)` |
| `BooleanField()` | Ha/yo'q | `is_active = models.BooleanField(default=True)` |
| `DateTimeField(auto_now_add=True)` | Yaratilgan vaqt (bir marta yoziladi) | `created_at = models.DateTimeField(auto_now_add=True)` |
| `DateTimeField(auto_now=True)` | Har saqlashda yangilanadigan vaqt | `updated_at = models.DateTimeField(auto_now=True)` |
| `SlugField()` | URL uchun qulay matn (`mening-postim`) | `slug = models.SlugField(unique=True)` |
| `ImageField(upload_to=...)` | Rasm fayli | `image = models.ImageField(upload_to="posts/%Y/%m/")` |

`auto_now_add` va `auto_now` orasidagi farq muhim: birinchisi obyekt **birinchi marta yaratilganda** vaqtni yozadi va keyin o'zgarmaydi; ikkinchisi **har safar saqlanganda** vaqtni yangilaydi.

### Relatsiyalar — modellarni bir-biriga bog'lash

| Turi | Ma'nosi | Misol |
|---|---|---|
| `ForeignKey` | Ko'p obyekt — bitta obyektga bog'liq (1:N) | Ko'p `Post` — bitta `Category` |
| `ManyToManyField` | Ko'p obyekt — ko'p obyektga bog'liq (M:N) | Ko'p `Post` — ko'p `Tag` |
| `OneToOneField` | Bitta obyekt — faqat bitta obyektga bog'liq (1:1) | Bitta `Profile` — bitta `User` |

```python
from django.conf import settings
from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    body = models.TextField()

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="posts"
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="posts")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

`related_name` — teskari tomondan bog'lanishga murojaat qilish uchun nom beradi: `category.posts.all()` — shu kategoriyaga tegishli barcha postlarni oladi, `related_name` ko'rsatilmasa, Django avtomatik `post_set` nomini beradi (kamroq o'qiladigan).

### on_delete — bog'liq obyekt o'chirilganda nima bo'ladi

`ForeignKey` va `OneToOneField` yaratishda `on_delete` **majburiy** parametr — u DB'ga "agar bog'langan obyekt o'chirilsa, bu yozuv bilan nima qilish kerak" deb ko'rsatadi:

| Qiymat | Xatti-harakat |
|---|---|
| `CASCADE` | Bog'liq obyekt o'chirilsa, bu ham o'chadi (masalan, foydalanuvchi o'chsa, uning postlari ham o'chadi) |
| `SET_NULL` | Bog'liq obyekt o'chirilsa, maydon `NULL` bo'ladi (`null=True` shart) |
| `PROTECT` | Bog'liq obyekt hali ishlatilayotgan bo'lsa, o'chirishga umuman yo'l qo'ymaydi (xato beradi) |
| `SET_DEFAULT` | Standart qiymatga o'rnatiladi (`default` ko'rsatilgan bo'lishi kerak) |

Amaliyotda: foydalanuvchi (`author`) o'chsa, uning postlari ma'nosiz qolmasligi uchun ko'pincha `CASCADE` ishlatiladi; kategoriya o'chsa, lekin postlar saqlanib qolishi kerak bo'lsa (faqat kategoriyasiz), `SET_NULL` ishlatiladi.

## Amaliy misol

To'liq blog modeli — kategoriya, teg va ma'qullash (like) tizimi bilan:

```python
# apps/blog/models.py
from django.conf import settings
from django.db import models
from django.urls import reverse


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Qoralama"
        PUBLISHED = "published", "Chop etilgan"

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    body = models.TextField()

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts"
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="posts"
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="posts")
    liked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name="liked_posts"
    )

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("blog:post_detail", kwargs={"slug": self.slug})
```

Shell orqali sinab ko'rish (migratsiyalardan keyin, 5-darsda):

```python
>>> category = Category.objects.create(name="Texnologiya", slug="texnologiya")
>>> post = Post.objects.create(title="Django asoslari", slug="django-asoslari", body="...", author=user, category=category)
>>> post.tags.add(Tag.objects.create(name="Python"))
>>> category.posts.all()          # related_name orqali teskari bog'lanish
<QuerySet [<Post: Django asoslari>]>
```

## Keng tarqalgan xatolar

**Xato 1:** `ForeignKey`da `on_delete` parametrini ko'rsatmaslik.
❌ Django 2.0'dan boshlab bu parametr **majburiy** — uni yozmasangiz, `TypeError` chiqadi va model umuman yaratilmaydi.
✅ To'g'ri: har doim aniq tanlov qiling — `on_delete=models.CASCADE` yoki loyihangiz mantig'iga mos boshqa variant, hech qachon o'ylamasdan `CASCADE` qo'yavermang.

**Xato 2:** `SET_NULL` ishlatib, lekin `null=True` qo'shishni unutish.
❌ `category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name="posts")` — kategoriya o'chirilganda Django `NULL` yozmoqchi bo'ladi, lekin maydon `NULL` qabul qilmaydi, va xatolik yuz beradi.
✅ To'g'ri: `SET_NULL` ishlatilganda **doim** `null=True` ham qo'shing: `on_delete=models.SET_NULL, null=True`.

**Xato 3:** `ManyToManyField`da `blank=True` qo'shmaslik, keyin formada bu maydonni "majburiy emas" qilmoqchi bo'lish.
❌ Admin panelda yoki formada `tags` maydoni hech narsa tanlanmasdan saqlanmoqchi bo'lsa, validatsiya xatosi chiqadi.
✅ To'g'ri: agar maydon ixtiyoriy bo'lishi kerak bo'lsa (tegsiz post ham bo'lishi mumkin), `tags = models.ManyToManyField(Tag, blank=True)` deb belgilang — `null=True` `ManyToManyField`ga umuman ta'sir qilmaydi, faqat `blank=True` kerak.

## Mashq/topshiriq

**(Oson)** `Author` (ism, email) va `Book` (nomi, narxi, `Author`ga `ForeignKey`) modellarini yarating. `Book.author`ning `on_delete` qiymatini `CASCADE` qilib belgilang va nega aynan shuni tanlaganingizni bir gapda tushuntiring.

**(O'rtacha)** `Book` modeliga `Genre` (janr) modelini `ManyToManyField` orqali bog'lang (bitta kitob bir nechta janrga tegishli bo'lishi mumkin). `related_name="books"` qo'shing va bu nima uchun kerakligini tushuntiring.

**(Qiyin)** Kutubxona tizimi uchun `Member` (a'zo) va `LibraryCard` (kutubxona kartasi) modellarini yarating — ular orasida `OneToOneField` bog'lanish bo'lsin (har bir a'zoda faqat bitta karta). `LibraryCard`ni o'chirish `Member`ni o'chirmasligi kerak bo'lsa, qaysi `on_delete` qiymatini tanlaysiz va nega?

<details>
<summary>Javoblarni ko'rish</summary>

1. `on_delete=models.CASCADE` tanlanadi, chunki muallif o'chirilganda uning kitoblari ma'lumotlar bazasida "egasiz" qolib ketmasligi kerak — mantiqan kitob muallifsiz mavjud bo'la olmaydi (agar aksincha kerak bo'lsa, `SET_NULL` + `null=True` ishlatiladi).
2. `genres = models.ManyToManyField(Genre, related_name="books")` — `related_name="books"` orqali `genre.books.all()` yozib, shu janrga tegishli barcha kitoblarni to'g'ridan-to'g'ri, teskari yo'nalishda olish mumkin bo'ladi, aks holda Django avtomatik `book_set` nomini beradi.
3. Bu holatda `Member` tarafida `on_delete` emas, balki `LibraryCard`dagi `member = models.OneToOneField(Member, on_delete=models.CASCADE)` bo'ladi (karta a'zoga bog'liq, aksincha emas) — savoldagi talab "kartani o'chirish a'zoni o'chirmasligi" bo'lgani uchun, aslida `on_delete` faqat "asosiy" obyekt o'chirilganda ishlaydi (`Member` o'chsa, `LibraryCard` ham `CASCADE` bilan o'chadi) — kartani alohida o'chirish `Member`ga hech qanday `on_delete` mantig'ini ishga tushirmaydi, chunki `ForeignKey`/`OneToOneField` faqat "asosiy" obyekt tomonidan yo'naltiriladi.

</details>

## Qisqacha xulosa

Django modeli — Python klassi orqali DB jadvalini tasvirlaydi, bunda har bir atribut (`CharField`, `TextField`, `DateTimeField` va h.k.) bitta ustunga mos keladi; modellarni bir-biriga bog'lash uchun uchta asosiy relatsiya bor — `ForeignKey` (ko'p-birga), `ManyToManyField` (ko'p-ko'pga), `OneToOneField` (bir-birga) — va `ForeignKey`/`OneToOneField`da **majburiy** `on_delete` parametri bog'liq obyekt o'chirilganda nima bo'lishini (`CASCADE`, `SET_NULL`, `PROTECT`, `SET_DEFAULT`) aniq belgilaydi, buni loyihangiz haqiqiy mantig'iga qarab ongli tanlash muhim.
