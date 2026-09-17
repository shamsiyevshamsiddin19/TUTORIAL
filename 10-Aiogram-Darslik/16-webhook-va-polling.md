# 16. Webhook va Polling

## Bu darsda nimalarni o'rganasiz
- Polling va Webhook ishlash prinsipi
- Qaysi holatda qaysi birini tanlash
- aiohttp orqali webhook sozlash (asosiy tushuncha darajasida)
- Django loyihasiga aiogram botni qanday "qo'shish" mumkinligi haqida umumiy g'oya

## Nazariy qism

### Polling — bot o'zi so'raydi
**Polling** — bot Telegram serveriga muntazam ravishda "yangilik bormi?" deb murojaat qilib turadigan usul. Biz shu vaqtgacha barcha misollarda shundan foydalandik:

```python
await dp.start_polling(bot)
```

**Afzalliklari:**
- Sozlash juda oson — domen, SSL sertifikat kerak emas.
- Lokal kompyuterda ham ishlaydi (server kerak emas).

**Kamchiliklari:**
- Doimiy so'rov yuborish resurs sarflaydi.
- Juda yuqori yuklamali (minglab foydalanuvchi) botlar uchun samarasizroq.

### Webhook — Telegram o'zi yuboradi
**Webhook** — teskarisi: siz Telegram'ga "yangilik bo'lsa, shu manzilga o'zing xabar yubor" deb aytasiz. Bot passiv kutadi, faqat yangilik kelganda ishga tushadi.

**Afzalliklari:**
- Resurs jihatidan samaraliroq — doimiy so'rov yo'q.
- Yuqori yuklamali production botlar uchun tavsiya etiladi.

**Kamchiliklari:**
- **Ochiq domen va SSL sertifikat** talab qiladi (Telegram faqat `https://` manzillarga xabar yuboradi).
- Sozlash biroz murakkabroq.

### Solishtirma jadval

| | Polling | Webhook |
|---|---|---|
| Ishlash prinsipi | Bot o'zi so'raydi | Telegram o'zi yuboradi |
| Domen/SSL | Kerak emas | Majburiy |
| Sozlash | Oson | O'rtacha murakkab |
| Qachon ishlatiladi | Rivojlantirish, kichik-o'rta botlar | Yuqori yuklamali production |

### Webhook sozlash (aiohttp orqali)
```python
from aiohttp import web
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from aiogram import Bot, Dispatcher

WEBHOOK_PATH = "/webhook"
WEBHOOK_URL = "https://sizning-domeningiz.uz" + WEBHOOK_PATH

bot = Bot(token="TOKEN")
dp = Dispatcher()


async def on_startup(bot: Bot):
    await bot.set_webhook(WEBHOOK_URL, drop_pending_updates=True)


def main():
    dp.startup.register(on_startup)

    app = web.Application()
    SimpleRequestHandler(dispatcher=dp, bot=bot).register(app, path=WEBHOOK_PATH)
    setup_application(app, dp, bot=bot)

    web.run_app(app, host="0.0.0.0", port=8080)


if __name__ == "__main__":
    main()
```

Bunda `nginx` orqali `https://domain.uz/webhook` manzili serverdagi `8080` portga proksi qilinadi (SSL sertifikat — masalan, Let's Encrypt orqali olinadi).

### Django loyihasiga bot qo'shish haqida umumiy g'oya
Sizning stack'ingiz — Django + aiogram + PostgreSQL bo'lgani uchun, quyidagi ikkita yondashuv keng tarqalgan:

1. **Alohida jarayon (process) sifatida**: aiogram bot Django'dan mustaqil, alohida Python jarayoni sifatida ishlaydi (masalan, `python bot.py` yoki systemd xizmati orqali), lekin ikkalasi ham **bitta PostgreSQL bazasiga** ulanadi. Bu — eng oddiy va keng tarqalgan yondashuv.
2. **Django komandasi sifatida**: aiogram botni Django'ning `manage.py` maxsus komandasi (`management command`) sifatida ishga tushirish — bu Django'ning ORM va sozlamalaridan to'g'ridan-to'g'ri foydalanish imkonini beradi.

Bu mavzu — chuqurroq, alohida "Django + aiogram integratsiyasi" darsligida batafsil ko'riladi (agar xohlasangiz, keyinroq shu mavzuda alohida darslik tayyorlab beraman).

## Amaliy misol
Rivojlantirish bosqichida polling, keyinchalik serverga chiqarganda webhook'ga oson o'tish uchun kodni tuzish:

```python
import asyncio
import os

USE_WEBHOOK = os.getenv("USE_WEBHOOK", "false") == "true"

async def main():
    bot = Bot(token="TOKEN")
    dp = Dispatcher()
    # ... routerlar ulanadi ...

    if USE_WEBHOOK:
        # webhook logikasi (yuqoridagi kabi)
        pass
    else:
        await bot.delete_webhook(drop_pending_updates=True)
        await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
```

Bu tarzda `.env` faylida bitta o'zgaruvchini almashtirish orqali rivojlantirish va production rejimlari orasida almashish mumkin.

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **Polling va webhook'ni bir vaqtda ishlatishga urinish** — bu ikkalasi bir-biriga zid, faqat bittasi tanlanadi. Agar avval webhook o'rnatilgan bo'lsa-yu, keyin polling ishga tushirmoqchi bo'lsangiz, avval `bot.delete_webhook()` chaqirish shart.
- **SSL sertifikatsiz webhook o'rnatishga urinish** — Telegram bunday manzillarni qabul qilmaydi.
- **Webhook manzilini noto'g'ri (masalan, `http://` bilan, `https://` o'rniga) berish** — Telegram xato qaytaradi.
- **Kichik/o'rta loyihada murakkab webhook infratuzilmasini ishlatishga urinish** — ko'p hollarda bu ortiqcha murakkablik; polling kichik-o'rta botlar uchun to'liq yetarli.

## Mashq/topshiriq
1. **(Oson)** Yuqoridagi solishtirma jadvalni o'z so'zlaringiz bilan qayta yozib, qaysi holatlarda qaysi usulni tanlashni tushuntiring.
2. **(O'rtacha)** `.env` faylida `USE_WEBHOOK` o'zgaruvchisini yaratib, kodda shu o'zgaruvchiga qarab polling yoki webhook logikasi ishga tushishini (webhook qismini hozircha "pass" bilan) loyihalang.
3. **(Qiyin)** Agar serveringiz (yoki bepul xizmat, masalan ngrok) bo'lsa, webhook'ni haqiqatan sozlab ko'ring va uni polling bilan solishtiring.

## Qisqacha xulosa
Polling — bot o'zi Telegram'dan so'rab turadi (oson, rivojlantirish uchun ideal), Webhook — Telegram bot serveriga o'zi xabar yuboradi (samaraliroq, lekin domen va SSL talab qiladi, production uchun mos). Kichik-o'rta loyihalar, shu jumladan Django + aiogram + PostgreSQL stack'ida ko'pincha aiogram bot alohida jarayon sifatida, bitta umumiy bazaga ulangan holda ishlaydi.
