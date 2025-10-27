import React from 'react';
import { BookOpen, Clock, BookMarked, Star, Circle } from 'lucide-react';
import './Header.css';

function Header({ onPrayerTimesClick, onDuasClick, onNamesClick, onTasbihClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <BookOpen size={32} />
          <h1>Tawhid</h1>
        </div>
        <p className="subtitle">Your Complete Islamic Companion</p>
        
        <div className="header-actions">
          <button className="header-btn" onClick={onPrayerTimesClick} title="Prayer Times">
            <Clock size={20} />
            <span>Prayer Times</span>
          </button>
          <button className="header-btn" onClick={onDuasClick} title="Duas & Adhkar">
            <BookMarked size={20} />
            <span>Duas</span>
          </button>
          <button className="header-btn" onClick={onNamesClick} title="99 Names of Allah">
            <Star size={20} />
            <span>99 Names</span>
          </button>
          <button className="header-btn" onClick={onTasbihClick} title="Tasbih Counter">
            <Circle size={20} />
            <span>Tasbih</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
