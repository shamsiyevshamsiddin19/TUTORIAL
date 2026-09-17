# Django "Kod O'qish Mahorati" Darsligi — Mundarija

## Bu darslik nima uchun

Bu — odatiy "Django'ni noldan qurish orqali o'rganish" darsligi emas. Bu darslikning markazida uchta ko'nikma turadi:

1. **Kodni ko'rganda o'qiy olish** — notanish Django kodini ochib, uni tushuna olish
2. **Kodni o'zi o'zgartira olish** — mavjud kodga ishonch bilan qo'l tekkizish, buzmasdan o'zgartirish
3. **"Qaysi kod qayerda bo'ladi"** — loyiha fayl strukturasini chuqur bilish: har bir fayl nima uchun bor, unga qanday kod yoziladi, boshqa faylga yozilsa nima buziladi

Har bir darsda tayyor kod BERILADI, uni birga o'qiymiz, tuzilishini "xaritalab" chiqamiz, keyin o'sha kodni o'zgartirish orqali mustahkamlaymiz. Barcha kod namunalari — taxmin qilinmagan, real Django + PostgreSQL sandbox'da ishga tushirilgan, aynan shu natijalar bilan yozilgan.

## Darslikda ishlatilgan loyihalar

- **`onlayn_dokon`** — asosiy o'quv loyihasi (00–06, 08–09-boblar). PostgreSQL darsligidagi `dokon_bazasi` domeniga mos: Bo'lim, Xodim, Mijoz, Mahsulot, Buyurtma, BuyurtmaElementi, XodimHujjati.
- **`kutubxona_api`** — 07-bob uchun, ataylab boshqa nom konventsiyalari bilan qurilgan, "notanish kod o'qish" mashqi (Muallif, Kitob, Azo, Ijara; Django REST Framework).
- **`kafe_tizimi`** — 10-bob (yakuniy imtihon) uchun, butunlay yangi, siz oldin ko'rmagan loyiha (Toifa, MenyuBandi, Stol, Buyurtma, BuyurtmaBandi).

## To'liq mundarija

### 00-bob: Kirish

- **0.1.** Kod o'qish — nega bu alohida mahorat va muhitni tayyorlash
- **0.2.** Birinchi loyihani yaratib, boshidan-oxirigacha o'qish

### 01-bob: Loyiha skeleti

- **1.1.** `settings.py`ni chuqur o'qish — loyihaning "miyasi"
- **1.2.** `DATABASES`ni o'qib-o'zgartirish — SQLite'dan PostgreSQL'ga o'tish

### 02-bob: App anatomiyasi

- **2.1.** App ichidagi standart fayllar — har birining vazifasi
- **2.2.** Import grafi — "kim kimni chaqiradi" va qaysi kod qayerga

### 03-bob: So'rov hayot yo'li

- **3.1.** So'rov hayot yo'li — URL'dan Response'gacha (markaziy dars)
- **3.2.** `HttpRequest` va `HttpResponse` ichini o'qish

### 04-bob: Models'ni o'qish

- **4.1.** Model maydonlari va migratsiyalar — Python kod PostgreSQL jadvaliga qanday aylanadi
- **4.2.** Modellar orasidagi bog'lanishlar — ForeignKey, OneToOne va "M2M nega yo'q"

### 05-bob: Views va Templates'ni o'qish

- **5.1.** `render()` va context — View'dan Template'ga ma'lumot qanday "oqadi"
- **5.2.** Shablon tilini chuqur o'qish — `{{ }}`, `{% %}`, `extends`/`block`, filtrlar

### 06-bob: Admin va Forms'ni o'qish

- **6.1.** `admin.py`ni chuqur o'qish — modeldan, tayyor boshqaruv paneligacha
- **6.2.** `forms.py`ni o'qish — foydalanuvchi kiritgan ma'lumot qanday tekshiriladi

### 07-bob: Notanish, real kodni o'qish

- **7.1.** Notanish loyihani birinchi marta ochish — sistematik xarita
- **7.2.** DRF: `serializers.py` va `ModelViewSet` — butunlay yangi naqshni o'qish

### 08-bob: Xatoni o'qib topish

- **8.1.** Traceback'ni oxiridan boshiga o'qish
- **8.2.** `breakpoint()`, `print` va `logging` — xatoni "ushlab", ichini ko'rish

### 09-bob: Kodni xavfsiz o'zgartirish

- **9.1.** Kodni o'zgartirishdan oldin — xavfsiz metodologiya
- **9.2.** Funksiya qo'shish — mavjudni buzmasdan kengaytirish

### 10-bob: Yakuniy imtihon

- **10.1.** Yakuniy imtihon — notanish loyihani xaritalash
- **10.2.** Yakuniy imtihon — vazifalarni bajarish

## Qanday foydalanish kerak

Darslar ketma-ket, 0.1'dan 10.2'gacha o'qishga mo'ljallangan — har bir keyingi dars oldingilarda o'rgangan bilimga tayanadi (masalan, 09-bob'dagi "xavfsiz o'zgartirish" metodologiyasi 04–08-boblardagi barcha o'qish ko'nikmalarini talab qiladi, 10-bob esa hammasini birlashtiradi).

Har bir darsning tuzilishi bir xil (10-bobdan tashqari, u alohida "yakuniy imtihon" formatida):

1. `Bu darsda nimalarni o'rganasiz` — nima kutilishi haqida qisqacha
2. `Nazariy qism` — tushuntirish, har doim kod bilan, "nega bu qator shu yerda" tahlili bilan
3. `Kodni o'qish mashqi` — natijani avval bashorat qilish, keyin tekshirish
4. `Amaliy misol` — real, sinovdan o'tgan kod
5. `Keng tarqalgan xatolar` — ❌/✅, sababi bilan
6. `Mashq/topshiriq` — Oson/O'rtacha/Qiyin, javob kaliti bilan (`<details>` ichida — avval o'zingiz yechishga harakat qiling, keyin oching!)
7. `Qisqacha xulosa`

Eng katta foyda — har bir "Kodni o'qish mashqi" va "Mashq/topshiriq"dagi savolga, javobni ochishdan oldin, **albatta o'zingiz javob berishga harakat qilishdan** keladi. Agar imkoningiz bo'lsa, loyihalarni (`onlayn_dokon`, `kutubxona_api`, `kafe_tizimi`) o'zingiz ham qayta qurib, real serverda sinab ko'rish — eng samarali usul.

Omad!
