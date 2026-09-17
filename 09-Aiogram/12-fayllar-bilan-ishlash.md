# 12. Fayllar Bilan Ishlash

## Bu darsda nimalarni o'rganasiz
- Rasm, video, ovoz, hujjat qabul qilish
- Faylni diskka yuklab olish
- `file_id` orqali faylni qayta yubormasdan uzatish
- Albom (media group) yuborish

## Nazariy qism

### Media fayllarni qabul qilish
Har bir media turi uchun `F` filtri bor (5-darsda ko'rgan edik):

```python
from aiogram import F
from aiogram.types import Message

@dp.message(F.photo)
async def handle_photo(message: Message):
    # message.photo — turli o'lchamdagi versiyalar ro'yxati, [-1] eng sifatlisi
    photo_id = message.photo[-1].file_id
    await message.reply_photo(photo=photo_id, caption="📸 Rasm qabul qilindi!")

@dp.message(F.video)
async def handle_video(message: Message):
    await message.answer(f"🎬 Video hajmi: {message.video.file_size // 1024} KB")

@dp.message(F.voice)
async def handle_voice(message: Message):
    await message.answer(f"🎤 Ovozli xabar: {message.voice.duration} soniya")

@dp.message(F.document)
async def handle_doc(message: Message):
    doc = message.document
    await message.answer(f"📁 {doc.file_name} ({doc.file_size // 1024} KB, {doc.mime_type})")
```

### file_id — Telegram'ning "sehrli" fayl identifikatori
Telegram'ga bir marta yuklangan har bir fayl o'ziga xos `file_id` oladi. Bu ID orqali faylni **qayta yuklamasdan**, bir zumda boshqa chatga yoki foydalanuvchiga jo'natish mumkin — bu tezroq va samaraliroq:

```python
@dp.message(F.document)
async def forward_to_admin(message: Message, bot: Bot):
    ADMIN_ID = 123456789
    await bot.send_document(
        chat_id=ADMIN_ID,
        document=message.document.file_id,
        caption=f"{message.from_user.full_name} dan fayl"
    )
```

> 💡 `file_id` — doimiy va cheksiz muddatga amal qiladi, uni ma'lumotlar bazasida saqlab, keyinchalik qayta ishlatishingiz mumkin (masalan, mahsulot rasmlarini har safar qayta yuklamasdan).

### Faylni diskka yuklab olish
Agar faylning o'zini serveringizga saqlash kerak bo'lsa:

```python
@dp.message(F.document)
async def save_document(message: Message, bot: Bot):
    destination = f"downloads/{message.document.file_name}"
    await bot.download(message.document, destination=destination)
    await message.answer("Fayl serverga saqlandi ✅")
```

### Botdan fayl yuborish
```python
from aiogram.types import FSInputFile

@dp.message(Command("hujjat"))
async def send_local_file(message: Message):
    file = FSInputFile("files/qollanma.pdf")  # kompyuterdagi lokal fayl
    await message.answer_document(file, caption="Mana qo'llanma 📄")
```

### Albom (media group) yuborish
Bir nechta rasm/videoni **birgalikda**, bitta albom sifatida yuborish:

```python
from aiogram.utils.media_group import MediaGroupBuilder

@dp.message(Command("album"))
async def send_album(message: Message):
    album = MediaGroupBuilder(caption="Umumiy tavsif barcha rasmlar ostida")
    album.add_photo(photo="AgACAgI...")   # file_id yoki URL
    album.add_photo(photo="AgACAgI...")
    album.add_video(video="BAACAgI...")
    await message.answer_media_group(media=album.build())
```

## Amaliy misol
Foydalanuvchidan rasm qabul qilib, uni serverga saqlaydigan va tasdiqlaydigan to'liq misol:

```python
import os
from aiogram import Bot, Dispatcher, F
from aiogram.types import Message

dp = Dispatcher()
os.makedirs("downloads", exist_ok=True)  # papka mavjud emasligini oldindan tekshirish

@dp.message(F.photo)
async def save_photo(message: Message, bot: Bot):
    photo = message.photo[-1]
    destination = f"downloads/{photo.file_id}.jpg"
    await bot.download(photo, destination=destination)
    await message.answer(
        f"✅ Rasm saqlandi!\n"
        f"Hajmi: {photo.width}x{photo.height}\n"
        f"Fayl: {destination}"
    )

@dp.message(F.document)
async def save_any_document(message: Message, bot: Bot):
    doc = message.document
    if doc.file_size > 20 * 1024 * 1024:  # 20 MB dan katta bo'lsa
        await message.answer("❌ Fayl juda katta (20 MB dan oshmasligi kerak).")
        return
    destination = f"downloads/{doc.file_name}"
    await bot.download(doc, destination=destination)
    await message.answer(f"✅ {doc.file_name} saqlandi!")
```

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **`message.photo[0]` ishlatish** (eng past sifat) — sifatli versiya kerak bo'lsa, har doim `message.photo[-1]` ishlatiladi.
- **`downloads/` papkasi mavjudligini tekshirmaslik** — agar papka yo'q bo'lsa, `bot.download()` xato beradi. `os.makedirs("downloads", exist_ok=True)` bilan oldindan yaratib qo'ying.
- **Har safar faylni qayta yuklab yuborish** (`file_id`dan foydalanmasdan) — bu sekin va samarasiz. Fayl bir marta yuklansa, uning `file_id`sini saqlab, keyingi safar o'shandan foydalaning.
- **Fayl hajmi cheklovlarini unutish** — botlar orqali yuborish/qabul qilishda Telegram cheklovlari bor (odatiy botlarda ~20 MB yuklab olish, ~50 MB yuborish), bu haqda foydalanuvchiga oldindan xabar berish yaxshi amaliyot.

## Mashq/topshiriq
1. **(Oson)** Foydalanuvchi video yuborsa, uning davomiyligini (soniyada) va hajmini (MB da) qaytaruvchi handler yozing.
2. **(O'rtacha)** Foydalanuvchi rasm yuborsa, uni `downloads/` papkasiga saqlab, "Rasm №X saqlandi" (X — hozirgi vaqtga asoslangan noyob raqam yoki hisoblagich) deb javob beruvchi handler yozing.
3. **(Qiyin)** `/album` komandasi bilan, foydalanuvchi ketma-ket yuborgan so'nggi 3 ta rasmni yig'ib, ularni bitta albom sifatida qaytadan yuboradigan mexanizm loyihalang (fikr uchun: rasm `file_id`larini vaqtinchalik lug'atda saqlashingiz kerak bo'ladi).

## Qisqacha xulosa
Aiogram orqali rasm, video, ovoz va hujjat kabi barcha media turlarini `F` filterlari yordamida qabul qilish mumkin. `file_id` — faylni qayta yuklamasdan tezkor uzatish imkonini beruvchi noyob identifikator. `bot.download()` — faylni serverga saqlash, `FSInputFile` — lokal faylni yuborish uchun ishlatiladi. `MediaGroupBuilder` esa bir nechta faylni bitta albom sifatida yuborishga yordam beradi.
