# 3. Async/await Asoslari

## Bu darsda nimalarni o'rganasiz
- Nega aiogram asinxron (async) ishlaydi
- `async def`, `await`, `asyncio.run()` nima qiladi
- Sinxron va asinxron kod orasidagi farq
- Aiogram kodini o'qiy olish uchun yetarli async bilim

## Nazariy qism

### Nega bu mavzu kerak?
Django'da odatda **sinxron** kod yozasiz — bir vazifa tugagach, keyingisi boshlanadi. Aiogram esa **to'liq asinxron** — bu tushunchani bilmasangiz, aiogram kodidagi `async`/`await` so'zlari nima uchun kerakligini tushunmay qolasiz.

### Sinxron vs Asinxron — oddiy tashbeh
Tasavvur qiling, siz oshxonada bitta oshpazsiz:

- **Sinxron (odatiy) usul**: Bitta taomni boshidan oxirigacha pishirasiz (masalan, suv qaynashini 10 daqiqa **kutasiz**, hech narsa qilmay), keyingina ikkinchi taomga o'tasiz. Agar 100 ta mijoz bo'lsa, ular navbat kutib charchaydi.

- **Asinxron usul**: Suvni o'tga qo'yasiz, u qaynayotgan vaqtda **boshqa taom uchun sabzi to'g'raysiz**. Suv qaynagach, o'sha ishga qaytasiz. Bitta oshpaz bo'lsangiz ham, "kutish" vaqtlarini behuda o'tkazmaysiz — shu tufayli ko'proq mijozga xizmat qila olasiz.

Bot ham xuddi shunday: bir foydalanuvchiga xabar yuborilishini "kutayotganda" (bu tarmoq orqali biroz vaqt oladi), bot boshqa foydalanuvchining xabarini qayta ishlashi mumkin.

### async def — asinxron funksiya
Oddiy funksiya o'rniga `async def` bilan e'lon qilingan funksiya — **coroutine** deb ataladi. Bunday funksiyani chaqirish uchun uni **kutish (await)** kerak:

```python
async def salom_ayt():
    print("Salom!")

# Buni to'g'ridan-to'g'ri chaqirib bo'lmaydi:
# salom_ayt()  # ❌ bu shunchaki "coroutine" obyektini yaratadi, ishga tushirmaydi

# To'g'ri usul — boshqa async funksiya ichida await bilan:
async def main():
    await salom_ayt()  # ✅
```

### await — "kutish" nuqtasi
`await` — "bu operatsiya vaqt oladi, natija kelguncha boshqa ishga o'tishing mumkin" degan ma'noni bildiradi. Odatda tarmoq so'rovlari (Telegram serveriga xabar yuborish), fayl o'qish/yozish, ma'lumotlar bazasiga so'rov kabi "kutish talab qiladigan" operatsiyalarda ishlatiladi:

```python
@dp.message(CommandStart())
async def start_handler(message: Message):
    await message.answer("Salom!")  # Telegram serveriga xabar yuborish — vaqt oladi, shuning uchun await
```

### asyncio.run() — dasturni ishga tushirish nuqtasi
Butun async dastur **bitta** joydan, `asyncio.run()` orqali ishga tushiriladi:

```python
import asyncio

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())  # butun async dunyoning "kirish eshigi"
```

### Muhim qoida
`await` faqat **`async def` ichida** ishlatilishi mumkin. Oddiy (sinxron) funksiya ichida `await` yozsangiz — `SyntaxError` chiqadi.

## Amaliy misol
Sinxron va asinxron kodning vaqt bo'yicha farqini ko'ramiz:

```python
import asyncio
import time

# --- Sinxron versiya (ketma-ket, sekin) ---
def sync_task(name, seconds):
    time.sleep(seconds)  # bloklab qo'yadi — boshqa hech narsa bajarilmaydi
    print(f"{name} tugadi")

def sync_main():
    sync_task("Vazifa 1", 2)
    sync_task("Vazifa 2", 2)
    # Jami: ~4 soniya

# --- Asinxron versiya (parallel, tez) ---
async def async_task(name, seconds):
    await asyncio.sleep(seconds)  # kutish vaqtida boshqa vazifaga ruxsat beradi
    print(f"{name} tugadi")

async def async_main():
    await asyncio.gather(
        async_task("Vazifa 1", 2),
        async_task("Vazifa 2", 2),
    )
    # Jami: ~2 soniya (ikkalasi bir vaqtda "kutadi")

asyncio.run(async_main())
```

Aiogram'da siz odatda `asyncio.gather` bilan qo'lda ishlamaysiz — freymvork buni ichida o'zi boshqaradi. Sizga faqat handlerlaringizni `async def` qilib yozish va tarmoq/DB operatsiyalarida `await` qo'yishni bilish kifoya.

## Keng tarqalgan xatolar/chalkashtiriladigan joylar
- **`await` ni unutish**: `message.answer("Salom")` (await'siz) — kod xato bermaydi, lekin xabar **yuborilmaydi** (chunki bu shunchaki bajarilmagan coroutine obyekti yaratiladi). To'g'risi: `await message.answer("Salom")`.
- **Handlerni `async def` qilib yozmaslik**: Aiogram barcha handlerlarning `async def` bo'lishini talab qiladi — oddiy `def` bilan yozilgan handler ishlamaydi.
- **`time.sleep()` ni async kod ichida ishlatish**: Bu butun botni **to'xtatib qo'yadi** (barcha foydalanuvchilar uchun)! O'rniga har doim `await asyncio.sleep()` ishlatilishi kerak.

## Mashq/topshiriq
1. **(Oson)** `async def salom(ism): print(f"Salom, {ism}")` funksiyasini yozing va uni `asyncio.run()` orqali to'g'ri chaqiring.
2. **(O'rtacha)** Yuqoridagi "sinxron vs asinxron" misolini o'zingiz kompyuteringizda ishga tushiring va ikkalasining vaqtini solishtiring (`time.time()` bilan o'lchang).
3. **(Qiyin)** `asyncio.gather()` yordamida 3 ta turli `await asyncio.sleep()` vazifasini (masalan, 1, 2, 3 soniyalik) bir vaqtda ishga tushiring va umumiy vaqt eng uzun vazifaga teng ekanligini kuzating.

## Qisqacha xulosa
Asinxron dasturlash — bitta dastur "kutish" vaqtlarida bo'sh turmasdan, boshqa vazifalarga o'tishi imkonini beradi, bu esa botga bir vaqtning o'zida ko'plab foydalanuvchiga xizmat qilish imkonini beradi. Aiogram'da har bir handler `async def` bilan yoziladi va tarmoq/DB operatsiyalari oldidan `await` qo'yiladi. Bu ikkita so'zni (`async`, `await`) to'g'ri joyda ishlatishni bilish — aiogram kodini o'qish va yozish uchun yetarli.
