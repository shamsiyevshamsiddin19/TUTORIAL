# 6. Filterlar

## Bu darsda nimalarni o'rganasiz
- `Command` va `CommandStart` filterlari
- `F` (magic filter) — eng ko'p ishlatiladigan vosita
- Filterlarni birlashtirish (AND mantiqi)
- Komanda argumentlarini olish (`CommandObject`)

## Nazariy qism

### Filter nima?
Filter — handler ishga tushishi uchun **qanday shart bajarilishi kerakligini** belgilaydigan qoida. `@dp.message(FILTR)` ichidagi filtr `True` qaytarsagina, handler chaqiriladi.

### Command va CommandStart
```python
from aiogram.filters import CommandStart, Command

@dp.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer("Salom!")

# Bir nechta komandani bitta funksiyaga ulash
@dp.message(Command("help", "info"))
async def cmd_help(message: Message):
    await message.answer("Yordam matni...")
```

### Komanda argumentini olish
`/start ref_12345` kabi, komandadan keyin qo'shimcha matn kelishi mumkin — buni `CommandObject` orqali olamiz:

```python
from aiogram.filters import CommandObject

@dp.message(CommandStart(deep_link=True))
async def cmd_start_with_arg(message: Message, command: CommandObject):
    referral_code = command.args
    await message.answer(f"Referal kod: {referral_code}")

# Oddiy komanda uchun ham ishlaydi: /add 5 10
@dp.message(Command("add"))
async def cmd_add(message: Message, command: CommandObject):
    if command.args is None:
        await message.answer("Foydalanish: /add 5 10")
        return
    numbers = command.args.split()
    await message.answer(f"Siz kiritdingiz: {numbers}")
```

### F — magic filter (eng qulay va ko'p qirrali)
`F` orqali `Message` obyektining istalgan maydonini tekshirish mumkin:

```python
from aiogram import F

# Aniq mos kelish (katta-kichik harf muhim)
@dp.message(F.text == "Salom")
async def salom(message: Message): ...

# Katta-kichik harfga e'tibor bermasdan, ichida bor-yo'qligini tekshirish
@dp.message(F.text.lower().contains("rahmat"))
async def rahmat(message: Message): ...

# Regex orqali
@dp.message(F.text.regexp(r"^\d+$"))
async def faqat_raqam(message: Message): ...

# Bir nechta variantdan birortasi
@dp.message(F.text.in_(["Ha", "Yo'q", "Bilmadim"]))
async def variant(message: Message): ...

# Faqat guruh xabarlarini ushlash
@dp.message(F.chat.type.in_({"group", "supergroup"}))
async def guruh_xabari(message: Message): ...

# Faqat shaxsiy chat
@dp.message(F.chat.type == "private")
async def shaxsiy_xabar(message: Message): ...

# Matn "bosh" harfidan boshlanishini tekshirish
@dp.message(F.text.startswith("/buyurtma"))
async def buyurtma(message: Message): ...
```

### StateFilter (FSM bilan ishlatiladi — 9-darsda batafsil)
```python
from aiogram.filters import StateFilter

# Faqat hech qanday holat (state) bo'lmaganda ishlaydi
@dp.message(StateFilter(None))
async def erkin_holat(message: Message): ...
```

### Filterlarni birlashtirish — AND mantiqi
Vergul bilan ajratilgan barcha filterlar **rost** bo'lishi kerak:

```python
@dp.message(Command("admin"), F.chat.type == "private")
async def admin_panel(message: Message):
    # Faqat /admin komandasi VA shaxsiy chatda bo'lsa ishlaydi
    ...
```

OR mantiqi kerak bo'lsa (ikkitadan biri) — ikkita alohida handler yozish yoki `F.text.in_([...])` ishlatish kerak.

## Amaliy misol
```python
from aiogram import Dispatcher, F
from aiogram.filters import CommandStart, Command, CommandObject
from aiogram.types import Message

dp = Dispatcher()

@dp.message(CommandStart())
async def start(message: Message):
    await message.answer("Salom! /echo <matn> yozib ko'ring.")

@dp.message(Command("echo"))
async def echo(message: Message, command: CommandObject):
    if not command.args:
        await message.answer("Foydalanish: /echo salom dunyo")
        return
    await message.answer(f"Siz aytdingiz: {command.args}")

# Faqat "ha" yoki "yo'q" so'zlariga javob
@dp.message(F.text.lower().in_(["ha", "yo'q"]))
async def javob(message: Message):
    await message.answer("Javobingiz qabul qilindi!")

# Faqat guruh ichida ishlaydigan komanda
@dp.message(Command("pin"), F.chat.type.in_({"group", "supergroup"}))
async def pin_command(message: Message):
    await message.answer("Bu buyruq faqat guruhlarda ishlaydi.")
```

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **`F.text == "salom"` bilan katta-kichik harfni hisobga olmaslik** — foydalanuvchi "Salom" yozsa, mos kelmaydi. Buning uchun `F.text.lower() == "salom"` ishlatiladi.
- **`command.args` `None` bo'lishi mumkinligini tekshirmaslik** — agar foydalanuvchi argumentsiz `/echo` yozsa, `command.args` — `None`, va `.split()` chaqirilsa xato chiqadi.
- **Vergul bilan filterlarni yozib, "OR" natija kutish** — vergul har doim **AND** degani, "yoki" emas.
- **`Command("start")` yozish (`CommandStart()` o'rniga)** — ikkalasi ham ishlaydi, lekin `CommandStart()` maxsus imkoniyatlarga (masalan, `deep_link`) ega, shuning uchun `/start` uchun u tavsiya etiladi.

## Mashq/topshiriq
1. **(Oson)** `/square 5` kabi komandani qabul qilib, 5ning kvadratini (25) qaytaradigan handler yozing (`CommandObject` yordamida).
2. **(O'rtacha)** Faqat matnida "salom" so'zi bor xabarlarga (katta-kichik harfsiz) "Va alaykum assalom!" deb javob beruvchi filter yozing.
3. **(Qiyin)** `/broadcast` komandasini faqat siz (o'zingizning Telegram ID raqamingiz) yuborganda ishlaydigan qilib yozing — `F.from_user.id == SIZNING_ID` filtridan foydalaning.

## Qisqacha xulosa
Filterlar — handlerlar qachon ishga tushishini nazorat qiluvchi shartlar. `Command`/`CommandStart` — komandalar uchun, `F` — deyarli har qanday sharoit uchun universal vosita (matn, chat turi, foydalanuvchi va h.k.). Bir nechta filterni vergul bilan yozish — **AND** mantiqini beradi. `CommandObject` orqali komandadan keyingi argumentlarni olish mumkin. Filterlarni chuqur bilish — botingizni aniq va boshqariladigan qilishning asosi.
