<div align="center">

# 🧩 Python Naqshlari (Design Patterns)

**04-Python ichidagi qo'shimcha modul** · 5 bo'lim · 22 dars

<sub>[⬅ 🐍 Python](../README.md)</sub>

</div>

---

_Ushbu modul — "Gang of Four" (GoF) klassik dizayn naqshlarini (design patterns) Python tilida, Python'ga xos usulda (pythonic) o'rgatadi. Har bir naqsh uchun: muammo nimada, klassik OOP yechimi qanday, va Python'ning o'zi (duck typing, birinchi darajali funksiyalar, dekoratorlar, generator) bu naqshni qanday "yengillashtiradi" yoki ba'zan tilning o'ziga ichki o'rnatib qo'yganini (built-in qilib qo'yganini) ko'rsatadi. Daraja: 01-bob (tamoyillar) → 05-bob (pythonga xos naqshlar va yakuniy loyiha)._

_Oldindan talab qilinadigan bilim: 04-Python darsligining 04-bob (OOP), 05-bob (istisnolar, generatorlar, dekoratorlar) va 06-bob (ilg'or mavzular) darslari — ayniqsa `__init__`/`super()`, `@property`, `abc.ABC`, generator/`yield`, `@` dekorator sintaksisi va type hints._

---

## 01-BOB — Kirish va tamoyillar

| № | Mavzu | Fayl |
|---|---|---|
| 1.1 | Dizayn naqshlari nima, GoF tarixi, naqsh toifalari va anti-pattern | 01-bob-kirish-va-tamoyillar/1.1-dizayn-naqshlari-nima-tarixi.md |
| 1.2 | SOLID tamoyillari (va Python'da ular qanday boshqacha ko'rinishi) | 01-bob-kirish-va-tamoyillar/1.2-solid-tamoyillari.md |

## 02-BOB — Yaratuvchi naqshlar (Creational Patterns)

| № | Mavzu | Fayl |
|---|---|---|
| 2.1 | Singleton | 02-bob-yaratuvchi-naqshlar/2.1-singleton.md |
| 2.2 | Factory Method | 02-bob-yaratuvchi-naqshlar/2.2-factory-method.md |
| 2.3 | Abstract Factory | 02-bob-yaratuvchi-naqshlar/2.3-abstract-factory.md |
| 2.4 | Builder | 02-bob-yaratuvchi-naqshlar/2.4-builder.md |
| 2.5 | Prototype | 02-bob-yaratuvchi-naqshlar/2.5-prototype.md |

## 03-BOB — Tuzilma naqshlari (Structural Patterns)

| № | Mavzu | Fayl |
|---|---|---|
| 3.1 | Adapter | 03-bob-tuzilma-naqshlari/3.1-adapter.md |
| 3.2 | Facade | 03-bob-tuzilma-naqshlari/3.2-facade.md |
| 3.3 | Composite | 03-bob-tuzilma-naqshlari/3.3-composite.md |
| 3.4 | Proxy | 03-bob-tuzilma-naqshlari/3.4-proxy.md |
| 3.5 | Decorator naqshi va Python dekorator sintaksisi — farqi | 03-bob-tuzilma-naqshlari/3.5-decorator-naqsh-vs-dekorator-sintaksisi.md |

## 04-BOB — Xatti-harakat naqshlari (Behavioral Patterns)

| № | Mavzu | Fayl |
|---|---|---|
| 4.1 | Strategy | 04-bob-xattiharakat-naqshlari/4.1-strategy.md |
| 4.2 | Observer | 04-bob-xattiharakat-naqshlari/4.2-observer.md |
| 4.3 | Command | 04-bob-xattiharakat-naqshlari/4.3-command.md |
| 4.4 | Iterator naqshi (va u Python tiliga qanday ichki o'rnatilgani) | 04-bob-xattiharakat-naqshlari/4.4-iterator-naqsh.md |
| 4.5 | State | 04-bob-xattiharakat-naqshlari/4.5-state.md |
| 4.6 | Template Method | 04-bob-xattiharakat-naqshlari/4.6-template-method.md |

## 05-BOB — Pythonga xos naqshlar (Pythonic Patterns)

| № | Mavzu | Fayl |
|---|---|---|
| 5.1 | Context Manager naqshi (`with`, `__enter__`/`__exit__`, `contextlib`) | 05-bob-pythonga-xos-naqshlar/5.1-context-manager-naqsh.md |
| 5.2 | Mixin | 05-bob-pythonga-xos-naqshlar/5.2-mixin.md |
| 5.3 | Dependency Injection | 05-bob-pythonga-xos-naqshlar/5.3-dependency-injection.md |
| 5.4 | Yakuniy loyiha: bir nechta naqshni birlashtirgan Bildirishnoma tizimi | 05-bob-pythonga-xos-naqshlar/5.4-naqshlarni-birlashtirish-yakuniy-loyiha.md |

---

## Umumiy ma'lumot

- **01-bob (1.1-1.2):** Kirish — dizayn naqshlari nima, GoF (Gang of Four) tarixi, 3 toifa (yaratuvchi/tuzilma/xatti-harakat), anti-pattern va overengineering xavfi, SOLID tamoyillari (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) va ularning Python'dagi duck typing bilan bog'liq xususiyatlari.
- **02-bob (2.1-2.5):** Yaratuvchi naqshlar — obyekt yaratish jarayonini boshqarish: Singleton (`__new__`, modul darajasidagi "pythonic" singleton, thread-safety), Factory Method, Abstract Factory, Builder (fluent interface), Prototype (`copy`/`deepcopy`).
- **03-bob (3.1-3.5):** Tuzilma naqshlari — klass va obyektlarni kattaroq tuzilmalarga birlashtirish: Adapter (interfeys moslashtirish), Facade (sodda interfeys), Composite (daraxt tuzilmalari), Proxy (virtual/protection/remote proxy), va eng chalkash mavzu — Decorator naqshi (OOP, runtime'da obyekt o'rash) bilan Python'ning `@` dekorator sintaksisi (funksiya darajasida) orasidagi farq.
- **04-bob (4.1-4.6):** Xatti-harakat naqshlari — obyektlar orasidagi muloqot va mas'uliyat taqsimoti: Strategy (algoritm almashtirish), Observer (subscribe/publish), Command (so'rovni obyektga aylantirish, undo/redo), Iterator naqshi (va uning Python tiliga `__iter__`/`__next__` orqali qanday ichki singib ketgani), State (holatga bog'liq xatti-harakat), Template Method (`abc.ABC` bilan algoritm skeleti).
- **05-bob (5.1-5.4):** Pythonga xos naqshlar — Context Manager (`with`, `contextlib.contextmanager`), Mixin (ko'p meros orqali funksionallik qo'shish, Django/DRF misollari), Dependency Injection (Python'da DI konteynersiz, duck typing orqali), va yakuniy loyiha — Singleton, Builder, Factory Method, Strategy, Observer naqshlarini birlashtirgan to'liq "Bildirishnoma tizimi".
- **Jami: 22 dars.** Har bir dars bir xil tuzilmaga ega: **Bu darsda nimalarni o'rganasiz** → **Nazariy qism** → **Amaliy misol** → **Keng tarqalgan xatolar** (❌/✅ va sabab bilan) → **Mashq/topshiriq** (Oson/O'rtacha/Qiyin, javoblari bilan) → **Qisqacha xulosa**.
