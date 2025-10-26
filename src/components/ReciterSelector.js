import React, { useState, useRef, useEffect } from 'react';
import { Mic2, Search, ChevronDown } from 'lucide-react';
import './ReciterSelector.css';

function ReciterSelector({ reciters, selectedReciter, onReciterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredReciters = reciters.filter(reciter => 
    reciter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reciter.nameArabic.includes(searchTerm)
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
        <Mic2 size={20} />
        <span>Select Reciter</span>
      </label>
      
      <div className="custom-dropdown">
        <div 
          className="dropdown-header"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedReciter.name} - {selectedReciter.nameArabic}</span>
          <ChevronDown size={20} className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
        </div>

        {isOpen && (
          <div className="dropdown-menu">
            <div className="search-container-inline">
              <Search size={16} className="search-icon-inline" />
              <input
                type="text"
                className="search-input-inline"
                placeholder="Search reciter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <div className="dropdown-options">
              {filteredReciters.map((reciter) => (
                <div
                  key={reciter.id}
                  className={`dropdown-option ${reciter.id === selectedReciter.id ? 'selected' : ''}`}
                  onClick={() => {
                    onReciterChange(reciter);
                    setSearchTerm('');
                    setIsOpen(false);
                  }}
                >
                  {reciter.name} - {reciter.nameArabic}
                </div>
              ))}
              {filteredReciters.length === 0 && (
                <div className="dropdown-no-results">No results found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReciterSelector;
