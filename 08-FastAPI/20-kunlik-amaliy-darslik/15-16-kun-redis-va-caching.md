# 📚 15-16 Kun: Redis va Caching — 10x Tezlik va Rate Limiting ⚡🔴

> **Navigatsiya:** [⬅️ 13-14 Kun (WebSockets va Background Tasks)](13-14-kun-websockets-va-background-tasks.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 17-18 Kun (Docker va Konteynerlar) ➡️](17-18-kun-docker-va-konteynerlashtirish.md)

---
## **1-Qism: Redis Nima? (20 daqiqa)**

### **Oddiy Tushuntirish:**

```
PostgreSQL:
  - Diskda saqlaydi
  - Sekin (disk I/O)
  - Doimiy ma'lumot

Redis:
  - Xotirada (RAM) saqlaydi
  - Juda tez (100x dan tez!)
  - Vaqtinchalik ma'lumot
```

---

### **Redis Qayerda Ishlatiladi:**

```
✅ Cache (tez-tez o'qiladigan ma'lumot)
✅ Session saqlash
✅ Rate limiting (so'rov cheklash)
✅ Job queue (navbat)
✅ Real-time leaderboard
✅ Pub/Sub (xabar tizimi)
✅ OTP kodlar (SMS kod)
```

---

### **Cache Nima Uchun Kerak:**

```
Misol: 10,000 foydalanuvchi /posts/ so'raydi

Cache YO'Q:
  10,000 × DB so'rov → DB yuklanadi 😫
  Har so'rov: 50-100ms

Cache BOR:
  1 × DB so'rov → Redis ga saqlaydi
  9,999 × Redis dan oladi → 1ms ⚡

10,000 so'rovda:
  Tejalgan vaqt: ~990 sekund!
```

---

### **Cache Ishlash Mantiq:**

```
1. So'rov keladi: GET /posts/
2. Redis da bor? (Cache Hit)
   → Ha → Redis dan qaytaradi ⚡
   → Yo'q (Cache Miss) → DB dan oladi
3. Cache Miss bo'lsa:
   → DB dan olinadi
   → Redis ga saqlanadi (TTL bilan)
   → Foydalanuvchiga qaytariladi
```

In **Redis**, **TTL (Time to Live)** is **a countdown timer you attach to a piece of data (a "key")**. When that timer hits zero, Redis automatically deletes the data for you

---

## **2-Qism: Redis O'rnatish (15 daqiqa)**

### **Windows:**

```bash
# 1-usul: WSL (Windows Subsystem for Linux)
wsl --install
# WSL ichida:
sudo apt update
sudo apt install redis-server
sudo service redis-server start

# 2-usul: Memurai (Windows uchun Redis)
# https://github.com/tporadowski/redis/releases
# .msi faylni yuklab o'rnating
```

---

### **Mac:**

```bash
brew install redis
brew services start redis
```

---

### **Linux (Ubuntu):**

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

---

### **Tekshirish:**

```bash
redis-cli ping
```

**Natija:**

```
PONG
```

Redis ishlayapti! ✅

---

### **Redis Cloud (Bepul, O'rnatishsiz):**

```
1. https://redis.io/try-free/
2. Ro'yxatdan o'ting
3. Bepul cluster yarating
4. Connection URL oling:
   redis://default:password@host:port
```

---

### **Python Paketlarini O'rnatish loyiha ichida:**

```bash
pip install redis
pip install fastapi-cache2[redis]
```

---

**requirements.txt yangilang:**

```bash
pip freeze > requirements.txt
```

---

## **3-Qism: Redis Asosiy Buyruqlar (15 daqiqa)**

### **redis-cli | wsl - da mashq:**

```bash
redis-cli
```

```bash
# Qiymat saqlash
SET ism "Ali"

# Qiymat olish
GET ism
# → "Ali"

# Vaqt bilan saqlash (30 sekund)
SET token "abc123" EX 30

# Qancha vaqt qoldi?
TTL token
# → 28

# Bor yoki yo'q?
EXISTS ism
# → 1 (bor)
# → 0 (yo'q)

# O'chirish
DEL ism

# Barcha kalitlar
KEYS *

# Hamma narsani tozalash
	FLUSHALL 

# Redis info
INFO server
```

---

### **Hash (Lug'at):**

```bash
# Bir nechta maydon
HSET user:1 ism "Ali" email "ali@example.com" yosh 25

# Bitta maydon olish
HGET user:1 ism
# → "Ali"

# Barchasi
HGETALL user:1
# → ism Ali email ali@example.com yosh 25

# O'chirish
HDEL user:1 yosh
```

---

### **List (Navbat):**

```bash
# Oxiriga qo'shish
RPUSH vazifalar "Email yuborish"
RPUSH vazifalar "Rasm qayta ishlash"

# Boshiga qo'shish
LPUSH vazifalar "Muhim vazifa"

# Olish (qoldirmaydi)
LPOP vazifalar
# → "Muhim vazifa"

# Ko'rish (olib tashlamas)
LRANGE vazifalar 0 -1
```

- **L = Left (chap tomoni)**
- **R = Right (o‘ng tomoni)**

```
[ A, B, C ]
  ↑     ↑
 Left   Right
```

---

## **4-Qism: FastAPI + Redis Ulanish (20 daqiqa)**

### **.env ga qo'shing:**

```
DATABASE_URL=postgresql://postgres:postgres123@localhost/blog_db
SECRET_KEY=mening-maxfiy-kalitim-12345
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000
ENVIRONMENT=development
DEBUG=True
REDIS_URL=redis://localhost:6379
CACHE_TTL=300
```

---

### **app/config.py yangilang:**

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    allowed_origins: str = "http://localhost:3000"
    environment: str = "development"
    debug: bool = True
    redis_url: str = "redis://localhost:6379"
    cache_ttl: int = 300    # 5 daqiqa (sekund)

    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    class Config:
        env_file = ".env"

settings = Settings()
```

---

### **app/cache.py yarating:**

```python
import redis
import json
from typing import Optional, Any
from .config import settings

# Redis ulanish
redis_client = redis.from_url(
    settings.redis_url,
    decode_responses=True    # Bytes → String avtomatik
)

def cache_get(key: str) -> Optional[Any]:
    """Redis dan qiymat olish"""
    try:
        data = redis_client.get(key)
        if data:
            return json.loads(data)
        return None
    except Exception as e:
        print(f"Cache get xato: {e}")
        return None

def cache_set(key: str, value: Any, ttl: int = None) -> bool:
    """Redis ga qiymat saqlash"""
    try:
        if ttl is None:
            ttl = settings.cache_ttl
        redis_client.setex(
            key,
            ttl,
            json.dumps(value, default=str)  # datetime uchun str
        )
        return True
    except Exception as e:
        print(f"Cache set xato: {e}")
        return False

def cache_delete(key: str) -> bool:
    """Redis dan o'chirish"""
    try:
        redis_client.delete(key)
        return True
    except Exception as e:
        print(f"Cache delete xato: {e}")
        return False

def cache_delete_pattern(pattern: str) -> int:
    """Pattern bo'yicha o'chirish (masalan: 'posts:*')"""
    try:
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
        return len(keys)
    except Exception as e:
        print(f"Cache pattern delete xato: {e}")
        return 0

def cache_exists(key: str) -> bool:
    """Kalit borligini tekshirish"""
    try:
        return bool(redis_client.exists(key))
    except Exception:
        return False
```

---

### **Redis Ulanishini Tekshirish:**

```python
# app/ da test_redis.py yarating:
from app.cache import redis_client

try:
    redis_client.ping()
    print("✅ Redis ga ulandi!")
except Exception as e:
    print(f"❌ Redis xato: {e}")
```

```bash
 python -m app.test_redis
```

---

## **5-Qism: Post Cache (35 daqiqa)**

### **app/routers/posts.py — Cache bilan:**

```python
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from .. import models, schemas, oauth2
from ..database import get_db
from ..cache import cache_get, cache_set, cache_delete, cache_delete_pattern

router = APIRouter(prefix="/posts", tags=["Posts"])

# ─── READ ALL (cache bilan) ───────────────────
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
    # Cache kaliti (parametrlar bilan)
    cache_key = f"posts:all:limit={limit}:skip={skip}:search={search}"

    # 1. Cache dan tekshirish
    cached = cache_get(cache_key)
    if cached:
        print(f"✅ Cache HIT: {cache_key}")
        return cached

    # 2. Cache Miss → DB dan olish
    print(f"❌ Cache MISS: {cache_key}")
    posts = db.query(models.Post).filter(
        models.Post.title.contains(search)
    ).limit(limit).offset(skip).all()

    # SQLAlchemy → Dict ga aylantirish
    posts_data = [
        schemas.PostResponse.from_orm(p).dict()
        for p in posts
    ]

    # 3. Cache ga saqlash (5 daqiqa)
    cache_set(cache_key, posts_data, ttl=300)

    return posts

# ─── READ ONE (cache bilan) ───────────────────
@router.get(
    "/{post_id}",
    response_model=schemas.PostResponse
)
def get_post(post_id: int, db: Session = Depends(get_db)):
    cache_key = f"posts:{post_id}"

    # Cache tekshirish
    cached = cache_get(cache_key)
    if cached:
        print(f"✅ Cache HIT: {cache_key}")
        return cached

    print(f"❌ Cache MISS: {cache_key}")
    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID={post_id} bo'lgan post topilmadi"
        )

    post_data = schemas.PostResponse.from_orm(post).dict()

    # Cache ga saqlash (10 daqiqa)
    cache_set(cache_key, post_data, ttl=600)

    return post

# ─── CREATE (cache tozalash) ──────────────────
@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.PostResponse
)
def create_post(
    post: schemas.PostCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    new_post = models.Post(
        owner_id=current_user.id,
        **post.dict()
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # Yangi post → Barcha list cache eskirdi → O'chirish
    background_tasks.add_task(
        cache_delete_pattern,
        "posts:all:*"
    )

    return new_post

# ─── UPDATE (cache yangilash) ─────────────────
@router.put(
    "/{post_id}",
    response_model=schemas.PostResponse
)
def update_post(
    post_id: int,
    updated_post: schemas.PostUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    post_query = db.query(models.Post).filter(
        models.Post.id == post_id
    )
    post = post_query.first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID={post_id} bo'lgan post topilmadi"
        )

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

    # Cache tozalash (fonda)
    background_tasks.add_task(cache_delete, f"posts:{post_id}")
    background_tasks.add_task(cache_delete_pattern, "posts:all:*")

    return post_query.first()

# ─── DELETE (cache tozalash) ──────────────────
@router.delete(
    "/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_post(
    post_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    post_query = db.query(models.Post).filter(
        models.Post.id == post_id
    )
    post = post_query.first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID={post_id} bo'lgan post topilmadi"
        )

    if post.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Siz bu postni o'chira olmaysiz"
        )

    post_query.delete(synchronize_session=False)
    db.commit()

    # Cache tozalash (fonda)
    background_tasks.add_task(cache_delete, f"posts:{post_id}")
    background_tasks.add_task(cache_delete_pattern, "posts:all:*")

    return None
```

---

### **Cache Ishlashini Ko'rish:**

```bash
python -m uvicorn app.main:app --reload
```

```
# 1-so'rov:
GET /posts/
❌ Cache MISS: posts:all:limit=10:skip=0:search=
(DB dan olindi, Redis ga saqlandi)

# 2-so'rov (xuddi shu):
GET /posts/
✅ Cache HIT: posts:all:limit=10:skip=0:search=
(Redis dan olindi — tez!)

# Post yaratish:
POST /posts/
posts:all:* → O'chirildi (eskirgan cache)

# 3-so'rov:
GET /posts/
❌ Cache MISS (yangi ma'lumot bor)
```

---

## **6-Qism: Rate Limiting (30 daqiqa)**

### **Nima Uchun?**

```
Muammo:
  Hacker: 10,000 so'rov/sekund → Server tushadi! (Server crashes) 💀

Yechim (Rate Limit):
  Bir IP: max 100 so'rov/daqiqa
  Oshsa: 429 Too Many Requests
```

---

### **app/middleware/rate_limit.py yarating:**

```python
from fastapi import Request, HTTPException, status
from app.cache import redis_client
import time

async def rate_limit_middleware(
    request: Request,
    calls: int = 100,      # Max so'rovlar
    period: int = 60       # Sekund
):
    """
    calls: Ruxsat etilgan so'rovlar soni
    period: Vaqt oralig'i (sekund)
    """
    # IP manzil olish
    client_ip = request.client.host

    # Cache kaliti
    key = f"rate_limit:{client_ip}:{request.url.path}"

    # Hozirgi vaqt (oyna boshlanishi)
    current = int(time.time())
    window_start = current - period

    # Redis pipeline (bir nechta buyruq birga)
    pipe = redis_client.pipeline()

    # Eski so'rovlarni o'chirish
    pipe.zremrangebyscore(key, 0, window_start)

    # Hozirgi so'rovni qo'shish
    pipe.zadd(key, {str(current): current})

    # Oynada nechta so'rov borligini hisoblash
    pipe.zcard(key)

    # TTL o'rnatish (eski ma'lumot tozalansin)
    pipe.expire(key, period)

    results = pipe.execute()
    request_count = results[2]

    if request_count > calls:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "xato": "Juda ko'p so'rov!",
                "limit": calls,
                "period": f"{period} sekund",
                "qayta_urinish": f"{period} sekunddan keyin"
            },
            headers={"Retry-After": str(period)}
        )

    return request_count
```

---

### **Endpointlarga Qo'llash:**

```python
# app/routers/auth.py da:
from fastapi import APIRouter, Depends, HTTPException, status, Request
from ..middleware.rate_limit import rate_limit_middleware

router = APIRouter(tags=["Authentication"])

@router.post("/login", response_model=schemas.Token)
async def login(
    request: Request,
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Login ga qattiq cheklash: 5 ta/daqiqa
    await rate_limit_middleware(request, calls=5, period=60)

    # ... qolgan kod
```

---

full code

```python
# app/routers/posts.py da:
@router.get("/", response_model=List[schemas.PostResponse])
async def get_all_posts(
    request: Request,
    db: Session = Depends(get_db),
    limit: int = 10,
    skip: int = 0,
    search: Optional[str] = ""
):
    # Postlarga yumshoq cheklash: 100 ta/daqiqa
    await rate_limit_middleware(request, calls=100, period=60)

    # ... qolgan kod
```

full code:

---

**Test:**

---

## 7-Qism: Session Saqlash — To'liq Tushuntirish 🔐

---

## **Avval: Session Nima va Nima Uchun Kerak?**

### **JWT Token vs Session — Farqi:**

```
JWT Token:
  - Server hech narsa saqlamaydi
  - Token ichida ma'lumot bor
  - O'chirish mumkin emas (muddat tugaguncha)

  Muammo:
  Foydalanuvchi parolini o'zgartirdi →
  Eski token hali ham ishlaydi! ❌
  Hacker tokenni o'g'irladi →
  Biz bekor qila olmaymiz! ❌

Session:
  - Server Redis da saqlaydi
  - Istalgan vaqt o'chirib tashlash mumkin
  - "Kim qayerdan kirgan" ko'rish mumkin

  Yechim:
  Shubhali faoliyat → Session o'chirish →
  Foydalanuvchi chiqib ketadi ✅
```

---

### **Qachon Session Ishlatiladi:**

```
✅ Admin panel — Kim kirganini bilish
✅ Xavfsizlik — Shubhali sessionni o'chirish
✅ "Barcha qurilmalardan chiqish" funksiyasi
✅ Active users soni ko'rish
✅ Session history (qachon, qayerdan kirgan)
```

Why use not only JWT? Because JWT has a logout problem, when the user logs out, if JWT valid for 7days, then using the same JWT server is accessible. The hackers may take advantage of. So that’s why we use Session. Then why use not only Session? Because we still need it for Front such as React, Mobile and etc.

in detail here →

---

## **1-Qadam: Fayl Yaratish**

### **Loyiha tuzilmasi:**

```
app/
├── utils/
│   ├── __init__.py
│   ├── hashing.py      ← Allaqachon bor
│   ├── email.py        ← Allaqachon bor
│   └── session.py      ← YANGI YARATAMIZ
```

---

### **app/utils/session.py:**

```python
import uuid
import json
from datetime import datetime
from app.cache import redis_client

SESSION_TTL = 60 * 60 * 24 * 7   # 7 kun (sekund)

def create_session(user_id: int, user_data: dict) -> str:
    """
    Yangi session yaratish.

    Qachon chaqiriladi:
    → Foydalanuvchi muvaffaqiyatli login qilganda

    Nimani saqlaydi:
    → user_id, username, email, kirgan vaqt
    → Redis da 7 kun saqlanadi

    Qaytaradi:
    → session_id (UUID string)
    """
    session_id = str(uuid.uuid4())

    session_data = {
        "user_id": user_id,
        "username": user_data.get("username"),
        "email": user_data.get("email"),
        "created_at": datetime.now().isoformat(),
        "last_active": datetime.now().isoformat()
    }

    key = f"session:{session_id}"
    redis_client.setex(
        key,
        SESSION_TTL,
        json.dumps(session_data)
    )

    return session_id

def get_session(session_id: str) -> dict | None:
    """
    Session ma'lumotlarini olish.

    Qachon chaqiriladi:
    → /auth/sessions endpointida
    → Kim kirganini tekshirganda

    Qaytaradi:
    → Session ma'lumotlari dict
    → None (topilmasa yoki muddati o'tsa)
    """
    key = f"session:{session_id}"
    data = redis_client.get(key)

    if not data:
        return None

    session = json.loads(data)

    # Oxirgi faollikni yangilash (TTL qayta boshlanadi)
    session["last_active"] = datetime.now().isoformat()
    redis_client.setex(key, SESSION_TTL, json.dumps(session))

    return session

def delete_session(session_id: str) -> bool:
    """
    Bitta sessionni o'chirish (logout).

    Qachon chaqiriladi:
    → Foydalanuvchi logout qilganda
    → Admin shubhali sessionni o'chirganda
    """
    key = f"session:{session_id}"
    return bool(redis_client.delete(key))

def delete_all_user_sessions(user_id: int) -> int:
    """
    Foydalanuvchining BARCHA sessionlarini o'chirish.

    Qachon chaqiriladi:
    → Foydalanuvchi parolini o'zgartirdi
    → "Barcha qurilmalardan chiqish" bosildi
    → Admin foydalanuvchini blokladi
    """
    count = 0
    for key in redis_client.scan_iter("session:*"):
        data = redis_client.get(key)
        if data:
            session = json.loads(data)
            if session.get("user_id") == user_id:
                redis_client.delete(key)
                count += 1
    return count

def get_user_sessions(user_id: int) -> list:
    """
    Foydalanuvchining barcha aktiv sessionlari.

    Qachon chaqiriladi:
    → /auth/sessions GET endpointida
    → "Qaysi qurilmalardan kirilyapti" ko'rish uchun
    """
    sessions = []
    for key in redis_client.scan_iter("session:*"):
        data = redis_client.get(key)
        if data:
            session = json.loads(data)
            if session.get("user_id") == user_id:
                session_id = key.split(":")[-1]
                ttl = redis_client.ttl(key)
                sessions.append({
                    "session_id": session_id,
                    "created_at": session["created_at"],
                    "last_active": session["last_active"],
                    "expires_in_hours": round(ttl / 3600, 1)
                })
    return sessions
```

---

## **2-Qadam: Login ga Integratsiya**

### **app/routers/auth.py — To'liq yangilash:**

```python
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..utils.hashing import verify_password
from ..oauth2 import create_access_token, get_current_user
from ..middleware.rate_limit import rate_limit_middleware

# ← SESSION IMPORT
from ..utils.session import (
    create_session,
    delete_session,
    delete_all_user_sessions,
    get_user_sessions
)

router = APIRouter(tags=["Authentication"])

# ─── LOGIN ────────────────────────────────────
@router.post("/login", response_model=schemas.Token)
async def login(
    request: Request,
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Rate limit: 5 ta urinish/daqiqa
    await rate_limit_middleware(request, calls=5, period=60)

    # 1. Foydalanuvchini topish
    user = db.query(models.User).filter(
        models.User.email == user_credentials.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Noto'g'ri email yoki parol"
        )

    # 2. Parolni tekshirish
    if not verify_password(
        user_credentials.password,
        user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Noto'g'ri email yoki parol"
        )

    # 3. JWT Token yaratish
    access_token = create_access_token(
        data={"user_id": user.id}
    )

    # 4. Session yaratish (Redis da)
    session_id = create_session(
        user_id=user.id,
        user_data={
            "username": user.username,
            "email": user.email
        }
    )

    # 5. Ikkalasini qaytarish
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "session_id": session_id   # ← Qo'shimcha ma'lumot
    }

# ─── LOGOUT (bitta qurilma) ───────────────────
@router.post("/logout")
def logout(
    session_id: str,
    current_user: models.User = Depends(get_current_user)
):
    """
    Joriy qurilmadan chiqish.
    session_id ni client (frontend) yuboradi.
    """
    deleted = delete_session(session_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Session topilmadi yoki allaqachon o'chirilgan"
        )

    return {"xabar": "Muvaffaqiyatli chiqildi"}

# ─── LOGOUT ALL (barcha qurilmalar) ───────────
@router.post("/logout-all")
def logout_all(
    current_user: models.User = Depends(get_current_user)
):
    """
    Barcha qurilmalardan chiqish.
    Parol o'zgartirilganda yoki xavfsizlik sababli.
    """
    count = delete_all_user_sessions(current_user.id)
    return {
        "xabar": f"{count} ta qurilmadan chiqildi"
    }

# ─── AKTIV SESSIONLAR ─────────────────────────
@router.get("/sessions")
def my_sessions(
    current_user: models.User = Depends(get_current_user)
):
    """
    Foydalanuvchining barcha aktiv sessionlari.
    "Qaysi qurilmalardan kirilgan?" ko'rish.
    """
    sessions = get_user_sessions(current_user.id)
    return {
        "sessions": sessions,
        "total": len(sessions)
    }

# ─── BITTA SESSIONNI O'CHIRISH (admin) ────────
@router.delete("/sessions/{session_id}")
def delete_one_session(
    session_id: str,
    current_user: models.User = Depends(get_current_user)
):
    """
    Muayyan sessionni o'chirish.
    Masalan: "Bu qurilmadan chiqish".
    """
    deleted = delete_session(session_id)
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Session topilmadi"
        )
    return {"xabar": "Session o'chirildi"}
```

---

## **3-Qadam: Schemas ga Token Yangilash**

### **app/schemas.py da Token ni yangilang:**

```python
# Avvalgi:
class Token(BaseModel):
    access_token: str
    token_type: str

# Yangi — session_id qo'shildi:
class Token(BaseModel):
    access_token: str
    token_type: str
    session_id: str | None = None  # ← YANGI
```

---

## **4-Qadam: Qo'shilishini Tekshirish**

### **app/main.py da router ulangan mi?**

```python
from .routers import posts, users, auth   # auth allaqachon bor

# auth.router ichida /login, /logout, /sessions bor
app.include_router(auth.router)
```

---

## **5-Qadam: Serverni Ishga Tushirish va Test**

```bash
python -m uvicorn app.main:app --reload
```

---

### **Swagger UI da Test — Ketma-Ketlik:**

---

**1. Login qiling:**

`POST /login`

```
username: ali@example.com
password: password123
```

**Javob:**

```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

`session_id` ni nusxalab oling! 📋

---

**2. Redis da tekshiring:**

```bash
redis-cli

KEYS "session:*"
# → session:550e8400-e29b-41d4-a716-446655440000

GET "session:550e8400-e29b-41d4-a716-446655440000"
# → {"user_id": 1, "username": "ali", ...}

TTL "session:550e8400-e29b-41d4-a716-446655440000"
# → 604785  (7 kun ← sekundlarda)
```

---

**3. Aktiv sessionlarni ko'ring:**

`GET /sessions` (token bilan)

```json
{
  "sessions": [
    {
      "session_id": "550e8400...",
      "created_at": "2024-01-15T10:00:00",
      "last_active": "2024-01-15T10:05:00",
      "expires_in_hours": 167.8
    }
  ],
  "total": 1
}
```

---

**4. Logout qiling:**

`POST /logout`

```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Javob:**

```json
{
  "xabar": "Muvaffaqiyatli chiqildi"
}
```

---

**5. Redis da tekshiring:**

```bash
redis-cli

KEYS "session:*"
# → (empty) ← Session o'chirildi!
```

---

**6. Ikki qurilmadan kirish simulyatsiyasi:**

```
1. Laptop: Login → session_id_1
2. Telefon: Login → session_id_2

GET /sessions:
{
  "sessions": [
    {"session_id": "session_id_1", ...},
    {"session_id": "session_id_2", ...}
  ],
  "total": 2
}

POST /logout-all:
→ "2 ta qurilmadan chiqildi"

GET /sessions:
→ {"sessions": [], "total": 0}
```

---

## **To'liq Oqim — Diagramma:**

```
FOYDALANUVCHI                FASTAPI              REDIS
     │                          │                   │
     │── POST /login ──────────►│                   │
     │                          │── session yaratish►│
     │                          │                   │── SETEX session:uuid
     │◄── {token, session_id} ──│                   │   (7 kun)
     │                          │                   │
     │── GET /sessions ────────►│                   │
     │                          │── scan_iter ──────►│
     │                          │◄── session list ───│
     │◄── [{session_id,...}] ───│                   │
     │                          │                   │
     │── POST /logout ─────────►│                   │
     │                          │── DEL session:uuid►│
     │◄── {muvaffaqiyatli} ─────│                   │
     │                          │                   │
```

---

## **Nima Uchun JWT + Session birga?**

```
JWT Token:      API so'rovlarni autentifikatsiya qiladi
                (har so'rovda Authorization header)

Session:        Foydalanuvchi faoliyatini kuzatadi
                (qancha qurilma, qachon kirgan)

Birga:
  JWT  → Tezkor tekshirish (DB siz)
  Session → Boshqarish imkoni (o'chirish, kuzatish)
```

---

## **Xulosa — Qaysi Fayllarga Nima Yozildi:**

```
app/utils/session.py    ← Barcha session funksiyalar
app/routers/auth.py     ← Login/Logout/Sessions endpointlar
app/schemas.py          ← Token ga session_id qo'shildi
```

Endi session tizimi to'liq ishlaydi! ✅

---

## **8-Qism: OTP Tizimi**

### **Nima uchun kerak:**

```
Foydalanuvchi parolini unutdi →
Email ga 6 raqamli kod yuboriladi →
Kod bilan yangi parol o'rnatiladi

Yoki:
2FA (ikki bosqichli tasdiqlash) →
Login + OTP kod → Xavfsizroq!
```

---

### **1-Qadam: app/utils/otp.py YANGI FAYL:**

```python
import random
import string
from app.cache import redis_client

OTP_TTL = 300   # 5 daqiqa

def generate_otp(length: int = 6) -> str:
    """6 raqamli tasodifiy kod: '847291'"""
    return ''.join(random.choices(string.digits, k=length))

def save_otp(email: str, otp: str) -> bool:
    """OTP ni Redis ga 5 daqiqa saqlaydi"""
    key = f"otp:{email}"
    redis_client.delete(key)              # Eski kodni o'chirish
    redis_client.setex(key, OTP_TTL, otp)
    return True

def verify_otp(email: str, otp: str) -> bool:
    """
    OTP to'g'rimi tekshiradi.
    To'g'ri bo'lsa — Redis dan o'chiradi (bir martaLIK!).
    """
    key = f"otp:{email}"
    saved_otp = redis_client.get(key)

    if not saved_otp:
        return False   # Topilmadi yoki muddati o'tdi

    if saved_otp == otp:
        redis_client.delete(key)   # Ishlatildi → o'chir
        return True

    return False

def get_otp_ttl(email: str) -> int:
    """OTP necha sekund qolganini qaytaradi"""
    return redis_client.ttl(f"otp:{email}")
```

---

### **2-Qadam: app/routers/auth.py ga qo'shish:**

```python
# Avvalgi import larga qo'shing:
from ..utils.otp import (
    generate_otp,
    save_otp,
    verify_otp,
    get_otp_ttl
)
from ..utils.hashing import hash_password
from fastapi import BackgroundTasks

# auth.py ga QO'SHILADI (login dan keyin):

# ─── OTP YUBORISH ─────────────────────────────
@router.post("/otp/send")
async def send_otp(
    email: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Foydalanuvchi "Parolni unutdim" bosadi →
    Email ga OTP yuboriladi.
    """
    # Foydalanuvchi borligini tekshirish
    user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Bu email bilan foydalanuvchi topilmadi"
        )

    # OTP yaratish va Redis ga saqlash
    otp = generate_otp()
    save_otp(email, otp)

    # Email yuborish — FONDA (foydalanuvchi kutmaydi)
    background_tasks.add_task(
        print,
        f"📧 OTP: {otp} → {email} ga yuborildi"
        # Haqiqiy loyihada: send_email(email, otp)
    )

    return {
        "xabar": "OTP email ga yuborildi",
        "email": email,
        "amal_qilish": "5 daqiqa"
    }

# ─── OTP TASDIQLASH ───────────────────────────
@router.post("/otp/verify")
def verify_otp_code(
    email: str,
    otp: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    """
    Foydalanuvchi kodni kiritadi →
    To'g'ri bo'lsa → Yangi parol o'rnatiladi.
    """
    # OTP tekshirish
    if not verify_otp(email, otp):
        ttl = get_otp_ttl(email)

        if ttl == -2:
            # Kalit umuman yo'q
            detail = "OTP muddati o'tgan. Qaytadan so'rang."
        else:
            detail = f"OTP noto'g'ri. {ttl} sekund qoldi."

        raise HTTPException(status_code=400, detail=detail)

    # OTP to'g'ri → Parolni yangilash
    user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    user.password = hash_password(new_password)
    db.commit()

    # Barcha sessionlarni o'chirish (xavfsizlik uchun)
    delete_all_user_sessions(user.id)

    # Yangi token berish
    access_token = create_access_token(
        data={"user_id": user.id}
    )

    return {
        "xabar": "Parol muvaffaqiyatli yangilandi",
        "access_token": access_token,
        "token_type": "bearer"
    }
```

---

### **Test — Swagger UI da:**

```
1. POST /otp/send?email=ali@example.com
   → Terminlda OTP kodni ko'rasiz: "📧 OTP: 847291"

2. POST /otp/verify?email=ali@example.com&otp=847291&new_password=yangi123
   → Parol yangilandi, token qaytarildi

3. Eski parol bilan login → 403 (ishlamaydi)
4. Yangi parol bilan login → 200 ✅

Xato holat:
5. Noto'g'ri OTP kiriting → "OTP noto'g'ri. 287 sekund qoldi."
6. 5 daqiqa kuting → "OTP muddati o'tgan"
```

---

### Real email yuborish:

`app/utils/email.py`

```python
async def send_password_reset_email(email: str, otp: str):
    message = MessageSchema(
        subject="Parolni tiklash kodi",
        recipients=[email],
        body=f"""
        <h2>Parolni tiklash</h2>
        <p>Parolni tiklash uchun quyidagi OTP kodini kiriting:</p>
        <h3>{otp}</h3>
        <p>Bu kod 5 daqiqa davomida amal qiladi.</p>
        """,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)

```

`app/routers/auth.py`

```
from app.utils.email import send_password_reset_email

    ...
  
    # Email yuborish — FONDA (foydalanuvchi kutmaydi)
    background_tasks.add_task(
        print,
        f"📧 OTP: {otp} → {email} ga yuborildi"
        # Haqiqiy loyihada: send_email(email, otp)
    )
    await send_password_reset_email(email, otp)
  
    ...

```

---

## **10-Qism: Admin Cache Dashboard**

### **Nima uchun kerak:**

```
Redis da nima bor?
  - Qancha kalit bor?
  - Qancha xotira ishlatilmoqda?
  - Cache qancha marta ishladi?
  - Kerak bo'lsa tozalash

→ /admin/cache/stats endpointi orqali ko'rish
→ /admin/cache/clear bilan tozalash
```

---

### **app/routers/admin.py — YANGI FAYL:**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, oauth2
from ..database import get_db
from ..cache import redis_client, cache_delete_pattern

router = APIRouter(prefix="/admin", tags=["Admin"])

def require_admin(
    current_user: models.User = Depends(oauth2.get_current_user)
):
    """
    Faqat admin foydalanuvchilar uchun.
    models.User da is_admin field bo'lishi kerak.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Faqat adminlar kirishi mumkin"
        )
    return current_user

# ─── CACHE STATISTIKA ─────────────────────────
@router.get("/cache/stats")
def cache_stats(admin=Depends(require_admin)):
    """
    Redis holati haqida to'liq ma'lumot.
    Qancha xotira, qancha kalit, hit/miss nisbati.
    """
    info = redis_client.info()

    # Kalitlarni sanash
    all_keys = redis_client.keys("*")
    post_keys = redis_client.keys("posts:*")
    session_keys = redis_client.keys("session:*")
    rate_keys = redis_client.keys("rate_limit:*")
    otp_keys = redis_client.keys("otp:*")

    # Hit/Miss nisbati
    hits = int(info.get("keyspace_hits", 0))
    misses = int(info.get("keyspace_misses", 0))
    total = hits + misses
    hit_rate = round((hits / total * 100), 1) if total > 0 else 0

    return {
        "redis_version": info["redis_version"],
        "used_memory": info["used_memory_human"],
        "connected_clients": info["connected_clients"],
        "uptime_days": info["uptime_in_days"],
        "keys": {
            "total": len(all_keys),
            "posts_cache": len(post_keys),
            "sessions": len(session_keys),
            "rate_limits": len(rate_keys),
            "otps": len(otp_keys)
        },
        "performance": {
            "cache_hits": hits,
            "cache_misses": misses,
            "hit_rate_percent": hit_rate
        }
    }

# ─── CACHE TOZALASH ───────────────────────────
@router.delete("/cache/clear")
def clear_cache(
    pattern: str = "*",
    admin=Depends(require_admin)
):
    """
    Pattern bo'yicha cache tozalash.

    Misollar:
      pattern="*"         → Hammasi
      pattern="posts:*"   → Faqat post cache
      pattern="session:*" → Faqat sessionlar
      pattern="otp:*"     → Faqat OTP lar
    """
    if pattern == "*":
        # Juda xavfli — tasdiqlash kerak
        pass

    deleted = cache_delete_pattern(pattern)
    return {
        "xabar": f"{deleted} ta kalit o'chirildi",
        "pattern": pattern
    }

# ─── BARCHA SESSIONLAR ────────────────────────
@router.get("/sessions")
def all_sessions(admin=Depends(require_admin)):
    """
    Tizimda hozir kim kirgan — barcha sessionlar.
    """
    sessions = []
    for key in redis_client.scan_iter("session:*"):
        import json
        data = redis_client.get(key)
        if data:
            session = json.loads(data)
            ttl = redis_client.ttl(key)
            sessions.append({
                "session_id": key.split(":")[-1],
                "user_id": session.get("user_id"),
                "username": session.get("username"),
                "email": session.get("email"),
                "last_active": session.get("last_active"),
                "expires_in_hours": round(ttl / 3600, 1)
            })

    return {
        "active_sessions": sessions,
        "total_online": len(sessions)
    }

# ─── FOYDALANUVCHI SESSIONINI O'CHIRISH ───────
@router.delete("/sessions/user/{user_id}")
def kick_user(
    user_id: int,
    admin=Depends(require_admin)
):
    """
    Adminning foydalanuvchini tizimdan chiqarishi.
    Masalan: shubhali faoliyat aniqlanganda.
    """
    import json
    count = 0
    for key in redis_client.scan_iter("session:*"):
        data = redis_client.get(key)
        if data:
            session = json.loads(data)
            if session.get("user_id") == user_id:
                redis_client.delete(key)
                count += 1

    return {
        "xabar": f"Foydalanuvchi {user_id} "
                 f"{count} ta qurilmadan chiqarildi"
    }
```

---

### **models.py ga is_admin qo'shish:**

```python
# models.py da User classiga:
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(100))
    email = Column(String(255), unique=True)
    password = Column(String(255))
    is_admin = Column(Boolean, server_default="FALSE")  # ← YANGI
    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now())
    posts = relationship("Post", back_populates="owner")
```

---

### **Migration:**

```bash
alembic revision --autogenerate -m "add_is_admin_to_users"
alembic upgrade head
```

---

### **Adminni qo'lda qilish:**

```bash
psql -U postgres -d blog_db

UPDATE users SET is_admin = TRUE WHERE email = 'user4@example.com';
\q
```

If a bug occurs, the solution is here →

---

## **11-Qism: app/main.py — Yakuniy To'liq Fayl**

### **Barcha routerlar ulangan holda:**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .routers import posts, users, auth, admin, websocket, upload
from .config import settings
from .cache import redis_client

# Kerakli papkalar
os.makedirs("uploads", exist_ok=True)
os.makedirs("logs", exist_ok=True)

app = FastAPI(
    title="Blog API",
    description="FastAPI + PostgreSQL + JWT + Redis",
    version="7.0.0",
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
)

# ─── CORS ─────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── STATIC FAYLLAR ───────────────────────────
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# ─── ROUTERLAR ────────────────────────────────
app.include_router(auth.router)       # /login, /logout, /sessions, /otp/*
app.include_router(users.router)      # /users/*
app.include_router(posts.router)      # /posts/*
app.include_router(admin.router)      # /admin/*
app.include_router(websocket.router)  # /ws/*
app.include_router(upload.router)     # /upload/*

# ─── STARTUP ──────────────────────────────────
@app.on_event("startup")
async def startup_event():
    """Server ishga tushganda Redis ulanishini tekshirish"""
    try:
        redis_client.ping()
        print("✅ Redis ulandi!")
    except Exception as e:
        print(f"⚠️ Redis ulanmadi: {e}")
        print("   Cache ishlamaydi, lekin API ishlaydi")

# ─── ROOT ─────────────────────────────────────
@app.get("/")
def root():
    return {
        "name": "Blog API",
        "version": "7.0.0",
        "docs": "/docs",
        "environment": settings.environment
    }

# ─── HEALTH CHECK ─────────────────────────────
@app.get("/health")
def health():
    """Deploy platformalar bu endpointni tekshiradi"""
    redis_ok = False
    try:
        redis_client.ping()
        redis_ok = True
    except Exception:
        pass

    return {
        "status": "ok",
        "redis": "ok" if redis_ok else "error",
        "environment": settings.environment
    }
```

---

## **12-Qism: Keng Tarqalgan Xatolar**

### **Xato 1: `is_admin` field yo'q**

```
AttributeError: 'User' object has no attribute 'is_admin'
```

**Yechim:**

```bash
# models.py ga qo'shilganmi?
is_admin = Column(Boolean, server_default="FALSE")

# Migration yaratish:
alembic revision --autogenerate -m "add_is_admin"
alembic upgrade head
```

---

### **Xato 2: `delete_all_user_sessions` import xatosi**

```
ImportError: cannot import name 'delete_all_user_sessions'
```

**Yechim:**

```python
# auth.py da import to'g'rimi?
from ..utils.session import (
    create_session,
    delete_session,
    delete_all_user_sessions,   # ← shu bor?
    get_user_sessions
)

# session.py da funksiya yozilganmi?
def delete_all_user_sessions(user_id: int) -> int:
    ...
```

---

### **Xato 3: Admin router topilmadi**

```
ModuleNotFoundError: No module named 'app.routers.admin'
```

**Yechim:**

```
✅ app/routers/admin.py fayli yaratilganmi?
✅ app/routers/__init__.py bo'sh faylmi?
```

---

### **Xato 4: OTP har doim False qaytaradi**

```
verify_otp() → False (har doim)
```

**Yechim:**

```python
# decode_responses=True bo'lishi shart!
redis_client = redis.from_url(
    settings.redis_url,
    decode_responses=True    # ← BU BO'LISHI SHART!
)

# Sababi:
# decode_responses=False bo'lsa:
# redis.get("otp:email") → b"847291" (bytes)
# otp == b"847291" → False (str != bytes)

# decode_responses=True bo'lsa:
# redis.get("otp:email") → "847291" (string)
# otp == "847291" → True ✅
```

---

### **Xato 5: Decorator natija qaytarmaydi**

```
@cached ni ishlatganda None qaytarayapti
```

**Yechim:**

```python
# SQLAlchemy object larni JSON qilish mumkin emas!
# Decorator faqat dict/list/str qaytaradigan
# funksiyalarda ishlaydi.

# ❌ NOTO'G'RI:
@cached(ttl=300, prefix="posts")
def get_posts(db):
    return db.query(models.Post).all()
    # SQLAlchemy object → JSON bo'lmaydi!

# ✅ TO'G'RI:
@cached(ttl=300, prefix="posts")
def get_posts(db):
    posts = db.query(models.Post).all()
    return [
        schemas.PostResponse.from_orm(p).dict()
        for p in posts
    ]
    # Dict → JSON bo'ladi ✅
```

---

### **Xato 6: `/admin` endpointlari 403 qaytaradi**

```
{"detail": "Faqat adminlar kirishi mumkin"}
```

**Yechim:**

```bash
# Foydalanuvchini admin qilish:
psql -U postgres -d blog_db
UPDATE users SET is_admin = TRUE
WHERE email = 'sizning@email.com';
\q

# Keyin qaytadan login qiling (yangi token oling)
```

---

## **Yakuniy Fayl Ro'yxati — 7-12 Qism:**

```
✅ app/utils/session.py      → YANGI YARATILDI
✅ app/utils/otp.py          → YANGI YARATILDI
✅ app/routers/admin.py      → YANGI YARATILDI
✅ app/routers/auth.py       → YANGILANDI (logout, sessions, otp)
✅ app/schemas.py            → YANGILANDI (Token + session_id)
✅ app/cache.py              → YANGILANDI (cached decorator)
✅ app/models.py             → YANGILANDI (is_admin field)
✅ app/main.py               → YANGILANDI (admin router ulandi)
✅ alembic migration         → YARATILDI va QULLANDI
```

---

## **Hammasi Birga — Test Tartibi:**

```bash
# 1. Migration
alembic upgrade head

# 2. Serverni ishga tushirish
python -m uvicorn app.main:app --reload

# 3. http://localhost:8000/docs da:

# Ro'yxatdan o'tish → POST /users/
# Login → POST /login (token + session_id olasiz)
# Sessionlar → GET /sessions
# OTP yuborish → POST /otp/send?email=...
# OTP tasdiqlash → POST /otp/verify?email=&otp=&new_password=
# Admin qilish → psql da UPDATE
# Admin stats → GET /admin/cache/stats
# Cache tozalash → DELETE /admin/cache/clear?pattern=posts:*
```

Endi 7-12 qismlar to'liq va aniq! ✅⚡

---

## **15-16 Kun Xulosasi**

### **Nima O'rgandik:**

✅ Redis nima va nima uchun kerak

✅ Redis o'rnatish (Windows/Mac/Linux)

✅ Redis asosiy buyruqlar (SET, GET, TTL, KEYS)

✅ Python da Redis ulanish

✅ `cache_get`, `cache_set`, `cache_delete`

✅ `cache_delete_pattern` — pattern bo'yicha o'chirish

✅ Post CRUD da caching

✅ Cache invalidation (yangilashda o'chirish)

✅ Rate Limiting (Redis Sorted Set bilan)

✅ Session saqlash

✅ OTP tizimi

✅ Cache Decorator (`@cached`)

✅ Cache dashboard endpointi

✅ `startup_event` — server ochilganda tekshirish

✅ Keng tarqalgan xatolar va yechimlari

---

## **Amaliy Mashqlar**

### **1. User Cache**

```python
# GET /users/{id} ni keshlang:
cache_key = f"users:{user_id}"

# Foydalanuvchi yangilanganda:
cache_delete(f"users:{user_id}")
```

---

### **2. Leaderboard (Top Postlar)**

```python
# Redis Sorted Set bilan:
def increment_views(post_id: int):
    """Post ko'rilish sonini oshirish"""
    redis_client.zincrby("post_views", 1, str(post_id))

def get_top_posts(limit: int = 10) -> list:
    """Eng ko'p ko'rilgan postlar"""
    return redis_client.zrevrange(
        "post_views", 0, limit - 1,
        withscores=True
    )

@router.get("/top")
def top_posts():
    return get_top_posts(10)
```

---

### **3. Cache Warming**

```python
# Server ishga tushganda cache to'ldirish:
@app.on_event("startup")
async def warm_cache():
    """Eng muhim ma'lumotlarni cache ga oldindan yuklash"""
    db = SessionLocal()
    try:
        posts = db.query(models.Post).limit(20).all()
        posts_data = [
            schemas.PostResponse.from_orm(p).dict()
            for p in posts
        ]
        cache_set("posts:all:limit=10:skip=0:search=",
                  posts_data[:10], ttl=300)
        print(f"✅ Cache warming: {len(posts_data)} post yuklandi")
    finally:
        db.close()
```

---

## **Uy Vazifasi**

### **1. Cache Hit/Miss Statistikasi**

```python
# Har Cache Hit/Miss da counter saqlash:
def cache_get(key: str):
    data = redis_client.get(key)
    if data:
        redis_client.incr("stats:cache_hits")
    else:
        redis_client.incr("stats:cache_misses")
    ...

# GET /admin/cache/stats da ko'rsatish:
hits = redis_client.get("stats:cache_hits") or 0
misses = redis_client.get("stats:cache_misses") or 0
ratio = int(hits) / (int(hits) + int(misses)) * 100
```

---

### **2. Login Bloklanishi**

```python
# 5 marta noto'g'ri parol → 15 daqiqa blok:
def check_login_attempts(email: str) -> bool:
    key = f"login_attempts:{email}"
    attempts = redis_client.get(key)

    if attempts and int(attempts) >= 5:
        return False   # Bloklangan!

    redis_client.incr(key)
    redis_client.expire(key, 900)   # 15 daqiqa
    return True
```

---

### **3. Render da Redis Qo'shish**

```
Render → New → Redis (bepul tier)
→ Internal URL olish
→ Environment Variables da:
  REDIS_URL = redis://...
```

---

## **Foydali Buyruqlar:**

```bash
# Redis ishga tushirish
redis-server

# Redis CLI
redis-cli

# Barcha kalitlar
redis-cli KEYS "*"

# Post cache lar
redis-cli KEYS "posts:*"

# Barcha tozalash
redis-cli FLUSHALL

# Kalit qiymatini ko'rish
redis-cli GET "posts:1"

# Qancha vaqt qoldi
redis-cli TTL "posts:1"

# Redis statistika
redis-cli INFO stats
```

---

## **Keyingi Darsda:**

**FastAPI 17-18 Kun: Docker**

- Docker nima?
- Dockerfile yaratish
- docker-compose (FastAPI + PostgreSQL + Redis)
- Container ishga tushirish
- Volume va Network
- Production uchun Docker
- Docker Hub ga yuklash

**Ilovani istalgan joyda ishlatish!** 🐳⚡

---

**Jami vaqt:** 5-6 soat tanaffuslar bilan

**Esda tuting:** Cache = tezlik, Rate Limit = xavfsizlik. Ikkalasi ham professional ilovaning belgisi! ⚡🔴

---

> **Navigatsiya:** [⬅️ 13-14 Kun (WebSockets va Background Tasks)](13-14-kun-websockets-va-background-tasks.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 17-18 Kun (Docker va Konteynerlar) ➡️](17-18-kun-docker-va-konteynerlashtirish.md)
