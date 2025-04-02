
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import requests
import vertexai
from vertexai.language_models import ChatModel
from google.oauth2 import service_account

app = FastAPI()

# Enable CORS (restrict this later in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model for the incoming prompt
class PromptRequest(BaseModel):
    prompt: str

# Health check endpoint
@app.get("/health")
def health():
    return {"status": "ARGOS backend is live ✅"}

# Copilot route using Vertex AI
@app.post("/copilot")
def copilot(req: PromptRequest):
    # Set credentials path, default to /app/credentials.json
    creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "/app/credentials.json")
    creds = service_account.Credentials.from_service_account_file(creds_path)
    
    # Initialize Vertex AI
    vertexai.init(project="argos-454318", location="us-central1", credentials=creds)
    
    # Load the chat model
    chat_model = ChatModel.from_pretrained("chat-bison@002")
    chat = chat_model.start_chat()
    
    # Send message to Copilot
    response = chat.send_message(req.prompt)
    
    return {"response": response.text}

