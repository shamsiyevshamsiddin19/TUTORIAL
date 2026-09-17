# Templates — shablon tizimi

## Bu darsda nimalarni o'rganasiz

- `{% extends %}` va `{% block %}` orqali shablon merosxo'rligini qura olasiz
- Eng ko'p ishlatiladigan template tag va filterlarni to'g'ri qo'llay olasiz
- Django'ning avtomatik HTML-escaping mexanizmini tushuntira olasiz
- O'zingizning custom template filter'ingizni yoza olasiz

## Nazariy qism

### Template — Python bilan HTML orasidagi ko'prik

Template — HTML fayl bo'lib, ichida maxsus Django sintaksisi (`{{ }}` — o'zgaruvchi chiqarish, `{% %}` — mantiqiy buyruq) mavjud. View bu shablonga ma'lumot (kontekst) uzatadi, Django esa uni haqiqiy HTML'ga "render" qiladi.

### Shablon merosxo'rligi — base.html

Har bir sahifa uchun `<html>`, `<head>`, navigatsiya menyusini qayta yozish o'rniga, bitta "asosiy" shablon yaratib, qolganlari undan meros oladi:

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <title>{% block title %}Mening saytim{% endblock %}</title>
    {% load static %}
    <link rel="stylesheet" href="{% static 'css/style.css' %}">
</head>
<body>
    <nav>
        {% if user.is_authenticated %}
            Salom, {{ user.username }}! <a href="{% url 'logout' %}">Chiqish</a>
        {% else %}
            <a href="{% url 'login' %}">Kirish</a>
        {% endif %}
    </nav>

    {% for message in messages %}
        <div class="alert">{{ message }}</div>
    {% endfor %}

    {% block content %}{% endblock %}
</body>
</html>
```

`{% block %}` — "bu yerga bola shablon o'z mazmunini qo'yishi mumkin" degan belgi. Bola shablon:

```html
<!-- apps/blog/templates/blog/post_list.html -->
{% extends "base.html" %}

{% block title %}Barcha maqolalar{% endblock %}

{% block content %}
    <h1>Maqolalar</h1>
    {% for post in posts %}
        <article>
            <h2><a href="{{ post.get_absolute_url }}">{{ post.title }}</a></h2>
            <p>{{ post.body|truncatewords:30 }}</p>
            <small>{{ post.created_at|date:"d-M, Y" }} | {{ post.author.username }}</small>
        </article>
    {% empty %}
        <p>Hozircha maqolalar yo'q.</p>
    {% endfor %}
{% endblock %}
```

`{% extends %}` — **har doim faylning birinchi qatorida** bo'lishi shart. `{% empty %}` — `{% for %}` sikli hech narsani aylanmasa (ro'yxat bo'sh bo'lsa) ko'rsatiladigan qism, alohida `{% if %}` yozishga hojat qoldirmaydi.

### Eng ko'p ishlatiladigan tag va filterlar

| Belgi | Vazifasi |
|---|---|
| `{% extends %}` / `{% block %}` | Shablon merosxo'rligi |
| `{% if %}` / `{% elif %}` / `{% else %}` | Shart |
| `{% for %}` / `{% empty %}` | Sikl va bo'sh holat |
| `{% url 'name' %}` | Nom orqali URL generatsiya qilish |
| `{% static 'path' %}` | Static faylga havola (avval `{% load static %}` kerak) |
| `{{ value\|date:"d-m-Y" }}` | Sana formatlash |
| `{{ value\|truncatewords:20 }}` | Matnni N so'zgacha qisqartirish |
| `{{ value\|default:"—" }}` | Bo'sh bo'lsa standart qiymat ko'rsatish |
| `{{ value\|linebreaks }}` | Matndagi qator ko'chirishlarni `<p>`/`<br>`ga aylantirish |
| `{{ value\|length }}` | Ro'yxat/matn uzunligi |

### Avtomatik HTML-escaping — xavfsizlik birinchi navbatda

Django `{{ value }}` chiqarganda, standart holda **avtomatik escaping** qiladi — ya'ni agar `value` ichida `<script>alert('xato')</script>` kabi HTML/JS bo'lsa, u brauzerda bajariladigan kod sifatida emas, oddiy matn sifatida ko'rsatiladi. Bu — **XSS (Cross-Site Scripting)** hujumlaridan himoyalanishning asosiy mexanizmi.

Agar (kamdan-kam holatlarda, o'zingiz nazorat qiladigan, ishonchli manbadan kelgan) HTML'ni **qasddan** xom holda chiqarish kerak bo'lsa:

```html
{{ trusted_html|safe }}
```

> ⚠️ `|safe` filterini **hech qachon** foydalanuvchi kiritgan matnga qo'llamang — bu XSS teshigini ochib qo'yadi.

### Custom template filter yaratish

Django o'zining tayyor filterlaridan tashqari, loyihangizga xos filterlar yozish imkonini beradi:

```python
# apps/blog/templatetags/blog_extras.py
from django import template
register = template.Library()

@register.filter
def reading_time(text):
    words = len(text.split())
    return f"{max(1, words // 200)} daqiqa o'qish"
```

Shablonda ishlatish:

```html
{% load blog_extras %}
{{ post.body|reading_time }}
```

> 📌 Custom filter fayli har doim `<app>/templatetags/` papkasida bo'lishi va shu papkada bo'sh `__init__.py` fayli bo'lishi shart, aks holda Django uni topolmaydi.

## Amaliy misol

To'liq post tafsilot sahifasi — merosxo'rlik, filterlar va xavfsizlik birga:

```html
<!-- apps/blog/templates/blog/post_detail.html -->
{% extends "base.html" %}
{% load blog_extras %}

{% block title %}{{ post.title }}{% endblock %}

{% block content %}
    <article>
        <h1>{{ post.title }}</h1>
        <p class="meta">
            {{ post.author.username|default:"Noma'lum muallif" }} —
            {{ post.created_at|date:"d.m.Y" }} —
            {{ post.body|reading_time }}
        </p>

        {{ post.body|linebreaks }}

        <div class="tags">
            {% for tag in post.tags.all %}
                <span class="tag">#{{ tag.name }}</span>
            {% empty %}
                <span>Teglar yo'q</span>
            {% endfor %}
        </div>

        {% if post.author == user %}
            <a href="{% url 'blog:post_update' post.slug %}">Tahrirlash</a>
            <a href="{% url 'blog:post_delete' post.slug %}">O'chirish</a>
        {% endif %}
    </article>
{% endblock %}
```

Bu shablon `base.html`dan navigatsiya va umumiy tuzilmani meros oladi, `reading_time` custom filteri orqali o'qish vaqtini hisoblaydi, `|default` orqali muallif bo'lmasa fallback ko'rsatadi, va `{% if post.author == user %}` orqali faqat muallifning o'ziga tahrirlash havolasini ko'rsatadi.

## Keng tarqalgan xatolar

**Xato 1:** `{% extends %}`ni faylning birinchi qatoridan boshqa joyga yozish.
❌ Agar `{% extends "base.html" %}`dan oldin bironta belgi (hatto bo'sh qator emas, izoh yoki matn) bo'lsa, Django `TemplateSyntaxError` beradi.
✅ To'g'ri: `{% extends %}` har doim faylning **eng birinchi** qatori bo'lishi kerak, undan oldin hech narsa (hatto HTML kommentariyasi ham) bo'lmasin.

**Xato 2:** `{% static %}` ishlatib, lekin `{% load static %}`ni unutish.
❌ `<link href="{% static 'css/style.css' %}">` — agar faylning boshida `{% load static %}` bo'lmasa, Django bu tagni tanimaydi va xato beradi.
✅ To'g'ri: `{% static %}`, `{% load blog_extras %}` kabi maxsus teg to'plamlarini ishlatishdan oldin, faylning yuqori qismida tegishli `{% load %}` buyrug'ini yozing.

**Xato 3:** foydalanuvchi kiritgan matnga `|safe` filterini beparvo qo'llash.
❌ Foydalanuvchi izoh (`comment.body`) yozganda, agar u ichiga `<script>` kiritsa va shablon `{{ comment.body|safe }}` ishlatsa, bu skript boshqa foydalanuvchilar brauzerida ishga tushadi (XSS hujumi).
✅ To'g'ri: foydalanuvchi kiritgan matnni hech qachon `|safe` bilan chiqarmang — Django'ning standart avtomatik escaping mexanizmiga ishoning, u sizni himoya qiladi.

## Mashq/topshiriq

**(Oson)** `base.html` yarating (sarlavha, oddiy navigatsiya bilan), va `book_list.html`ni undan meros qildirib, `{% block content %}` ichida kitoblar ro'yxatini `{% for %}` orqali chiqaring.

**(O'rtacha)** `book_list.html`da har bir kitob narxini `{{ book.price|floatformat:2 }}` (ikki xonali kasr) formatida, qo'shilgan sanasini `{{ book.created_at|date:"d-M, Y" }}` formatida ko'rsating. Agar kitob tavsifi bo'sh bo'lsa, `{{ book.description|default:"Tavsif yo'q" }}` orqali fallback matn ko'rsating.

**(Qiyin)** `discount_price` nomli custom template filter yozing — bu berilgan narx va foiz chegirmasini (`{{ book.price|discount_price:20 }}` — 20% chegirma) qabul qilib, yangi narxni hisoblab qaytarsin. Uni `book_detail.html` shablonida qo'llang va nega bu hisoblashni Python (`models.py` yoki `views.py`) ichida emas, aynan shablon filterida qilish o'rinli (yoki noo'rin) ekanini bir gapda muhokama qiling.

<details>
<summary>Javoblarni ko'rish</summary>

1. `base.html`da `{% block content %}{% endblock %}`, `book_list.html`da `{% extends "base.html" %}` va `{% block content %}{% for book in books %}<p>{{ book.title }}</p>{% endfor %}{% endblock %}`.
2. `{{ book.price|floatformat:2 }}` → masalan `"49.90"`; `{{ book.created_at|date:"d-M, Y" }}` → `"15-Yan, 2026"`; `{{ book.description|default:"Tavsif yo'q" }}` — tavsif bo'sh bo'lsa shu matn chiqadi.
3. `@register.filter def discount_price(price, percent): return round(float(price) * (1 - float(percent) / 100), 2)`. Muhokama: sof ko'rsatish uchun hisoblash (masalan, faqat ko'rsatilayotgan chegirma) shablon filterida qulay, lekin agar bu qiymat DB'ga saqlanishi yoki boshqa hisob-kitoblarda ishlatilishi kerak bo'lsa, buni `models.py` yoki `views.py`da hisoblash to'g'riroq — shablon faqat **ko'rsatish** uchun, biznes mantiq uchun emas.

</details>

## Qisqacha xulosa

Django shablon tizimi `{% extends %}`/`{% block %}` orqali umumiy HTML tuzilmani (navigatsiya, sarlavha) bitta `base.html`da saqlab, har bir sahifaga faqat farqli qismini yozish imkonini beradi; `{{ value|filter }}` sintaksisi orqali matnni formatlash (sana, uzunlik, standart qiymat) mumkin, va Django standart holda **avtomatik HTML-escaping** qiladi — bu XSS hujumlaridan himoya qiladi, shu sababli `|safe` filteri faqat to'liq ishonch bo'lgan holatlarda, hech qachon foydalanuvchi kiritgan matnga qo'llanilmasligi kerak.
