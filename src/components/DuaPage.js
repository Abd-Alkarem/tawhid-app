import React, { useState, useEffect } from 'react';
import { ChevronDown, Bookmark, Copy, Share2 } from 'lucide-react';
import './DuaPage.css';

const DuaPage = () => {
  const [duas, setDuas] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedDuas, setSavedDuas] = useState(new Set());

  useEffect(() => {
    fetchDuas();
  }, []);

  const fetchDuas = async () => {
    try {
      // Fetch from Hadith API - using multiple sources
      const responses = await Promise.all([
        fetch('https://api.hadith.gading.dev/books/muslim?range=1-100'),
        fetch('https://api.hadith.gading.dev/books/bukhari?range=1-100')
      ]);
      
      const [muslimData, bukhariData] = await Promise.all(responses.map(r => r.json()));
      
      // Transform and categorize duas
      const categorizedDuas = categorizeDuas(muslimData, bukhariData);
      setDuas(categorizedDuas);
      setLoading(false);
    } catch (error) {
      console.error('Duas fetch error:', error);
      setDuas(getComprehensiveDuas());
      setLoading(false);
    }
  };

  const categorizeDuas = (muslimData, bukhariData) => {
    // For now return comprehensive local data
    // Will enhance with API categorization
    return getComprehensiveDuas();
  };

  const getComprehensiveDuas = () => {
    return [
      {
        id: 'provision',
        title: 'الرزق',
        icon: '💰',
        duas: [
          {
            arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
            transliteration: 'Allahumma ikfini bihalalika AAan haramika wa-aghnini bifadlika AAamman siwak',
            translation: 'O Allah, make Your lawful enough for me, as opposed to Your unlawful, and spare me by Your grace, of need of others.',
            reference: 'Tirmidhi 3563'
          },
          {
            arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
            transliteration: 'Allahumma innee as-alukal-huda wat-tuqa wal-AAafafa wal-ghina',
            translation: 'O Allah, I ask You for guidance, piety, chastity and self-sufficiency.',
            reference: 'Muslim 2721'
          }
        ]
      },
      {
        id: 'forgiveness',
        title: 'المغفرة والتوبة',
        icon: '🤲',
        duas: [
          {
            arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
            transliteration: 'Rabbigh-fir lee watub AAalayya innaka antat-tawwabur-raheem',
            translation: 'My Lord, forgive me and accept my repentance, for You are the Accepting of Repentance, the Most Merciful.',
            reference: 'Abu Dawud 1516'
          },
          {
            arabic: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
            transliteration: 'Astaghfirullaha allathee la ilaha illa huwal-hayyul-qayyoomu wa-atoobu ilayh',
            translation: 'I seek the forgiveness of Allah, there is no deity except Him, the Ever-Living, the Sustainer, and I repent to Him.',
            reference: 'Abu Dawud 1517'
          }
        ]
      },
      {
        id: 'guidance',
        title: 'الهداية',
        icon: '🧭',
        duas: [
          {
            arabic: 'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي',
            transliteration: 'Allahummah-dinee wasaddidnee',
            translation: 'O Allah, guide me and make me steadfast.',
            reference: 'Muslim 2725'
          },
          {
            arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالسَّدَادَ',
            transliteration: 'Allahumma innee as-alukal-huda was-sadad',
            translation: 'O Allah, I ask You for guidance and right conduct.',
            reference: 'Muslim 2725'
          }
        ]
      },
      {
        id: 'health',
        title: 'الصحة والشفاء',
        icon: '🏥',
        duas: [
          {
            arabic: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي',
            transliteration: 'Allahumma rabban-nas, athhib al-baas, ishfi antas-shafi',
            translation: 'O Allah, Lord of mankind, remove the harm and heal, You are the Healer.',
            reference: 'Bukhari 5675'
          },
          {
            arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي',
            transliteration: 'Allahumma AAafinee fee badanee, allahumma AAafinee fee samAAee, allahumma AAafinee fee basaree',
            translation: 'O Allah, grant me good health in my body, O Allah, grant me good health in my hearing, O Allah, grant me good health in my sight.',
            reference: 'Abu Dawud 5090'
          }
        ]
      },
      {
        id: 'protection',
        title: 'الحماية والوقاية',
        icon: '🛡️',
        duas: [
          {
            arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
            transliteration: 'aAAoothu bikalimatil-lahit-tammati min sharri ma khalaq',
            translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
            reference: 'Muslim 2708'
          },
          {
            arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
            transliteration: 'Allahumma innee aAAoothu bika minal-hammi wal-hazan, wa-aAAoothu bika minal-AAajzi wal-kasal',
            translation: 'O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from helplessness and laziness.',
            reference: 'Bukhari 6369'
          }
        ]
      },
      {
        id: 'patience',
        title: 'الصبر والثبات',
        icon: '💪',
        duas: [
          {
            arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الصَّبْرَ عِنْدَ الْبَلَاءِ',
            transliteration: 'Allahumma innee as-alukas-sabra AAindal-balaa',
            translation: 'O Allah, I ask You for patience in times of trial.',
            reference: 'Hisn al-Muslim'
          },
          {
            arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا',
            transliteration: 'Rabbana afrigh AAalayna sabran wathabbit aqdamana',
            translation: 'Our Lord, pour upon us patience and make firm our feet.',
            reference: 'Quran 2:250'
          }
        ]
      },
      {
        id: 'knowledge',
        title: 'العلم والحكمة',
        icon: '📚',
        duas: [
          {
            arabic: 'رَبِّ زِدْنِي عِلْمًا',
            transliteration: 'Rabbi zidnee AAilma',
            translation: 'My Lord, increase me in knowledge.',
            reference: 'Quran 20:114'
          },
          {
            arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا',
            transliteration: 'Allahumma innee as-aluka AAilman nafiAAa',
            translation: 'O Allah, I ask You for beneficial knowledge.',
            reference: 'Ibn Majah 925'
          }
        ]
      },
      {
        id: 'gratitude',
        title: 'الشكر والحمد',
        icon: '🙏',
        duas: [
          {
            arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
            transliteration: 'Alhamdu lillahi rabbil-AAalameen',
            translation: 'All praise is due to Allah, Lord of all the worlds.',
            reference: 'Quran 1:2'
          },
          {
            arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
            transliteration: 'Allahumma aAAinnee AAala thikrika washukrika wahusni AAibadatik',
            translation: 'O Allah, help me to remember You, to thank You, and to worship You in the best manner.',
            reference: 'Abu Dawud 1522'
          }
        ]
      },
      {
        id: 'anxiety',
        title: 'الهم والقلق',
        icon: '😔',
        duas: [
          {
            arabic: 'اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ',
            transliteration: 'Allahumma innee AAabduka ibnu AAabdika ibnu amatik, nasiyatee biyadik, madin fiyya hukmuk, AAadlun fiyya qadauk',
            translation: 'O Allah, I am Your servant, son of Your servant, son of Your maidservant, my forelock is in Your hand, Your command over me is forever executed and Your decree over me is just.',
            reference: 'Ahmad 3528'
          }
        ]
      },
      {
        id: 'success',
        title: 'النجاح والتوفيق',
        icon: '🎯',
        duas: [
          {
            arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
            transliteration: 'Rabbana atina fid-dunya hasanatan wafil-akhirati hasanatan waqina AAathaban-nar',
            translation: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
            reference: 'Quran 2:201'
          }
        ]
      },
      {
        id: 'parents',
        title: 'الوالدين',
        icon: '👨‍👩‍👦',
        duas: [
          {
            arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
            transliteration: 'Rabbir-hamhuma kama rabbayani sagheera',
            translation: 'My Lord, have mercy upon them as they brought me up [when I was] small.',
            reference: 'Quran 17:24'
          },
          {
            arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
            transliteration: 'Rabbanagh-fir lee waliwalidayya walilmu/mineena yawma yaqoomul-hisab',
            translation: 'Our Lord, forgive me and my parents and the believers the Day the account is established.',
            reference: 'Quran 14:41'
          }
        ]
      },
      {
        id: 'marriage',
        title: 'الزواج والأسرة',
        icon: '💑',
        duas: [
          {
            arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
            transliteration: 'Rabbana hab lana min azwajina wathurriyyatina qurrata aAAyun',
            translation: 'Our Lord, grant us from among our wives and offspring comfort to our eyes.',
            reference: 'Quran 25:74'
          }
        ]
      },
      {
        id: 'death',
        title: 'الموت والآخرة',
        icon: '🕊️',
        duas: [
          {
            arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ',
            transliteration: 'Allahummagh-fir lahu warhamhu waAAafihi waAAfu AAanhu',
            translation: 'O Allah, forgive him and have mercy on him and give him strength and pardon him.',
            reference: 'Muslim 963'
          }
        ]
      }
    ];
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
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\nReference: ${dua.reference}`;
    navigator.clipboard.writeText(text);
    alert('Dua copied!');
  };

  return (
    <div className="dua-page">
      <div className="dua-header">
        <h2>الدعاء</h2>
      </div>
      <div className="dua-content">
        {loading ? (
          <div className="loading">جاري التحميل...</div>
        ) : (
          duas.map(cat => (
            <div key={cat.id} className="dua-category">
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
                <div className="dua-list">
                  {cat.duas.map((dua, idx) => (
                    <div key={idx} className="dua-item">
                      <div className="dua-arabic">{dua.arabic}</div>
                      <div className="dua-transliteration">{dua.transliteration}</div>
                      <div className="dua-translation">{dua.translation}</div>
                      <div className="dua-reference">{dua.reference}</div>
                      <div className="dua-actions">
                        <button className="dua-action-btn" onClick={() => copyDua(dua)}>
                          <Copy size={16} />
                        </button>
                        <button className="dua-action-btn">
                          <Bookmark size={16} />
                        </button>
                      </div>
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

export default DuaPage;
