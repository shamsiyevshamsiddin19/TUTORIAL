# 5. Handlerlar va Xabar Turlari

## Bu darsda nimalarni o'rganasiz
- Handler qanday ishlaydi va Aiogram uni qanday tanlaydi
- `Message` obyektidagi eng muhim maydonlar
- Turli xabar turlarini (matn, rasm, ovoz va h.k.) qanday ushlash
- Handlerlar tartibi nega muhim

## Nazariy qism

### Handler qanday ishlaydi
Foydalanuvchi botga biror narsa yuborganda (matn, rasm, tugma bosish), Telegram bu haqda aiogram'ga **update** deb ataluvchi ma'lumot yuboradi. Dispatcher bu update'ni ro'yxatdan o'tgan handlerlar bo'ylab, **yuqoridan pastga qarab**, tekshiradi va **birinchi mos kelgan** handlerni ishga tushiradi.

Bu degani — handlerlar tartibi muhim! Tor (aniq) filterli handlerlarni yuqoriga, keng (umumiy) filterlilarni pastga yozish kerak, aks holda umumiy handler tor handlerdan "oldin ishlab", uni hech qachon ishga tushirmasligi mumkin.

### Message obyekti — eng muhim maydonlar

| Maydon | Nima beradi |
|---|---|
| `message.text` | Yuborilgan matn |
| `message.from_user.id` | Yuboruvchining Telegram ID raqami |
| `message.from_user.first_name` | Yuboruvchining ismi |
| `message.from_user.username` | Yuboruvchining @username (bo'lmasligi ham mumkin) |
| `message.chat.id` | Chat ID raqami (shaxsiy, guruh yoki kanal) |
| `message.chat.type` | Chat turi: `private`, `group`, `supergroup`, `channel` |
| `message.photo` | Rasm bo'lsa — turli o'lchamdagi versiyalar ro'yxati |
| `message.document` | Fayl (hujjat) bo'lsa |
| `message.voice` / `message.video` | Ovozli xabar / video bo'lsa |

### Turli xabar turlarini ushlash
Aiogram 3'da `F` (magic filter) orqali xabar turini tekshirish eng qulay usul (F haqida keyingi darsda batafsil):

```python
from aiogram import F
from aiogram.types import Message

@dp.message(F.photo)
async def handle_photo(message: Message):
    await message.answer("Rasm qabul qilindi! 📸")

@dp.message(F.document)
async def handle_doc(message: Message):
    await message.answer(f"Fayl qabul qilindi: {message.document.file_name}")

@dp.message(F.voice)
async def handle_voice(message: Message):
    await message.answer(f"Ovozli xabar: {message.voice.duration} soniya")

@dp.message(F.video)
async def handle_video(message: Message):
    await message.answer("Video qabul qilindi! 🎬")

@dp.message(F.text)
async def handle_any_text(message: Message):
    await message.answer(f"Siz yozdingiz: {message.text}")
```

### Bir nechta turni bitta handlerda ushlash
```python
@dp.message(F.content_type.in_({"photo", "video", "document"}))
async def any_media(message: Message):
    await message.answer("Media qabul qilindi ✅")
```

### Eng umumiy handler — har doim oxirida
Agar hech qaysi handlerga mos kelmagan xabarlarni ham ushlamoqchi bo'lsangiz, filtrsiz handlerni **eng pastga** yozing:

```python
@dp.message()  # filtrsiz — hammasini ushlaydi, lekin faqat yuqoridagilarga mos kelmasa
async def fallback_handler(message: Message):
    await message.answer("Kechirasiz, bu buyruqni tushunmadim.")
```

## Amaliy misol
Bir nechta xabar turini boshqaruvchi to'liq misol:

```python
from aiogram import Dispatcher, F
from aiogram.filters import CommandStart
from aiogram.types import Message

dp = Dispatcher()

@dp.message(CommandStart())
async def start(message: Message):
    await message.answer("Menga matn, rasm yoki fayl yuboring!")

@dp.message(F.photo)
async def on_photo(message: Message):
    photo_id = message.photo[-1].file_id  # [-1] — eng sifatli versiya
    await message.reply_photo(photo=photo_id, caption="Chiroyli rasm ekan! 📸")

@dp.message(F.document)
async def on_document(message: Message):
    doc = message.document
    await message.answer(f"📁 {doc.file_name} ({doc.file_size // 1024} KB)")

@dp.message(F.text)
async def on_text(message: Message):
    await message.answer(f"Siz {len(message.text)} ta belgi yozdingiz.")

@dp.message()
async def on_other(message: Message):
    await message.answer("Bu turdagi xabarni hali qo'llab-quvvatlamayman 🤔")
```

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **Filtrsiz `@dp.message()` handlerni eng yuqoriga yozish** — bu barcha keyingi handlerlarni "yutib yuboradi", ular hech qachon ishlamaydi.
- **`message.text` mavjud emasligini tekshirmasdan ishlatish** — agar foydalanuvchi rasm yuborsa, `message.text` — `None` bo'ladi, shuni tekshirmasdan `.lower()` chaqirsangiz xato chiqadi.
- **`message.photo[0]` yozish (eng kichik o'lcham) o'rniga eng sifatlisi kerak bo'lganda** — to'g'risi: `message.photo[-1]` (ro'yxatning oxiri — eng katta/sifatli versiya).

## Mashq/topshiriq
1. **(Oson)** Botga matn yuborilganda, matnning necha ta so'zdan iboratligini aytadigan handler yozing.
2. **(O'rtacha)** Foydalanuvchi rasm yuborsa "Rasm qabul qilindi", video yuborsa "Video qabul qilindi", boshqa hech narsa yuborsa "Buni tushunmadim" deb javob beruvchi 3 ta handler yozing (tartibiga e'tibor bering!).
3. **(Qiyin)** `message.from_user`dan foydalanib, foydalanuvchining ism, familiya (agar bo'lsa), va Telegram ID raqamini chiroyli formatlab qaytaruvchi `/profile` komandasi yarating.

## Qisqacha xulosa
Handler — muayyan hodisaga javob beruvchi async funksiya, u dekorator orqali ro'yxatdan o'tkaziladi va Dispatcher tomonidan **yozilish tartibida** tekshiriladi. `Message` obyekti xabar haqidagi barcha ma'lumotni (matn, yuboruvchi, media) o'zida saqlaydi. `F` magic filter yordamida turli xabar turlarini (matn, rasm, fayl) alohida-alohida boshqarish mumkin. Tor filterlar yuqorida, umumiy/filtrsiz handlerlar pastda bo'lishi — to'g'ri ishlashning kaliti.
