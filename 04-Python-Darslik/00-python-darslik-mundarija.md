# Python darsligi — Barcha mavzular (to'liq, 15 bo'lim, 57 dars)

_Ushbu darslik noldan (Python nima ekanidan) tortib, professional darajadagi OOP, testlash, CLI loyiha qurish va — eng muhimi — **CPython'ning o'zi ichida (interpretator, xotira, bytecode, C darajasida) qanday ishlashigacha** to'liq yo'lni qamrab oladi. Daraja pastdan yuqoriga: 00-bob → 14-bob. Birinchi 7 bo'lim (00-06) — amaliy, kundalik Python dasturlash; keyingi 8 bo'lim (07-14) — **CPython ichki mexanizmlari** ("Python'ning ich-ichiga qadar"): xotira boshqaruvi, bytecode va ijro modeli, data model (descriptor/metaclass), ma'lumot tuzilmalarining haqiqiy implementatsiyasi, import tizimi, GIL va concurrency, performance/profiling, hattoki C kengaytma yozishgacha.

Barcha terminal buyruqlari **Ubuntu** (Debian-asosidagi distributivlar) uchun moslashtirilgan. Mavzular, versiyalar va misollar CPython'ning rasmiy hujjatlari (`docs.python.org`), rasmiy `InternalDocs/` (CPython manba kodidagi ichki hujjatlar), PEP'lar (703, 393, 659, 649/749, 750, 734 va h.k.) hamda 2025-2026-yillardagi joriy Python (3.12/3.13, va 2025-yil oktyabrda chiqqan 3.14) bo'yicha tadqiqot asosida tuzilgan._

---

## 00-BOB — Kirish

| № | Mavzu | Fayl |
|---|---|---|
| 0.1 | Python nima, tarixi va o'rnatish (Ubuntu) | 0.1-python-nima-ornatish.md |
| 0.2 | Birinchi dastur, REPL va kod uslubi (PEP 8, Zen of Python) | 0.2-birinchi-dastur-repl-kod-uslubi.md |

## 01-BOB — Sintaksis asoslari

| № | Mavzu | Fayl |
|---|---|---|
| 1.1 | O'zgaruvchilar, ma'lumot turlari va operatorlar | 1.1-ozgaruvchilar-turlar-operatorlar.md |
| 1.2 | Kirish/chiqish va f-string | 1.2-kirish-chiqish-fstring.md |
| 1.3 | Shart operatorlari (if/elif/else, walrus, match-case) | 1.3-shart-operatorlari.md |
| 1.4 | Sikllar (for/while/range/break/continue/else) | 1.4-sikllar.md |

## 02-BOB — Ma'lumot tuzilmalari

| № | Mavzu | Fayl |
|---|---|---|
| 2.1 | Satrlar (strings) bilan ishlash | 2.1-satrlar.md |
| 2.2 | Ro'yxatlar (list) va Tuple | 2.2-royxatlar-tuple.md |
| 2.3 | Lug'atlar (dict) va Set | 2.3-lugatlar-set.md |
| 2.4 | Comprehensions (list, dict, set) | 2.4-comprehensions.md |
| 2.5 | Qaysi tuzilmani qachon tanlash + mini-loyiha (Kutubxona katalogi) | 2.5-tuzilma-tanlash-mini-loyiha.md |

## 03-BOB — Funksiyalar va modullar

| № | Mavzu | Fayl |
|---|---|---|
| 3.1 | Funksiyalar, argumentlar va lambda | 3.1-funksiyalar-argumentlar-lambda.md |
| 3.2 | Scope, closures va rekursiya | 3.2-scope-closures-rekursiya.md |
| 3.3 | Modullar, paketlar va standart kutubxona | 3.3-modullar-paketlar-standart-kutubxona.md |
| 3.4 | Virtual muhit va paket boshqaruvi (pip, uv) | 3.4-virtual-muhit-paket-boshqaruv.md |

## 04-BOB — OOP (Obyektga yo'naltirilgan dasturlash)

| № | Mavzu | Fayl |
|---|---|---|
| 4.1 | Klass va obyekt asoslari | 4.1-klass-obyekt-asoslari.md |
| 4.2 | Meros (inheritance) va super() | 4.2-meros-super.md |
| 4.3 | Inkapsulyatsiya, property va polimorfizm | 4.3-inkapsulyatsiya-property-polimorfizm.md |
| 4.4 | Magic metodlar, dataclasses va Enum | 4.4-magic-metodlar-dataclasses-enum.md |
| 4.5 | Abstract classes (abc moduli) | 4.5-abstract-classes.md |

## 05-BOB — Istisnolar, fayllar va generatorlar

| № | Mavzu | Fayl |
|---|---|---|
| 5.1 | Istisnolar (exceptions) | 5.1-istisnolar.md |
| 5.2 | Fayllar (matn/JSON/CSV) va context managerlar | 5.2-fayllar-context-managers.md |
| 5.3 | Iteratorlar va generatorlar | 5.3-iteratorlar-generatorlar.md |
| 5.4 | Dekoratorlar | 5.4-dekoratorlar.md |
| 5.5 | Type hints (tur maslahatlari) | 5.5-type-hints.md |

## 06-BOB — Ilg'or va professional mavzular

| № | Mavzu | Fayl |
|---|---|---|
| 6.1 | Asyncio va concurrency (threading/multiprocessing/GIL) | 6.1-asyncio-concurrency.md |
| 6.2 | Testlash (pytest) va loglash | 6.2-testlash-pytest-loglash.md |
| 6.3 | Paketlash, uv va yakuniy CLI loyiha (Vazifa boshqaruvchi) | 6.3-paketlash-uv-yakuniy-cli-loyiha.md |

---

# CPYTHON ICH-ICHIGA QADAR — 07-BOB dan 14-BOB gacha

_Bu qismdan boshlab savol o'zgaradi: endi "Python'da qanday yozish kerak" emas, balki **"Python satrlarim yozilganda, kompyuter darajasida aynan nima sodir bo'ladi"** degan savolga javob beramiz. Har bir dars CPython'ning rasmiy manba kodi (`InternalDocs/`), PEP hujjatlari va sinovdan o'tgan real kod misollari asosida tuzilgan._

## 07-BOB — Xotira boshqaruvi va ob'ektlar tuzilishi

| № | Mavzu | Fayl |
|---|---|---|
| 7.1 | PyObject, reference counting va `id()` ning haqiqiy ma'nosi | 7.1-pyobject-reference-counting.md |
| 7.2 | Cyclic garbage collector: nasllar, chegaralar, `gc` moduli | 7.2-garbage-collector.md |
| 7.3 | pymalloc: arena, pool, block — Python xotirani qanday ajratadi | 7.3-pymalloc-xotira-ajratish.md |
| 7.4 | Interning, kichik butun sonlar keshi va immutability chuqur | 7.4-interning-immutability-chuqur.md |

## 08-BOB — CPython bajarilish modeli

| № | Mavzu | Fayl |
|---|---|---|
| 8.1 | Kompilyatsiya quvuri: source → AST → bytecode | 8.1-kompilyatsiya-quvuri-ast.md |
| 8.2 | `dis` moduli — bytecode'ni o'qishni o'rganish | 8.2-dis-moduli-bytecode.md |
| 8.3 | Frame stack va ceval loop — VM ichida sayohat | 8.3-frame-stack-ceval-loop.md |
| 8.4 | Specializing adaptive interpreter (PEP 659) va LEGB chuqur | 8.4-adaptive-interpreter-legb-chuqur.md |

## 09-BOB — Data model chuqur: descriptor, metaclass, MRO

| № | Mavzu | Fayl |
|---|---|---|
| 9.1 | Descriptor protokoli — `property`, metod va funksiyaning siri | 9.1-descriptor-protokoli.md |
| 9.2 | MRO va C3 linearizatsiya — `super()` haqiqatda qanday ishlaydi | 9.2-mro-c3-linearizatsiya-super.md |
| 9.3 | Metaclasses — `type` nima va klasslar qanday yaratiladi | 9.3-metaclasses.md |
| 9.4 | `__slots__` va zaif havolalar (weak references) | 9.4-slots-weak-references.md |

## 10-BOB — Ma'lumot tuzilmalarining ichki implementatsiyasi

| № | Mavzu | Fayl |
|---|---|---|
| 10.1 | `list` ichida: dinamik massiv va amortizatsiyalangan o'sish | 10.1-list-ichki-tuzilishi.md |
| 10.2 | `dict`/`set` ichida: hash-jadval, ochiq adreslash, tartib saqlanishi | 10.2-dict-set-ichki-tuzilishi.md |
| 10.3 | `str` ichida: PEP 393 moslashuvchan Unicode tasviri | 10.3-str-unicode-pep393.md |
| 10.4 | Timsort — `sorted()` ortidagi algoritm | 10.4-timsort-algoritmi.md |

## 11-BOB — Import tizimi chuqur

| № | Mavzu | Fayl |
|---|---|---|
| 11.1 | `sys.modules`, finder va loader'lar, `importlib` mexanizmi | 11.1-import-mexanizmi-importlib.md |
| 11.2 | `__pycache__`, `.pyc` fayllar va bytecode keshlash | 11.2-pycache-pyc-bytecode-kesh.md |
| 11.3 | Paket tuzilishi chuqur: `__init__.py`, namespace paketlar | 11.3-paket-tuzilishi-chuqur.md |

## 12-BOB — GIL va concurrency chuqur

| № | Mavzu | Fayl |
|---|---|---|
| 12.1 | GIL nima, nega mavjud va PEP 703 (free-threading, 3.13/3.14) | 12.1-gil-ichki-mexanizmi-pep703.md |
| 12.2 | `threading` chuqur: Lock, RLock, Condition, Queue | 12.2-threading-chuqur.md |
| 12.3 | `multiprocessing` chuqur: pickling, shared memory | 12.3-multiprocessing-chuqur.md |
| 12.4 | asyncio ichida: event loop, coroutine, Task/Future | 12.4-asyncio-ichki-mexanizmi.md |

## 13-BOB — Performance, profiling va optimizatsiya

| № | Mavzu | Fayl |
|---|---|---|
| 13.1 | `cProfile`, `timeit` va `sys.monitoring` bilan o'lchash | 13.1-profiling-cprofile-timeit.md |
| 13.2 | Algoritmik murakkablik amaliyotda (Big O real kodda) | 13.2-algoritmik-murakkablik-amaliyotda.md |
| 13.3 | C kengaytmalarga kirish: `ctypes`, `cffi`, Cython | 13.3-ctypes-cffi-cython-kirish.md |
| 13.4 | CPython alternativalari: PyPy va JIT'ning bugungi holati | 13.4-pypy-jit-alternativalar.md |

## 14-BOB — Python C API asoslari

| № | Mavzu | Fayl |
|---|---|---|
| 14.1 | Birinchi C kengaytmangiz: `Python.h` va `PyObject*` | 14.1-birinchi-c-kengaytma.md |
| 14.2 | Kengaytmani qurish, import qilish va xatolarni boshqarish | 14.2-kengaytma-qurish-xatolar.md |

---

## Umumiy ma'lumot

- **00-bob (0.1-0.2):** Kirish — Python tarixi, joriy versiyalar (3.14/3.13, kurs 3.12+ asos qilingan), Ubuntu'da o'rnatish (`apt`, `python3`/`pip3`, `deadsnakes` PPA), IDE (`snap install code`/`pycharm-community`), venv, REPL, PEP 8, Zen of Python.
- **01-bob (1.1-1.4):** Sintaksis asoslari — o'zgaruvchilar, turlar, operatorlar, f-string, `if`/`elif`/`else`, walrus operator (`:=`), `match`/`case`, `for`/`while` sikllari, `range()`, `break`/`continue`.
- **02-bob (2.1-2.5):** Ma'lumot tuzilmalari — satrlar (slicing, metodlar), ro'yxat va tuple (mutable/immutable), lug'at va set (hash asosida tezlik), comprehensions, tuzilma tanlash mezonlari + "Kutubxona katalogi" mini-loyihasi.
- **03-bob (3.1-3.4):** Funksiyalar va modullar — `*args`/`**kwargs`, lambda, scope/`global`/`nonlocal`, closures, rekursiya, `import` turlari, `__name__ == "__main__"`, standart kutubxona (`math`, `random`, `datetime`, `os`, `json`, `collections`), `pip`/`venv` va zamonaviy `uv` paket menejeri.
- **04-bob (4.1-4.5):** OOP — klass/obyekt, `__init__`/`self`, meros va `super()`, `@property`, inkapsulyatsiya konvensiyalari, polimorfizm va duck typing, magic metodlar (`__str__`, `__eq__`, `__add__`), `@dataclass`, `Enum`, abstrakt klasslar (`abc`, `@abstractmethod`).
- **05-bob (5.1-5.5):** Istisnolar, fayllar, generatorlar — `try`/`except`/`else`/`finally`, maxsus istisno klasslari, `with`/context managerlar, JSON/CSV fayllar, iteratorlar, `yield`/`yield from`, dekoratorlar (`@wraps`, `@lru_cache`, argumentli dekoratorlar), type hints (`list[int]`, `X | None`, `mypy`).
- **06-bob (6.1-6.3):** Ilg'or mavzular — GIL, `threading`/`multiprocessing`/`asyncio` taqqoslashi, `async`/`await`, `pytest` (fixture, parametrize), `logging`, professional loyiha strukturasi, `argparse`, `pyproject.toml`, yakuniy "Vazifa boshqaruvchi" CLI loyihasi.
- **07-bob (7.1-7.4):** Xotira va ob'ektlar — `PyObject`/`PyTypeObject` tuzilishi, refcounting va `sys.getrefcount`, siklik GC (3 nasl, `threshold0/1/2`), `gc` moduli, pymalloc (arena → pool → block), interning (`sys.intern`, kichik butun sonlar -5..256), immutability haqiqatda nimani anglatadi.
- **08-bob (8.1-8.4):** Bajarilish modeli — AST (`ast` moduli), code object (`co_code`, `co_consts`, `co_varnames`), `dis` moduli bilan bytecode o'qish, frame object, `_PyEval_EvalFrameDefault` (ceval.c) va stack-asosli VM, PEP 659 specializing adaptive interpreter (3.11+), LEGB (Local-Enclosing-Global-Built-in) skoup zanjiri chuqur.
- **09-bob (9.1-9.4):** Data model chuqur — `__get__`/`__set__`/`__delete__`, data vs non-data descriptor, `property`/`staticmethod`/`classmethod` qanday ishlaydi, MRO va C3 linearizatsiya algoritmi, `super()`ning haqiqiy ishlash mexanizmi, metaclass (`type`, `__new__` vs `__init__`, `__init_subclass__`), `__slots__` xotira tejash, `weakref` moduli.
- **10-bob (10.1-10.4):** Tuzilmalar ichida — `list` dinamik massiv (over-allocation, amortizatsiyalangan O(1) append), `dict`/`set` kompakt hash-jadval (indekslar massivi + zich yozuvlar massivi, pseudo-random probing, qayta o'lchamlash), `str` PEP 393 (Latin-1/UCS2/UCS4, ASCII optimallashtirish), Timsort (run'lar, merge, `galloping mode`).
- **11-bob (11.1-11.3):** Import tizimi — `sys.modules` kesh, `sys.meta_path` (finder'lar), loader'lar, `importlib.import_module`, `__pycache__`/`.pyc` (magic number, timestamp/hash invalidatsiya), `__init__.py` roli, namespace paketlar (PEP 420).
- **12-bob (12.1-12.4):** GIL va concurrency — GIL nega kerak (refcounting xavfsizligi), `sys.setswitchinterval`, PEP 703 free-threading (3.13 eksperimental, 3.14'da rasmiy — PEP 779), `threading` (`Lock`, `RLock`, `Condition`, `Queue`, deadlock), `multiprocessing` (fork/spawn, pickling, `shared_memory`), asyncio ichida (event loop, coroutine holatlari, `Task`/`Future`, `await` qanday ishlaydi).
- **13-bob (13.1-13.4):** Performance — `cProfile`/`pstats`, `timeit`, `sys.monitoring` (PEP 669), Big O real kod misollarida (list vs set qidiruv, N+1 muammosi), `ctypes` bilan C funksiyasini chaqirish, `cffi` va Cython'ga kirish, PyPy va JIT holati (3.13+ tajribaviy JIT, 3.14 tail-call interpreter — 3-5% tezlashish).
- **14-bob (14.1-14.2):** C API — `Python.h`, `PyObject*` bilan ishlash, oddiy C funksiyasini Python'ga ochish, `setup.py`/`pyproject.toml` orqali qurish va import qilish, xatolarni C darajasida boshqarish (`PyErr_SetString`).
- **Jami: 57 dars** (0.1 dan 14.2 gacha) — noldan boshlab, professional Python dasturchisi darajasidan o'tib, **CPython interpretatorining o'zini tushunadigan** darajagacha to'liq qamrab olingan.
- Har bir dars bir xil tuzilmaga ega: **Bu darsda nimalarni o'rganasiz** → **Nazariy qism** → **Amaliy misol** → **Keng tarqalgan xatolar** (har biri ❌/✅ va SABAB bilan) → **Mashq/topshiriq** (Oson/O'rtacha/Qiyin, javoblari bilan) → **Qisqacha xulosa**.
- 07-14-boblar qo'shimcha ravishda **"Manba"** eslatmalari bilan boyitilgan — qaysi rasmiy hujjat yoki tadqiqotga asoslanganini ko'rsatadi, shunda o'quvchi istasa mavzuni yanada chuqurroq o'zi davom ettira oladi.
- Barcha terminal buyruqlari Ubuntu (apt, `python3`/`pip3`, `snap`) uchun moslashtirilgan; zamonaviy `uv` paket menejeri alohida (3.4-dars) va yakuniy loyihada (6.3-dars) tanishtirilgan, an'anaviy `pip`+`venv` bilan bir qatorda.
