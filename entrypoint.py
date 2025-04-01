
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from vertexai.language_models import ChatModel
from pydantic import BaseModel
import vertexai

key_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
vertexai.init(project="argos-454318", location="us-central1")

chat_model = ChatModel.from_pretrained("chat-bison@002")
chat = chat_model.start_chat()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/", StaticFiles(directory="static", html=True), name="static")

class TranscodeRequest(BaseModel):
    input_code: str
    source_lang: str
    target_lang: str

@app.post("/transcode")
async def transcode(req: TranscodeRequest):
    prompt = f"Translate this code from {req.source_lang} to {req.target_lang}:

{req.input_code}"
    response = chat.send_message(prompt)
    return {"result": response.text}
