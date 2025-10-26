import React from 'react';
import { BookOpen } from 'lucide-react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <BookOpen size={32} />
          <h1>Quran Listener</h1>
        </div>
        <p className="subtitle">Listen to the Holy Quran with beautiful recitations</p>
      </div>
    </header>
  );
}

export default Header;
