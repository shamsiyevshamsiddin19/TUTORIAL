# Terminal bilan ishlash — To'liq darslik (Linux/Bash)

_Ushbu darslik, terminaldan umuman foydalanmagan yoki oz foydalangan o'quvchi uchun, noldan boshlab, fayl tizimida yurishdan tortib, to'liq, mustaqil bash skript yozish va SSH orqali serverlarda ishlashgacha bo'lgan yo'lni qamrab oladi. Barcha buyruqlar va misollar, **Linux** (Ubuntu/Debian asosidagi distributivlar, bash shell) uchun moslashtirilgan. Daraja, pastdan yuqoriga: 00-bob → 13-bob._

---

## Kurs mantig'i

Terminal — avval fayl tizimida yurish va fayllar bilan ishlashdan boshlanadi, chunki qolgan hamma narsa shu ustiga quriladi. Keyin matn bilan ishlash va qidiruv keladi — terminalning eng kundalik ishi shu. Undan so'ng ruxsatlar, keyin buyruqlarni birlashtirish (pipeline) — bu, alohida buyruqlarni kuchli vositaga aylantiradi. Jarayonlar va muhit sozlashdan keyin, o'quvchi endi bash skript yozishga tayyor — chunki skript, aslida, shu paytgacha o'rgangan buyruqlarni faylga yozib, avtomatlashtirishdan iborat. Tarmoq/SSH va paket menejerlar — kundalik amaliy ehtiyoj. Kurs, produktivlik vositalari va xavfsizlik bilan yakunlanadi, so'ng hammasi bitta amaliy loyihada birlashtiriladi.

## Yakuniy maqsad

Kurs oxirida, o'quvchi, terminal orqali, fayllar bilan erkin ishlay oladi, jarayonlarni boshqara oladi, o'z ish jarayonini bash skript orqali avtomatlashtira oladi, va SSH orqali masofaviy serverga ulanib, u yerda ham erkin ishlay oladi.

---

## Mundarija

### 00-BOB — Kirish

| № | Mavzu | Fayl |
|---|---|---|
| 0.1 | Terminal nima va nega kerak | 0.1-terminal-nima-va-nega-kerak.md |
| 0.2 | Yordam olish va terminalni tanish (`man`, `--help`) | 0.2-yordam-olish-va-terminalni-tanish.md |

### 01-BOB — Fayl tizimi

| № | Mavzu | Fayl |
|---|---|---|
| 1.1 | Papkalar orasida yurish (`pwd`, `cd`) | 1.1-papkalar-orasida-yurish.md |
| 1.2 | Fayl va papkalarni ko'rish, yaratish (`ls`, `mkdir`, `touch`) | 1.2-fayl-va-papkalarni-korish-yaratish.md |
| 1.3 | Fayllarni nusxalash, ko'chirish, o'chirish (`cp`, `mv`, `rm`) | 1.3-fayllarni-kochirish-nusxalash-ochirish.md |

### 02-BOB — Matn va qidiruv

| № | Mavzu | Fayl |
|---|---|---|
| 2.1 | Fayl mazmunini ko'rish (`cat`, `less`, `head`, `tail`) | 2.1-fayl-mazmunini-korish.md |
| 2.2 | Matnni qidirish va sanash (`grep`, `wc`) | 2.2-matnni-qidirish-va-sanash.md |
| 2.3 | Fayllarni tizimda qidirish (`find`, `which`) | 2.3-fayllarni-tizimda-qidirish.md |
| 2.4 | Terminaldagi matn muharrirlari (`nano`, `vim`) | 2.4-terminaldagi-matn-muharrirlari.md |

### 03-BOB — Ruxsatlar

| № | Mavzu | Fayl |
|---|---|---|
| 3.1 | Fayl ruxsatlari (`chmod`, `rwx`) | 3.1-fayl-ruxsatlari.md |
| 3.2 | Foydalanuvchilar va sudo (`sudo`, `chown`) | 3.2-foydalanuvchilar-va-sudo.md |

### 04-BOB — Yo'naltirish va pipeline

| № | Mavzu | Fayl |
|---|---|---|
| 4.1 | Kirish/chiqishni yo'naltirish (`>`, `>>`, `<`) | 4.1-kirish-chiqishni-yonaltirish.md |
| 4.2 | Buyruqlarni birlashtirish — pipeline (`\|`, `xargs`, `tee`) | 4.2-buyruqlarni-birlashtirish-pipeline.md |

### 05-BOB — Jarayonlar

| № | Mavzu | Fayl |
|---|---|---|
| 5.1 | Jarayonlarni ko'rish va boshqarish (`ps`, `top`, `kill`, `jobs`) | 5.1-jarayonlarni-korish-va-boshqarish.md |
| 5.2 | Tizim xizmatlari (`systemctl`) | 5.2-tizim-xizmatlari.md |

### 06-BOB — Muhitni sozlash

| № | Mavzu | Fayl |
|---|---|---|
| 6.1 | Muhit o'zgaruvchilari va PATH (`export`, `$PATH`) | 6.1-muhit-ozgaruvchilari-va-path.md |
| 6.2 | Profilni moslashtirish (`.bashrc`, `alias`, `source`) | 6.2-profilni-moslashtirish.md |

### 07-BOB — Bash skript yozish

| № | Mavzu | Fayl |
|---|---|---|
| 7.1 | Birinchi bash skript (shebang, o'zgaruvchilar, argumentlar) | 7.1-birinchi-bash-skript.md |
| 7.2 | Shartli operatorlar (`if`/`elif`/`else`, `test`) | 7.2-shartli-operatorlar.md |
| 7.3 | Tsikllar (`for`, `while`, `break`, `continue`) | 7.3-tsikllar.md |
| 7.4 | Funksiyalar va xatolarni boshqarish (`exit code`, `set -e`) | 7.4-funksiyalar-va-xatolarni-boshqarish.md |

### 08-BOB — Tarmoq va SSH

| № | Mavzu | Fayl |
|---|---|---|
| 8.1 | SSH orqali ulanish (`ssh`, SSH kalitlari) | 8.1-ssh-orqali-ulanish.md |
| 8.2 | Fayl uzatish (`scp`, `rsync`) | 8.2-fayl-uzatish.md |
| 8.3 | Internetdan yuklab olish (`curl`, `wget`) | 8.3-internetdan-yuklab-olish.md |

### 09-BOB — Paket menejerlar

| № | Mavzu | Fayl |
|---|---|---|
| 9.1 | Paket menejerlar (`apt`) | 9.1-paket-menejerlar.md |

### 10-BOB — Arxivlash

| № | Mavzu | Fayl |
|---|---|---|
| 10.1 | Arxivlash va siqish (`tar`, `zip`/`unzip`) | 10.1-arxivlash-va-siqish.md |

### 11-BOB — Produktivlik

| № | Mavzu | Fayl |
|---|---|---|
| 11.1 | Terminalni tezlashtirish (`history`, `Ctrl+R`, `Tab`, `tmux`) | 11.1-terminalni-tezlashtirish.md |
| 11.2 | Terminalni moslashtirish (`PS1`, `zsh`/`oh-my-zsh`) | 11.2-terminalni-moslashtirish.md |

### 12-BOB — Xavfsizlik

| № | Mavzu | Fayl |
|---|---|---|
| 12.1 | Xavfsiz terminal odatlari | 12.1-xavfsiz-terminal-odatlari.md |

### 13-BOB — Yakuniy loyiha

| № | Mavzu | Fayl |
|---|---|---|
| 13.1 | Yakuniy loyiha: avtomatlashtirish skripti (to'liq zaxiralash skripti) | 13.1-yakuniy-loyiha-avtomatlashtirish-skripti.md |

---

## Ataylab kiritilmagan mavzular

- **Git buyruqlari** — alohida, mavjud **Git/GitHub darsligi**da to'liq qamrab olingan.
- **Docker CLI** — alohida **Docker darsligi**da bor.
- **Chuqur `awk`/`sed` dasturlash** (murakkab regex, ko'p qatorli skriptlar) — mustaqil, alohida darslik bo'lishga arziydigan, chuqur mavzu.
- **Bulut CLI vositalari** (`aws-cli`, `gcloud`, `az`) — platformaga xos, alohida mavzu.
- **Windows CMD/PowerShell** — ushbu darslik, foydalanuvchining so'roviga ko'ra, faqat Linux terminaliga qaratilgan.

## Darslik haqida

- **Jami:** 14 bob, 30 dars
- **Format:** Markdown (.md), har bir dars — mustaqil fayl
- **Har bir dars:** "Bu darsda nimalarni o'rganasiz" → "Nazariy qism" → "Amaliy misol" (to'liq, ishlaydigan buyruqlar) → "Keng tarqalgan xatolar" (❌/✅, sabab bilan) → "Mashq/topshiriq" (Oson/O'rtacha/Qiyin, javoblari bilan) → "Qisqacha xulosa"
- **Barcha kod misollari** — nusxalab, terminalga qo'yib, to'g'ridan-to'g'ri ishga tushirish mumkin

Darslik, bob-bob, ketma-ket o'qish uchun mo'ljallangan — har bir keyingi dars, avvalgilarida o'rganilgan bilimga tayanadi (jadvalda, har bir dars uchun, "tayanadigan darslar" belgilangan). Yakuniy loyiha (13-bob), butun kurs davomida o'rganilgan barcha ko'nikmalarni, bitta, real hayotda foydali skriptda birlashtiradi.
