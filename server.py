from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Импортируем роутеры
from routes.tarot import router as tarot_router, cards_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="3D Tarot API", version="1.0.0")

# Create a router with the /api prefix for basic endpoints
api_router = APIRouter(prefix="/api")

# Add basic hello endpoint
@api_router.get("/")
async def root():
    return {"message": "3D Tarot API v1.0 с AI предсказаниями"}

@api_router.get("/health")
async def health_check():
    return {"status": "ok", "message": "API работает"}

# Include routers
app.include_router(api_router)
app.include_router(tarot_router)
app.include_router(cards_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("3D Tarot API запущено с AI интеграцией")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()