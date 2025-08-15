// Мок-данные для таро карт и предсказаний

export const tarotCards = [
  {
    id: 1,
    name: "Шут",
    arcana: "major",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center",
    keywords: ["новое начало", "спонтанность", "свобода"],
    uprightMeaning: "Новые начинания, спонтанность, свобода духа",
    reversedMeaning: "Безрассудство, наивность, отсутствие планов"
  },
  {
    id: 2,
    name: "Маг",
    arcana: "major", 
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=600&fit=crop&crop=center",
    keywords: ["сила воли", "творчество", "навыки"],
    uprightMeaning: "Сила воли, творческая энергия, умения",
    reversedMeaning: "Неиспользованный потенциал, обман, манипуляции"
  },
  {
    id: 3,
    name: "Жрица",
    arcana: "major",
    image: "https://images.unsplash.com/photo-1532618793091-ec5fe9635fbd?w=400&h=600&fit=crop&crop=center", 
    keywords: ["интуиция", "тайна", "женская мудрость"],
    uprightMeaning: "Интуиция, внутренняя мудрость, тайные знания",
    reversedMeaning: "Игнорирование интуиции, секреты, поверхностность"
  },
  {
    id: 4,
    name: "Императрица",
    arcana: "major",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=center",
    keywords: ["материнство", "плодородие", "изобилие"],
    uprightMeaning: "Материнство, творчество, изобилие природы",
    reversedMeaning: "Зависимость, пустота, бесплодие"
  },
  {
    id: 5,
    name: "Император", 
    arcana: "major",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
    keywords: ["авторитет", "структура", "защита"],
    uprightMeaning: "Авторитет, стабильность, защита",
    reversedMeaning: "Тирания, негибкость, отсутствие дисциплины"
  },
  {
    id: 6,
    name: "Иерофант",
    arcana: "major", 
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center",
    keywords: ["духовность", "традиции", "обучение"],
    uprightMeaning: "Духовное руководство, традиции, образование",
    reversedMeaning: "Догматизм, конформизм, ограниченность"
  },
  {
    id: 7,
    name: "Влюбленные",
    arcana: "major",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=center",
    keywords: ["любовь", "выбор", "гармония"],
    uprightMeaning: "Любовь, партнерство, важный выбор",
    reversedMeaning: "Дисгармония, неправильный выбор, расставание"
  },
  {
    id: 8,
    name: "Колесница",
    arcana: "major",
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=600&fit=crop&crop=center",
    keywords: ["контроль", "победа", "целеустремленность"],
    uprightMeaning: "Контроль, триумф, преодоление препятствий",
    reversedMeaning: "Отсутствие контроля, поражение, агрессия"
  }
];

export const spreadTypes = [
  {
    id: "single",
    name: "Одна карта",
    description: "Простой ответ на ваш вопрос",
    positions: 1,
    layout: "single"
  },
  {
    id: "three", 
    name: "Три карты",
    description: "Прошлое, настоящее, будущее",
    positions: 3,
    layout: "horizontal",
    positionNames: ["Прошлое", "Настоящее", "Будущее"]
  },
  {
    id: "celtic",
    name: "Кельтский крест",
    description: "Полный анализ ситуации",
    positions: 10,
    layout: "cross",
    positionNames: [
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
  },
  {
    id: "daily",
    name: "Карта дня",
    description: "Энергии и события сегодня",
    positions: 1,
    layout: "single"
  },
  {
    id: "weekly",
    name: "Расклад на неделю", 
    description: "Энергии каждого дня недели",
    positions: 7,
    layout: "weekly",
    positionNames: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
  },
  {
    id: "love",
    name: "Расклад на отношения",
    description: "Анализ любовной ситуации", 
    positions: 5,
    layout: "love",
    positionNames: ["Ваши чувства", "Чувства партнёра", "Препятствия", "Совет", "Исход"]
  }
];

export const mockReadings = [
  {
    id: "1",
    date: "2024-01-15",
    spreadType: "three",
    question: "Как развиваются мои отношения?",
    cards: [
      { ...tarotCards[0], position: "past", reversed: false },
      { ...tarotCards[3], position: "present", reversed: true },  
      { ...tarotCards[6], position: "future", reversed: false }
    ],
    interpretation: "Ваши отношения начались спонтанно и искренне (Шут). В настоящий момент чувствуется некоторое отстранение и холодность (обратная Императрица). Однако будущее обещает гармонию и глубокую связь (Влюбленные)."
  }
];

// Функция для получения случайных карт
export const getRandomCards = (count) => {
  const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => ({
    ...card,
    reversed: Math.random() < 0.3 // 30% шанс перевернутой карты
  }));
};

// Мок функция для генерации предсказания
export const generateMockReading = (cards, spreadType, question) => {
  const interpretations = [
    "Карты указывают на время значительных перемен в вашей жизни.",
    "Интуиция будет вашим лучшим проводником в текущей ситуации.",
    "Необходимо проявить терпение - результат придёт в нужное время.",
    "Ваша творческая энергия находится на пике, используйте её.",
    "Прошлые уроки помогут вам принять правильное решение.",
    "Доверьтесь процессу - Вселенная работает в вашу пользу."
  ];
  
  const randomInterpretation = interpretations[Math.floor(Math.random() * interpretations.length)];
  
  return {
    cards,
    interpretation: randomInterpretation,
    advice: "Помните, что карты Таро - это инструмент самопознания. Используйте их мудрость для принятия осознанных решений."
  };
};