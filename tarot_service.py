import random
from typing import List, Dict
from models.tarot import TarotCard

class TarotService:
    def __init__(self):
        self.cards = self._initialize_cards()
    
    def _initialize_cards(self) -> List[Dict]:
        """Инициализация колоды карт Таро"""
        return [
            {
                "id": 1,
                "name": "Шут",
                "arcana": "major",
                "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center",
                "keywords": ["новое начало", "спонтанность", "свобода"],
                "upright_meaning": "Новые начинания, спонтанность, свобода духа, чистый потенциал",
                "reversed_meaning": "Безрассудство, наивность, отсутствие планов, легкомыслие"
            },
            {
                "id": 2,
                "name": "Маг",
                "arcana": "major",
                "image": "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=600&fit=crop&crop=center",
                "keywords": ["сила воли", "творчество", "навыки"],
                "upright_meaning": "Сила воли, творческая энергия, умения, проявление намерений",
                "reversed_meaning": "Неиспользованный потенциал, обман, манипуляции, самомнение"
            },
            {
                "id": 3,
                "name": "Жрица",
                "arcana": "major",
                "image": "https://images.unsplash.com/photo-1532618793091-ec5fe9635fbd?w=400&h=600&fit=crop&crop=center",
                "keywords": ["интуиция", "тайна", "женская мудрость"],
                "upright_meaning": "Интуиция, внутренняя мудрость, тайные знания, духовность",
                "reversed_meaning": "Игнорирование интуиции, секреты, поверхностность, разобщённость"
            },
            {
                "id": 4,
                "name": "Императрица",
                "arcana": "major",
                "image": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=center",
                "keywords": ["материнство", "плодородие", "изобилие"],
                "upright_meaning": "Материнство, творчество, изобилие природы, плодородность",
                "reversed_meaning": "Зависимость, пустота, бесплодие, блокировка творчества"
            },
            {
                "id": 5,
                "name": "Император",
                "arcana": "major",
                "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
                "keywords": ["авторитет", "структура", "защита"],
                "upright_meaning": "Авторитет, стабильность, защита, лидерство",
                "reversed_meaning": "Тирания, негибкость, отсутствие дисциплины, злоупотребление властью"
            },
            {
                "id": 6,
                "name": "Иерофант",
                "arcana": "major",
                "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center",
                "keywords": ["духовность", "традиции", "обучение"],
                "upright_meaning": "Духовное руководство, традиции, образование, институциональность",
                "reversed_meaning": "Догматизм, конформизм, ограниченность, бунт против системы"
            },
            {
                "id": 7,
                "name": "Влюбленные",
                "arcana": "major",
                "image": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=center",
                "keywords": ["любовь", "выбор", "гармония"],
                "upright_meaning": "Любовь, партнерство, важный выбор, гармония отношений",
                "reversed_meaning": "Дисгармония, неправильный выбор, расставание, конфликт ценностей"
            },
            {
                "id": 8,
                "name": "Колесница",
                "arcana": "major",
                "image": "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=600&fit=crop&crop=center",
                "keywords": ["контроль", "победа", "целеустремленность"],
                "upright_meaning": "Контроль, триумф, преодоление препятствий, направленная энергия",
                "reversed_meaning": "Отсутствие контроля, поражение, агрессия, отсутствие направления"
            },
            {
                "id": 9,
                "name": "Сила",
                "arcana": "major",
                "image": "https://images.unsplash.com/photo-1532618793091-ec5fe9635fbd?w=400&h=600&fit=crop&crop=center",
                "keywords": ["внутренняя сила", "терпение", "сострадание"],
                "upright_meaning": "Внутренняя сила, терпение, сострадание, контроль над эмоциями",
                "reversed_meaning": "Слабость, неуверенность, злоупотребление силой, потеря контроля"
            },
            {
                "id": 10,
                "name": "Отшельник",
                "arcana": "major",
                "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
                "keywords": ["поиск истины", "одиночество", "мудрость"],
                "upright_meaning": "Поиск истины, внутренняя мудрость, одиночество как путь к себе",
                "reversed_meaning": "Изоляция, одиночество как бегство, отказ от помощи, заблуждения"
            }
        ]
    
    def get_random_cards(self, count: int, spread_type: str = None) -> List[TarotCard]:
        """Получает случайные карты из колоды"""
        shuffled_cards = random.sample(self.cards, count)
        
        result = []
        for card_data in shuffled_cards:
            card = TarotCard(**card_data)
            # 30% шанс перевернутой карты
            card.reversed = random.random() < 0.3
            result.append(card)
        
        return result
    
    def get_position_names(self, spread_type: str, count: int) -> List[str]:
        """Возвращает названия позиций для разных раскладов"""
        positions = {
            "single": ["Ответ"],
            "daily": ["Карта дня"],
            "three": ["Прошлое", "Настоящее", "Будущее"],
            "love": ["Ваши чувства", "Чувства партнёра", "Препятствия", "Совет", "Исход"],
            "weekly": ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
            "celtic": [
                "Текущая ситуация",
                "Препятствие/Помощь",
                "Далёкое прошлое",
                "Недавнее прошлое",
                "Возможное будущее",
                "Ближайшее будущее",
                "Ваш подход",
                "Внешние влияния",
                "Надежды и страхи",
                "Итоговый результат"
            ]
        }
        
        return positions.get(spread_type, [f"Позиция {i+1}" for i in range(count)])
    
    def assign_positions(self, cards: List[TarotCard], spread_type: str) -> List[TarotCard]:
        """Назначает позиции картам в раскладе"""
        positions = self.get_position_names(spread_type, len(cards))
        
        for i, card in enumerate(cards):
            if i < len(positions):
                card.position = positions[i]
        
        return cards