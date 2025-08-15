# API Контракты для 3D Таро Приложения

## Обзор интеграции

Фронтенд с мок-данными готов и протестирован. Теперь нужно создать backend с AI интеграцией для:
- Персонализированных предсказаний через AI
- Сохранения истории гаданий пользователей
- Обработки различных типов раскладов

## A) API Контракты

### 1. Генерация AI предсказания
**Endpoint**: `POST /api/reading/generate`

**Request Body**:
```json
{
  "spread_type": "three|single|celtic|daily|weekly|love",
  "question": "string (optional)",
  "cards": [
    {
      "id": 1,
      "name": "Шут",
      "arcana": "major",
      "keywords": ["новое начало", "спонтанность"],
      "reversed": false,
      "position": "Прошлое"
    }
  ]
}
```

**Response**:
```json
{
  "interpretation": "Детальная AI интерпретация карт",
  "advice": "Советы от AI на основе расклада",
  "reading_id": "uuid"
}
```

### 2. Сохранение гадания
**Endpoint**: `POST /api/reading/save`

**Request Body**:
```json
{
  "spread_type": "string",
  "question": "string",
  "cards": [карты с позициями],
  "interpretation": "string",
  "user_session": "string (для идентификации пользователя)"
}
```

### 3. История гаданий
**Endpoint**: `GET /api/reading/history?session={session_id}`

**Response**:
```json
{
  "readings": [
    {
      "id": "uuid",
      "date": "2024-01-15",
      "spread_type": "three",
      "question": "string",
      "cards": [карты],
      "interpretation": "string"
    }
  ]
}
```

### 4. Получить случайные карты
**Endpoint**: `POST /api/cards/random`

**Request Body**:
```json
{
  "count": 3,
  "spread_type": "three"
}
```

## B) Мок-данные для замены

В файле `mockTarotData.js` заменить:
- `generateMockReading()` -> API вызов к `/api/reading/generate`
- Сохранение в localStorage -> API вызов к `/api/reading/save`
- Загрузка из localStorage -> API вызов к `/api/reading/history`

## C) Backend Implementation План

### 1. Database Models
- **Reading**: id, session_id, spread_type, question, cards (JSON), interpretation, created_at
- **Card**: id, name, arcana, image_url, keywords, upright_meaning, reversed_meaning

### 2. AI Integration
- Использовать Emergent LLM key
- Создать промпт-шаблоны для разных типов раскладов
- Персонализировать интерпретации на основе вопроса

### 3. Services
- TarotService: логика гадания и интерпретации
- AIService: интеграция с LLM для генерации предсказаний
- CardService: работа с базой карт

## D) Frontend & Backend Integration

### Замена в компонентах:
1. `TarotSpread.jsx`:
   - Заменить `generateMockReading()` на API вызов
   - Добавить loading states для AI генерации
   - Показывать прогресс генерации предсказания

2. `TarotApp.jsx`:
   - Заменить localStorage логику на API вызовы
   - Добавить session management
   - Обработка ошибок API

3. `ReadingHistory.jsx`:
   - Загрузка истории через API
   - Пагинация для большого количества гаданий

### Новые состояния loading:
- Генерация AI предсказания (5-10 сек)
- Сохранение гадания
- Загрузка истории

## E) Технические детали

### AI Промпты:
- Создать шаблоны для каждого типа расклада
- Учитывать перевёрнутые карты
- Персонализировать на основе вопроса пользователя

### Error Handling:
- AI недоступен -> fallback на традиционные значения
- Сетевые ошибки
- Валидация входных данных

### Performance:
- Кэширование базовых значений карт
- Оптимизация AI запросов
- Сжатие изображений карт

Этот план обеспечит плавную интеграцию AI функций с существующим 3D интерфейсом.