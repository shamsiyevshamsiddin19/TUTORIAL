
# 📚 09-10 Kun: CORS va Deployment — Internetga Chiqamiz 🌐🚀

> **Navigatsiya:** [⬅️ 07-08 Kun (Alembic Migratsiyalar)](07-08-kun-alembic-migratsiyalar.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 11-12 Kun (Pytest bilan Testing) ➡️](11-12-kun-pytest-bilan-testing.md)

---
## **1-Qism: CORS Nima? (20 daqiqa)**

### **Muammo:**

```
Frontend → http://localhost:3000
Backend  → http://localhost:8000
```

Brauzer shunday deydi:

```
"Bu ikki manzil bir xil emas.
Men xavfsizlik uchun bloklayman!"
```

---

### Nega bloklaydi?

**Origin** degani:

```
Origin = Protocol + Domain + Port
```

Misol:

- http://localhost:3000
- http://localhost:8000

Farqi nima?

- Port boshqa → **3000 ≠ 8000**

👉 Demak bu **boshqa origin**

---

### Muammoni ko‘rish (real misol)

Frontend kod:

```jsx
fetch("http://localhost:8000/api/data")
```

Brauzer ichida:

```
Frontend (3000) → Backend (8000)

Brauzer:
"Bu boshqa origin... ruxsat bormi?"
```

Agar backend ruxsat bermasa:

```
❌ CORS error
```

---

### CORS nima qiladi?

CORS — bu backenddan keladigan **ruxsat**

Backend shunday deyishi kerak:

```
"Ha, 3000 dan kelgan requestga ruxsat beraman"
```

---

### Oddiy tushuncha (1 gapda)

👉 **CORS = “Qaysi frontendlar backendga murojaat qila oladi?” degan ruxsat tizimi**

---

### Juda sodda misol

Tasavvur qil:

- Backend = eshik
- Frontend = odam

Agar backend:

```
"Faqat 3000-portdan kelganlar kirishi mumkin"
```

desa → hammasi ishlaydi

Aks holda:

```
"Notanish! Kirish yo‘q!" 🚫
```

---

Agar xohlasang, keyingi qadamda FastAPI’da CORS qanday yoqishni 3 qadamda ko‘rsataman.

---

### Real hayot (aniqroq)

```
Frontend → https://mening-saytim.com
Backend  → https://api.mening-saytim.com
```

Bu yerda farq:

- `mening-saytim.com`
- `api.mening-saytim.com`

👉 Subdomain boshqacha → **boshqa origin**

Shuning uchun brauzer yana so‘raydi:

**“Ruxsat bormi?”**

---

### Qanday jarayon bo‘ladi (step-by-step)

### 1-qadam: Brauzer tekshiradi (preflight)

Brauzer darrov POST/PUT yubormaydi. Avval:

```
OPTIONS /api/data
```

Savol:

```
"Frontend: https://mening-saytim.com
 Ruxsat berasanmi?"
```

---

### 2-qadam: Server javob beradi

Agar backend to‘g‘ri sozlangan bo‘lsa:

```
Access-Control-Allow-Origin: https://mening-saytim.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: *
```

👉 Ma’nosi:

```
"Ha, shu frontendga ruxsat bor"
```

---

### 3-qadam: Asosiy request ketadi

Endi brauzer ishonadi va haqiqiy request yuboradi:

```
GET /api/data  ✅
```

---

### Agar ruxsat bo‘lmasa

Server javob bermasa yoki noto‘g‘ri bo‘lsa:

```
❌ CORS error
```

Brauzer:

```
"Ruxsat yo‘q → requestni to‘xtataman"
```

---

### Eng sodda xulosa

👉 2 xil domain/subdomain bo‘lsa:

- Brauzer tekshiradi (OPTIONS)
- Server ruxsat berishi kerak
- Keyingina request o‘tadi

---

## **2-Qism: FastAPI da CORS Sozlash (15 daqiqa)**

### **app/main.py — CORS qo'shish:**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import posts, users, auth
from .config import settings

app = FastAPI(
    title="Blog API",
    description="FastAPI + PostgreSQL + JWT + Alembic + CORS",
    version="5.0.0"
)

# ─── CORS SOZLASH ─────────────────────────────
origins = [
    "http://localhost:3000",      # React development
    "http://localhost:5173",      # Vite development
    "http://localhost:8080",      # Vue development
    "https://mening-saytim.com",  # Production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Ruxsat berilgan manzillar
    allow_credentials=True,       # Cookie va token uchun
    allow_methods=["*"],          # GET, POST, PUT, DELETE...
    allow_headers=["*"],          # Authorization, Content-Type...
)
# ──────────────────────────────────────────────

app.include_router(posts.router)
app.include_router(users.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"xabar": "Blog API v5.0"}
```

---

### **Ishlab Chiqish Uchun — Barcha Originlarga Ruxsat:**

```python
# FAQAT development uchun! Production da ISHLATMANG!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Hamma joydan ruxsat
    allow_credentials=False,  # "*" bilan credentials False bo'lishi kerak
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### **config.py ga CORS qo'shish:**

`.env`:

```
DATABASE_URL=postgresql://postgres:postgres123@localhost/blog_db
SECRET_KEY=mening-maxfiy-kalitim-12345
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

`app/config.py`:

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    allowed_origins: str = "http://localhost:3000"

    # String → List ga aylantirish
    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"

settings = Settings()
```

---

`app/main.py`:

```python
from .config import settings

...
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,  # .env dan!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
...

```

---

## **3-Qism: Production Sozlamalari (25 daqiqa)**

### **Development vs Production:**

```
Development:
- --reload (avtomatik qayta yuklash)
- 1 ta worker
- Debug xabarlar
- Swagger UI ochiq

Production:
- Reload YO'Q
- Ko'p worker (CPU * 2 + 1)
- Minimal loglar
- Swagger o'chirilishi mumkin

Terminlar: 
--reload nima? = kod o‘zgarsa server o‘zi qayta ishga tushadi
```

---

### **app/config.py — Muhit bo'yicha sozlamalar:**

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    allowed_origins: str = "http://localhost:3000"
    environment: str = "development"   # ← YANGI
    debug: bool = True                 # ← YANGI

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

### **app/main.py — Muhitga qarab sozlash:**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import posts, users, auth
from .config import settings

# Production da docs o'chirish (ixtiyoriy)
app = FastAPI(
    title="Blog API",
    version="5.0.0",
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
    openapi_url=None if settings.is_production else "/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts.router)
app.include_router(users.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "xabar": "Blog API",
        "version": "5.0.0",
        "environment": settings.environment
    }

# Health check — deploy platformalar uchun
@app.get("/health")
def health_check():
    return {"status": "ok"}
```

---

## **4-Qism: Gunicorn + Uvicorn (Production Server) (20 daqiqa)**

### **Nima Uchun Gunicorn?**

```
Development:
  uvicorn app.main:app --reload
  → 1 ta process
  → Bitta so'rovni kutadi

Production:
  gunicorn + uvicorn workers
  → Ko'p process (CPU soni bo'yicha)
  → Ko'p so'rovni bir vaqtda bajaradi
  → Ishdan chiqsa avtomatik qayta ishga tushadi
```

---

### **O'rnatish:**

```bash
python -m pip install gunicorn
```

---

### **Ishga Tushirish — Production:**

```bash
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

---

### **Tushuntirish:**

```
--workers 4              → 4 ta parallel process
                           Formula: (CPU * 2) + 1
                           2 CPU → 5 worker
--worker-class           → Uvicorn worker (async)
--bind 0.0.0.0:8000     → Barcha interfeyslarda 8000 port
```

---

### **start.sh fayli yarating:**

```bash
#!/bin/bash
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:${PORT:-8000} \
  --timeout 120 \
  --keep-alive 5 \
  --log-level info
```

```bash
chmod +x start.sh
./start.sh
```

---

---

# **5-Qism: AWS EC2 ga Deploy (40–60 daqiqa)**

### **AWS EC2 Nima?**

```
✅ To‘liq server nazorat sizda
✅ Har qanday backend ishlaydi
✅ PostgreSQL (RDS yoki o‘zingiz o‘rnatasiz)
✅ Moslashuvchan (scalable)
❌ Avtomatik deploy yo‘q (o‘zingiz qilasiz)
❌ SSL qo‘lda sozlanadi
```

---

## **1-Qadam: GitHub ga Yuklash** (xuddi oldingidek)

```bash
git init
git add .
git commit -m "Initial commit — Blog API"

git remote add origin https://github.com/sizning-username/fastapi-blog.git
git remote set-url origin https://github.com/unn-info-tech/fastapilearn.git
git branch -M main
git push -u origin main
```

---

## **2-Qadam: EC2 Server Yaratish**

1. Amazon Web Services ga kiring
2. EC2 → **"Launch Instance"**

**Sozlamalar:**

```
Name: fastapi-blog-server
OS: Ubuntu 22.04
Instance type: t2.micro (Free tier)
Key pair: yangi yarating (download .pem)
```

**Network:**

```
Allow:
✔ SSH (22)
✔ HTTP (80)
✔ HTTPS (443)
✔ Custom TCP (8000) ← FastAPI uchun
```

**Launch Instance**

---

## **3-Qadam: Serverga Ulanish (SSH)**

Terminalda:

```bash
chmod 400 mykey.pem

ssh -i mykey.pem ubuntu@EC2_PUBLIC_IP
```

---

## 
```bash
sudo apt update && sudo apt upgrade -y && sudo apt install python3-pip python3-venv git -y
```

---

bu yerga bosing

# Database

### **EC2 ichida PostgreSQL**

```bash
sudo apt install postgresql postgresql-contrib -y

sudo -u postgres psql
```

```sql
CREATE DATABASE blog_db;
CREATE USER blog_user WITH PASSWORD 'password';
ALTER ROLE blog_user SET client_encoding TO 'utf8';
ALTER ROLE blog_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE blog_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE blog_db TO blog_user;
```

```
DATABASE_URL=postgresql://blog_user:password@localhost:5432/blog_db
```

---

## **9-Qadam: Environment Variables**

`.env` fayl yarating:

```bash
nano .env
```

```
DATABASE_URL=postgresql://blog_user:my_secure_password_123@localhost:5432/fastapi_blog_db
SECRET_KEY=juda-maxfiy-kalit
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=False
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

```

---

## **10-Qadam: Migration (Alembic)**

```bash
rm -rf alembic/versions/*
alembic revision --autogenerate -m "create_users_and_posts_tables"
alembic upgrade head
```

---

## **11-Qadam: Gunicorn bilan ishga tushirish**

```bash
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

Brauzer:

```
http://98.91.214.176:8000
```

---

extra to send postmans

## **12-Qadam: Background Service (MUHIM)**

Server o‘chsa app ham o‘chmasligi uchun:

```bash
sudo pkill -f gunicorn
sudo nano /etc/systemd/system/fastapilearn.service
```

```
[Unit]
Description=FastAPI Blog
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/var/www/fastapilearn/
ExecStart=/var/www/fastapilearn/venv/bin/gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reexec
sudo systemctl enable fastapilearn
sudo systemctl start fastapilearn
```

---

**INTERNETDA ISHLAMOQDA ‘run’-siz ham (AWS EC2)**

---

**Deploy tugaydi!** 🚀

---

**8-Qism: Keng Tarqalgan Deploy Xatolari (25 daqiqa)**

---

# CI/CD

- nginx(optional)
- deploy

```bash
nano /var/www/fastapilearn/deploy.sh
```

```bash
#!/bin/bash

echo "📥 Kodni yangilash"
git pull origin main

echo "🐍 Virtual environment aktivatsiya"
source venv/bin/activate

echo "📦 Paketlarni yangilash"
pip install -r requirements.txt

echo "🧱 Migratsiya qo'llash"
alembic upgrade head

echo "🔄 Server restart"
sudo systemctl restart fastapilearn

echo "✅ Deploy tugadi"
```

---

```bash
chmod +x deploy.sh
./deploy.sh
```

`.gitignore`

```bash
# Python cache
__pycache__/
*.py[cod]

# Virtual environment
venv/
.env

# Alembic (optional)
alembic/versions/*.pyc

# Logs
*.log

# OS files
.DS_Store

# IDE
.vscode/
.idea/

# Database (if local)
*.sqlite3
```

# CD:

CD

# NGINX

nginx

## **9-10 Kun Xulosasi**

### **Nima O'rgandik:**

✅ CORS nima va qanday ishlaydi

✅ FastAPI da CORS middleware sozlash

✅ `allow_origins`, `allow_methods`, `allow_headers`

✅ Development vs Production sozlamalari

✅ Gunicorn + Uvicorn worker

✅ `start.sh` skripti

✅ Render.com ga deploy

✅ Railway ga deploy

✅ Environment variables (production)

✅ `alembic upgrade head` deploy da

✅ `$PORT` environment variable

✅ Custom domain va SSL

✅ Avtomatik deploy (GitHub push)

✅ `.env.example` va `README.md`

✅ Keng tarqalgan deploy xatolari

---

## **Amaliy Mashqlar**

### **1. Health Check Kengaytirish**

```python
from sqlalchemy import text

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception:
        db_status = "error"

    return {
        "status": "ok",
        "database": db_status,
        "environment": settings.environment,
        "version": "5.0.0"
    }
```

---

### **2. API Versiyalash**

```python
# Katta loyihalarda:
app.include_router(posts.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(auth.router,  prefix="/api/v1")

# Endpoints:
# /api/v1/posts/
# /api/v1/users/
# /api/v1/login
```

---

### **3. Rate Limiting (Kengaytirilgan)**

```bash
pip install slowapi
```

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/posts/")
@limiter.limit("10/minute")   # 1 daqiqada 10 ta so'rov
def get_posts(request: Request, db: Session = Depends(get_db)):
    return db.query(models.Post).all()
```

---

## **Uy Vazifasi**

### **1. Deploy Qiling!**

```
1. GitHub da repository yarating
2. Render da PostgreSQL yarating
3. Render da Web Service yarating
4. Environment variables qo'shing
5. Deploy qiling
6. /docs ga kirib test qiling
7. URL ni yozing — siz endi developer! 🚀
```

---

### **2. Frontend bilan Ulang**

```jsx
// React da (oddiy test):
const API_URL = "https://fastapi-blog-xxxx.onrender.com";

async function getPosts() {
    const response = await fetch(`${API_URL}/posts/`);
    const data = await response.json();
    console.log(data);
}
```

---

### **3. Monitoring**

```python
# Har bir so'rovni log qilish:
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Status: {response.status_code}")
    return response
```

---

## **Keyingi Darsda:**

**FastAPI 11-12 Kun: Testing (Pytest)**

- Pytest nima?
- FastAPI TestClient
- Test database (SQLite)
- Fixture lar
- CRUD testlar
- Auth testlar
- Coverage hisobot
- CI/CD bilan integratsiya

**Professional kod = Testlangan kod!** 🧪⚡

---

## **Foydali Buyruqlar — Xulosa:**

```bash
# Local development
python -m uvicorn app.main:app --reload

# Production (local test)
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000

# GitHub ga push (avtomatik deploy)
git add .
git commit -m "Yangi xususiyat qo'shildi"
git push origin main

# Render log larni ko'rish
# Dashboard → Logs

# Migratsiyalar (deploy da avtomatik)
alembic upgrade head
```

---

## **Deploy Jarayoni — Xulosa:**

```
Local:
  Kod yozish → Test → Commit → Push

Render/Railway:
  Pull → Build → Migrate → Start → ✅

URL:
  https://fastapi-blog-xxxx.onrender.com
```

---

**Jami vaqt:** 4-5 soat tanaffuslar bilan

**Esda tuting:** Birinchi deploy doim qiyin. Lekin ikkinchisi — faqat `git push`! 🌐🚀

---

> **Navigatsiya:** [⬅️ 07-08 Kun (Alembic Migratsiyalar)](07-08-kun-alembic-migratsiyalar.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 11-12 Kun (Pytest bilan Testing) ➡️](11-12-kun-pytest-bilan-testing.md)
