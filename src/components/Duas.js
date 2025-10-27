import React, { useState } from 'react';
import { X, ChevronDown, Bookmark, Share2, Copy } from 'lucide-react';
import { duasData } from '../data/duasData';
import './Duas.css';

const Duas = ({ onClose, mode = 'modal' }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [savedDuas, setSavedDuas] = useState(new Set());

  const oldDuasData = [
    {
      id: 'daily',
      title: { ar: 'اليوم', en: 'Daily' },
      icon: '☀️',
      duas: [
        {
          id: 1,
          title: { ar: 'دعاء الاستيقاظ', en: 'Upon Waking Up' },
          arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
          transliteration: 'Alhamdu lillahil-lathee ahyana baAAda ma amatana wa-ilayhin-nushoor',
          translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.'
        },
        {
          id: 2,
          title: { ar: 'دعاء لبس الثوب', en: 'When Wearing Clothes' },
          arabic: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
          transliteration: 'Alhamdu lillahil-lathee kasanee hatha warazaqaneehi min ghayri hawlin minnee wala quwwah',
          translation: 'All praise is for Allah who has clothed me with this and provided it for me without any power or might from myself.'
        }
      ]
    },
    {
      id: 'dua',
      title: { ar: 'الدعاء', en: 'Supplications' },
      icon: '🤲',
      duas: [
        {
          id: 3,
          title: { ar: 'دعاء الرزق', en: 'For Provision' },
          arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
          transliteration: 'Allahumma ikfini bihalalika AAan haramika wa-aghnini bifadlika AAamman siwak',
          translation: 'O Allah, make Your lawful enough for me, as opposed to Your unlawful, and spare me by Your grace, of need of others.'
        }
      ]
    },
    {
      id: 'protection',
      title: { ar: 'الوضوء', en: 'Wudhu' },
      icon: '💧',
      duas: [
        {
          id: 4,
          title: { ar: 'بعد الوضوء', en: 'After Wudhu' },
          arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
          transliteration: 'Ashhadu an la ilaha illal-lahu wahdahu la shareeka lah, wa-ashhadu anna Muhammadan AAabduhu warasooluh',
          translation: 'I bear witness that none has the right to be worshipped but Allah alone, Who has no partner; and I bear witness that Muhammad is His slave and His Messenger.'
        }
      ]
    },
    {
      id: 'mosque',
      title: { ar: 'مسجد', en: 'Mosque' },
      icon: '🕌',
      duas: [
        {
          id: 5,
          title: { ar: 'دخول المسجد', en: 'Entering Mosque' },
          arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
          transliteration: 'Allahumma iftah lee abwaba rahmatik',
          translation: 'O Allah, open before me the doors of Your mercy.'
        },
        {
          id: 6,
          title: { ar: 'الخروج من المسجد', en: 'Leaving Mosque' },
          arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
          transliteration: 'Allahumma innee as-aluka min fadlik',
          translation: 'O Allah, I ask You from Your favor.'
        }
      ]
    },
    {
      id: 'prayer',
      title: { ar: 'صلاة', en: 'Prayer' },
      icon: '🤲',
      duas: [
        {
          id: 7,
          title: { ar: 'دعاء الاستفتاح', en: 'Opening Dua' },
          arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
          transliteration: 'Subhanakal-lahumma wabihamdika watabarakas-muka wataAAala jadduka wala ilaha ghayruk',
          translation: 'Glory is to You O Allah, and praise. Blessed is Your Name and Exalted is Your Majesty. There is none worthy of worship but You.'
        }
      ]
    },
    {
      id: 'home',
      title: { ar: 'منزل', en: 'Home' },
      icon: '🏠',
      duas: [
        {
          id: 8,
          title: { ar: 'دخول المنزل', en: 'Entering Home' },
          arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ، وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
          transliteration: 'Allahumma innee as-aluka khayral-mawliji, wakhayral-makhraji, bismil-lahi walajnaa, wabismil-lahi kharajnaa, waAAalal-lahi rabbina tawakkalnaa',
          translation: 'O Allah, I ask You for the best entering and the best exiting. In the Name of Allah we enter, and in the Name of Allah we leave, and upon Allah, our Lord, we depend.'
        }
      ]
    },
    {
      id: 'clothes',
      title: { ar: 'ملابس', en: 'Clothes' },
      icon: '👕',
      duas: [
        {
          id: 9,
          title: { ar: 'لبس الثوب الجديد', en: 'New Clothes' },
          arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ',
          transliteration: 'Allahumma lakal-hamdu anta kasawtaneehi, as-aluka min khayrihi wakhayri ma suniAAa lahu, wa-aAAoothu bika min sharrihi washarri ma suniAAa lah',
          translation: 'O Allah, praise is to You. You have clothed me. I ask You for its goodness and the goodness of what it has been made for, and I seek Your protection from the evil of it and the evil of what it has been made for.'
        }
      ]
    },
    {
      id: 'travel',
      title: { ar: 'سفر', en: 'Travel' },
      icon: '✈️',
      duas: [
        {
          id: 10,
          title: { ar: 'دعاء السفر', en: 'Travel Dua' },
          arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
          transliteration: 'Subhanal-lathee sakhkhara lana hatha wama kunna lahu muqrineen, wa-inna ila rabbina lamunqaliboon',
          translation: 'Glory unto Him Who has provided this for us though we were unable to provide it for ourselves. Surely, unto our Lord we are returning.'
        }
      ]
    },
    {
      id: 'food',
      title: { ar: 'طعام', en: 'Food' },
      icon: '🍽️',
      duas: [
        {
          id: 11,
          title: { ar: 'قبل الطعام', en: 'Before Eating' },
          arabic: 'بِسْمِ اللَّهِ',
          transliteration: 'Bismil-lah',
          translation: 'In the Name of Allah.'
        },
        {
          id: 12,
          title: { ar: 'بعد الطعام', en: 'After Eating' },
          arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
          transliteration: 'Alhamdu lillahil-lathee atAAamana wasaqana wajaAAalana muslimeen',
          translation: 'All praise is for Allah Who has fed us and given us drink and made us Muslims.'
        }
      ]
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleSave = (duaId) => {
    const newSaved = new Set(savedDuas);
    if (newSaved.has(duaId)) {
      newSaved.delete(duaId);
    } else {
      newSaved.add(duaId);
    }
    setSavedDuas(newSaved);
  };

  const copyDua = (dua) => {
    const text = `${dua.title.en}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}`;
    navigator.clipboard.writeText(text);
    alert('Dua copied to clipboard!');
  };

  const shareDua = (dua) => {
    const text = `${dua.title.en}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}`;
    if (navigator.share) {
      navigator.share({ title: dua.title.en, text });
    } else {
      copyDua(dua);
    }
  };

  const Container = mode === 'modal' ? (
    <div className="duas-modal-overlay" onClick={onClose}>
      <div className="duas-modal" onClick={(e) => e.stopPropagation()}>
        <div className="duas-header">
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
          <h2>إتحاد القراء/التوجيه</h2>
          <div className="header-spacer"></div>
        </div>
        <div className="duas-content">
          {renderCategories()}
        </div>
      </div>
    </div>
  ) : (
    <div className="duas-page">
      <div className="duas-header">
        <h2>إتحاد القراء/التوجيه</h2>
      </div>
      <div className="duas-content">
        {renderCategories()}
      </div>
    </div>
  );

  function renderCategories() {
    return (
      <>
        <div className="duas-content">
          {duasData.map((category) => (
            <div key={category.id} className="dua-category">
              <button
                className="category-header"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="category-info">
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-title-ar">{category.title.ar}</span>
                </div>
                <ChevronDown
                  size={20}
                  className={`chevron ${expandedCategory === category.id ? 'expanded' : ''}`}
                />
              </button>

              {expandedCategory === category.id && (
                <div className="duas-list">
                  {category.duas.map((dua) => (
                    <div key={dua.id} className="dua-item">
                      <div className="dua-title">
                        <span className="dua-title-ar">{dua.title.ar}</span>
                        <span className="dua-title-en">{dua.title.en}</span>
                      </div>

                      <div className="dua-arabic">{dua.arabic}</div>
                      
                      <div className="dua-transliteration">{dua.transliteration}</div>
                      
                      <div className="dua-translation">{dua.translation}</div>

                      <div className="dua-actions">
                        <button
                          className={`dua-action-btn ${savedDuas.has(dua.id) ? 'saved' : ''}`}
                          onClick={() => toggleSave(dua.id)}
                        >
                          <Bookmark size={18} fill={savedDuas.has(dua.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button className="dua-action-btn" onClick={() => copyDua(dua)}>
                          <Copy size={18} />
                        </button>
                        <button className="dua-action-btn" onClick={() => shareDua(dua)}>
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  }

  return Container;
};

export default Duas;
