import React, { useState, useEffect } from 'react';
import TarotCard from './TarotCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Shuffle, Eye, RotateCcw, Sparkles } from 'lucide-react';
import { generateMockReading } from '../data/mockTarotData';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TarotSpread = ({ 
  spreadType, 
  spreadTypes, 
  onBack,
  onSaveReading 
}) => {
  const [question, setQuestion] = useState('');
  const [cards, setCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState(new Set());
  const [isShuffling, setIsShuffling] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [reading, setReading] = useState(null);
  const [allRevealed, setAllRevealed] = useState(false);
  const { toast } = useToast();

  const spread = spreadTypes.find(s => s.id === spreadType);

  useEffect(() => {
    if (spread) {
      shuffleCards();
    }
  }, [spreadType]);

  const shuffleCards = async () => {
    setIsShuffling(true);
    setRevealedCards(new Set());
    setReading(null);
    setAllRevealed(false);
    
    try {
      // Получаем карты через API
      const response = await axios.post(`${API_BASE}/cards/random`, {
        count: spread.positions,
        spread_type: spreadType
      });
      
      setCards(response.data.cards);
    } catch (error) {
      console.error('Ошибка получения карт:', error);
      toast({
        title: "⚠️ Ошибка",
        description: "Не удалось получить карты. Используем резервные данные.",
        variant: "destructive"
      });
      
      // Fallback на мок-данные
      const mockCards = generateMockReading([], spreadType, question);
      setCards(mockCards.cards);
    } finally {
      setIsShuffling(false);
    }
  };

  const generateAIReading = async () => {
    if (!cards.length) return;
    
    setIsGeneratingAI(true);
    
    try {
      const response = await axios.post(`${API_BASE}/reading/generate`, {
        spread_type: spreadType,
        question: question || undefined,
        cards: cards
      });
      
      setReading({
        interpretation: response.data.interpretation,
        advice: response.data.advice
      });
      
      toast({
        title: "✨ Предсказание готово!",
        description: "ИИ создал персональную интерпретацию ваших карт.",
      });
      
    } catch (error) {
      console.error('Ошибка генерации AI предсказания:', error);
      
      toast({
        title: "⚠️ Проблема с ИИ",
        description: "Используем традиционную интерпретацию карт.",
        variant: "destructive"
      });
      
      // Fallback на мок-данные
      const mockReading = generateMockReading(cards, spreadType, question);
      setReading(mockReading);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const revealCard = (index) => {
    if (allRevealed || revealedCards.has(index)) return;
    
    const newRevealed = new Set(revealedCards);
    newRevealed.add(index);
    setRevealedCards(newRevealed);

    if (newRevealed.size === spread.positions) {
      setAllRevealed(true);
      setTimeout(() => {
        generateAIReading();
      }, 1000);
    }
  };

  const revealAllCards = () => {
    const allIndexes = new Set(Array.from({length: spread.positions}, (_, i) => i));
    setRevealedCards(allIndexes);
    setAllRevealed(true);
    
    setTimeout(() => {
      generateAIReading();
    }, 1000);
  };

  const getSpreadLayout = () => {
    switch (spread.layout) {
      case 'single':
        return 'grid grid-cols-1 place-items-center gap-8';
      case 'horizontal':
        return 'grid grid-cols-3 gap-8 justify-items-center';
      case 'cross':
        return 'grid grid-cols-4 gap-4 max-w-3xl mx-auto';
      case 'weekly':
        return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4';
      case 'love':
        return 'grid grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center';
      default:
        return 'grid grid-cols-3 gap-6';
    }
  };

  const getCardPosition = (index) => {
    if (!spread.positionNames) return null;
    return spread.positionNames[index];
  };

  const handleSaveReading = async () => {
    if (!reading) return;
    
    try {
      // Генерируем или получаем session ID
      let sessionId = localStorage.getItem('tarot_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('tarot_session_id', sessionId);
      }
      
      // Сохраняем через API
      await axios.post(`${API_BASE}/reading/save`, {
        spread_type: spreadType,
        question: question || "Общий вопрос",
        cards: cards,
        interpretation: reading.interpretation,
        user_session: sessionId
      });
      
      // Обновляем локальные данные для истории
      const readingData = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        spread_type: spreadType,
        question: question || "Общий вопрос",
        cards: cards.map((card, index) => ({
          ...card,
          position: getCardPosition(index)
        })),
        interpretation: reading.interpretation
      };
      
      if (onSaveReading) {
        onSaveReading(readingData);
      }
      
      toast({
        title: "💾 Гадание сохранено!",
        description: "Ваше предсказание добавлено в историю.",
      });
      
    } catch (error) {
      console.error('Ошибка сохранения гадания:', error);
      toast({
        title: "⚠️ Ошибка сохранения",
        description: "Не удалось сохранить гадание. Попробуйте позже.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="mb-4 border-purple-400/50 text-purple-300 hover:bg-purple-600/20"
        >
          ← Назад к выбору расклада
        </Button>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 bg-clip-text text-transparent mb-2">
          {spread.name}
        </h2>
        <p className="text-purple-200 text-lg">{spread.description}</p>
      </div>

      {/* Поле для вопроса */}
      <Card className="mb-8 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-purple-600/30">
        <CardHeader>
          <CardTitle className="text-white text-center">Сосредоточьтесь на своём вопросе</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Введите ваш вопрос для карт Таро (необязательно)..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="bg-purple-900/20 border-purple-400/30 text-white placeholder:text-purple-300/60 min-h-20"
          />
        </CardContent>
      </Card>

      {/* Кнопки управления */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Button
          onClick={shuffleCards}
          disabled={isShuffling}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          {isShuffling ? 'Перемешиваю...' : 'Перетасовать карты'}
        </Button>
        
        {cards.length > 0 && !allRevealed && (
          <Button
            onClick={revealAllCards}
            variant="outline"
            className="border-purple-400/50 text-purple-300 hover:bg-purple-600/20 px-6 py-2"
          >
            <Eye className="w-4 h-4 mr-2" />
            Открыть все карты
          </Button>
        )}

        {allRevealed && (
          <Button
            onClick={shuffleCards}
            variant="outline" 
            className="border-purple-400/50 text-purple-300 hover:bg-purple-600/20 px-6 py-2"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Новое гадание
          </Button>
        )}
      </div>

      {/* Карты */}
      {cards.length > 0 && (
        <div className={`${getSpreadLayout()} mb-8`}>
          {cards.map((card, index) => (
            <TarotCard
              key={index}
              card={card}
              isRevealed={revealedCards.has(index)}
              onClick={() => revealCard(index)}
              position={getCardPosition(index)}
              className={isShuffling ? 'animate-pulse' : ''}
            />
          ))}
        </div>
      )}

      {/* AI генерация */}
      {isGeneratingAI && (
        <Card className="mb-8 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-purple-600/30">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Sparkles className="w-6 h-6 text-purple-300 animate-spin" />
              <div className="space-y-2">
                <h3 className="text-white font-semibold">ИИ анализирует ваши карты...</h3>
                <p className="text-purple-200 text-sm">
                  Создаётся персональное предсказание на основе вашего вопроса
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Интерпретация */}
      {reading && (
        <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              ✨ Предсказание карт Таро ✨
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-900/30 rounded-lg p-6">
              <h3 className="text-purple-200 font-semibold mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Интерпретация:
              </h3>
              <p className="text-white leading-relaxed text-lg">
                {reading.interpretation}
              </p>
            </div>
            
            <div className="bg-indigo-900/30 rounded-lg p-6">
              <h3 className="text-indigo-200 font-semibold mb-3">Совет карт:</h3>
              <p className="text-white leading-relaxed">
                {reading.advice}
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleSaveReading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-2"
              >
                Сохранить гадание
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TarotSpread;