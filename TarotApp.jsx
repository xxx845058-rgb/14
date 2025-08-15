import React, { useState, useEffect } from 'react';
import SpreadSelector from './SpreadSelector';
import TarotSpread from './TarotSpread';
import ReadingHistory from './ReadingHistory';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, History, Star, Moon, Sun } from 'lucide-react';
import { spreadTypes } from '../data/mockTarotData';
import { useToast } from '../hooks/use-toast';

const TarotApp = () => {
  const [currentView, setCurrentView] = useState('intro');
  const [selectedSpread, setSelectedSpread] = useState(null);
  const [readings, setReadings] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Загружаем сохранённые гадания из localStorage
    const savedReadings = localStorage.getItem('tarotReadings');
    if (savedReadings) {
      setReadings(JSON.parse(savedReadings));
    }
  }, []);

  const handleSelectSpread = (spreadId) => {
    setSelectedSpread(spreadId);
    setCurrentView('reading');
  };

  const handleBackToSelector = () => {
    setCurrentView('selector');
    setSelectedSpread(null);
  };

  const handleBackToIntro = () => {
    setCurrentView('intro');
    setSelectedSpread(null);
  };

  const handleSaveReading = (readingData) => {
    const updatedReadings = [readingData, ...readings];
    setReadings(updatedReadings);
    localStorage.setItem('tarotReadings', JSON.stringify(updatedReadings));
    
    toast({
      title: "✨ Гадание сохранено!",
      description: "Ваше предсказание добавлено в историю.",
    });
  };

  const IntroScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Главный заголовок */}
        <div className="space-y-6">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Star className="w-12 h-12 text-gold animate-pulse" />
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gold via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Мистическое Таро
            </h1>
            <Moon className="w-12 h-12 text-purple-300 animate-pulse" />
          </div>
          
          <p className="text-2xl text-purple-200 leading-relaxed max-w-3xl mx-auto">
            Откройте тайны прошлого, настоящего и будущего с помощью древних карт Таро
          </p>
        </div>

        {/* Особенности */}
        <div className="grid md:grid-cols-3 gap-8 my-12">
          <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-purple-600/30">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">3D Анимации</h3>
              <p className="text-purple-200">Реалистичные карты с плавными 3D эффектами</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-purple-600/30">
            <CardContent className="p-6 text-center">
              <Star className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">AI Предсказания</h3>
              <p className="text-purple-200">Персонализированные интерпретации от ИИ</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border-purple-600/30">
            <CardContent className="p-6 text-center">
              <History className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">История гаданий</h3>
              <p className="text-purple-200">Сохраняйте и просматривайте свои расклады</p>
            </CardContent>
          </Card>
        </div>

        {/* Кнопки */}
        <div className="space-y-4">
          <Button
            onClick={() => setCurrentView('selector')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-4 text-xl rounded-full shadow-lg shadow-purple-500/25 transform transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Начать гадание
          </Button>
          
          {readings.length > 0 && (
            <div>
              <Button
                onClick={() => setCurrentView('history')}
                variant="outline"
                className="border-purple-400/50 text-purple-300 hover:bg-purple-600/20 px-8 py-3 text-lg"
              >
                <History className="w-5 h-5 mr-2" />
                История гаданий ({readings.length})
              </Button>
            </div>
          )}
        </div>

        {/* Информация о Таро */}
        <div className="mt-16 max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-purple-600/20">
            <CardHeader>
              <CardTitle className="text-white text-center">О картах Таро</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-purple-200 leading-relaxed">
                Карты Таро — древний инструмент предсказания и самопознания. Каждая карта несёт глубокий символизм 
                и может дать ценные подсказки для понимания жизненных ситуаций.
              </p>
              <p className="text-purple-200 leading-relaxed">
                Наше приложение использует искусственный интеллект для создания персонализированных интерпретаций, 
                основанных на традиционных значениях карт и вашем конкретном вопросе.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-10">
      {currentView === 'intro' && <IntroScreen />}
      
      {currentView === 'selector' && (
        <div className="min-h-screen pt-8">
          <div className="text-center mb-8">
            <Button 
              onClick={handleBackToIntro}
              variant="outline" 
              className="mb-6 border-purple-400/50 text-purple-300 hover:bg-purple-600/20"
            >
              ← На главную
            </Button>
          </div>
          <SpreadSelector 
            spreadTypes={spreadTypes}
            onSelectSpread={handleSelectSpread}
            selectedSpread={selectedSpread}
          />
        </div>
      )}
      
      {currentView === 'reading' && (
        <div className="min-h-screen pt-8">
          <TarotSpread 
            spreadType={selectedSpread}
            spreadTypes={spreadTypes}
            onBack={handleBackToSelector}
            onSaveReading={handleSaveReading}
          />
        </div>
      )}
      
      {currentView === 'history' && (
        <div className="min-h-screen pt-8">
          <div className="text-center mb-8">
            <Button 
              onClick={handleBackToIntro}
              variant="outline" 
              className="mb-6 border-purple-400/50 text-purple-300 hover:bg-purple-600/20"
            >
              ← На главную
            </Button>
          </div>
          <ReadingHistory 
            readings={readings}
            onBack={handleBackToIntro}
          />
        </div>
      )}
    </div>
  );
};

export default TarotApp;