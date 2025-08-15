import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Eye, Trash2, Sparkles, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ReadingHistory = ({ readings, onBack }) => {
  const [selectedReading, setSelectedReading] = useState(null);
  const [apiReadings, setApiReadings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReadingsFromAPI();
  }, []);

  const loadReadingsFromAPI = async () => {
    setIsLoading(true);
    try {
      const sessionId = localStorage.getItem('tarot_session_id');
      if (sessionId) {
        const response = await axios.get(`${API_BASE}/reading/history?session=${sessionId}`);
        setApiReadings(response.data.readings || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Объединяем локальные и API гадания
  const allReadings = [...(apiReadings || []), ...(readings || [])];
  
  // Удаляем дубликаты по ID
  const uniqueReadings = allReadings.filter((reading, index, self) => 
    index === self.findIndex(r => r.id === reading.id)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSpreadDisplayName = (spreadType) => {
    const spreadNames = {
      'single': 'Одна карта',
      'three': 'Три карты',
      'celtic': 'Кельтский крест',
      'daily': 'Карта дня',
      'weekly': 'На неделю',
      'love': 'На отношения'
    };
    return spreadNames[spreadType] || spreadType;
  };

  const deleteReading = async (readingId) => {
    try {
      // Пробуем удалить из API (если это API гадание)
      const sessionId = localStorage.getItem('tarot_session_id');
      if (sessionId) {
        // В этой версии API нет DELETE, поэтому просто обновляем локальные данные
        toast({
          title: "ℹ️ Информация",
          description: "API гадания нельзя удалить. Обновите страницу для синхронизации.",
        });
      }
      
      // Удаляем из локального хранилища
      const updatedLocalReadings = (readings || []).filter(r => r.id !== readingId);
      localStorage.setItem('tarotReadings', JSON.stringify(updatedLocalReadings));
      
      // Обновляем отображение
      await loadReadingsFromAPI();
      
    } catch (error) {
      console.error('Ошибка удаления гадания:', error);
      toast({
        title: "⚠️ Ошибка",
        description: "Не удалось удалить гадание.",
        variant: "destructive"
      });
    }
  };

  if (uniqueReadings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-purple-600/30 max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">История пуста</h3>
            <p className="text-purple-200 mb-6">
              Вы ещё не проводили ни одного гадания
            </p>
            <Button
              onClick={onBack}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Начать первое гадание
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 bg-clip-text text-transparent">
            История гаданий
          </h2>
          <Button
            onClick={loadReadingsFromAPI}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-purple-400/50 text-purple-300 hover:bg-purple-600/20"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-purple-200 text-lg">
          Ваши предыдущие консультации с картами Таро
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {uniqueReadings.map((reading) => (
          <Card 
            key={reading.id}
            className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-purple-600/30 hover:border-purple-400/60 transition-all duration-300"
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                  {getSpreadDisplayName(reading.spreadType)}
                </Badge>
                <div className="flex items-center text-sm text-purple-300">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(reading.date)}
                </div>
              </div>
              
              <CardTitle className="text-white text-lg line-clamp-2">
                {reading.question || 'Общий вопрос'}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Мини-превью карт */}
                <div className="flex flex-wrap gap-2">
                  {reading.cards.slice(0, 3).map((card, index) => (
                    <div key={index} className="relative">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-8 h-12 object-cover rounded border border-purple-400/30"
                      />
                      {card.reversed && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                  {reading.cards.length > 3 && (
                    <div className="w-8 h-12 bg-purple-800/50 border border-purple-400/30 rounded flex items-center justify-center text-purple-300 text-xs">
                      +{reading.cards.length - 3}
                    </div>
                  )}
                </div>
                
                {/* Краткая интерпретация */}
                <p className="text-purple-200 text-sm line-clamp-3">
                  {reading.interpretation}
                </p>
                
                {/* Кнопки действий */}
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 border-purple-400/50 text-purple-300 hover:bg-purple-600/20"
                        onClick={() => setSelectedReading(reading)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Подробнее
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl bg-gradient-to-br from-indigo-950 to-purple-950 border-purple-600/30 text-white max-h-[80vh] overflow-y-auto">
                      {selectedReading && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                              {selectedReading.question || 'Общий вопрос'}
                            </DialogTitle>
                            <DialogDescription className="text-purple-300 text-lg">
                              {getSpreadDisplayName(selectedReading.spreadType)} • {formatDate(selectedReading.date)}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Карты */}
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-purple-300">Выпавшие карты:</h3>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {selectedReading.cards.map((card, index) => (
                                  <div key={index} className="space-y-2">
                                    <div className="relative">
                                      <img
                                        src={card.image}
                                        alt={card.name}
                                        className="w-full aspect-[2/3] object-cover rounded border border-purple-400/30"
                                      />
                                      {card.reversed && (
                                        <Badge className="absolute top-1 right-1 text-xs bg-red-500/80">
                                          Обр.
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-center">
                                      <p className="text-sm font-medium">{card.name}</p>
                                      {card.position && (
                                        <p className="text-xs text-purple-300">{card.position}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Интерпретация */}
                            <div className="bg-purple-900/30 rounded-lg p-4">
                              <h3 className="text-lg font-semibold mb-3 text-purple-300">Интерпретация:</h3>
                              <p className="leading-relaxed">{selectedReading.interpretation}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteReading(reading.id)}
                    className="border-red-400/50 text-red-300 hover:bg-red-600/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReadingHistory;