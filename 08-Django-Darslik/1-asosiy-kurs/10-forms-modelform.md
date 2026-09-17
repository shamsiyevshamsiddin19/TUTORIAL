# Forms va ModelForm

## Bu darsda nimalarni o'rganasiz

- `ModelForm` orqali modelga bog'langan formani avtomatik yarata olasiz
- `clean_<field>()` metodi orqali maxsus validatsiya yoza olasiz
- FBV ichida forma ishlov berish jarayonini (GET/POST) to'g'ri tashkil qila olasiz
- CSRF himoyasining nima uchun kerakligini tushuntira olasiz

## Nazariy qism

### Forms vs ModelForm

Django ikkita forma turini beradi: oddiy `forms.Form` (modelga bog'liq bo'lmagan, masalan qidiruv yoki aloqa formasi uchun) va `forms.ModelForm` (to'g'ridan-to'g'ri modelga bog'langan, uning maydonlaridan avtomatik forma yasaydigan). Ko'p hollarda, model asosida ma'lumot kiritish kerak bo'lganda, `ModelForm` ancha kam kod talab qiladi.

```python
# apps/blog/forms.py
from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["title", "slug", "body", "category", "tags", "status"]
        widgets = {
            "body": forms.Textarea(attrs={"rows": 10, "class": "form-control"}),
        }

    def clean_title(self):
        title = self.cleaned_data["title"]
        if len(title) < 5:
            raise forms.ValidationError("Sarlavha kamida 5 ta belgidan iborat bo'lishi kerak.")
        return title
```

`Meta.model` — qaysi modelga bog'lanishini, `Meta.fields` — qaysi maydonlar formada ko'rsatilishini belgilaydi. `widgets` — HTML'dagi kirish elementi turini (masalan, oddiy input o'rniga ko'p qatorli `textarea`) sozlaydi.

### clean_<field>() — bitta maydonni tekshirish

`clean_<maydon_nomi>()` metodi — shu maydon uchun **maxsus** validatsiya qoidasini yozish imkonini beradi. Django avtomatik ravishda har bir shunday nomlangan metodni chaqiradi, agar maydon standart validatsiyadan (masalan, `max_length`) muvaffaqiyatli o'tgan bo'lsa. Agar shart bajarilmasa, `forms.ValidationError` chaqirib xato xabarini ko'rsatasiz; aks holda tozalangan qiymatni **qaytarishni unutmang** — bu keyingi ishlov berish uchun zarur.

### FBV ichida forma bilan ishlash — GET/POST zanjiri

```python
from django.shortcuts import render, redirect
from .forms import PostForm

def post_create(request):
    if request.method == "POST":
        form = PostForm(request.POST, request.FILES)   # request.FILES — fayl yuklash bo'lsa kerak
        if form.is_valid():
            post = form.save(commit=False)   # hali DB'ga yozilmagan obyekt
            post.author = request.user       # qo'shimcha maydonni qo'lda to'ldirish
            post.save()
            form.save_m2m()                  # ManyToMany maydonlarni saqlash (commit=False bo'lganda SHART)
            return redirect(post.get_absolute_url())
    else:
        form = PostForm()   # GET so'rovida — bo'sh forma
    return render(request, "blog/post_form.html", {"form": form})
```

Bu klassik naqsh: **GET** so'rovida — bo'sh (yoki tahrirlash uchun mavjud ma'lumot bilan to'ldirilgan) forma ko'rsatiladi; **POST** so'rovida — kiritilgan ma'lumot tekshiriladi (`is_valid()`), to'g'ri bo'lsa saqlanadi va boshqa sahifaga yo'naltiriladi, noto'g'ri bo'lsa — xatolar bilan birga forma **qayta** ko'rsatiladi (avtomatik, chunki `render()` baribir chaqiriladi).

`commit=False` — obyektni hali DB'ga saqlamasdan, avval qo'shimcha maydon (`author`) to'ldirish kerak bo'lganda ishlatiladi. `form.save_m2m()` — `commit=False` ishlatilganda, `ManyToManyField` (masalan, `tags`) alohida saqlanishi kerakligi uchun **majburiy** qo'shimcha qadam.

### Shablonda forma chiqarish va CSRF

```html
<form method="post" enctype="multipart/form-data">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Saqlash</button>
</form>
```

`{% csrf_token %}` — har bir `POST` formada **majburiy**. Bu Django'ning **CSRF (Cross-Site Request Forgery)** hujumlaridan himoya mexanizmi: u har bir formaga yashirin, tasodifiy token qo'shadi, va server so'rov qabul qilganda shu tokenni tekshiradi. Agar token bo'lmasa yoki noto'g'ri bo'lsa, Django so'rovni rad etadi — bu boshqa saytdan yuborilgan, foydalanuvchi nomidan soxta so'rovlarning oldini oladi.

`enctype="multipart/form-data"` — agar formada fayl yuklash (`ImageField`, `FileField`) bo'lsa, **majburiy** qo'shiladi, aks holda fayl umuman yuborilmaydi.

## Amaliy misol

To'liq forma jarayoni — validatsiya, fayl yuklash va tahrirlashni birlashtirgan:

```python
# apps/blog/forms.py
from django import forms
from django.core.exceptions import ValidationError
from .models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["title", "slug", "body", "image", "category", "tags", "status"]
        widgets = {
            "body": forms.Textarea(attrs={"rows": 10}),
        }

    def clean_slug(self):
        slug = self.cleaned_data["slug"]
        qs = Post.objects.filter(slug=slug)
        if self.instance.pk:               # tahrirlash rejimida joriy obyektni tekshirishdan chiqarib tashlash
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise ValidationError("Bu slug allaqachon band. Boshqasini tanlang.")
        return slug

    def clean_image(self):
        image = self.cleaned_data.get("image")
        if image and image.size > 5 * 1024 * 1024:   # 5 MB
            raise ValidationError("Rasm hajmi 5 MB dan oshmasligi kerak.")
        return image
```

```python
# apps/blog/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .forms import PostForm
from .models import Post


@login_required
def post_create(request):
    if request.method == "POST":
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            form.save_m2m()
            return redirect(post.get_absolute_url())
    else:
        form = PostForm()
    return render(request, "blog/post_form.html", {"form": form, "title": "Yangi post"})


@login_required
def post_update(request, slug):
    post = get_object_or_404(Post, slug=slug, author=request.user)
    if request.method == "POST":
        form = PostForm(request.POST, request.FILES, instance=post)   # instance — mavjud obyektni tahrirlash
        if form.is_valid():
            form.save()
            return redirect(post.get_absolute_url())
    else:
        form = PostForm(instance=post)
    return render(request, "blog/post_form.html", {"form": form, "title": "Postni tahrirlash"})
```

`instance=post` — formani mavjud obyekt bilan "bog'lash": GET so'rovida uning joriy qiymatlari bilan to'ldirilgan forma ko'rsatiladi, POST'da esa saqlash yangi obyekt yaratish o'rniga aynan shu obyektni yangilaydi.

## Keng tarqalgan xatolar

**Xato 1:** shablonda `{% csrf_token %}`ni unutish.
❌ Forma yuborilganda Django `403 Forbidden` xatosini beradi: `CSRF verification failed`.
✅ To'g'ri: har bir `<form method="post">` ichida, `<button>`dan oldin, `{% csrf_token %}` yozishni odat qiling — buni hech qachon unutmang.

**Xato 2:** fayl yuklash bo'lsa, `enctype="multipart/form-data"`ni yoki `request.FILES`ni unutish.
❌ Forma HTML'da to'g'ri ko'rinadi, foydalanuvchi rasm tanlaydi, lekin serverga hech qanday fayl yetib bormaydi — `form.is_valid()` rasm maydonini bo'sh deb hisoblaydi.
✅ To'g'ri: fayl maydoni bo'lgan har bir formada ikkalasini ham unutmang: HTML'da `enctype="multipart/form-data"`, view'da `PostForm(request.POST, request.FILES)`.

**Xato 3:** `commit=False` ishlatib, `form.save_m2m()`ni chaqirmaslik.
❌ `post = form.save(commit=False); post.author = request.user; post.save()` — bu yerda `tags` kabi `ManyToManyField` qiymatlari **butunlay yo'qoladi**, chunki `commit=False` M2M saqlashni to'xtatib turadi, va uni qo'lda yakunlash unutilgan.
✅ To'g'ri: `commit=False` ishlatilgan har safar, asosiy obyekt `save()` qilingandan **keyin**, albatta `form.save_m2m()` ham chaqirilishi kerak.

## Mashq/topshiriq

**(Oson)** `Book` modeli uchun `BookForm(forms.ModelForm)` yarating — `title`, `author`, `price` maydonlari bilan. FBV orqali `book_create` view yozib, GET/POST zanjirini to'liq amalga oshiring.

**(O'rtacha)** `BookForm`ga `clean_price()` qo'shing — narx `0` dan katta bo'lishi shartligini tekshiring, aks holda `ValidationError` chiqaring. Formani shablonda `{{ form.as_p }}` orqali chiqarib, CSRF himoyasi bilan to'liq ishlaydigan holga keltiring.

**(Qiyin)** `book_update` view yozing (`instance=book` bilan) va uni `book_create`dagi kod bilan solishtirib, ular orasidagi **aynan bitta** farqni (forma qanday yaratilishi) ko'rsating. Bundan tashqari, `BookForm`ga `clean_isbn()` qo'shib, ISBN raqami noyob (`unique`) ekanligini, lekin **tahrirlash rejimida joriy kitobning o'zini istisno qilib** tekshiring (4-darsdagi `clean_slug()` namunasidagi kabi).

<details>
<summary>Javoblarni ko'rish</summary>

1. `class BookForm(forms.ModelForm): class Meta: model = Book; fields = ["title", "author", "price"]`; `book_create` view — `PostForm` namunasidagi GET/POST zanjirining aynan o'zi, faqat `Book`/`BookForm` bilan.
2. `def clean_price(self): price = self.cleaned_data["price"]; if price <= 0: raise ValidationError("Narx musbat bo'lishi kerak."); return price`.
3. Yagona farq: `book_create`da `form = BookForm()` (bo'sh), `book_update`da `form = BookForm(instance=book)` (mavjud ma'lumot bilan to'ldirilgan) — qolgan barcha kod bir xil qoladi. `clean_isbn`: `qs = Book.objects.filter(isbn=isbn); if self.instance.pk: qs = qs.exclude(pk=self.instance.pk); if qs.exists(): raise ValidationError(...)`.

</details>

## Qisqacha xulosa

`ModelForm` — modelning maydonlaridan avtomatik HTML forma yasaydi, `clean_<field>()` metodlari orqali har bir maydonga maxsus validatsiya qoidasi qo'shish mumkin; FBV ichida forma bilan ishlash klassik GET (bo'sh/mavjud forma ko'rsatish) — POST (`is_valid()` tekshirish, saqlash, yo'naltirish) zanjiriga amal qiladi, `commit=False` + `form.save_m2m()` qo'shimcha maydon to'ldirish va ManyToMany saqlashni to'g'ri tartiblaydi, `instance=obj` esa yaratish o'rniga tahrirlash rejimiga o'tkazadi — va har bir `POST` formada `{% csrf_token %}` CSRF hujumlaridan himoya qiluvchi majburiy element hisoblanadi.
