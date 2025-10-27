import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Search, BookOpen } from 'lucide-react';
import TafsirModal from './TafsirModal';
import './QuranText.css';

function QuranText({ surahData, currentAyah, onAyahClick, loading }) {
  const currentAyahRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAyahForTafsir, setSelectedAyahForTafsir] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [longPressAyah, setLongPressAyah] = useState(null);

  useEffect(() => {
    if (currentAyahRef.current) {
      currentAyahRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentAyah]);

  const handleTouchStart = (ayahNumber) => {
    const timer = setTimeout(() => {
      setSelectedAyahForTafsir(ayahNumber);
      setLongPressAyah(null);
    }, 500); // 500ms long press
    setLongPressTimer(timer);
    setLongPressAyah(ayahNumber);
  };

  const handleTouchEnd = (ayahNumber) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    if (longPressAyah === ayahNumber) {
      // Short tap - play ayah
      onAyahClick(ayahNumber);
    }
    setLongPressAyah(null);
  };

  const handleMouseDown = (ayahNumber) => {
    const timer = setTimeout(() => {
      setSelectedAyahForTafsir(ayahNumber);
      setLongPressAyah(null);
    }, 500);
    setLongPressTimer(timer);
    setLongPressAyah(ayahNumber);
  };

  const handleMouseUp = (ayahNumber) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    if (longPressAyah === ayahNumber) {
      onAyahClick(ayahNumber);
    }
    setLongPressAyah(null);
  };

  // Function to remove Arabic diacritics for better search
  const removeDiacritics = (text) => {
    return text.replace(/[\u064B-\u0652\u0670\u0640]/g, '');
  };

  if (loading) {
    return (
      <div className="quran-text loading">
        <Loader2 className="loading-spinner" size={48} />
        <p>Loading Quran text...</p>
      </div>
    );
  }

  if (!surahData) {
    return null;
  }

  const filteredAyahs = surahData.ayahs.filter(ayah => {
    const normalizedAyahText = removeDiacritics(ayah.text);
    const normalizedSearchTerm = removeDiacritics(searchTerm);
    return normalizedAyahText.includes(normalizedSearchTerm);
  });

  return (
    <div className="quran-text">
      <div className="search-ayah-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-ayah-input"
          placeholder="Search in ayahs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <span className="search-results-count">
            {filteredAyahs.length} ayah{filteredAyahs.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      <div className="bismillah">
        {surahData.number !== 1 && surahData.number !== 9 && (
          <p className="arabic-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        )}
      </div>

      <div className="quran-page-container">
        <p className="quran-page-text">
          {filteredAyahs.map((ayah) => (
            <span
              key={ayah.numberInSurah}
              ref={ayah.numberInSurah === currentAyah ? currentAyahRef : null}
              className={`ayah-inline ${ayah.numberInSurah === currentAyah ? 'highlighted-ayah' : ''}`}
              onTouchStart={() => handleTouchStart(ayah.numberInSurah)}
              onTouchEnd={() => handleTouchEnd(ayah.numberInSurah)}
              onMouseDown={() => handleMouseDown(ayah.numberInSurah)}
              onMouseUp={() => handleMouseUp(ayah.numberInSurah)}
              onMouseLeave={() => {
                if (longPressTimer) {
                  clearTimeout(longPressTimer);
                  setLongPressTimer(null);
                }
              }}
            >
              {ayah.text}
              <span className="ayah-number-inline">﴿{ayah.numberInSurah}﴾</span>
              {' '}
            </span>
          ))}
        </p>
      </div>

      {selectedAyahForTafsir && (
        <TafsirModal
          surahNumber={surahData.number}
          ayahNumber={selectedAyahForTafsir}
          onClose={() => setSelectedAyahForTafsir(null)}
        />
      )}
    </div>
  );
}

export default QuranText;
