# Django REST Framework — API yaratish

## Bu darsda nimalarni o'rganasiz

- Django REST Framework (DRF)ni loyihaga qo'sha olasiz
- `ModelSerializer` orqali modelni JSON'ga aylantira olasiz
- `ModelViewSet` va `DefaultRouter` orqali to'liq API endpoint yarata olasiz
- `permission_classes` orqali API'ga kirish huquqini boshqara olasiz

## Nazariy qism

### Nega API kerak

Agar loyihangizga mobil ilova yoki alohida frontend (React, Vue, yoki boshqa JavaScript freymvork) qo'shmoqchi bo'lsangiz, ular Django'ning HTML shablonlarini emas, balki **JSON** formatidagi ma'lumotni talab qiladi. **Django REST Framework (DRF)** — Django ustiga qurilgan, API yaratishni ancha soddalashtiradigan standart kutubxona.

```bash
pip install djangorestframework
```

```python
# settings.py
INSTALLED_APPS += ["rest_framework"]
```

### Serializer — model va JSON orasidagi ko'prik

`Serializer` — `ModelForm`ning API dunyosidagi o'xshashi: model obyektini JSON'ga (va aksincha) aylantiradi, validatsiya qiladi.

```python
# apps/blog/serializers.py
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = Post
        fields = ["id", "title", "slug", "body", "author", "status", "created_at"]
        read_only_fields = ["id", "created_at"]
```

`ReadOnlyField(source="author.username")` — API javobida `author` maydoni sifatida foydalanuvchining ID'si o'rniga uning `username`ini ko'rsatadi, lekin bu maydon orqali yozish (o'zgartirish) mumkin emas.

### ViewSet va Router — bitta klassda to'liq CRUD

```python
# apps/blog/api_views.py
from rest_framework import viewsets, permissions
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(status=Post.Status.PUBLISHED).select_related("author")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)   # yaratuvchini avtomatik biriktirish
```

`ModelViewSet` — bitta klassda **GET** (ro'yxat va bitta obyekt), **POST**, **PUT**, **PATCH**, **DELETE** — hammasini avtomatik beradi.

```python
# apps/blog/api_urls.py
from rest_framework.routers import DefaultRouter
from .api_views import PostViewSet

router = DefaultRouter()
router.register("posts", PostViewSet, basename="post")

urlpatterns = router.urls
```

`DefaultRouter` avtomatik ravishda quyidagi manzillarni yaratadi:

| Manzil | HTTP metod | Vazifasi |
|---|---|---|
| `/api/posts/` | GET | Barcha postlar ro'yxati |
| `/api/posts/` | POST | Yangi post yaratish |
| `/api/posts/<id>/` | GET | Bitta postni ko'rish |
| `/api/posts/<id>/` | PUT/PATCH | Postni yangilash |
| `/api/posts/<id>/` | DELETE | Postni o'chirish |

### permission_classes — kirish huquqini boshqarish

| Klass | Ma'nosi |
|---|---|
| `AllowAny` | Hamma kirishi mumkin |
| `IsAuthenticated` | Faqat tizimga kirganlar |
| `IsAuthenticatedOrReadOnly` | Hamma o'qishi mumkin, faqat tizimga kirganlar yozishi (yaratish/o'zgartirish) mumkin |
| `IsAdminUser` | Faqat admin (`is_staff=True`) |

Bu — 11-darsdagi `permission_required` bilan bir xil g'oya, faqat API kontekstida.

## Amaliy misol

To'liq blog API'si — kategoriya bilan filtrlash va faqat muallifning o'zi tahrirlay olishi bilan:

```python
# apps/blog/serializers.py
from rest_framework import serializers
from .models import Post, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True, required=False
    )

    class Meta:
        model = Post
        fields = ["id", "title", "slug", "body", "author", "category", "category_id", "status", "created_at"]
        read_only_fields = ["id", "created_at"]
```

```python
# apps/blog/permissions.py
from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """Faqat postning muallifi uni o'zgartira yoki o'chira oladi, qolganlar faqat o'qiy oladi."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:   # GET, HEAD, OPTIONS
            return True
        return obj.author == request.user
```

```python
# apps/blog/api_views.py
from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(status=Post.Status.PUBLISHED).select_related("author", "category")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["category"]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
```

Endi `/api/posts/?category=1` — faqat 1-ID'li kategoriyaga tegishli postlarni qaytaradi, va boshqa foydalanuvchining postini o'zgartirishga urinish `403 Forbidden` bilan rad etiladi.

## Keng tarqalgan xatolar

**Xato 1:** `perform_create()`da `author`ni avtomatik belgilashni unutish.
❌ `serializer_class`da `author` `ReadOnlyField` qilingan, lekin `perform_create()` override qilinmagan — natijada yangi post yaratishga urinilganda `author` maydoni bo'sh qolib, xatolik chiqadi.
✅ To'g'ri: `author` kabi "joriy foydalanuvchidan avtomatik olinadigan" maydonlar uchun har doim `perform_create(self, serializer): serializer.save(author=self.request.user)` yozing.

**Xato 2:** `permission_classes`ni umuman sozlamaslik.
❌ DRF'ning standart sozlamasi loyiha darajasida o'zgartirilmagan bo'lsa, ba'zi konfiguratsiyalarda API standart holda **hammaga ochiq** bo'lib qolishi mumkin — bu nozik xavfsizlik muammosi.
✅ To'g'ri: har bir `ViewSet`da aniq `permission_classes` ko'rsating, va loyiha darajasida ham `settings.py`da `REST_FRAMEWORK = {"DEFAULT_PERMISSION_CLASSES": [...]}` orqali "standart holat"ni aniq belgilang.

**Xato 3:** `has_object_permission`ni yozib, lekin `has_permission`siz kutilgan natijani olishga umid qilish.
❌ `IsAuthorOrReadOnly` faqat `has_object_permission`ni tekshiradi — bu **faqat** bitta obyektga (`retrieve`, `update`, `destroy`) tegishli amallarga qo'llaniladi, lekin ro'yxat (`list`) yoki yaratish (`create`) amallariga **taalluqli emas**.
✅ To'g'ri: agar yaratish (`create`) amalini ham cheklash kerak bo'lsa, buni alohida `permission_classes` ichidagi boshqa klass (masalan, `IsAuthenticated`) yoki `has_permission()` metodi orqali qo'shimcha tekshiring.

## Mashq/topshiriq

**(Oson)** `Book` modeli uchun `BookSerializer(ModelSerializer)` yozing, `fields = ["id", "title", "author", "price"]`. `BookViewSet(ModelViewSet)` yarating va `DefaultRouter` orqali `/api/books/` manzilini oching.

**(O'rtacha)** `BookViewSet`ga `permission_classes = [permissions.IsAuthenticatedOrReadOnly]` qo'shing va `perform_create()` orqali kitobni qo'shgan foydalanuvchini `added_by` maydoniga avtomatik yozing.

**(Qiyin)** `IsOwnerOrReadOnly` nomli custom permission klass yozing (`has_object_permission` orqali) — bu faqat kitobni **qo'shgan** foydalanuvchi (`added_by`) uni tahrirlay yoki o'chira olishini, qolganlar faqat o'qiy olishini ta'minlasin. Bundan tashqari, `filterset_fields` orqali kitoblarni janr (`genre`) bo'yicha filtrlash imkoniyatini qo'shing.

<details>
<summary>Javoblarni ko'rish</summary>

1. `class BookSerializer(serializers.ModelSerializer): class Meta: model = Book; fields = ["id", "title", "author", "price"]`; `router.register("books", BookViewSet, basename="book")`.
2. `permission_classes = [permissions.IsAuthenticatedOrReadOnly]`; `def perform_create(self, serializer): serializer.save(added_by=self.request.user)`.
3. `class IsOwnerOrReadOnly(permissions.BasePermission): def has_object_permission(self, request, view, obj): if request.method in permissions.SAFE_METHODS: return True; return obj.added_by == request.user`; `filterset_fields = ["genre"]` — endi `/api/books/?genre=1` ishlaydi.

</details>

## Qisqacha xulosa

Django REST Framework — modelni `ModelSerializer` orqali JSON'ga aylantiradi, `ModelViewSet` va `DefaultRouter` esa bitta klass va bir necha qatorli kod bilan to'liq CRUD API endpoint (`GET`/`POST`/`PUT`/`PATCH`/`DELETE`) yaratadi; `permission_classes` orqali kimga qanday amal ruxsat etilishini (masalan, `IsAuthenticatedOrReadOnly` — hamma o'qiy oladi, faqat tizimga kirganlar yoza oladi) boshqarish, `perform_create()` orqali esa joriy foydalanuvchini avtomatik biriktirish mumkin — bu mobil ilova yoki alohida frontend bilan integratsiya qilishning standart Django yo'li.
