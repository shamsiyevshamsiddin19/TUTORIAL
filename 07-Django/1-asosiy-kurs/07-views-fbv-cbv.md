# Views — Function-based va Class-based

## Bu darsda nimalarni o'rganasiz

- Function-Based View (FBV) yoza olasiz
- Django'ning tayyor Class-Based View (CBV)'larini (`ListView`, `DetailView`, `CreateView` va h.k.) qo'llay olasiz
- FBV va CBV orasidan loyihangiz holatiga mos kelganini tanlay olasiz
- `get_queryset()` metodini override qilib, CBV'ning standart xatti-harakatini o'zgartira olasiz

## Nazariy qism

### View — so'rovni qabul qiluvchi va javob qaytaruvchi funksiya

View — Django'dagi "biznes mantiq" qatlami: u so'rovni qabul qiladi, kerakli ma'lumotni (odatda model orqali) oladi, va natijani (odatda HTML sifatida) qaytaradi. Django ikkita uslubni qo'llab-quvvatlaydi.

### Function-Based View (FBV) — oddiy va tushunarli

FBV — oddiy Python funksiyasi, birinchi argumenti har doim `request` (so'rov obyekti):

```python
# apps/blog/views.py
from django.shortcuts import render, get_object_or_404
from .models import Post

def post_list(request):
    posts = Post.objects.filter(status=Post.Status.PUBLISHED)
    return render(request, "blog/post_list.html", {"posts": posts})

def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, status=Post.Status.PUBLISHED)
    return render(request, "blog/post_detail.html", {"post": post})
```

`get_object_or_404` — obyekt topilmasa, avtomatik 404 sahifasini qaytaradi (o'zingiz `try/except` yozishga hojat yo'q). `render()` — shablon nomi va kontekst lug'atini qabul qilib, tayyor HTML javobini yaratadi.

### Class-Based View (CBV) — kam kod, tayyor xatti-harakat

Django standart CRUD (ro'yxat, tafsilot, yaratish, yangilash, o'chirish) operatsiyalari uchun tayyor klasslar beradi:

```python
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from .models import Post

class PostListView(ListView):
    model = Post
    template_name = "blog/post_list.html"
    context_object_name = "posts"     # shablonda ishlatiladigan o'zgaruvchi nomi
    paginate_by = 10                    # avtomatik sahifalash

    def get_queryset(self):
        return Post.objects.filter(status=Post.Status.PUBLISHED).select_related("author")


class PostDetailView(DetailView):
    model = Post
    template_name = "blog/post_detail.html"
    context_object_name = "post"


class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ["title", "slug", "body", "category", "status"]
    template_name = "blog/post_form.html"

    def form_valid(self, form):
        form.instance.author = self.request.user   # joriy foydalanuvchini avtomatik biriktirish
        return super().form_valid(form)


class PostUpdateView(LoginRequiredMixin, UpdateView):
    model = Post
    fields = ["title", "body", "category", "status"]
    template_name = "blog/post_form.html"


class PostDeleteView(LoginRequiredMixin, DeleteView):
    model = Post
    success_url = reverse_lazy("blog:post_list")
```

Bu yerda faqat ~25 qator kod bilan to'liq CRUD tizimi (ro'yxat, ko'rish, yaratish, tahrirlash, o'chirish, sahifalash, faqat login qilganlar uchun himoya) tayyor bo'ldi — FBV bilan yozilganda bu kod hajmi kamida 3-4 baravar ko'p bo'lardi.

`get_queryset()` — `ListView`/`DetailView`ning standart "hamma yozuvni olish" xatti-harakatini o'zgartiradi; `form_valid()` — `CreateView`/`UpdateView`da forma to'g'ri to'ldirilgach nima qilishni belgilaydi (bu yerda `author`ni avtomatik joriy foydalanuvchi qilib qo'yadi).

### Qachon qaysi birini tanlash

| Holat | Tavsiya |
|---|---|
| Oddiy, bir martalik maxsus mantiq (masalan, statistika hisoblovchi sahifa) | FBV |
| Standart CRUD (List/Detail/Create/Update/Delete) | CBV — kod ancha qisqaradi |
| Ko'p qayta ishlatiladigan umumiy xatti-harakat (masalan, "faqat login qilganlar") | CBV + Mixin |
| Murakkab, ko'p shartli, "agar-unda" zanjirlari ko'p mantiq | FBV — CBV'ning metod override zanjiri o'qishni qiyinlashtirishi mumkin |

Amaliyotda ko'p loyihalarda ikkalasi aralash ishlatiladi: standart CRUD — CBV, maxsus, bir martalik sahifalar — FBV.

## Amaliy misol

Bitta loyihada ikkala uslubni birga ishlatish — "eng ko'p ko'rilgan postlar" (FBV, maxsus mantiq) va standart CRUD (CBV):

```python
# apps/blog/views.py
from django.shortcuts import render
from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import F
from .models import Post


# --- FBV: maxsus, bir martalik mantiq ---
def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, status=Post.Status.PUBLISHED)
    Post.objects.filter(pk=post.pk).update(views_count=F("views_count") + 1)  # ko'rishlar sonini oshirish
    post.refresh_from_db()
    return render(request, "blog/post_detail.html", {"post": post})


# --- CBV: standart ro'yxat, sahifalash bilan ---
class PostListView(ListView):
    model = Post
    template_name = "blog/post_list.html"
    context_object_name = "posts"
    paginate_by = 10

    def get_queryset(self):
        return Post.objects.filter(status=Post.Status.PUBLISHED).order_by("-created_at")


# --- CBV: yaratish, faqat login qilganlar uchun ---
class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ["title", "slug", "body", "category", "status"]
    template_name = "blog/post_form.html"

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)
```

Bu misolda ko'rish sonini oshirish kabi maxsus mantiq FBV orqali, standart ro'yxat va yaratish esa CBV orqali amalga oshirilgan — ikkalasi ham o'z o'rnida ishlatilgan.

## Keng tarqalgan xatolar

**Xato 1:** CBV'da `context_object_name` ko'rsatmasdan, shablonda noto'g'ri o'zgaruvchi nomi ishlatish.
❌ `ListView`ning standart nomi `object_list` (yoki `<model_nomi_kichik>_list`, ya'ni `post_list`), lekin shablonda `{% for post in posts %}` deb yozib qo'yilsa, ro'yxat bo'sh ko'rinadi.
✅ To'g'ri: yo `context_object_name = "posts"` deb aniq belgilang, yo shablonda standart nomdan (`post_list` yoki `object_list`) foydalaning.

**Xato 2:** `CreateView`da `form_valid()`ni override qilganda, `super().form_valid(form)`ni chaqirishni unutish.
❌ `def form_valid(self, form): form.instance.author = self.request.user` — bu yerda `return super().form_valid(form)` yo'q, natijada forma hech qachon saqlanmaydi va sahifa "jim" qoladi (na xato, na muvaffaqiyat).
✅ To'g'ri: har doim metod oxirida `return super().form_valid(form)` chaqiring — bu ota klassning "saqlash va redirect qilish" mantig'ini ishga tushiradi.

**Xato 3:** `LoginRequiredMixin`ni noto'g'ri tartibda yozish.
❌ `class PostCreateView(CreateView, LoginRequiredMixin):` — Python'ning Method Resolution Order (MRO) qoidalariga ko'ra, mixin **har doim** asosiy klassdan **oldin** yozilishi kerak, aks holda login tekshiruvi kutilganidek ishlamasligi mumkin.
✅ To'g'ri: `class PostCreateView(LoginRequiredMixin, CreateView):` — mixinlar chapdan, asosiy generic view klassi eng oxirida.

## Mashq/topshiriq

**(Oson)** `Book` modeli uchun FBV orqali `book_list` view yozing — barcha kitoblarni `render()` orqali shablonga uzating.

**(O'rtacha)** Xuddi shu vazifani `ListView` orqali `BookListView` klassi sifatida qayta yozing, `paginate_by = 5` qo'shing va `context_object_name = "books"` belgilang.

**(Qiyin)** `BookCreateView` (`LoginRequiredMixin` bilan) yarating — foydalanuvchi kitob qo'shganda, `Book`ning `added_by` (`ForeignKey` — foydalanuvchiga) maydoni avtomatik joriy foydalanuvchiga o'rnatilsin. Bundan tashqari, FBV orqali `top_rated_books` nomli maxsus view yozing — bu `Review` modelidagi o'rtacha bahoga ko'ra eng yuqori 5 ta kitobni ko'rsatsin (`annotate` va `Avg` ishlatib — bu 13-darsda batafsil o'rganiladi, hozircha oddiy `order_by` bilan cheklansangiz ham bo'ladi).

<details>
<summary>Javoblarni ko'rish</summary>

1. `def book_list(request): books = Book.objects.all(); return render(request, "books/book_list.html", {"books": books})`.
2. `class BookListView(ListView): model = Book; context_object_name = "books"; paginate_by = 5; template_name = "books/book_list.html"`.
3. `BookCreateView`da `form_valid`: `form.instance.added_by = self.request.user; return super().form_valid(form)`; `top_rated_books` FBV'da: `books = Book.objects.order_by("-price")[:5]` (yoki agar `Review` bilan `annotate(avg_rating=Avg("review__rating"))` ishlatilsa, `order_by("-avg_rating")[:5]`) — asosiysi FBV va CBV'ning ikkalasi ham to'g'ri, mos joyda ishlatilgani muhim.

</details>

## Qisqacha xulosa

Django ikkita view uslubini taqdim etadi: **FBV** — oddiy Python funksiyasi, maxsus va bir martalik mantiq uchun qulay; **CBV** — Django'ning tayyor `ListView`, `DetailView`, `CreateView`, `UpdateView`, `DeleteView` klasslari orqali standart CRUD operatsiyalarini minimal kod bilan beradi, `get_queryset()` va `form_valid()` kabi metodlarni override qilib xatti-harakatini moslashtirish mumkin; amaliyotda ikkalasi ko'pincha bitta loyihada, har biri o'z kuchli tomoni bilan, birgalikda ishlatiladi.
