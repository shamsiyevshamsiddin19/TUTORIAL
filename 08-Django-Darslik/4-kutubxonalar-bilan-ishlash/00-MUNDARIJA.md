# Django "Kutubxonalar bilan ishlash" Darsligi — Mundarija

## Bu darslik nima uchun

1- va 2-qismlarda siz Django'ning **o'zi bilan** (models, views, forms, admin) ishlashni o'rgandingiz. Lekin real loyihalarda Django kamdan-kam holda "yolg'iz" ishlaydi — deyarli har bir jiddiy loyiha o'nlab tashqi (third-party) kutubxonalarga tayanadi: sozlamalarni boshqarish uchun, formalarni chiroyli chizish uchun, autentifikatsiyani kengaytirish uchun, rasm bilan ishlash uchun, fon vazifalarni bajarish uchun, va hokazo.

Bu darslikning markazida uchta ko'nikma turadi:

1. **Kutubxonani to'g'ri tanlash** — bir xil vazifa uchun 5-10 ta kutubxona bo'lganda, qaysi birini tanlash kerakligini, qanday mezonlar bilan baholashni bilish
2. **Kutubxonani xavfsiz integratsiya qilish** — o'rnatish, sozlash, va uni loyihaning qolgan qismi bilan to'g'ri "bog'lash" (nafaqat `pip install`, balki `INSTALLED_APPS`, `settings.py`, migratsiyalar, va h.k.)
3. **Bog'liqliklarni (dependencies) boshqarish** — versiyalarni qattiq nazorat qilish, konfliktlarni oldini olish, xavfsizlik zaifliklarini tekshirish

Har bir bobda **bitta yo'nalishdagi** kutubxonalar (masalan "forma kutubxonalari", "media kutubxonalari") ko'rib chiqiladi, va ular bittalab, bir xil loyihaga — `onlayn_dokon`ga — qo'shib boriladi, shunda 09-bobga kelib siz bitta, ko'plab kutubxona bilan boyitilgan, production-ga tayyor loyihaga ega bo'lasiz.

## Darslikda ishlatilgan loyiha

- **`onlayn_dokon`** — 1-qism va 3-qismdagi bilan bir xil domen (Bo'lim, Xodim, Mijoz, Mahsulot, Buyurtma, BuyurtmaElementi). Agar siz 1- yoki 3-qismni allaqachon o'tgan bo'lsangiz, bu loyiha sizga tanish bo'ladi — biz uni endi kutubxonalar bilan boyitamiz. Agar hali o'tmagan bo'lsangiz ham, har bir bob o'zi yetarli kontekst beradi.

## To'liq mundarija

### 00-bob: Kirish — kutubxona ekotizimi

- **0.1.** Kutubxona nima, `pip` va PyPI qanday ishlaydi
- **0.2.** Kutubxonani qanday tanlash va baholash mezonlari

### 01-bob: Paket va bog'liqliklarni boshqarish

- **1.1.** `requirements.txt` va versiya pinning (`==`, `>=`, `~=`)
- **1.2.** Zamonaviy vositalar: `pip-tools` va Poetry bilan tanishuv

### 02-bob: Sozlash kutubxonalari

- **2.1.** `django-environ` bilan `.env` orqali maxfiy sozlamalarni boshqarish
- **2.2.** Ko'p muhitli (development/production) sozlamalar strukturasi

### 03-bob: Forma va frontend kutubxonalari

- **3.1.** `django-crispy-forms` + `crispy-bootstrap5` — formalarni chiroyli chizish
- **3.2.** `whitenoise` — production'da statik fayllarni to'g'ri xizmat qilish

### 04-bob: Autentifikatsiya kutubxonalari

- **4.1.** `django-allauth` — email va ijtimoiy tarmoq orqali kirish
- **4.2.** `django-axes` — brute-force hujumlaridan himoya

### 05-bob: Media va fayllar bilan ishlash kutubxonalari

- **5.1.** `Pillow` — `ImageField`, rasm validatsiyasi va o'lchamini o'zgartirish
- **5.2.** `django-storages` + `boto3` — bulutli saqlash (S3-mos xizmatlar)

### 06-bob: API qo'shimchalari

- **6.1.** `drf-spectacular` — avtomatik Swagger/OpenAPI hujjat
- **6.2.** `django-filter` va `django-cors-headers`

### 07-bob: Fon vazifalar va kesh

- **7.1.** `Celery` + `Redis` — asinxron (fon) vazifalar
- **7.2.** `django-redis` — keshlash

### 08-bob: Test va kod sifati kutubxonalari

- **8.1.** `pytest-django` va `factory_boy`
- **8.2.** `coverage.py` va `pip-audit` — xavfsizlik zaifliklarini tekshirish

### 09-bob: Yakuniy loyiha

- **9.1.** Barcha kutubxonalarni `onlayn_dokon`ga birlashtirib integratsiya qilish
- **9.2.** Yakuniy `requirements.txt`, production cheklisti va versiyalarni yangilash strategiyasi

## Qanday foydalanish kerak

Darslar ketma-ket, 0.1'dan 9.2'gacha o'qishga mo'ljallangan — har bir bob avvalgi bobda `onlayn_dokon`ga qo'shilgan kodga tayanadi. Agar faqat bitta aniq kutubxona (masalan faqat `Celery`) qiziqtirsa, tegishli bobga to'g'ridan-to'g'ri o'tish ham mumkin — har bir dars o'zi yetarli kontekst beradi.

Har bir darsning tuzilishi bir xil:

1. `Bu darsda nimalarni o'rganasiz` — nima kutilishi haqida qisqacha
2. `Nazariy qism` — tushuntirish, har doim kod bilan
3. `Amaliy misol` — real, ishlaydigan kod (`onlayn_dokon` loyihasida)
4. `Keng tarqalgan xatolar` — ❌/✅, sababi bilan
5. `Mashq/topshiriq` — Oson/O'rtacha/Qiyin, javob kaliti bilan (`<details>` ichida — avval o'zingiz yechishga harakat qiling!)
6. `Qisqacha xulosa`

Omad!
