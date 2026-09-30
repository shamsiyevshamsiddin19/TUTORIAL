
# 📚 05-06 Kun: Autentifikatsiya — JWT Token va Xavfsizlik 🔐🚀

> **Navigatsiya:** [⬅️ 03-04 Kun (SQLAlchemy va PostgreSQL)](03-04-kun-sqlalchemy-va-postgresql.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 07-08 Kun (Alembic Migratsiyalar) ➡️](07-08-kun-alembic-migratsiyalar.md)

---
## **1-Qism: JWT Nima? (20 daqiqa)**

### **Oddiy Tushuntirish:**

```
Muammo:
HTTP — "stateless" (xotirasiz)

Har bir so'rovda server bilmaydi:
"Bu kim? Tizimga kirganmi?"
```

---

### **Yechim — JWT Token:**

```
1. Foydalanuvchi: email + parol yuboradi
2. Server: tekshiradi → JWT token yaratadi
3. Foydalanuvchi: har so'rovda token yuboradi
4. Server: tokenni tekshiradi → kim ekanini biladi
```

---

### **JWT Tuzilmasi:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiIxIiwiZXhwIjoxNzE2MDAwMDAwfQ
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

│                                          │
▼                                          ▼
[HEADER].[PAYLOAD].[SIGNATURE]

HEADER   → algoritm (HS256)
PAYLOAD  → ma'lumot (user_id, exp)
SIGNATURE → maxfiy kalit bilan imzo
```

---

### **JWT xavfsizligi:**

```
✅ Parol saqlanmaydi
✅ Server session saqlamaydi
✅ Token o'zgartirilsa — imzo buziladi
✅ Muddat tugashi (expiration) bor
❌ Tokenni o'g'irlab bo'ladi → HTTPS kerak!
```

---

## **2-Qism: Paketlarni O'rnatish (5 daqiqa)**

```bash
python -m pip install python-jose[cryptography] passlib[bcrypt] python-multipart
```

**Tushuntirish:**

```
python-jose       → JWT yaratish va tekshirish
passlib[bcrypt]   → Parolni xashlash (oldin o'rnatilgan)
python-multipart  → Form data (login uchun)
```

---

**requirements.txt yangilang:**

```bash
pip freeze > requirements.txt
```

---

## **3-Qism: Loyiha Tuzilmasi (5 daqiqa)**

```
fastapi_blog/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── config.py
│   ├── oauth2.py         ← YANGI: Token yaratish/tekshirish
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── posts.py
│   │   ├── users.py
│   │   └── auth.py       ← YANGI: Login endpoint
│   └── utils/
│       ├── __init__.py
│       └── hashing.py
├── .env
└── requirements.txt
```

---

## **4-Qism: .env Faylni Yangilash (5 daqiqa)**

`.env` fayliga qo'shing:

```
DATABASE_URL=postgresql://postgres:postgres123@localhost/blog_db
SECRET_KEY=mening-juda-maxfiy-kalitim-hech-kimga-aytmayman-12345
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

**app/config.py yangilang:**

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    debug: bool = False
    algorithm: str
    access_token_expire_minutes: int

    class Config:
        env_file = ".env"

settings = Settings()

```

---

## **5-Qism: Token Yaratish — oauth2.py (30 daqiqa)**

### **app/oauth2.py**

```python
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from . import models, schemas
from .database import get_db
from .config import settings

# Token qayerdan kelishini aytamiz
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ─── TOKEN YARATISH ───────────────────────────
def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    # Muddat qo'shish
    expire = datetime.utcnow() + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    to_encode.update({"exp": expire})

    # Tokenni imzolash
    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm
    )

    return encoded_jwt

# ─── TOKENNI TEKSHIRISH ───────────────────────
def verify_access_token(token: str, credentials_exception):
    try:
        # Tokenni ochish
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )

        # Payload dan user_id olish
        user_id: str = payload.get("user_id")

        if user_id is None:
            raise credentials_exception

        # Token schema
        token_data = schemas.TokenData(id=str(user_id))

    except JWTError:
        raise credentials_exception

    return token_data

# ─── JORIY FOYDALANUVCHINI OLISH ─────────────
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Tokenni tekshirib bo'lmadi",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token_data = verify_access_token(token, credentials_exception)

    user = db.query(models.User).filter(
        models.User.id == int(token_data.id)
    ).first()

    if user is None:
        raise credentials_exception

    return user
```

---

**Tushuntirish — `OAuth2PasswordBearer`:**

```python
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Bu nima qiladi?
# 1. HTTP so'rovning Authorization headerini o'qiydi
# 2. "Bearer <token>" formatini kutadi
# 3. Tokenni ajratib oladi
# 4. Swagger UI da "Authorize" tugmasi chiqadi
```

---

**Tushuntirish — `create_access_token`:**

```python
# Chaqirish:
token = create_access_token(data={"user_id": 1})

# Ichida nima bo'ladi:
# 1. {"user_id": 1, "exp": <30 daqiqadan keyin>}
# 2. SECRET_KEY bilan imzolaydi
# 3. String qaytaradi: "eyJ..."
```

---

## **6-Qism: Schemas ga Token Qo'shish (10 daqiqa)**

### **app/schemas.py ga qo'shing:**

```python
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ... (avvalgi schemalar)

# ─── TOKEN SCHEMAS ────────────────────────────

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None
```

---

**Tushuntirish:**

```
Token      → Login qilganda qaytariladi
TokenData  → Token ichidagi ma'lumot (user_id)
```

---

## **7-Qism: Login Router (25 daqiqa)**

### **app/routers/auth.py**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..utils.hashing import verify_password
from ..oauth2 import create_access_token

router = APIRouter(
    tags=["Authentication"]
)

@router.post("/login", response_model=schemas.Token)
def login(
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # 1. Foydalanuvchini topish
    user = db.query(models.User).filter(
        models.User.email == user_credentials.username
    ).first()

    # 2. Foydalanuvchi borligini tekshirish
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Noto'g'ri email yoki parol"
        )

    # 3. Parolni tekshirish
    if not verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Noto'g'ri email yoki parol"
        )

    # 4. Token yaratish
    access_token = create_access_token(
        data={"user_id": user.id}
    )

    # 5. Tokenni qaytarish
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
```

---

**Tushuntirish — `OAuth2PasswordRequestForm`:**

```python
# Bu forma quyidagi maydonlarni kutadi:
# username → biz email sifatida ishlatamiz
# password → parol

# Swagger UI da avtomatik forma chiqadi!
# Content-Type: application/x-www-form-urlencoded
```

---

**Tushuntirish — Xavfsizlik:**

```python
# ❌ NOTO'G'RI:
if not user:
    raise HTTPException(detail="Foydalanuvchi topilmadi")
if not verify_password(...):
    raise HTTPException(detail="Parol noto'g'ri")

# ✅ TO'G'RI:
# Ikkalasi uchun bir xil xato xabari!
# Hacker qaysi biri noto'g'ri ekanini bilmasin.
detail="Noto'g'ri email yoki parol"
```

---

## **8-Qism: main.py ga Auth Qo'shish (5 daqiqa)**

### **app/main.py:**

```python
from fastapi import FastAPI
from .database import engine
from . import models
from .routers import posts, users, auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Blog API",
    description="FastAPI + PostgreSQL + JWT Auth",
    version="3.0.0"
)

app.include_router(posts.router)
app.include_router(users.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"xabar": "Blog API v3.0 — JWT Auth bilan!"}
```

---

### Check it!

## **9-Qism: Postlarni Himoya Qilish (30 daqiqa)**

### **app/routers/posts.py — To'liq yangi versiya:**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas, oauth2
from ..database import get_db

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

# ─── CREATE (login kerak) ──────────────────────
@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.PostResponse
)
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
    # ↑ Token tekshiriladi, user olinadi
):
    new_post = models.Post(
        owner_id=current_user.id,   # Kim yaratdi
        **post.dict()
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

# ─── READ ALL (login shart emas) ──────────────
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

# ─── READ ONE (login shart emas) ──────────────
@router.get(
    "/{post_id}",
    response_model=schemas.PostResponse
)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID={post_id} bo'lgan post topilmadi"
        )
    return post

# ─── UPDATE (faqat o'z postini) ───────────────
@router.put(
    "/{post_id}",
    response_model=schemas.PostResponse
)
def update_post(
    post_id: int,
    updated_post: schemas.PostUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    post_query = db.query(models.Post).filter(
        models.Post.id == post_id
    )
    post = post_query.first()

    # 1. Post bormi?
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID={post_id} bo'lgan post topilmadi"
        )

    # 2. Bu post sening postingmi?
    if post.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Siz bu postni yangilay olmaysiz"
        )

    post_query.update(
        updated_post.dict(),
        synchronize_session=False
    )
    db.commit()
    return post_query.first()

# ─── DELETE (faqat o'z postini) ───────────────
@router.delete(
    "/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    post_query = db.query(models.Post).filter(
        models.Post.id == post_id
    )
    post = post_query.first()

    # 1. Post bormi?
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID={post_id} bo'lgan post topilmadi"
        )

    # 2. Bu post sening postingmi?
    if post.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Siz bu postni o'chira olmaysiz"
        )

    post_query.delete(synchronize_session=False)
    db.commit()
    return None
```

---

explained

## **10-Qism: Swagger UI da To'liq Test (30 daqiqa)**

### **Qadam 1: Foydalanuvchi Yaratish**

`POST /users/`

```json
{
  "username": "ali",
  "email": "ali@example.com",
  "password": "parol1234"
}
```

**Javob (201):**

```json
{
  "id": 1,
  "username": "ali",
  "email": "ali@example.com",
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

### **Qadam 2: Login**

`POST /login`

```
username: ali@example.com
password: parol1234
```

**Javob (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

Token nusxalab oling! 📋

---

### **Qadam 3: Authorize**

Postmanda sinab ko’ring:

!image.png

!image.png

---

### **Qadam 4: Post Yaratish (token bilan)**

`POST /posts/`

```json
{
  "title": "Mening birinchi postim",
  "content": "JWT bilan himoyalangan!",
  "published": true
}
```

**Javob (201):**

```json
{
  "id": 1,
  "title": "Mening birinchi postim",
  "content": "JWT bilan himoyalangan!",
  "published": true,
  "created_at": "2024-01-15T10:05:00Z",
  "owner_id": 1
}
```

`owner_id: 1` — kim yaratganini biladi! ✅

---

### **Qadam 5: Token olmay Post Yaratish**

Swagger da **"Logout"** (yoki token o'chiring).

`POST /posts/` yuboring:

```json
{
  "detail": "Not authenticated"
}
```

Status: **401 Unauthorized** ✅

---

### **Qadam 6: Boshqa Userning Postini O'chirish**

1. Ikkinchi user yarating (`vali@example.com`)
2. Vali bilan login qiling
3. Ali ning postini o'chirishga urinib ko'ring (`DELETE /posts/1`)

**Javob:**

```json
{
  "detail": "Siz bu postni o'chira olmaysiz"
}
```

Status: **403 Forbidden** ✅

---

## **11-Qism: Token Decode — jwt.io (10 daqiqa)**

### **https://jwt.io saytida tekshiring:**

Token ni paste qiling:

!image.png

**Muhim:** Payload ochiq ko'rinadi! Maxfiy ma'lumot saqlamang.

---

## **12-Qism: `get_current_user` Dependency (15 daqiqa)**

### **Qanday ishlaydi — ketma-ketlik:**

```
1. Mijoz so'rov yuboradi:
   GET /posts/
   Authorization: Bearer eyJhbG...

2. FastAPI oauth2_scheme ni chaqiradi:
   → headerdan tokenni oladi

3. get_current_user chaqiriladi:
   → verify_access_token(token)
   → jwt.decode() → {"user_id": 1, "exp": ...}
   → TokenData(id="1")

4. DB dan user olinadi:
   → db.query(User).filter(User.id == 1).first()

5. Endpoint ga user qaytariladi:
   → current_user = <User: ali>

6. Endpoint ishlaydi ✅
```

---

### **Istalgan joyda ishlatish:**

```python
# Faqat qo'shing:
current_user: models.User = Depends(oauth2.get_current_user)

# Endi:
current_user.id        # → 1
current_user.email     # → "ali@example.com"
current_user.username  # → "ali"
```

---

## **13-Qism: Keng Tarqalgan Xatolar (15 daqiqa)**

### **Xato 1: 422 Unprocessable Entity (Login)**

```
POST /login → 422 Xato
```

**Sabab:** JSON yuborilgan, forma emas.

**Yechim:**

```
OAuth2PasswordRequestForm → form-data talab qiladi!

Swagger UI da:
- "Try it out"
- username va password maydonlari chiqadi (forma!)
- JSON EMAS!

Postman da:
- Body → form-data (JSON emas!)
- key: username, value: ali@example.com
- key: password, value: parol1234
```

---

### **Xato 2: 401 — "Not authenticated"**

```json
{"detail": "Not authenticated"}
```

**Sabab:** Token yuborilmagan.

**Yechim:**

```
Authorization: Bearer <token>
headerini qo'shing.

Swagger da: "Authorize" tugmasi.
```

---

### **Xato 3: 401 — "Tokenni tekshirib bo'lmadi"**

```json
{"detail": "Tokenni tekshirib bo'lmadi"}
```

**Sabab:**

```
1. Token muddati tugagan (30 daqiqa)
2. Token o'zgartirilgan
3. SECRET_KEY noto'g'ri
```

**Yechim:**

```
Qaytadan login qiling → yangi token oling
```

---

### **Xato 4: ImportError — oauth2**

```
ImportError: cannot import name 'oauth2' from 'app'
```

**Yechim:**

```python
# app/routers/posts.py da:
from .. import models, schemas, oauth2
# ↑ oauth2.py fayli app/ papkasida bo'lishi kerak!
```

---

### **Xato 5: python-multipart Xatosi**

```
Form data requires "python-multipart" to be installed.
```

**Yechim:**

```bash
pip install python-multipart
```

---

### **Xato 6: Token da `sub` vs `user_id`**

```python
# Agar token create da:
data={"sub": str(user.id)}   # "sub" ishlatilsa

# verify da ham:
user_id: str = payload.get("sub")   # "sub" o'qing

# Yoki ikkalasini "user_id" qiling:
data={"user_id": user.id}
user_id = payload.get("user_id")
# ← Biz shunday qildik ✅
```

---

## **14-Qism: PostResponse ga Owner Qo'shish (15 daqiqa)**

### **app/schemas.py yangilang:**

```python
class OwnerInfo(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

class PostResponse(PostBase):
    id: int
    created_at: datetime
    owner_id: Optional[int] = None
    owner: Optional[OwnerInfo] = None   # ← YANGI

    class Config:
        from_attributes = True
```

---

**Endi post olishda:**

```json
{
  "id": 1,
  "title": "Mening postim",
  "content": "...",
  "published": true,
  "created_at": "2024-01-15T10:05:00Z",
  "owner_id": 1,
  "owner": {
    "id": 1,
    "username": "ali",
    "email": "ali@example.com"
  }
}
```

Kim yozganini ko'rsatadi! 👤

---

## **5-6 Kun Xulosasi**

### **Nima O'rgandik:**

✅ JWT nima va qanday ishlaydi

✅ `python-jose` bilan token yaratish

✅ `create_access_token()` — token yaratish

✅ `verify_access_token()` — tokenni ochish

✅ `get_current_user()` — joriy userni olish

✅ `OAuth2PasswordBearer` — headerdan token olish

✅ `OAuth2PasswordRequestForm` — login forma

✅ Login endpoint (`POST /login`)

✅ Endpointlarni himoya qilish (`Depends`)

✅ Faqat o'z postini tahrirlash/o'chirish (403)

✅ Swagger UI da Authorize

✅ Keng tarqalgan xatolar va yechimlari

---

## **Amaliy Mashqlar**

### **1. Token Muddatini O'zgartirish**

```python
# .env da:
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Yoki test uchun:
ACCESS_TOKEN_EXPIRE_MINUTES=1
# → 1 daqiqada token ishlashdan to'xtaydi
# → Qaytadan login kerak
```

---

### **2. "Men" Endpoint**

```python
# routers/users.py ga qo'shing:
@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(
    current_user: models.User = Depends(oauth2.get_current_user)
):
    return current_user
```

---

### **3. Faqat O'z Postlarini Ko'rish**

```python
@router.get(
    "/my",
    response_model=List[schemas.PostResponse]
)
def get_my_posts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    posts = db.query(models.Post).filter(
        models.Post.owner_id == current_user.id
    ).all()
    return posts
```

---

## **Uy Vazifasi**

### **1. Refresh Token**

```python
# Qisqa muddatli access token (30 daqiqa)
# Uzoq muddatli refresh token (7 kun)
# Refresh token bilan yangi access token olish

@router.post("/refresh")
def refresh_token(refresh_token: str):
    # refresh_token ni tekshirish
    # yangi access_token qaytarish
    pass
```

---

### **2. Logout (Client Side)**

```
JWT stateless — server tokenni "o'chira" olmaydi.
Client tokenni o'chirib tashlashi kerak.

Yechim variantlari:
1. Client localStorageni tozalaydi
2. Token blacklist (Redis bilan — keyinroq)
3. Qisqa muddat + refresh token
```

---

### **3. Parolni O'zgartirish**

```python
class PasswordChange(BaseModel):
    old_password: str
    new_password: str

@router.put("/me/password")
def change_password(
    passwords: PasswordChange,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    # 1. Eski parolni tekshiring
    # 2. Yangi parolni xashlang
    # 3. DB ga yozing
    pass
```

---

## **Keyingi Darsda:**

**FastAPI 7-8 Kun: Alembic Migrations**

- Migration nima?
- Alembic o'rnatish va sozlash
- `alembic init`
- Birinchi migration
- Jadval ustunini qo'shish
- Migratsiyani ortga qaytarish
- Auto-generate migrations

**Jadval o'zgarishlarini professional boshqarish!** 🔄🗄️

---

## **Foydali Buyruqlar — Xulosa:**

```bash
# Serverni ishga tushirish
python -m uvicorn app.main:app --reload

# jwt.io saytida token tekshirish
# https://jwt.io → Paste token

# Postman da login:
# POST http://localhost:8000/login
# Body → form-data
# username: email@example.com
# password: parol

# Postman da himoyalangan endpoint:
# Headers → Authorization: Bearer <token>
```

---

**Jami vaqt:** 4-5 soat tanaffuslar bilan

**Esda tuting:** Token — foydalanuvchining "pasporti". Uni xavfsiz saqlang! 🔐⚡

---

> **Navigatsiya:** [⬅️ 03-04 Kun (SQLAlchemy va PostgreSQL)](03-04-kun-sqlalchemy-va-postgresql.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 07-08 Kun (Alembic Migratsiyalar) ➡️](07-08-kun-alembic-migratsiyalar.md)
