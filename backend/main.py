import os
import base64
import json
import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from google.cloud import aiplatform

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vertex AI credentials setup on startup
@app.on_event("startup")
async def startup_event():
    if os.environ.get('GOOGLE_SERVICE_ACCOUNT_KEY'):
        key_content = base64.b64decode(os.environ.get('GOOGLE_SERVICE_ACCOUNT_KEY')).decode('utf-8')
        key_path = '/app/service-account-key.json'
        with open(key_path, 'w') as f:
            f.write(key_content)
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = key_path
        print(f"Service account credentials configured at {key_path}")
    else:
        print("WARNING: No GOOGLE_SERVICE_ACCOUNT_KEY found in environment")

# Streaming response endpoint
@app.post("/copilot/stream")
async def stream_copilot_response(request: Request):
    request_data = await request.json()
    user_message = request_data.get("message", "")

    async def generate():
        try:
            aiplatform.init(project="argos-454318")
            parameters = {
                "temperature": 0.7,
                "max_output_tokens": 1024,
                "top_p": 0.8,
                "top_k": 40
            }
            model = aiplatform.ChatModel.from_pretrained("chat-bison@002")
            chat = model.start_chat()
            response = await asyncio.to_thread(chat.send_message, user_message, **parameters)
            full_text = response.text
            chunks = []
            current_chunk = ""
            for char in full_text:
                current_chunk += char
                if char in ['.', '!', '?'] or len(current_chunk) > 80:
                    if current_chunk.strip():
                        chunks.append(current_chunk)
                    current_chunk = ""
            if current_chunk.strip():
                chunks.append(current_chunk)
            for chunk in chunks:
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                await asyncio.sleep(0.05)
            yield "data: [DONE]\n\n"
        except Exception as e:
            print(f"Streaming error: {str(e)}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
