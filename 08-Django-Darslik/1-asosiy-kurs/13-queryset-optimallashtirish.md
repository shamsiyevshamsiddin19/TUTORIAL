# QuerySet optimallashtirish

## Bu darsda nimalarni o'rganasiz

- N+1 muammosini tanib olib, `select_related`/`prefetch_related` orqali hal qila olasiz
- `only()`/`defer()` orqali faqat kerakli maydonlarni yuklay olasiz
- `Q`, `F`, `annotate` orqali murakkab so'rovlar tuza olasiz
- Sahifangiz nechta SQL so'rov yuborayotganini tekshira olasiz

## Nazariy qism

### N+1 muammosi — Django ORM'ning eng ko'p uchraydigan tuzog'i

Django ORM juda qulay, lekin bu qulaylik ehtiyotsizlik bilan ishlatilsa, **N+1 muammosi**ga olib keladi: 1 ta so'rov ro'yxatni oladi, so'ngra **har bir** elementi uchun yana alohida so'rov yuboriladi — jami N+1 ta so'rov, o'rniga 1 yoki 2 ta yetarli bo'lishi mumkin bo'lgan joyda.

```python
# ❌ YOMON: N+1 muammosi
posts = Post.objects.all()            # 1-so'rov: barcha postlarni oladi
for post in posts:
    print(post.author.username)        # har bir post uchun ALOHIDA so'rov! (agar 100 post bo'lsa — 100 ta qo'shimcha so'rov)
```

Bu muammo ayniqsa production'da, ma'lumot ko'payib borgan sari, sahifa tobora sekinlashishiga sabab bo'ladi — lokal test paytida (10-15 ta yozuv bilan) bu sezilmasligi mumkin.

### select_related — ForeignKey/OneToOne uchun

`select_related` SQL **JOIN** orqali bog'liq obyektni **bitta** so'rovda birga oladi:

```python
# ✅ YAXSHI: bitta so'rov, JOIN orqali
posts = Post.objects.select_related("author", "category").all()
for post in posts:
    print(post.author.username)    # qo'shimcha so'rov YO'Q — allaqachon yuklangan
```

`select_related` faqat `ForeignKey` va `OneToOneField` uchun ishlaydi, chunki bular SQL darajasida to'g'ridan-to'g'ri JOIN qilib bo'ladigan bog'lanishlar.

### prefetch_related — ManyToMany va teskari ForeignKey uchun

`ManyToManyField` yoki teskari `ForeignKey` (masalan, bitta postning ko'p izohlari) uchun JOIN ishlamaydi (chunki natija "ko'p qatorli" bo'ladi), shu sababli Django alohida strategiya ishlatadi — **ikkita** so'rov (jami), lekin N+1 emas:

```python
# ✅ YAXSHI: 2 ta so'rov (N+1 o'rniga)
posts = Post.objects.prefetch_related("tags", "comments").all()
for post in posts:
    for tag in post.tags.all():       # qo'shimcha so'rov YO'Q — oldindan yuklangan
        print(tag.name)
```

`select_related` va `prefetch_related`ni birga ishlatish ham mumkin va odatiy holat:

```python
posts = Post.objects.select_related("author", "category").prefetch_related("tags", "comments")
```

### only() va defer() — faqat kerakli maydonlarni yuklash

Katta jadvalda (masalan, `Post.body` ustuni juda uzun matn saqlasa), agar sizga faqat sarlavha kerak bo'lsa, butun qatorni yuklash resurs isrofi:

```python
Post.objects.only("title", "slug")      # FAQAT shu ikki maydonni yuklaydi
Post.objects.defer("body")               # HAMMA maydonni, "body"dan TASHQARI, yuklaydi
```

### Q — murakkab OR shartlari

Oddiy `.filter()` chaqiruvlari orasida avtomatik **AND** mantig'i ishlaydi. **OR** mantig'i uchun `Q` obyekti kerak:

```python
from django.db.models import Q

# status="published" YOKI author=joriy_foydalanuvchi
Post.objects.filter(Q(status="published") | Q(author=request.user))
```

### F — DB darajasida maydonlarni solishtirish/yangilash

`F()` — Python qiymatini emas, balki **boshqa DB ustunining o'zini** ifodalaydi. Bu ayniqsa hisoblagichlarni **race condition'siz** oshirishda muhim:

```python
from django.db.models import F

# ❌ XAVFLI: ikki foydalanuvchi bir vaqtda ko'rsa, hisoblagich noto'g'ri bo'lishi mumkin
post.views_count = post.views_count + 1
post.save()

# ✅ XAVFSIZ: yangilash DB darajasida, bitta atomik operatsiya sifatida bajariladi
Post.objects.filter(pk=post.pk).update(views_count=F("views_count") + 1)
```

Birinchi variant xavfli, chunki Python qiymatni o'qib olib, +1 qilib, qayta yozadi — agar shu oraliqda boshqa so'rov ham xuddi shu ishni qilsa, bittasi "yo'qolib qoladi" (masalan, ikkita bir vaqtdagi so'rov ikkalasi ham `5`ni o'qib, ikkalasi ham `6` deb yozadi — natijada `7` emas, `6` bo'lib qoladi). `F()` bilan yangilash esa DB'ning o'ziga "joriy qiymatga 1 qo'sh" deb buyruq beradi — bu **atomik** operatsiya.

### annotate — agregatsiya

```python
from django.db.models import Count

# har bir kategoriya uchun, unga tegishli postlar sonini hisoblab qo'shadi
Category.objects.annotate(post_count=Count("posts")).order_by("-post_count")
```

## Amaliy misol

Optimallashtirilgan post ro'yxati view'i — barcha texnikalarni birlashtirgan:

```python
from django.db.models import Q, Count
from django.views.generic import ListView
from .models import Post


class PostListView(ListView):
    model = Post
    template_name = "blog/post_list.html"
    context_object_name = "posts"
    paginate_by = 10

    def get_queryset(self):
        queryset = (
            Post.objects
            .select_related("author", "category")      # ForeignKey — JOIN orqali
            .prefetch_related("tags")                     # ManyToMany — alohida, lekin N+1 emas
            .only("id", "title", "slug", "created_at", "author__username", "category__name")
        )

        search = self.request.GET.get("q")
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(body__icontains=search))

        return queryset.filter(status=Post.Status.PUBLISHED)


def category_stats(request):
    categories = Category.objects.annotate(post_count=Count("posts")).order_by("-post_count")
    return render(request, "blog/category_stats.html", {"categories": categories})
```

### Nechta SQL so'rov yuborilayotganini tekshirish

```python
python manage.py shell
```
```python
>>> from django.db import connection, reset_queries
>>> from apps.blog.models import Post
>>> reset_queries()
>>> posts = list(Post.objects.all())
>>> for p in posts: p.author.username   # N+1 ni ataylab keltirib chiqaramiz
>>> print(len(connection.queries))
11    # 1 (postlar) + 10 (har bir post uchun author) — N+1 aniq ko'rinadi

>>> reset_queries()
>>> posts = list(Post.objects.select_related("author"))
>>> for p in posts: p.author.username
>>> print(len(connection.queries))
1    # select_related tufayli bitta so'rovning o'zi yetarli bo'ldi
```

Production loyihalarda bu tekshiruvni qo'lda emas, **Django Debug Toolbar** kutubxonasi orqali, har bir sahifa uchun avtomatik ko'rish qulayroq.

## Keng tarqalgan xatolar

**Xato 1:** `ForeignKey` uchun `prefetch_related`, `ManyToManyField` uchun `select_related` ishlatish.
❌ `Post.objects.select_related("tags")` — `tags` `ManyToManyField` bo'lgani uchun bu xato beradi yoki kutilgan natijani bermaydi.
✅ To'g'ri: `ForeignKey`/`OneToOneField` → `select_related`; `ManyToManyField`/teskari `ForeignKey` → `prefetch_related` — bu qoidani qattiq yodlab oling.

**Xato 2:** hisoblagichni oddiy Python arifmetikasi bilan yangilash.
❌ `post.views_count += 1; post.save()` — bir vaqtning o'zida ko'p foydalanuvchi bosganda, race condition tufayli hisoblagich noto'g'ri bo'lib qoladi.
✅ To'g'ri: `Post.objects.filter(pk=post.pk).update(views_count=F("views_count") + 1)` — bu DB darajasidagi atomik operatsiya, race condition'dan butunlay xoli.

**Xato 3:** `only()` ishlatib, keyin `only()`da ko'rsatilmagan maydonga murojaat qilish.
❌ `Post.objects.only("title")` bilan olingan obyektning `post.body`siga murojaat qilinsa, Django **yana bir qo'shimcha so'rov** yuboradi (bu N+1ning yashirin shakli) — bu esa `only()`ning maqsadini yo'qqa chiqaradi.
✅ To'g'ri: `only()`da **aynan** shablon yoki kodda ishlatiladigan barcha maydonlarni sanab o'ting, aks holda kutilmagan qo'shimcha so'rovlar paydo bo'ladi.

## Mashq/topshiriq

**(Oson)** `Book.objects.all()` orqali barcha kitoblarni olib, har birining `author.name`iga murojaat qiling — bu N+1 muammosini keltirib chiqaradi. Uni `select_related("author")` bilan tuzating va `connection.queries` uzunligini solishtirib ko'ring.

**(O'rtacha)** `Author` modeli uchun, har bir muallifning nechta kitobi borligini `annotate(book_count=Count("book"))` orqali hisoblab, kamayish tartibida chiqaring.

**(Qiyin)** Onlayn-do'kon uchun `Product.objects.filter(...)` so'rovini yozing — bu narxi `F("cost_price")` dan katta bo'lgan (foyda keltiradigan) MAHSULOTLARNI, VA nomi (`name`) yoki tavsifi (`description`) qidiruv so'zini o'z ichiga olganlarni (Q orqali) birgalikda topsin. Bundan tashqari, mahsulot sotilganda uning `stock` maydonini `F()` yordamida xavfsiz kamaytiring.

<details>
<summary>Javoblarni ko'rish</summary>

1. `select_related`siz — `1 + N` (N — kitoblar soni) ta so'rov; `select_related("author")` bilan — atigi `1` ta so'rov, chunki JOIN orqali barcha ma'lumot birga olinadi.
2. `Author.objects.annotate(book_count=Count("book")).order_by("-book_count")` (agar `related_name` boshqacha bo'lsa, o'sha nom ishlatiladi, masalan `Count("books")`).
3. `Product.objects.filter(price__gt=F("cost_price")).filter(Q(name__icontains=search) | Q(description__icontains=search))`; sotilganda: `Product.objects.filter(pk=product.pk).update(stock=F("stock") - quantity)`.

</details>

## Qisqacha xulosa

N+1 muammosi — Django ORM'da ro'yxatni olib, har bir element uchun alohida qo'shimcha so'rov yuborilishi natijasida yuzaga keladi va production'da sahifani sekinlashtiradigan eng ko'p uchraydigan xato; `select_related` (`ForeignKey`/`OneToOne` uchun, JOIN orqali) va `prefetch_related` (`ManyToMany`/teskari `ForeignKey` uchun) bu muammoni bir necha so'rovgacha qisqartiradi, `only()`/`defer()` faqat kerakli maydonlarni yuklaydi, `Q` murakkab OR shartlarini, `F()` esa DB darajasidagi xavfsiz (race condition'siz) yangilashlarni ta'minlaydi — bularning barchasi `django.db.connection.queries` yoki Django Debug Toolbar orqali tekshirilishi mumkin.
