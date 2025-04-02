
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

# Restart the backend service via Fly.io
@app.post("/restart")
def restart():
    try:
        # Fetch environment variables for Fly.io
        fly_app = os.getenv("FLY_APP_NAME", "argos-backend-self-builder")
        machine_id = os.getenv("FLY_MACHINE_ID")
        fly_token = os.getenv("FLY_API_TOKEN")

        if not machine_id or not fly_token:
            return JSONResponse(status_code=500, content={"error": "Missing machine ID or token"})

        # Fly.io API request for restarting the machine
        url = f"https://api.machines.fly.io/v1/apps/{fly_app}/machines/{machine_id}/restart"
        headers = {
            "Authorization": f"Bearer {fly_token}",
            "Content-Type": "application/json"
        }
        res = requests.post(url, headers=headers)
        
        # Return response from Fly.io restart request
        return {"status": "restarting", "fly_response": res.json()}
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

