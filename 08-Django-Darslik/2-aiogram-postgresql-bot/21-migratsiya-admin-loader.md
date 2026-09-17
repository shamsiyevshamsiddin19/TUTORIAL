# Migratsiyalar, admin panel va botni Django bilan bog'lash

## Bu darsda nimalarni o'rganasiz

- Bot modellari uchun migratsiya va admin panelni sozlay olasiz
- Admin panel orqali qo'shilgan tovar bot tomonidan qanday "ko'rinishini" tushuntira olasiz
- Aiogram `Bot` va `Dispatcher` obyektlarini Django sozlamalariga bog'lab yarata olasiz
- Nega bot faylini `manage.py` orqaligina ishga tushirish kerakligini tushuntira olasiz

## Nazariy qism

### Migratsiya va admin — 5 va 6-darslardagi bilim, bot kontekstida

20-darsdagi uchta model uchun migratsiya va admin ro'yxatdan o'tkazish, avvalgi darslarda o'rgangan jarayonning aynan o'zi:

```bash
python manage.py makemigrations shop
python manage.py migrate
python manage.py createsuperuser
```

```python
# apps/shop/admin.py
from django.contrib import admin
from .models import TelegramUser, Product, Order


@admin.register(TelegramUser)
class TelegramUserAdmin(admin.ModelAdmin):
    list_display = ("full_name", "telegram_id", "username", "created_at")
    search_fields = ("full_name", "username", "telegram_id")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "quantity", "status", "created_at")
    list_filter = ("status", "created_at")
    list_editable = ("status",)              # ro'yxatdan turib holatni o'zgartirish
    autocomplete_fields = ("user", "product")
```

`list_editable = ("status",)` — 6-darsda ko'rmagan yangi imkoniyat: bu ro'yxat sahifasining o'zida, alohida obyekt sahifasiga o'tmasdan, `status` maydonini to'g'ridan-to'g'ri o'zgartirish imkonini beradi — bir nechta buyurtmani tezda "Tasdiqlangan" qilish kerak bo'lganda juda qulay.

Endi `python manage.py runserver` bilan `/admin/`ga kirib, tovar qo'shishingiz mumkin — bu tovarlar bir zumda botda ko'rina boshlaydi, **chunki ikkalasi ham bitta PostgreSQL'dan o'qiydi**. Bu — ushbu bo'limning butun arxitekturasining amaliy natijasi: admin panelda tovar qo'shish uchun botga alohida kod yozish shart emas.

### loader.py — Bot va Dispatcher obyektlarini yaratish

Aiogram'da har qanday botning yuragi — `Bot` (Telegram API bilan gaplashuvchi obyekt) va `Dispatcher` (kelayotgan xabarlarni handlerlarga taqsimlovchi obyekt). Bu ikkisini alohida faylda yaratamiz va tokenni **Django sozlamalaridan** olamiz:

```python
# apps/bot/loader.py
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from django.conf import settings

bot = Bot(token=settings.BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher(storage=MemoryStorage())
```

`DefaultBotProperties(parse_mode=ParseMode.HTML)` — botning barcha xabarlarida standart holda HTML formatlashni (`<b>qalin</b>`, `<i>qiyshiq</i>`) yoqadi, har bir xabarda alohida ko'rsatish shart emas. `MemoryStorage()` — FSM holatlarini (24-darsda ko'rasiz) xotirada saqlaydi; production'da (bot qayta ishga tushganda holatlar yo'qolmasligi kerak bo'lsa) `RedisStorage` kabi doimiy saqlash tanlanadi, lekin bu kurs doirasidan tashqarida.

### Nega bu faylni faqat manage.py orqali import qilish ishlaydi

`loader.py`da `settings.BOT_TOKEN`ga murojaat bor — bu esa Django sozlamalari **allaqachon yuklangan** bo'lishini talab qiladi. Oddiy `python apps/bot/loader.py` deb ishga tushirsangiz, Django hali "sozlanmagan" bo'ladi va `ImproperlyConfigured` xatosi chiqadi.

Buyruq `python manage.py <biror_buyruq>` orqali ishga tushirilganda esa, Django avtomatik ravishda `django.setup()`ni chaqiradi va barcha sozlamalarni, app'larni yuklaydi — **shundan keyingina** sizning kodingiz ishga tushadi. Shu sababli botni **faqat** management command orqali (25-darsda yozamiz) ishga tushiramiz, oddiy `python bot.py` skripti sifatida emas — bu Django ekotizimidan to'liq foydalanish imkonini beradi.

## Amaliy misol

Admin panelda tovar qo'shish va uni shell orqali "botday" o'qish — ikkalasi bitta DB'dan ekanini ko'rsatish:

```bash
python manage.py makemigrations shop
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

`http://127.0.0.1:8000/admin/`ga kirib, `Product` bo'limida yangi tovar qo'shamiz: "Simsiz quloqchin", narxi `250000`.

Endi alohida terminalda (server ishlab turgan holda) shell ochamiz:

```bash
python manage.py shell
```
```python
>>> from apps.shop.models import Product
>>> Product.objects.filter(is_active=True)
<QuerySet [<Product: Simsiz quloqchin>]>
```

Bu — hali bot yozilmagan bo'lsa ham (u 22-25-darslarda yoziladi), admin panel orqali qo'shilgan ma'lumot allaqachon **bir xil DB** orqali istalgan joydan (shell, kelajakdagi bot, kelajakdagi API) ko'rinishini isbotlaydi.

`loader.py`ni to'g'ri yaratib, uni shell orqali sinash:

```python
python manage.py shell
```
```python
>>> from apps.bot.loader import bot, dp
>>> bot.token[:10]    # xavfsizlik uchun to'liq tokenni chiqarmaymiz
'123456789:'
>>> type(dp)
<class 'aiogram.dispatcher.dispatcher.Dispatcher'>
```

Bu — `loader.py` to'g'ri ishlayotganining, va u `manage.py shell` orqali (Django to'liq yuklangan holatda) muvaffaqiyatli import qilinganining tasdig'i.

## Keng tarqalgan xatolar

**Xato 1:** `loader.py`ni oddiy `python apps/bot/loader.py` sifatida ishga tushirishga urinish.
❌ `django.core.exceptions.ImproperlyConfigured: Requested setting BOT_TOKEN, but settings are not configured` xatosi chiqadi, chunki Django hali sozlanmagan.
✅ To'g'ri: `loader.py`ni har doim `manage.py shell` orqali yoki (25-darsda yoziladigan) `manage.py runbot` buyrug'i ichida import qiling — bu holatlarda Django avtomatik sozlanadi.

**Xato 2:** `OrderAdmin`da `list_editable` ishlatib, lekin `list_display`ning **birinchi** ustuni sifatida ishlatishga urinish.
❌ Django qoidasiga ko'ra, `list_editable`ga kiritilgan maydon `list_display`ning **birinchi** ustuni bo'la olmaydi (chunki birinchi ustun odatda obyekt sahifasiga havola bo'ladi) — bu xatolik beradi.
✅ To'g'ri: `list_display = ("id", "user", "product", "quantity", "status", ...)` — `status` birinchi emas, kamida ikkinchi yoki keyingi o'rinda turishi kerak.

**Xato 3:** admin panelda tovar qo'shgach, botning uni "ko'rmasligidan" xavotirlanish (hali bot yozilmagan bosqichda).
❌ Yangi boshlovchi buni "nimadir noto'g'ri ishlayapti" deb hisoblab, keraksiz debug qilishga vaqt sarflaydi.
✅ To'g'ri: bu bosqichda (21-dars) bot hali umuman yozilmagan — faqat DB va admin tayyor. Bot mantig'i 22-25-darslarda yoziladi; shu bosqichda faqat DB va admin to'g'ri ishlayotganini (shell orqali) tekshirish yetarli.

## Mashq/topshiriq

**(Oson)** 20-darsdagi modellaringiz uchun migratsiya va admin ro'yxatdan o'tkazishni bajaring. Admin panelda kamida uchta tovar qo'shing.

**(O'rtacha)** `OrderAdmin`ga `list_editable = ("status",)` qo'shing va admin panelda bir nechta buyurtmani (avval qo'lda 2-3 tasini yaratib) ro'yxatdan turib "Tasdiqlangan" holatiga o'zgartiring.

**(Qiyin)** `apps/bot/loader.py`ni yozing va `manage.py shell` orqali `bot` va `dp` obyektlarini import qilib, ularning turini (`type()`) va `bot.token`ning boshlanishini (xavfsizlik uchun to'liq emas) tekshiring. So'ng ataylab `BOT_TOKEN`ni `.env`dan olib tashlab, xatoni qayta ishga tushirib ko'ring — qanday xato chiqishini yozib qo'ying.

<details>
<summary>Javoblarni ko'rish</summary>

1. `makemigrations shop && migrate` muvaffaqiyatli bajarilishi, admin panelda uchta `Product` yozuvi ko'rinishi kerak.
2. `list_editable = ("status",)` qo'shilgach, ro'yxat sahifasida `status` ustuni ochiladigan (dropdown) shaklda ko'rinadi, o'zgartirib "Saqlash" tugmasi orqali bir nechtasini birdan yangilash mumkin.
3. `bot.token[:10]` tokenning boshlang'ich qismini, `type(dp)` esa `Dispatcher` klassini ko'rsatishi kerak; `BOT_TOKEN`ni `.env`dan olib tashlagach, `environ.ImproperlyConfigured` yoki shunga o'xshash xato chiqadi — `Set the BOT_TOKEN environment variable` kabi xabar bilan, chunki `env("BOT_TOKEN")` qiymat topa olmaydi.

</details>

## Qisqacha xulosa

Bot modellari uchun migratsiya va admin ro'yxatdan o'tkazish — avvalgi darslardagi jarayonning aynan o'zi, faqat `list_editable` kabi yangi qulaylik qo'shiladi; `apps/bot/loader.py`da `Bot` va `Dispatcher` obyektlari `settings.BOT_TOKEN` orqali yaratiladi, va bu fayl **faqat** Django to'liq sozlangan muhitda (`manage.py shell` yoki `manage.py runbot` orqali) ishlaydi — bu esa botni nega alohida `python bot.py` skripti emas, balki Django management command sifatida ishga tushirish kerakligining texnik sababidir.
