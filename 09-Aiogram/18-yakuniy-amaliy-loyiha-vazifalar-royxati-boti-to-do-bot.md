# 18. Yakuniy Amaliy Loyiha — Vazifalar Ro'yxati Boti (To-Do Bot)

## Bu darsda nimalarni o'rganasiz
- Barcha 17 ta oldingi mavzuni bitta real loyihada qo'llash
- To'liq ishlaydigan "Vazifalar ro'yxati" (To-Do List) botini noldan qurish
- Bu botni o'zingizning keyingi Django + PostgreSQL loyihalaringizga qanday kengaytirish mumkinligi

## Loyiha haqida
**Vazifalar ro'yxati boti** — foydalanuvchi vazifa qo'sha oladi, ro'yxatini ko'ra oladi, vazifani bajarilgan deb belgilay oladi va o'chira oladi. Bu loyiha quyidagi mavzularni birlashtiradi: handlerlar, filterlar, inline klaviaturalar + CallbackData, FSM, routerlar, middleware, xatolarni boshqarish va loyiha strukturasi.

> 💡 Sodda saqlash uchun bu yerda ma'lumotlar **RAM'dagi Python lug'atida** saqlanadi. Real loyihada (sizning Django + PostgreSQL stack'ingizda) buning o'rniga chinakam bazadan foydalanasiz — pastda "Keyingi qadam" bo'limida bu haqda gap boradi.

## Loyiha strukturasi

```
todo_bot/
├── .env
├── .gitignore
├── requirements.txt
├── main.py
├── config.py
├── handlers/
│   ├── __init__.py
│   ├── tasks.py
│   └── errors.py
├── keyboards/
│   ├── __init__.py
│   └── inline.py
├── states/
│   ├── __init__.py
│   └── task_states.py
└── storage.py          # vaqtinchalik "baza" (Python lug'ati)
```

## To'liq kod

### `.env`
```
BOT_TOKEN=SIZNING_TOKENINGIZ
```

### `config.py`
```python
import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass
class Config:
    bot_token: str

def load_config() -> Config:
    return Config(bot_token=os.getenv("BOT_TOKEN"))
```

### `storage.py` — vaqtinchalik "baza"
```python
# {user_id: [{"id": 1, "text": "Non sotib olish", "done": False}, ...]}
tasks_db: dict[int, list[dict]] = {}

def get_tasks(user_id: int) -> list[dict]:
    return tasks_db.setdefault(user_id, [])

def add_task(user_id: int, text: str) -> None:
    tasks = get_tasks(user_id)
    new_id = (max((t["id"] for t in tasks), default=0)) + 1
    tasks.append({"id": new_id, "text": text, "done": False})

def toggle_task(user_id: int, task_id: int) -> None:
    for task in get_tasks(user_id):
        if task["id"] == task_id:
            task["done"] = not task["done"]

def delete_task(user_id: int, task_id: int) -> None:
    tasks_db[user_id] = [t for t in get_tasks(user_id) if t["id"] != task_id]
```

### `states/task_states.py`
```python
from aiogram.fsm.state import StatesGroup, State

class TaskStates(StatesGroup):
    waiting_for_text = State()
```

### `keyboards/inline.py`
```python
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.filters.callback_data import CallbackData

class TaskCallback(CallbackData, prefix="task"):
    action: str    # "toggle" yoki "delete"
    task_id: int

def build_tasks_kb(tasks: list[dict]):
    builder = InlineKeyboardBuilder()
    for task in tasks:
        status = "✅" if task["done"] else "⬜️"
        builder.button(
            text=f"{status} {task['text']}",
            callback_data=TaskCallback(action="toggle", task_id=task["id"])
        )
        builder.button(
            text="🗑",
            callback_data=TaskCallback(action="delete", task_id=task["id"])
        )
    builder.adjust(2)  # har bir vazifa: [matn] [o'chirish] — bir qatorda
    return builder.as_markup()
```

### `handlers/tasks.py`
```python
from aiogram import Router, F
from aiogram.filters import Command, CommandStart, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, CallbackQuery

from states.task_states import TaskStates
from keyboards.inline import build_tasks_kb, TaskCallback
from storage import get_tasks, add_task, toggle_task, delete_task

router = Router(name="tasks")


@router.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer(
        "👋 Salom! Men vazifalar ro'yxati botiman.\n\n"
        "/add — yangi vazifa qo'shish\n"
        "/list — vazifalar ro'yxatini ko'rish\n"
        "/cancel — jarayonni bekor qilish"
    )


@router.message(Command("cancel"))
async def cmd_cancel(message: Message, state: FSMContext):
    if await state.get_state() is None:
        return
    await state.clear()
    await message.answer("❌ Bekor qilindi.")


@router.message(Command("add"))
async def cmd_add(message: Message, state: FSMContext):
    await message.answer("✏️ Yangi vazifa matnini kiriting:")
    await state.set_state(TaskStates.waiting_for_text)


@router.message(TaskStates.waiting_for_text)
async def process_task_text(message: Message, state: FSMContext):
    if len(message.text) < 2:
        await message.answer("Matn juda qisqa, qayta kiriting:")
        return
    add_task(message.from_user.id, message.text)
    await state.clear()
    await message.answer(f"✅ Vazifa qo'shildi: «{message.text}»")


@router.message(Command("list"))
async def cmd_list(message: Message):
    tasks = get_tasks(message.from_user.id)
    if not tasks:
        await message.answer("📭 Ro'yxatingiz bo'sh. /add bilan vazifa qo'shing.")
        return
    await message.answer(
        "📋 Vazifalaringiz (bajarilganini belgilash uchun bosing):",
        reply_markup=build_tasks_kb(tasks)
    )


@router.callback_query(TaskCallback.filter(F.action == "toggle"))
async def cb_toggle(call: CallbackQuery, callback_data: TaskCallback):
    toggle_task(call.from_user.id, callback_data.task_id)
    tasks = get_tasks(call.from_user.id)
    await call.message.edit_reply_markup(reply_markup=build_tasks_kb(tasks))
    await call.answer("Holat yangilandi ✅")


@router.callback_query(TaskCallback.filter(F.action == "delete"))
async def cb_delete(call: CallbackQuery, callback_data: TaskCallback):
    delete_task(call.from_user.id, callback_data.task_id)
    tasks = get_tasks(call.from_user.id)
    if tasks:
        await call.message.edit_reply_markup(reply_markup=build_tasks_kb(tasks))
    else:
        await call.message.edit_text("📭 Ro'yxatingiz bo'sh.")
    await call.answer("O'chirildi 🗑")
```

### `handlers/errors.py`
```python
import logging
from aiogram import Router
from aiogram.types import ErrorEvent

router = Router(name="errors")

@router.errors()
async def global_error_handler(event: ErrorEvent):
    logging.exception(f"Xatolik: {event.exception}")
    if event.update.message:
        await event.update.message.answer("⚠️ Kutilmagan xatolik yuz berdi.")
```

### `main.py`
```python
import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage

from config import load_config
from handlers import tasks, errors

logging.basicConfig(level=logging.INFO)


async def main():
    config = load_config()
    bot = Bot(token=config.bot_token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher(storage=MemoryStorage())

    dp.include_router(tasks.router)
    dp.include_router(errors.router)

    await bot.delete_webhook(drop_pending_updates=True)
    logging.info("Bot ishga tushdi...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Bot to'xtatildi")
```

## Botni ishga tushirish
```bash
pip install aiogram python-dotenv
python main.py
```

Telegram'da botga o'ting: `/start` → `/add` → matn yozing → `/list` → tugmalarni bosib sinab ko'ring.

## Keyingi qadam: Django + PostgreSQL bilan bog'lash
Bu botda `storage.py` — RAM'dagi oddiy lug'at, bot qayta ishga tushsa barcha vazifalar yo'qoladi. Sizning haqiqiy loyihalaringizda buning o'rniga:

1. Django loyihangizda `Task` modelini yarating (`user_id`, `text`, `done` maydonlari bilan) — bu allaqachon PostgreSQL'da saqlanadi.
2. `storage.py` funksiyalarini (`get_tasks`, `add_task`, `toggle_task`, `delete_task`) Django ORM so'rovlariga almashtiring — masalan, `Task.objects.filter(user_id=...)`.
3. Django async ORM (`sync_to_async` yoki Django 4.1+dagi native async QuerySet metodlari) yordamida aiogram'ning asinxron handlerlari ichida xavfsiz chaqiring.

Bu — aynan sizning Django + aiogram + PostgreSQL stack'ingiz uchun keyingi tabiiy qadam. Agar xohlasangiz, shu integratsiya bo'yicha alohida chuqurroq darslik ham tayyorlab beraman.

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **`storage.py`dagi ma'lumotni production'da ishlatishga urinish** — bu faqat o'quv maqsadida, real loyihada har doim chinakam baza (PostgreSQL) ishlatilishi kerak.
- **`edit_reply_markup` va `edit_text`ni chalkashtirish** — birinchisi faqat tugmalarni yangilaydi (matn o'zgarmaydi), ikkinchisi butun matnni almashtiradi.
- **CallbackData'da `task_id`ni noto'g'ri tur bilan yuborish** — `TaskCallback` klassida `task_id: int` deb belgilaganimiz uchun, aiogram avtomatik ravishda uni `int`ga o'giradi; buni qo'lda `str`ga aylantirishga hojat yo'q.

## Mashq/topshiriq
1. **(Oson)** Botni ishga tushiring, kamida 3 ta vazifa qo'shing, ularni bajarilgan deb belgilang va bittasini o'chiring.
2. **(O'rtacha)** `/list` xabariga vazifalar sonini ("Sizda 3 ta vazifa bor, 1 tasi bajarilgan") qo'shing.
3. **(Qiyin)** Botga `/clear` komandasi qo'shing — bu foydalanuvchining barcha bajarilgan vazifalarini birdaniga o'chirib tashlaydi (bajarilmaganlarini qoldirib).

## Qisqacha xulosa
Tabriklaymiz! 🎉 Siz noldan boshlab, to'liq ishlaydigan, professional tuzilishga ega Telegram botini qurdingiz — handlerlar, FSM, inline klaviaturalar, CallbackData, routerlar va xato boshqaruvi bilan. Bu — sizning Django + aiogram + PostgreSQL loyihalaringiz uchun mustahkam poydevor. Keyingi qadam sifatida ushbu botni chinakam PostgreSQL bazasiga ulash, va agar kerak bo'lsa, Django bilan chuqurroq integratsiya qilishni o'rganishni tavsiya qilaman.
