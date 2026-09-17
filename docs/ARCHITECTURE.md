<div align="center">

# 🏗 Arxitektura

Repozitoriyning papka/fayl tuzilmasi, nomlash qoidalari va kengaytirish tartibi

<sub>[🏠 Bosh sahifa](../README.md)</sub>

</div>

---

## 1. Nomlash qoidalari

| Qoida | Misol | Nega shunday |
|---|---|---|
| Tub papka: `NN-Nom` | `04-Python` | Raqam — o'qish tartibi. Fayl tizimi va GitHub ikkalasida ham to'g'ri tartibda ko'rinadi |
| Modul mundarijasi: `README.md` | `04-Python/README.md` | GitHub papkaga kirilganda uni avtomatik ko'rsatadi — qidirib o'tirish shart emas |
| Bo'lim papkasi: `NN-bob-nom` | `01-bob-fayl-tizimi` | Bo'limlar ham raqamli tartibda; "bob" so'zi dars fayllaridan ajratib turadi |
| Dars fayli: `N.M-mavzu.md` | `1.2-fayl-va-papkalarni-korish-yaratish.md` | `bo'lim.dars` raqami — mundarijadagi raqam bilan bir xil |
| Faqat kichik harf, defis | `06-bob-tarmoq-ssh-xavfsizlik` | Bo'sh joy va maxsus belgilarsiz — URL va terminalda muammosiz |

**Asosiy tamoyillar:**

1. **Har bir modul mustaqil** — ichidagi fayllar modulni tushunish uchun yetarli. Modullararo bog'liqlik faqat mantiqiy (Django uchun Python bilimi kerak), texnik emas.
2. **README — yagona kirish nuqtasi** — istalgan papkaga kirganda nima borligini darhol ko'rasiz.
3. **Bir xil dars tuzilmasi** — barcha 380+ dars bir xil ichki formatda (4-bo'limga qarang).

---

## 2. To'liq papka daraxti

```mermaid
flowchart TD
    ROOT(("📚<br/>TUTORIAl"))

    ROOT --> M01["💻 01-Terminal<br/><small>14 bo'lim · 30 dars</small>"]
    ROOT --> M02["🐧 02-Linux<br/><small>7 bo'lim · 28 dars</small>"]
    ROOT --> M03["🌿 03-Git-GitHub<br/><small>7 bo'lim · 20 dars</small>"]
    ROOT --> M04["🐍 04-Python<br/><small>15 bo'lim · 57 dars</small>"]
    ROOT --> M05["🐳 05-Docker<br/><small>7 bo'lim · 18 dars</small>"]
    ROOT --> M06["🐘 06-PostgreSQL<br/><small>31 bo'lim · 95 dars</small>"]
    ROOT --> M07["🌐 07-Django<br/><small>6 qism · 95 dars</small>"]
    ROOT --> M08["⚡ 08-FastAPI<br/><small>8 bo'lim · 22 dars</small>"]
    ROOT --> M09["🤖 09-Aiogram<br/><small>18 dars</small>"]
    ROOT --> M10["🧩 10-Masalalar<br/><small>Python · TypeScript</small>"]
    ROOT --> DOCS["📄 docs/<br/><small>ARCHITECTURE.md</small>"]

    M05 --> SUB["Modul ichki tuzilmasi"]
    SUB --> S1["README.md<br/><small>mundarija</small>"]
    SUB --> S2["00-bob-kirish/"]
    SUB --> S3["01-bob-asosiy-tushunchalar/"]
    S3 --> L1["1.1-image-container-asosiy-buyruqlar.md"]
    S3 --> L2["1.2-docker-hub-image-boshqaruv.md"]

    classDef root fill:#111827,stroke:#000,color:#fff
    classDef base fill:#2563eb,stroke:#1e3a8a,color:#fff
    classDef core fill:#16a34a,stroke:#14532d,color:#fff
    classDef infra fill:#d97706,stroke:#78350f,color:#fff
    classDef web fill:#9333ea,stroke:#4c1d95,color:#fff
    classDef practice fill:#dc2626,stroke:#7f1d1d,color:#fff
    classDef meta fill:#6b7280,stroke:#374151,color:#fff
    classDef leaf fill:#e5e7eb,stroke:#9ca3af,color:#111827

    class ROOT root
    class M01,M02,M03 base
    class M04 core
    class M05,M06 infra
    class M07,M08,M09 web
    class M10 practice
    class DOCS meta
    class SUB,S1,S2,S3,L1,L2 leaf
```

---

## 3. Django moduli — "modul ichida modul"

`07-Django/` boshqalardan farq qiladi: u 6 ta mustaqil kichik-darslikdan iborat, shuning uchun bo'lim emas, **qism** darajasiga ega:

```mermaid
flowchart LR
    D["🌐 07-Django"] --> Q1["1-asosiy-kurs<br/><small>17 dars · noldan production'gacha</small>"]
    Q1 --> Q2["2-aiogram-postgresql-bot<br/><small>10 dars · real Telegram bot</small>"]
    D --> Q3["3-kod-oqish-darsligi<br/><small>11 bob · notanish kodni o'qish</small>"]
    D --> Q4["4-kutubxonalar-bilan-ishlash<br/><small>10 bob · kutubxona tanlash</small>"]
    D --> Q5["5-standart-kutubxona-modullari<br/><small>10 bob · Python std-lib</small>"]
    D --> Q6["6-qoshimcha-konspektlar<br/><small>6 konspekt · kurs daftari</small>"]

    Q1 -.bilim kerak.-> Q3
    Q1 -.bilim kerak.-> Q4
    Q1 -.bilim kerak.-> Q5

    classDef m fill:#9333ea,stroke:#4c1d95,color:#fff
    classDef q fill:#f3e8ff,stroke:#9333ea,color:#3b0764
    class D m
    class Q1,Q2,Q3,Q4,Q5,Q6 q
```

`1-asosiy-kurs` → `2-aiogram-postgresql-bot` ketma-ket o'qiladi. Qolgan 4 qism bir-biridan mustaqil — asoslarni o'zlashtirgach istalgan tartibda.

---

## 4. Dars faylining ichki tuzilmasi

Barcha dars fayllari bir xil skeletga ega:

```markdown
# Sarlavha

## Bu darsda nimalarni o'rganasiz     ← 3-5 punkt, kutilgan natija
## Nazariy qism                       ← tushuntirish + kod misollari
## Amaliy misol                       ← real loyihada qo'llanishi
## Keng tarqalgan xatolar             ← ❌ noto'g'ri / ✅ to'g'ri + SABAB
## Mashq                              ← Oson / O'rtacha / Qiyin + javob kaliti
## Qisqacha xulosa

---
- Oldingi dars: [...](../NN-bob-.../N.M-....md)
- Keyingi dars: [...](../NN-bob-.../N.M-....md)
```

Oxiridagi **oldingi/keyingi** havolalari darslarni bog'lab, uzluksiz o'qish imkonini beradi.

---

## 5. `10-Masalalar/` — amaliyot qismi

Masalalar modullardan ajratilgan, chunki ular bir nechta tilga tegishli va istalgan modulni tugatgach qaytib kelish uchun mo'ljallangan:

```
10-Masalalar/
├── README.md
├── Python/
│   ├── Masalalar/Modul 1/
│   │   ├── Masala fayl/                     ← masalalar to'plami (PDF)
│   │   └── Tanlangan masalalar yechimlari/  ← masala_001.py … (60 ta)
│   ├── Masalalar/Modul 2/                   ← (66 ta yechim)
│   └── o'rganish jarayoni/
└── TS/
    └── Modul 1/Masala N/
        ├── index.html
        ├── main.css
        ├── script.ts
        └── script.js
```

---

## 6. Yangi modul qo'shish

```bash
# 1. Keyingi bo'sh raqam bilan papka
mkdir 11-Yangi-Mavzu

# 2. Mundarija (GitHub avtomatik ko'rsatadi)
touch 11-Yangi-Mavzu/README.md

# 3. Bo'limlar va darslar
mkdir 11-Yangi-Mavzu/01-bob-asoslar
touch 11-Yangi-Mavzu/01-bob-asoslar/1.1-birinchi-dars.md
```

So'ngra:

- `11-Yangi-Mavzu/README.md` ga markazlashtirilgan header, statistika va oldingi/keyingi navigatsiyani qo'shing (boshqa modullardan nusxa oling).
- Ildizdagi [`README.md`](../README.md) dagi **Modullar** jadvaliga va **o'quv yo'nalishi** grafigiga yangi modulni kiriting.
- Shu faylning 2-bo'limidagi daraxt grafigiga tugun qo'shing.
