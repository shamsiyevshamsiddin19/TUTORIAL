
# 📚 13-14 Kun: Real-Time va Asinxron Vazifalar — WebSockets va Background Tasks ⚡🔌

> **Navigatsiya:** [⬅️ 11-12 Kun (Pytest bilan Testing)](11-12-kun-pytest-bilan-testing.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 15-16 Kun (Redis va Caching) ➡️](15-16-kun-redis-va-caching.md)

---
## **1-Qism: WebSocket Nima? (20 daqiqa)**

### **HTTP vs WebSocket:**

```
HTTP (Oddiy):
  Client → "So'rov" → Server | Server → "Javob"  → Client
  Ulanish yopiladi!

  Yangi ma'lumot uchun → Qaytadan so'rov!
  ❌ Real-time uchun yaroqsiz
```

---

```
WebSocket:
  Client ←→ Server (Doimiy ulanish!)

  Server istagan vaqt yuborishi mumkin
  Client istagan vaqt yuborishi mumkin

  ✅ Chat ilovalar
  ✅ Jonli bildirish (notification)
  ✅ Online o'yinlar
  ✅ Jonli kurs narxlari
  ✅ Hamkorlikda tahrirlash (Google Docs kabi)
```

---

### **WebSocket Qanday Ishlaydi:**

```
1. Client HTTP orqali "Upgrade" so'raydi:
   GET /ws HTTP/1.1
   Upgrade: websocket

2. Server rozi bo'ladi:
   HTTP/1.1 101 Switching Protocols

3. Endi ikki tomonlama kanal ochiq!
   Client → Server: "Salom"
   Server → Client: "Salom! Qandaysiz?"
   Server → Client: "Yangi xabar keldi!"
   Client → Server: "Ko'rdim, rahmat"

4. Biri yopmaguncha kanal ochiq qoladi
```

---

## **2-Qism: Birinchi WebSocket (25 daqiqa)**

### **app/routers/websocket.py yarating:**

```python
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json

router = APIRouter(tags=["WebSocket"])

# ─── ODDIY WEBSOCKET ──────────────────────────
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # 1. Ulanishni qabul qilish
    await websocket.accept()

    try:
        while True:
            # 2. Xabar kutish
            data = await websocket.receive_text()
            print(f"Keldi: {data}")

            # 3. Javob yuborish
            await websocket.send_text(f"Siz yubordingiz: {data}")

    except WebSocketDisconnect:
        print("Client uzildi")
```

---

### **app/main.py ga qo'shing:**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import posts, users, auth, websocket   # ← websocket qo'shildi
from .config import settings

app = FastAPI(title="Blog API", version="6.0.0")

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
    # ← qo'shildi

@app.get("/")
def root():
    return {"xabar": "Blog API v6.0 — WebSocket bilan!"}

@app.get("/health")
def health():
    return {"status": "ok"}
```

---

### **Sinab Ko'rish — HTML fayl:**

Loyiha ildizida `ws_test.html` yarating:

```html
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Test</title>
    <style>
        body { font-family: Arial; max-width: 600px; margin: 50px auto; }
        #messages { border: 1px solid #ccc; height: 300px;
                    overflow-y: auto; padding: 10px; margin-bottom: 10px; }
        input { width: 70%; padding: 8px; }
        button { padding: 8px 16px; margin-left: 5px; }
        .sent     { color: blue; }
        .received { color: green; }
        .system   { color: gray; font-style: italic; }
    </style>
</head>
<body>
    <h2>WebSocket Test</h2>
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="Xabar yozing..."/>
    <button onclick="sendMessage()">Yuborish</button>
    <button onclick="disconnect()" style="background:red; color:white">
        Uzilish
    </button>

    <script>
        const ws = new WebSocket("ws://localhost:8000/ws");
        const messages = document.getElementById("messages");
        const input = document.getElementById("messageInput");

        function addMessage(text, type) {
            const div = document.createElement("div");
            div.className = type;
            div.textContent = text;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        ws.onopen = () => {
            addMessage("✅ Server ga ulandi!", "system");
        };

        ws.onmessage = (event) => {
            addMessage("Server: " + event.data, "received");
        };

        ws.onclose = () => {
            addMessage("❌ Ulanish yopildi", "system");
        };

        ws.onerror = (error) => {
            addMessage("Xato: " + error, "system");
        };

        function sendMessage() {
            const message = input.value.trim();
            if (message && ws.readyState === WebSocket.OPEN) {
                addMessage("Siz: " + message, "sent");
                ws.send(message);
                input.value = "";
            }
        }

        function disconnect() {
            ws.close();
        }

        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });
    </script>
</body>
</html>
```

---

**Ishga tushirish:**

```bash
python -m uvicorn app.main:app --reload
```

`ws_test.html` ni brauzerda oching va test qiling! 🎉

```bash
Open browser
Drag ws_test.html into it
```

---

## **3-Qism: Connection Manager — Ko'p Foydalanuvchi (30 daqiqa)**

### **Muammo:**

```
Hozir faqat 1 ta client!

Real chat uchun:
- Ko'p client ulangan
- Biriga xabar kelsa → Barchaga yuborish
- Kim ulanib, kim uzilganini bilish
```

---

### **app/routers/websocket.py — To'liq yangilash:**

```python
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict
import json
from datetime import datetime

router = APIRouter(tags=["WebSocket"])

# ─── CONNECTION MANAGER ───────────────────────
class ConnectionManager:
    def __init__(self):
        # {room_id: [websocket1, websocket2, ...]}
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = []
        self.active_connections[room].append(websocket)
        print(f"Yangi ulanish: {room} | "
              f"Jami: {len(self.active_connections[room])}")

    def disconnect(self, websocket: WebSocket, room: str):
        if room in self.active_connections:
            self.active_connections[room].remove(websocket)
            if not self.active_connections[room]:
                del self.active_connections[room]
        print(f"Uzildi: {room}")

    async def send_personal(self, message: str, websocket: WebSocket):
        """Faqat bitta clientga"""
        await websocket.send_text(message)

    async def broadcast(self, message: str, room: str):
        """Xonadagi barcha clientlarga"""
        if room in self.active_connections:
            for connection in self.active_connections[room]:
                await connection.send_text(message)

    async def broadcast_except(
        self,
        message: str,
        room: str,
        exclude: WebSocket
    ):
        """O'zidan boshqa barchaga"""
        if room in self.active_connections:
            for connection in self.active_connections[room]:
                if connection != exclude:
                    await connection.send_text(message)

    def get_room_count(self, room: str) -> int:
        """Xonadagi odamlar soni"""
        return len(self.active_connections.get(room, []))

manager = ConnectionManager()

# ─── CHAT ENDPOINT ────────────────────────────
@router.websocket("/ws/chat/{room}/{username}")
async def chat_endpoint(
    websocket: WebSocket,
    room: str,
    username: str
):
    await manager.connect(websocket, room)

    # Kirish xabari
    join_message = json.dumps({
        "type": "system",
        "message": f"{username} xonaga kirdi!",
        "room": room,
        "users_count": manager.get_room_count(room),
        "timestamp": datetime.now().strftime("%H:%M")
    })
    await manager.broadcast(join_message, room)

    try:
        while True:
            # Xabar kutish
            data = await websocket.receive_text()

            # JSON formatida yuborish
            message = json.dumps({
                "type": "message",
                "username": username,
                "message": data,
                "room": room,
                "timestamp": datetime.now().strftime("%H:%M")
            })
            await manager.broadcast(message, room)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room)

        # Chiqish xabari
        leave_message = json.dumps({
            "type": "system",
            "message": f"{username} xonadan chiqdi",
            "room": room,
            "users_count": manager.get_room_count(room),
            "timestamp": datetime.now().strftime("%H:%M")
        })
        await manager.broadcast(leave_message, room)

# ─── XONALAR RO'YXATI ─────────────────────────
@router.get("/ws/rooms")
def get_active_rooms():
    return {
        "rooms": {
            room: len(connections)
            for room, connections
            in manager.active_connections.items()
        }
    }
```

---

### **Chat UI — ws_chat.html:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Real-time Chat</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial; background: #f0f2f5; }
        .container { max-width: 700px; margin: 20px auto; }

        /* Login */
        .login-box {
            background: white; padding: 30px;
            border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,.1);
        }
        .login-box h2 { margin-bottom: 20px; color: #1a73e8; }
        .login-box input {
            width: 100%; padding: 10px; margin-bottom: 10px;
            border: 1px solid #ddd; border-radius: 8px; font-size: 16px;
        }
        .login-box button {
            width: 100%; padding: 12px; background: #1a73e8;
            color: white; border: none; border-radius: 8px;
            font-size: 16px; cursor: pointer;
        }

        /* Chat */
        .chat-box { display: none; }
        .chat-header {
            background: #1a73e8; color: white;
            padding: 15px 20px; border-radius: 12px 12px 0 0;
            display: flex; justify-content: space-between;
        }
        #messages {
            background: white; height: 400px;
            overflow-y: auto; padding: 15px;
        }
        .msg { margin-bottom: 12px; }
        .msg.system {
            text-align: center; color: #888;
            font-size: 13px; font-style: italic;
        }
        .msg.mine .bubble {
            background: #1a73e8; color: white;
            margin-left: auto;
        }
        .msg.other .bubble { background: #f0f2f5; }
        .bubble {
            display: inline-block; padding: 8px 14px;
            border-radius: 18px; max-width: 70%;
            word-wrap: break-word;
        }
        .msg-info {
            font-size: 11px; color: #888;
            margin-bottom: 2px;
        }
        .msg.mine .msg-info { text-align: right; }
        .input-area {
            display: flex; padding: 12px;
            background: white; border-top: 1px solid #eee;
            border-radius: 0 0 12px 12px;
        }
        .input-area input {
            flex: 1; padding: 10px; border: 1px solid #ddd;
            border-radius: 20px; outline: none; font-size: 15px;
        }
        .input-area button {
            margin-left: 8px; padding: 10px 20px;
            background: #1a73e8; color: white;
            border: none; border-radius: 20px; cursor: pointer;
        }
    </style>
</head>
<body>
<div class="container">

    <!-- Login -->
    <div class="login-box" id="loginBox">
        <h2>💬 Real-time Chat</h2>
        <input type="text" id="usernameInput" placeholder="Ismingiz"/>
        <input type="text" id="roomInput"
               placeholder="Xona nomi (masalan: general)" value="general"/>
        <button onclick="connect()">Kirish</button>
    </div>

    <!-- Chat -->
    <div class="chat-box" id="chatBox">
        <div class="chat-header">
            <span id="roomTitle">💬 Xona</span>
            <span id="usersCount">👥 1 kishi</span>
        </div>
        <div id="messages"></div>
        <div class="input-area">
            <input type="text" id="msgInput"
                   placeholder="Xabar yozing..."/>
            <button onclick="sendMessage()">Yuborish</button>
        </div>
    </div>

</div>

<script>
    let ws, myUsername, myRoom;

    function connect() {
        myUsername = document.getElementById("usernameInput").value.trim();
        myRoom     = document.getElementById("roomInput").value.trim();
        if (!myUsername || !myRoom) {
            alert("Ism va xona nomini kiriting!");
            return;
        }

        ws = new WebSocket(
            `ws://localhost:8000/ws/chat/${myRoom}/${myUsername}`
        );

        ws.onopen = () => {
            document.getElementById("loginBox").style.display = "none";
            document.getElementById("chatBox").style.display = "block";
            document.getElementById("roomTitle").textContent =
                `💬 ${myRoom}`;
            document.getElementById("msgInput").focus();
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            addMessage(data);
        };

        ws.onclose = () => addSystemMessage("❌ Ulanish uzildi");
        ws.onerror = () => addSystemMessage("⚠️ Xato yuz berdi");
    }

    function addMessage(data) {
        const messages = document.getElementById("messages");

        if (data.type === "system") {
            const div = document.createElement("div");
            div.className = "msg system";
            div.textContent = `${data.timestamp} — ${data.message}`;
            messages.appendChild(div);
            document.getElementById("usersCount").textContent =
                `👥 ${data.users_count} kishi`;
        } else {
            const isMine = data.username === myUsername;
            const div = document.createElement("div");
            div.className = `msg ${isMine ? "mine" : "other"}`;
            div.innerHTML = `
                <div class="msg-info">
                    ${isMine ? "" : data.username + " · "}${data.timestamp}
                </div>
                <div class="bubble">${data.message}</div>
            `;
            messages.appendChild(div);
        }
        messages.scrollTop = messages.scrollHeight;
    }

    function addSystemMessage(text) {
        const div = document.createElement("div");
        div.className = "msg system";
        div.textContent = text;
        document.getElementById("messages").appendChild(div);
    }

    function sendMessage() {
        const input = document.getElementById("msgInput");
        const message = input.value.trim();
        if (message && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
            input.value = "";
        }
    }

    document.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
</script>
</body>
</html>
```

---

**Test — 2 ta brauzer oynasida:**

```
1. ws_chat.html ni 2 ta tabda oching
2. Tab 1: Ali, xona: general
3. Tab 2: Vali, xona: general
4. Xabar yozing → Real-time ko'rasiz! 🎉
```

---

## **4-Qism: JWT bilan WebSocket Himoyasi (20 daqiqa)**

### **Muammo:**

```
Hozir hamma chat ga kirishi mumkin!
Token tekshirish kerak.
```

---

### **app/routers/websocket.py ga qo'shing:**

```python
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from typing import List, Dict
import json
from datetime import datetime

from jose import jwt, JWTError
from app.config import settings
from app.database import SessionLocal
from app import models

router = APIRouter(tags=["WebSocket"])

# ─── TOKEN CHECK ──────────────────────────────
async def get_ws_user(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )

        user_id = payload.get("user_id")
        if not user_id:
            return None

    except JWTError:
        return None

    db = SessionLocal()
    try:
        user = db.query(models.User).filter(
            models.User.id == user_id
        ).first()
        return user
    finally:
        db.close()

# ─── CONNECTION MANAGER ───────────────────────
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()

        if room not in self.active_connections:
            self.active_connections[room] = []

        self.active_connections[room].append(websocket)

        print(f"Connected: {room} | Count: {len(self.active_connections[room])}")

    def disconnect(self, websocket: WebSocket, room: str):
        if room in self.active_connections:
            self.active_connections[room].remove(websocket)

            if not self.active_connections[room]:
                del self.active_connections[room]

        print(f"Disconnected: {room}")

    async def broadcast(self, message: str, room: str):
        if room in self.active_connections:
            for connection in self.active_connections[room]:
                await connection.send_text(message)

    def get_room_count(self, room: str) -> int:
        return len(self.active_connections.get(room, []))

manager = ConnectionManager()

# ─── SECURE CHAT ENDPOINT ─────────────────────
@router.websocket("/ws/chat/{room}")
async def chat_endpoint(
    websocket: WebSocket,
    room: str,
    token: str = Query(None)
):
    # 🔐 TOKEN VALIDATION (before accept)
    user = await get_ws_user(token)

    if not token or not user:
        await websocket.close(code=1008)
        return

    username = user.username

    # ✅ ACCEPT CONNECTION
    await manager.connect(websocket, room)

    # JOIN MESSAGE
    await manager.broadcast(
        json.dumps({
            "type": "system",
            "message": f"{username} joined",
            "room": room,
            "users_count": manager.get_room_count(room),
            "timestamp": datetime.now().strftime("%H:%M")
        }),
        room
    )

    try:
        while True:
            data = await websocket.receive_text()

            await manager.broadcast(
                json.dumps({
                    "type": "message",
                    "username": username,
                    "message": data,
                    "room": room,
                    "timestamp": datetime.now().strftime("%H:%M")
                }),
                room
            )

    except WebSocketDisconnect:
        manager.disconnect(websocket, room)

        await manager.broadcast(
            json.dumps({
                "type": "system",
                "message": f"{username} left",
                "room": room,
                "users_count": manager.get_room_count(room),
                "timestamp": datetime.now().strftime("%H:%M")
            }),
            room
        )

# ─── ROOMS ───────────────────────────────────
@router.get("/ws/rooms")
def get_active_rooms():
    return {
        "rooms": {
            room: len(connections)
            for room, connections in manager.active_connections.items()
        }
    }
```

---

`ws_chat.html`

```jsx
<!DOCTYPE html>
<html>
<head>
    <title>Real-time Chat</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial; background: #f0f2f5; }
        .container { max-width: 700px; margin: 20px auto; }

        /* Login */
        .login-box {
            background: white; padding: 30px;
            border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,.1);
        }
        .login-box h2 { margin-bottom: 20px; color: #1a73e8; }
        .login-box input {
            width: 100%; padding: 10px; margin-bottom: 10px;
            border: 1px solid #ddd; border-radius: 8px; font-size: 16px;
        }
        .login-box button {
            width: 100%; padding: 12px; background: #1a73e8;
            color: white; border: none; border-radius: 8px;
            font-size: 16px; cursor: pointer;
        }

        /* Chat */
        .chat-box { display: none; }
        .chat-header {
            background: #1a73e8; color: white;
            padding: 15px 20px; border-radius: 12px 12px 0 0;
            display: flex; justify-content: space-between;
        }
        #messages {
            background: white; height: 400px;
            overflow-y: auto; padding: 15px;
        }
        .msg { margin-bottom: 12px; }
        .msg.system {
            text-align: center; color: #888;
            font-size: 13px; font-style: italic;
        }
        .msg.mine .bubble {
            background: #1a73e8; color: white;
            margin-left: auto;
        }
        .msg.other .bubble { background: #f0f2f5; }
        .bubble {
            display: inline-block; padding: 8px 14px;
            border-radius: 18px; max-width: 70%;
        }
        .msg-info {
            font-size: 11px; color: #888;
            margin-bottom: 2px;
        }
        .msg.mine .msg-info { text-align: right; }

        .input-area {
            display: flex; padding: 12px;
            background: white; border-top: 1px solid #eee;
            border-radius: 0 0 12px 12px;
        }
        .input-area input {
            flex: 1; padding: 10px; border: 1px solid #ddd;
            border-radius: 20px; outline: none; font-size: 15px;
        }
        .input-area button {
            margin-left: 8px; padding: 10px 20px;
            background: #1a73e8; color: white;
            border: none; border-radius: 20px; cursor: pointer;
        }
    </style>
</head>
<body>
<div class="container">

    <!-- LOGIN -->
    <div class="login-box" id="loginBox">
        <h2>💬 Real-time Chat</h2>

        <input type="text" id="roomInput"
               placeholder="Xona nomi" value="general"/>

        <input type="text" id="tokenInput"
               placeholder="Access token"/>

        <button onclick="connect()">Kirish</button>
    </div>

    <!-- CHAT -->
    <div class="chat-box" id="chatBox">
        <div class="chat-header">
            <span id="roomTitle">💬 Xona</span>
            <span id="usersCount">👥 1 kishi</span>
        </div>

        <div id="messages"></div>

        <div class="input-area">
            <input type="text" id="msgInput"
                   placeholder="Xabar yozing..."/>
            <button onclick="sendMessage()">Yuborish</button>
        </div>
    </div>

</div>

<script>
let ws, myRoom;

function connect() {
    myRoom = document.getElementById("roomInput").value.trim();
    const token = document.getElementById("tokenInput").value.trim();

    if (!myRoom) {
        alert("Xona nomi kerak");
        return;
    }

    if (!token) {
        alert("Token kerak");
        return;
    }

    ws = new WebSocket(
        `ws://localhost:8000/ws/chat/${myRoom}?token=${token}`
    );

    ws.onopen = () => {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("chatBox").style.display = "block";
        document.getElementById("roomTitle").textContent = `💬 ${myRoom}`;
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        addMessage(data);
    };

    ws.onclose = () => addSystemMessage("❌ Ulanish uzildi (token xato bo‘lishi mumkin)");
    ws.onerror = () => addSystemMessage("⚠️ Xato yuz berdi");
}

function addMessage(data) {
    const messages = document.getElementById("messages");

    if (data.type === "system") {
        const div = document.createElement("div");
        div.className = "msg system";
        div.textContent = `${data.timestamp} — ${data.message}`;
        messages.appendChild(div);

        document.getElementById("usersCount").textContent =
            `👥 ${data.users_count} kishi`;
    } else {
        const div = document.createElement("div");
        div.className = "msg other";

        div.innerHTML = `
            <div class="msg-info">
                ${data.username} · ${data.timestamp}
            </div>
            <div class="bubble">${data.message}</div>
        `;

        messages.appendChild(div);
    }

    messages.scrollTop = messages.scrollHeight;
}

function addSystemMessage(text) {
    const div = document.createElement("div");
    div.className = "msg system";
    div.textContent = text;
    document.getElementById("messages").appendChild(div);
}

function sendMessage() {
    const input = document.getElementById("msgInput");
    const message = input.value.trim();

    if (message && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        input.value = "";
    }
}

document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
</script>

</body>
</html>
```

---

# **Postman bilan WebSocket test (step-by-step)**

## **Qadam 1: Postman → New WebSocket Request**

1. Postman oching
2. **New** tugmasini bosing
3. **WebSocket Request** ni tanlang

---

## **Qadam 2: URL yozish**

URL joyiga yozasiz:

```
ws://localhost:8000/ws/secure/general?token=abc123
```

⚠️ `abc123` o‘rniga o‘zingiz olgan JWT token

---

## **Qadam 3: Connect bosish**

- **Connect** tugmasini bosing
- Agar token to‘g‘ri bo‘lsa → ulanadi
- Agar xato bo‘lsa → connection yopiladi (1008 code)

---

## **Qadam 4: Xabar yuborish**

Pastki qismda yozasiz:

```
Salom hammaga
```

→ **Send** tugmasini bosing

---

## **Qadam 5: Natijani ko‘rish**

Agar hammasi to‘g‘ri bo‘lsa:

```
Ali joined (secure)
Ali: Salom hammaga
```

---

# **Mini tushuncha (oddiy qilib)**

### URL ichida nima bor?

```
ws://localhost:8000/ws/secure/general?token=abc123
```

Bu 3 qismdan iborat:

1. `general` → room
2. `token=abc123` → authentication
3. `ws://` → WebSocket protokol

## **5-Qism: Background Tasks Nima? (15 daqiqa)**

### **Muammo:**

```
Foydalanuvchi ro'yxatdan o'tadi:
1. DB ga yozish         → 0.01 sekund
2. Email yuborish       → 3-5 sekund ❌

Foydalanuvchi 5 sekund kutadi — yomon tajriba!
```

---

### **Yechim — Background Task:**

```
1. DB ga yozish         → 0.01 sekund
2. Javob qaytarish      → 0.01 sekund ✅ Foydalanuvchi kutmaydi!
3. [Fonda] Email yuborish → 3-5 sekund (foydalanuvchi bilmaydi)
```

---

### **Qayerda Ishlatiladi:**

```
✅ Email yuborish
✅ SMS yuborish
✅ Rasm qayta ishlash (resize)
✅ PDF yaratish
✅ Log yozish
✅ Cache yangilash
✅ Boshqa API ga xabar berish (webhook)
```

---

## **6-Qism: BackgroundTasks Ishlatish (30 daqiqa)**

### **app/utils/email.py yarating:**

```python
import time
import logging

logger = logging.getLogger(__name__)

def send_welcome_email(email: str, username: str):
    """
    Haqiqiy loyihada: smtplib yoki SendGrid ishlatiladi.
    Hozir: simulyatsiya qilamiz.
    """
    logger.info(f"Email yuborilmoqda: {email}")
    time.sleep(2)  # Email yuborish simulyatsiyasi
    logger.info(f"Email yuborildi: {email} → {username}")

def send_post_notification(author_email: str, title: str):
    """Post yaratilganda email"""
    logger.info(f"Post bildirishi: {author_email} → {title}")
    time.sleep(1)
    logger.info(f"Bildirish yuborildi!")

def write_log(action: str, user_id: int, details: str = ""):
    """Faoliyat logi"""
    logger.info(f"LOG: user={user_id} | action={action} | {details}")
```

---

### **app/routers/users.py — Background Task bilan:**

```python
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..utils.hashing import hash_password
from ..utils.email import send_welcome_email, write_log

router = APIRouter(prefix="/users", tags=["Users"])

# ─── CREATE USER (background email) ──────────
@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.UserResponse
)
def create_user(
    user: schemas.UserCreate,
    background_tasks: BackgroundTasks,   # ← BackgroundTasks
    db: Session = Depends(get_db)
):
    # Email tekshirish
    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu email allaqachon ro'yxatdan o'tgan"
        )

    # Parolni xashlash
    hashed = hash_password(user.password)
    user.password = hashed

    # DB ga yozish
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Fonda email yuborish — foydalanuvchi kutmaydi!
    background_tasks.add_task(
        send_welcome_email,
        email=new_user.email,
        username=new_user.username
    )

    # Fonda log yozish
    background_tasks.add_task(
        write_log,
        action="user_created",
        user_id=new_user.id,
        details=f"email={new_user.email}"
    )

    # Darhol javob! (email kutilmaydi)
    return new_user
```

---

### **app/routers/posts.py — Post bildirishi:**

```python
from ..utils.email import send_post_notification
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.PostResponse
)
def create_post(
    post: schemas.PostCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    new_post = models.Post(
        owner_id=current_user.id,
        **post.dict()
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # Fonda post bildirishi
    background_tasks.add_task(
        send_post_notification,
        author_email=current_user.email,
        title=new_post.title
    )

    return new_post
```

---

**Test — terminalda log ko'ring:**

```bash
python -m uvicorn app.main:app --reload
```

```
POST /users/ yuborish:
INFO:     POST /users/ HTTP/1.1" 201 Created    ← Darhol!
INFO:     Email yuborilmoqda: ali@example.com
INFO:     Email yuborildi: ali@example.com → ali  ← 2 sek keyin
```

Add this to your `app/main.py`:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s"
)
```

Full simple example:

```python
from fastapi import FastAPI
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()
```

---

## **7-Qism: Haqiqiy Email Yuborish (20 daqiqa)**

### **O'rnatish:**

```bash
pip install fastapi-mail
pip freeze > requirements.txt
```

---

### **.env ga qo'shing:**

```
MAIL_USERNAME=the_same_email@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop
MAIL_FROM=the_same_email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
```

**Gmail App Password olish:**

```
1. Open -> https://myaccount.google.com/apppasswords
2. App Passwords → Create
4. Parolni nusxalab oling
```

---

### **app/utils/email.py — Haqiqiy email:**

```python
import time
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.config import settings
import asyncio

conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_from,
    MAIL_PORT=settings.mail_port,
    MAIL_SERVER=settings.mail_server,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_welcome_email(email: str, username: str):
    message = MessageSchema(
        subject="Xush kelibsiz! 🎉",
        recipients=[email],
        body=f"""
        <h2>Salom, {username}!</h2>
        <p>Blog API ga xush kelibsiz!</p>
        <p>Hisobingiz muvaffaqiyatli yaratildi.</p>
        """,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

async def send_post_notification(author_email: str, title: str):
    """Post yaratilganda email"""
    logger.info(f"Post bildirishi: {author_email} → {title}")
    await asyncio.sleep(1)
    logger.info(f"Bildirish yuborildi!")

def write_log(action: str, user_id: int, details: str = ""):
    """Faoliyat logi"""
    logger.info(f"LOG: user={user_id} | action={action} | {details}")
```

---

### **app/config.py ga qo'shing:**

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
  

    # Email (ixtiyoriy)
    mail_username: str = ""
    mail_password: str = ""
    mail_from: str = ""
    mail_port: int = 587
    mail_server: str = "smtp.gmail.com"

    @property
    def origins_list(self):
        return [o.strip() for o in self.allowed_origins.split(",")]

    @property
    def is_production(self):
        return self.environment == "production"

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## **8-Qism: Fayl Yuklash (25 daqiqa)**

### **O'rnatish:**

```bash
pip install python-multipart
pip install aiofiles
pip freeze > requirements.txt 
```

---

### **app/routers/upload.py yarating:**

```python
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi import status
import os
import uuid
import aiofiles
from .. import oauth2, models

router = APIRouter(prefix="/upload", tags=["Upload"])

# Fayllar saqlanadigan papka
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Ruxsat etilgan formatlar
ALLOWED_TYPES = {
    "image/jpeg", "image/png",
    "image/gif", "image/webp"
}
MAX_SIZE = 5 * 1024 * 1024   # 5 MB

# ─── RASM YUKLASH ─────────────────────────────
@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    # Format tekshirish
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Faqat rasm formatlar: {ALLOWED_TYPES}"
        )

    # Fayl o'qish
    contents = await file.read()

    # Hajm tekshirish
    if len(contents) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fayl hajmi 5 MB dan oshmasin"
        )

    # Noyob fayl nomi
    extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{extension}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Faylni saqlash
    async with aiofiles.open(filepath, "wb") as f:
        await f.write(contents)

    return {
        "filename": filename,
        "url": f"/uploads/{filename}",
        "size": len(contents),
        "content_type": file.content_type,
        "uploaded_by": current_user.username
    }

# ─── KO'P FAYL YUKLASH ────────────────────────
@router.post("/images")
async def upload_multiple(
    files: list[UploadFile] = File(...),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    if len(files) > 5:
        raise HTTPException(
            status_code=400,
            detail="Bir vaqtda max 5 ta fayl"
        )

    results = []
    for file in files:
        if file.content_type not in ALLOWED_TYPES:
            continue

        contents = await file.read()
        extension = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{extension}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        async with aiofiles.open(filepath, "wb") as f:
            await f.write(contents)

        results.append({
            "filename": filename,
            "url": f"/uploads/{filename}",
            "size": len(contents)
        })

    return {"uploaded": results, "count": len(results)}
```

---

### **Statik fayllarni serve qilish — main.py:**

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

# uploads papkasi yaratish
os.makedirs("uploads", exist_ok=True)

app = FastAPI(...)

# Statik fayllar
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routerlar
app.include_router(upload.router)
```

---

**Test — Swagger UI da:**

```
POST /upload/image
→ "Choose File" tugmasi chiqadi
→ Rasm tanlang → Execute

Javob:
{
  "filename": "abc123.jpg",
  "url": "/uploads/abc123.jpg",
  "size": 245678,
  "content_type": "image/jpeg",
  "uploaded_by": "ali"
}

Brauzerda: http://localhost:8000/uploads/abc123.jpg ✅
```

---

## **9-Qism: Keng Tarqalgan Xatolar (15 daqiqa)**

### **Xato 1: WebSocket 403**

```
WebSocket connection failed: 403 Forbidden
```

**Yechim:**

```python
# CORS WebSocket uchun ham kerak!
# main.py da:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Yoki aniq origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### **Xato 2: WebSocket Already Accepted**

```
RuntimeError: WebSocket is already accepted
```

**Yechim:**

```python
# accept() faqat bir marta chaqirilsin:
async def connect(self, websocket: WebSocket, room: str):
    await websocket.accept()   # ← Faqat shu yerda
    # ... boshqa joylarda chaqirmang
```

---

### **Xato 3: Background Task Ishlamayapti**

```
# Email kelmayapti, log ko'rinmayapti
```

**Yechim:**

```python
# background_tasks.add_task() to'g'ri chaqirilganmi?
background_tasks.add_task(
    send_welcome_email,        # ← Funksiya (qavslar YO'Q!)
    email=new_user.email,      # ← Argumentlar
    username=new_user.username
)
# send_welcome_email()  ← BU NOTO'G'RI (qavslar bilan)
```

---

### **Xato 4: Fayl Yuklashda 422**

```
422 Unprocessable Entity (fayl yuklaganda)
```

**Yechim:**

```
python-multipart o'rnatilganmi?
pip install python-multipart

Swagger da:
Content-Type: multipart/form-data (avtomatik)
```

---

### **Xato 5: aiofiles Topilmadi**

```
ModuleNotFoundError: No module named 'aiofiles'
```

**Yechim:**

```bash
pip install aiofiles
```

---

### **Xato 6: StaticFiles Directory Yo'q**

```
RuntimeError: Directory 'uploads' does not exist
```

**Yechim:**

```python
import os
os.makedirs("uploads", exist_ok=True)
# app.mount() dan OLDIN yaratish kerak!
```

---

## **13-14 Kun Xulosasi**

### **Nima O'rgandik:**

✅ WebSocket nima va HTTP dan farqi

✅ FastAPI da WebSocket endpoint

✅ `ConnectionManager` — ko'p foydalanuvchi

✅ Xonalar (rooms) tizimi

✅ Broadcast — barchaga yuborish

✅ JWT bilan WebSocket himoyasi

✅ Real-time chat UI (HTML/JS)

✅ Background Tasks nima va nima uchun

✅ `BackgroundTasks` — fonda vazifa

✅ Email yuborish (simulyatsiya + haqiqiy)

✅ Fayl yuklash (`UploadFile`)

✅ Ko'p fayl yuklash

✅ Statik fayllarni serve qilish

✅ Keng tarqalgan xatolar

---

## **Amaliy Mashqlar**

### **1. Yozmoqda Bildirishi**

```python
# Chat da "Ali yozmoqda..." bildirishi
# Client JSON yuborsin:
# {"type": "typing", "username": "Ali"}
# Server boshqalarga yuborsin
```

---

### **2. Xona Tarixi**

```python
# DB da xabarlarni saqlash:
class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    room = Column(String(100))
    username = Column(String(100))
    content = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

# GET /ws/rooms/{room}/history → Oxirgi 50 xabar
```

---

### **3. Avatar Yuklash**

```python
# User avatar yuklash:
@router.post("/upload/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    # Faylni saqlash
    # User modeliga avatar_url saqlash
    pass
```

---

## **Uy Vazifasi**

### **1. Xususiy Xabar (DM)**

```python
# Bitta odamga xabar yuborish:
@router.websocket("/ws/dm/{target_user_id}")
async def direct_message(
    websocket: WebSocket,
    target_user_id: int,
    token: str = Query(...)
):
    # Faqat ikki kishi o'rtasida
    pass
```

---

### **2. Online Foydalanuvchilar**

```python
# GET /ws/online → Hozir kim online?
@router.get("/ws/online")
def get_online_users():
    # manager.active_connections dan olish
    pass
```

---

### **3. Fayl Turi Kengaytirish**

```python
# PDF va video ham qabul qilsin:
ALLOWED_TYPES = {
    "image/jpeg", "image/png",
    "application/pdf",
    "video/mp4"
}
MAX_SIZES = {
    "image": 5 * 1024 * 1024,    # 5 MB
    "application": 20 * 1024 * 1024,  # 20 MB
    "video": 100 * 1024 * 1024   # 100 MB
}
```

---

## **Foydali Buyruqlar:**

```bash
# Serverni ishga tushirish
python -m uvicorn app.main:app --reload

# WebSocket test (wscat bilan)
npm install -g wscat
wscat -c ws://localhost:8000/ws

# Fayl yuklash (curl bilan)
curl -X POST http://localhost:8000/upload/image \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@rasm.jpg"

# Yuklangan fayllarni ko'rish
ls uploads/
```

---

## **Keyingi Darsda:**

**FastAPI 15-16 Kun: Redis va Caching**

- Redis nima?
- O'rnatish va sozlash
- Cache nima uchun kerak?
- FastAPI da Redis
- So'rovlarni keshlash
- Session saqlash
- Rate limiting (Redis bilan)
- Cache invalidation

**Ilovani 10x tezlashtirish!** ⚡🔴

---

**Jami vaqt:** 5-6 soat tanaffuslar bilan

**Esda tuting:** WebSocket — real-time kelajak! Background Tasks — foydalanuvchi vaqtini hurmat qilish! ⚡🔌

---

> **Navigatsiya:** [⬅️ 11-12 Kun (Pytest bilan Testing)](11-12-kun-pytest-bilan-testing.md) | [📋 Kurs Mundarijasi](00-darslik-haqida-va-mundarija.md) | [Keyingi dars: 15-16 Kun (Redis va Caching) ➡️](15-16-kun-redis-va-caching.md)
