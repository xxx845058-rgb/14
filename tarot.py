from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import os
from datetime import datetime

from models.tarot import (
    ReadingGenerateRequest, 
    ReadingGenerateResponse,
    ReadingSaveRequest,
    RandomCardsRequest,
    Reading,
    ReadingHistoryResponse,
    TarotCard
)
from services.ai_service import AITarotService
from services.tarot_service import TarotService

router = APIRouter(prefix="/api/reading", tags=["tarot"])

# Dependency для получения базы данных
def get_database():
    from motor.motor_asyncio import AsyncIOMotorClient
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    return client[os.environ['DB_NAME']]

@router.post("/generate", response_model=ReadingGenerateResponse)
async def generate_reading(request: ReadingGenerateRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Генерирует AI предсказание на основе карт"""
    try:
        ai_service = AITarotService()
        
        # Преобразуем данные в TarotCard объекты
        cards = [TarotCard(**card.dict()) for card in request.cards]
        
        # Генерируем AI предсказание
        ai_result = await ai_service.generate_reading(
            cards=cards,
            spread_type=request.spread_type,
            question=request.question
        )
        
        return ReadingGenerateResponse(
            interpretation=ai_result["interpretation"],
            advice=ai_result["advice"]
        )
        
    except Exception as e:
        print(f"Ошибка генерации предсказания: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка генерации предсказания: {str(e)}")

@router.post("/save")
async def save_reading(request: ReadingSaveRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Сохраняет гадание в истории"""
    try:
        reading = Reading(
            session_id=request.user_session,
            spread_type=request.spread_type,
            question=request.question,
            cards=[card.dict() for card in request.cards],
            interpretation=request.interpretation,
            created_at=datetime.utcnow()
        )
        
        # Сохраняем в MongoDB
        await db.readings.insert_one(reading.dict())
        
        return {"message": "Гадание сохранено", "reading_id": reading.id}
        
    except Exception as e:
        print(f"Ошибка сохранения гадания: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка сохранения гадания: {str(e)}")

@router.get("/history", response_model=ReadingHistoryResponse)
async def get_reading_history(session: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Получает историю гаданий пользователя"""
    try:
        cursor = db.readings.find({"session_id": session}).sort("created_at", -1).limit(50)
        readings_data = await cursor.to_list(length=50)
        
        readings = []
        for reading_data in readings_data:
            # Преобразуем ObjectId в строку для _id поля
            if "_id" in reading_data:
                del reading_data["_id"]
            readings.append(Reading(**reading_data))
        
        return ReadingHistoryResponse(readings=readings)
        
    except Exception as e:
        print(f"Ошибка загрузки истории: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка загрузки истории: {str(e)}")

# Роутер для карт
cards_router = APIRouter(prefix="/api/cards", tags=["cards"])

@cards_router.post("/random")
async def get_random_cards(request: RandomCardsRequest):
    """Получает случайные карты для расклада"""
    try:
        tarot_service = TarotService()
        cards = tarot_service.get_random_cards(request.count, request.spread_type)
        
        # Назначаем позиции
        cards = tarot_service.assign_positions(cards, request.spread_type)
        
        return {"cards": [card.dict() for card in cards]}
        
    except Exception as e:
        print(f"Ошибка получения карт: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка получения карт: {str(e)}")