import React, { useState } from 'react';
import { X, BookOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { tafsirSources } from '../data/tafsirSources';
import './TafsirModal.css';

function TafsirModal({ surahNumber, ayahNumber, onClose }) {
  const [tafsirData, setTafsirData] = useState({});
  const [loading, setLoading] = useState({});
  const [expandedTafsirs, setExpandedTafsirs] = useState({});

  const fetchTafsir = async (tafsirSource) => {
    if (tafsirData[tafsirSource.id]) {
      return; // Already loaded
    }

    setLoading(prev => ({ ...prev, [tafsirSource.id]: true }));
    
    try {
      let response, data, tafsirText;

      if (tafsirSource.apiType === 'alquran.cloud') {
        // Using AlQuran Cloud API
        response = await fetch(
          `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${tafsirSource.edition}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();
        
        if (data.code === 200 && data.data && data.data.text) {
          tafsirText = data.data.text;
        }
      } else {
        // Using Quran.com API v4
        const verseKey = `${surahNumber}:${ayahNumber}`;
        response = await fetch(
          `https://api.quran.com/api/v4/quran/tafsirs/${tafsirSource.resourceId}?verse_key=${verseKey}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();
        
        if (data.tafsirs && data.tafsirs.length > 0 && data.tafsirs[0].text) {
          tafsirText = data.tafsirs[0].text;
        }
      }

      if (tafsirText) {
        // Clean up and format the text
        tafsirText = tafsirText.trim();
        
        // Wrap in paragraph if not already HTML
        if (!tafsirText.startsWith('<')) {
          tafsirText = `<p>${tafsirText}</p>`;
        }
        
        setTafsirData(prev => ({
          ...prev,
          [tafsirSource.id]: tafsirText
        }));
      } else {
        setTafsirData(prev => ({
          ...prev,
          [tafsirSource.id]: '<p style="color: #64748b; text-align: center; padding: 20px;">التفسير غير متوفر لهذه الآية من هذا المصدر.<br>Tafsir not available for this ayah from this source.</p>'
        }));
      }
    } catch (error) {
      console.error(`Error fetching tafsir for ${tafsirSource.name}:`, error);
      console.error('Error details:', error.message);
      setTafsirData(prev => ({
        ...prev,
        [tafsirSource.id]: `<p style="color: #ef4444; text-align: center; padding: 20px;">خطأ في تحميل التفسير: ${error.message}<br>Unable to load tafsir: ${error.message}</p>`
      }));
    } finally {
      setLoading(prev => ({ ...prev, [tafsirSource.id]: false }));
    }
  };

  const toggleTafsirExpansion = (tafsirId) => {
    setExpandedTafsirs(prev => ({
      ...prev,
      [tafsirId]: !prev[tafsirId]
    }));
    
    // Load tafsir if not already loaded
    const tafsirSource = tafsirSources.find(t => t.id === tafsirId);
    if (tafsirSource && !tafsirData[tafsirId]) {
      fetchTafsir(tafsirSource);
    }
  };

  return (
    <div className="tafsir-modal-overlay" onClick={onClose}>
      <div className="tafsir-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tafsir-modal-header">
          <div className="tafsir-modal-title">
            <BookOpen size={24} />
            <h2>Tafsir - Surah {surahNumber}, Ayah {ayahNumber}</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="tafsir-modal-content">
          {/* Tafsir list with expandable sections */}
          <div className="tafsir-list">
            {tafsirSources.map((tafsirSource) => (
              <div key={tafsirSource.id} className="tafsir-item">
                <div 
                  className="tafsir-item-header"
                  onClick={() => toggleTafsirExpansion(tafsirSource.id)}
                >
                  <div className="tafsir-info">
                    <h3>{tafsirSource.name}</h3>
                  </div>
                  <div className="tafsir-toggle">
                    {expandedTafsirs[tafsirSource.id] ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>

                {expandedTafsirs[tafsirSource.id] && (
                  <div className="tafsir-content">
                    {loading[tafsirSource.id] ? (
                      <div className="tafsir-loading">
                        <Loader2 className="loading-spinner" size={32} />
                        <p>Loading tafsir...</p>
                      </div>
                    ) : (
                      <div 
                        className={`tafsir-text ${tafsirSource.language === 'ar' ? 'arabic-text' : ''}`}
                        dangerouslySetInnerHTML={{ 
                          __html: tafsirData[tafsirSource.id] || 'Click to load tafsir...' 
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default TafsirModal;
