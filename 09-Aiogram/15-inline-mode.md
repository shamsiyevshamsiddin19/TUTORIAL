# 15. Inline Mode

## Bu darsda nimalarni o'rganasiz
- Inline mode nima va u qanday ishlatiladi
- BotFather'da inline mode'ni yoqish
- `InlineQuery` handlerini yozish
- `switch_inline_query` bilan istalgan chatga bot natijasini yuborish

## Nazariy qism

### Inline mode nima?
Odatiy holatda foydalanuvchi bot bilan **to'g'ridan-to'g'ri** (shaxsiy chatda) gaplashadi. **Inline mode** esa botni **istalgan boshqa chatda** (guruh, kanal, do'stingiz bilan suhbatda) ishlatish imkonini beradi — hattoki bot o'sha chatga qo'shilmagan bo'lsa ham!

Buning uchun foydalanuvchi xabar yozish maydonida `@bot_username so'rov` deb yozadi, va Telegram real vaqtda botdan natijalar so'rab, ularni ro'yxat sifatida ko'rsatadi. Foydalanuvchi natijalardan birini tanlaydi, va u o'sha chatga xabar sifatida yuboriladi.

Amaliy misol: `@gif` boti — istalgan chatda `@gif kulgi` deb yozsangiz, mos GIF'lar ro'yxati chiqadi.

### BotFather'da inline mode'ni yoqish
1. `@BotFather`ga boring
2. `/mybots` → botingizni tanlang → **Bot Settings** → **Inline Mode** → **Turn on**

### InlineQuery handlerini yozish
```python
from aiogram.types import InlineQuery, InlineQueryResultArticle, InputTextMessageContent
import hashlib

@dp.inline_query()
async def inline_search(inline_query: InlineQuery):
    query_text = inline_query.query or "bo'sh so'rov"

    results = [
        InlineQueryResultArticle(
            id=hashlib.md5(query_text.encode()).hexdigest(),  # har bir natija uchun noyob ID
            title=f"Siz qidirdingiz: {query_text}",
            input_message_content=InputTextMessageContent(
                message_text=f"Siz {query_text} bo'yicha qidiruv qildingiz!"
            ),
            description="Bu natijani tanlash uchun bosing"
        )
    ]

    await inline_query.answer(results, cache_time=1)
```

### Bir nechta natija qaytarish
```python
@dp.inline_query()
async def inline_menu(inline_query: InlineQuery):
    items = {
        "pizza": "🍕 Pizza — 35,000 so'm",
        "burger": "🍔 Burger — 25,000 so'm",
        "sushi": "🍣 Sushi — 45,000 so'm",
    }

    results = [
        InlineQueryResultArticle(
            id=key,
            title=value,
            input_message_content=InputTextMessageContent(message_text=f"Men {value} buyurtma qildim!")
        )
        for key, value in items.items()
        if inline_query.query.lower() in key  # foydalanuvchi yozgan matnga mos keladiganlarni filtrlash
    ]

    await inline_query.answer(results, cache_time=1)
```

### switch_inline_query — inline rejimga o'tuvchi tugma
Oddiy handlerdan foydalanuvchini to'g'ridan-to'g'ri inline rejimga "yo'naltiruvchi" tugma yasash mumkin (8-darsda ko'rgan edik):

```python
from aiogram.utils.keyboard import InlineKeyboardBuilder

@dp.message(Command("share"))
async def share_menu(message: Message):
    builder = InlineKeyboardBuilder()
    builder.button(text="📤 Do'stga ulashish", switch_inline_query="tavsiya")
    await message.answer("Botni do'stlaringizga ulashing:", reply_markup=builder.as_markup())
```

Bu tugma bosilganda, foydalanuvchi chat tanlashi va u yerda avtomatik `@bot_username tavsiya` matni yozib qo'yiladi.

## Amaliy misol
Oddiy "kalkulyator" inline bot — foydalanuvchi `@bot 5+3` deb yozsa, natijani ko'rsatadi:

```python
from aiogram.types import InlineQuery, InlineQueryResultArticle, InputTextMessageContent
import hashlib

@dp.inline_query()
async def calculator_inline(inline_query: InlineQuery):
    query = inline_query.query.strip()
    results = []

    try:
        # ⚠️ eval() ishlatish xavfli, bu faqat o'quv maqsadida soddalashtirilgan misol
        answer = eval(query, {"__builtins__": {}})
        results.append(
            InlineQueryResultArticle(
                id=hashlib.md5(query.encode()).hexdigest(),
                title=f"Natija: {answer}",
                input_message_content=InputTextMessageContent(message_text=f"{query} = {answer}"),
                description="Bu natijani yuborish uchun bosing"
            )
        )
    except Exception:
        pass  # noto'g'ri ifoda — hech qanday natija ko'rsatmaymiz

    await inline_query.answer(results, cache_time=1)
```

> ⚠️ **Diqqat:** `eval()` ishlatish real loyihada xavfli (ixtiyoriy kod bajarilishi mumkin). Bu yerda faqat inline mode qanday ishlashini ko'rsatish uchun soddalashtirilgan. Real loyihada matematik ifodalarni xavfsiz baholovchi maxsus kutubxona (masalan, `simpleeval`) ishlatiladi.

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **BotFather'da Inline Mode'ni yoqishni unutish** — handler yozilgan bo'lsa ham, sozlama yoqilmagan bo'lsa, hech narsa ishlamaydi.
- **Har bir natija uchun noyob `id` bermaslik** — Telegram bir xil ID'li natijalarni to'g'ri ko'rsatmasligi mumkin, shuning uchun `hashlib` yoki oddiy hisoblagich orqali noyob ID yaratiladi.
- **`cache_time` ni juda katta qilib qo'yish** — Telegram natijalarni uzoq vaqt keshlaydi, foydalanuvchi yangi so'rov yuborsa ham eski natijalarni ko'rishi mumkin. Tez o'zgaruvchi ma'lumotlar uchun kichik qiymat (masalan, `cache_time=1`) tavsiya etiladi.
- **`inline_query.query` bo'sh bo'lishi mumkinligini hisobga olmaslik** — foydalanuvchi `@bot` deb, hech narsa yozmasdan ham inline rejimga kirishi mumkin.

## Mashq/topshiriq
1. **(Oson)** BotFather orqali botingizda Inline Mode'ni yoqing va oddiy "siz yozgan matnni takrorlaydigan" inline handler yozing.
2. **(O'rtacha)** 3-5 ta tayyor "shablon xabar" (masalan, tabriknomalar) ro'yxatidan foydalanuvchi so'roviga mos keladiganlarini ko'rsatuvchi inline bot yarating.
3. **(Qiyin)** `switch_inline_query_current_chat` (joriy chatning o'zida inline izlashni ochadigan) parametridan foydalanib, botning o'z ichida "qidiruv" tugmasini yarating — bu `switch_inline_query`dan farqli, chat tanlashni talab qilmaydi.

## Qisqacha xulosa
Inline mode — botni istalgan Telegram chatida, botning o'zi o'sha yerga qo'shilmagan bo'lsa ham, ishlatish imkonini beradi. `@dp.inline_query()` handleri orqali foydalanuvchi so'roviga mos natijalar ro'yxati qaytariladi. `switch_inline_query` tugmasi orqali foydalanuvchini to'g'ridan-to'g'ri inline rejimga yo'naltirish mumkin. Bu funksiya botning qamrovini sezilarli darajada kengaytiradi, lekin barcha loyihalarda ham shart emas — asosiy botlar (buyurtma, ma'muriyat) uchun odatda kerak bo'lmaydi.
