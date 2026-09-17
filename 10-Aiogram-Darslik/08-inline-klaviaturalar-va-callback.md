# 8. Inline Klaviaturalar va Callback

## Bu darsda nimalarni o'rganasiz
- InlineKeyboard nima va u ReplyKeyboard'dan nimasi bilan farq qiladi
- `callback_query` handlerlarini yozish
- `CallbackData` klassi orqali murakkab ma'lumot uzatish
- Sahifalash (pagination) qanday quriladi

## Nazariy qism

### InlineKeyboard nima?
InlineKeyboard — xabarning **o'ziga yopishgan** tugmalar (ReplyKeyboard kabi butun ekranni egallamaydi). Tugma bosilganda chatga matn **yozilmaydi** — buning o'rniga fonda maxsus `CallbackQuery` hodisasi yuboriladi.

Bu — menyular, ovoz berish, sahifalash (pagination), tovar tanlash kabi interaktiv vazifalar uchun eng qulay usul.

### Oddiy InlineKeyboard yasash

```python
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.filters import Command
from aiogram.types import Message

@dp.message(Command("vote"))
async def show_vote(message: Message):
    builder = InlineKeyboardBuilder()
    builder.button(text="👍 Yoqdi", callback_data="like")
    builder.button(text="👎 Yoqmadi", callback_data="dislike")
    builder.adjust(2)

    await message.answer("Botni baholang:", reply_markup=builder.as_markup())
```

### Callback query'ni ushlash
```python
from aiogram import F
from aiogram.types import CallbackQuery

@dp.callback_query(F.data == "like")
async def cb_like(call: CallbackQuery):
    await call.answer("Rahmat!")                    # yuqorida qisqa popup ko'rsatadi
    await call.message.edit_text("👍 Baho qabul qilindi.")  # xabar matnini o'zgartiradi

@dp.callback_query(F.data == "dislike")
async def cb_dislike(call: CallbackQuery):
    await call.answer("Tushundik, yaxshilaymiz.")
    await call.message.edit_text("👎 Baho qabul qilindi.")
```

> ⚠️ **Juda muhim qoida:** Har bir `callback_query` handlerida **albatta** `await call.answer()` chaqiring — bo'lmasa, foydalanuvchi tugmasi ustida "soat" belgisi doim aylanaveradi, so'ng Telegram "vaqt tugadi" xatosini ko'rsatadi.

### call.answer() imkoniyatlari
```python
await call.answer()                              # jimgina, hech narsa ko'rsatmasdan
await call.answer("Bajarildi!")                   # pastda kichik bildirishnoma
await call.answer("Diqqat!", show_alert=True)     # to'liq popup oyna (muhim xabarlar uchun)
```

### Tashqi havola va boshqa tugma turlari
```python
builder = InlineKeyboardBuilder()
builder.button(text="🔗 Kanalimiz", url="https://t.me/example_channel")  # brauzer/kanal ochadi
builder.button(text="🔍 Do'stga ulashish", switch_inline_query="tavsiya")  # boshqa chatga ulaydi
```

### CallbackData klassi — murakkab ma'lumot uzatish
Oddiy `callback_data="matn"` faqat sodda holatlar uchun yetarli. Bir nechta qiymatni (masalan, kategoriya va ID) bitta tugmaga "yopishtirish" uchun `CallbackData` klassi ishlatiladi:

```python
from aiogram.filters.callback_data import CallbackData

class ProductCallback(CallbackData, prefix="prod"):
    category: str
    item_id: int

@dp.message(Command("shop"))
async def shop(message: Message):
    builder = InlineKeyboardBuilder()
    builder.button(text="📱 Telefon #1", callback_data=ProductCallback(category="phone", item_id=1))
    builder.button(text="💻 Noutbuk #5", callback_data=ProductCallback(category="laptop", item_id=5))
    builder.adjust(1)
    await message.answer("Tovar tanlang:", reply_markup=builder.as_markup())

# Faqat kategoriyasi "laptop" bo'lganlarni ushlash
@dp.callback_query(ProductCallback.filter(F.category == "laptop"))
async def laptop_clicked(call: CallbackQuery, callback_data: ProductCallback):
    await call.answer()
    await call.message.answer(f"Noutbuk #{callback_data.item_id} tanlandi!")

# Yoki barcha mahsulotlarni bitta handlerda ushlash
@dp.callback_query(ProductCallback.filter())
async def any_product(call: CallbackQuery, callback_data: ProductCallback):
    await call.answer()
    await call.message.answer(f"Kategoriya: {callback_data.category}, ID: {callback_data.item_id}")
```

`CallbackData` avtomatik ravishda `"prod:laptop:5"` kabi qatorga o'giradi va qayta o'qishda `int`/`str` tiplarini to'g'ri tiklaydi — qo'lda `split(":")` qilishga hojat qolmaydi.

### Amaliy misol: sahifalash (pagination)
```python
class PageCallback(CallbackData, prefix="page"):
    action: str   # "prev" yoki "next"
    page: int

def build_pagination_kb(page: int, total_pages: int):
    builder = InlineKeyboardBuilder()
    if page > 1:
        builder.button(text="⬅️", callback_data=PageCallback(action="prev", page=page - 1))
    builder.button(text=f"{page}/{total_pages}", callback_data="ignore")
    if page < total_pages:
        builder.button(text="➡️", callback_data=PageCallback(action="next", page=page + 1))
    builder.adjust(3)
    return builder.as_markup()

@dp.message(Command("catalog"))
async def open_catalog(message: Message):
    await message.answer("1-sahifa", reply_markup=build_pagination_kb(page=1, total_pages=5))

@dp.callback_query(PageCallback.filter())
async def change_page(call: CallbackQuery, callback_data: PageCallback):
    await call.message.edit_text(
        f"{callback_data.page}-sahifa",
        reply_markup=build_pagination_kb(page=callback_data.page, total_pages=5)
    )
    await call.answer()
```

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **`call.answer()` ni unutish** — eng ko'p uchraydigan xato, tugma "muzlab qoladi".
- **`call.message.answer()` va `call.message.edit_text()` ni chalkashtirish** — `answer()` **yangi** xabar yuboradi, `edit_text()` **mavjud** xabarni tahrirlaydi. Menyular/sahifalashda odatda `edit_text()` ishlatiladi.
- **`callback_data` uzunligi 64 baytdan oshib ketishi** — Telegram cheklovi. Shuning uchun `CallbackData` klassidan foydalanib, faqat ID kabi qisqa ma'lumot yuboriladi, to'liq ma'lumot bazadan olinadi.
- **`ProductCallback.filter()` o'rniga `F.data == "prod:phone:1"` deb qo'lda yozish** — ishlaydi, lekin xato qilish ehtimoli yuqori va noqulay; `CallbackData` klassidan foydalanish tavsiya etiladi.

## Mashq/topshiriq
1. **(Oson)** "✅ Ha" va "❌ Yo'q" tugmali InlineKeyboard yarating, ikkalasi uchun ham `call.answer()` bilan tegishli javob yozing.
2. **(O'rtacha)** `CallbackData` klassidan foydalanib, 5 ta mevaning nomi va narxini o'z ichiga olgan inline menyu yarating — tugma bosilganda mos meva nomi va narxi chiqsin.
3. **(Qiyin)** Yuqoridagi pagination misolini o'zgartirib, 10 ta "sahifa" (masalan, 1-10 gacha raqamlar) bo'ylab oldinga/orqaga o'tish imkonini yarating.

## Qisqacha xulosa
InlineKeyboard — xabarga yopishgan, bosilganda `CallbackQuery` yuboradigan interaktiv tugmalar. Har bir callback handlerida `call.answer()` chaqirish shart. Oddiy holatlar uchun `callback_data="matn"` yetarli, murakkab (bir nechta qiymatli) holatlar uchun `CallbackData` klassi ishlatiladi — bu pagination, filtrlash, katalog kabi vazifalarda juda qo'l keladi.
