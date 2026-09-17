# Django sozlamalari va modellar (botning "miyasi")

## Bu darsda nimalarni o'rganasiz

- Bot loyihasi uchun `.env` va `settings.py`ni to'g'ri sozlay olasiz
- `BOT_TOKEN`ni Django sozlamalari orqali xavfsiz saqlay olasiz
- Bot uchun asosiy modellarni (`TelegramUser`, `Product`, `Order`) to'g'ri loyihalay olasiz
- `telegram_id` uchun nega `BigIntegerField` kerakligini tushuntira olasiz

## Nazariy qism

### .env va settings.py — bot uchun

3-darsda o'rgangan `.env` yondashuvi bu yerda ham qo'llaniladi, faqat endi yana bitta maxfiy qiymat — **bot tokeni** qo'shiladi:

```
DEBUG=True
SECRET_KEY=juda-uzun-tasodifiy-maxfiy-satr
ALLOWED_HOSTS=localhost,127.0.0.1
BOT_TOKEN=123456789:AAExampleTelegramBotTokenHere

DATABASE_URL=postgres://botuser:botpassword@localhost:5432/botdb
```

```python
# config/settings.py
from pathlib import Path
import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])

BOT_TOKEN = env("BOT_TOKEN")   # Aiogram shu yerdan tokenni oladi (21-darsda, loader.py)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "apps.shop",
    "apps.bot",     # management command'ni topishi uchun Django app sifatida ro'yxatda bo'lishi SHART
]

DATABASES = {
    "default": env.db("DATABASE_URL")
}
```

`BOT_TOKEN`ni `settings.py` orqali saqlash — Telegram tokenini ham `SECRET_KEY` kabi **bir joyda**, `.env`da jamlab, kod ichida hech qayerda qattiq yozilmasligini ta'minlaydi.

> ⚠️ `apps.bot`ni `INSTALLED_APPS`ga qo'shishni unutmang — aks holda Django uning ichidagi `management/commands/runbot.py`ni **topa olmaydi** va 25-darsda `python manage.py runbot` "Unknown command" xatosini beradi (19-darsdagi mashqda ko'rgan xatoning aynan sababi shu).

### Modellar — botning "miyasi"

Bot uchun uchta asosiy model kerak: foydalanuvchi, mahsulot, buyurtma.

```python
# apps/shop/models.py
from django.db import models


class TelegramUser(models.Model):
    telegram_id = models.BigIntegerField(unique=True)
    full_name = models.CharField(max_length=150)
    username = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.telegram_id})"


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "Yangi"
        CONFIRMED = "confirmed", "Tasdiqlangan"
        CANCELLED = "cancelled", "Bekor qilingan"

    user = models.ForeignKey(TelegramUser, on_delete=models.CASCADE, related_name="orders")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="orders")
    quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Buyurtma #{self.pk} — {self.product.name}"
```

Bu modellar 4-darsda o'rgangan bilimga to'liq mos: `ForeignKey` (`Order.user`, `Order.product`), `TextChoices` (7-darsdagi `Post.Status`ga o'xshash), `DecimalField` (pul uchun).

### Nega telegram_id uchun BigIntegerField

Bu — Telegram bot loyihalarida yangi boshlovchilar ko'p duch keladigan, lekin oson oldini olinadigan xato manbai: Telegram foydalanuvchi ID'lari (`user.id`) ba'zan **2 milliarddan** (oddiy `IntegerField`ning maksimal sig'imi, ~2.1 milliard) katta bo'lishi mumkin — ayniqsa yangi, katta ID'li akkauntlarda. Agar oddiy `IntegerField` ishlatilsa, katta ID'li foydalanuvchi botga yozganda, Django DB darajasida xatolik beradi (`IntegerFieldOverflow` yoki shunga o'xshash).

`BigIntegerField` esa ancha katta diapazonni (~9.2 kvintillion) qamrab oladi — Telegram ID'lari uchun bu yetarlicha xavfsiz chegara. **Qoida:** har qanday Telegram bot loyihasida, foydalanuvchi yoki chat ID'sini saqlaydigan har bir maydon uchun har doim `BigIntegerField` ishlatilsin, `IntegerField` emas.

## Amaliy misol

To'liq sozlash va model yaratish, birinchi migratsiyagacha:

```bash
# .env fayli
cat > .env << 'EOF'
DEBUG=True
SECRET_KEY=x8k2mq9p-tasodifiy-satr-shu-yerga
ALLOWED_HOSTS=localhost,127.0.0.1
BOT_TOKEN=123456789:AAHaqiqiy_bot_tokeningiz_shu_yerga
DATABASE_URL=postgres://botuser:botpassword@localhost:5432/botdb
EOF
```

`config/settings.py`ga yuqoridagi to'liq sozlamalarni yozgach, `apps/shop/models.py`ga uchala modelni kiritamiz. Shell orqali sinab ko'rish (migratsiyalardan keyin, 21-darsda):

```python
python manage.py shell
```
```python
>>> from apps.shop.models import TelegramUser, Product

# Telegram'dagi haqiqiy katta ID bilan sinov
>>> u = TelegramUser.objects.create(telegram_id=5473829104829, full_name="Aziz Karimov")
>>> u.telegram_id
5473829104829    # BigIntegerField bo'lgani uchun muammosiz saqlanadi

>>> p = Product.objects.create(name="Noutbuk", price=4500000.00)
>>> p
<Product: Noutbuk>
```

## Keng tarqalgan xatolar

**Xato 1:** `telegram_id`ni oddiy `IntegerField` bilan yaratish.
❌ Aksariyat test paytida (kichik ID'li shaxsiy akkaunt bilan) hech qanday muammo ko'rinmaydi, lekin production'da katta ID'li foydalanuvchi botga yozganda, ma'lumotlar bazasi darajasida xatolik yuz beradi.
✅ To'g'ri: Telegram ID'lari uchun har doim, istisnosiz, `BigIntegerField` ishlating — bu keyinchalik qidirilishi qiyin bo'lgan production xatosining oldini oladi.

**Xato 2:** `BOT_TOKEN`ni `.env` o'rniga to'g'ridan-to'g'ri `apps/bot/loader.py` ichiga yozib qo'yish.
❌ Bot tokeni kod bilan birga Git'ga tushib qoladi — agar repozitoriya biror joyda ochiq bo'lib qolsa (yoki hatto xususiy repozitoriyada ham, jamoa a'zolari cheklanmagan holda ko'rishi mumkin), token o'g'irlanib, bot begona odam tomonidan boshqarilishi mumkin.
✅ To'g'ri: token har doim `.env`da, `settings.BOT_TOKEN` orqali o'qiladi — xuddi `SECRET_KEY` kabi.

**Xato 3:** `apps.bot`ni `INSTALLED_APPS`ga qo'shishni keyinga qoldirish ("hozircha kerak emas, keyin qo'shaman" deb).
❌ Loyiha davomida bu qadam unutilib qoladi, va 25-darsda `runbot` buyrug'i yozilgach, u umuman ishlamaydi — sabab qidirib, orqaga qaytish kerak bo'ladi.
✅ To'g'ri: har ikkala app'ni (`apps.shop`, `apps.bot`) hali ularning ichi bo'sh bo'lsa ham, darhol `INSTALLED_APPS`ga qo'shib qo'ying — bu odatni shu darsdanoq shakllantiring.

## Mashq/topshiriq

**(Oson)** Shu darsdagi uchta modelni (`TelegramUser`, `Product`, `Order`) o'z loyihangizga kiriting, `.env`ni to'ldiring va `settings.py`ni sozlang.

**(O'rtacha)** `Order` modeliga `total_price` nomli `DecimalField` (hisoblab chiqiladigan umumiy narx) qo'shishni o'ylab ko'ring — buni modelning `save()` metodini override qilib (`self.total_price = self.product.price * self.quantity`) avtomatlashtiring.

**(Qiyin)** `Product` modeliga `category` nomli yangi `Category` modelini (`ForeignKey` orqali) qo'shing. `TelegramUser`ga esa `language` (til, masalan `"uz"`/`"ru"`/`"en"`, standart qiymati `"uz"`) maydonini qo'shing — bu bot ko'p tilli bo'lishi kerak bo'lganda foydali bo'ladi. Nega bunday moslashuvchanlikni loyihaning **boshida** rejalashtirish, keyinroq qo'shishdan osonroq ekanini tushuntirib bering.

<details>
<summary>Javoblarni ko'rish</summary>

1. Modellar to'g'ri nusxalangan, `.env`da barcha 5 ta o'zgaruvchi (`DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`, `BOT_TOKEN`, `DATABASE_URL`) to'ldirilgan bo'lishi kerak.
2. `def save(self, *args, **kwargs): self.total_price = self.product.price * self.quantity; super().save(*args, **kwargs)` — lekin diqqat: bu yerda `self.product`ga murojaat qilish uchun `product_id` allaqachon o'rnatilgan bo'lishi kerak (ya'ni obyekt to'liq shakllangan bo'lishi kerak).
3. `Category(models.Model): name = models.CharField(max_length=100)`; `Product.category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)`; `TelegramUser.language = models.CharField(max_length=2, default="uz")`. Bunday moslashuvchanlikni boshida rejalashtirish osonroq, chunki hali DB'da ma'lumot yo'q — yangi maydon qo'shish oddiy migratsiya; agar bu keyinroq, minglab foydalanuvchi va buyurtma bilan qo'shilsa, mavjud ma'lumotlarga standart qiymat berish, va kodning har joyida yangi maydonni hisobga olish kerak bo'ladi — bu ancha xavfli va murakkab jarayon.

</details>

## Qisqacha xulosa

Bot loyihasida `.env`/`settings.py` sozlash 3-darsdagi bilimga to'liq mos, faqat qo'shimcha `BOT_TOKEN` o'zgaruvchisi qo'shiladi — bu ham `SECRET_KEY` kabi hech qachon kod ichiga yozilmasligi kerak; botning "miyasi" — `TelegramUser`, `Product`, `Order` modellari 4-darsdagi bilim asosida quriladi, va bitta muhim, botlarga xos qoida bor: Telegram foydalanuvchi/chat ID'lari uchun har doim `BigIntegerField` ishlatilishi shart, chunki bu qiymatlar oddiy `IntegerField` sig'imidan katta bo'lishi mumkin.
