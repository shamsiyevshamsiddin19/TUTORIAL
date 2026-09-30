
# 📚 07-08 Kun: Alembic — Database Migration Tizimi 🔄🗄️

> **Navigatsiya:** [⬅️ 05-06 Kun (JWT Autentifikatsiya)](05-06-kun-autentifikatsiya-jwt-token.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 09-10 Kun (CORS va Deployment) ➡️](09-10-kun-cors-va-deployment.md)

---
## **1-Qism: Migration Nima? (20 daqiqa)**

---

### **Muammo:**

```
Hozir biz qanday qilamiz?

main.py - da

models.Base.metadata.create_all(bind=engine)

Bu faqat:
✅ Jadval YO'Q bo'lsa → yaratadi
❌ Jadval BOR bo'lsa → hech narsa qilmaydi!
```

---

### **Real Hayotdagi Muammo:**

```
1-kun:  posts jadvali yaratildi (title, content)
5-kun:  "rating" ustuni kerak bo'lib qoldi
10-kun: "views" ustuni ham kerak

Nima qilish kerak?
❌ DB ni o'chirib qayta yaratish → ma'lumotlar yo'qoladi!
❌ Qo'lda SQL yozish → xavfli, tartibsiz
✅ Alembic Migration → professional yechim!
```

---

### **Alembic Nima?**

```
Alembic = SQLAlchemy uchun migration vositasi

Git kabi ishlaydi, lekin DB uchun:

v1: posts jadvali (title, content)
  ↓
v2: rating ustuni qo'shildi
  ↓
v3: views ustuni qo'shildi
  ↓
v4: views o'chirildi

Istalgan versiyaga qaytish mumkin!
```

---

### **Migration Nima Beradi:**

```
✅ DB o'zgarishlarini kuzatish (tarix)
✅ Jamoa bilan ishlashda sinxronlash
✅ Production da xavfsiz yangilash
✅ Ortga qaytarish (rollback)
✅ Avtomatik SQL generatsiya
```

---

## **2-Qism: O'rnatish (5 daqiqa)**

```bash
pyhton -m pip install alembic
```

**Tekshirish:**

```bash
alembic --version
```

**Natija:**

```
alembic 1.13.1
```

---

**requirements.txt yangilang:**

```bash
pip freeze > requirements.txt
```

---

## **3-Qism: Alembic Sozlash (20 daqiqa)**

### **1-Qadam: Alembic Initsializatsiya**

Loyiha ildizida (fastapi_blog/ papkasida):

```bash
alembic init alembic
```

**Natija — yangi fayllar:**

```
fastapi_blog/
├── alembic/
│   ├── versions/          ← Migration fayllar shu yerda
│   ├── env.py             ← Asosiy sozlama fayli
│   ├── README
│   └── script.py.mako     ← Migration shablon
├── alembic.ini            ← Konfiguratsiya
├── app/
│   └── ...
├── .env
└── requirements.txt
```

---

### **2-Qadam: alembic.ini Sozlash**

`alembic.ini` faylini oching va bu qatorni toping va **comment this line**::

```
sqlalchemy.url = driver://user:pass@localhost/dbname
```

**O'zgartiring — biz `.env` dan olamiz:**

```
# sqlalchemy.url = driver://user:pass@localhost/dbname
# ← Bu qatorni sharhlab qo'ying (o'chirmang)
```

---

### **3-Qadam: alembic/env.py Sozlash**

`alembic/env.py` faylini to'liq quyidagicha yozing:

```python
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# ─── BIZNING QO'SHIMCHALARIMIZ ────────────────
import sys
import os

# app/ papkasini path ga qo'shish
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.config import settings
from app.database import Base
from app.models import Post, User   # Barcha modellarni import!
# ──────────────────────────────────────────────

config = context.config

# .ini dagi logging sozlamalarini qo'llash
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# .env dan URL olish
config.set_main_option("sqlalchemy.url", settings.database_url)

# Modellar metadatasi — auto-generate uchun kerak
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

---

**Tushuntirish — muhim qatorlar:**

```python
# 1. app/ ni topishi uchun:
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# 2. .env dan URL olish:
config.set_main_option("sqlalchemy.url", settings.database_url)

# 3. Modellar metadatasi (jadval tuzilmasi):
target_metadata = Base.metadata

# 4. Barcha modellarni import qilish SHART!
from app.models import Post, User
# Aks holda Alembic jadvallarni ko'rmaydi!
```

---

## **4-Qism: Birinchi Migration — Asosiy Jadvallar (25 daqiqa)**

### **Muhim: Avval Eski Jadvallarni O'chirish**

Biz avval `create_all()` bilan jadvallar yaratgandik. Alembic bilan ishlash uchun ularni o'chirib, qayta yaratamiz:

```bash
psql -U postgres -d blog_db
```

```sql
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
\q
```

---

**`app/main.py` dan `create_all` ni olib tashlang:**

```python
from fastapi import FastAPI
from .routers import posts, users, auth

# ← models.Base.metadata.create_all(bind=engine)  O'CHIRILDI!

app = FastAPI(
    title="Blog API",
    description="FastAPI + PostgreSQL + JWT + Alembic",
    version="4.0.0"
)

app.include_router(posts.router)
app.include_router(users.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"xabar": "Blog API v4.0 — Alembic bilan!"}
```

---

### **Migration Yaratish:**

```bash
alembic revision --autogenerate -m "create_users_and_posts_tables"
```

**Natija:**

```
INFO  [alembic.runtime.migration] Context impl PostgreSQLImpl.
INFO  [alembic.autogenerate.compare] Detected added table 'users'
INFO  [alembic.autogenerate.compare] Detected added table 'posts'
  Generating .../alembic/versions/a1b2c3d4e5f6_create_users_and_posts_tables.py
```

---

### **Yaratilgan Fayl — ko'rib chiqing:**

`alembic/versions/a1b2c3d4e5f6_create_users_and_posts_tables.py`

```python
"""create_users_and_posts_tables

Revision ID: a1b2c3d4e5f6
Revises:
Create Date: 2024-01-15 10:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'a1b2c3d4e5f6'
down_revision = None       # ← Oldingi migration (birinchisi None)
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Jadvallarni yaratish
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True),
                  server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_table('posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('published', sa.Boolean(),
                  server_default='TRUE', nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True),
                  server_default=sa.text('now()'), nullable=False),
        sa.Column('owner_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'],
                                ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    # Ortga qaytarish
    op.drop_table('posts')
    op.drop_table('users')
```

---

**Tushuntirish:**

```
upgrade()   → Migratsiyani qo'llash   (oldinga)
downgrade() → Migratsiyani bekor qilish (ortga)
down_revision → Oldingi migration ID si (zanjir!)
```

---

### **Migratsiyani Qo'llash:**

```bash
alembic upgrade head
```

**`head` = eng oxirgi migration**

**Natija:**

```
INFO  [alembic.runtime.migration] Running upgrade  -> a1b2c3d4e5f6,
      create_users_and_posts_tables
```

---

### **Tekshirish:**

```bash
psql -U postgres -d blog_db
\dt
```

**Natija:**

```
              List of relations
 Schema |       Name        | Type  |  Owner
--------+-------------------+-------+----------
 public | alembic_version   | table | postgres  ← YANGI!
 public | posts             | table | postgres
 public | users             | table | postgres
```

`alembic_version` — Alembic qaysi migratsiya qo'llanganini eslab qoladi!

---

```sql
SELECT * FROM alembic_version;
```

```
 version_num
-------------
 a1b2c3d4e5f6
```

---

## **5-Qism: Yangi Ustun Qo'shish (25 daqiqa)**

### **Scenario: posts ga "rating" ustuni kerak**

---

### **1-Qadam: Model ni Yangilang**

`app/models.py` — Post classiga qo'shing:

```python
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    published = Column(Boolean, server_default="TRUE", nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now()
    )
    owner_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True
    )
    owner = relationship("User", back_populates="posts")

    # ← YANGI USTUN:
    rating = Column(Integer, nullable=True)
```

---

### **2-Qadam: Yangi Migration Yaratish**

```bash
alembic revision --autogenerate -m "rating ustun qo'shildi"
```

**Natija:**

```
INFO  [alembic.autogenerate.compare] Detected added column 'posts.rating'
  Generating .../versions/b2c3d4e5f6a7_add_rating_column_to_posts.py
```

---

### **Yaratilgan Fayl:**

```python
"""add_rating_column_to_posts

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6       ← Oldingi migration!
Create Date: 2024-01-16 10:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'b2c3d4e5f6a7'
down_revision = 'a1b2c3d4e5f6'   # ← Zanjir!
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column(
        'posts',
        sa.Column('rating', sa.Integer(), nullable=True)
    )

def downgrade() -> None:
    op.drop_column('posts', 'rating')
```

---

### **3-Qadam: Qo'llash**

```bash
alembic upgrade head
```

**Natija:**

```
INFO  [alembic.runtime.migration] Running upgrade a1b2c3d4e5f6 -> b2c3d4e5f6a7,
      add_rating_column_to_posts
```

---

### **Tekshirish:**

```bash
psql -U postgres -d blog_db
\d posts
```

**Natija:**

```
                        Table "public.posts"
   Column   |            Type             | Nullable |   Default
------------+-----------------------------+----------+-------------
 id         | integer                     | not null | nextval(...)
 title      | character varying(255)      | not null |
 content    | text                        | not null |
 published  | boolean                     | not null | true
 created_at | timestamp with time zone    | not null | now()
 owner_id   | integer                     |          |
 rating     | integer                     |          |   ← YANGI!
```

Jadval o'zgartirildi — ma'lumotlar saqlanib qoldi! ✅

---

## **6-Qism: Migration Tarixi (15 daqiqa)**

### **Migratsiya Holatini Ko'rish:**

```bash
alembic current
```

**Natija:**

```
b2c3d4e5f6a7 (head)
```

---

### **Barcha Migratsiyalar Tarixi:**

```bash
alembic history
```

**Natija:**

```
b2c3d4e5f6a7 -> (head): add_rating_column_to_posts
a1b2c3d4e5f6 -> b2c3d4e5f6a7: create_users_and_posts_tables
<base> -> a1b2c3d4e5f6: create_users_and_posts_tables
```

---

### **Batafsil Ko'rish:**

```bash
alembic history --verbose
```

**Natija:**

```
Rev: b2c3d4e5f6a7 (head)
Parent: a1b2c3d4e5f6
Path: alembic/versions/b2c3...
    add_rating_column_to_posts

    Create Date: 2024-01-16 10:00:00.000000

Rev: a1b2c3d4e5f6
Parent: <base>
Path: alembic/versions/a1b2...
    create_users_and_posts_tables

    Create Date: 2024-01-15 10:00:00.000000
```

---

## **7-Qism: Ortga Qaytarish — Rollback (20 daqiqa)**

### **Bir Qadam Ortga:**

```bash
alembic downgrade -1
```

**Natija:**

```
INFO  [alembic.runtime.migration] Running downgrade b2c3d4e5f6a7 -> a1b2c3d4e5f6,
      add_rating_column_to_posts
```

`rating` ustuni o'chirildi! Ma'lumotlar saqlanib qoldi.

---

### **Muayyan Versiyaga Qaytish:**

```bash
alembic downgrade a1b2c3d4e5f6
```

---

### **Boshiga Qaytish:**

```bash
alembic downgrade base
```

**Barcha jadvallar o'chiriladi!** (downgrade() lari ketma-ket ishlaydi)

---

### **Qaytadan Oxirigacha:**

```bash
alembic upgrade head
```

---

**Amaliy Test:**

```bash
# 1. Hozirgi holat
alembic current
# → b2c3d4e5f6a7 (head)

# 2. Bir qadam orqaga
alembic downgrade -1
# → rating ustuni o'chdi

# 3. Tekshirish
alembic current
# → a1b2c3d4e5f6

# 4. Qaytadan ilgariga
alembic upgrade head
# → rating ustuni qaytdi
alembic upgrade +1

# 5. Tekshirish
alembic current
# → b2c3d4e5f6a7 (head)
```

---

## **8-Qism: Qo'lda Migration Yozish (25 daqiqa)**

### **Ba'zan Avtomatik Ishlamaydi:**

```
Avtomatik aniqlay olmaydi:
- Ustun nomini o'zgartirish
- Maxsus constraint lar
- Index lar
- Custom SQL
```

---

### **1-Qadam: Bo'sh Migration Yaratish**

```bash
alembic revision -m "add_phone_to_users"
```

- **`-autogenerate` YO'Q — bo'sh migration!**

---

### **Yaratilgan Bo'sh Fayl:**

```python
"""add_phone_to_users

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2024-01-17 10:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'c3d4e5f6a7b8'
down_revision = 'b2c3d4e5f6a7'
branch_labels = None
depends_on = None

def upgrade() -> None:
    pass   # ← Biz yozamiz

def downgrade() -> None:
    pass   # ← Biz yozamiz
```

---

### **2-Qadam: Qo'lda Yozish**

```python
def upgrade() -> None:
    op.add_column(
        'users',
        sa.Column('phone', sa.String(20), nullable=True)
    )
    # Index ham qo'shamiz:
    op.create_index(
        'ix_users_phone',
        'users',
        ['phone'],
        unique=False
    )

def downgrade() -> None:
    op.drop_index('ix_users_phone', table_name='users')
    op.drop_column('users', 'phone')
```

---

### **3-Qadam: Model ni Ham Yangilang**

`app/models.py` — User classiga:

```python
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)   # ← YANGI
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now()
    )
    posts = relationship("Post", back_populates="owner")
```

---

### **4-Qadam: Qo'llash**

```bash
alembic upgrade head
```

---

## **9-Qism: Ustun Nomini O'zgartirish (15 daqiqa)**

### **Scenario: `content` → `body` nomini o'zgartirish**

```bash
alembic revision -m "rename_content_to_body_in_posts"
```

---

**Yozish:**

```python
def upgrade() -> None:
    op.alter_column(
        'posts',
        'content',      # Eski nom
        new_column_name='body'   # Yangi nom
    )

def downgrade() -> None:
    op.alter_column(
        'posts',
        'body',
        new_column_name='content'
    )
```

---

**Model ni yangilang:**

```python
# models.py da:
body = Column(Text, nullable=False)
# (content o'rniga)
```

---

**Qo'llash:**

```bash
alembic upgrade head
```

---

## **10-Qism: Keng Tarqalgan Xatolar (20 daqiqa)**

### **Xato 1: "Can't locate revision"**

```
alembic.util.exc.CommandError: Can't locate revision identified by 'xxxx'
```

**Sabab:** `alembic_version` jadvalida eski ID bor, fayl yo'q.

**Yechim:**

```bash
psql -U postgres -d blog_db

# Qaysi versiya bor ekanini ko'rish:
SELECT * FROM alembic_version;

# Tozalash:
DELETE FROM alembic_version;
\q

# Qaytadan eng boshidan:
alembic upgrade head
```

---

### **Xato 2: "Target database is not up to date"**

```
ERROR [alembic] Target database is not up to date.
```

**Yechim:**

```bash
alembic upgrade head
```

---

### **Xato 3: autogenerate hech narsa topmadi**

```
No changes detected.
```

**Sabab:** Model import qilinmagan!

**Yechim:**

```python
# alembic/env.py da BARCHA modellarni import qiling:
from app.models import Post, User
# ← Yangi model qo'shsangiz, bu yerga ham qo'shing!
```

---

### **Xato 4: "Table already exists"**

```
sqlalchemy.exc.ProgrammingError: table "users" already exists
```

**Sabab:** `create_all()` va Alembic ikkalasi bir vaqtda ishlatilgan.

**Yechim:**

```python
# main.py dan create_all() ni o'chiring!
# Faqat Alembic ishlatilsin.

# Agar jadvallar allaqachon bor bo'lsa:
alembic stamp head
# → Alembic ga "hamma migration qo'llanildi" deyish
```

---

### **Xato 5: ModuleNotFoundError — env.py da**

```
ModuleNotFoundError: No module named 'app'
```

**Yechim:**

```python
# alembic/env.py boshida:
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
# ← Bu qatorlar bo'lishi SHART!
```

---

### **Xato 6: alembic buyrug'i topilmadi**

```
'alembic' is not recognized as an internal or external command
```

**Yechim:**

```bash
# Virtual environment faollashtirilganmi?
# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

# Keyin:
alembic --version
```

---

### **Xato 7: downgrade base xatosi**

```
ERROR: Foreign key constraint violation during downgrade
```

**Sabab:** ForeignKey bog'liqlik — posts users dan oldin o'chirilmagan.

**Yechim:**

```python
def downgrade() -> None:
    # Avval bog'liq jadval:
    op.drop_table('posts')
    # Keyin asosiy jadval:
    op.drop_table('users')
```

---

## **11-Qism: Schemas va Routers Yangilash (15 daqiqa)**

### **Rating ni schemas ga qo'shish:**

`app/schemas.py`:

```python
class PostBase(BaseModel):
    title: str
    content: str
    published: bool = True
    rating: Optional[int] = None    # ← YANGI

class PostResponse(PostBase):
    id: int
    created_at: datetime
    owner_id: Optional[int] = None
    owner: Optional[OwnerInfo] = None

    class Config:
        from_attributes = True
```

---

### **Serverni Ishga Tushiring:**

```bash
python -m uvicorn app.main:app --reload
```

**Swagger da test qiling:**

`POST /posts/`

```json
{
  "title": "Alembic bilan post",
  "content": "Migration ishlamoqda!",
  "published": true,
  "rating": 5
}
```

**Javob (201):**

```json
{
  "id": 1,
  "title": "Alembic bilan post",
  "content": "Migration ishlamoqda!",
  "published": true,
  "rating": 5,
  "created_at": "2024-01-17T10:00:00Z",
  "owner_id": 1
}
```

---

## **12-Qism: Loyiha Tuzilmasi — Yakuniy (5 daqiqa)**

```
fastapi_blog/
├── alembic/
│   ├── versions/
│   │   ├── a1b2c3d4e5f6_create_users_and_posts_tables.py
│   │   ├── b2c3d4e5f6a7_add_rating_column_to_posts.py
│   │   └── c3d4e5f6a7b8_add_phone_to_users.py
│   ├── env.py
│   ├── README
│   └── script.py.mako
├── alembic.ini
├── app/
│   ├── __init__.py
│   ├── main.py            (create_all YO'Q!)
│   ├── models.py          (rating, phone qo'shilgan)
│   ├── schemas.py         (rating qo'shilgan)
│   ├── database.py
│   ├── config.py
│   ├── oauth2.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── posts.py
│   │   ├── users.py
│   │   └── auth.py
│   └── utils/
│       ├── __init__.py
│       └── hashing.py
├── .env
├── .gitignore
└── requirements.txt
```

---

### **.gitignore yarating:**

```
venv/
.env
__pycache__/
*.pyc
*.pyo
.DS_Store
```

---

## **7-8 Kun Xulosasi**

### **Nima O'rgandik:**

✅ Migration nima va nima uchun kerak

✅ Alembic o'rnatish

✅ `alembic init` — sozlash

✅ `alembic/env.py` — to'g'ri sozlash

✅ `alembic revision --autogenerate` — avtomatik migration

✅ `alembic upgrade head` — qo'llash

✅ `alembic downgrade -1` — ortga qaytarish

✅ `alembic history` — tarix

✅ `alembic current` — hozirgi holat

✅ Qo'lda migration yozish

✅ Ustun qo'shish, o'zgartirish

✅ `alembic stamp head` — holatni belgilash

✅ Keng tarqalgan xatolar va yechimlari

---

## **Alembic Buyruqlar — To'liq Jadval**

```bash
# Initsializatsiya
alembic init alembic

# Migration yaratish (avtomatik)
alembic revision --autogenerate -m "tavsif"

# Migration yaratish (qo'lda)
alembic revision -m "tavsif"

# Eng oxirigacha qo'llash
alembic upgrade head

# N ta qadam ilgari
alembic upgrade +2

# Muayyan versiyaga
alembic upgrade a1b2c3d4e5f6

# Bir qadam orqaga
alembic downgrade -1

# Eng boshiga qaytish
alembic downgrade base

# Hozirgi versiya
alembic current

# Tarix
alembic history
alembic history --verbose

# Holatni belgilash (migratsiya qo'llamay)
alembic stamp head
alembic stamp base
```

---

## **Amaliy Mashqlar**

### **1. Yangi Jadval — Category**

```python
# models.py ga Category qo'shing:
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

# Keyin:
# alembic revision --autogenerate -m "add_categories_table"
# alembic upgrade head
```

---

### **2. Post ga Category Bog'lash**

```python
# models.py → Post classiga:
category_id = Column(
    Integer,
    ForeignKey("categories.id", ondelete="SET NULL"),
    nullable=True
)

# Keyin migration!
```

---

### **3. Rollback Amaliyoti**

```bash
# 1. Hozirgi holatni ko'ring
alembic history

# 2. Ikki qadam orqaga
alembic downgrade -2

# 3. Tekshiring
alembic current
psql -d blog_db -c "\dt"

# 4. Qaytadan oldiniga
alembic upgrade head
```

---

## **Uy Vazifasi**

### **1. Updated_at Ustuni**

```python
# Post ga "updated_at" ustuni qo'shing:
updated_at = Column(
    TIMESTAMP(timezone=True),
    nullable=True,
    onupdate=func.now()
)
# Migration yarating va qo'llang
```

---

### **2. is_active Ustuni**

```python
# User ga "is_active" ustuni:
is_active = Column(Boolean, server_default="TRUE", nullable=False)

# Faqat aktiv userlar login qila olsin:
# auth.py da:
if not user.is_active:
    raise HTTPException(
        status_code=403,
        detail="Hisobingiz faol emas"
    )
```

---

### **3. Migration Tarixi**

```
Barcha migratsiyalaringizni ro'yxatlab chiqing:
- Qaysi migration nima qiladi?
- down_revision zanjiri to'g'rimi?
- downgrade() to'g'ri yozilganmi?
```

---

## **Keyingi Darsda:**

**FastAPI 9-10 Kun: CORS va Deployment**

- CORS nima va nima uchun kerak?
- FastAPI da CORS sozlash
- Frontend bilan ishlash
- Uvicorn production sozlamalari
- Gunicorn + Uvicorn
- Environment bo'yicha sozlamalar (dev/prod)
- Render.com ga deploy qilish (bepul!)
- Railway ga deploy qilish

**Loyihani internetga chiqaramiz!** 🌐🚀

---

## **Foydali Buyruqlar — Xulosa:**

```bash
# Alembic sozlash
alembic init alembic

# Har safar model o'zgartirish keyin:
alembic revision --autogenerate -m "tavsif"
alembic upgrade head

# Tekshirish
alembic current
alembic history

# Muammo bo'lsa
alembic downgrade base
alembic upgrade head
```

---

**Jami vaqt:** 4-5 soat tanaffuslar bilan

**Esda tuting:** Har bir DB o'zgarish uchun migration yarating. Hech qachon DB ni qo'lda o'zgartirmang! 🔄⚡

---

> **Navigatsiya:** [⬅️ 05-06 Kun (JWT Autentifikatsiya)](05-06-kun-autentifikatsiya-jwt-token.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 09-10 Kun (CORS va Deployment) ➡️](09-10-kun-cors-va-deployment.md)
