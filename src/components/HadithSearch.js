import React, { useState } from 'react';
import { Search, X, Loader2, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import './HadithSearch.css';

function HadithSearch({ onClose }) {
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showSimilar, setShowSimilar] = useState(false);

  const searchHadith = async (e) => {
    e.preventDefault();
    
    if (!searchKey.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      // Use window.location.hostname to work on both localhost and network IP
      const apiHost = window.location.hostname === 'localhost' 
        ? 'localhost' 
        : window.location.hostname;
      const apiUrl = `http://${apiHost}:3001`;
      
      // Fetch multiple pages to get more than 15 hadiths
      const allHadiths = [];
      const maxPages = 3; // Fetch up to 3 pages (45 hadiths)
      
      for (let page = 1; page <= maxPages; page++) {
        const response = await fetch(
          `${apiUrl}/api/dorar/search?skey=${encodeURIComponent(searchKey)}&page=${page}`
        );
        
        const data = await response.json();
        
        if (data && data.ahadith && data.ahadith.length > 0) {
          allHadiths.push(...data.ahadith);
          
          // If we got less than 15 results, it means there are no more pages
          if (data.ahadith.length < 15) {
            break;
          }
        } else {
          break;
        }
      }
      
      console.log(`Found ${allHadiths.length} total hadiths`);
      setResults(allHadiths);
      
    } catch (error) {
      console.error('Error searching hadith:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'weak';
    
    const gradeText = grade.toLowerCase();
    
    // Sahih = Green
    if (gradeText.includes('صحيح') || gradeText.includes('sahih') || gradeText.includes('متفق عليه')) {
      return 'sahih';
    } 
    // Hasan = Yellow
    else if (gradeText.includes('حسن') || gradeText.includes('hasan')) {
      return 'hasan';
    } 
    // Da'eef/Weak = Orange
    else if (gradeText.includes('ضعيف') || gradeText.includes('daif') || gradeText.includes('weak')) {
      return 'weak';
    } 
    // Mawdu'/Fabricated = Red
    else if (gradeText.includes('موضوع') || gradeText.includes('mawdu') || gradeText.includes('fabricated') || 
             gradeText.includes('منكر') || gradeText.includes('باطل')) {
      return 'fabricated';
    }
    
    return 'weak';
  };

  return (
    <div className="hadith-search-overlay" onClick={onClose}>
      <div className="hadith-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hadith-search-header">
          <div className="hadith-search-title">
            <Search size={24} />
            <h2>البحث في الأحاديث - موسوعة الدرر السنية</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="hadith-search-content">
          {/* Search Form */}
          <form onSubmit={searchHadith} className="search-form">
            <div className="search-input-container">
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="أدخل كلمات البحث (نص الحديث أو جزء منه)..."
                className="search-input"
                dir="rtl"
              />
              <button type="submit" className="search-submit-btn" disabled={loading}>
                {loading ? (
                  <Loader2 size={20} className="spinning" />
                ) : (
                  <Search size={20} />
                )}
                <span>بحث</span>
              </button>
            </div>
            <p className="search-hint">
              💡 يمكنك البحث بكلمات من نص الحديث، أو اسم الراوي، أو المحدث
            </p>
          </form>

          {/* Results */}
          <div className="search-results">
            {loading ? (
              <div className="loading-state">
                <Loader2 size={48} className="spinning" />
                <p>جاري البحث في موسوعة الدرر السنية...</p>
              </div>
            ) : searched && results.length === 0 ? (
              <div className="no-results-state">
                <AlertCircle size={48} />
                <h3>لم يتم العثور على نتائج</h3>
                <p>حاول البحث بكلمات أخرى أو تأكد من صحة الكتابة</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="results-count">
                  <CheckCircle size={20} />
                  <span>تم العثور على {results.length} حديث</span>
                </div>

                <div className="results-list">
                  {results.map((hadith, index) => (
                    <div 
                      key={index} 
                      className={`hadith-result-card ${expandedIndex === index ? 'expanded' : ''}`}
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                      {/* Hadith Number and Text Preview */}
                      <div className="hadith-preview">
                        <div className="hadith-number-badge">
                          <BookOpen size={18} />
                          <span>{index + 1} - من الموسوعة الحديثية</span>
                        </div>
                        <div 
                          className="hadith-text-preview" 
                          dangerouslySetInnerHTML={{ 
                            __html: expandedIndex === index 
                              ? (hadith.th || hadith.hadith) 
                              : (hadith.th || hadith.hadith).substring(0, 150) + '...' 
                          }} 
                        />
                      </div>

                      {/* Expanded Details */}
                      {expandedIndex === index && (
                        <div className="hadith-expanded-details">
                          {/* Grade Section - Prominent */}
                          <div className={`grade-section grade-${getGradeColor(hadith.grade)}`}>
                            <strong>خلاصة حكم المحدث:</strong>
                            <span className="grade-text">{hadith.grade || 'غير محدد'}</span>
                          </div>

                          {/* Main Details */}
                          <div className="details-grid">
                            {hadith.rawi && (
                              <div className="detail-item">
                                <span className="detail-label">الراوي:</span>
                                <span className="detail-value">{hadith.rawi}</span>
                              </div>
                            )}

                            {hadith.mohdith && (
                              <div className="detail-item">
                                <span className="detail-label">المحدث:</span>
                                <span className="detail-value">{hadith.mohdith}</span>
                              </div>
                            )}

                            {hadith.mhkm && (
                              <div className="detail-item">
                                <span className="detail-label">المصدر:</span>
                                <span className="detail-value">{hadith.mhkm}</span>
                              </div>
                            )}

                            {hadith.num && (
                              <div className="detail-item">
                                <span className="detail-label">الصفحة أو الرقم:</span>
                                <span className="detail-value">{hadith.num}</span>
                              </div>
                            )}

                            {hadith.tak && (
                              <div className="detail-item">
                                <span className="detail-label">التخريج:</span>
                                <span className="detail-value">{hadith.tak}</span>
                              </div>
                            )}

                            {hadith.tasnif && (
                              <div className="detail-item full-width">
                                <span className="detail-label">التصنيف الموضوعي:</span>
                                <span className="detail-value">{hadith.tasnif}</span>
                              </div>
                            )}
                          </div>

                          {/* Similar Hadiths Section - Toggle Button */}
                          {results.length > 1 && (
                            <div className="similar-hadiths-section">
                              <button 
                                className="toggle-similar-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowSimilar(!showSimilar);
                                }}
                              >
                                {showSimilar ? '▼' : '◀'} أحاديث مشابهة ({results.length - 1})
                              </button>
                              
                              {showSimilar && (
                                <div className="similar-hadiths-list">
                                  {results
                                    .filter((_, idx) => idx !== index)
                                    .slice(0, 5)
                                    .map((similarHadith, idx) => (
                                      <div 
                                        key={idx} 
                                        className="similar-hadith-item"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedIndex(results.indexOf(similarHadith));
                                          setShowSimilar(false);
                                        }}
                                      >
                                        <div className="similar-hadith-text">
                                          {similarHadith.th?.substring(0, 100)}...
                                        </div>
                                        <div className="similar-hadith-meta">
                                          <span className={`mini-grade ${getGradeColor(similarHadith.grade)}`}>
                                            {similarHadith.grade}
                                          </span>
                                          <span className="similar-source">{similarHadith.mohdith}</span>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="hadith-actions">
                            <button className="action-btn share-btn">
                              <span>مشاركة</span>
                            </button>
                            <button className="action-btn copy-btn">
                              <span>نسخ</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <Search size={64} />
                <h3>ابحث في موسوعة الدرر السنية</h3>
                <p>أدخل نص الحديث أو جزء منه للبحث والتحقق من صحته</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HadithSearch;
