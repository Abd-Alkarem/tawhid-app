import React, { useState } from 'react';
import { Search, Bookmark } from 'lucide-react';
import JuzView from './JuzView';
import './QuranTabs.css';

const QuranTabs = ({ surahs, onSurahSelect, onJuzSelect }) => {
  const [activeTab, setActiveTab] = useState('surah'); // 'surah' or 'juz'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurahs = surahs.filter(surah =>
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.nameArabic.includes(searchTerm)
  );

  return (
    <div className="quran-tabs-container">
      {/* Top Header */}
      <div className="quran-top-header">
        <h1>القرآن</h1>
        <div className="header-actions">
          <div className="search-field">
            <Search size={18} />
            <input
              type="text"
              placeholder="ابحث عن سورة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="header-icon-btn">
            <Bookmark size={22} />
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="tab-switcher">
        <button
          className={`tab-btn ${activeTab === 'juz' ? 'active' : ''}`}
          onClick={() => setActiveTab('juz')}
        >
          جزء
        </button>
        <button
          className={`tab-btn ${activeTab === 'surah' ? 'active' : ''}`}
          onClick={() => setActiveTab('surah')}
        >
          سورة
        </button>
      </div>

      {/* Content */}
      {activeTab === 'juz' ? (
        <JuzView onJuzSelect={onJuzSelect} />
      ) : (
        <div className="surah-view">
          <div className="surah-header">
            <h3>متابعة قراءة سورة الحج: 18</h3>
          </div>

          <div className="surah-list">
            {filteredSurahs.map((surah, index) => (
              <div
                key={surah.number}
                className="surah-item"
                onClick={() => onSurahSelect && onSurahSelect(surah)}
              >
                <button className="bookmark-btn-surah">
                  <Bookmark size={20} />
                </button>

                <button className="play-btn-surah">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>

                <div className="surah-info">
                  <div className="surah-title">
                    <span className="surah-name-ar">{surah.nameArabic}</span>
                    <span className="surah-name-en">{surah.name}</span>
                  </div>
                  <div className="surah-details">
                    <span className="surah-ayahs">{surah.ayahs} آيات</span>
                  </div>
                </div>

                <div className="surah-number">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuranTabs;
