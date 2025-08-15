import React, { useState } from 'react';
import { Card } from './ui/card';

const TarotCard = ({ 
  card, 
  isRevealed = false, 
  isFlipping = false,
  onClick,
  position,
  style = {},
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`tarot-card-container relative ${className}`}
      style={{ 
        transform: `perspective(1000px) rotateY(${isFlipping ? '180deg' : '0deg'}) ${card?.reversed ? 'rotate(180deg)' : ''}`,
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        transformStyle: 'preserve-3d',
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <Card className={`
        tarot-card w-32 h-48 sm:w-40 sm:h-60 cursor-pointer relative
        ${isHovered ? 'scale-105' : 'scale-100'}
        transition-all duration-500 ease-out
        border-2 border-purple-300/50 shadow-xl
        ${isRevealed ? 'shadow-purple-500/30' : 'shadow-indigo-500/30'}
        hover:shadow-2xl hover:shadow-purple-500/50
        bg-gradient-to-br from-indigo-900 to-purple-900
      `}>
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          {!isRevealed ? (
            // Рубашка карты
            <div className="w-full h-full bg-gradient-to-br from-indigo-800 via-purple-800 to-violet-900 relative">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent" />
              </div>
              <div className="absolute inset-4 border border-gold/30 rounded-md">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gold/70 text-2xl">✨</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 animate-pulse" />
            </div>
          ) : (
            // Лицевая сторона карты
            <div className="w-full h-full relative overflow-hidden rounded-lg">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-semibold text-sm sm:text-base">{card.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {card.keywords.slice(0, 2).map((keyword, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-purple-500/70 rounded-full px-2 py-0.5"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              {card.reversed && (
                <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full">
                  Перевёрнутая
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
      
      {position && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <span className="text-sm text-purple-300 font-medium">{position}</span>
        </div>
      )}
    </div>
  );
};

export default TarotCard;