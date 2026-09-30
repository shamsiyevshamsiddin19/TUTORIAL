
# 📚 03-04 Kun: SQLAlchemy va PostgreSQL — Ma'lumotlar Bazasi 🗄️⚡

> **Navigatsiya:** [⬅️ 01-02 Kun (FastAPI Asoslari)](01-02-kun-fastapi-asoslari.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 05-06 Kun (JWT Autentifikatsiya) ➡️](05-06-kun-autentifikatsiya-jwt-token.md)

---
## **1-Qism: PostgreSQL O'rnatish (20 daqiqa)**

### **1-Qadam: PostgreSQL O'rnatish**

**Windows:**

1. https://www.postgresql.org/download/windows/ ga kiring
2. "Windows x86-64" yuklab oling
3. O'rnating (default sozlamalar)
4. Parolni **yodlab qoling!** (masalan: `postgres123`)
5. Port: `5432` (default)

---

**Mac:**

```bash
brew install postgresql
brew services start postgresql
```

---

**Linux (Ubuntu):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

### **2-Qadam: PostgreSQL ga Kirish**

**Windows (pgAdmin yoki CMD):**

```bash
psql -U postgres
```

Parolni kiriting.

---

**Linux:**

```bash
sudo -u postgres psql
```

---

### **3-Qadam: Database Yaratish**

```sql
-- PostgreSQL ichida:
CREATE DATABASE blog_db2;

-- Tekshirish:
\l

-- Chiqish:
\q
```

**Natija:**

```
                                  List of databases
   Name    |  Owner   | ...
-----------+----------+
 blog_db   | postgres | ...
 postgres  | postgres | ...
```

---

### **4-Qadam: Paketlarni O'rnatish**

```bash
pip install sqlalchemy psycopg2-binary python-dotenv pydantic-settings
```

**Tekshirish:**

```bash
pip list | grep -i sqlalchemy
pip list | grep -i psycopg2

#WINDOWS
pip show psycopg2
pip show sqlalchemy
```

---

## **2-Qism: Loyiha Tuzilmasi (10 daqiqa)**

### **To'liq Tuzilma:**

```
fastapi_blog/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py        ← SQLAlchemy models (DB jadvallar)
│   ├── schemas.py       ← Pydantic models (validatsiya)
│   ├── database.py      ← DB connection
│   ├── config.py        ← Environment variables
│   └── routers/
│       ├── __init__.py
│       ├── posts.py
│       └── users.py
├── .env
├── venv/
└── requirements.txt
```

---

### **Har Bir Faylning Vazifasi:**

```
database.py  → PostgreSQL ga ulanish
models.py    → Jadval strukturasi (SQLAlchemy)
schemas.py   → So'rov/Javob formati (Pydantic)
routers/     → Endpoint lar
config.py    → .env dan o'zgaruvchilar
```

---

## **3-Qism: Database Ulanishi (25 daqiqa)**

### **1-Qadam: .env Fayli**

Loyiha ildizida `.env` yarating:

```
DATABASE_URL=postgresql://postgres:postgres123@localhost/blog_db
SECRET_KEY=mening-maxfiy-kalitim-12345
DEBUG=True
```

**Muhim:** `postgres123` o'rniga o'zingizning parolingizni yozing!

---

### **2-Qadam: app/config.py**

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    debug: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
```

---

### **3-Qadam: app/database.py**

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Engine - PostgreSQL ga ulanish
engine = create_engine(settings.database_url)

# Session - har bir so'rov uchun
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base - barcha modellar shu classdan meros oladi
Base = declarative_base()

# Dependency - har endpoint uchun DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Tushuntirish:**

```
engine       → PostgreSQL server bilan bog'lanish
SessionLocal → Har bir HTTP so'rov uchun alohida session
Base         → SQLAlchemy modellar uchun ota-klass
get_db()     → Endpoint ichida db ishlatish uchun
```

---

### **4-Qadam: Ulanishni Tekshirish**

`app/` ichida `test_db.py` yarating:

```python
from .database import engine

try:
    connection = engine.connect()
    print("✅ PostgreSQL ga muvaffaqiyatli ulandi!")
    connection.close()
except Exception as e:
    print(f"❌ Xato: {e}")
```

```bash
 python -m app.test_db
```

**Kutilgan natija:**

```
✅ PostgreSQL ga muvaffaqiyatli ulandi!
```

---

**Agar xato bo'lsa:**

```
❌ Xato: connection refused
→ PostgreSQL ishlamayapti. Ishga tushiring.

❌ Xato: password authentication failed
→ .env dagi parol noto'g'ri.

❌ Xato: database "blog_db" does not exist
→ psql da: CREATE DATABASE blog_db;
```

---

## **4-Qism: SQLAlchemy Models (30 daqiqa)**

### **SQLAlchemy Nima?**

```
ORM = Object Relational Mapper

SQL:     SELECT * FROM posts WHERE id = 1;
ORM:     db.query(Post).filter(Post.id == 1).first()

SQL:     INSERT INTO posts (title, content) VALUES ('Test', 'Body');
ORM:     db.add(Post(title='Test', content='Body'))
```

---

### **app/models.py**

```python
from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

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

    # Foreign key (keyinroq User qo'shganda)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    owner = relationship("User", back_populates="posts")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    posts = relationship("Post", back_populates="owner")
```

**Tushuntirish:**

```
__tablename__  → PostgreSQL dagi jadval nomi
primary_key    → Asosiy kalit (avtomatik oshadi)
nullable=False → Majburiy maydon (NOT NULL)
unique=True    → Takrorlanmasin
server_default → DB tomonidan default qiymat
ForeignKey     → Boshqa jadvalga havola
relationship   → Python da bog'langan objectni olish
```

---

### **Jadvallarni Yaratish**

`app/main.py` ga qo'shing:

```python
from fastapi import FastAPI
from .database import engine
from . import models

# Jadvallarni yaratish (agar yo'q bo'lsa)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Blog API",
    description="FastAPI + PostgreSQL",
    version="2.0.0"
)
```

---

```python
python -m uvicorn app.main:app --reload
```

### **Tekshirish — psql da:**

```bash
psql - bu oching.

\dt
```

**Natija:**

```
          List of relations
 Schema |  Name  | Type  |  Owner
--------+--------+-------+----------
 public | posts  | table | postgres
 public | users  | table | postgres
```

Jadvallar yaratildi! 🎉

---

# Schema vs Model

### Schema (Pydantic)

- Defines **what comes in and goes out of your API**
- Validates data
- Not tied to database

👉 “API contract”

---

### Model (SQLAlchemy)

- Defines **how data is stored in the database**
- Maps to tables
- Handles persistence

👉 “Database structure”

---

### One-line difference

> **Schema = data format**
>
> **Model = data storage**

---

### Minimal example

```python
# Schema (API)
class UserSchema(BaseModel):
    name: str
```

```python
# Model (DB)
class User(Base):
    name = Column(String)
```

---

### Flow (3 steps)

1. Request → **Schema checks it**
2. Convert → Schema → Model
3. Save → **Model goes to DB**

---

That is the entire difference.

## **5-Qism: Schemas (Pydantic) (20 daqiqa)**

### **app/schemas.py**

```python
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ─── POST SCHEMAS ─────────────────────────────

class PostBase(BaseModel):
    title: str              # post title
    content: str            # post content
    published: bool = True  # default = True

class PostCreate(PostBase):
    pass  # used when creating a post (same fields as base)

class PostUpdate(PostBase):
    pass  # used when updating a post (same fields)

class PostResponse(PostBase):
    id: int                 # comes from DB
    created_at: datetime    # timestamp from DB
    owner_id: Optional[int] = None  # may be None

    class Config:
        from_attributes = True  # allows reading from ORM (DB model)

# ─── USER SCHEMAS ─────────────────────────────

class UserCreate(BaseModel):
    username: str
    email: EmailStr   # automatically checks valid email
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True  # ORM → schema conversion
```

**Muhim farq:**

```
PostCreate   → Foydalanuvchi yuboradi (input)
PostResponse → Biz qaytaramiz (output) — id, created_at bor
```

---

**EmailStr ishlatish uchun:**

```bash
python -m pip install "pydantic[email]"
```

---

## **6-Qism: Posts Router (40 daqiqa)**

### **app/routers/posts.py**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

# ─── CREATE ───────────────────────────────────
@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.PostResponse
)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
    new_post = models.Post(**post.dict())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)   # DB dan yangi ma'lumotni olish (id, created_at)
    return new_post

# ─── READ ALL ─────────────────────────────────
@router.get(
    "/",
    response_model=List[schemas.PostResponse]
)
def get_all_posts(db: Session = Depends(get_db)):
    posts = db.query(models.Post).all()
    return posts

# ─── READ ONE ─────────────────────────────────
@router.get(
    "/{post_id}",
    response_model=schemas.PostResponse
)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID={post_id} bo'lgan post topilmadi"
        )

    return post

# ─── UPDATE ───────────────────────────────────
@router.put(
    "/{post_id}",
    response_model=schemas.PostResponse
)
def update_post(
    post_id: int,
    updated_post: schemas.PostUpdate,
    db: Session = Depends(get_db)
):
    post_query = db.query(models.Post).filter(models.Post.id == post_id)
    post = post_query.first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID={post_id} bo'lgan post topilmadi"
        )

    post_query.update(updated_post.dict(), synchronize_session=False)
    db.commit()

    return post_query.first()

# ─── DELETE ───────────────────────────────────
@router.delete(
    "/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post_query = db.query(models.Post).filter(models.Post.id == post_id)
    post = post_query.first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID={post_id} bo'lgan post topilmadi"
        )

    post_query.delete(synchronize_session=False)
    db.commit()

    return None
```

---

**Tushuntirish — `Depends(get_db)`:**

```python
def get_post(post_id: int, db: Session = Depends(get_db)):
#                          ↑ FastAPI avtomatik:
#                            1. get_db() ni chaqiradi
#                            2. db session ochadi
#                            3. endpoint ga beradi
#                            4. so'rov tugagach yopadi
```

---

**Tushuntirish — `db.refresh(new_post)`:**

```python
db.add(new_post)      # Xotiraga qo'shish
db.commit()           # DB ga yozish
db.refresh(new_post)  # DB dan qayta o'qish
                      # (id, created_at ni olish uchun)
```

---

```python
python -m uvicorn app.main:app --reload
```

## **7-Qism: Users Router (30 daqiqa)**

### **Parolni Xashlash**

```bash
 python -m pip install passlib bcrypt==4.0.1  
 python -m pip install
```

---

### **app/utils/hashing.py**

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

---

### **app/routers/users.py**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..utils.hashing import hash_password

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# ─── CREATE USER ──────────────────────────────
@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.UserResponse
)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Email allaqachon borligini tekshirish
    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu email allaqachon ro'yxatdan o'tgan"
        )

    # Parolni xashlash
    hashed = hash_password(user.password)
    user.password = hashed

    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# ─── GET USER ─────────────────────────────────
@router.get(
    "/{user_id}",
    response_model=schemas.UserResponse
)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID={user_id} bo'lgan foydalanuvchi topilmadi"
        )

    return user
```

---

### **app/main.py — To'liq**

```python
from fastapi import FastAPI
from .database import engine
from . import models
from .routers import posts, users

# Jadvallarni yaratish
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Blog API",
    description="FastAPI + PostgreSQL + SQLAlchemy",
    version="2.0.0"
)

# Routerlarni ulash
app.include_router(posts.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"xabar": "Blog API ga xush kelibsiz! v2.0"}
```

---

### **Ishga Tushirish:**

```bash
python -m uvicorn app.main:app --reload
```

**Natija:**

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

---

## **8-Qism: To'liq Test (25 daqiqa)**

### **Swagger UI da Test qilish:**

`http://127.0.0.1:8000/docs`

---

### **1. Foydalanuvchi Yaratish**

`POST /users/`

```json
{
  "username": "ali",
  "email": "ali@example.com",
  "password": "parol1234"
}
```

**Kutilgan javob (201):**

```json
{
  "id": 1,
  "username": "ali",
  "email": "ali@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}
```

✅ Parol **ko'rinmaydi** — `UserResponse` da yo'q!

---

### **2. Post Yaratish**

`POST /posts/`

```json
{
  "title": "Birinchi post",
  "content": "FastAPI + PostgreSQL juda zo'r!",
  "published": true
}
```

**Kutilgan javob (201):**

```json
{
  "id": 1,
  "title": "Birinchi post",
  "content": "FastAPI + PostgreSQL juda zo'r!",
  "published": true,
  "created_at": "2024-01-15T10:31:00Z",
  "owner_id": null
}
```

---

### **3. Barcha Postlar**

`GET /posts/`

```json
[
  {
    "id": 1,
    "title": "Birinchi post",
    "content": "FastAPI + PostgreSQL juda zo'r!",
    "published": true,
    "created_at": "2024-01-15T10:31:00Z",
    "owner_id": null
  }
]
```

---

### **4. Bitta Post**

`GET /posts/1`

```json
{
  "id": 1,
  "title": "Birinchi post",
  ...
}
```

---

### **5. Topilmagan Post**

`GET /posts/999`

```json
{
  "detail": "ID=999 bo'lgan post topilmadi"
}
```

Status: **404 Not Found** ✅

---

### **6. Postni Yangilash**

`PUT /posts/1`

```json
{
  "title": "Yangilangan sarlavha",
  "content": "Yangi kontent",
  "published": false
}
```

---

### **7. Postni O'chirish**

`DELETE /posts/1`

**Javob:** Status **204 No Content** ✅

---

### **psql da Tekshirish:**

```bash
psql -U postgres -d blog_db

SELECT * FROM users;
SELECT * FROM posts;
```

**Natija:**

```
 id | username |       email        |        password         |         created_at
----+----------+--------------------+-------------------------+----------------------------
  1 | ali      | ali@example.com    | $2b$12$xH3a...          | 2024-01-15 10:30:00+00
```

Parol xashlangan! 🔐

---

## **9-Qism: Qidiruv va Pagination (20 daqiqa)**

### **app/routers/posts.py da update qiling:**

```python
from typing import List, Optional

# ─── READ ALL (qidiruv + pagination) ─────────
@router.get(
    "/",
    response_model=List[schemas.PostResponse]
)
def get_all_posts(
    db: Session = Depends(get_db),
    limit: int = 10,
    skip: int = 0,
    search: Optional[str] = ""
):
    posts = db.query(models.Post).filter(
        models.Post.title.contains(search)
    ).limit(limit).offset(skip).all()

    return posts
```

---

**Test:**

```
GET /posts/?limit=5&skip=0&search=python
GET /posts/?limit=10&skip=10
```

---

## **10-Qism: Keng Tarqalgan Xatolar va Yechimlari**

### **Xato 1: ModuleNotFoundError**

```
ModuleNotFoundError: No module named 'app'
```

**Yechim:**

```bash
# Loyiha ildizidan ishga tushiring:
python -m uvicorn app.main:app --reload
# ✅ To'g'ri

# app/ papkasi ichidan EMAS:
python -m uvicorn main:app --reload
# ❌ Noto'g'ri
```

---

### **Xato 2: Import Error**

```
ImportError: cannot import name 'declarative_base'
```

**Yechim:**

```python
# Eski usul (SQLAlchemy < 2.0):
from sqlalchemy.ext.declarative import declarative_base

# Yangi usul (SQLAlchemy >= 2.0):
from sqlalchemy.orm import declarative_base
```

---

### **Xato 3: psycopg2 Xatosi**

```
could not connect to server: Connection refused
```

**Yechim:**

```bash
# Windows:
# Services → postgresql → Start

# Linux:
sudo systemctl start postgresql

# Mac:
brew services start postgresql
```

---

### **Xato 4: orm_mode vs from_attributes**

```
PydanticUserError: `orm_mode` has been renamed to `from_attributes`
```

**Yechim:**

```python
# Pydantic v1 (eski):
class Config:
    orm_mode = True

# Pydantic v2 (yangi) — FastAPI 0.100+ bilan:
class Config:
    from_attributes = True
```

---

### **Xato 5: Table Already Exists**

```
sqlalchemy.exc.OperationalError: table "posts" already exists
```

**Yechim:**

```python
# create_all() — mavjud jadvallarni o'zgartirmaydi
# Faqat yo'q bo'lganda yaratadi — xato emas!
# Lekin struktura o'zgarsa → Alembic kerak (keyingi dars)
```

---

### **Xato 6: .env Fayl Topilmadi**

```
pydantic_settings.env_settings.EnvSettingsError
```

**Yechim:**

```bash
# .env fayli loyiha ildizida bo'lishi kerak:
fastapi_blog/
├── .env        ← shu yerda!
├── app/
│   └── ...

# app/ ichida EMAS!
```

---

## **11-Qism: requirements.txt (5 daqiqa)**

```bash
pip freeze > requirements.txt
```

**requirements.txt:**

```
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy==2.0.30
psycopg2-binary==2.9.9
pydantic[email]==2.7.1
pydantic-settings==2.2.1
passlib[bcrypt]==1.7.4
python-dotenv==1.0.1
```

---

**Boshqa kompyuterda o'rnatish:**

```bash
pip install -r requirements.txt
```

---

## **3-4 Kun Xulosasi**

### **Nima O'rgandik:**

✅ PostgreSQL o'rnatish va sozlash

✅ SQLAlchemy engine, session, Base

✅ `get_db()` dependency injection

✅ SQLAlchemy models (`__tablename__`, `Column`, `ForeignKey`)

✅ Jadvallarni avtomatik yaratish

✅ Pydantic v2 schemas (`from_attributes`)

✅ CRUD — DB bilan (`.add()`, `.commit()`, `.refresh()`, `.delete()`)

✅ Parolni xashlash (bcrypt)

✅ Email validatsiya (EmailStr)

✅ Qidiruv va Pagination

✅ Keng tarqalgan xatolar va yechimlari

---

## **Amaliy Mashqlar**

### **1. Category Modeli**

```python
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

# CRUD router yarating
```

---

### **2. Post ga Kategoriya Qo'shish**

```python
# models.py da Post ga:
category_id = Column(
    Integer,
    ForeignKey("categories.id", ondelete="SET NULL"),
    nullable=True
)
category = relationship("Category", back_populates="posts")
```

---

### **3. Foydalanuvchi Postlarini Olish**

```python
@router.get("/user/{user_id}/posts", response_model=List[schemas.PostResponse])
def get_user_posts(user_id: int, db: Session = Depends(get_db)):
    posts = db.query(models.Post).filter(
        models.Post.owner_id == user_id
    ).all()
    return posts
```

---

## **Uy Vazifasi**

### **1. PATCH Endpoint**

```python
# Faqat berilgan maydonlarni yangilash
@router.patch("/{post_id}", response_model=schemas.PostResponse)
def partial_update(post_id: int, post: schemas.PostUpdate, db: Session = Depends(get_db)):
    # exclude_unset=True — faqat yuborilgan maydonlar
    post_query = db.query(models.Post).filter(models.Post.id == post_id)
    if not post_query.first():
        raise HTTPException(status_code=404, detail="Post topilmadi")
    post_query.update(post.dict(exclude_unset=True), synchronize_session=False)
    db.commit()
    return post_query.first()
```

---

hint

### **2. Foydalanuvchi Soni bilan Post**

```python
# schemas.py
class PostWithOwner(PostResponse):
    owner: Optional['UserResponse'] = None

# Post modelida relationship ishlatib owner ma'lumotini ham qaytaring
```

---

## **Keyingi Darsda:**

**FastAPI 5-6 Kun: Autentifikatsiya (JWT)**

- JWT token nima?
- Login endpoint
- Token yaratish
- Token tekshirish (`Depends`)
- Faqat o'z postini o'chirish
- `get_current_user` dependency

**Haqiqiy xavfsizlik tizimi!** 🔐🚀

---

## **Foydali Buyruqlar:**

```bash
# Serverni ishga tushirish
python -m uvicorn app.main:app --reload

# DB ga kirish
psql -U postgres -d blog_db

# Jadvallarni ko'rish (psql ichida)
\dt

# Jadval strukturasini ko'rish
\d posts

# Barcha postlarni ko'rish (psql)
SELECT * FROM posts;

# Chiqish
\q
```

---

**Jami vaqt:** 4-5 soat tanaffuslar bilan

**Esda tuting:** Har bir xato — o'rganish imkoniyati! Debug qilishni o'rganing. ⚡🗄️

---

> **Navigatsiya:** [⬅️ 01-02 Kun (FastAPI Asoslari)](01-02-kun-fastapi-asoslari.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 05-06 Kun (JWT Autentifikatsiya) ➡️](05-06-kun-autentifikatsiya-jwt-token.md)
