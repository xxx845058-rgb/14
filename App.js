import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TarotApp from './components/TarotApp';

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        {/* Звёзды */}
        <div className="stars"></div>
        <div className="twinkling"></div>
        
        {/* Аврора эффект */}
        <div className="aurora aurora-1"></div>
        <div className="aurora aurora-2"></div>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TarotApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;