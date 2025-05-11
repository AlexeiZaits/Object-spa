from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from aiogram import Bot

BOT_TOKEN = ""
CHAT_ID = ""

bot = Bot(token=BOT_TOKEN)

app = FastAPI(root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/send")
async def send_to_telegram(request: Request):
    data = await request.json()
    name = data.get("name", "Не указано")
    phone = data.get("phone", "Не указано")
    programms = data.get("programms", "Не указано")

    message = (
        f"<b>Новая заявка:</b>\n"
        f"👤 Имя: {name}\n"
        f"📞 Телефон: {phone}\n"
        f"📚 Программа: {programms}"
    )

    await bot.send_message(chat_id=CHAT_ID, text=message, parse_mode="HTML")
    return {"status": "ok"}

@app.get("/ping")
async def ping():
    return {"status": "ok"}