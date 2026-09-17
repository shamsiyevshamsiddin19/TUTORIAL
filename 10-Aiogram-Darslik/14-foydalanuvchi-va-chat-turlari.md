# 14. Foydalanuvchi va Chat Turlari

## Bu darsda nimalarni o'rganasiz
- Telegram'dagi chat turlari (shaxsiy, guruh, kanal)
- Faqat ma'lum chat turida ishlaydigan handlerlar yozish
- O'z (custom) filter yaratish — `IsAdmin` misolida
- Guruh a'zoligi va admin huquqlarini tekshirish

## Nazariy qism

### Chat turlari
Telegram'da har bir chat `message.chat.type` orqali aniqlanadigan turga ega:

| Tur | Ma'nosi |
|---|---|
| `private` | Shaxsiy chat (bot bilan bevosita, 1-1) |
| `group` | Oddiy guruh (200 kishigacha) |
| `supergroup` | Katta guruh (200 dan ortiq, ko'proq imkoniyat bilan) |
| `channel` | Kanal (faqat adminlar yozadi, boshqalar o'qiydi) |

### Faqat ma'lum chat turida ishlaydigan handler
```python
from aiogram import F
from aiogram.types import Message

@dp.message(F.chat.type == "private")
async def only_private(message: Message):
    await message.answer("Bu buyruq faqat shaxsiy chatda ishlaydi.")

@dp.message(F.chat.type.in_({"group", "supergroup"}))
async def only_group(message: Message):
    await message.answer("Bu buyruq faqat guruhlarda ishlaydi.")
```

### Foydalanuvchi haqida ma'lumot
```python
@dp.message()
async def user_info(message: Message):
    user = message.from_user
    await message.answer(
        f"ID: {user.id}\n"
        f"Ism: {user.first_name}\n"
        f"Familiya: {user.last_name or 'yo\\'q'}\n"
        f"Username: @{user.username or 'yo\\'q'}\n"
        f"Til: {user.language_code}"
    )
```

### Custom filter yaratish — IsAdmin
Tayyor filterlar yetmasa (masalan, murakkab biznes-mantiq kerak bo'lsa), o'z filteringizni yozish mumkin — bu shunchaki `BaseFilter`dan meros oluvchi klass:

```python
from aiogram.filters import BaseFilter
from aiogram.types import Message

class IsAdmin(BaseFilter):
    def __init__(self, admin_ids: list[int]):
        self.admin_ids = admin_ids

    async def __call__(self, message: Message) -> bool:
        return message.from_user.id in self.admin_ids


@dp.message(Command("admin"), IsAdmin(admin_ids=[123456789]))
async def admin_panel(message: Message):
    await message.answer("🔑 Admin panelga xush kelibsiz!")
```

Bu filter oddiy `Command`, `F` kabi filterlar bilan bir xil tarzda, boshqa filterlar bilan birga (AND mantiqida) ishlatilishi mumkin.

### Guruhda foydalanuvchi huquqini tekshirish (Bot API orqali)
Custom filter guruh admin ekanini Telegram'dan so'rab tekshirish uchun ham ishlatilishi mumkin:

```python
class IsGroupAdmin(BaseFilter):
    async def __call__(self, message: Message, bot: Bot) -> bool:
        member = await bot.get_chat_member(chat_id=message.chat.id, user_id=message.from_user.id)
        return member.status in ("administrator", "creator")


@dp.message(Command("ban"), IsGroupAdmin())
async def ban_user(message: Message):
    await message.answer("Foydalanuvchi ban qilindi (misol).")
```

### Yangi a'zo va guruhdan chiqish hodisalari
```python
@dp.message(F.new_chat_members)
async def on_new_member(message: Message):
    for user in message.new_chat_members:
        await message.answer(f"Xush kelibsiz, {user.first_name}! 👋")

@dp.message(F.left_chat_member)
async def on_member_left(message: Message):
    await message.answer(f"{message.left_chat_member.first_name} guruhni tark etdi. 👋")
```

## Amaliy misol
Admin va oddiy foydalanuvchi uchun ajratilgan to'liq misol:

```python
from aiogram import Dispatcher, F
from aiogram.filters import Command, BaseFilter
from aiogram.types import Message

ADMIN_IDS = [123456789]

class IsAdmin(BaseFilter):
    async def __call__(self, message: Message) -> bool:
        return message.from_user.id in ADMIN_IDS

dp = Dispatcher()

@dp.message(Command("panel"), IsAdmin())
async def admin_panel(message: Message):
    await message.answer("🔑 Siz adminsiz, panel:\n/stats\n/broadcast")

@dp.message(Command("panel"))
async def user_denied(message: Message):
    await message.answer("❌ Sizda bu buyruqqa ruxsat yo'q.")

@dp.message(F.chat.type == "private", Command("id"))
async def show_my_id(message: Message):
    await message.answer(f"Sizning ID'ingiz: {message.from_user.id}")
```

> 📌 Diqqat qiling: yuqorida `admin_panel` handleri **yuqorida**, umumiy `user_denied` handleri **pastda** yozilgan — bu tartib muhim (10-darsda ko'rganimizdek).

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **Admin ID'larni to'g'ridan-to'g'ri kodga yozib qo'yish** — bular ham `.env` faylida saqlanishi tavsiya etiladi (2-darsni eslang).
- **`message.chat.type` ni tekshirmasdan guruh-maxsus komandalarni yozish** — foydalanuvchi shaxsiy chatda ham chaqira oladi, bu chalkashlikka olib kelishi mumkin.
- **`get_chat_member` natijasini keshlamasdan har bir xabarda chaqirish** — bu Telegram API'ga ortiqcha yuklama beradi; katta guruhlarda vaqtinchalik keshlash (masalan, 5 daqiqaga) tavsiya etiladi.
- **`new_chat_members` va oddiy xabarni farqlamaslik** — bu maxsus hodisa, oddiy `F.text` handleri bilan aralashtirilmasligi kerak.

## Mashq/topshiriq
1. **(Oson)** `IsAdmin` custom filter yozing va uni `/panel` komandasi bilan sinab ko'ring (o'z Telegram ID'ingizni admin sifatida qo'shing).
2. **(O'rtacha)** Guruhga yangi a'zo qo'shilganda, unga guruh qoidalarini o'z ichiga olgan xushomad xabari yuboruvchi handler yozing.
3. **(Qiyin)** `IsGroupAdmin` custom filter yozing (Bot API'dan `get_chat_member` orqali) va u faqat guruh administratorlariga ruxsat beradigan `/pin` (xabarni mahkamlash) komandasini himoya qilishini tekshiring.

## Qisqacha xulosa
Telegram'da chat turlari (`private`, `group`, `supergroup`, `channel`) — `message.chat.type` orqali aniqlanadi va `F.chat.type` bilan filtrlanadi. Tayyor filterlar yetmagan murakkab holatlar uchun `BaseFilter`dan meros oluvchi **custom filter** yaratish mumkin (masalan, `IsAdmin`). Bu filterlar boshqa filterlar bilan bir xil tarzda ishlatiladi va kodni toza, qayta ishlatiladigan qiladi.
