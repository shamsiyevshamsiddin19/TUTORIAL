# 2. Muhitni Sozlash

## Bu darsda nimalarni o'rganasiz
- BotFather orqali yangi bot yaratish va token olish
- Virtual muhit (venv) nima va nega u har doim kerak
- Aiogram'ni o'rnatish
- `requirements.txt` va `.env` fayllarining vazifasi

## Nazariy qism

### 1. BotFather orqali bot yaratish
Har qanday Telegram bot — Telegram'ning o'zidagi maxsus bot orqali ro'yxatdan o'tkaziladi: **@BotFather**.

Qadamlar:
1. Telegram'da `@BotFather` ni toping va `/start` bosing.
2. `/newbot` buyrug'ini yuboring.
3. Botingiz uchun **ko'rinadigan nom** kiriting (masalan, "Mening Do'konim").
4. Botingiz uchun **username** kiriting — bu `bot` bilan tugashi shart (masalan, `mening_dokonim_bot`).
5. BotFather sizga **token** beradi — bu shunday ko'rinadi: `123456789:AAExampleTokenHereDoNotShareIt`.

> ⚠️ **Token — botingizning paroli.** Uni hech kimga bermang, GitHub'ga (ochiq repozitoriyga) yuklamang. Token qo'lga tushsa, botingizni istalgan kishi to'liq boshqara oladi.

### 2. Virtual muhit (venv) nima va nega kerak
Har bir Python loyihasi turli kutubxonalar va ularning **turli versiyalarini** talab qilishi mumkin. Agar barcha loyihalar bitta umumiy Python muhitidan foydalansa, bitta loyihada kutubxonani yangilash boshqa loyihani buzib qo'yishi mumkin.

**Virtual muhit** — har bir loyiha uchun alohida, izolyatsiya qilingan Python muhiti yaratadi.

```bash
# 1. Virtual muhit yaratish
python -m venv venv

# 2. Faollashtirish
source venv/bin/activate      # Linux / macOS
venv\Scripts\activate         # Windows
```

Faollashtirilgandan so'ng, terminalda `(venv)` yozuvi paydo bo'ladi — bu virtual muhit ishlayotganini bildiradi.

### 3. Aiogram va yordamchi kutubxonalarni o'rnatish
```bash
pip install aiogram python-dotenv
```

- `aiogram` — asosiy freymvork.
- `python-dotenv` — `.env` faylidan maxfiy ma'lumotlarni (token) o'qish uchun.

### 4. requirements.txt — loyihani takrorlash uchun
Boshqa kompyuterda yoki serverda loyihani tiklash uchun barcha kutubxonalar ro'yxatini saqlab qo'yish kerak:

```bash
pip freeze > requirements.txt
```

Boshqa joyda o'rnatish:
```bash
pip install -r requirements.txt
```

### 5. Tokenni xavfsiz saqlash: .env fayli
Tokenni to'g'ridan-to'g'ri kodga yozish xavfli. Buning o'rniga alohida `.env` faylida saqlaymiz:

`.env`:
```
BOT_TOKEN=123456789:AAExampleTokenHereDoNotShareItWithAnyone
```

Bu faylni Git'ga yuklamaslik uchun `.gitignore` fayliga qo'shamiz:

`.gitignore`:
```
venv/
.env
__pycache__/
*.pyc
```

## Amaliy misol
To'liq sozlash ketma-ketligi (terminalda):

```bash
mkdir mybot && cd mybot
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install aiogram python-dotenv
echo "BOT_TOKEN=SIZNING_TOKENINGIZ" > .env
pip freeze > requirements.txt
```

Tokenni Python kodida ishlatish (`config.py`):
```python
import os
from dotenv import load_dotenv

load_dotenv()  # .env faylini o'qib, muhit o'zgaruvchilariga yuklaydi

BOT_TOKEN = os.getenv("BOT_TOKEN")
```

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **venv'ni faollashtirmasdan `pip install` qilish** — bu holda kutubxona butun kompyuterga (global) o'rnatiladi, loyihalar orasida ziddiyat yuzaga kelishi mumkin.
- **Tokenni to'g'ridan-to'g'ri kodga yozib, GitHub'ga yuklash** — bu eng ko'p uchraydigan xavfsizlik xatosi. Token oshkor bo'lsa, darhol BotFather orqali `/revoke` qilib, yangisini oling.
- **`.env` faylini `.gitignore`ga qo'shishni unutish**.
- **`python-dotenv` o'rnatilmagan holda `load_dotenv()` chaqirish** — bu `ModuleNotFoundError` xatosini beradi.

## Mashq/topshiriq
1. **(Oson)** @BotFather orqali o'zingizning birinchi botingizni yarating va tokenni oling.
2. **(O'rtacha)** Kompyuteringizda `mybot` papkasi yarating, virtual muhit tuzing, aiogram'ni o'rnating va `pip list` orqali o'rnatilgan kutubxonalarni tekshiring.
3. **(Qiyin)** `.env` va `config.py` fayllarini yarating, tokenni `.env`ga yozing va `config.py` orqali uni Python konsolida chop eting (`print(BOT_TOKEN)`).

## Qisqacha xulosa
Har qanday aiogram loyihasi uchtta narsadan boshlanadi: BotFather orqali olingan **token**, izolyatsiya qiluvchi **virtual muhit** va xavfsiz saqlangan **`.env` fayl**. Bu odatlarni boshidanoq to'g'ri shakllantirish keyinchalik katta muammolarning oldini oladi — ayniqsa token xavfsizligi masalasida.
