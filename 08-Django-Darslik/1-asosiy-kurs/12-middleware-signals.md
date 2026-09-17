# Middleware va Signals

## Bu darsda nimalarni o'rganasiz

- Middleware qanday ishlashini va so'rov/javob "qatlamlari" tushunchasini tushuntira olasiz
- O'zingizning custom middleware'ingizni yoza olasiz
- Signal orqali bir hodisaga bog'liq boshqa kodni avtomatik ishga tushira olasiz
- Signal ishlatish o'rinli va o'rinsiz bo'lgan holatlarni farqlay olasiz

## Nazariy qism

### Middleware — har bir so'rov o'tadigan "qatlamlar"

Middleware — har bir HTTP so'rovi va javobi Django ichida o'tadigan "qatlamlar zanjiri". Autentifikatsiya, sessiya, xavfsizlik — bularning barchasi aslida middleware orqali ishlaydi, siz ularni `settings.py`dagi `MIDDLEWARE` ro'yxatida ko'rasiz:

```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
```

O'zingizning middleware'ingizni yozish — masalan, har bir so'rov qancha vaqt olganini o'lchash uchun:

```python
# apps/core/middleware.py
import time
import logging

logger = logging.getLogger(__name__)

class RequestTimeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response   # bu — faqat BIR MARTA, server ishga tushganda chaqiriladi

    def __call__(self, request):
        start = time.time()
        response = self.get_response(request)   # keyingi middleware yoki view shu yerda chaqiriladi
        duration = time.time() - start
        logger.info(f"{request.path} — {duration:.3f}s")
        return response
```

`settings.py`da ro'yxatga qo'shish:

```python
MIDDLEWARE = [
    ...
    "apps.core.middleware.RequestTimeMiddleware",
]
```

### Tartib nima uchun muhim

Middleware **ro'yxatdagi tartib bo'yicha** ishlaydi: so'rov ro'yxat **yuqoridan pastga**, javob esa **pastdan yuqoriga** qarab o'tadi:

```
So'rov:  SecurityMiddleware → SessionMiddleware → ... → View
Javob:   View → ... → SessionMiddleware → SecurityMiddleware
```

Shuning uchun, masalan, `AuthenticationMiddleware` (foydalanuvchini aniqlaydi) `SessionMiddleware`dan (sessiyani o'qiydi) **keyin** turishi shart — aks holda hali sessiya o'qilmagan bo'lib, foydalanuvchini aniqlab bo'lmaydi.

### Signal — hodisaga bog'liq avtomatik reaksiya

Signal — bir hodisa (masalan, obyekt saqlanishi) sodir bo'lganda, boshqa, bog'liq bo'lmagan kodni avtomatik ishga tushirish mexanizmi. Eng ko'p ishlatiladigani — `post_save`:

```python
# apps/users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Profile

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:   # faqat YANGI foydalanuvchi yaratilganda ishga tushadi
        Profile.objects.create(user=instance)
```

`created` — `True` bo'lsa obyekt **yangi** yaratilgan, `False` bo'lsa mavjud obyekt **yangilangan** degani. Signal'ni ro'yxatga olish uchun uni `apps.py`ning `ready()` metodida import qilish kerak:

```python
# apps/users/apps.py
from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.users"

    def ready(self):
        import apps.users.signals  # noqa
```

> ⚠️ Agar `signals.py`ni import qilish unutilsa, `@receiver` dekoratori hech qachon ro'yxatga olinmaydi, va signal **jimgina ishlamaydi** — hech qanday xato chiqmaydi, bu esa debug qilishni qiyinlashtiradi.

### Signal'larni qachon ishlatish, qachon ishlatmaslik

Signal'lar qulay ko'rinsa-da, ular kodni **"yashirin"** bog'laydi: `Post.objects.create(...)` chaqirilganda nima sodir bo'lishini bilish uchun, dasturchi `models.py`dan tashqari, alohida `signals.py` faylini ham qidirib topishi kerak bo'ladi. Shu sababli:

| Holat | Tavsiya |
|---|---|
| Bir nechta, bir-biriga bog'liq bo'lmagan app'lar bitta hodisaga reaksiya berishi kerak (masalan, foydalanuvchi yaratilganda ham profil, ham email yuborish) | Signal — mos yechim |
| Bitta, oddiy, doim bajariladigan qo'shimcha ish (masalan, `slug`ni avtomatik generatsiya qilish) | `save()` metodini override qilish — ko'proq tushunarli |
| Formani saqlashda aniq bitta joyda bajariladigan ish | `form_valid()` ichida to'g'ridan-to'g'ri yozish — eng tushunarli |

## Amaliy misol

Middleware va signal'ni birga ishlatuvchi kichik loyiha — so'rov vaqtini o'lchash va foydalanuvchi ro'yxatdan o'tganda xush kelibsiz email yuborish (haqiqiy yuborish o'rniga, hozircha faqat log yozish):

```python
# apps/core/middleware.py
import time
import logging

logger = logging.getLogger("core.performance")

class RequestTimeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.time()
        response = self.get_response(request)
        duration = time.time() - start
        if duration > 1.0:   # faqat sekin so'rovlarni logga yozish
            logger.warning(f"SEKIN SO'ROV: {request.path} — {duration:.3f}s")
        return response
```

```python
# apps/users/signals.py
import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

logger = logging.getLogger("users.signals")

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def send_welcome_notification(sender, instance, created, **kwargs):
    if created:
        logger.info(f"Yangi foydalanuvchi ro'yxatdan o'tdi: {instance.username} — xush kelibsiz xabari navbatga qo'yildi")
        # Haqiqiy loyihada bu yerda email yuborish yoki background task chaqirilardi
```

```python
# apps/users/apps.py
from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.users"

    def ready(self):
        import apps.users.signals  # noqa
```

Endi har bir sekin (1 soniyadan ortiq) so'rov avtomatik loglanadi, va har bir yangi foydalanuvchi ro'yxatdan o'tganda, `users` app'i buni "biladi" — hatto bu logikani chaqirgan kod (masalan, `SignUpView`) haqida hech narsa bilmasa ham.

## Keng tarqalgan xatolar

**Xato 1:** custom middleware'ni `MIDDLEWARE` ro'yxatiga qo'shishni unutish.
❌ `RequestTimeMiddleware` klassi yozilgan, lekin `settings.py`dagi `MIDDLEWARE` ro'yxatida yo'q — u hech qachon ishga tushmaydi, hech qanday xato ham chiqmaydi.
✅ To'g'ri: har bir yangi middleware yozilgach, darhol `MIDDLEWARE` ro'yxatiga (odatda oxiriga, agar boshqa maxsus talab bo'lmasa) qo'shing va tekshirib ko'ring.

**Xato 2:** `apps.py`ning `ready()` metodida signal faylini import qilishni unutish.
❌ `signals.py` fayli yozilgan, `@receiver` dekoratori bilan to'g'ri belgilangan, lekin hech qachon chaqirilmaydi — chunki Django bu faylni hech qachon o'zi avtomatik import qilmaydi.
✅ To'g'ri: har bir `signals.py` fayli yozilgandan so'ng, mos app'ning `apps.py`sida `ready()` metodini yozib, u yerda faylni import qiling — bu qadamsiz signal "o'lik kod" bo'lib qoladi.

**Xato 3:** murakkab biznes mantiqni signal ichiga yashirish.
❌ `post_save` signali ichida email yuborish, boshqa jadvalni yangilash, tashqi API'ga so'rov yuborish kabi bir nechta og'ir amal bajarilsa — kod nima uchun sekinlashayotgani yoki xato berayotgani qiyin topiladigan bo'lib qoladi, chunki bu mantiq `models.py`dan uzoqda, "yashirin" joyda.
✅ To'g'ri: signal'larni faqat oddiy, aniq va bitta maqsadli vazifalar uchun ishlating; murakkab jarayonlarni signal o'rniga aniq chaqiriladigan funksiya yoki background task (15-darsda ko'rasiz) sifatida yozing — bu kodni o'qishni ancha osonlashtiradi.

## Mashq/topshiriq

**(Oson)** `RequestCountMiddleware` nomli middleware yozing — bu har bir so'rovda oddiy Python o'zgaruvchisiga hisoblagichni bittaga oshirsin va konsolga chiqarsin (`print(f"So'rovlar soni: {count}")`).

**(O'rtacha)** `Book` modeliga `post_save` signali qo'shing — yangi kitob qo'shilganda (`created=True`), konsolga `"Yangi kitob qo'shildi: {kitob nomi}"` deb yozadigan signal yarating. Uni to'g'ri `apps.py`da ro'yxatga oling.

**(Qiyin)** `Order` modeli uchun `pre_save` signalini yozing — bu buyurtma holati `"cancelled"`ga o'zgarganda (eski qiymat bilan solishtirib), bog'liq mahsulotning `stock` (ombordagi soni) maydonini avtomatik oshirsin (bekor qilingan buyurtma miqdorini omborga qaytarish). Nega bu holatda signal o'rniga `save()` metodini override qilish ham mumkin bo'lishini, va ikkalasining farqini tushuntirib bering.

<details>
<summary>Javoblarni ko'rish</summary>

1. `class RequestCountMiddleware: def __init__(self, get_response): self.get_response = get_response; self.count = 0` va `__call__`da `self.count += 1; print(f"So'rovlar soni: {self.count}"); return self.get_response(request)`.
2. `@receiver(post_save, sender=Book)\ndef notify_new_book(sender, instance, created, **kwargs):\n    if created:\n        print(f"Yangi kitob qo'shildi: {instance.title}")` — bu `apps/books/signals.py`da, `BooksConfig.ready()`da import qilinadi.
3. `pre_save` ichida `if instance.pk: old = Order.objects.get(pk=instance.pk); if old.status != "cancelled" and instance.status == "cancelled": instance.product.stock += instance.quantity; instance.product.save()`. Farq: signal — bu mantiqni `Order` modelidan **tashqarida**, alohida saqlaydi (bir nechta app buni "eshitishi" mumkin), `save()`ni override qilish esa mantiqni modelning **o'zida**, ko'rinadigan joyda saqlaydi — agar faqat `Order` modelining o'zi bu ishni bajarishi kerak bo'lsa, `save()`ni override qilish ko'pincha tushunarliroq va tavsiya etiladi.

</details>

## Qisqacha xulosa

Middleware — har bir so'rov va javob o'tadigan, ro'yxatdagi tartib bo'yicha ishlaydigan "qatlamlar zanjiri" bo'lib, autentifikatsiya va xavfsizlikdan tortib, so'rov vaqtini o'lchashgacha bo'lgan umumiy vazifalar uchun ishlatiladi; Signal esa bir hodisaga (masalan, `post_save`) bog'liq, boshqa, mustaqil kodni avtomatik ishga tushirish imkonini beradi, lekin uni faqat oddiy va bitta maqsadli vazifalar uchun ishlatish tavsiya etiladi — murakkab biznes mantiqni signal ichiga yashirish kodni "yashirin" va debug qilish qiyin holga keltiradi, bunday hollarda `save()`ni override qilish yoki mantiqni aniq chaqiriladigan funksiyaga chiqarish afzalroq.
