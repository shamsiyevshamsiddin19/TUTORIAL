# Migratsiyalar

## Bu darsda nimalarni o'rganasiz

- Migratsiya nima ekanini va nega kerakligini tushuntira olasiz
- `makemigrations` va `migrate` buyruqlari orasidagi farqni to'g'ri qo'llay olasiz
- Migratsiya faylini o'qib, u qanday SQL yaratishini tekshira olasiz
- Model o'zgarganda paydo bo'ladigan tipik muammolarni (masalan, yangi majburiy maydon) hal qila olasiz

## Nazariy qism

### Migratsiya nima va nega kerak

Siz `models.py`da Python klassi yozasiz, lekin ma'lumotlar bazasi (SQLite, PostgreSQL) buni tushunmaydi — unga SQL buyruqlari kerak (`CREATE TABLE`, `ALTER TABLE` va h.k.). **Migratsiya** — Django'ning sizning Python kodingizni avtomatik SQL'ga aylantiruvchi mexanizmi. Har safar `models.py`ni o'zgartirganingizda (yangi model, yangi maydon, maydonni o'chirish), Django bu o'zgarishni "eslab qolish" uchun alohida migratsiya fayli yaratadi, so'ngra shu faylni haqiqiy DB'ga qo'llaydi.

Bu ikki bosqichli jarayon ataylab shunday qilingan: birinchi bosqich (`makemigrations`) faqat **reja** tuzadi (fayl yaratadi, DB'ga hali tegmaydi), ikkinchi bosqich (`migrate`) esa shu rejani **haqiqatan bajaradi**. Bu sizga migratsiya faylini qo'llashdan oldin ko'rib chiqish, jamoa a'zolari bilan bo'lishish (Git orqali) imkonini beradi.

### Asosiy buyruqlar

```bash
python manage.py makemigrations      # models.py o'zgarishlari asosida migratsiya fayli yaratadi
python manage.py migrate             # migratsiyalarni haqiqiy DB'ga qo'llaydi
python manage.py sqlmigrate blog 0001  # migratsiya qanday SQL ishlatishini ko'rsatadi (debug uchun)
python manage.py showmigrations      # qaysi migratsiyalar qo'llangan/qo'llanmaganini ko'rsatadi
```

`makemigrations` bajarilgandan so'ng, `blog/migrations/0001_initial.py` kabi fayl paydo bo'ladi. Bu — oddiy Python fayli, uni ochib o'qish mumkin:

```python
# blog/migrations/0001_initial.py (qisqartirilgan)
from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=100, unique=True)),
                ("slug", models.SlugField(unique=True)),
            ],
        ),
    ]
```

### Migratsiya fayllarini Git'ga qo'shish shart

Migratsiya fayllari — loyihangiz DB tarixining "yozuvi". Ular Git'ga **albatta** qo'shilishi kerak (`.gitignore`ga qo'shilmasin!), chunki: (1) boshqa dasturchi loyihani klonlab, `migrate` buyrug'ini ishga tushirganda, aynan shu fayllar orqali DB tuzilmasini qayta yarata oladi; (2) production serverga deploy qilganda ham xuddi shu fayllar ishlatiladi. Migratsiya fayllarini Git'dan chiqarib tashlash — jamoada ishlaganda DB tuzilmasi mos kelmay qolishining eng ko'p uchraydigan sababi.

### Mavjud jadvalga yangi majburiy maydon qo'shish

Agar allaqachon ma'lumot bor jadvalga yangi, **majburiy** (`null=False`, standart qiymatsiz) maydon qo'shsangiz, Django "bu jadvalda allaqachon qatorlar bor, ularga yangi ustun uchun qanday qiymat qo'yay?" deb so'raydi:

```bash
python manage.py makemigrations
# You are trying to add a non-nullable field 'phone' to post without a default...
# 1) Provide a one-off default now
# 2) Quit and manually define a default value in models.py
```

Bunday holatda ikki to'g'ri yechim bor: yoki `default=""` kabi standart qiymat berish, yoki modelda `blank=True, null=True` qilib maydonni ixtiyoriy qilish.

## Amaliy misol

Blog loyihasida modeldan tortib DB'gacha to'liq zanjir:

```bash
# 1. Model yozildi (4-darsdagi Post, Category, Tag)
python manage.py makemigrations
# Migrations for 'blog':
#   apps/blog/migrations/0001_initial.py
#     - Create model Category
#     - Create model Tag
#     - Create model Post

# 2. Qanday SQL yaratilishini tekshirish (ixtiyoriy, lekin foydali odat)
python manage.py sqlmigrate blog 0001
# CREATE TABLE "blog_category" ("id" bigint NOT NULL PRIMARY KEY, ...);
# CREATE TABLE "blog_tag" (...);
# CREATE TABLE "blog_post" (...);

# 3. Haqiqiy DB'ga qo'llash
python manage.py migrate
# Applying blog.0001_initial... OK

# 4. Holatni tekshirish
python manage.py showmigrations blog
# blog
#  [X] 0001_initial
```

Endi `Post` modeliga yangi `views_count` maydonini qo'shamiz:

```python
class Post(models.Model):
    # ... mavjud maydonlar
    views_count = models.PositiveIntegerField(default=0)
```

```bash
python manage.py makemigrations
# Migrations for 'blog':
#   apps/blog/migrations/0002_post_views_count.py
#     - Add field views_count to post

python manage.py migrate
# Applying blog.0002_post_views_count... OK
```

`default=0` bergani uchun, bu safar Django hech qanday qo'shimcha savol bermadi — mavjud qatorlarga avtomatik `0` qiymati qo'yildi.

## Keng tarqalgan xatolar

**Xato 1:** `makemigrations`ni ishga tushirmasdan to'g'ridan-to'g'ri `migrate`ga o'tish.
❌ Agar `models.py`da o'zgarish bo'lsa-yu, `makemigrations` chaqirilmasa, `migrate` hech narsa qilmaydi — chunki hali hech qanday "reja" (migratsiya fayli) yaratilmagan.
✅ To'g'ri: har doim ketma-ket ikkalasini bajaring: avval `makemigrations` (reja tuzadi), keyin `migrate` (bajaradi) — bu ikki qadamni alohida-alohida eslab yuring.

**Xato 2:** migratsiya fayllarini `.gitignore`ga qo'shib, Git'dan chiqarib tashlash.
❌ Boshqa dasturchi (yoki production server) loyihani klonlab olganda, migratsiya fayllari yo'q bo'lsa, `migrate` DB tuzilmasini qanday yaratishni bilmaydi.
✅ To'g'ri: faqat `db.sqlite3` (haqiqiy ma'lumotlar fayli) ni `.gitignore`ga qo'shing, `migrations/` papkasidagi `.py` fayllarni hech qachon chiqarib tashlamang.

**Xato 3:** production serverda `migrate` buyrug'ini unutib, faqat kodni yangilash.
❌ Yangi model yoki maydon qo'shilgan, lekin production DB eski holatda qoladi — natijada kod ishlaydi, deb kutasiz, lekin `django.db.utils.OperationalError: no such column` kabi xatolik chiqadi.
✅ To'g'ri: har deploy jarayonida kodni yangilashdan so'ng, **albatta** `python manage.py migrate` ni ham ishga tushiring — bu deploy ketma-ketligining ajralmas qismi bo'lishi kerak.

## Mashq/topshiriq

**(Oson)** 4-darsdagi `Book`/`Author` modellaringiz uchun `makemigrations` va `migrate` buyruqlarini ishga tushiring. `showmigrations` orqali natijani tekshiring.

**(O'rtacha)** `Book` modeliga yangi, majburiy (standart qiymatsiz) `isbn = models.CharField(max_length=13)` maydonini qo'shing. `makemigrations` ishga tushirilganda Django qanday savol berishini kuzating va bitta-birligi qiymat kiritib javob bering.

**(Qiyin)** `python manage.py sqlmigrate` buyrug'idan foydalanib, `Book` modelining birinchi migratsiyasi qanday SQL yaratganini ko'ring. So'ng `Book`ga yangi `Genre` (ManyToMany) qo'shib, ikkinchi migratsiyani yarating va uning SQL'ini ham ko'ring — ikkalasi orasidagi farqni (`CREATE TABLE` vs oraliq jadval yaratilishi) tushuntirib bering.

<details>
<summary>Javoblarni ko'rish</summary>

1. `showmigrations`da `[X] 0001_initial` ko'rinishi kerak — bu migratsiya muvaffaqiyatli qo'llanganini bildiradi.
2. Django "1) Provide a one-off default now" variantini so'raydi — masalan `9789965424907` kabi 13 xonali qiymat kiritilishi mumkin; bu qiymat mavjud barcha qatorlarga bir martalik standart sifatida yoziladi.
3. Birinchi migratsiya `CREATE TABLE "app_book" (...)` beradi. `ManyToManyField` qo'shilgach, ikkinchi migratsiya alohida **oraliq jadval** (`book_genre` kabi, ikkita `ForeignKey` bilan: `book_id` va `genre_id`) yaratadi — chunki M:N bog'lanish oddiy ustun orqali emas, balki alohida "bog'lovchi" jadval orqali amalga oshiriladi.

</details>

## Qisqacha xulosa

Migratsiya — Django'ning `models.py`dagi Python kodini ma'lumotlar bazasi tushunadigan SQL'ga aylantiruvchi ikki bosqichli mexanizmi: `makemigrations` model o'zgarishlari asosida reja (fayl) tuzadi, `migrate` esa shu rejani haqiqiy DB'ga qo'llaydi; bu fayllar loyihaning DB tarixi hisoblanadi va har doim Git'ga qo'shilishi, har deploy jarayonida esa `migrate` buyrug'i albatta ishga tushirilishi shart — aks holda kod va DB tuzilmasi bir-biriga mos kelmay qoladi.
