# URLs — marshrutlash

## Bu darsda nimalarni o'rganasiz

- `urlpatterns` ro'yxatini to'g'ri tuza olasiz
- Dinamik URL konverterlari (`<int:pk>`, `<slug:slug>` va h.k.) qo'llay olasiz
- `app_name` va `namespace` orqali app URL'larini izolyatsiya qila olasiz
- `include()` orqali bosh URL faylini app'larga bo'la olasiz

## Nazariy qism

### URL — manzildan view'gacha bo'lgan yo'l

`urls.py` — Django'ning "yo'l ko'rsatuvchi xaritasi": u qaysi URL manzili qaysi view'ga tegishli ekanini belgilaydi.

```python
# apps/blog/urls.py
from django.urls import path
from . import views

app_name = "blog"

urlpatterns = [
    path("", views.PostListView.as_view(), name="post_list"),
    path("post/<slug:slug>/", views.PostDetailView.as_view(), name="post_detail"),
]
```

`path()` uchta narsa qabul qiladi: URL naqshi (`"post/<slug:slug>/"`), chaqiriladigan view, va `name` — bu manzilga **nom** bo'lib, kod ichida (`reverse()`, shablonlarda `{% url %}`) manzilni qattiq yozish o'rniga nom orqali murojaat qilish imkonini beradi.

### Dinamik konverterlar

| Konverter | Nima ushlaydi | Misol |
|---|---|---|
| `<int:pk>` | Faqat butun son | `post/<int:pk>/` → `post/42/` |
| `<str:name>` | `/` dan tashqari har qanday matn | `user/<str:name>/` → `user/shams/` |
| `<slug:slug>` | Harflar, raqamlar, chiziqcha (`-`, `_`) | `post/<slug:slug>/` → `post/django-asoslari/` |
| `<uuid:id>` | UUID formatidagi identifikator | `order/<uuid:id>/` |
| `<path:full_path>` | `/` belgisini ham qamrab oladigan matn | `files/<path:full_path>/` |

`slug` — odatda sarlavhadan avtomatik generatsiya qilingan, URL'ga qulay matn (`"Django asoslari"` → `"django-asoslari"`) bo'lgani uchun, ko'rinadigan sahifalar uchun `pk`ga qaraganda ancha ko'p ishlatiladi — chunki foydalanuvchi va qidiruv tizimlari uchun ma'noli manzil beradi.

### Tartib muhim — aniqroq yo'llar yuqorida

```python
urlpatterns = [
    path("", views.PostListView.as_view(), name="post_list"),
    # ⚠️ "post/create/" — "post/<slug:slug>/"dan OLDIN turishi shart!
    path("post/create/", views.PostCreateView.as_view(), name="post_create"),
    path("post/<slug:slug>/", views.PostDetailView.as_view(), name="post_detail"),
]
```

Django URL patternlarini **tepadan pastga** qarab tekshiradi va birinchi mos kelganini ishlatadi. Agar `post/<slug:slug>/` yuqorida bo'lsa, `post/create/` manziliga kirilganda Django `"create"`ni **slug qiymati** deb qabul qilib, `PostDetailView`ga yuboradi — bu esa "topilmadi" (404) xatosiga olib keladi, chunki `slug="create"` bo'lgan post mavjud emas.

### app_name va namespace — app'lar orasida nom to'qnashuvining oldini olish

Agar loyihada `blog` va `shop` app'larining ikkalasida ham `post_detail` nomli URL bo'lsa, Django qaysi birini nazarda tutayotganingizni bilmay qoladi. `app_name` shu muammoni hal qiladi:

```python
# apps/blog/urls.py
app_name = "blog"
urlpatterns = [path("post/<slug:slug>/", views.PostDetailView.as_view(), name="post_detail")]
```

Endi manzilga murojaat qilishda **to'liq nom** ishlatiladi: `blog:post_detail`.

### Bosh URL faylida include() orqali birlashtirish

```python
# config/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("apps.blog.urls", namespace="blog")),
    path("shop/", include("apps.shop.urls", namespace="shop")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

`include()` — bosh URL faylini har bir app'ning o'z `urls.py`siga "topshiradi", bu esa har bir app'ni mustaqil, o'z-o'zini boshqaradigan modul sifatida saqlashga yordam beradi.

## Amaliy misol

Shablonda va kodda `{% url %}`/`reverse()` orqali manzilga murojaat qilish — hech qachon qattiq yozilgan (`"/post/1/"`) manzil ishlatilmaydi:

```python
# apps/blog/urls.py
from django.urls import path
from . import views

app_name = "blog"

urlpatterns = [
    path("", views.PostListView.as_view(), name="post_list"),
    path("post/create/", views.PostCreateView.as_view(), name="post_create"),
    path("post/<slug:slug>/", views.PostDetailView.as_view(), name="post_detail"),
    path("post/<slug:slug>/edit/", views.PostUpdateView.as_view(), name="post_update"),
    path("post/<slug:slug>/delete/", views.PostDeleteView.as_view(), name="post_delete"),
    path("category/<slug:slug>/", views.CategoryDetailView.as_view(), name="category_detail"),
]
```

Shablonda:

```html
<a href="{% url 'blog:post_detail' post.slug %}">{{ post.title }}</a>
<a href="{% url 'blog:post_create' %}">➕ Yangi post</a>
```

Python kodida (masalan, view ichida yo'naltirishda):

```python
from django.urls import reverse
from django.shortcuts import redirect

def post_create_done(request, slug):
    return redirect(reverse("blog:post_detail", kwargs={"slug": slug}))
    # yoki qisqaroq: return redirect("blog:post_detail", slug=slug)
```

Modelning o'zida (`get_absolute_url`):

```python
class Post(models.Model):
    ...
    def get_absolute_url(self):
        return reverse("blog:post_detail", kwargs={"slug": self.slug})
```

Agar keyinchalik `post/<slug:slug>/` manzilini `article/<slug:slug>/`ga o'zgartirmoqchi bo'lsangiz, faqat `urls.py`dagi bitta qatorni o'zgartirasiz — barcha shablon va kod joylarida `{% url 'blog:post_detail' %}` avtomatik yangi manzilga mos keladi, chunki hech qayerda manzil qattiq yozilmagan.

## Keng tarqalgan xatolar

**Xato 1:** statik (aniq) URL'ni dinamik URL'dan **keyin** yozish.
❌ `path("post/<slug:slug>/", ...)` dan keyin `path("post/create/", ...)` yozilsa, `/post/create/` manziliga kirganda Django buni `PostDetailView`ga, `slug="create"` sifatida yuboradi.
✅ To'g'ri: har doim aniqroq, statik yo'llarni yuqoriga, umumiyroq, dinamik yo'llarni pastga joylashtiring.

**Xato 2:** shablon yoki kodda manzilni qattiq (`hardcode`) yozish.
❌ `<a href="/blog/post/{{ post.slug }}/">` — agar keyinchalik URL strukturasi o'zgarsa, loyiha bo'ylab **har bir joyni** qo'lda qidirib topib o'zgartirish kerak bo'ladi.
✅ To'g'ri: har doim `{% url 'blog:post_detail' post.slug %}` yoki `reverse()` ishlatilsin — manzil bitta joyda (`urls.py`da) belgilanadi.

**Xato 3:** `include()`da `namespace` ko'rsatib, lekin app'ning o'z `urls.py`sida `app_name` belgilamaslik.
❌ `path("", include("apps.blog.urls", namespace="blog"))` yozilgan, lekin `apps/blog/urls.py`da `app_name = "blog"` yo'q — Django `ImproperlyConfigured` xatosini beradi.
✅ To'g'ri: `namespace` ishlatilganda, mos app'ning `urls.py`sida albatta bir xil `app_name` qiymati bo'lishi shart.

## Mashq/topshiriq

**(Oson)** `Book` app'i uchun `urls.py` yarating: `""` (ro'yxat), `"book/<int:pk>/"` (tafsilot) manzillari, mos `name` qiymatlari bilan (`book_list`, `book_detail`).

**(O'rtacha)** `app_name = "books"` qo'shing va bosh `config/urls.py`da `include("apps.books.urls", namespace="books")` orqali ulang. Shablonda `{% url 'books:book_detail' book.pk %}` orqali havola yarating.

**(Qiyin)** `Book` app'iga `"book/create/"` (yaratish) manzilini qo'shing va uni **to'g'ri tartibda** (`"book/<int:pk>/"`dan oldin yoki keyin — qaysi biri to'g'ri ekanini asoslab) joylashtiring. So'ng ataylab noto'g'ri tartibda joylashtirib, `/book/create/` manziliga kirganda qanday xatolik (yoki noto'g'ri natija) chiqishini kuzatib, nima uchun bunday bo'lganini tushuntirib bering.

<details>
<summary>Javoblarni ko'rish</summary>

1. `urlpatterns = [path("", views.BookListView.as_view(), name="book_list"), path("book/<int:pk>/", views.BookDetailView.as_view(), name="book_detail")]`.
2. `app_name = "books"` qo'shilgach, bosh faylda `include("apps.books.urls", namespace="books")`; shablonda `{% url 'books:book_detail' book.pk %}` to'g'ri ishlaydi.
3. To'g'ri tartib: `path("book/create/", ...)` — `path("book/<int:pk>/", ...)`dan **oldin**, chunki `<int:pk>` faqat butun sonni ushlaydi va `"create"` matn bo'lgani uchun aslida bu holatda `<int:pk>` uni ushlamaydi (xato bermaydi) — lekin agar `<slug:slug>` yoki `<str:...>` ishlatilganda bo'lganida, `"create"` matn sifatida ushlanib, `BookDetailView`ga yuborilardi va u yerda `pk="create"` bilan obyekt qidirilib, 404 chiqardi. Shu sababli, konverter turidan qat'i nazar, statik yo'llarni doim yuqoriga yozish — xavfsiz umumiy qoida.

</details>

## Qisqacha xulosa

`urls.py` — URL manzilini mos view'ga bog'lovchi "xarita" bo'lib, `<int:pk>`, `<slug:slug>` kabi dinamik konverterlar orqali qismli manzillarni qabul qiladi; statik (aniq) yo'llar har doim dinamik yo'llardan **yuqorida** turishi shart, chunki Django patternlarni tepadan pastga qarab, birinchi mos kelganini tanlaydi; `app_name`/`namespace` orqali har bir app o'z nom maydonini oladi, `include()` esa bosh URL faylini kichik, mustaqil qismlarga bo'lishga imkon beradi — va manzillarga hech qachon qattiq yozilgan satr emas, balki `{% url %}`/`reverse()` orqali **nom** bilan murojaat qilinadi.
