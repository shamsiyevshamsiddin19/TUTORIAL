# 📚 17-18 Kun: Docker — Istalgan Joyda Ishlaydi 🐳⚡

> **Navigatsiya:** [⬅️ 15-16 Kun (Redis va Caching)](15-16-kun-redis-va-caching.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 19-20 Kun (Yakuniy Katta Loyiha) ➡️](19-20-kun-yakuniy-loyiha-blog-api.md)

---
## **1-Qism: Docker Nima? (20 daqiqa)**

### **Muammo — "Menda ishlaydi!":**

```
Developer: "Men kompyuterimda ishlaydi!"
Server:    "Menda ishlamayapti!"

Sabab:
  Developer: Python 3.11, PostgreSQL 15, Redis 7
  Server:    Python 3.9,  PostgreSQL 13, Redis 6

Versiyalar farq qiladi → Muammo!
```

---

### **Yechim — Docker:**

```
Docker Container = Mini kompyuter

Ichida:
  ✅ Python 3.11 (aniq versiya)
  ✅ PostgreSQL 15 (aniq versiya)
  ✅ Redis 7 (aniq versiya)
  ✅ Barcha kutubxonalar

Istalgan joyda bir xil ishlaydi!
  💻 Developer laptop
  🖥️ Server
  ☁️ Cloud (AWS, GCP, Azure)
```

---

### **Asosiy Tushunchalar:**

```
Image    → Shablon (o'zgarmas, blueprint)
Container → Ishlab turgan image (jarayon)
Dockerfile → Image yaratish yo'riqnomasi
docker-compose → Ko'p container boshqarish
Volume   → Ma'lumotlarni saqlash (container o'chsa ham)
Network  → Containerlar o'rtasida aloqa
```

---

### **Virtual Machine vs Docker:**

```
Virtual Machine:
  ┌─────────────────────┐
  │  Guest OS (Ubuntu)  │  ← 2GB RAM!
  │  Libraries          │
  │  App                │
  └─────────────────────┘
  │  Hypervisor         │
  │  Host OS            │

Docker Container:
  ┌──────┐ ┌──────┐ ┌──────┐
  │ App1 │ │ App2 │ │ App3 │  ← Yengil!
  ├──────┴─┴──────┴─┴──────┤
  │  Docker Engine         │
  │  Host OS               │
  └────────────────────────┘

Docker: Tezroq, Yengilroq, Samaraliroq!
```

---

## **2-Qism: Docker O'rnatish (15 daqiqa)**

### **Windows va Mac:**

```
1. https://www.docker.com/products/docker-desktop/
2. "Docker Desktop" yuklab oling
3. O'rnating va ishga tushiring
4. Tizimni qayta yuklanishi mumkin
```

---

### **Linux (Ubuntu):**

```bash
# Eski versiyalarni o'chirish
sudo apt remove docker docker-engine docker.io containerd runc

# Kerakli paketlar
sudo apt update
sudo apt install ca-certificates curl gnupg lsb-release

# Docker GPG kalit
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Repository qo'shish
echo \
  "deb [arch=$(dpkg --print-architecture) \
  signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# O'rnatish
sudo apt update
sudo apt install docker-ce docker-ce-cli \
  containerd.io docker-compose-plugin

# Sudo siz ishlatish
sudo usermod -aG docker $USER
newgrp docker
```

---

### **Tekshirish:**

```bash
docker --version
# Docker version 25.0.3, build 4debf41

docker compose version
# Docker Compose version v2.24.5

docker run hello-world
# Hello from Docker! ✅
```

---

## **3-Qism: Loyiha Tuzilmasi (10 daqiqa)**

```
fastapi_blog/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── config.py
│   ├── oauth2.py
│   ├── cache.py
│   ├── routers/
│   └── utils/
├── alembic/
├── tests/
├── uploads/
├── Dockerfile              ← YANGI
├── docker-compose.yml      ← YANGI
├── docker-compose.prod.yml ← YANGI
├── .dockerignore           ← YANGI
├── .env
├── .env.example
├── alembic.ini
└── requirements.txt
```

---

## **4-Qism: Dockerfile (30 daqiqa)**

### **Dockerfile yarating:**

```docker
# ─── BASE IMAGE ───────────────────────────────
FROM python:3.11-slim

# ─── MUHIT O'ZGARUVCHILARI ────────────────────
ENV PYTHONDONTWRITEBYTECODE=1
# .pyc fayllar yaratmasin

ENV PYTHONUNBUFFERED=1
# Log lar bufferlanmasin (darhol chiqsin)

ENV PYTHONPATH=/app
# Python modul yo'li

# ─── ISH PAPKASI ──────────────────────────────
WORKDIR /app

# ─── TIZIM PAKETLARI ──────────────────────────
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*
# gcc      → C kompilyator (psycopg2 uchun)
# libpq-dev → PostgreSQL kutubxona

# ─── PYTHON PAKETLARI ─────────────────────────
# Avval faqat requirements.txt ko'chirish
# (Docker layer cache uchun)
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ─── KOD NUSXALASH ────────────────────────────
COPY . .

# ─── UPLOADS PAPKASI ──────────────────────────
RUN mkdir -p uploads

# ─── PORT ─────────────────────────────────────
EXPOSE 8000

# ─── ISHGA TUSHIRISH ──────────────────────────
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

### **Tushuntirish — Layer Cache:**

```docker
# ✅ TO'G'RI TARTIB:
COPY requirements.txt .      # 1. Faqat requirements
RUN pip install ...           # 2. O'rnatish
COPY . .                      # 3. Kod

# Nima uchun?
# Agar faqat kod o'zgarsa →
# pip install qayta ishlamaydi (cache ishlatadi)
# Build 10x tezroq!

# ❌ NOTO'G'RI TARTIB:
COPY . .                      # Barcha kod
RUN pip install ...           # Har safar qayta o'rnatiladi!
```

---

### **.dockerignore yarating:**

```
# Python
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.so

# Virtual environment
venv/
env/
.venv/

# Environment
.env

# Test
tests/
htmlcov/
.coverage
.pytest_cache/

# Git
.git/
.gitignore

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Uploads (production da volume ishlatiladi)
uploads/

# Docker
Dockerfile
docker-compose*.yml
```

---

### **Image Yaratish:**

```bash
docker build -t fastapi-blog:latest .
```

**Natija:**

```
[+] Building 45.2s (12/12) FINISHED
 => [internal] load build definition from Dockerfile
 => [1/7] FROM python:3.11-slim
 => [2/7] WORKDIR /app
 => [3/7] RUN apt-get update && apt-get install...
 => [4/7] COPY requirements.txt .
 => [5/7] RUN pip install...
 => [6/7] COPY . .
 => [7/7] RUN mkdir -p uploads
 => exporting to image
 => naming to docker.io/library/fastapi-blog:latest ✅
```

---

### **Image Tekshirish:**

```bash
# Yaratilgan image lar
docker images

# Natija:
REPOSITORY     TAG       IMAGE ID       SIZE
fastapi-blog   latest    abc123def456   285MB
```

---

### **Container Ishga Tushirish (test):**

```bash
docker run -d \
  --name blog-api \
  -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e SECRET_KEY="test-key" \
  -e ALGORITHM="HS256" \
  -e ACCESS_TOKEN_EXPIRE_MINUTES=30 \
  fastapi-blog:latest
```

```bash
# Log larni ko'rish
docker logs blog-api

# Container ichiga kirish
docker exec -it blog-api bash

# To'xtatish
docker stop blog-api

# O'chirish
docker rm blog-api
```

---

## **5-Qism: docker-compose.yml (35 daqiqa)**

### **docker-compose.yml yarating:**

```yaml
version: '3.8'

# ─── TARMOQ ─────────────────────────────────────
networks:
  blog-network:
    driver: bridge

# ─── DOIMIY SAQLASH ─────────────────────────────
volumes:
  postgres-data:    # PostgreSQL ma'lumotlari
  redis-data:       # Redis ma'lumotlari
  uploads-data:     # Yuklangan fayllar

# ─── XIZMATLAR ──────────────────────────────────
services:

  # ── PostgreSQL ──────────────────────────────
  db:
    image: postgres:15-alpine
    container_name: blog-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: blog_db
      POSTGRES_USER: blog_user
      POSTGRES_PASSWORD: blog_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - blog-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U blog_user -d blog_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ── Redis ────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: blog-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - blog-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ── FastAPI ──────────────────────────────────
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: blog-api
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://blog_user:blog_password@db:5432/blog_db
      SECRET_KEY: dev-secret-key-change-in-production-12345
      ALGORITHM: HS256
      ACCESS_TOKEN_EXPIRE_MINUTES: 30
      REDIS_URL: redis://redis:6379
      CACHE_TTL: 300
      ALLOWED_ORIGINS: http://localhost:3000,http://localhost:5173
      ENVIRONMENT: development
      DEBUG: "True"
    volumes:
      - uploads-data:/app/uploads   # Fayllar saqlansin
      - .:/app                       # Kod o'zgarishlar (dev)
    networks:
      - blog-network
    depends_on:
      db:
        condition: service_healthy   # DB tayyor bo'lguncha kut
      redis:
        condition: service_healthy   # Redis tayyor bo'lguncha kut
    command: >
      sh -c "
        alembic upgrade head &&
        uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
      "

  # ── Nginx (Reverse Proxy) ────────────────────
  nginx:
    image: nginx:alpine
    container_name: blog-nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    networks:
      - blog-network
    depends_on:
      - api
```

---

### **Tushuntirish — depends_on:**

```yaml
depends_on:
  db:
    condition: service_healthy
# Bu nima degani?
# → db container "healthy" bo'lguncha kut
# → healthcheck: pg_isready → muvaffaqiyatli bo'lsa healthy

# Aks holda:
# API ishga tushadi → DB hali tayyor emas → Xato! ❌
```

---

### **Tushuntirish — Networks:**

```yaml
# Containerlar bir-birini NOMI bilan ko'radi!

# api container da:
DATABASE_URL: postgresql://blog_user:blog_password@db:5432/blog_db
#                                                   ↑
#                                            Container nomi!
# (localhost emas!)

REDIS_URL: redis://redis:6379
#                  ↑
#           Redis container nomi!
```

---

### **Nginx Konfiguratsiya:**

`nginx.conf` yarating:

```
upstream fastapi {
    server api:8000;
}

server {
    listen 80;
    server_name localhost;

    # API so'rovlar
    location / {
        proxy_pass http://fastapi;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /ws {
        proxy_pass http://fastapi;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Statik fayllar (uploads)
    location /uploads {
        proxy_pass http://fastapi;
        client_max_body_size 10M;
    }

    # Max fayl hajmi
    client_max_body_size 10M;
}
```

---

## **6-Qism: docker-compose Buyruqlar (20 daqiqa)**

### **Ishga Tushirish:**

```bash
# Barcha containerlarni build va ishga tushirish
docker compose up --build

# Fonda (detached mode)
docker compose up --build -d
```

**Natija:**

```
[+] Building 45.2s
[+] Running 4/4
 ✔ Container blog-db     Started
 ✔ Container blog-redis  Started
 ✔ Container blog-api    Started
 ✔ Container blog-nginx  Started
```

---

### **Tekshirish:**

```bash
# http://localhost (nginx orqali)
# http://localhost:8000 (to'g'ridan)
# http://localhost:8000/docs

curl http://localhost/health
# {"status":"ok","redis":"ok","environment":"development"}
```

---

### **Muhim Buyruqlar:**

```bash
# Holatni ko'rish
docker compose ps

# Natija:
NAME          IMAGE          STATUS          PORTS
blog-db       postgres:15    Up (healthy)    5432/tcp
blog-redis    redis:7        Up (healthy)    6379/tcp
blog-api      fastapi-blog   Up              0.0.0.0:8000->8000/tcp
blog-nginx    nginx:alpine   Up              0.0.0.0:80->80/tcp

# Log larni ko'rish
docker compose logs

# Bitta service logi
docker compose logs api
docker compose logs db

# Jonli log (follow)
docker compose logs -f api

# To'xtatish
docker compose stop

# O'chirish (container + network)
docker compose down

# O'chirish + volume (ma'lumotlar ham!)
docker compose down -v

# Qayta build (kod o'zgarganda)
docker compose up --build api
```

---

### **Container Ichiga Kirish:**

```bash
# API container
docker compose exec api bash

# PostgreSQL
docker compose exec db psql -U blog_user -d blog_db

# Redis
docker compose exec redis redis-cli

# Migration (container ichida)
docker compose exec api alembic upgrade head
```

---

## **7-Qism: Production docker-compose (25 daqiqa)**

### **docker-compose.prod.yml yarating:**

```yaml
version: '3.8'

networks:
  blog-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
  uploads-data:

services:

  db:
    image: postgres:15-alpine
    container_name: blog-db-prod
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - blog-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: blog-redis-prod
    restart: always
    command: >
      redis-server
      --appendonly yes
      --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    networks:
      - blog-network
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: Dockerfile.prod    # Production Dockerfile
    container_name: blog-api-prod
    restart: always
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      SECRET_KEY: ${SECRET_KEY}
      ALGORITHM: ${ALGORITHM}
      ACCESS_TOKEN_EXPIRE_MINUTES: ${ACCESS_TOKEN_EXPIRE_MINUTES}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      CACHE_TTL: ${CACHE_TTL}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
      ENVIRONMENT: production
      DEBUG: "False"
    volumes:
      - uploads-data:/app/uploads
    networks:
      - blog-network
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: >
      sh -c "
        alembic upgrade head &&
        gunicorn app.main:app
        --workers 4
        --worker-class uvicorn.workers.UvicornWorker
        --bind 0.0.0.0:8000
        --timeout 120
        --keep-alive 5
        --log-level warning
      "

  nginx:
    image: nginx:alpine
    container_name: blog-nginx-prod
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl          # SSL sertifikatlar
      - uploads-data:/app/uploads
    networks:
      - blog-network
    depends_on:
      - api
```

---

### **Dockerfile.prod yarating:**

```docker
# Production uchun optimallashtirilgan

FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ─── PRODUCTION IMAGE ─────────────────────────
FROM python:3.11-slim

# Xavfsizlik: root bo'lmagan user
RUN groupadd -r appuser && \
    useradd -r -g appuser appuser

WORKDIR /app

# Tizim paketlari (faqat runtime)
RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Builder dan paketlarni ko'chirish
COPY --from=builder /usr/local/lib/python3.11/site-packages \
    /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin \
    /usr/local/bin

# Kod
COPY --chown=appuser:appuser . .

RUN mkdir -p uploads && \
    chown -R appuser:appuser uploads

# Root bo'lmagan user
USER appuser

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["gunicorn", "app.main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000"]
```

---

### **.env.prod yarating:**

```bash
# Production environment variables
POSTGRES_DB=blog_db
POSTGRES_USER=blog_user
POSTGRES_PASSWORD=juda-kuchli-parol-123!@#

SECRET_KEY=production-da-juda-uzun-maxfiy-kalit-minimum-64-belgi
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

REDIS_PASSWORD=redis-maxfiy-parol-456!@#

CACHE_TTL=600
ALLOWED_ORIGINS=https://mening-saytim.com
```

---

### **Production da Ishga Tushirish:**

```bash
# .env.prod faylidan foydalanib ishga tushirish
docker compose -f docker-compose.prod.yml \
  --env-file .env.prod up -d --build
```

---

## **8-Qism: Docker Hub ga Yuklash (20 daqiqa)**

### **1-Qadam: Docker Hub Hisobi:**

```
1. https://hub.docker.com ga kiring
2. Ro'yxatdan o'ting
3. Username: sizning-username
```

---

### **2-Qadam: Login:**

```bash
docker login
# Username: sizning-username
# Password: sizning-parol
```

---

### **3-Qadam: Image Taglash:**

```bash
# docker.io/username/image-name:tag
docker tag fastapi-blog:latest \
  sizning-username/fastapi-blog:latest

docker tag fastapi-blog:latest \
  sizning-username/fastapi-blog:v1.0.0
```

---

### **4-Qadam: Push:**

```bash
docker push sizning-username/fastapi-blog:latest
docker push sizning-username/fastapi-blog:v1.0.0
```

**Natija:**

```
The push refers to repository [docker.io/sizning-username/fastapi-blog]
latest: digest: sha256:abc123... size: 1234
```

---

### **5-Qadam: Serverdan Pull:**

```bash
# Istalgan server da:
docker pull sizning-username/fastapi-blog:latest
docker run -d -p 8000:8000 sizning-username/fastapi-blog:latest
```

---

## **9-Qism: GitHub Actions bilan Auto Build (15 daqiqa)**

### **.github/workflows/docker.yml:**

```yaml
name: Docker Build va Push

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Kodni olish
        uses: actions/checkout@v3

      - name: Docker Hub ga login
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}

      - name: Meta ma'lumotlar
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ secrets.DOCKER_USERNAME }}/fastapi-blog
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha,prefix=sha-

      - name: Build va Push
        uses: docker/build-push-action@v4
        with:
          context: .
          dockerfile: Dockerfile.prod
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

**GitHub Secrets qo'shish:**

```
GitHub → Repository → Settings → Secrets → Actions

DOCKER_USERNAME = sizning-docker-username
DOCKER_TOKEN    = Docker Hub Access Token
```

---

## **10-Qism: Multi-stage Build — Optimizatsiya (15 daqiqa)**

### **Image Hajmini Kamaytirish:**

```bash
# Oddiy image hajmi:
docker images fastapi-blog
# → 285MB

# Multi-stage build:
# → ~120MB (2x kichikroq!)
```

---

### **Nima Qisqaradi:**

```docker
# Builder stage: gcc, libpq-dev kerak (compile uchun)
FROM python:3.11 AS builder
RUN apt-get install gcc libpq-dev
RUN pip install psycopg2  # ← Kompilyatsiya kerak

# Production stage: faqat runtime kerak
FROM python:3.11-slim
RUN apt-get install libpq5  # ← Faqat runtime kutubxona
# gcc, libpq-dev → YO'Q (prodga kirmasdi)
# → Image hajmi kamaydi!
```

---

## **11-Qism: Docker Monitoring (10 daqiqa)**

### **Container Resurslarini Ko'rish:**

```bash
# Real-time resurs ishlatish
docker stats

# Natija:
CONTAINER      CPU %   MEM USAGE / LIMIT   MEM %
blog-api       0.5%    85MB / 512MB        16.6%
blog-db        0.1%    45MB / 512MB         8.8%
blog-redis     0.0%    8MB  / 512MB         1.6%
blog-nginx     0.0%    4MB  / 512MB         0.8%
```

---

### **Resurs Chegaralash:**

```yaml
# docker-compose.yml da:
services:
  api:
    ...
    deploy:
      resources:
        limits:
          cpus: '1.0'       # Max 1 CPU
          memory: 512M      # Max 512MB RAM
        reservations:
          cpus: '0.5'       # Min 0.5 CPU
          memory: 256M      # Min 256MB RAM
```

---

## **12-Qism: Keng Tarqalgan Xatolar (25 daqiqa)**

### **Xato 1: Port Allaqachon Band**

```
Error: Bind for 0.0.0.0:8000 failed: port is already allocated
```

**Yechim:**

```bash
# Qaysi jarayon 8000 portni ishlatmoqda?
# Linux/Mac:
lsof -i :8000

# Windows:
netstat -ano | findstr :8000

# O'chirish:
kill -9 <PID>

# Yoki docker-compose da port o'zgartiring:
ports:
  - "8001:8000"   # Host:Container
```

---

### **Xato 2: DB Ulanmadi**

```
sqlalchemy.exc.OperationalError:
could not connect to server: Connection refused
```

**Yechim:**

```yaml
# docker-compose.yml da depends_on to'g'rimi?
depends_on:
  db:
    condition: service_healthy   # ← Bu bo'lishi shart!

# healthcheck to'g'rimi?
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U blog_user -d blog_db"]
  interval: 10s
  retries: 5
```

---

### **Xato 3: Volume Ruxsati**

```
PermissionError: [Errno 13] Permission denied: '/app/uploads'
```

**Yechim:**

```docker
# Dockerfile da:
RUN mkdir -p uploads && \
    chown -R appuser:appuser uploads

# Yoki root user ishlatish (dev da):
USER root
```

---

### **Xato 4: Container Qayta-Qayta Tushadi**

```
blog-api    Restarting (1) 5 seconds ago
```

**Yechim:**

```bash
# Log ni tekshirish:
docker compose logs api

# Ko'p hollarda sabab:
# 1. .env fayli yo'q
# 2. DB ulanmadi
# 3. Kod xatosi

# Qo'lda ishga tushirish (xatoni ko'rish):
docker compose run --rm api bash
# Ichida:
python -c "from app.main import app; print('OK')"
```

---

### **Xato 5: Image Eski Kod**

```
# Kod o'zgartirildi lekin container eski kodni ishlatyapti
```

**Yechim:**

```bash
# Qayta build:
docker compose up --build api

# Yoki cache yo'q:
docker compose build --no-cache api
docker compose up api
```

---

### **Xato 6: .env Fayl Topilmadi**

```
pydantic_settings: field required
```

**Yechim:**

```yaml
# docker-compose.yml da:
services:
  api:
    env_file:
      - .env    # ← Shu qator qo'shilganmi?
    # Yoki:
    environment:
      SECRET_KEY: ${SECRET_KEY}   # .env dan oladi
```

---

### **Xato 7: Alembic Migration Xatosi**

```
alembic.util.exc.CommandError: Can't locate revision
```

**Yechim:**

```bash
# Container ichida alembic_version ni tozalash:
docker compose exec db psql -U blog_user -d blog_db \
  -c "DELETE FROM alembic_version;"

# Qayta migration:
docker compose exec api alembic upgrade head
```

---

## **13-Qism: Foydali Docker Buyruqlar (10 daqiqa)**

```bash
# ─── IMAGE ─────────────────────────────────────

# Barcha image lar
docker images

# Image o'chirish
docker rmi fastapi-blog:latest

# Ishlatilmagan image larni tozalash
docker image prune

# ─── CONTAINER ─────────────────────────────────

# Ishlab turgan container lar
docker ps

# Barcha container lar (to'xtatilgan ham)
docker ps -a

# Container ichiga kirish
docker exec -it blog-api bash

# Container o'chirish
docker rm blog-api

# Barcha to'xtatilgan container larni o'chirish
docker container prune

# ─── COMPOSE ───────────────────────────────────

# Ishga tushirish
docker compose up -d

# To'xtatish
docker compose stop

# O'chirish
docker compose down

# Volume bilan o'chirish
docker compose down -v

# Qayta build
docker compose up --build

# Bitta service restart
docker compose restart api

# Log
docker compose logs -f api

# ─── TOZALASH ──────────────────────────────────

# Hamma narsani tozalash (ehtiyot bo'ling!)
docker system prune -a

# Disk hajmini ko'rish
docker system df
```

---

## **17-18 Kun Xulosasi**

### **Nima O'rgandik:**

✅ Docker nima — VM vs Container

✅ Docker o'rnatish (Win/Mac/Linux)

✅ `Dockerfile` yozish

✅ Layer cache — tezlashtirish

✅ `.dockerignore` — keraksiz fayllarni o'tkazmaslik

✅ `docker build` va `docker run`

✅ `docker-compose.yml` — ko'p container

✅ Service healthcheck va `depends_on`

✅ Network — containerlar o'rtasida aloqa

✅ Volume — ma'lumotlarni saqlash

✅ `docker-compose.prod.yml` — production

✅ `Dockerfile.prod` — multi-stage build

✅ Docker Hub ga push

✅ GitHub Actions bilan auto build

✅ Resurs chegaralash

✅ Nginx reverse proxy

✅ Keng tarqalgan xatolar va yechimlari

---

## **Amaliy Mashqlar**

### **1. Pgadmin Qo'shish:**

```yaml
# docker-compose.yml ga:
pgadmin:
  image: dpage/pgadmin4
  container_name: blog-pgadmin
  environment:
    PGADMIN_DEFAULT_EMAIL: admin@admin.com
    PGADMIN_DEFAULT_PASSWORD: admin
  ports:
    - "5050:80"
  networks:
    - blog-network
  depends_on:
    - db

# http://localhost:5050 → pgAdmin UI!
```

---

### **2. Redis Commander:**

```yaml
redis-commander:
  image: rediscommander/redis-commander
  container_name: blog-redis-ui
  environment:
    REDIS_HOSTS: local:redis:6379
  ports:
    - "8081:8081"
  networks:
    - blog-network
  depends_on:
    - redis

# http://localhost:8081 → Redis UI!
```

---

### **3. Backup Skripti:**

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# PostgreSQL backup
docker compose exec -T db pg_dump \
  -U blog_user blog_db > "$BACKUP_DIR/db_$DATE.sql"

echo "✅ Backup saqlandi: $BACKUP_DIR/db_$DATE.sql"
```

```bash
chmod +x backup.sh
./backup.sh
```

---

## **Uy Vazifasi**

### **1. To'liq Stack Ishlatish:**

```bash
# 1. docker-compose.yml yarating
# 2. Ishga tushiring:
docker compose up --build -d

# 3. Tekshiring:
curl http://localhost/health
curl http://localhost/docs

# 4. Post yarating, tekshiring
# 5. docker compose logs -f ko'ring
```

---

### **2. Image Optimizatsiya:**

```bash
# Oddiy image:
docker build -t blog:normal .
docker images blog:normal

# Multi-stage:
docker build -f Dockerfile.prod -t blog:prod .
docker images blog:prod

# Hajm farqini solishtiring!
```

---

### **3. Environment Ajratish:**

```
development:  docker compose up
staging:      docker compose -f docker-compose.staging.yml up
production:   docker compose -f docker-compose.prod.yml up
```

---

## **Foydali Fayl Tuzilmasi:**

```
fastapi_blog/
├── Dockerfile              ← Development
├── Dockerfile.prod         ← Production (multi-stage)
├── docker-compose.yml      ← Development stack
├── docker-compose.prod.yml ← Production stack
├── nginx.conf              ← Dev nginx
├── nginx.prod.conf         ← Prod nginx (SSL)
├── .dockerignore           ← Docker ignore
├── .env                    ← Dev environment
├── .env.prod               ← Prod environment (gitignore!)
└── backup.sh               ← DB backup skripti
```

---

## **Keyingi Darsda:**

**FastAPI 19-20 Kun: Yakuniy Loyiha**

- Hamma narsani birlashtirish
- To'liq Blog API (barcha xususiyatlar)
- Frontend bilan integratsiya
- Production deploy (Docker + Render/VPS)
- Performance optimizatsiya
- Monitoring va Logging
- Loyihani GitHub ga yuklash

**Kurs yakuniy loyihasi — Portfolio uchun!** 🎓🚀

---

**Jami vaqt:** 5-6 soat tanaffuslar bilan

**Esda tuting:** Docker o'rgangandan keyin "Menda ishlaydi, sizda ishlamaydi" muammosi yo'qoladi! 🐳⚡

---

> **Navigatsiya:** [⬅️ 15-16 Kun (Redis va Caching)](15-16-kun-redis-va-caching.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 19-20 Kun (Yakuniy Katta Loyiha) ➡️](19-20-kun-yakuniy-loyiha-blog-api.md)
