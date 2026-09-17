# Admin paneldan botga xabar yuborish (async_to_sync)

## Bu darsda nimalarni o'rganasiz

- Sinxron Django admin ichidan asinxron Aiogram funksiyasini chaqira olasiz
- `async_to_sync` bilan `sync_to_async` orasidagi farqni tushuntira olasiz
- Django admin action yozib, tanlangan buyurtmalar ustida ommaviy amal bajara olasiz
- Nega har safar yangi `Bot` obyekti ochish kerakligini tushuntira olasiz

## Nazariy qism

### Aksincha yo'nalish — Web'dan botga

22-25-darslarda biz botdan (async) Django ORM'ga (sync) murojaat qilishni ko'rdik. Endi **aksincha** yo'nalishni ko'ramiz: admin panelda (sync, WSGI muhitida) buyurtma holatini "Tasdiqlangan"ga o'zgartirganda, foydalanuvchiga **bot orqali** avtomatik xabar yuborish.

Bu yerdagi qiyinchilik — Django admin **sinxron** (WSGI) muhitda ishlaydi, Aiogram `Bot.send_message()` esa **asinxron**. Ko'prik — `asgiref`ning `async_to_sync` funksiyasi, bu 23-darsda ko'rgan `sync_to_async`ning **teskarisi**:

| Funksiya | Yo'nalish | Qachon ishlatiladi |
|---|---|---|
| `sync_to_async` | sync → async | Async handler ichidan sinxron Django kodini chaqirish (22-23-darslar) |
| `async_to_sync` | async → sync | Sinxron Django kodi (masalan, admin) ichidan asinxron Aiogram kodini chaqirish |

### Nega har safar YANGI Bot obyekti ochiladi

```python
async def _notify_user(chat_id: int, text: str):
    async with Bot(token=settings.BOT_TOKEN) as bot:
        await bot.send_message(chat_id=chat_id, text=text)
```

Diqqat qiling: bu yerda `apps.bot.loader.bot` (25-darsda `runbot`da ishlatilgan umumiy obyekt) ishlatilmayapti — o'rniga har safar **yangi** `Bot` obyekti yaratilib, `async with` orqali ochilib-yopilyapti. Buning sababi: Django admin action'lar har safar **yangi, alohida event loop**da ishga tushadi (chunki `async_to_sync` har chaqiriqda o'z event loop'ini yaratadi). Agar umumiy `apps.bot.loader.bot` obyektining ichki `aiohttp` sessiyasini turli event loop'lar orasida qayta ishlatishga urinilsa, bu **event loop ziddiyati** xatosiga olib keladi. Shuning uchun bu holatda har safar yangi, mustaqil `Bot` obyekti — eng ishonchli yechim.

### To'liq misol — buyurtmani tasdiqlash va xabar yuborish

```python
# apps/shop/admin.py ga qo'shimcha
from asgiref.sync import async_to_sync
from aiogram import Bot
from django.conf import settings
from django.contrib import admin
from .models import Order


async def _notify_user(chat_id: int, text: str):
    async with Bot(token=settings.BOT_TOKEN) as bot:
        await bot.send_message(chat_id=chat_id, text=text)


@admin.action(description="Tanlangan buyurtmalarni tasdiqlash va foydalanuvchiga xabar berish")
def confirm_orders(modeladmin, request, queryset):
    for order in queryset:
        order.status = Order.Status.CONFIRMED
        order.save()
        async_to_sync(_notify_user)(
            order.user.telegram_id,
            f"✅ Buyurtma #{order.pk} tasdiqlandi! Tez orada siz bilan bog'lanamiz."
        )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "quantity", "status", "created_at")
    actions = [confirm_orders]
```

`@admin.action(description="...")` — 6-darsda ko'rgan admin action mexanizmi, faqat endi ichida `async_to_sync` orqali Aiogram funksiyasi chaqirilmoqda. Endi admin panelda bir nechta buyurtmani belgilab, "Tanlangan buyurtmalarni tasdiqlash..." amalini tanlasangiz — statusi yangilanadi **va** foydalanuvchi Telegram'da darhol xabar oladi.

## Amaliy misol

Buyurtma bekor qilinganda ham xabar yuboradigan, kengaytirilgan versiya:

```python
# apps/shop/admin.py
from asgiref.sync import async_to_sync
from aiogram import Bot
from django.conf import settings
from django.contrib import admin
from .models import Order, Product


async def _send_telegram_message(chat_id: int, text: str):
    async with Bot(token=settings.BOT_TOKEN) as bot:
        await bot.send_message(chat_id=chat_id, text=text, parse_mode="HTML")


@admin.action(description="✅ Tasdiqlash va xabar yuborish")
def confirm_orders(modeladmin, request, queryset):
    updated = 0
    for order in queryset.exclude(status=Order.Status.CONFIRMED):
        order.status = Order.Status.CONFIRMED
        order.save()
        async_to_sync(_send_telegram_message)(
            order.user.telegram_id,
            f"✅ <b>Buyurtma #{order.pk}</b> tasdiqlandi!\n{order.product.name} — {order.quantity} dona"
        )
        updated += 1
    modeladmin.message_user(request, f"{updated} ta buyurtma tasdiqlandi va xabar yuborildi.")


@admin.action(description="❌ Bekor qilish va xabar yuborish")
def cancel_orders(modeladmin, request, queryset):
    for order in queryset:
        order.status = Order.Status.CANCELLED
        # bekor qilingan buyurtma miqdorini omborga qaytarish (13-darsdagi F() bilan)
        Product.objects.filter(pk=order.product_id).update(stock=models.F("stock") + order.quantity)
        order.save()
        async_to_sync(_send_telegram_message)(
            order.user.telegram_id,
            f"❌ Buyurtma #{order.pk} bekor qilindi."
        )
    modeladmin.message_user(request, f"{queryset.count()} ta buyurtma bekor qilindi.")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "quantity", "status", "created_at")
    list_filter = ("status",)
    actions = [confirm_orders, cancel_orders]
```

Bu misolda `modeladmin.message_user(request, ...)` — admin panelning o'zida, amal bajarilgandan so'ng, nechta buyurtma yangilanganini ko'rsatuvchi xabar chiqaradi (Django admin'ning standart, tanish imkoniyati).

## Keng tarqalgan xatolar

**Xato 1:** admin action ichida `apps.bot.loader.bot` (umumiy obyekt)ni ishlatishga urinish.
❌ `async_to_sync(bot.send_message)(chat_id=..., text=...)` — bu ba'zan ishlaydi, lekin ayrim holatlarda "Event loop is closed" yoki shunga o'xshash tushunarsiz xatoga olib kelishi mumkin, chunki umumiy `bot` obyekti `runbot`ning event loop'iga bog'langan.
✅ To'g'ri: admin action ichida har doim **yangi**, mustaqil `Bot` obyektini `async with Bot(token=...) as bot:` orqali yarating va ishlatib bo'lgach avtomatik yoping.

**Xato 2:** `async_to_sync`ni to'g'ridan-to'g'ri `async def` funksiyaning o'ziga emas, uning **natijasiga** qo'llashga urinish.
❌ `async_to_sync(_notify_user(chat_id, text))` — bu avval `_notify_user`ni chaqirib, **coroutine obyekt** yaratadi, so'ng `async_to_sync`ga shu obyektni beradi, bu esa xato beradi.
✅ To'g'ri: `async_to_sync(_notify_user)(chat_id, text)` — avval `async_to_sync` funksiyaning **o'ziga** qo'llaniladi (qavssiz), so'ng natijaviy "sinxron" funksiya odatdagidek argumentlar bilan chaqiriladi.

**Xato 3:** admin action'da har bir obyekt uchun alohida-alohida `Bot` ochib-yopish sabab bo'lgan sekinlikni e'tiborsiz qoldirish.
❌ Agar bir vaqtning o'zida 100 ta buyurtma tanlanib, "tasdiqlash" amali bajarilsa, har biriga alohida `Bot` ochilib-yopilishi sezilarli sekinlikka olib kelishi mumkin.
✅ To'g'ri: kichik hajmdagi admin amallari uchun bu yondashuv yetarli; agar juda katta hajmda ommaviy xabar yuborish kerak bo'lsa, buni alohida background task (Celery yoki Django background tasks, 1-bo'limning 15-darsida ko'rgan) orqali, admin so'rovini bloklamasdan bajarish to'g'riroq bo'ladi.

## Mashq/topshiriq

**(Oson)** `confirm_orders` admin action'ini o'z loyihangizga qo'shing va admin panelda bir nechta buyurtmani tanlab, xabar yuborilishini Telegram'da tekshiring.

**(O'rtacha)** `cancel_orders` action'ini qo'shing — bu buyurtma holatini `"cancelled"`ga o'zgartirsin va foydalanuvchiga mos xabar yuborsin. `list_filter = ("status",)` orqali faqat "Yangi" holatidagi buyurtmalarni tez topib, ular ustida amal bajarishni sinab ko'ring.

**(Qiyin)** `notify_all_users` nomli, alohida (`Order`ga bog'liq bo'lmagan) admin action yarating — bu barcha faol (`is_active=True` bo'lmagan, balki oddiygina barcha) `TelegramUser`larga ommaviy e'lon (masalan, "Yangi chegirmalar!") yuborsin. Bu action juda ko'p foydalanuvchi bo'lsa nega sekin ishlashi mumkinligini, va buni qanday yaxshilash mumkinligini (masalan, `asyncio.gather` orqali parallel yuborish yoki background task) muhokama qiling.

<details>
<summary>Javoblarni ko'rish</summary>

1. `confirm_orders` to'g'ri ishlagach, buyurtma holati "Tasdiqlangan"ga o'zgaradi va foydalanuvchi Telegram'da xabar oladi.
2. `cancel_orders` qo'shilgach, `list_filter` orqali "Yangi" (`new`) holatidagi buyurtmalarni filtrlash va ularni tanlab bekor qilish mumkin bo'lishi kerak.
3. `@admin.action(description="Barcha foydalanuvchilarga xabar")\ndef notify_all_users(modeladmin, request, queryset): users = TelegramUser.objects.all(); for u in users: async_to_sync(_send_telegram_message)(u.telegram_id, "Yangi chegirmalar!")`. Bu sekin ishlaydi, chunki har bir foydalanuvchi uchun **ketma-ket**, alohida `Bot` ochilib-yopiladi va tarmoq so'rovi kutiladi; yaxshilash uchun bitta `Bot` obyektini ochib, barcha xabarlarni `asyncio.gather()` orqali **parallel** yuborish, yoki bu ishni butunlay background task/Celery'ga (1-bo'lim, 15-dars) o'tkazib, admin so'rovini darhol qaytarish mumkin.

</details>

## Qisqacha xulosa

`async_to_sync` — `sync_to_async`ning teskarisi bo'lib, sinxron Django admin (yoki boshqa WSGI kod) ichidan Aiogram'ning asinxron `Bot.send_message()` kabi funksiyalarini chaqirish imkonini beradi; bu holatda umumiy `apps.bot.loader.bot` obyekti o'rniga har safar **yangi, mustaqil** `Bot` obyekti (`async with Bot(...) as bot:`) yaratish tavsiya etiladi, chunki admin action'lar har safar alohida event loop'da ishga tushadi — bu Django admin va Telegram bot orasidagi ikkinchi (teskari) yo'nalishdagi ko'prikni yakunlaydi.
