import os
from emergentintegrations.llm.chat import LlmChat, UserMessage
from dotenv import load_dotenv
import uuid
from typing import List, Dict
from models.tarot import TarotCard

load_dotenv()

class AITarotService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY не найден в переменных окружения")
    
    def _get_spread_prompt(self, spread_type: str, question: str = None) -> str:
        """Создает промпт на основе типа расклада"""
        base_prompt = """Ты - опытный мастер Таро с глубокими знаниями символики карт и многолетним опытом интерпретации. 
        Твоя задача - дать вдумчивое, точное и практичное предсказание на основе выпавших карт.
        
        Учитывай:
        - Традиционные значения каждой карты
        - Влияние перевёрнутых карт
        - Взаимодействие карт между собой
        - Контекст заданного вопроса
        - Позицию каждой карты в раскладе
        
        Отвечай на русском языке, создавая связное, вдохновляющее предсказание."""
        
        spread_prompts = {
            "single": "Дай интерпретацию одной карты как ответа на вопрос.",
            "daily": "Интерпретируй карту дня, фокусируясь на энергиях и событиях предстоящего дня.",
            "three": "Проанализируй расклад 'Три карты' (Прошлое-Настоящее-Будущее), показав развитие ситуации во времени.",
            "love": "Дай интерпретацию любовного расклада, анализируя чувства, препятствия и перспективы отношений.",
            "weekly": "Проанализируй недельный расклад, дав краткий прогноз для каждого дня недели.",
            "celtic": "Дай полную интерпретацию Кельтского креста - самого глубокого и информативного расклада Таро."
        }
        
        specific_prompt = spread_prompts.get(spread_type, spread_prompts["single"])
        
        if question:
            return f"{base_prompt}\n\nВопрос: {question}\n\n{specific_prompt}"
        else:
            return f"{base_prompt}\n\n{specific_prompt}"
    
    def _format_cards_info(self, cards: List[TarotCard]) -> str:
        """Форматирует информацию о картах для AI"""
        cards_info = "Выпавшие карты:\n\n"
        
        for i, card in enumerate(cards, 1):
            position_info = f" ({card.position})" if card.position else ""
            reversed_info = " (перевёрнутая)" if card.reversed else ""
            
            cards_info += f"{i}. {card.name}{position_info}{reversed_info}\n"
            cards_info += f"   Ключевые слова: {', '.join(card.keywords)}\n"
            
            if card.reversed:
                cards_info += f"   Значение: {card.reversed_meaning}\n\n"
            else:
                cards_info += f"   Значение: {card.upright_meaning}\n\n"
        
        return cards_info
    
    async def generate_reading(self, cards: List[TarotCard], spread_type: str, question: str = None) -> Dict[str, str]:
        """Генерирует AI предсказание на основе карт"""
        try:
            session_id = f"tarot_reading_{uuid.uuid4()}"
            
            system_message = self._get_spread_prompt(spread_type, question)
            cards_info = self._format_cards_info(cards)
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("openai", "gpt-4o-mini")
            
            user_message = UserMessage(
                text=f"""
                {cards_info}
                
                Пожалуйста, дай детальную интерпретацию этого расклада. Структурируй ответ следующим образом:
                
                ИНТЕРПРЕТАЦИЯ:
                [Подробный анализ карт и их взаимодействия, учитывающий позиции и вопрос]
                
                СОВЕТ:
                [Практические рекомендации и советы на основе полученной информации]
                
                Говори доброжелательно, но честно. Избегай слишком общих фраз, фокусируйся на конкретной ситуации.
                """
            )
            
            response = await chat.send_message(user_message)
            
            # Парсим ответ на интерпретацию и совет
            response_text = str(response)
            
            if "ИНТЕРПРЕТАЦИЯ:" in response_text and "СОВЕТ:" in response_text:
                parts = response_text.split("СОВЕТ:")
                interpretation = parts[0].replace("ИНТЕРПРЕТАЦИЯ:", "").strip()
                advice = parts[1].strip()
            else:
                # Если AI не следовал формату, используем весь ответ как интерпретацию
                interpretation = response_text
                advice = "Доверьтесь своей интуиции и используйте полученную информацию для принятия осознанных решений."
            
            return {
                "interpretation": interpretation,
                "advice": advice
            }
            
        except Exception as e:
            print(f"Ошибка генерации AI предсказания: {e}")
            # Fallback на базовую интерпретацию
            return {
                "interpretation": "Карты указывают на важный период в вашей жизни. Доверьтесь своей интуиции и будьте открыты к переменам.",
                "advice": "Помните, что карты Таро - это инструмент для самопознания. Используйте их мудрость для принятия осознанных решений."
            }