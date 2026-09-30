
# 📚 01-02 Kun: FastAPI — Boshlanish va Asoslar ⚡🚀

> **Navigatsiya:** [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 03-04 Kun (SQLAlchemy va PostgreSQL) ➡️](03-04-kun-sqlalchemy-va-postgresql.md)

---
## Tezkor va Zamonaviy API Framework! ⚡🚀

---

## **1-Qism: FastAPI Nima? (20 daqiqa)**

### **Oddiy Tushuntirish:**

FastAPI - bu Python da API yaratish uchun eng **tez** va **zamonaviy** framework.

---

### **Django vs FastAPI:**

```
Django:
✅ Full-stack (Frontend + Backend)
✅ Admin panel
✅ ORM (Database)
✅ Authentication
❌ Sekinroq
❌ API uchun qo'shimcha ishlar kerak

FastAPI:
✅ Faqat API (Backend)
✅ Juda tez (Nodejs dan ham tez!)
✅ Avtomatik dokumentatsiya
✅ Type hints (Python 3.6+)
✅ Async/Await
❌ Admin panel yo'q
❌ ORM yo'q (lekin qo'shish oson)
```

---

### **FastAPI Qayerda Ishlatiladi?**

```
- Mobile app backend
- Microservices
- Machine Learning API
- Real-time applications
- WebSocket server
- High-performance API
```

**Kimlar Ishlatadi:**

- Uber
- Netflix
- Microsoft
- NASA

---

### **Nega FastAPI?**

```python
# Django REST Framework
from rest_framework import serializers, viewsets

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

# 20+ qator kod

====================================================================================

# FastAPI
from fastapi import FastAPI

app = FastAPI()

@app.get("/posts")
def get_posts():
    return [{"id": 1, "title": "Post 1"}]

# 6 qator kod! 🚀
```

---

## **2-Qism: O'rnatish va Birinchi API (25 daqiqa)**

### **1-Qadam: Yangi Loyiha Yaratish**

```bash
# Yangi papka
mkdir fastapi_blog
cd fastapi_blog

# Virtual environment
python -m venv venv

# Faollashtirish
# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate
```

---

### **2-Qadam: FastAPI O'rnatish**

```bash
python -m pip install fastapi
python -m pip install "uvicorn[standard]"
```

**Tushuntirish:**

- `fastapi` - framework
- `uvicorn` - ASGI server (Django'dagi Gunicorn kabi)

---

### **3-Qadam: Birinchi API**

`main.py` yarating:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"xabar": "Salom FastAPI!"}

@app.get("/salom/{ism}")
def salom(ism: str):
    return {"xabar": f"Salom {ism}!"}
```

---

### **4-Qadam: Ishga Tushirish**

```bash
python -m uvicorn main:app --reload
```

**Natija:**

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

---

### **5-Qadam: Sinab Ko'ring!**

**Brauzerda:**

`http://127.0.0.1:8000/`

```json
{
  "xabar": "Salom FastAPI!"
}
```

---

`http://127.0.0.1:8000/salom/Ahmad`

```json
{
  "xabar": "Salom Ahmad!"
}
```

**ISHLADI!** 🎉

---

### **6-Qadam: AVTOMATIK DOKUMENTATSIYA!**

FastAPI ning eng zo'r xususiyati:

`http://127.0.0.1:8000/docs`

**Swagger UI** - interaktiv dokumentatsiya! 😍

- Barcha endpoint lar
- Try it out tugmasi
- So'rov/Javob misollari
- Avtomatik yaratiladi!

---

`http://127.0.0.1:8000/redoc`

**ReDoc** - boshqa uslub, bir xil ma'lumot.

---

## **3-Qism: Type Hints va Pydantic (30 daqiqa)**

### **Type Hints Nima?**

```python
# Oddiy Python
def qoshish(a, b):
    return a + b

# Type hints bilan
def qoshish(a: int, b: int) -> int:
    return a + b
```

**FastAPI type hints ga bog'langan!**

---

### **Oddiy Endpoint**

```python
@app.get("/post/{post_id}")
def get_post(post_id: int):
    return {"id": post_id, "title": "Test post"}
```

**Test:**

- `http://127.0.0.1:8000/post/5` ✅ Ishlaydi
- `http://127.0.0.1:8000/post/abc` ❌ Xato: "value is not a valid integer"

FastAPI avtomatik tekshiradi! 🎯

---

### **Query Parameters**

```python
from typing import Optional

@app.get("/postlar")
def get_postlar(skip: str = "0", limit: int = 10, qidiruv: Optional[str] = None):

    return {
        "skip": skip,
        "limit": limit,
        "qidiruv": qidiruv
    }
```

**Test:**

`http://127.0.0.1:8000/postlar?skip=5&limit=20&qidiruv=python`

```json
{
  "skip": 5,
  "limit": 20,
  "qidiruv": "python"
}
```

---

### **Pydantic Models**

**Pydantic** - ma'lumotlarni validatsiya qilish uchun.

```python
from pydantic import BaseModel

class Post(BaseModel):
    title: str
    content: str
    published: bool = True
    rating: Optional[int] = None

@app.post("/post")
def create_post(post: Post):
    return {
        "xabar": "Post yaratildi",
        "post": post
    }
```

---

**Swagger UI da sinang:**

1. `/docs` ga kiring
2. `POST /post` ni tanlang
3. "Try it out"
4. Request body:

```json
{
  "title": "FastAPI o'rganish",
  "content": "FastAPI juda tez!",
  "published": true,
  "rating": 5
}
```

1. "Execute"

**Javob:**

```json
{
  "xabar": "Post yaratildi",
  "post": {
    "title": "FastAPI o'rganish",
    "content": "FastAPI juda tez!",
    "published": true,
    "rating": 5
  }
}
```

---

### **Validatsiya Avtomatik!**

Agar noto'g'ri ma'lumot yuborsangiz:

```json
{
  "title": 123,  // string kerak!
  "content": "Test"
}
```

**Xato:**

```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "str type expected",
      "type": "type_error.str"
    }
  ]
}
```

FastAPI avtomatik tekshiradi! ✅

---

## **4-Qism: Path Operations (30 daqiqa)**

### **HTTP Methods:**

```
GET    - Ma'lumot olish
POST   - Yangi yaratish
PUT    - To'liq yangilash
PATCH  - Qisman yangilash
DELETE - O'chirish
```

---

### **CRUD Misoli**

explained post.dict()

```python
from fastapi import FastAPI
from typing import List
from typing import Optional
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
def read_root():
    return {"xabar": "Salom FastAPI!"}

class Post(BaseModel):
    title: str
    content: str
    published: bool = True
    rating: Optional[int] = None

posts_db = []
post_id_counter = 1

# CREATE
@app.post("/posts")
def create_post(post: Post):
    global post_id_counter

    post_dict = post.dict()
    post_dict["id"] = post_id_counter
    post_id_counter += 1

    posts_db.append(post_dict)

    return {"xabar": "Post yaratildi", "post": post_dict}

# READ ALL
@app.get("/posts")
def get_all_posts():
    return {"posts": posts_db}

# READ ONE
@app.get("/posts/{post_id}")
def get_post(post_id: int):
    for post in posts_db:
        if post["id"] == post_id:
            return {"post": post}

    return {"xato": "Post topilmadi"}

# UPDATE
@app.put("/posts/{post_id}")
def update_post(post_id: int, post: Post):
    for index, p in enumerate(posts_db):
        if p["id"] == post_id:
            post_dict = post.dict()
            post_dict["id"] = post_id
            posts_db[index] = post_dict
            return {"xabar": "Post yangilandi", "post": post_dict}

    return {"xato": "Post topilmadi"}

# DELETE
@app.delete("/posts/{post_id}")
def delete_post(post_id: int):
    for index, post in enumerate(posts_db):
        if post["id"] == post_id:
            posts_db.pop(index)
            return {"xabar": "Post o'chirildi"}

    return {"xato": "Post topilmadi"}
```

---

### **Swagger UI da Test:**

1. POST `/posts` - yangi post yarating
2. GET `/posts` - barcha postlarni ko'ring
3. GET `/posts/1` - bitta postni oling
4. PUT `/posts/1` - postni yangilang
5. DELETE `/posts/1` - postni o'chiring

**Hammasi interaktiv!** 🎮

---

## **5-Qism: Status Codes va Error Handling (25 daqiqa)**

### **HTTP Status Codes:**

```
200 - OK (Muvaffaqiyatli)
201 - Created (Yaratildi)
204 - No Content (Ma'lumot yo'q)
400 - Bad Request (Noto'g'ri so'rov)
401 - Unauthorized (Autentifikatsiya kerak)
403 - Forbidden (Ruxsat yo'q)
404 - Not Found (Topilmadi)
500 - Internal Server Error (Server xatosi)
```

---

### **Status Code Ishlatish**

```python
from fastapi import status, HTTPException

@app.post("/posts", status_code=status.HTTP_201_CREATED)
def create_post(post: Post):
    # ... kod
    return {"xabar": "Yaratildi"}

```

```python
INFO:     127.0.0.1:7573 - "POST /posts HTTP/1.1" 201 Created
INFO:     127.0.0.1:53490 - "POST /posts HTTP/1.1" 201 Created
```

---

### **Custom Exceptions**

```python

class PostNotFound(Exception):
    pass
@app.exception_handler(PostNotFound)
async def post_not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"xato": "Post topilmadi", "tavsiya": "Boshqa ID ni sinab ko'ring"}
    )
# READ ONE
@app.get("/posts/{post_id}")
def get_post(post_id: int):
    for post in posts_db:
        if post["id"] == post_id:
            return {"post": post}

    raise PostNotFound()
```

---

## **6-Qism: Response Model (20 daqiqa)**

### **Nega Response Model?**

```python
# Muammo: Parol ham ko'rinadi!
class User(BaseModel):
    username: str
    email: str
    password: str

@app.post("/users")
def create_user(user: User):
    return user  # ❌ Parol ham qaytadi!
```

---

### **Yechim: Response Model**

```python
class User(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    username: str
    email: str
    # password yo'q!

@app.post("/users", response_model=UserResponse)
def create_user(user: User):
    # user ni saqlaymiz (parol bilan)
    return user  # ✅ Faqat username va email qaytadi!
```

---

## **7-Qism: Loyiha Tuzilmasi (25 daqiqa)**

### **Hozirgi Muammo:**

Hammasi `main.py` da - chalkash! 😵

---

### **Yaxshi Tuzilma:**

```
fastapi_blog/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── posts.py
│   │   └── users.py
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── venv/
└── requirements.txt
```

---

### **app/schemas.py** (Pydantic models)

```python
from pydantic import BaseModel
from typing import Optional

class PostBase(BaseModel):
    title: str
    content: str
    published: bool = True

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True
```

---

### **app/routers/posts.py**

```python
from fastapi import APIRouter, status, HTTPException
from typing import List
from ..schemas import PostCreate, PostResponse

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

posts_db = []
post_id = 1

@router.get("/", response_model=List[PostResponse])
def get_posts():
    return posts_db

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=PostResponse)
def create_post(post: PostCreate):
    global post_id
    post_dict = post.dict()
    post_dict["id"] = post_id
    post_id += 1
    posts_db.append(post_dict)
    return post_dict

@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int):
    for post in posts_db:
        if post["id"] == post_id:
            return post
    raise HTTPException(status_code=404, detail="Post topilmadi")

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int):
    for index, post in enumerate(posts_db):
        if post["id"] == post_id:
            posts_db.pop(index)
            return None
    raise HTTPException(status_code=404, detail="Post topilmadi")
```

---

### **app/main.py**

```python
from fastapi import FastAPI
from .routers import posts

app = FastAPI(
    title="Blog API",
    description="FastAPI bilan yaratilgan Blog API",
    version="1.0.0"
)

# Routers
app.include_router(posts.router)

@app.get("/")
def root():
    return {"xabar": "Blog API ga xush kelibsiz!"}
```

---

### **Ishga Tushirish:**

```bash
python -m uvicorn app.main:app --reload
```

**Endi:**

- `/docs` da "Posts" tagi bor
- Kod tashkil topgan
- Qo'shish oson

---

## **8-Qism: Environment Variables (15 daqiqa)**

### **1-Qadam: python-dotenv**

```bash
pip install python-dotenv
```

---

### **2-Qadam: .env Fayli in main folder, outside the app**

```
DATABASE_URL=postgresql://user:password@localhost/blog_db
SECRET_KEY=super-maxfiy-kalit-12345
DEBUG=True
```

---

### **3-Qadam: config.py**

`app/config.py`:

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

`schemas.py`

```python
from pydantic import BaseModel
from typing import Optional

class PostBase(BaseModel):
    title: str
    content: str
    published: bool = True

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True
```

```python
python -m pip install pydantic-settings==2.13.1
```

### **4-Qadam: Ishlatish (in shell)**

```python
from .config import settings

print(settings.database_url)
print(settings.secret_key)
```

---

## **1-2 Kun Xulosasi**

### **Nima O'rgandik:**

✅ FastAPI nima va nega

✅ O'rnatish va setup

✅ Birinchi API endpoint

✅ Avtomatik dokumentatsiya (Swagger)

✅ Type hints

✅ Pydantic models

✅ Path operations (GET, POST, PUT, DELETE)

✅ Status codes

✅ Error handling

✅ Response models

✅ Loyiha tuzilmasi

✅ Environment variables

---

## **Amaliy Mashqlar**

### **1. Kategory API**

```python
class Category(BaseModel):
    name: str
    description: str

# CRUD endpoints yarating
```

---

### **2. Qidiruv Funksiyasi**

```python
@router.get("/search")
def search_posts(q: str):
    # Title yoki content da qidirish
    pass
```

---

### **3. Pagination**

```python
@router.get("/")
def get_posts(skip: int = 0, limit: int = 10):
    return posts_db[skip : skip + limit]
```

---

## **Uy Vazifasi**

### **1. To-Do API**

To-do list uchun CRUD API:

```python
class Todo(BaseModel):
    title: str
    completed: bool = False

# Endpoints:
# GET /todos
# POST /todos
# PUT /todos/{id}
# DELETE /todos/{id}
```

---

### **2. Validation**

Email va password validatsiya:

```python
from pydantic import EmailStr, validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Parol kamida 8 ta belgi bo\'lishi kerak')
        return v
```

---

### **3. Dokumentatsiya**

Har bir endpoint ga docstring qo'shing:

```python
@router.get("/{post_id}")
def get_post(post_id: int):
    """
    Bitta postni ID orqali olish

    - **post_id**: Post ning ID raqami

    Returns:
        Post ma'lumotlari
    """
    pass
```

---

## **Keyingi Darsda:**

**FastAPI 3-4 Kun: Database (SQLAlchemy)**

- SQLAlchemy ORM
- PostgreSQL bilan ishlash
- Relationships
- Migrations (Alembic)
- Async Database

**Haqiqiy ma'lumotlar bazasi bilan ishlaymiz!** 🗄️

---

## **Foydali Linklar:**

📚 Dokumentatsiya: https://fastapi.tiangolo.com/

🎓 Tutorial: https://fastapi.tiangolo.com/tutorial/

💬 Discord: FastAPI Discord Server

---

**Jami vaqt:** 3-4 soat tanaffuslar bilan

**Esda tuting:** FastAPI - zamonaviy Python web development ning kelajagi! Davom eting! ⚡🚀

---

> **Navigatsiya:** [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 03-04 Kun (SQLAlchemy va PostgreSQL) ➡️](03-04-kun-sqlalchemy-va-postgresql.md)
