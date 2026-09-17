# 7. Reply Klaviaturalar

## Bu darsda nimalarni o'rganasiz
- ReplyKeyboard nima va u qanday ko'rinadi
- `ReplyKeyboardBuilder` yordamida tugmalar yasash
- Telefon raqami va lokatsiya so'rovchi maxsus tugmalar
- Klaviaturani olib tashlash

## Nazariy qism

### ReplyKeyboard nima?
ReplyKeyboard — foydalanuvchining odatiy klaviaturasi **o'rniga** chiqadigan tugmalar. Tugma bosilganda, uning matni oddiy xabar sifatida chatga yoziladi (xuddi foydalanuvchi o'zi shu matnni qo'lda yozgandek).

Bu — eng oddiy, tez tushuniladigan interfeys turi, ayniqsa asosiy menyu yoki tez-tez ishlatiladigan variantlar uchun qulay.

### ReplyKeyboardBuilder bilan tugma yasash

```python
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from aiogram.types import Message
from aiogram.filters import Command

@dp.message(Command("menu"))
async def show_menu(message: Message):
    builder = ReplyKeyboardBuilder()
    builder.button(text="🛍 Mahsulotlar")
    builder.button(text="📞 Aloqa")
    builder.adjust(2)  # bitta qatorga nechta tugma joylashishini belgilaydi

    await message.answer(
        "Menyu:",
        reply_markup=builder.as_markup(resize_keyboard=True)
    )
```

**Muhim parametrlar:**
- `builder.adjust(2, 1)` — 1-qatorga 2 ta, 2-qatorga 1 ta tugma joylashtiradi.
- `resize_keyboard=True` — tugmalarni ixcham, ekranga mos qiladi (deyarli har doim `True` qo'yiladi).
- `one_time_keyboard=True` — tugma bosilgach, klaviatura avtomatik yopiladi (bir martalik tanlov uchun qulay).
- `input_field_placeholder="Tanlang..."` — matn kiritish maydonida ko'rinadigan bulutsimon yozuv.

### Tugma bosilganini ushlash
Tugma bosilganda, uning matni oddiy xabar sifatida keladi — shuning uchun uni `F.text` orqali ushlaymiz:

```python
from aiogram import F

@dp.message(F.text == "🛍 Mahsulotlar")
async def products(message: Message):
    await message.answer("Bizda telefon, noutbuk va aksessuarlar bor.")

@dp.message(F.text == "📞 Aloqa")
async def contact(message: Message):
    await message.answer("+998 90 123 45 67")
```

### Maxsus tugmalar: telefon raqami va lokatsiya
Telegram ba'zi ma'lumotlarni maxsus tugmalar orqali so'rash imkonini beradi — foydalanuvchi faqat tasdiqlaydi, qo'lda yozmaydi:

```python
builder = ReplyKeyboardBuilder()
builder.button(text="📱 Raqamni yuborish", request_contact=True)
builder.button(text="📍 Manzilni yuborish", request_location=True)
builder.adjust(1)

await message.answer("Ma'lumot yuboring:", reply_markup=builder.as_markup(resize_keyboard=True))
```

Bu ma'lumotlarni qabul qilish:
```python
@dp.message(F.contact)
async def on_contact(message: Message):
    phone = message.contact.phone_number
    await message.answer(f"Raqamingiz qabul qilindi: {phone}")

@dp.message(F.location)
async def on_location(message: Message):
    lat, lon = message.location.latitude, message.location.longitude
    await message.answer(f"Koordinatalar: {lat}, {lon}")
```

### Klaviaturani olib tashlash
```python
from aiogram.types import ReplyKeyboardRemove

@dp.message(Command("hide"))
async def hide_menu(message: Message):
    await message.answer("Klaviatura olib tashlandi.", reply_markup=ReplyKeyboardRemove())
```

## Amaliy misol
To'liq ishlaydigan menyu tizimi:

```python
from aiogram import Dispatcher, F
from aiogram.filters import Command
from aiogram.types import Message
from aiogram.utils.keyboard import ReplyKeyboardBuilder

dp = Dispatcher()

@dp.message(Command("menu"))
async def show_menu(message: Message):
    builder = ReplyKeyboardBuilder()
    builder.button(text="🛍 Mahsulotlar")
    builder.button(text="📞 Aloqa")
    builder.button(text="📱 Raqamimni ulashish", request_contact=True)
    builder.adjust(2, 1)

    await message.answer(
        "Quyidagilardan birini tanlang:",
        reply_markup=builder.as_markup(resize_keyboard=True, input_field_placeholder="Tanlang...")
    )

@dp.message(F.text == "🛍 Mahsulotlar")
async def products(message: Message):
    await message.answer("📦 Telefon, noutbuk, quloqchin mavjud.")

@dp.message(F.text == "📞 Aloqa")
async def contact(message: Message):
    await message.answer("☎️ +998 90 123 45 67")

@dp.message(F.contact)
async def got_contact(message: Message):
    await message.answer(f"Rahmat! Raqamingiz: {message.contact.phone_number}")
```

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **`resize_keyboard=True` ni unutish** — tugmalar juda katta va noqulay ko'rinadi.
- **Tugma matnini handler bilan aynan bir xil yozmaslik** (masalan, tugmada bo'sh joy yoki emoji farq qilsa) — `F.text == "..."` mos kelmaydi. Eng ishonchli yo'l — tugma matnini o'zgaruvchida saqlab, ikkala joyda ham o'sha o'zgaruvchidan foydalanish.
- **`request_contact=True` faqat "Yuborish" tugmasida ishlashini unutish** — bu parametr faqat maxsus so'zsiz tugmada ishlaydi, oddiy matnli tugmada emas.
- **InlineKeyboard bilan ReplyKeyboard'ni chalkashtirish** — Reply klaviatura butun ekranni egallaydi (xabar ostida emas, pastda), Inline esa xabarning o'ziga yopishadi (keyingi darsda).

## Mashq/topshiriq
1. **(Oson)** 4 ta tugmali (2x2) menyu yarating: "🏠 Bosh sahifa", "ℹ️ Biz haqimizda", "📞 Aloqa", "⚙️ Sozlamalar".
2. **(O'rtacha)** Har bir tugma bosilganda mos matn bilan javob beruvchi handlerlarni yozing.
3. **(Qiyin)** Foydalanuvchidan telefon raqamini so'rovchi tugma yarating, va raqam kelganda uni "database" o'rnida ishlaydigan oddiy Python lug'atiga (`dict`) saqlang (`{user_id: phone}`).

## Qisqacha xulosa
ReplyKeyboard — foydalanuvchining klaviaturasi o'rnida chiqadigan, tugma bosilganda oddiy matn yuboradigan interfeys turi. `ReplyKeyboardBuilder` orqali yasaladi, `.adjust()` bilan joylashuvi, `resize_keyboard=True` bilan o'lchami sozlanadi. `request_contact` va `request_location` — foydalanuvchidan maxsus ma'lumot so'rashning eng oson yo'li. Tugma bosilganini `F.text == "..."` orqali ushlaymiz.
