from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_model import AdvancedMentalHealthBot
import uvicorn

app = FastAPI(title="Advanced Mental Health Chatbot API")

# CORS for React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize advanced model
print("🚀 Starting advanced chatbot API...")
bot = AdvancedMentalHealthBot()

try:
    bot.load()
    print("✅ Advanced model loaded successfully!")
except Exception as e:
    print(f"⚠️ No model found. Please train first with: python train_advanced.py")
    print(f"Error: {e}")
    bot = None

class ChatRequest(BaseModel):
    message: str
    reset: bool = False

class ChatResponse(BaseModel):
    reply: str
    emotion: str
    subcategory: str
    severity: str
    confidence: float

@app.get("/")
def root():
    return {
        "message": "Advanced Mental Health Chatbot API",
        "status": "running",
        "version": "2.0",
        "features": [
            "Semantic understanding",
            "Severity detection",
            "Subcategory classification",
            "Conversation memory",
            "Crisis detection"
        ]
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if bot is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Reset conversation if requested
    if request.reset:
        bot.reset_conversation()
    
    try:
        response = bot.get_response(request.message)
        return ChatResponse(
            reply=response["reply"],
            emotion=response["emotion"],
            subcategory=response["subcategory"],
            severity=response["severity"],
            confidence=response["confidence"]
        )
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    if bot:
        return {
            "status": "healthy",
            "examples": len(bot.texts) if bot.texts else 0,
            "conversation_length": len(bot.conversation_history)
        }
    else:
        return {"status": "unhealthy", "reason": "model not loaded"}

@app.post("/reset")
def reset_conversation():
    if bot:
        bot.reset_conversation()
        return {"message": "Conversation reset successfully"}
    raise HTTPException(status_code=503, detail="Model not loaded")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)