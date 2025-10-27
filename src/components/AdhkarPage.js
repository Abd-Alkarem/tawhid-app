import React, { useState, useEffect } from 'react';
import { ChevronDown, Bookmark, Copy, Share2 } from 'lucide-react';
import './AdhkarPage.css';

const AdhkarPage = () => {
  const [adhkar, setAdhkar] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdhkar();
  }, []);

  const fetchAdhkar = async () => {
    try {
      // Fetch from multiple Hadith APIs
      const response = await fetch('https://api.hadith.gading.dev/books/muslim?range=1-50');
      const data = await response.json();
      
      // Transform API data into adhkar categories
      const categories = transformToAdhkar(data);
      setAdhkar(categories);
      setLoading(false);
    } catch (error) {
      console.error('Adhkar fetch error:', error);
      // Fallback to local data
      setAdhkar(getLocalAdhkar());
      setLoading(false);
    }
  };

  const transformToAdhkar = (apiData) => {
    // Transform Hadith API data to adhkar format
    return getLocalAdhkar(); // For now use local, will enhance with API
  };

  const getLocalAdhkar = () => {
    return [
      {
        id: 'morning',
        title: 'أذكار الصباح',
        icon: '🌅',
        items: [
          { arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', count: 1 },
          { arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا', count: 1 },
          { arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100 }
        ]
      },
      {
        id: 'evening',
        title: 'أذكار المساء',
        icon: '🌙',
        items: [
          { arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', count: 1 },
          { arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا', count: 1 }
        ]
      },
      {
        id: 'sleep',
        title: 'أذكار النوم',
        icon: '😴',
        items: [
          { arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', count: 1 },
          { arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ', count: 3 }
        ]
      },
      {
        id: 'wakeup',
        title: 'أذكار الاستيقاظ',
        icon: '☀️',
        items: [
          { arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا', count: 1 }
        ]
      },
      {
        id: 'afterprayer',
        title: 'أذكار بعد الصلاة',
        icon: '📿',
        items: [
          { arabic: 'أَسْتَغْفِرُ اللَّهَ', count: 3 },
          { arabic: 'سُبْحَانَ اللَّهِ', count: 33 },
          { arabic: 'الْحَمْدُ لِلَّهِ', count: 33 },
          { arabic: 'اللَّهُ أَكْبَرُ', count: 34 }
        ]
      }
    ];
  };

  return (
    <div className="adhkar-page">
      <div className="adhkar-header">
        <h2>الأذكار</h2>
      </div>
      <div className="adhkar-content">
        {loading ? (
          <div className="loading">جاري التحميل...</div>
        ) : (
          adhkar.map(cat => (
            <div key={cat.id} className="adhkar-category">
              <button
                className="category-header"
                onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
              >
                <div className="category-info">
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-title">{cat.title}</span>
                </div>
                <ChevronDown className={`chevron ${expandedCategory === cat.id ? 'expanded' : ''}`} />
              </button>
              {expandedCategory === cat.id && (
                <div className="adhkar-list">
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="adhkar-item">
                      <div className="adhkar-arabic">{item.arabic}</div>
                      <div className="adhkar-count">({item.count}x)</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdhkarPage;
