import React, { useState, useRef, useEffect } from 'react';
import { BookMarked, Search, ChevronDown } from 'lucide-react';
import './SurahSelector.css';

function SurahSelector({ surahs, selectedSurah, onSurahChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredSurahs = surahs.filter(surah => 
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.nameArabic.includes(searchTerm) ||
    surah.number.toString().includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="selector-container" ref={dropdownRef}>
      <label className="selector-label">
        <BookMarked size={20} />
        <span>Select Surah</span>
      </label>
      
      <div className="custom-dropdown">
        <div 
          className="dropdown-header"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedSurah.number}. {selectedSurah.name} - {selectedSurah.nameArabic}</span>
          <ChevronDown size={20} className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
        </div>

        {isOpen && (
          <div className="dropdown-menu">
            <div className="search-container-inline">
              <Search size={16} className="search-icon-inline" />
              <input
                type="text"
                className="search-input-inline"
                placeholder="Search surah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <div className="dropdown-options">
              {filteredSurahs.map((surah) => (
                <div
                  key={surah.number}
                  className={`dropdown-option ${surah.number === selectedSurah.number ? 'selected' : ''}`}
                  onClick={() => {
                    onSurahChange(surah);
                    setSearchTerm('');
                    setIsOpen(false);
                  }}
                >
                  {surah.number}. {surah.name} - {surah.nameArabic} ({surah.ayahs} Ayahs)
                </div>
              ))}
              {filteredSurahs.length === 0 && (
                <div className="dropdown-no-results">No results found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SurahSelector;
