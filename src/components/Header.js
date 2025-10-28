import React from 'react';
import { BookOpen, User, LogIn } from 'lucide-react';
import './Header.css';

function Header({ currentUser, onProfileClick, onLoginClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <BookOpen size={32} />
          <h1>Tawhid</h1>
        </div>
        <p className="subtitle">Your Complete Islamic Companion</p>
      </div>
      
      <div className="header-actions">
        {currentUser ? (
          <button className="profile-btn" onClick={onProfileClick}>
            <User size={20} />
            <span>{currentUser.name}</span>
          </button>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            <LogIn size={20} />
            <span>تسجيل الدخول</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
