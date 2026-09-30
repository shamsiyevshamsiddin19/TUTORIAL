
# 📚 11-12 Kun: Pytest bilan Testing — Ishonchli API 🧪⚡

> **Navigatsiya:** [⬅️ 09-10 Kun (CORS va Deployment)](09-10-kun-cors-va-deployment.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 13-14 Kun (WebSockets va Background Tasks) ➡️](13-14-kun-websockets-va-background-tasks.md)

---
```
✅ 1-2 Kun:  FastAPI Asoslari
✅ 3-4 Kun:  PostgreSQL + SQLAlchemy
✅ 5-6 Kun:  JWT Authentication
✅ 7-8 Kun:  Alembic Migrations
✅ 9-10 Kun: CORS + Deployment

⏳ 11-12 Kun: Testing (Pytest)
⏳ 13-14 Kun: WebSockets + Background Tasks
⏳ 15-16 Kun: Redis + Caching
⏳ 17-18 Kun: Dockerlash
⏳ 19-20 Kun: Yakuniy Loyiha
```

Davom etaylik! 🚀

---

## **1-Qism: Testing Nima? (15 daqiqa)**

### **Nima Uchun Test?**

```
Test yozmagan developer:

1-hafta:  Kod yozdi → Ishlaydi ✅
2-hafta:  Yangi feature qo'shdi → Ishlaydi ✅
3-hafta:  Biror narsa o'zgartirdi →
          Eski kod buzildi ❌
          Qayerda? Bilmaydi! 😱
```

---

### **Test Yozgan Developer:**

```
1-hafta:  Kod + Test ✅
2-hafta:  Yangi feature + Test ✅
3-hafta:  O'zgartirdi → pytest →
          "posts/test_posts.py::test_create FAILED"
          Qayerda? ANIQ KO'RINADI! ✅
```

---

### **Test Turlari:**

```
Unit Test       → Bitta funksiyani test
Integration Test → Bir nechta qism birga
E2E Test        → To'liq foydalanuvchi yo'li

Biz:
✅ Integration tests (FastAPI TestClient)
   API endpoint larni to'liq test qilamiz
```

---

## **2-Qism: O'rnatish (10 daqiqa)**

```bash
pip install pytest httpx
```

**Tushuntirish:**

```
pytest → Test framework
httpx  → Async HTTP client (TestClient uchun)
```

---

**requirements.txt yangilang:**

```bash
pip freeze > requirements.txt
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
│   ├── routers/
│   │   ├── posts.py
│   │   ├── users.py
│   │   └── auth.py
│   └── utils/
│       └── hashing.py
├── tests/                  ← YANGI
│   ├── __init__.py         ← Bo'sh fayl
│   ├── conftest.py         ← Fixture lar
│   ├── test_posts.py       ← Post testlar
│   ├── test_users.py       ← User testlar
│   └── test_auth.py        ← Auth testlar
├── alembic/
├── .env
└── requirements.txt
```

---

### **tests/init.py**

```python
# Bo'sh fayl — pytest tests/ papkasini modul sifatida ko'rsin
```

---

## **4-Qism: Test Database Sozlash (30 daqiqa)**

### **Nima Uchun Alohida Database?**

```
❌ Production DB da test qilish:
   - Haqiqiy ma'lumotlar o'chirilishi mumkin
   - Boshqalar ishiga xalaqit

✅ Test DB (SQLite — xotira ichida):
   - Har test da yangi DB
   - Tez ishlaydi
   - Hech narsa saqlanmaydi
```

---

### **tests/conftest.py**

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app import models

# ─── TEST DATABASE (SQLite — xotirada) ────────
SQLALCHEMY_TEST_DATABASE_URL = "sqlite://"
# "sqlite://" = xotirada, fayl yaratmaydi

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ─── FIXTURE: Database ────────────────────────
@pytest.fixture()
def db():
    # Jadvallarni yaratish
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Har test keyin jadvallarni tozalash
        Base.metadata.drop_all(bind=engine)

# ─── FIXTURE: TestClient ──────────────────────
@pytest.fixture()
def client(db):
    # get_db ni test DB bilan almashtirish
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

# ─── FIXTURE: Test User ───────────────────────
@pytest.fixture()
def test_user(client):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }
    response = client.post("/users/", json=user_data)
    assert response.status_code == 201

    new_user = response.json()
    new_user["password"] = "password123"  # Testda kerak
    return new_user

# ─── FIXTURE: Token ───────────────────────────
@pytest.fixture()
def token(test_user, client):
    response = client.post(
        "/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"]
        }
    )
    assert response.status_code == 200
    return response.json()["access_token"]

# ─── FIXTURE: Authorized Client ───────────────
@pytest.fixture()
def authorized_client(client, token):
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client

# ─── FIXTURE: Test Posts ──────────────────────
@pytest.fixture()
def test_posts(test_user, db):
    posts_data = [
        {
            "title": "Birinchi post",
            "content": "Birinchi kontent",
            "published": True,
            "owner_id": test_user["id"]
        },
        {
            "title": "Ikkinchi post",
            "content": "Ikkinchi kontent",
            "published": True,
            "owner_id": test_user["id"]
        },
        {
            "title": "Uchinchi post",
            "content": "Uchinchi kontent",
            "published": False,
            "owner_id": test_user["id"]
        },
    ]

    posts = [models.Post(**p) for p in posts_data]
    db.add_all(posts)
    db.commit()

    return db.query(models.Post).all()
```

---

**Tushuntirish — Fixture nima?**

```python
# Fixture = Testdan oldin tayyorlanadigan narsa

@pytest.fixture()
def client(db):        # ← "db" fixture ni ishlatadi
    ...
    yield TestClient(app)   # ← Testga beradi
    ...                     # ← Test keyin tozalaydi

# Ishlatish:
def test_biror_narsa(client):   # ← client fixture
    response = client.get("/")
    assert response.status_code == 200
```

---

## **5-Qism: User Testlari (25 daqiqa)**

### **tests/test_users.py**

```python
import pytest
from jose import jwt
from app.config import settings

# ─── FOYDALANUVCHI YARATISH ───────────────────
def test_create_user(client):
    response = client.post(
        "/users/",
        json={
            "username": "ali",
            "email": "ali@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 201

    data = response.json()
    assert data["email"] == "ali@example.com"
    assert data["username"] == "ali"
    assert "password" not in data    # Parol ko'rinmasin!
    assert "id" in data
    assert "created_at" in data

# ─── TAKRORIY EMAIL ───────────────────────────
def test_create_user_duplicate_email(client):
    # Birinchi user
    client.post(
        "/users/",
        json={
            "username": "ali",
            "email": "ali@example.com",
            "password": "password123"
        }
    )

    # Xuddi shu email bilan yana
    response = client.post(
        "/users/",
        json={
            "username": "vali",
            "email": "ali@example.com",   # Takror!
            "password": "password456"
        }
    )
    assert response.status_code == 400
    assert "allaqachon" in response.json()["detail"]

# ─── NOTO'G'RI MA'LUMOT ───────────────────────
def test_create_user_invalid_email(client):
    response = client.post(
        "/users/",
        json={
            "username": "ali",
            "email": "bu-email-emas",    # Noto'g'ri email
            "password": "password123"
        }
    )
    assert response.status_code == 422   # Validation error

# ─── FOYDALANUVCHINI OLISH ────────────────────
def test_get_user(client, test_user):
    response = client.get(f"/users/{test_user['id']}")
    assert response.status_code == 200

    data = response.json()
    assert data["email"] == test_user["email"]
    assert data["username"] == test_user["username"]

# ─── MAVJUD BO'LMAGAN USER ────────────────────
def test_get_user_not_found(client):
    response = client.get("/users/99999")
    assert response.status_code == 404
```

---

## **6-Qism: Auth Testlari (20 daqiqa)**

### **tests/test_auth.py**

```python
import pytest
from jose import jwt
from app.config import settings
from app import schemas

# ─── LOGIN ────────────────────────────────────
def test_login(client, test_user):
    response = client.post(
        "/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"]
        }
    )
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

# ─── TOKEN TEKSHIRISH ─────────────────────────
def test_login_token_valid(client, test_user):
    response = client.post(
        "/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"]
        }
    )
    token = response.json()["access_token"]

    # Tokenni ochish va tekshirish
    payload = jwt.decode(
        token,
        settings.secret_key,
        algorithms=[settings.algorithm]
    )
    assert payload.get("user_id") == test_user["id"]

# ─── NOTO'G'RI PAROL ──────────────────────────
def test_login_wrong_password(client, test_user):
    response = client.post(
        "/login",
        data={
            "username": test_user["email"],
            "password": "NOTO'G'RI_PAROL"
        }
    )
    assert response.status_code == 403

# ─── MAVJUD BO'LMAGAN USER ────────────────────
def test_login_wrong_email(client):
    response = client.post(
        "/login",
        data={
            "username": "yoq@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 403

# ─── TOKEN SHART ──────────────────────────────
def test_create_post_without_token(client):
    response = client.post(
        "/posts/",
        json={
            "title": "Test post",
            "content": "Kontent"
        }
    )
    assert response.status_code == 401
```

---

## **7-Qism: Post Testlari (35 daqiqa)**

### **tests/test_posts.py**

```python
import pytest
from app import schemas

# ─── BARCHA POSTLAR ───────────────────────────
def test_get_all_posts(client, test_posts):
    response = client.get("/posts/")
    assert response.status_code == 200

    data = response.json()
    assert len(data) == len(test_posts)

# ─── BITTA POST ───────────────────────────────
def test_get_post(client, test_posts):
    response = client.get(f"/posts/{test_posts[0].id}")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == test_posts[0].id
    assert data["title"] == test_posts[0].title

# ─── MAVJUD BO'LMAGAN POST ────────────────────
def test_get_post_not_found(client):
    response = client.get("/posts/99999")
    assert response.status_code == 404

# ─── POST YARATISH (token bilan) ──────────────
def test_create_post(authorized_client):
    response = authorized_client.post(
        "/posts/",
        json={
            "title": "Yangi post",
            "content": "Yangi kontent",
            "published": True
        }
    )
    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Yangi post"
    assert data["content"] == "Yangi kontent"
    assert data["published"] == True
    assert "id" in data
    assert "owner_id" in data

# ─── POST YARATISH (token YO'Q) ───────────────
def test_create_post_unauthorized(client):
    response = client.post(
        "/posts/",
        json={
            "title": "Post",
            "content": "Kontent"
        }
    )
    assert response.status_code == 401

# ─── DEFAULT PUBLISHED = TRUE ─────────────────
def test_create_post_default_published(authorized_client):
    response = authorized_client.post(
        "/posts/",
        json={
            "title": "Post",
            "content": "Kontent"
            # published yuborilmagan!
        }
    )
    assert response.status_code == 201
    assert response.json()["published"] == True

# ─── POST YANGILASH ───────────────────────────
def test_update_post(authorized_client, test_posts):
    response = authorized_client.put(
        f"/posts/{test_posts[0].id}",
        json={
            "title": "Yangilangan sarlavha",
            "content": "Yangilangan kontent",
            "published": True
        }
    )
    assert response.status_code == 200

    data = response.json()
    assert data["title"] == "Yangilangan sarlavha"
    assert data["content"] == "Yangilangan kontent"

# ─── BOSHQANING POSTINI YANGILASH ─────────────
def test_update_other_user_post(authorized_client, db):
    from app import models
    from app.utils.hashing import hash_password

    # Ikkinchi user yaratish
    other_user = models.User(
        username="other",
        email="other@example.com",
        password=hash_password("password123")
    )
    db.add(other_user)
    db.commit()
    db.refresh(other_user)

    # Ikkinchi userning posti
    other_post = models.Post(
        title="Boshqaning posti",
        content="Kontent",
        owner_id=other_user.id
    )
    db.add(other_post)
    db.commit()
    db.refresh(other_post)

    # Birinchi user boshqaning postini yangilashga urinadi
    response = authorized_client.put(
        f"/posts/{other_post.id}",
        json={
            "title": "O'g'irlashga urindim",
            "content": "Kontent",
            "published": True
        }
    )
    assert response.status_code == 403

# ─── POST O'CHIRISH ───────────────────────────
def test_delete_post(authorized_client, test_posts):
    response = authorized_client.delete(
        f"/posts/{test_posts[0].id}"
    )
    assert response.status_code == 204

# ─── O'CHIRILGAN POSTNI TEKSHIRISH ────────────
def test_delete_post_check(authorized_client, test_posts):
    authorized_client.delete(f"/posts/{test_posts[0].id}")

    # O'chirilgan postni olishga urinish
    response = authorized_client.get(
        f"/posts/{test_posts[0].id}"
    )
    assert response.status_code == 404

# ─── MAVJUD BO'LMAGAN POSTNI O'CHIRISH ────────
def test_delete_post_not_found(authorized_client):
    response = authorized_client.delete("/posts/99999")
    assert response.status_code == 404

# ─── BOSHQANING POSTINI O'CHIRISH ─────────────
def test_delete_other_user_post(authorized_client, db):
    from app import models
    from app.utils.hashing import hash_password

    other_user = models.User(
        username="other2",
        email="other2@example.com",
        password=hash_password("password123")
    )
    db.add(other_user)
    db.commit()
    db.refresh(other_user)

    other_post = models.Post(
        title="Boshqaning posti",
        content="Kontent",
        owner_id=other_user.id
    )
    db.add(other_post)
    db.commit()
    db.refresh(other_post)

    response = authorized_client.delete(
        f"/posts/{other_post.id}"
    )
    assert response.status_code == 403

# ─── PAGINATION ───────────────────────────────
def test_get_posts_pagination(client, test_posts):
    response = client.get("/posts/?limit=2&skip=0")
    assert response.status_code == 200
    assert len(response.json()) == 2

    response2 = client.get("/posts/?limit=2&skip=2")
    assert response2.status_code == 200
    assert len(response2.json()) == 1

# ─── QIDIRUV ──────────────────────────────────
def test_get_posts_search(client, test_posts):
    response = client.get("/posts/?search=Birinchi")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Birinchi post"
```

---

## **8-Qism: Testlarni Ishga Tushirish (15 daqiqa)**

update app/post.py

update app/users.py

### **Barcha Testlar:**

```bash
pytest
```

**Natija:**

```
============================= test session starts =============================
collected 24 items

tests/test_users.py .....                                              [ 20%]
tests/test_auth.py .....                                               [ 41%]
tests/test_posts.py ..............                                     [100%]

============================== 24 passed in 3.42s =============================
```

---

### **Batafsil natija:**

```bash
pytest -v
```

**Natija:**

```
tests/test_users.py::test_create_user PASSED
tests/test_users.py::test_create_user_duplicate_email PASSED
tests/test_users.py::test_create_user_invalid_email PASSED
tests/test_users.py::test_get_user PASSED
tests/test_users.py::test_get_user_not_found PASSED
tests/test_auth.py::test_login PASSED
tests/test_auth.py::test_login_token_valid PASSED
...
tests/test_posts.py::test_create_post PASSED
tests/test_posts.py::test_delete_post PASSED
...
```

---

### **Bitta fayl:**

```bash
pytest tests/test_posts.py -v
```

---

### **Bitta test:**

```bash
pytest tests/test_posts.py::test_create_post -v
```

---

### **Xatolikda to'xtash:**

```bash
pytest -x      # Birinchi xatoda to'xtaydi
pytest -x -v   # Batafsil + birinchi xatoda to'xtash
```

---

## **9-Qism: Coverage — Qancha Kod Test Qilindi? (15 daqiqa)**

### **O'rnatish:**

```bash
pip install pytest-cov
```

---

### **Coverage Hisobot:**

```bash
pytest --cov=app
```

**Natija:**

```
---------- coverage: platform linux, python 3.11 ----------
Name                    Stmts   Miss  Cover
-------------------------------------------
app/__init__.py             0      0   100%
app/config.py               8      0   100%
app/database.py            14      2    86%
app/main.py                14      0   100%
app/models.py              20      0   100%
app/oauth2.py              28      4    86%
app/routers/auth.py        20      0   100%
app/routers/posts.py       52      2    96%
app/routers/users.py       24      0   100%
app/schemas.py             30      0   100%
app/utils/hashing.py        4      0   100%
-------------------------------------------
TOTAL                     214     8    96%
```

!image.png

index.html browser-da oching!

---

Qaysi qatorlar test qilinmaganini ko'rsatadi! 🎯

---

## **10-Qism: pytest.ini Sozlash (10 daqiqa)**

### **Loyiha ildizida `pytest.ini`:**

```
[pytest]
addopts = -v --cov=app --cov-report=term-missing
testpaths = tests
```

**Endi faqat `pytest` yozsangiz — coverage ham chiqadi!**

in detail

---

## **11-Qism: Keng Tarqalgan Test Xatolari (20 daqiqa)**

### **Xato 1: Import Error**

```
ImportError: cannot import name 'app' from 'app.main'
```

**Yechim:**

```python
# conftest.py da path tekshiring:
from app.main import app   # app/main.py da "app = FastAPI()"
from app.database import Base, get_db
```

---

### **Xato 2: Database Locked (SQLite)**

```
sqlalchemy.exc.OperationalError: database is locked
```

**Yechim:**

```python
# conftest.py da StaticPool ishlatilganmi?
engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,    # ← Bu bo'lishi SHART!
)
```

---

### **Xato 3: Fixture Topilmadi**

```
fixture 'authorized_client' not found
```

**Yechim:**

```
conftest.py fayli tests/ papkasida bo'lishi kerak!
tests/
├── __init__.py
├── conftest.py    ← SHU YERDA!
├── test_posts.py
```

---

### **Xato 4: 422 Unprocessable Entity (Login testda)**

```
assert response.status_code == 200
AssertionError: 422 != 200
```

**Yechim:**

```python
# Login form-data talab qiladi:
response = client.post(
    "/login",
    data={           # ← "data" (json emas!)
        "username": email,
        "password": password
    }
)
```

---

### **Xato 5: Test Izolatsiyasi Buzilgan**

```
# Testlar bir-biriga ta'sir qilmoqda
```

**Yechim:**

```python
# conftest.py da har test uchun DB tozalash:
@pytest.fixture()
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)   # ← SHU QATOR!
```

---

### **Xato 6: coverage — module not found**

```
No data was collected
```

**Yechim:**

```bash
# app/ papkasi tekshiring:
pytest --cov=app    # ← app/ papkasi nomi

# Yoki to'liq path:
pytest --cov=./app
```

---

## **12-Qism: GitHub Actions bilan CI (15 daqiqa)**

### **.github/workflows/tests.yml:**

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Kodni olish
        uses: actions/checkout@v3

      - name: Python sozlash
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Paketlarni o'rnatish
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Testlarni ishga tushirish
        env:
          PYTHONPATH: .
          DATABASE_URL: sqlite://
          SECRET_KEY: test-secret-key-12345
          ALGORITHM: HS256
          ACCESS_TOKEN_EXPIRE_MINUTES: 30
          ALLOWED_ORIGINS: http://localhost:3000
          ENVIRONMENT: testing
        run: |
          pytest --cov=app --cov-report=xml

      - name: Coverage hisobotini yuklash
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
```

---

```bash
 pip freeze > requirements.txt                                                                 
```

**Endi har `git push` da:**

```
GitHub → Actions → Tests ✅ yoki ❌
```

---

## **11-12 Kun Xulosasi**

### **Nima O'rgandik:**

✅ Nima uchun test yozish kerak

✅ `pytest` va `httpx` o'rnatish

✅ Test database (SQLite in-memory)

✅ `conftest.py` — fixture lar

✅ `client`, `authorized_client`, `test_user`, `token` fixture lari

✅ User testlari (yaratish, olish, duplicate)

✅ Auth testlari (login, token, noto'g'ri parol)

✅ Post testlari (CRUD, ruxsat, pagination)

✅ `pytest -v` batafsil natija

✅ `pytest --cov=app` coverage

✅ `pytest.ini` sozlash

✅ GitHub Actions bilan CI

✅ Keng tarqalgan xatolar va yechimlari

---

## **Amaliy Mashqlar**

### **1. Me Endpoint Testi**

```python
def test_get_current_user(authorized_client, test_user):
    response = authorized_client.get("/users/me")
    assert response.status_code == 200
    assert response.json()["email"] == test_user["email"]

def test_get_current_user_unauthorized(client):
    response = client.get("/users/me")
    assert response.status_code == 401
```

---

### **2. Parol O'zgartirish Testi**

```python
def test_change_password(authorized_client, test_user):
    response = authorized_client.put(
        "/users/me/password",
        json={
            "old_password": test_user["password"],
            "new_password": "yangi_parol_123"
        }
    )
    assert response.status_code == 200
```

---

### **3. Parametrlashtirilgan Test**

```python
@pytest.mark.parametrize("email, password, status_code", [
    ("test@example.com", "password123", 200),      # To'g'ri
    ("test@example.com", "NOTO'G'RI", 403),        # Noto'g'ri parol
    ("yoq@example.com", "password123", 403),       # Email yo'q
    ("test@example.com", "", 422),                 # Bo'sh parol
])
def test_login_cases(client, test_user, email, password, status_code):
    response = client.post(
        "/login",
        data={"username": email, "password": password}
    )
    assert response.status_code == status_code
```

---

## **Uy Vazifasi**

### **1. 100% Coverage**

```bash
pytest --cov=app --cov-report=term-missing
# Miss qolgan qatorlarni toping
# Va ular uchun test yozing
```

---

### **2. Barcha Mavjud Endpointlar Uchun Test**

```
✅ GET  /
✅ GET  /health
✅ POST /users/
✅ GET  /users/{id}
✅ POST /login
✅ GET  /posts/
✅ POST /posts/
✅ GET  /posts/{id}
✅ PUT  /posts/{id}
✅ DELETE /posts/{id}
```

---

### **3. Edge Cases**

```python
# Bo'sh title bilan post:
def test_create_post_empty_title(authorized_client):
    response = authorized_client.post(
        "/posts/",
        json={"title": "", "content": "Kontent"}
    )
    # 422 kelishi kerak

# Juda uzun title:
def test_create_post_long_title(authorized_client):
    response = authorized_client.post(
        "/posts/",
        json={"title": "A" * 1000, "content": "Kontent"}
    )
    # 422 kelishi kerak (255 ta belgi limit)
```

---

## **Foydali Buyruqlar:**

```bash
# Barcha testlar
pytest

# Batafsil
pytest -v

# Bitta fayl
pytest tests/test_posts.py -v

# Bitta test
pytest tests/test_posts.py::test_create_post -v

# Xatoda to'xtash
pytest -x -v

# Coverage bilan
pytest --cov=app

# HTML coverage
pytest --cov=app --cov-report=html
# → htmlcov/index.html

# Tez (parallel)
pip install pytest-xdist
pytest -n auto
```

---

## **Keyingi Darsda:**

**FastAPI 13-14 Kun: WebSockets va Background Tasks**

- WebSocket nima?
- Real-time chat
- Background tasks
- Email yuborish (asinxron)
- Fayl yuklash
- Long-running tasks

**Real-time xususiyatlar!** ⚡🔌

---

**Jami vaqt:** 4-5 soat tanaffuslar bilan

**Esda tuting:** Test yozish vaqt oladi, lekin kelajakda 10x vaqt tejaydi! 🧪⚡

---

> **Navigatsiya:** [⬅️ 09-10 Kun (CORS va Deployment)](09-10-kun-cors-va-deployment.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 13-14 Kun (WebSockets va Background Tasks) ➡️](13-14-kun-websockets-va-background-tasks.md)
