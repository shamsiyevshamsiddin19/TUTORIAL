# 📚 19-20 Kun: Yakuniy Loyiha — Hamma Narsa Birlashadi (To'liq Blog API) 🎓🚀

> **Navigatsiya:** [⬅️ 17-18 Kun (Docker va Konteynerlar)](17-18-kun-docker-va-konteynerlashtirish.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md)

---
## **1-Qism: Loyiha Rejasi (15 daqiqa)**

### **Nima Quramiz:**

```
To'liq Blog API:

✅ Foydalanuvchilar (CRUD + Auth)
✅ Postlar (CRUD + Search + Pagination)
✅ Kategoriyalar
✅ Izohlar (Comments)
✅ Like tizimi
✅ Tag tizimi
✅ Rasm yuklash
✅ JWT Authentication
✅ Redis Cache
✅ WebSocket (Jonli izohlar)
✅ Background Tasks (Email)
✅ Rate Limiting
✅ Docker
✅ Alembic Migrations
✅ Testlar
✅ Logging
✅ API Versiyalash
```

---

### **To'liq Loyiha Tuzilmasi:**

```
fastapi_blog/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── oauth2.py
│   ├── cache.py
│   ├── logger.py           ← YANGI
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── posts.py
│   │   ├── categories.py   ← YANGI
│   │   ├── comments.py     ← YANGI
│   │   ├── likes.py        ← YANGI
│   │   ├── tags.py         ← YANGI
│   │   ├── upload.py
│   │   ├── websocket.py
│   │   └── admin.py
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── rate_limit.py
│   │   └── logging.py      ← YANGI
│   └── utils/
│       ├── __init__.py
│       ├── hashing.py
│       ├── email.py
│       └── otp.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_users.py
│   ├── test_posts.py
│   ├── test_comments.py    ← YANGI
│   └── test_likes.py       ← YANGI
├── alembic/
│   ├── versions/
│   └── env.py
├── logs/                   ← YANGI
├── Dockerfile
├── Dockerfile.prod
├── docker-compose.yml
├── docker-compose.prod.yml
├── nginx.conf
├── pytest.ini
├── .env
├── .env.example
├── .gitignore
├── .dockerignore
├── alembic.ini
├── requirements.txt
└── README.md
```

---

## **2-Qism: To'liq Models (30 daqiqa)**

### **app/models.py — To'liq:**

```python
from sqlalchemy import (
    Column, Integer, String, Boolean,
    Text, ForeignKey, TIMESTAMP, Table
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# ─── KO'P-KO'P JADVAL (Post ↔ Tag) ───────────
post_tags = Table(
    "post_tags",
    Base.metadata,
    Column(
        "post_id",
        Integer,
        ForeignKey("posts.id", ondelete="CASCADE"),
        primary_key=True
    ),
    Column(
        "tag_id",
        Integer,
        ForeignKey("tags.id", ondelete="CASCADE"),
        primary_key=True
    )
)

# ─── USER ─────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String(100), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    is_active = Column(Boolean, server_default="TRUE")
    is_admin = Column(Boolean, server_default="FALSE")
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    posts = relationship(
        "Post",
        back_populates="owner",
        cascade="all, delete-orphan"
    )
    comments = relationship(
        "Comment",
        back_populates="author",
        cascade="all, delete-orphan"
    )
    likes = relationship(
        "Like",
        back_populates="user",
        cascade="all, delete-orphan"
    )

# ─── CATEGORY ─────────────────────────────────
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(120), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    posts = relationship("Post", back_populates="category")

# ─── TAG ──────────────────────────────────────
class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(50), nullable=False, unique=True)
    slug = Column(String(60), nullable=False, unique=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    posts = relationship(
        "Post",
        secondary=post_tags,
        back_populates="tags"
    )

# ─── POST ─────────────────────────────────────
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(String(255), nullable=False)
    slug = Column(String(280), nullable=False, unique=True)
    content = Column(Text, nullable=False)
    excerpt = Column(String(500), nullable=True)
    cover_image = Column(String(500), nullable=True)
    published = Column(Boolean, server_default="TRUE")
    views = Column(Integer, server_default="0")
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now(),
        nullable=True
    )

    # Foreign Keys
    owner_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    category_id = Column(
        Integer,
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True
    )

    # Relationships
    owner = relationship("User", back_populates="posts")
    category = relationship("Category", back_populates="posts")
    comments = relationship(
        "Comment",
        back_populates="post",
        cascade="all, delete-orphan"
    )
    likes = relationship(
        "Like",
        back_populates="post",
        cascade="all, delete-orphan"
    )
    tags = relationship(
        "Tag",
        secondary=post_tags,
        back_populates="posts"
    )

# ─── COMMENT ──────────────────────────────────
class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now(),
        nullable=True
    )

    # Foreign Keys
    post_id = Column(
        Integer,
        ForeignKey("posts.id", ondelete="CASCADE"),
        nullable=False
    )
    author_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    parent_id = Column(
        Integer,
        ForeignKey("comments.id", ondelete="CASCADE"),
        nullable=True    # Javob izoh (nested)
    )

    # Relationships
    post = relationship("Post", back_populates="comments")
    author = relationship("User", back_populates="comments")
    replies = relationship(
        "Comment",
        backref="parent"
    )

# ─── LIKE ─────────────────────────────────────
class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    # Foreign Keys
    post_id = Column(
        Integer,
        ForeignKey("posts.id", ondelete="CASCADE"),
        nullable=False
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    # Relationships
    post = relationship("Post", back_populates="likes")
    user = relationship("User", back_populates="likes")
```

---

### **Migration Yaratish:**

```bash
alembic revision --autogenerate -m "add_full_blog_tables"
alembic upgrade head
```

---

## **3-Qism: To'liq Schemas (25 daqiqa)**

### **app/schemas.py — To'liq:**

```python
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
import re

# ─── TOKEN ────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None

# ─── USER ─────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @validator("username")
    def username_valid(cls, v):
        if len(v) < 3:
            raise ValueError("Username kamida 3 belgi")
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("Faqat harf, raqam va _ belgisi")
        return v

    @validator("password")
    def password_valid(cls, v):
        if len(v) < 8:
            raise ValueError("Parol kamida 8 belgi")
        return v

class UserUpdate(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserShort(BaseModel):
    id: int
    username: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

# ─── CATEGORY ─────────────────────────────────
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ─── TAG ──────────────────────────────────────
class TagCreate(BaseModel):
    name: str

class TagResponse(BaseModel):
    id: int
    name: str
    slug: str

    class Config:
        from_attributes = True

# ─── POST ─────────────────────────────────────
class PostCreate(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    published: bool = True
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = []

    @validator("title")
    def title_valid(cls, v):
        if len(v.strip()) < 3:
            raise ValueError("Sarlavha kamida 3 belgi")
        if len(v) > 255:
            raise ValueError("Sarlavha 255 belgidan oshmasin")
        return v.strip()

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    published: Optional[bool] = None
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None

class PostResponse(BaseModel):
    id: int
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    published: bool
    views: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner_id: int
    owner: Optional[UserShort] = None
    category: Optional[CategoryResponse] = None
    tags: Optional[List[TagResponse]] = []
    likes_count: Optional[int] = 0
    comments_count: Optional[int] = 0

    class Config:
        from_attributes = True

class PostList(BaseModel):
    """Ro'yxat uchun qisqaroq versiya"""
    id: int
    title: str
    slug: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    published: bool
    views: int
    created_at: datetime
    owner: Optional[UserShort] = None
    category: Optional[CategoryResponse] = None
    likes_count: Optional[int] = 0
    comments_count: Optional[int] = 0

    class Config:
        from_attributes = True

# ─── COMMENT ──────────────────────────────────
class CommentCreate(BaseModel):
    content: str
    parent_id: Optional[int] = None

    @validator("content")
    def content_valid(cls, v):
        if len(v.strip()) < 1:
            raise ValueError("Izoh bo'sh bo'lmasin")
        if len(v) > 2000:
            raise ValueError("Izoh 2000 belgidan oshmasin")
        return v.strip()

class CommentUpdate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    post_id: int
    author_id: int
    parent_id: Optional[int] = None
    author: Optional[UserShort] = None
    replies: Optional[List["CommentResponse"]] = []

    class Config:
        from_attributes = True

CommentResponse.model_rebuild()

# ─── LIKE ─────────────────────────────────────
class LikeResponse(BaseModel):
    post_id: int
    user_id: int
    liked: bool
    total_likes: int

# ─── PAGINATION ───────────────────────────────
class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    size: int
    pages: int
```

---

## **4-Qism: Logger (15 daqiqa)**

### **app/logger.py yarating:**

```python
import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler

# Logs papkasi yaratish
Path("logs").mkdir(exist_ok=True)

def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    # Format
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Console handler
    console = logging.StreamHandler(sys.stdout)
    console.setLevel(logging.INFO)
    console.setFormatter(formatter)

    # Fayl handler (rotating — 5MB, 3 ta fayl)
    file_handler = RotatingFileHandler(
        "logs/app.log",
        maxBytes=5 * 1024 * 1024,
        backupCount=3,
        encoding="utf-8"
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)

    # Xato logi alohida fayl
    error_handler = RotatingFileHandler(
        "logs/error.log",
        maxBytes=5 * 1024 * 1024,
        backupCount=3,
        encoding="utf-8"
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)

    logger.addHandler(console)
    logger.addHandler(file_handler)
    logger.addHandler(error_handler)

    return logger

# Global logger
logger = get_logger("blog_api")
```

---

## **5-Qism: Categories Router (20 daqiqa)**

### **app/routers/categories.py:**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import re

from .. import models, schemas, oauth2
from ..database import get_db
from ..cache import cache_get, cache_set, cache_delete_pattern
from ..logger import logger

router = APIRouter(prefix="/categories", tags=["Categories"])

def make_slug(text: str) -> str:
    """Matn → slug: 'Salom Dunyo' → 'salom-dunyo'"""
    slug = text.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug)
    return slug

# ─── CREATE ───────────────────────────────────
@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.CategoryResponse
)
def create_category(
    category: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Faqat admin kategoriya yaratishi mumkin"
        )

    slug = make_slug(category.name)

    existing = db.query(models.Category).filter(
        models.Category.slug == slug
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Bu nom bilan kategoriya mavjud"
        )

    new_cat = models.Category(
        name=category.name,
        slug=slug,
        description=category.description
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)

    cache_delete_pattern("categories:*")
    logger.info(f"Kategoriya yaratildi: {new_cat.name}")
    return new_cat

# ─── READ ALL ─────────────────────────────────
@router.get("/", response_model=List[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    cached = cache_get("categories:all")
    if cached:
        return cached

    categories = db.query(models.Category).all()
    data = [
        schemas.CategoryResponse.from_orm(c).dict()
        for c in categories
    ]
    cache_set("categories:all", data, ttl=600)
    return categories

# ─── READ ONE ─────────────────────────────────
@router.get(
    "/{slug}",
    response_model=schemas.CategoryResponse
)
def get_category(slug: str, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(
        models.Category.slug == slug
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Kategoriya topilmadi"
        )
    return category

# ─── DELETE ───────────────────────────────────
@router.delete("/{category_id}",
               status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403,
                            detail="Faqat admin o'chira oladi")

    cat = db.query(models.Category).filter(
        models.Category.id == category_id
    ).first()

    if not cat:
        raise HTTPException(status_code=404,
                            detail="Kategoriya topilmadi")

    db.delete(cat)
    db.commit()
    cache_delete_pattern("categories:*")
    logger.info(f"Kategoriya o'chirildi: ID={category_id}")
    return None
```

---

## **6-Qism: Comments Router (25 daqiqa)**

### **app/routers/comments.py:**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, oauth2
from ..database import get_db
from ..cache import cache_delete_pattern
from ..logger import logger

router = APIRouter(tags=["Comments"])

# ─── POST IZOHLARINI OLISH ────────────────────
@router.get(
    "/posts/{post_id}/comments",
    response_model=List[schemas.CommentResponse]
)
def get_comments(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()
    if not post:
        raise HTTPException(status_code=404,
                            detail="Post topilmadi")

    # Faqat asosiy izohlar (parent_id=None)
    # replies relationship orqali avtomatik keladi
    comments = db.query(models.Comment).filter(
        models.Comment.post_id == post_id,
        models.Comment.parent_id == None
    ).all()
    return comments

# ─── IZOH QOLDIRISH ───────────────────────────
@router.post(
    "/posts/{post_id}/comments",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.CommentResponse
)
def create_comment(
    post_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()
    if not post:
        raise HTTPException(status_code=404,
                            detail="Post topilmadi")

    # Parent izoh tekshirish
    if comment.parent_id:
        parent = db.query(models.Comment).filter(
            models.Comment.id == comment.parent_id,
            models.Comment.post_id == post_id
        ).first()
        if not parent:
            raise HTTPException(
                status_code=404,
                detail="Javob beriladigan izoh topilmadi"
            )

    new_comment = models.Comment(
        content=comment.content,
        post_id=post_id,
        author_id=current_user.id,
        parent_id=comment.parent_id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    cache_delete_pattern(f"posts:{post_id}*")
    logger.info(
        f"Izoh qoldirildi: post={post_id} "
        f"user={current_user.id}"
    )
    return new_comment

# ─── IZOHNI YANGILASH ─────────────────────────
@router.put(
    "/comments/{comment_id}",
    response_model=schemas.CommentResponse
)
def update_comment(
    comment_id: int,
    updated: schemas.CommentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    comment = db.query(models.Comment).filter(
        models.Comment.id == comment_id
    ).first()

    if not comment:
        raise HTTPException(status_code=404,
                            detail="Izoh topilmadi")

    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403,
                            detail="Siz bu izohni o'zgartira olmaysiz")

    comment.content = updated.content
    db.commit()
    db.refresh(comment)
    return comment

# ─── IZOHNI O'CHIRISH ─────────────────────────
@router.delete(
    "/comments/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    comment = db.query(models.Comment).filter(
        models.Comment.id == comment_id
    ).first()

    if not comment:
        raise HTTPException(status_code=404,
                            detail="Izoh topilmadi")

    if (comment.author_id != current_user.id
            and not current_user.is_admin):
        raise HTTPException(status_code=403,
                            detail="Ruxsat yo'q")

    db.delete(comment)
    db.commit()
    logger.info(f"Izoh o'chirildi: ID={comment_id}")
    return None
```

---

## **7-Qism: Likes Router (15 daqiqa)**

### **app/routers/likes.py:**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas, oauth2
from ..database import get_db
from ..cache import cache_delete
from ..logger import logger

router = APIRouter(tags=["Likes"])

@router.post(
    "/posts/{post_id}/like",
    response_model=schemas.LikeResponse
)
def toggle_like(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    """Like bosish yoki bekor qilish (toggle)"""

    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()
    if not post:
        raise HTTPException(status_code=404,
                            detail="Post topilmadi")

    # Avval like bosilganmi?
    existing_like = db.query(models.Like).filter(
        models.Like.post_id == post_id,
        models.Like.user_id == current_user.id
    ).first()

    if existing_like:
        # Like bor → O'chirish (unlike)
        db.delete(existing_like)
        db.commit()
        liked = False
        logger.info(
            f"Unlike: post={post_id} user={current_user.id}"
        )
    else:
        # Like yo'q → Qo'shish
        new_like = models.Like(
            post_id=post_id,
            user_id=current_user.id
        )
        db.add(new_like)
        db.commit()
        liked = True
        logger.info(
            f"Like: post={post_id} user={current_user.id}"
        )

    # Jami like soni
    total = db.query(models.Like).filter(
        models.Like.post_id == post_id
    ).count()

    # Cache tozalash
    cache_delete(f"posts:{post_id}")

    return {
        "post_id": post_id,
        "user_id": current_user.id,
        "liked": liked,
        "total_likes": total
    }

@router.get("/posts/{post_id}/likes")
def get_post_likes(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Post like soni"""
    total = db.query(models.Like).filter(
        models.Like.post_id == post_id
    ).count()

    return {"post_id": post_id, "total_likes": total}
```

---

## **8-Qism: To'liq Posts Router (30 daqiqa)**

### **app/routers/posts.py — Yakuniy versiya:**

```python
from fastapi import (
    APIRouter, Depends, HTTPException,
    status, BackgroundTasks, Query, Request
)
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import re

from .. import models, schemas, oauth2
from ..database import get_db
from ..cache import (
    cache_get, cache_set,
    cache_delete, cache_delete_pattern
)
from ..middleware.rate_limit import rate_limit_middleware
from ..logger import logger

router = APIRouter(prefix="/posts", tags=["Posts"])

def make_slug(title: str) -> str:
    slug = title.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug)
    return slug

def get_unique_slug(db: Session, title: str) -> str:
    base_slug = make_slug(title)
    slug = base_slug
    counter = 1
    while db.query(models.Post).filter(
        models.Post.slug == slug
    ).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug

# ─── READ ALL ─────────────────────────────────
@router.get("/", response_model=List[schemas.PostList])
async def get_all_posts(
    request: Request,
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    skip: int = Query(0, ge=0),
    search: Optional[str] = "",
    category: Optional[str] = None,
    tag: Optional[str] = None,
    published: bool = True
):
    await rate_limit_middleware(request, calls=100, period=60)

    cache_key = (
        f"posts:list:l={limit}:s={skip}"
        f":q={search}:cat={category}"
        f":tag={tag}:pub={published}"
    )

    cached = cache_get(cache_key)
    if cached:
        return cached

    query = db.query(models.Post).filter(
        models.Post.published == published
    )

    if search:
        query = query.filter(
            models.Post.title.ilike(f"%{search}%")
        )

    if category:
        query = query.join(models.Category).filter(
            models.Category.slug == category
        )

    if tag:
        query = query.join(models.Post.tags).filter(
            models.Tag.slug == tag
        )

    posts = query.order_by(
        models.Post.created_at.desc()
    ).offset(skip).limit(limit).all()

    # likes_count va comments_count qo'shish
    result = []
    for post in posts:
        post_dict = schemas.PostList.from_orm(post).dict()
        post_dict["likes_count"] = len(post.likes)
        post_dict["comments_count"] = len(post.comments)
        result.append(post_dict)

    cache_set(cache_key, result, ttl=120)
    return result

# ─── READ ONE ─────────────────────────────────
@router.get("/{slug}", response_model=schemas.PostResponse)
async def get_post(
    slug: str,
    request: Request,
    db: Session = Depends(get_db)
):
    await rate_limit_middleware(request, calls=200, period=60)

    cache_key = f"posts:slug:{slug}"
    cached = cache_get(cache_key)
    if cached:
        # Views sonini oshirish (fonda)
        post = db.query(models.Post).filter(
            models.Post.slug == slug
        ).first()
        if post:
            post.views += 1
            db.commit()
        return cached

    post = db.query(models.Post).filter(
        models.Post.slug == slug
    ).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post topilmadi"
        )

    # Ko'rishlar soni oshirish
    post.views += 1
    db.commit()
    db.refresh(post)

    post_data = schemas.PostResponse.from_orm(post).dict()
    post_data["likes_count"] = len(post.likes)
    post_data["comments_count"] = len(post.comments)

    cache_set(cache_key, post_data, ttl=300)
    return post_data

# ─── CREATE ───────────────────────────────────
@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.PostResponse
)
async def create_post(
    post: schemas.PostCreate,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    await rate_limit_middleware(request, calls=20, period=60)

    slug = get_unique_slug(db, post.title)

    # Tag lar
    tags = []
    if post.tag_ids:
        tags = db.query(models.Tag).filter(
            models.Tag.id.in_(post.tag_ids)
        ).all()

    new_post = models.Post(
        title=post.title,
        slug=slug,
        content=post.content,
        excerpt=post.excerpt,
        published=post.published,
        category_id=post.category_id,
        owner_id=current_user.id,
        tags=tags
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    background_tasks.add_task(
        cache_delete_pattern, "posts:list:*"
    )

    logger.info(
        f"Post yaratildi: '{new_post.title}' "
        f"(user={current_user.id})"
    )

    post_data = schemas.PostResponse.from_orm(new_post).dict()
    post_data["likes_count"] = 0
    post_data["comments_count"] = 0
    return post_data

# ─── UPDATE ───────────────────────────────────
@router.put("/{post_id}", response_model=schemas.PostResponse)
def update_post(
    post_id: int,
    updated: schemas.PostUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    post_query = db.query(models.Post).filter(
        models.Post.id == post_id
    )
    post = post_query.first()

    if not post:
        raise HTTPException(status_code=404,
                            detail="Post topilmadi")

    if (post.owner_id != current_user.id
            and not current_user.is_admin):
        raise HTTPException(status_code=403,
                            detail="Ruxsat yo'q")

    update_data = updated.dict(exclude_unset=True)

    # Slug yangilash (title o'zgarsa)
    if "title" in update_data:
        update_data["slug"] = get_unique_slug(
            db, update_data["title"]
        )

    # Tag lar yangilash
    if "tag_ids" in update_data:
        tag_ids = update_data.pop("tag_ids")
        tags = db.query(models.Tag).filter(
            models.Tag.id.in_(tag_ids)
        ).all()
        post.tags = tags

    post_query.update(update_data, synchronize_session=False)
    db.commit()
    db.refresh(post)

    background_tasks.add_task(
        cache_delete, f"posts:slug:{post.slug}"
    )
    background_tasks.add_task(
        cache_delete_pattern, "posts:list:*"
    )

    logger.info(f"Post yangilandi: ID={post_id}")

    post_data = schemas.PostResponse.from_orm(post).dict()
    post_data["likes_count"] = len(post.likes)
    post_data["comments_count"] = len(post.comments)
    return post_data

# ─── DELETE ───────────────────────────────────
@router.delete("/{post_id}",
               status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()

    if not post:
        raise HTTPException(status_code=404,
                            detail="Post topilmadi")

    if (post.owner_id != current_user.id
            and not current_user.is_admin):
        raise HTTPException(status_code=403,
                            detail="Ruxsat yo'q")

    slug = post.slug
    db.delete(post)
    db.commit()

    background_tasks.add_task(
        cache_delete, f"posts:slug:{slug}"
    )
    background_tasks.add_task(
        cache_delete_pattern, "posts:list:*"
    )

    logger.info(
        f"Post o'chirildi: ID={post_id} "
        f"(user={current_user.id})"
    )
    return None
```

---

## **9-Qism: app/main.py — Yakuniy (15 daqiqa)**

```python
import os
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routers import (
    auth, users, posts,
    categories, comments, likes,
    tags, upload, websocket, admin
)
from .config import settings
from .cache import redis_client
from .database import engine
from . import models
from .logger import logger

# Papkalar
os.makedirs("uploads", exist_ok=True)
os.makedirs("logs", exist_ok=True)

# ─── LIFESPAN ─────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Blog API ishga tushmoqda...")
    try:
        redis_client.ping()
        logger.info("✅ Redis ulandi!")
    except Exception as e:
        logger.warning(f"⚠️ Redis ulanmadi: {e}")

    yield

    # Shutdown
    logger.info("🛑 Blog API to'xtatilmoqda...")

# ─── APP ──────────────────────────────────────
app = FastAPI(
    title="Blog API",
    description="""
    ## To'liq Blog API

    ### Xususiyatlar:
    - 🔐 JWT Authentication
    - 📝 Postlar (CRUD + Slug + Search)
    - 💬 Izohlar (Nested)
    - ❤️ Like tizimi
    - 🏷️ Kategoriyalar va Taglar
    - 📁 Fayl yuklash
    - ⚡ Redis Cache
    - 🔌 WebSocket (Real-time)
    - 🐳 Docker Ready
    """,
    version="1.0.0",
    lifespan=lifespan,
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

# ─── LOGGING MIDDLEWARE ───────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)

    logger.info(
        f"{request.method} {request.url.path} "
        f"→ {response.status_code} "
        f"({duration}ms)"
    )
    return response

# ─── STATIC FILES ─────────────────────────────
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# ─── ROUTERS ──────────────────────────────────
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(categories.router)
app.include_router(comments.router)
app.include_router(likes.router)
app.include_router(tags.router)
app.include_router(upload.router)
app.include_router(websocket.router)
app.include_router(admin.router)

# ─── ROOT ─────────────────────────────────────
@app.get("/", tags=["Root"])
def root():
    return {
        "name": "Blog API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", tags=["Root"])
def health():
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

## **10-Qism: To'liq Test (20 daqiqa)**

### **tests/test_comments.py:**

```python
import pytest

def test_create_comment(authorized_client, test_posts):
    response = authorized_client.post(
        f"/posts/{test_posts[0].id}/comments",
        json={"content": "Ajoyib post!"}
    )
    assert response.status_code == 201
    assert response.json()["content"] == "Ajoyib post!"
    assert "id" in response.json()

def test_create_comment_unauthorized(client, test_posts):
    response = client.post(
        f"/posts/{test_posts[0].id}/comments",
        json={"content": "Test izoh"}
    )
    assert response.status_code == 401

def test_get_comments(client, test_posts, authorized_client):
    authorized_client.post(
        f"/posts/{test_posts[0].id}/comments",
        json={"content": "Test izoh"}
    )
    response = client.get(
        f"/posts/{test_posts[0].id}/comments"
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_delete_own_comment(authorized_client, test_posts):
    comment = authorized_client.post(
        f"/posts/{test_posts[0].id}/comments",
        json={"content": "O'chiriladigan izoh"}
    ).json()

    response = authorized_client.delete(
        f"/comments/{comment['id']}"
    )
    assert response.status_code == 204
```

---

### **tests/test_likes.py:**

```python
def test_like_post(authorized_client, test_posts):
    response = authorized_client.post(
        f"/posts/{test_posts[0].id}/like"
    )
    assert response.status_code == 200
    assert response.json()["liked"] == True
    assert response.json()["total_likes"] == 1

def test_unlike_post(authorized_client, test_posts):
    # Avval like bosish
    authorized_client.post(f"/posts/{test_posts[0].id}/like")
    # Qayta bosish → unlike
    response = authorized_client.post(
        f"/posts/{test_posts[0].id}/like"
    )
    assert response.json()["liked"] == False
    assert response.json()["total_likes"] == 0

def test_like_unauthorized(client, test_posts):
    response = client.post(
        f"/posts/{test_posts[0].id}/like"
    )
    assert response.status_code == 401
```

---

### **Barcha Testlarni Ishga Tushirish:**

```bash
pytest -v --cov=app --cov-report=term-missing
```

**Kutilgan natija:**

```
tests/test_auth.py::test_login PASSED
tests/test_users.py::test_create_user PASSED
tests/test_posts.py::test_create_post PASSED
tests/test_comments.py::test_create_comment PASSED
tests/test_likes.py::test_like_post PASSED
...

====== 30+ passed in 5.2s ======

Coverage: 94%
```

---

## **11-Qism: README.md (10 daqiqa)**

```markdown
# 📝 Blog API

FastAPI, PostgreSQL, Redis, Docker bilan qurilgan
to'liq Blog API.

## 🚀 Xususiyatlar

- 🔐 JWT Authentication
- 📝 Postlar (CRUD, Slug, Qidiruv, Pagination)
- 💬 Izohlar (Nested replies)
- ❤️ Like tizimi
- 🏷️ Kategoriyalar va Taglar
- 📁 Rasm yuklash
- ⚡ Redis Cache
- 🔌 WebSocket (Real-time chat)
- 🐳 Docker Ready
- 🧪 95%+ Test coverage

## 🛠️ Texnologiyalar

| Texnologiya    | Versiya |
|----------------|---------|
| FastAPI        | 0.111+  |
| PostgreSQL     | 15      |
| Redis          | 7       |
| SQLAlchemy     | 2.0+    |
| Alembic        | 1.13+   |
| Docker         | 25+     |
| Python         | 3.11    |

## ⚡ Tezkor Ishga Tushirish (Docker)

```bash
git clone https://github.com/username/fastapi-blog
cd fastapi-blog
cp .env.example .env
# .env ni to'ldiring
docker compose up --build -d
```

API: http://localhost:8000
Docs: http://localhost:8000/docs

## 💻 Local Ishga Tushirish

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # .env ni to'ldiring
alembic upgrade head
python -m uvicorn app.main:app --reload
```

## 🧪 Testlar

```bash
pytest -v --cov=app
```

## 📚 API Endpointlar

| Method | Endpoint               | Tavsif            |
| ------ | ---------------------- | ----------------- |
| POST   | /users/                | Ro'yxatdan o'tish |
| POST   | /login                 | Login             |
| GET    | /posts/                | Barcha postlar    |
| POST   | /posts/                | Post yaratish     |
| GET    | /posts/{slug}          | Post ko'rish      |
| POST   | /posts/{id}/like       | Like              |
| POST   | /posts/{id}/comments   | Izoh              |
| WS     | /ws/chat/{room}/{name} | Real-time chat    |

```

---

## **12-Qism: GitHub ga Yuklash (10 daqiqa)**

```bash
# 1. GitHub da yangi repo yarating: fastapi-blog

# 2. Local init
git init
git add .
git commit -m "🚀 To'liq Blog API — FastAPI kursining yakuniy loyihasi"

# 3. GitHub ga push
git remote add origin https://github.com/username/fastapi-blog.git
git branch -M main
git push -u origin main
```

---

### **GitHub Topics qo'shing:**

```
fastapi, python, postgresql, redis, docker,
jwt-authentication, websocket, sqlalchemy,
alembic, rest-api, blog-api
```

---

## **13-Qism: Production Deploy (15 daqiqa)**

### **Render.com da To'liq Stack:**

```bash
# 1. Render da PostgreSQL yarating (blog-db)
# 2. Render da Redis yarating (blog-redis)
# 3. Render da Web Service yarating

# Build Command:
pip install -r requirements.txt

# Start Command:
alembic upgrade head && gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:$PORT
```

---

### **Environment Variables:**

```
DATABASE_URL          = (Render PostgreSQL dan)
REDIS_URL             = (Render Redis dan)
SECRET_KEY            = (Kamida 64 belgi)
ALGORITHM             = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
ALLOWED_ORIGINS       = https://sizning-frontend.com
ENVIRONMENT           = production
DEBUG                 = False
CACHE_TTL             = 600
```

---

## **Kurs Yakuniy Xulosasi 🎓**

### **20 Kunda Nima O'rgandik:**

```
1-2 Kun:   FastAPI asoslari, Type hints, Pydantic
3-4 Kun:   PostgreSQL, SQLAlchemy, get_db
5-6 Kun:   JWT Authentication, oauth2
7-8 Kun:   Alembic Migrations
9-10 Kun:  CORS, Gunicorn, Render Deploy
11-12 Kun: Pytest, TestClient, Coverage
13-14 Kun: WebSocket, Background Tasks, Fayl yuklash
15-16 Kun: Redis, Cache, Rate Limiting, OTP
17-18 Kun: Docker, docker-compose, Production
19-20 Kun: Yakuniy Loyiha — Hamma narsa birga!
```

---

### **Siz Endi Bilasiz:**

```
✅ FastAPI bilan professional API yaratish
✅ PostgreSQL va SQLAlchemy bilan ishlash
✅ JWT bilan xavfsiz authentication
✅ Alembic bilan DB migratsiyalari
✅ Redis bilan tezkor caching
✅ WebSocket bilan real-time ilovalar
✅ Docker bilan konteynerizatsiya
✅ Pytest bilan professional testlar
✅ Production ga deploy qilish
✅ Clean code va loyiha tuzilmasi
```

---

### **Keyingi Qadamlar:**

```
📚 O'rganishni davom eting:
   → FastAPI Advanced: Dependency Injection (chuqur)
   → Celery: Murakkab fon vazifalari
   → Elasticsearch: Kuchli qidiruv
   → GraphQL: FastAPI + Strawberry
   → Microservices: Ko'p API lar
   → Kubernetes: Docker ocherchovida kengaytirish

💼 Portfolio uchun:
   → GitHub dagi loyihangizni bezang
   → README ni mukammal qiling
   → API ni deploy qiling
   → LinkedIn ga qo'ying

🏆 Amaliy loyihalar:
   → E-commerce API
   → Social Media API
   → Chat Application
   → Job Board API
```

---

## **Foydali Havolalar:**

```
📖 FastAPI Docs:    https://fastapi.tiangolo.com
📖 SQLAlchemy:      https://docs.sqlalchemy.org
📖 Alembic:         https://alembic.sqlalchemy.org
📖 Redis:           https://redis.io/docs
📖 Docker:          https://docs.docker.com
📖 Pytest:          https://docs.pytest.org
📖 Pydantic:        https://docs.pydantic.dev

🎓 Qo'shimcha:
   → TestDriven.io (FastAPI kurslari)
   → ArjanCodes (YouTube)
   → Patrick Loeber (YouTube)
```

---

## **Barcha Buyruqlar — Oxirgi Xulosa:**

```bash
# ─── LOCAL ─────────────────────────────────────
python -m uvicorn app.main:app --reload
pytest -v --cov=app
alembic revision --autogenerate -m "tavsif"
alembic upgrade head
alembic downgrade -1

# ─── DOCKER ────────────────────────────────────
docker compose up --build -d
docker compose logs -f api
docker compose exec api alembic upgrade head
docker compose down
docker compose down -v

# ─── PRODUCTION ────────────────────────────────
docker compose -f docker-compose.prod.yml \
  --env-file .env.prod up -d --build

# ─── GIT ───────────────────────────────────────
git add .
git commit -m "✨ Yangi xususiyat"
git push origin main

# ─── REDIS ─────────────────────────────────────
redis-cli ping
redis-cli KEYS "*"
redis-cli FLUSHALL
```

---

**Tabriklaymiz! 🎉🏆**

**Siz 20 kunda FastAPI ning barcha asosiy va ilg'or mavzularini o'rgandingiz. Endi siz haqiqiy backend developer sifatida professional API lar yarata olasiz!**

**Loyihangizni GitHub ga yoying, deploy qiling va portfolio ga qo'shing. Kelajakda omad! ⚡🚀**

---

> **Navigatsiya:** [⬅️ 17-18 Kun (Docker va Konteynerlar)](17-18-kun-docker-va-konteynerlashtirish.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md)
