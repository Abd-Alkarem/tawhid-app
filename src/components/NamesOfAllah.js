import React, { useState } from 'react';
import { X, Search, Bookmark, Share2 } from 'lucide-react';
import './NamesOfAllah.css';

const NamesOfAllah = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedNames, setSavedNames] = useState(new Set());

  const names = [
    { number: 1, arabic: 'الرَّحْمَنُ', transliteration: 'Ar-Rahman', meaning: 'The Most Compassionate' },
    { number: 2, arabic: 'الرَّحِيمُ', transliteration: 'Ar-Raheem', meaning: 'The Most Merciful' },
    { number: 3, arabic: 'الْمَلِكُ', transliteration: 'Al-Malik', meaning: 'The King' },
    { number: 4, arabic: 'الْقُدُّوسُ', transliteration: 'Al-Quddus', meaning: 'The Most Sacred' },
    { number: 5, arabic: 'السَّلاَمُ', transliteration: 'As-Salam', meaning: 'The Source of Peace' },
    { number: 6, arabic: 'الْمُؤْمِنُ', transliteration: 'Al-Mu\'min', meaning: 'The Infuser of Faith' },
    { number: 7, arabic: 'الْمُهَيْمِنُ', transliteration: 'Al-Muhaymin', meaning: 'The Preserver of Safety' },
    { number: 8, arabic: 'الْعَزِيزُ', transliteration: 'Al-Aziz', meaning: 'The Almighty' },
    { number: 9, arabic: 'الْجَبَّارُ', transliteration: 'Al-Jabbar', meaning: 'The Compeller' },
    { number: 10, arabic: 'الْمُتَكَبِّرُ', transliteration: 'Al-Mutakabbir', meaning: 'The Supreme' },
    { number: 11, arabic: 'الْخَالِقُ', transliteration: 'Al-Khaliq', meaning: 'The Creator' },
    { number: 12, arabic: 'الْبَارِئُ', transliteration: 'Al-Bari', meaning: 'The Evolver' },
    { number: 13, arabic: 'الْمُصَوِّرُ', transliteration: 'Al-Musawwir', meaning: 'The Fashioner' },
    { number: 14, arabic: 'الْغَفَّارُ', transliteration: 'Al-Ghaffar', meaning: 'The Repeatedly Forgiving' },
    { number: 15, arabic: 'الْقَهَّارُ', transliteration: 'Al-Qahhar', meaning: 'The All-Prevailing One' },
    { number: 16, arabic: 'الْوَهَّابُ', transliteration: 'Al-Wahhab', meaning: 'The Supreme Bestower' },
    { number: 17, arabic: 'الرَّزَّاقُ', transliteration: 'Ar-Razzaq', meaning: 'The Provider' },
    { number: 18, arabic: 'الْفَتَّاحُ', transliteration: 'Al-Fattah', meaning: 'The Supreme Solver' },
    { number: 19, arabic: 'اَلْعَلِيْمُ', transliteration: 'Al-Alim', meaning: 'The All-Knowing' },
    { number: 20, arabic: 'الْقَابِضُ', transliteration: 'Al-Qabid', meaning: 'The Withholder' },
    { number: 21, arabic: 'الْبَاسِطُ', transliteration: 'Al-Basit', meaning: 'The Extender' },
    { number: 22, arabic: 'الْخَافِضُ', transliteration: 'Al-Khafid', meaning: 'The Reducer' },
    { number: 23, arabic: 'الرَّافِعُ', transliteration: 'Ar-Rafi', meaning: 'The Exalter' },
    { number: 24, arabic: 'الْمُعِزُّ', transliteration: 'Al-Mu\'izz', meaning: 'The Honorer' },
    { number: 25, arabic: 'المُذِلُّ', transliteration: 'Al-Mudhill', meaning: 'The Humiliator' },
    { number: 26, arabic: 'السَّمِيعُ', transliteration: 'As-Sami', meaning: 'The All-Hearing' },
    { number: 27, arabic: 'الْبَصِيرُ', transliteration: 'Al-Basir', meaning: 'The All-Seeing' },
    { number: 28, arabic: 'الْحَكَمُ', transliteration: 'Al-Hakam', meaning: 'The Impartial Judge' },
    { number: 29, arabic: 'الْعَدْلُ', transliteration: 'Al-Adl', meaning: 'The Utterly Just' },
    { number: 30, arabic: 'اللَّطِيفُ', transliteration: 'Al-Latif', meaning: 'The Subtle One' },
    { number: 31, arabic: 'الْخَبِيرُ', transliteration: 'Al-Khabir', meaning: 'The All-Aware' },
    { number: 32, arabic: 'الْحَلِيمُ', transliteration: 'Al-Halim', meaning: 'The Most Forbearing' },
    { number: 33, arabic: 'الْعَظِيمُ', transliteration: 'Al-Azim', meaning: 'The Magnificent' },
    { number: 34, arabic: 'الْغَفُورُ', transliteration: 'Al-Ghafur', meaning: 'The Much-Forgiving' },
    { number: 35, arabic: 'الشَّكُورُ', transliteration: 'Ash-Shakur', meaning: 'The Most Appreciative' },
    { number: 36, arabic: 'الْعَلِيُّ', transliteration: 'Al-Ali', meaning: 'The Most High' },
    { number: 37, arabic: 'الْكَبِيرُ', transliteration: 'Al-Kabir', meaning: 'The Most Great' },
    { number: 38, arabic: 'الْحَفِيظُ', transliteration: 'Al-Hafiz', meaning: 'The Preserver' },
    { number: 39, arabic: 'المُقيِت', transliteration: 'Al-Muqit', meaning: 'The Sustainer' },
    { number: 40, arabic: 'الْحسِيبُ', transliteration: 'Al-Hasib', meaning: 'The Reckoner' },
    { number: 41, arabic: 'الْجَلِيلُ', transliteration: 'Al-Jalil', meaning: 'The Majestic' },
    { number: 42, arabic: 'الْكَرِيمُ', transliteration: 'Al-Karim', meaning: 'The Most Generous' },
    { number: 43, arabic: 'الرَّقِيبُ', transliteration: 'Ar-Raqib', meaning: 'The Watchful' },
    { number: 44, arabic: 'الْمُجِيبُ', transliteration: 'Al-Mujib', meaning: 'The Responsive One' },
    { number: 45, arabic: 'الْوَاسِعُ', transliteration: 'Al-Wasi', meaning: 'The All-Encompassing' },
    { number: 46, arabic: 'الْحَكِيمُ', transliteration: 'Al-Hakim', meaning: 'The All-Wise' },
    { number: 47, arabic: 'الْوَدُودُ', transliteration: 'Al-Wadud', meaning: 'The Most Loving' },
    { number: 48, arabic: 'الْمَجِيدُ', transliteration: 'Al-Majid', meaning: 'The Glorious' },
    { number: 49, arabic: 'الْبَاعِثُ', transliteration: 'Al-Ba\'ith', meaning: 'The Resurrector' },
    { number: 50, arabic: 'الشَّهِيدُ', transliteration: 'Ash-Shahid', meaning: 'The All-Witnessing' },
    { number: 51, arabic: 'الْحَقُّ', transliteration: 'Al-Haqq', meaning: 'The Absolute Truth' },
    { number: 52, arabic: 'الْوَكِيلُ', transliteration: 'Al-Wakil', meaning: 'The Trustee' },
    { number: 53, arabic: 'الْقَوِيُّ', transliteration: 'Al-Qawi', meaning: 'The All-Strong' },
    { number: 54, arabic: 'الْمَتِينُ', transliteration: 'Al-Matin', meaning: 'The Firm One' },
    { number: 55, arabic: 'الْوَلِيُّ', transliteration: 'Al-Wali', meaning: 'The Protecting Associate' },
    { number: 56, arabic: 'الْحَمِيدُ', transliteration: 'Al-Hamid', meaning: 'The Praiseworthy' },
    { number: 57, arabic: 'الْمُحْصِي', transliteration: 'Al-Muhsi', meaning: 'The All-Enumerating' },
    { number: 58, arabic: 'الْمُبْدِئُ', transliteration: 'Al-Mubdi', meaning: 'The Originator' },
    { number: 59, arabic: 'الْمُعِيدُ', transliteration: 'Al-Mu\'id', meaning: 'The Restorer' },
    { number: 60, arabic: 'الْمُحْيِي', transliteration: 'Al-Muhyi', meaning: 'The Giver of Life' },
    { number: 61, arabic: 'اَلْمُمِيتُ', transliteration: 'Al-Mumit', meaning: 'The Creator of Death' },
    { number: 62, arabic: 'الْحَيُّ', transliteration: 'Al-Hayy', meaning: 'The Ever-Living' },
    { number: 63, arabic: 'الْقَيُّومُ', transliteration: 'Al-Qayyum', meaning: 'The Sustainer' },
    { number: 64, arabic: 'الْوَاجِدُ', transliteration: 'Al-Wajid', meaning: 'The Perceiver' },
    { number: 65, arabic: 'الْمَاجِدُ', transliteration: 'Al-Majid', meaning: 'The Illustrious' },
    { number: 66, arabic: 'الْواحِدُ', transliteration: 'Al-Wahid', meaning: 'The One' },
    { number: 67, arabic: 'اَلاَحَدُ', transliteration: 'Al-Ahad', meaning: 'The Unique' },
    { number: 68, arabic: 'الصَّمَدُ', transliteration: 'As-Samad', meaning: 'The Eternal' },
    { number: 69, arabic: 'الْقَادِرُ', transliteration: 'Al-Qadir', meaning: 'The Omnipotent One' },
    { number: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'Al-Muqtadir', meaning: 'The All-Determiner' },
    { number: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'Al-Muqaddim', meaning: 'The Expediter' },
    { number: 72, arabic: 'الْمُؤَخِّرُ', transliteration: 'Al-Mu\'akhkhir', meaning: 'The Delayer' },
    { number: 73, arabic: 'الأوَّلُ', transliteration: 'Al-Awwal', meaning: 'The First' },
    { number: 74, arabic: 'الآخِرُ', transliteration: 'Al-Akhir', meaning: 'The Last' },
    { number: 75, arabic: 'الظَّاهِرُ', transliteration: 'Az-Zahir', meaning: 'The Manifest' },
    { number: 76, arabic: 'الْبَاطِنُ', transliteration: 'Al-Batin', meaning: 'The Hidden One' },
    { number: 77, arabic: 'الْوَالِي', transliteration: 'Al-Wali', meaning: 'The Governor' },
    { number: 78, arabic: 'الْمُتَعَالِي', transliteration: 'Al-Muta\'ali', meaning: 'The Self Exalted' },
    { number: 79, arabic: 'الْبَرُّ', transliteration: 'Al-Barr', meaning: 'The Source of All Goodness' },
    { number: 80, arabic: 'التَّوَابُ', transliteration: 'At-Tawwab', meaning: 'The Ever-Pardoning' },
    { number: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'Al-Muntaqim', meaning: 'The Avenger' },
    { number: 82, arabic: 'العَفُوُّ', transliteration: 'Al-\'Afuww', meaning: 'The Pardoner' },
    { number: 83, arabic: 'الرَّؤُوفُ', transliteration: 'Ar-Ra\'uf', meaning: 'The Most Kind' },
    { number: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Malik-ul-Mulk', meaning: 'Master of the Kingdom' },
    { number: 85, arabic: 'ذُوالْجَلاَلِ وَالإكْرَامِ', transliteration: 'Dhul-Jalali wal-Ikram', meaning: 'Possessor of Glory and Honor' },
    { number: 86, arabic: 'الْمُقْسِطُ', transliteration: 'Al-Muqsit', meaning: 'The Just One' },
    { number: 87, arabic: 'الْجَامِعُ', transliteration: 'Al-Jami', meaning: 'The Gatherer' },
    { number: 88, arabic: 'الْغَنِيُّ', transliteration: 'Al-Ghani', meaning: 'The Self-Sufficient' },
    { number: 89, arabic: 'الْمُغْنِي', transliteration: 'Al-Mughni', meaning: 'The Enricher' },
    { number: 90, arabic: 'اَلْمَانِعُ', transliteration: 'Al-Mani', meaning: 'The Withholder' },
    { number: 91, arabic: 'الضَّارَّ', transliteration: 'Ad-Dharr', meaning: 'The Distresser' },
    { number: 92, arabic: 'النَّافِعُ', transliteration: 'An-Nafi', meaning: 'The Benefactor' },
    { number: 93, arabic: 'النُّورُ', transliteration: 'An-Nur', meaning: 'The Light' },
    { number: 94, arabic: 'الْهَادِي', transliteration: 'Al-Hadi', meaning: 'The Guide' },
    { number: 95, arabic: 'الْبَدِيعُ', transliteration: 'Al-Badi', meaning: 'The Incomparable Originator' },
    { number: 96, arabic: 'اَلْبَاقِي', transliteration: 'Al-Baqi', meaning: 'The Everlasting' },
    { number: 97, arabic: 'الْوَارِثُ', transliteration: 'Al-Warith', meaning: 'The Inheritor' },
    { number: 98, arabic: 'الرَّشِيدُ', transliteration: 'Ar-Rashid', meaning: 'The Guide to the Right Path' },
    { number: 99, arabic: 'الصَّبُورُ', transliteration: 'As-Sabur', meaning: 'The Most Patient' }
  ];

  const filteredNames = names.filter(name =>
    name.arabic.includes(searchTerm) ||
    name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSave = (number) => {
    const newSaved = new Set(savedNames);
    if (newSaved.has(number)) {
      newSaved.delete(number);
    } else {
      newSaved.add(number);
    }
    setSavedNames(newSaved);
  };

  const shareName = (name) => {
    const text = `${name.arabic} (${name.transliteration})\n${name.meaning}`;
    if (navigator.share) {
      navigator.share({ title: `Name of Allah #${name.number}`, text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Name copied to clipboard!');
    }
  };

  return (
    <div className="names-modal-overlay" onClick={onClose}>
      <div className="names-modal" onClick={(e) => e.stopPropagation()}>
        <div className="names-header">
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
          <h2>أسماء الله الحسنى</h2>
          <div className="header-spacer"></div>
        </div>

        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="names-content">
          <div className="names-grid">
            {filteredNames.map((name) => (
              <div key={name.number} className="name-card">
                <div className="name-number">{name.number}</div>
                <div className="name-arabic">{name.arabic}</div>
                <div className="name-transliteration">{name.transliteration}</div>
                <div className="name-meaning">{name.meaning}</div>
                <div className="name-actions">
                  <button
                    className={`name-action-btn ${savedNames.has(name.number) ? 'saved' : ''}`}
                    onClick={() => toggleSave(name.number)}
                  >
                    <Bookmark size={16} fill={savedNames.has(name.number) ? 'currentColor' : 'none'} />
                  </button>
                  <button className="name-action-btn" onClick={() => shareName(name)}>
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NamesOfAllah;
