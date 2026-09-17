# 9. FSM — Holatlar Mashinasi

## Bu darsda nimalarni o'rganasiz
- FSM nima va u qanday muammoni yechadi
- `StatesGroup`, `State`, `FSMContext` bilan ishlash
- Bosqichma-bosqich ma'lumot yig'ish (masalan, ro'yxatdan o'tish)
- `MemoryStorage` va `RedisStorage` farqi
- Har doim `/cancel` chiqish yo'lini qo'shish

## Nazariy qism

### FSM qanday muammoni yechadi?
Tasavvur qiling — botingiz foydalanuvchidan ketma-ket ma'lumot so'rashi kerak: avval ism, keyin yosh, keyin telefon raqami. Muammo: bot foydalanuvchining **qaysi bosqichda** ekanini qanday biladi? Agar foydalanuvchi "Alisher" deb yozsa, bu ism javobimi yoki boshqa narsami?

**FSM (Finite State Machine — Chekli Holatlar Mashinasi)** — har bir foydalanuvchi uchun alohida "hozir qaysi bosqichdaligini" eslab qoladi, va shu bosqichga mos handlerni ishga tushiradi.

### Asosiy tushunchalar
- **State** — bitta bosqich (masalan, "ismni kutyapman").
- **StatesGroup** — bir nechta State'ni guruhlaydigan klass (masalan, butun "ro'yxatdan o'tish" jarayoni).
- **FSMContext** — har bir foydalanuvchining joriy holatini va yig'ilgan ma'lumotlarini boshqaruvchi obyekt.

### Storage tanlash
Holatlar qayerda saqlanishini `Dispatcher` yaratilganda belgilaymiz:

```python
from aiogram.fsm.storage.memory import MemoryStorage

dp = Dispatcher(storage=MemoryStorage())
```

`MemoryStorage` — barcha holatlarni **RAM'da** saqlaydi. Oddiy, tez, lekin bot qayta ishga tushsa (xato, deploy, restart) — barcha foydalanuvchilarning holati o'chib ketadi. O'rganish va kichik loyihalar uchun yetarli.

Production'da **RedisStorage** tavsiya etiladi — bot qayta ishga tushsa ham, foydalanuvchi holati saqlanib qoladi:
```python
from aiogram.fsm.storage.redis import RedisStorage

storage = RedisStorage.from_url("redis://localhost:6379/0")
dp = Dispatcher(storage=storage)
```

### To'liq FSM misoli — ro'yxatdan o'tish

```python
from aiogram.fsm.state import StatesGroup, State
from aiogram.fsm.context import FSMContext
from aiogram.filters import Command, StateFilter

class RegState(StatesGroup):
    ism = State()
    yosh = State()
    telefon = State()

# 1. Jarayonni boshlash
@dp.message(Command("reg"))
async def start_reg(message: Message, state: FSMContext):
    await message.answer("To'liq ismingizni kiriting:")
    await state.set_state(RegState.ism)

# 2. Ismni qabul qilish (faqat RegState.ism bosqichida ishlaydi)
@dp.message(RegState.ism)
async def get_ism(message: Message, state: FSMContext):
    if len(message.text) < 2:
        await message.answer("Ism juda qisqa, qayta kiriting:")
        return  # state o'zgarmaydi — shu bosqichda qoladi
    await state.update_data(ism=message.text)   # ma'lumotni saqlash
    await message.answer("Yoshingiz nechada?")
    await state.set_state(RegState.yosh)          # keyingi bosqichga o'tish

# 3. Yoshni qabul qilish
@dp.message(RegState.yosh)
async def get_yosh(message: Message, state: FSMContext):
    if not message.text.isdigit():
        await message.answer("Faqat raqam kiriting:")
        return
    await state.update_data(yosh=int(message.text))
    await message.answer("Telefon raqamingiz (+998...):")
    await state.set_state(RegState.telefon)

# 4. Telefonni qabul qilish va yakunlash
@dp.message(RegState.telefon)
async def get_telefon(message: Message, state: FSMContext):
    data = await state.get_data()  # avval saqlangan barcha ma'lumot
    await message.answer(
        f"✅ Ro'yxatdan o'tdingiz!\n"
        f"Ism: {data['ism']}\nYosh: {data['yosh']}\nTel: {message.text}"
    )
    await state.clear()  # holatni va yig'ilgan ma'lumotni tozalash
```

### /cancel — chiqish yo'li (majburiy odat!)
```python
@dp.message(Command("cancel"))
async def cancel_handler(message: Message, state: FSMContext):
    current_state = await state.get_state()
    if current_state is None:
        return  # foydalanuvchi hech qanday jarayonda emas
    await state.clear()
    await message.answer("❌ Jarayon bekor qilindi.")
```

> 💡 **Nega bu shart?** Agar foydalanuvchi FSM bosqichida "qotib qolsa" (masalan, fikridan qaytsa) va chiqish yo'li bo'lmasa, u botning **boshqa hech qanday** buyrug'iga javob ololmaydi — chunki matn handlerlari `RegState.ism` kabi state filterga bog'langan, ular boshqa hamma narsani "yutib yuboradi".

## Amaliy misol
State ichidan boshqa handlerlarga "chiqib ketish" imkoniyatini ham ko'ramiz — masalan, ro'yxatdan o'tish jarayonida ham `/cancel` ishlashi kerak. Buni handler tartibi bilan hal qilamiz: `/cancel` handlerini **state handlerlaridan oldin** ro'yxatdan o'tkazamiz (chunki `Command("cancel")` filtri `RegState.ism` filtridan ko'ra torroq va aniqroq):

```python
dp.message.register(cancel_handler, Command("cancel"))
dp.message.register(get_ism, RegState.ism)
```

Yoki dekorator tartibi bilan — shunchaki `/cancel` handlerini kod bo'yicha yuqoriroqqa yozish kifoya.

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **`/cancel` qo'shishni unutish** — foydalanuvchi jarayonda "qotib qoladi".
- **`await state.set_state(...)` chaqirishni unutish** — bu holda bot keyingi bosqichga o'tmaydi, xuddi shu handler qayta-qayta ishlaydi.
- **Validatsiyani unutish** (masalan, yosh o'rniga harflar kiritilishi) — har doim `if not message.text.isdigit()` kabi tekshiruvlar qo'ying.
- **`state.clear()` ni chaqirishni unutish** — jarayon "tugagach" ham foydalanuvchi holatda qolib ketadi.
- **Production'da `MemoryStorage` ishlatish** — bot qayta ishga tushganda barcha foydalanuvchilarning FSM holati yo'qoladi, ular jarayonni boshidan boshlashga majbur bo'ladi.

## Mashq/topshiriq
1. **(Oson)** Foydalanuvchidan sevimli rangini so'raydigan, bitta bosqichli FSM yozing.
2. **(O'rtacha)** Ikki bosqichli "Fikr-mulohaza qoldirish" FSM yarating: avval mavzu, keyin batafsil matn so'raladi, oxirida ikkalasi birga chiqariladi.
3. **(Qiyin)** Yuqoridagi ro'yxatdan o'tish FSM'iga 4-bosqich qo'shing — "Shahringiz" — va oxirgi xabarda barcha 4 ta ma'lumotni (ism, yosh, telefon, shahar) chiroyli formatda ko'rsating. `/cancel` komandasi barcha bosqichlarda ishlashini tekshiring.

## Qisqacha xulosa
FSM — botga foydalanuvchining "qaysi bosqichda" ekanini eslab qolish va shunga mos javob berish imkonini beradi, bu ko'p bosqichli suhbatlarni (ro'yxatdan o'tish, so'rovnoma, buyurtma berish) qulay quradi. `StatesGroup` + `State` — bosqichlarni belgilaydi, `FSMContext` — holatni boshqaradi (`set_state`, `update_data`, `get_data`, `clear`). Har bir FSM jarayoniga `/cancel` qo'shish — professional botning muhim belgisi. Production'da `RedisStorage` ishlatish tavsiya etiladi.
