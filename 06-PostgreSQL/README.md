<div align="center">

# 🐘 PostgreSQL

**Modul 06** · 31 bo'lim · 95 dars

<sub>[⬅ 🐳 Docker](../05-Docker/) &nbsp;·&nbsp; [🏠 Bosh sahifa](../README.md) &nbsp;·&nbsp; [🌐 Django ➡](../07-Django/)</sub>

</div>

---

Bu — noldan boshlab, PostgreSQL'ning eng chuqur ichki mexanizmlarigacha olib boruvchi, 24 bo'limdan (00–23 bob + ilova) va 58 darsdan iborat to'liq darslik. Har bir dars quyidagi bir xil tuzilishga ega: **nazariy qism** (tushuntirish + kod misollari, barchasi haqiqiy PostgreSQL serverida sinab ko'rilgan va aynan shu natija bilan keltirilgan), **amaliy misol**, **keng tarqalgan xatolar** (❌/✅), uchta darajali **mashq** (Oson/O'rtacha/Qiyin, javob kaliti bilan), va **qisqacha xulosa**.

Darslik ikki asosiy qismga bo'lingan: **I qism** (0–15 bob) — SQL tilining o'zi va kundalik amaliyotda kerak bo'ladigan barcha vositalar; **II qism — ICH-ICHIGA** (16–23 bob) — PostgreSQL serverining ichki qurilishi: disk sahifalaridan tortib, replikatsiya va partitioning'gacha. Barcha misollar bitta umumiy namuna baza — `dokon_bazasi` (do'kon boshqaruv tizimi: bo'limlar, xodimlar, mijozlar, mahsulotlar, buyurtmalar) — ustida qurilgan; uni o'zingizda tiklash uchun **Ilova**dagi to'liq skriptdan foydalaning.

## I QISM — AMALIY ASOS

### 0-bob. Kirish va o'rnatish

- 0.1. PostgreSQL nima, tarixi va arxitekturasi
- 0.2. O'rnatish va `psql` buyruq qatori mijozi
- 0.3. pgAdmin, DBeaver va grafik interfeys vositalari

### 1-bob. SELECT asoslari

- 1.1. `SELECT` va `SELECT DISTINCT`
- 1.2. `ORDER BY` — natijalarni tartiblash
- 1.3. `WHERE` — qatorlarni filtrlash, `AND`/`OR`/`NOT` operatorlari
- 1.4. `LIMIT`, `FETCH` va `OFFSET` — natijalar sonini cheklash

### 2-bob. Filtrlash chuqur

- 2.1. `IN` va `BETWEEN` — ro'yxat va oraliq bo'yicha filtrlash
- 2.2. `LIKE` va `ILIKE` — matn ichida naqsh bo'yicha qidirish
- 2.3. `NULL` bilan to'g'ri ishlash — `IS NULL`, `COALESCE`, `NULLIF`

### 3-bob. JOINS

- 3.1. `INNER JOIN` — jadvallarni bog'lash asoslari
- 3.2. `LEFT JOIN` va `LEFT ANTI JOIN`
- 3.3. `RIGHT JOIN` va `RIGHT ANTI JOIN`
- 3.4. `FULL JOIN`, `CROSS JOIN` va `SELF JOIN`

### 4-bob. Guruhlash

- 4.1. Agregat funksiyalar — `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
- 4.2. `GROUP BY` — qatorlarni guruhlarga bo'lib agregatlash
- 4.3. `HAVING` — guruhlarni filtrlash, `GROUPING SETS`/`ROLLUP` bilan tanishuv

### 5-bob. To'plam amallari

- 5.1. To'plam amallari — `UNION`, `INTERSECT`, `EXCEPT`

### 6-bob. Jadval yaratish (DDL)

- 6.1. `CREATE TABLE` va ma'lumot turlari
- 6.2. `CREATE TABLE AS` va `TEMPORARY TABLE`
- 6.3. `ALTER TABLE` — jadval strukturasini o'zgartirish
- 6.4. `DROP TABLE` va `TRUNCATE TABLE` — jadval va ma'lumotni olib tashlash

### 7-bob. Ma'lumotlarni o'zgartirish (DML)

- 7.1. `INSERT` va `RETURNING`
- 7.2. `UPDATE` — mavjud qatorlarni o'zgartirish
- 7.3. `DELETE` — qatorlarni o'chirish
- 7.4. `COPY` — ommaviy import va eksport

### 8-bob. Cheklovlar (Constraints)

- 8.1. Cheklovlar asoslari — `NOT NULL`, `UNIQUE`, `DEFAULT`
- 8.2. `PRIMARY KEY` va `CHECK`
- 8.3. `FOREIGN KEY` va `ON DELETE` strategiyalari

### 9-bob. Subquery va CTE

- 9.1. Subquery (ichki so'rovlar) — skalyar, `IN`, `EXISTS`
- 9.2. CTE (`WITH` bandi) va rekursiv CTE

### 10-bob. Funksiyalar va PL/pgSQL

- 10.1. O'rnatilgan (built-in) funksiyalar
- 10.2. `CREATE FUNCTION` va `RETURN` — o'z funksiyalaringizni yaratish
- 10.3. `IF`, `CASE` va `LOOP` — boshqaruv strukturalari

### 11-bob. VIEW va Window funksiyalari

- 11.1. `VIEW` va `MATERIALIZED VIEW`
- 11.2. Window (oyna) funksiyalari — `OVER()`, `PARTITION BY`, `RANK`, `LAG`/`LEAD`

### 12-bob. Trigger

- 12.1. Trigger asoslari — `CREATE TRIGGER`, `NEW`/`OLD`, `BEFORE`/`AFTER`
- 12.2. Trigger amaliy naqshlari — audit jurnali va avtomatik hisoblagichlar

### 13-bob. Tranzaksiyalar

- 13.1. Tranzaksiyalar — `BEGIN`/`COMMIT`/`ROLLBACK` va ACID
- 13.2. `SAVEPOINT` va izolyatsiya darajalari (isolation levels)

### 14-bob. JSON va maxsus turlar

- 14.1. `JSON` va `JSONB` — tuzilmasiz ma'lumotlar bilan ishlash
- 14.2. `ARRAY`, `ENUM` va `UUID` — boshqa maxsus ma'lumot turlari

### 15-bob. Xavfsizlik va zaxira nusxa

- 15.1. Rollar, `GRANT`/`REVOKE` va Row-Level Security (RLS)
- 15.2. Zaxira nusxa — `pg_dump` va `pg_restore`

## II QISM — ICH-ICHIGA: POSTGRESQL ICHKI MEXANIZMLARI

### 16-bob. Xotira va saqlash arxitekturasi

- 16.1. Klaster katalogi va sahifa (page) tuzilishi
- 16.2. TOAST, `fillfactor` va HOT update

### 17-bob. MVCC va VACUUM

- 17.1. MVCC — ko'p versiyali parallellik boshqaruvi
- 17.2. `VACUUM` va `autovacuum` — MVCC "qoldig'i"ni tozalash

### 18-bob. Indekslash chuqur

- 18.1. B-tree indeks — asosiy mexanizm
- 18.2. GIN, GiST, BRIN va Hash — maxsus indeks turlari
- 18.3. Qisman, ifoda va qamrovchi indekslar — `partial`, `expression`, `INCLUDE`

### 19-bob. Query Planner va EXPLAIN

- 19.1. Query Planner, `EXPLAIN` va statistika
- 19.2. `JOIN` strategiyalari — Nested Loop, Hash Join, Merge Join

### 20-bob. WAL va qayta tiklash

- 20.1. WAL — Write-Ahead Log
- 20.2. Checkpoint va avariyadan tiklanish

### 21-bob. Concurrency va qulflash

- 21.1. Qator va jadval qulflari, blokirovka va deadlock
- 21.2. Advisory lock'lar va qulflarni monitoring qilish

### 22-bob. Replikatsiya

- 22.1. Streaming replikatsiya — real vaqtda ma'lumot nusxalash
- 22.2. Replication slot va failover

### 23-bob. Partitioning va Performance Tuning

- 23.1. Table Partitioning — katta jadvallarni bo'laklarga bo'lish
- 23.2. Performance Tuning — serverni sozlash va monitoring

## ILOVA

- `dokon_bazasi` — to'liq yaratish skripti (barcha 6 jadval: `CREATE TABLE` + `INSERT`, sequence'larni to'g'rilash, tekshirish so'rovi)

---

**Metodologiya haqida:** Ushbu darslikdagi har bir SQL misoli va har bir mashq javobi — yozishdan oldin, haqiqiy PostgreSQL 16 serverida, `dokon_bazasi` (yoki maxsus test jadvallari) ustida bevosita sinab ko'rilgan va aynan o'sha sinovdan olingan natija bilan keltirilgan (taxminiy yoki "chiqishi kerak bo'lgan" natija emas). 16-bobdan boshlangan ICH-ICHIGA qismida, bundan tashqari, bir qancha real, jonli ko'p-sessiyali stsenariylar ham namoyish etilgan: haqiqiy `READ COMMITTED`/`REPEATABLE READ` taqqoslash, real qator-blokirovka holati, haqiqiy ikki-jarayonli deadlock (PostgreSQL'ning o'z xato matni bilan), va to'liq ishlaydigan primary/standby streaming replikatsiya juftligi — `pg_basebackup`dan tortib, real failover va timeline almashinuvigacha.
