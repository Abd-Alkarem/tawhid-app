import React, { useState } from 'react';
import { Play, Bookmark } from 'lucide-react';
import './JuzView.css';

const JuzView = ({ onJuzSelect }) => {
  const [savedJuz, setSavedJuz] = useState(new Set());

  // Juz data with page ranges
  const juzData = [
    { number: 1, pages: '1 - 21', surahs: 'الفاتحة - البقرة' },
    { number: 2, pages: '22 - 41', surahs: 'البقرة' },
    { number: 3, pages: '42 - 61', surahs: 'البقرة - آل عمران' },
    { number: 4, pages: '62 - 81', surahs: 'آل عمران - النساء' },
    { number: 5, pages: '82 - 101', surahs: 'النساء' },
    { number: 6, pages: '102 - 121', surahs: 'النساء - المائدة' },
    { number: 7, pages: '122 - 141', surahs: 'المائدة - الأنعام' },
    { number: 8, pages: '142 - 161', surahs: 'الأنعام - الأعراف' },
    { number: 9, pages: '162 - 181', surahs: 'الأعراف - الأنفال' },
    { number: 10, pages: '182 - 201', surahs: 'الأنفال - التوبة' },
    { number: 11, pages: '202 - 221', surahs: 'التوبة - هود' },
    { number: 12, pages: '222 - 241', surahs: 'هود - يوسف' },
    { number: 13, pages: '242 - 261', surahs: 'يوسف - إبراهيم' },
    { number: 14, pages: '262 - 281', surahs: 'الحجر - النحل' },
    { number: 15, pages: '282 - 301', surahs: 'الإسراء - الكهف' },
    { number: 16, pages: '302 - 321', surahs: 'الكهف - طه' },
    { number: 17, pages: '322 - 341', surahs: 'الأنبياء - الحج' },
    { number: 18, pages: '342 - 361', surahs: 'المؤمنون - الفرقان' },
    { number: 19, pages: '362 - 381', surahs: 'الفرقان - النمل' },
    { number: 20, pages: '382 - 401', surahs: 'النمل - العنكبوت' },
    { number: 21, pages: '402 - 421', surahs: 'العنكبوت - الأحزاب' },
    { number: 22, pages: '422 - 441', surahs: 'الأحزاب - يس' },
    { number: 23, pages: '442 - 461', surahs: 'يس - الزمر' },
    { number: 24, pages: '462 - 481', surahs: 'الزمر - فصلت' },
    { number: 25, pages: '482 - 501', surahs: 'فصلت - الجاثية' },
    { number: 26, pages: '502 - 521', surahs: 'الأحقاف - الذاريات' },
    { number: 27, pages: '522 - 541', surahs: 'الذاريات - الحديد' },
    { number: 28, pages: '542 - 561', surahs: 'المجادلة - التحريم' },
    { number: 29, pages: '562 - 581', surahs: 'الملك - المرسلات' },
    { number: 30, pages: '582 - 604', surahs: 'النبأ - الناس' }
  ];

  const toggleSave = (juzNumber) => {
    const newSaved = new Set(savedJuz);
    if (newSaved.has(juzNumber)) {
      newSaved.delete(juzNumber);
    } else {
      newSaved.add(juzNumber);
    }
    setSavedJuz(newSaved);
  };

  return (
    <div className="juz-view">
      <div className="juz-header">
        <h3>متابعة قراءة سورة الحج: 18</h3>
      </div>

      <div className="juz-list">
        {juzData.map((juz) => (
          <div key={juz.number} className="juz-item">
            <button
              className={`bookmark-btn ${savedJuz.has(juz.number) ? 'saved' : ''}`}
              onClick={() => toggleSave(juz.number)}
            >
              <Bookmark
                size={20}
                fill={savedJuz.has(juz.number) ? 'currentColor' : 'none'}
              />
            </button>

            <button
              className="play-btn"
              onClick={() => onJuzSelect && onJuzSelect(juz.number)}
            >
              <Play size={20} fill="currentColor" />
            </button>

            <div className="juz-info">
              <div className="juz-title">
                <span className="juz-name">جزء {juz.number}</span>
                <span className="juz-english">Juz {juz.number}</span>
              </div>
              <div className="juz-details">
                <span className="juz-surahs">{juz.surahs}</span>
                <span className="juz-pages">صفحة {juz.pages}</span>
              </div>
            </div>

            <div className="juz-number">{juz.number}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JuzView;
