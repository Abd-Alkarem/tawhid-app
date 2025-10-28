import React from 'react';
import { Home, BookOpen, Compass, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import './BottomNav.css';

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: { ar: 'الرئيسية', en: 'Home' } },
    { id: 'quran', icon: BookOpen, label: { ar: 'القرآن', en: 'Quran' } },
    { id: 'prayer', icon: Compass, label: { ar: 'الصلاة', en: 'Prayer' } },
    { id: 'social', icon: MessageSquare, label: { ar: 'المنشورات', en: 'Posts' } },
    { id: 'more', icon: SettingsIcon, label: { ar: 'المزيد', en: 'More' } }
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon size={24} className="nav-icon" />
              <span className="nav-label">{tab.label.ar}</span>
            </button>
          );
        })}
      </div>
      <div className="nav-indicator" />
    </nav>
  );
};

export default BottomNav;
