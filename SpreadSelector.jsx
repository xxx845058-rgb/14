import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, Heart, Calendar, Star, Sun, Moon } from 'lucide-react';

const SpreadSelector = ({ spreadTypes, onSelectSpread, selectedSpread }) => {
  const getSpreadIcon = (spreadId) => {
    switch (spreadId) {
      case 'single': return <Star className="w-6 h-6" />;
      case 'daily': return <Sun className="w-6 h-6" />;
      case 'three': return <Sparkles className="w-6 h-6" />;
      case 'weekly': return <Calendar className="w-6 h-6" />;
      case 'love': return <Heart className="w-6 h-6" />;
      case 'celtic': return <Moon className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 bg-clip-text text-transparent mb-4">
          Выберите тип расклада
        </h2>
        <p className="text-purple-200 text-lg">
          Каждый расклад раскроет разные аспекты вашего вопроса
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spreadTypes.map((spread) => (
          <Card 
            key={spread.id}
            className={`
              cursor-pointer transition-all duration-300 transform hover:scale-105
              border-2 bg-gradient-to-br from-indigo-900/50 to-purple-900/50
              ${selectedSpread === spread.id 
                ? 'border-purple-400 shadow-lg shadow-purple-500/25 scale-105' 
                : 'border-purple-600/30 hover:border-purple-400/60'
              }
            `}
            onClick={() => onSelectSpread(spread.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-full bg-purple-500/20">
                  {getSpreadIcon(spread.id)}
                </div>
                <CardTitle className="text-white text-lg">
                  {spread.name}
                </CardTitle>
              </div>
              <CardDescription className="text-purple-200">
                {spread.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-300">
                  {spread.positions} {spread.positions === 1 ? 'карта' : spread.positions < 5 ? 'карты' : 'карт'}
                </span>
                <Button
                  variant={selectedSpread === spread.id ? "default" : "outline"}
                  size="sm"
                  className={`
                    ${selectedSpread === spread.id 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'border-purple-400/50 text-purple-300 hover:bg-purple-600/20'
                    }
                  `}
                >
                  {selectedSpread === spread.id ? 'Выбрано' : 'Выбрать'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SpreadSelector;