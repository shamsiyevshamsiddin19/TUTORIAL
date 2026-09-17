# Django Admin panel

## Bu darsda nimalarni o'rganasiz

- Modelni admin panelga ro'yxatdan o'tkaza olasiz
- `list_display`, `list_filter`, `search_fields` orqali admin ro'yxatini sozlay olasiz
- `prepopulated_fields` orqali slug maydonini avtomatlashtira olasiz
- `TabularInline` orqali bog'liq modelni bitta sahifada tahrirlay olasiz

## Nazariy qism

### Admin panel — Django'ning "ombor omili"

Ko'pchilik freymvorklarda boshqaruv paneli (admin panel) noldan yozilishi kerak — bu haftalab vaqt talab qiladi. Django'da esa u **bir necha qatorli kod** bilan tayyor bo'ladi: modelni ro'yxatdan o'tkazishning o'zi to'liq CRUD (yaratish, o'qish, yangilash, o'chirish) interfeysini beradi, qidiruv, filtrlash, sahifalash bilan birga.

Superuser (to'liq huquqli admin foydalanuvchi) yaratish:

```bash
python manage.py createsuperuser
```

Model ro'yxatdan o'tkazish — eng sodda hol:

```python
# apps/blog/admin.py
from django.contrib import admin
from .models import Post, Category, Tag

admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Tag)
```

`python manage.py runserver` ishga tushirib, `http://127.0.0.1:8000/admin/` manziliga o'tsangiz — superuser login/parol bilan kirib, `Post`, `Category`, `Tag` obyektlarini yaratish/tahrirlash/o'chirish imkoniyati darhol paydo bo'ladi.

### ModelAdmin — ro'yxatni sozlash

Standart ro'yxat juda kambag'al ko'rinadi (faqat `__str__` natijasi). `ModelAdmin` klassi orqali uni boyitish mumkin:

```python
# apps/blog/admin.py
from django.contrib import admin
from .models import Post, Category, Tag


class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "status", "created_at")
    list_filter = ("status", "category", "created_at")
    search_fields = ("title", "body")
    prepopulated_fields = {"slug": ("title",)}
    date_hierarchy = "created_at"
    list_per_page = 25


admin.site.register(Post, PostAdmin)
admin.site.register(Category)
admin.site.register(Tag)
```

| Parametr | Vazifasi |
|---|---|
| `list_display` | Ro'yxat jadvalida qaysi ustunlar ko'rsatilishi |
| `list_filter` | O'ng tomonda paydo bo'ladigan filtrlash paneli |
| `search_fields` | Qidiruv qutisi qaysi maydonlarda qidirishi |
| `prepopulated_fields` | Sarlavha yozilganda `slug` avtomatik generatsiya bo'lishi (JavaScript orqali) |
| `date_hierarchy` | Sana bo'yicha navigatsiya (yil → oy → kun) |
| `list_per_page` | Bir sahifada nechta yozuv ko'rsatilishi |

Zamonaviy Django'da `@admin.register` dekoratori orqali ro'yxatdan o'tkazish ham keng qo'llaniladi — ikki qatorli kodni bittaga tushiradi:

```python
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "status", "created_at")
```

### Inline — bog'liq modelni bitta sahifada boshqarish

Agar `Comment` modeli `Post`ga `ForeignKey` orqali bog'langan bo'lsa, izohlarni `Post` sahifasining o'zida (alohida sahifaga o'tmasdan) ko'rish/tahrirlash mumkin:

```python
class CommentInline(admin.TabularInline):   # jadval ko'rinishida
    model = Comment
    extra = 1                                # bo'sh qator soni (yangi izoh qo'shish uchun)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "status")
    inlines = [CommentInline]
```

`TabularInline` — ixcham, jadval ko'rinishida; `StackedInline` — har bir yozuv uchun to'liq forma, kamroq maydonli modellar uchun qulayroq.

## Amaliy misol

Blog admin paneli — kategoriya avtomatlashtirilgan slug, izohlar inline bilan:

```python
# apps/blog/admin.py
from django.contrib import admin
from .models import Post, Category, Tag, Comment


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 1
    fields = ("author_name", "body", "is_approved")


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "status", "created_at")
    list_filter = ("status", "category", "created_at")
    search_fields = ("title", "body")
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ("author", "category")   # katta ro'yxatlarda qidiruv orqali tanlash
    date_hierarchy = "created_at"
    list_per_page = 25
    inlines = [CommentInline]

    actions = ["mark_as_published"]

    @admin.action(description="Tanlangan postlarni 'Chop etilgan' qilish")
    def mark_as_published(self, request, queryset):
        updated = queryset.update(status=Post.Status.PUBLISHED)
        self.message_user(request, f"{updated} ta post yangilandi.")


admin.site.register(Tag)
```

> 💡 `autocomplete_fields` ishlashi uchun bog'langan modelda (`author`, `category`) `search_fields` sozlangan bo'lishi shart — aks holda Django xato beradi.

Endi admin panelda: postlarni holat bo'yicha filtrlash, sarlavha bo'yicha qidirish, sarlavha yozilganda slug avtomatik yaratilishi, va bir nechta postni tanlab bir zarbda "Chop etilgan" qilish mumkin.

## Keng tarqalgan xatolar

**Xato 1:** modelni ro'yxatdan o'tkazishni umuman unutish.
❌ `models.py`da model yaratilgan, migratsiya ham qilingan, lekin admin panelda u umuman ko'rinmaydi — chunki `admin.py`da `admin.site.register(...)` chaqirilmagan.
✅ To'g'ri: har bir yangi model yaratilgach, uni darhol `admin.py`ga qo'shish odatini shakllantiring — hech bo'lmaganda vaqtincha, sinov uchun.

**Xato 2:** `autocomplete_fields` ishlatib, lekin bog'langan modelda `search_fields` sozlamaslik.
❌ `PostAdmin`da `autocomplete_fields = ("author",)` bor, lekin foydalanuvchi (`User`) admin klassida `search_fields` yo'q — Django `E040` xatosini beradi va server ishga tushmaydi.
✅ To'g'ri: `autocomplete_fields`ga kiritilgan har bir maydon uchun, o'sha modelning **o'z** `ModelAdmin`ida `search_fields` albatta belgilangan bo'lishi kerak.

**Xato 3:** `list_display`ga metodni qo'shib, lekin uni "tartiblab bo'ladigan" qilmaslik zarurligini bilmaslik.
❌ `list_display = ("title", "comment_count")` — bu yerda `comment_count` oddiy Python metodi bo'lsa, ustun sarlavhasini bosib tartiblab bo'lmaydi va foydalanuvchi buni kutadi.
✅ To'g'ri: agar tartiblash kerak bo'lsa, metodga `@admin.display(ordering="...")` dekoratorini qo'shing, yoki oddiygina buni cheklov sifatida qabul qiling — har doim ham har bir ustun tartiblanishi shart emas.

## Mashq/topshiriq

**(Oson)** 4-darsdagi `Book` modelini admin panelga ro'yxatdan o'tkazing, `list_display`ga `title`, `author`, `price` ustunlarini qo'shing.

**(O'rtacha)** `BookAdmin`ga `list_filter` (masalan, `genre` bo'yicha) va `search_fields` (`title` bo'yicha) qo'shing. So'ng `Author` modeliga oddiy `TextField` sifatida `bio` (tarjimai hol) maydonini qo'shib, uni ham admin panelda ko'rsating.

**(Qiyin)** `Book` modeliga bog'liq `Review` (sharh: matn, baho 1-5) modelini yarating (`ForeignKey` orqali `Book`ga bog'langan). `BookAdmin`ga `ReviewInline` (`TabularInline`) qo'shing, shuningdek `mark_as_bestseller` nomli maxsus admin action yozing — bu tanlangan kitoblarning `is_bestseller` maydonini `True` qilib qo'ysin (avval shu `BooleanField`ni modelga qo'shishingiz kerak bo'ladi).

<details>
<summary>Javoblarni ko'rish</summary>

1. `admin.site.register(Book, BookAdmin)` bilan `list_display = ("title", "author", "price")` — admin panelda uch ustunli jadval ko'rinishi kerak.
2. `list_filter = ("genre",)`, `search_fields = ("title",)` qo'shilgach, o'ng panelda janr bo'yicha filtr va yuqorida qidiruv qutisi paydo bo'ladi; `Author.bio` — oddiy `TextField(blank=True)` sifatida qo'shilib, `AuthorAdmin`da ko'rsatiladi.
3. `ReviewInline(admin.TabularInline)` bilan `model = Review`, `BookAdmin.inlines = [ReviewInline]`; `mark_as_bestseller` metodi `@admin.action(description="...")` bilan belgilanib, `queryset.update(is_bestseller=True)` chaqiradi va `BookAdmin.actions = ["mark_as_bestseller"]` orqali ro'yxatga qo'shiladi.

</details>

## Qisqacha xulosa

Django admin panel — modelni bir necha qatorli `admin.py` kodi bilan ro'yxatdan o'tkazish orqali to'liq CRUD boshqaruv interfeysini beradi; `ModelAdmin` klassidagi `list_display`, `list_filter`, `search_fields`, `prepopulated_fields` kabi parametrlar ro'yxatni qulay va professional ko'rinishga keltiradi, `TabularInline`/`StackedInline` esa bog'liq modellarni (izohlar, sharhlar) asosiy obyekt sahifasining o'zida tahrirlash imkonini beradi — bu esa Django'ning eng qadrli, tez natija beradigan xususiyatlaridan biri hisoblanadi.
