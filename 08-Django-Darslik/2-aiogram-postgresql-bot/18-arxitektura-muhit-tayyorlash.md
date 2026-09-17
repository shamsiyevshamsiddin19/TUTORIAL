# Arxitektura g'oyasi va muhitni tayyorlash

## Bu darsda nimalarni o'rganasiz

- Django va Aiogram'ni bitta loyihada birlashtirish arxitekturasini tasvirlay olasiz
- Bu kombinatsiyaning nega kuchli ekanini tushuntira olasiz
- Django (sync) va Aiogram (async) orasidagi asosiy texnik farqni ajrata olasiz
- Loyiha uchun barcha kerakli kutubxonalarni o'rnata olasiz

## Nazariy qism

### Nega Django + Aiogram + PostgreSQL

1-bo'limda siz Django'ni — ORM, admin panel, web interfeys yaratish vositasi sifatida — chuqur o'rgandingiz. Endi shu bilimni butunlay boshqa turdagi ilovaga, Telegram botga, qo'llaysiz. Bu kombinatsiya nega kuchli:

- Bot ma'lumotlarini (foydalanuvchilar, tovarlar, buyurtmalar) qo'lda SQL yozmasdan, allaqachon bilgan Django ORM orqali boshqarasiz.
- Django admin panelidan tayyor, chiroyli web-interfeys orqali bot ma'lumotlarini ko'rish/tahrirlash — buni noldan yozish o'rniga, 6-darsda o'rgangan bir necha qatorli kod bilan olasiz.
- PostgreSQL — bir vaqtning o'zida botdan (yozish) va admin paneldan (o'qish/yozish) kelayotgan so'rovlarni ishonchli boshqaradigan, production-darajadagi DB.

**Oldindan talab qilinadi:** 1-bo'limdagi Django asoslari (models, admin, ORM) hamda Aiogram 3'ning asosiy tushunchalari (handler, filter, FSM). Agar Aiogram bilan hali umuman tanish bo'lmasangiz, avval alohida Aiogram darsligini ko'rib chiqing — bu bo'lim ikkalasini **bir-biriga ulash**ga qaratilgan, Aiogram'ning o'zini noldan o'rgatmaydi.

### Arxitektura g'oyasi — bitta loyiha, ikkita jarayon

Muhim tushuncha: bu **bitta Django loyihasi**, ichida **ikkita mustaqil jarayon** sifatida ishga tushadi:

| Jarayon | Buyruq | Vazifasi |
|---|---|---|
| **Web/Admin** | `python manage.py runserver` (production'da Gunicorn) | Admin panel — tovarlar, buyurtmalarni ko'rish/boshqarish |
| **Bot** | `python manage.py runbot` (o'zimiz yozadigan maxsus buyruq, 25-darsda) | Aiogram polling tsikli — Telegram bilan muloqot |

Ikkalasi ham **bitta kod bazasi**, **bitta `models.py`** va **bitta PostgreSQL**ga ulanadi:

```
                     ┌──────────────────────┐
                     │   PostgreSQL (DB)     │
                     └───────────▲───────────┘
                                 │
                 ┌───────────────┴────────────────┐
                 │                                  │
   ┌─────────────┴─────────────┐      ┌─────────────┴─────────────┐
   │   Django admin (web)       │      │   Aiogram bot (polling)    │
   │   manage.py runserver      │      │   manage.py runbot         │
   │   — sync, WSGI              │      │   — async, asyncio         │
   └─────────────────────────────┘      └─────────────────────────────┘
        Admin: tovar qo'shadi                Foydalanuvchi: /shop bosadi
        Admin: buyurtmani tasdiqlaydi         Bot: tovarlarni ko'rsatadi,
                                                buyurtmani DB'ga yozadi
```

### Sync va Async — markaziy texnik nozik joy

Django tarixan **sinxron** (sync) freymvork sifatida qurilgan — har bir so'rov, so'rov tugaguncha, ketma-ket qayta ishlanadi. Aiogram esa to'liq **asinxron** (async) — u bir vaqtning o'zida minglab foydalanuvchi bilan, kutish vaqtlarida boshqa vazifalarga o'tib, muloqot qila oladi.

Bu ikki dunyoni to'g'ri bog'lash — butun ushbu bo'limning markaziy mavzusi:

- Django'ning **async ORM** interfeysidan (`aget`, `acreate`, `aiterator` va h.k., Django 4.1+ dan boshlab mavjud) foydalanamiz — bu 22-darsda batafsil ko'riladi.
- Sync va async kodni bog'lash uchun `asgiref` kutubxonasining `sync_to_async`/`async_to_sync` funksiyalaridan foydalanamiz — bu 23 va 26-darslarda ko'riladi.

Agar bu ikki dunyoni noto'g'ri aralashtirsangiz (masalan, async handler ichida oddiy sinxron ORM metodini chaqirsangiz), Django aniq `SynchronousOnlyOperation` xatosini beradi — bu 23-darsda batafsil hal qilinadi.

## Amaliy misol

Muhitni tayyorlash — barcha kerakli kutubxonalar bilan, noldan:

```bash
mkdir telegram_shop_bot && cd telegram_shop_bot

python -m venv venv
source venv/bin/activate      # Linux/macOS
# venv\Scripts\activate       # Windows

pip install django aiogram django-environ psycopg2-binary asgiref

pip freeze > requirements.txt
```

Har bir kutubxonaning vazifasi:

| Kutubxona | Vazifasi |
|---|---|
| `django` | ORM, admin panel, loyiha skeleti (1-bo'limdan tanish) |
| `aiogram` | Telegram bot freymvorki |
| `django-environ` | `.env`dan sozlamalarni (shu jumladan `DATABASE_URL`) o'qish |
| `psycopg2-binary` | Django'ning PostgreSQL bilan gaplashishi uchun drayver |
| `asgiref` | `sync_to_async`/`async_to_sync` — sync va async dunyolarni bog'lovchi ko'prik |

Versiyalarni tekshirish:

```bash
python -m django --version    # 5.2 (yoki undan yuqori)
python -c "import aiogram; print(aiogram.__version__)"   # 3.x
```

> ⚠️ Ushbu bo'lim **Aiogram 3.x** sintaksisiga asoslangan. Aiogram 2.x bilan API butunlay boshqacha (masalan, `Router` tushunchasi 2.x'da yo'q) — agar eski qo'llanma yoki misolga duch kelsangiz, versiyasini albatta tekshiring.

## Keng tarqalgan xatolar

**Xato 1:** Django va Aiogram'ni ikkita **alohida** loyiha sifatida boshlashga urinish, keyin ularni "bog'lashga" harakat qilish.
❌ Ikkita alohida Git repozitoriyasi, ikkita alohida `models.py` (bitta DB uchun ikki xil tavsif) — bu ma'lumotlarning ikki joyda takrorlanishiga va mos kelmasligiga olib keladi.
✅ To'g'ri: eng boshidanoq **bitta** Django loyihasi yarating, Aiogram kodini shu loyiha ichidagi alohida `bot` app'iga joylashtiring (19-darsda ko'rasiz) — `models.py` faqat bitta joyda bo'lsin.

**Xato 2:** Aiogram versiyasini tekshirmasdan, internetdan topilgan eski (2.x) kod namunalarini ishlatish.
❌ Aiogram 2.x'da `Dispatcher.register_message_handler()` kabi metodlar bor, 3.x'da esa `Router` va dekoratorlar orqali butunlay boshqacha yoziladi — eski kod ishlamaydi yoki import xatoligi beradi.
✅ To'g'ri: `pip show aiogram` orqali versiyani tekshiring, va faqat shu versiyaga mos hujjat/misollardan foydalaning.

**Xato 3:** sync va async orasidagi farqni "keyinroq tushunaman" deb e'tiborsiz qoldirish.
❌ Bu bo'limning eng ko'p xato beradigan joyi aynan shu — agar async handler ichida oddiy Django ORM metodi (`Model.objects.get()`) chaqirilsa, `SynchronousOnlyOperation` xatosi chiqadi va yangi boshlovchi buni tushunmay qoladi.
✅ To'g'ri: shu darsdanoq "Django — sync, Aiogram — async, ularni `asgiref` bog'laydi" tushunchasini yodda tuting — bu butun bo'limning asosi.

## Mashq/topshiriq

**(Oson)** O'zingizning kompyuteringizda `telegram_shop_bot` nomli yangi loyiha papkasi yarating, virtual muhit tuzing va barcha 5 ta kutubxonani (`django`, `aiogram`, `django-environ`, `psycopg2-binary`, `asgiref`) o'rnating. `pip freeze`orqali natijani tekshiring.

**(O'rtacha)** `python -c "import aiogram; print(aiogram.__version__)"` buyrug'ini ishga tushiring va natijani yozib qo'ying. Agar u `3.x` bo'lmasa (masalan, eski versiya o'rnatilgan bo'lsa), `pip install aiogram==3.*` orqali to'g'ri versiyaga yangilang.

**(Qiyin)** Yuqoridagi arxitektura diagrammasini (PostgreSQL — markazda, Django admin va Aiogram bot — ikki tomonda) o'z so'zlaringiz bilan, 3-4 gapda tushuntirib bering: nega ikkalasi bitta DB'ga ulanadi, va nega ular ikkita **alohida jarayon** (bitta emas) sifatida ishga tushiriladi.

<details>
<summary>Javoblarni ko'rish</summary>

1. `pip freeze` natijasida `Django==5.x`, `aiogram==3.x`, `django-environ==...`, `psycopg2-binary==...`, `asgiref==...` qatorlari ko'rinishi kerak.
2. Versiya `3.x` formatida bo'lishi kerak (masalan, `3.15.0`); agar eski bo'lsa, yangilangandan keyin qayta tekshiring.
3. Namunaviy javob: ikkalasi bitta PostgreSQL'ga ulanadi, chunki ular **bitta** ma'lumotlar to'plami (foydalanuvchilar, tovarlar, buyurtmalar) ustida ishlaydi — admin tovar qo'shsa, bot darhol shu tovarni ko'rsatishi kerak. Ular ikkita alohida jarayon sifatida ishga tushiriladi, chunki ularning ishlash tabiati butunlay boshqacha: biri (Django/Gunicorn) HTTP so'rov-javob siklida, ikkinchisi (Aiogram) uzluksiz Telegram polling tsiklida ishlaydi — bularni bitta jarayonga qo'shib bo'lmaydi.

</details>

## Qisqacha xulosa

Django + Aiogram + PostgreSQL arxitekturasi — bitta Django loyihasi ichida ikkita mustaqil jarayon (`runserver` — web/admin, `runbot` — Telegram bot) bitta umumiy PostgreSQL ma'lumotlar bazasiga ulanib ishlashiga asoslanadi; bu yerdagi eng muhim texnik nozik joy — Django'ning tarixan **sinxron**, Aiogram'ning esa to'liq **asinxron** ekanligi, va bu ikki dunyoni Django'ning async ORM metodlari hamda `asgiref`ning `sync_to_async`/`async_to_sync` funksiyalari orqali to'g'ri bog'lash — butun ushbu bo'limning markaziy mavzusidir.
