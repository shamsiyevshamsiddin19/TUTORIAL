# Django nima va muhitni tayyorlash

## Bu darsda nimalarni o'rganasiz

- Django nima ekanini va uni qачон tanlash kerakligini tushuntira olasiz
- Virtual muhit (`venv`) yarata va faollashtira olasiz
- Django'ni o'rnatib, versiyasini tekshira olasiz
- `requirements.txt` fayl orqali loyiha kutubxonalarini boshqara olasiz

## Nazariy qism

### Django nima va nega aynan u

**Django** — Python tilida yozilgan, "batteries included" (hammasi tayyor holda keladi) falsafasidagi backend freymvork. Bu degani: ORM (ma'lumotlar bazasi bilan ishlash), admin panel, autentifikatsiya tizimi, formalar, xavfsizlik himoyasi — hammasi Django'ning o'zida tayyor holda keladi, siz ularni noldan yozishingiz shart emas. Instagram, Pinterest, Mozilla kabi yirik loyihalar aynan Django asosida qurilgan.

Solishtirish uchun: Flask yoki FastAPI sizga "bo'sh varaq" beradi — har bir narsani (ORM, admin, autentifikatsiya) o'zingiz tanlab qo'shasiz. Django esa "to'liq jihozlangan uy" beradi — devorlar, elektr, suv allaqachon bor, sizga faqat mebel qo'yish qoladi. Shu sababli Django ayniqsa quyidagi holatlarda kuchli tanlov: admin panel talab qilinadigan loyihalar (do'kon, CRM, kontent boshqaruv), tez muddatda ishga tushirish kerak bo'lgan loyihalar, va ma'lumotlar bazasi bilan og'ir ishlaydigan tizimlar.

**Versiya haqida:** ushbu kursda **Django 5.2 LTS** (Long Term Support — 2028-yilgacha rasmiy qo'llab-quvvatlanadi) asos qilib olinadi, chunki u production loyihalar uchun eng barqaror tanlov. Python versiyasi — 3.10 yoki undan yuqori kerak bo'ladi.

### Virtual muhit (venv) — nega majburiy odat

Agar Django'ni kompyuteringizga "global" o'rnatsangiz, har bir loyihangiz bitta Django versiyasini ishlatishga majbur bo'ladi. Bir loyihangiz Django 4.2 talab qilsa, ikkinchisi Django 5.2 — global o'rnatishda bu ikkalasi to'qnashadi. **Virtual muhit** — har bir loyiha uchun alohida, izolyatsiya qilingan Python muhiti yaratadi, unda o'rnatilgan kutubxonalar faqat o'sha loyihaga tegishli bo'ladi.

### O'rnatish qadamlari

```bash
# 1. Loyiha papkasini yaratish va ichiga kirish
mkdir mening_loyiham
cd mening_loyiham

# 2. Virtual muhit yaratish
python -m venv venv

# 3. Faollashtirish (operatsion tizimga qarab farq qiladi)
source venv/bin/activate      # Linux / macOS
venv\Scripts\activate         # Windows

# 4. Django'ni o'rnatish
pip install django

# 5. Versiyani tekshirish
python -m django --version
```

Faollashtirilgan virtual muhitda terminal qatorida odatda `(venv)` yozuvi paydo bo'ladi — bu sizga hozir aynan shu izolyatsiya qilingan muhitda ishlayotganingizni bildiradi.

### requirements.txt — loyiha kutubxonalari ro'yxati

Loyihangiz qanday kutubxonalarga bog'liqligini boshqa dasturchi (yoki server) bilishi uchun, ularni faylga yozib qo'yamiz:

```bash
pip freeze > requirements.txt
```

Boshqa kompyuterda (yoki serverda) loyihani ishga tushirish uchun:

```bash
pip install -r requirements.txt
```

## Amaliy misol

To'liq, boshidan oxirigacha ishlaydigan muhit tayyorlash ketma-ketligi:

```bash
mkdir blog_loyiha
cd blog_loyiha

python -m venv venv
source venv/bin/activate

pip install django django-environ

python -m django --version
# Natija: 5.2

pip freeze > requirements.txt
cat requirements.txt
# asgiref==3.8.1
# Django==5.2
# django-environ==0.11.2
# sqlparse==0.5.1
```

Shu bosqichdan so'ng loyihangiz Django ishlatishga tayyor — keyingi darsda haqiqiy Django loyihasini yaratamiz.

## Keng tarqalgan xatolar

**Xato 1:** virtual muhitni faollashtirmasdan `pip install django` buyrug'ini ishga tushirish.
❌ Bu holda Django kompyuterning **global** Python muhitiga o'rnatiladi, va boshqa loyihalar bilan versiya to'qnashuvi ehtimoli oshadi.
✅ To'g'ri: har doim avval `source venv/bin/activate` (yoki Windows'da `venv\Scripts\activate`) buyrug'ini bajaring, terminalda `(venv)` yozuvini ko'rganingizdan keyingina `pip install` qiling.

**Xato 2:** `venv` papkasini Git'ga qo'shib yuborish.
❌ Virtual muhit ichida minglab fayl bo'ladi va bu repozitoriyni og'irlashtiradi, bundan tashqari boshqa operatsion tizimda ishlamasligi mumkin.
✅ To'g'ri: `.gitignore` fayliga `venv/` qatorini qo'shing — Git faqat `requirements.txt`ni kuzatib borsin, har kim o'zi `pip install -r requirements.txt` orqali muhitni qayta yaratsin.

**Xato 3:** Django versiyasini tekshirmasdan eski qo'llanmalardagi kodni ko'chirib olish.
❌ Django 3.x va 5.x orasida ba'zi API'lar (masalan, `url()` funksiyasi endi `path()`ga almashgan) butunlay farq qiladi — eski kod xato beradi.
✅ To'g'ri: har doim `python -m django --version` bilan versiyangizni bilib turing va rasmiy hujjatning aynan shu versiyaga mos bo'limini o'qing.

## Mashq/topshiriq

**(Oson)** Kompyuteringizda `test_loyiha` nomli papka yarating, ichida virtual muhit tuzing va Django'ni o'rnating. `python -m django --version` buyrug'i natijasini yozib qo'ying.

**(O'rtacha)** `requirements.txt` faylini yarating va unga `django-environ` hamda `Pillow` kutubxonalarini ham qo'shib o'rnating (`pip install django-environ Pillow`). Faylning yakuniy tarkibini ko'ring.

**(Qiyin)** Ikkita alohida virtual muhit yarating: birida Django 5.2, ikkinchisida Django 4.2 o'rnating (`pip install django==4.2`). Ikkalasida ham `python -m django --version` ishga tushirib, natijalar farqini tushuntirib bering — nega bu ikki muhit bir-biriga ta'sir qilmaydi?

<details>
<summary>Javoblarni ko'rish</summary>

1. Natija sizning kompyuteringizda o'rnatilgan eng so'nggi Django 5.x versiyasini ko'rsatishi kerak (masalan, `5.2`).
2. `requirements.txt`da endi Django bilan bir qatorda `django-environ==X.X.X` va `Pillow==X.X.X` qatorlari ham paydo bo'ladi — versiyalar sizning o'rnatgan paytingizdagi eng so'nggi relizlarga qarab farq qilishi mumkin.
3. Ikkala muhit bir-biridan mustaqil, chunki `venv` har biri uchun alohida, izolyatsiya qilingan `site-packages` papkasi yaratadi — bitta muhitdagi o'zgarish ikkinchisiga umuman ta'sir qilmaydi. Shu sababli bitta kompyuterda turli versiyali Django loyihalarini parallel saqlash mumkin.

</details>

## Qisqacha xulosa

Django — ORM, admin panel va autentifikatsiya kabi asosiy vositalarni tayyor holda beruvchi, tez va ishonchli backend ishlab chiqishga mo'ljallangan Python freymvorki bo'lib, ayniqsa admin panel va ma'lumotlar bazasi bilan og'ir ishlaydigan loyihalarda kuchli tanlov hisoblanadi; har bir loyiha uchun alohida virtual muhit (`venv`) yaratish va uni faollashtirgandan keyingina kutubxona o'rnatish — versiyalar to'qnashuvining oldini oluvchi, professional dasturchining birinchi va o'zgarmas odati.
