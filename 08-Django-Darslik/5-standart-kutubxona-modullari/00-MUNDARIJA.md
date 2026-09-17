# Django "Standart kutubxona modullari" Darsligi — Mundarija

## Bu darslik nima uchun

1-qismda siz Django bilan ishlashni o'rgandingiz, 4-qismda esa tashqi (third-party) kutubxonalarni loyihaga qo'shishni. Lekin har ikkalasi orasida uchinchi, ko'pincha e'tibordan chetda qoladigan qatlam bor: **Python'ning o'zi bilan birga keladigan standart kutubxona** (standard library) — `os`, `datetime`, `json`, `logging`, `re`, `decimal`, `uuid` va o'nlab boshqa modul.

Bu modullarni o'rnatish shart emas (`pip install` kerak emas), lekin ular Django'ning ichida allaqachon ishlab turibdi: `timezone.now()` — bu `datetime` ustidan yupqa qatlam, `TextChoices` — `enum.Enum`dan meros, `JSONField` — `json` moduli asosida, hatto parolni hash qilish ham `hashlib`ga tayanadi. Bu darslikni o'tgan dasturchi ikki narsaga erishadi:

1. **Django "sehri" ortida nima yotganini ko'radi** — nega `timezone.now()` naive emas, aware datetime qaytaradi; nega `UUIDField` ba'zan `IntegerField`dan yaxshiroq primary key; `LOGGING` sozlamasidagi `handlers`/`formatters` aslida nima.
2. **Tashqi kutubxonasiz ko'p vazifani yechadi** — CSV eksport, xotirada fayl generatsiya qilish, xavfsiz token yaratish, muhitni diagnostika qilish kabi vazifalar uchun har doim ham yangi `pip install` kerak emas — standart kutubxonaning o'zi yetarli bo'lishi mumkin.

## Darslikda ishlatilgan loyiha

- **`onlayn_dokon`** — 1-, 3- va 4-qismlardagi bilan bir xil domen (Bo'lim, Xodim, Mijoz, Mahsulot, Buyurtma, BuyurtmaElementi). Agar oldingi qismlarni o'tgan bo'lsangiz, loyiha tanish bo'ladi. Agar hali o'tmagan bo'lsangiz ham, har bir dars o'zi yetarli kontekst beradi — faqat Django asoslarini (models, views, settings) bilish kifoya.

## Kurs mantiqi

Darslar "fizik yaqinlik" tartibida joylashgan: avval fayl tizimi va yo'llar (har bir Django loyihasi `BASE_DIR`dan boshlanadi), keyin vaqt (har bir modelda `created_at` bor), keyin matn va sonlar (validatsiya, pul), keyin formatlar (JSON, CSV — API va eksport), keyin xavfsizlik (tokenlar, checksumlar), keyin xotira/vaqtinchalik fayllar (fayl generatsiya), keyin diagnostika (logging, keshlash) va nihoyat buyruq qatori (management command'lar). Har bir keyingi bob avvalgisida qurilgan `onlayn_dokon` kodiga tayanadi, 9-bobda esa hammasi bitta funksiyada — "Buyurtmalarni xavfsiz eksport qilish" — birlashadi.

## Ataylab kiritilmagan mavzular

- **`asyncio`** — Django'ning asosiy (sync) qismida kam uchraydi, alohida chuqur mavzu; qisqa eslatma bilan chegaralanadi.
- **`unittest`ning to'liq API'si** — Django'ning o'z test darsligi (`TestCase`) bor; bu yerda faqat `unittest`ning Django ostida yotgani eslatiladi, alohida bob berilmaydi.
- **`socket`, `http.client`ga past darajadagi ishlash** — veb-ilovada kamdan-kam kerak bo'ladi, `requests` kabi kutubxonalar buni qamrab oladi (4-qismda ko'rilgan yondashuv).
- **`multiprocessing`** — Django so'rov-javob siklida deyarli ishlatilmaydi; og'ir vazifalar uchun 4-qismdagi Celery to'g'ri yechim.

## To'liq mundarija

### 00-bob: Kirish — nega standart kutubxonani bilish kerak

- **0.1.** Standart kutubxona nima va Django uning ustiga qanday qurilgan
- **0.2.** `sys` va `platform` — ishlash muhiti haqida ma'lumot olish

### 01-bob: Fayl tizimi va yo'llar

- **1.1.** `pathlib.Path` — `BASE_DIR`, `MEDIA_ROOT` va fayl yo'llarini xavfsiz qurish
- **1.2.** `os` moduli — muhit o'zgaruvchilari (`os.environ`) va papka amallari

### 02-bob: Sana va vaqt

- **2.1.** `datetime` — Django'ning `timezone.now()` ostida nima yotadi, aware vs naive
- **2.2.** `zoneinfo` — mintaqaviy vaqt zonalari va foydalanuvchiga mahalliy vaqtni ko'rsatish

### 03-bob: Matn va nozik turlar

- **3.1.** `re` moduli — validatorlar, `RegexValidator` ichida nima ishlaydi
- **3.2.** `decimal` va `uuid` — pul miqdorlarini aniq hisoblash, noyob identifikatorlar

### 04-bob: Ma'lumot formatlari

- **4.1.** `json` moduli — `JSONField`, API javoblarini qo'lda serializatsiya qilish
- **4.2.** `csv` va `enum` — CSV eksport, `TextChoices` qanday ishlaydi

### 05-bob: Xavfsizlik va tasodifiylik

- **5.1.** `secrets` moduli — parolni tiklash tokeni, API kaliti generatsiyasi
- **5.2.** `hashlib` — fayl checksum, ETag, parol hashlashning ichki mexanizmi

### 06-bob: Xotira va vaqtinchalik fayllar

- **6.1.** `io.BytesIO`/`StringIO` — xotirada fayl yaratib to'g'ridan-to'g'ri yuborish
- **6.2.** `tempfile` va `shutil` — vaqtinchalik fayllar va fayl amallari

### 07-bob: Diagnostika va unumdorlik

- **7.1.** `logging` moduli — Django'ning `LOGGING` sozlamasi ostida nima yotadi
- **7.2.** `functools` va `collections` — keshlash va ma'lumotlarni guruhlash

### 08-bob: Buyruq qatori vositalari

- **8.1.** `argparse` — management command'larga argument qo'shish
- **8.2.** `subprocess` — management command ichidan tashqi buyruq chaqirish

### 09-bob: Yakuniy loyiha

- **9.1.** `onlayn_dokon`ga xavfsiz eksport funksiyasini qo'shish (barcha modullar birlashadi)
- **9.2.** Yakuniy cheklist — qaysi vazifada qaysi stdlib modulini eslash kerak

## Qanday foydalanish kerak

Darslar ketma-ket, 0.1'dan 9.2'gacha o'qishga mo'ljallangan — 9-bob avvalgi barcha boblarda yozilgan koddan foydalanadi. Faqat bitta aniq modul (masalan faqat `logging`) qiziqtirsa, tegishli darsga to'g'ridan-to'g'ri o'tish ham mumkin — har bir dars o'zi yetarli kontekst beradi.

Har bir darsning tuzilishi bir xil:

1. `Bu darsda nimalarni o'rganasiz` — nima kutilishi haqida qisqacha
2. `Nazariy qism` — tushuntirish, har doim kod bilan
3. `Amaliy misol` — real, ishlaydigan kod (`onlayn_dokon` loyihasida)
4. `Keng tarqalgan xatolar` — ❌/✅, sababi bilan
5. `Mashq/topshiriq` — Oson/O'rtacha/Qiyin, javob kaliti bilan (`<details>` ichida — avval o'zingiz yechishga harakat qiling!)
6. `Qisqacha xulosa`

Omad!
