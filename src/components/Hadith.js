import React, { useState } from 'react';
import { BookOpen, X, ChevronRight, Loader2 } from 'lucide-react';
import './Hadith.css';

function Hadith({ onClose }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Available hadith books - Only collections from local SQL database
  const books = [
    // Collections available in HadithTable.sql (SQLite import)
    { slug: 'sahih-bukhari', name: 'صحيح البخاري', nameEn: 'Sahih al-Bukhari', author: 'الإمام البخاري', collectionName: 'bukhari', inSQL: true },
    { slug: 'sahih-muslim', name: 'صحيح مسلم', nameEn: 'Sahih Muslim', author: 'الإمام مسلم', collectionName: 'muslim', inSQL: true },
    { slug: 'abu-dawood', name: 'سنن أبي داود', nameEn: 'Sunan Abu Dawud', author: 'الإمام أبو داود', collectionName: 'abudawud', inSQL: true },
    { slug: 'al-tirmidhi', name: 'جامع الترمذي', nameEn: "Jami' at-Tirmidhi", author: 'الإمام الترمذي', collectionName: 'tirmidhi', inSQL: true },
    { slug: 'sunan-nasai', name: 'سنن النسائي', nameEn: "Sunan an-Nasa'i", author: 'الإمام النسائي', collectionName: 'nasai', inSQL: true },
    { slug: 'ibn-e-majah', name: 'سنن ابن ماجه', nameEn: 'Sunan Ibn Majah', author: 'الإمام ابن ماجه', collectionName: 'ibnmajah', inSQL: true },
    { slug: 'musnad-ahmad', name: 'مسند الإمام أحمد', nameEn: 'Musnad Ahmad', author: 'الإمام أحمد بن حنبل', collectionName: 'ahmad', inSQL: true },
    { slug: 'bulugh', name: 'بلوغ المرام', nameEn: 'Bulugh al-Maram', author: 'الحافظ ابن حجر', collectionName: 'bulugh', inSQL: true },
    { slug: 'riyadussalihin', name: 'رياض الصالحين', nameEn: 'Riyad as-Salihin', author: 'الإمام النووي', collectionName: 'riyadussalihin', inSQL: true },
    { slug: 'shamail', name: 'شمائل الترمذي', nameEn: "Shama'il Muhammadiyah", author: 'الإمام الترمذي', collectionName: 'shamail', inSQL: true },
    { slug: 'adab', name: 'الأدب المفرد', nameEn: 'Al-Adab Al-Mufrad', author: 'الإمام البخاري', collectionName: 'adab', inSQL: true },
    { slug: 'mishkat', name: 'مشكاة المصابيح', nameEn: 'Mishkat al-Masabih', author: 'الخطيب التبريزي', collectionName: 'mishkat', inSQL: true },
    { slug: 'forty', name: 'الأربعون النووية', nameEn: '40 Hadith Nawawi', author: 'الإمام النووي', collectionName: 'forty', inSQL: true },
    { slug: 'hisn', name: 'حصن المسلم', nameEn: 'Hisn al-Muslim', author: 'سعيد بن وهف القحطاني', collectionName: 'hisn', inSQL: true }
  ];

  // Map UI slugs to provider slugs supported by hadithapi.com
  // If a mapping is missing, we'll fall back to embedded sample content
  const hadithApiSlugMap = {
    'sahih-bukhari': 'sahih-bukhari',
    'sahih-muslim': 'sahih-muslim',
    'abu-dawood': 'abu-dawood',
    'al-tirmidhi': 'al-tirmidhi',
    'sunan-nasai': 'sunan-nasai',
    'ibn-e-majah': 'ibn-e-majah',
    'muwatta-malik': 'muwatta-malik',
    'musnad-ahmad': 'musnad-ahmad',
    'riyadussalihin': 'riyadussalihin',
    'bulugh': 'bulugh',
    'nawawi40': 'nawawi40',
    'shamail': 'shamail',
    'adab': 'adab',
    'qudsi40': 'qudsi40',
    'mishkat': 'mishkat'
    // 'al-silsila-sahiha' is NOT available on hadithapi -> will use fallback
  };

  // Expanded embedded fallbacks with full content
  const fallbackSamples = {
    'musnad-ahmad': [
      {
        id: 'MA-1',
        hadithNumber: 1,
        chapterArabic: 'مسند أبي بكر الصديق رضي الله عنه',
        hadithArabic:
          'حدثنا عبد الله قال: حدثني أبي، حدثنا عبد الرزاق، أخبرنا معمر، عن همام بن منبه، عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى دنيا يصيبها أو إلى امرأة ينكحها فهجرته إلى ما هاجر إليه"'
      },
      {
        id: 'MA-2',
        hadithNumber: 2,
        chapterArabic: 'مسند أبي بكر الصديق رضي الله عنه',
        hadithArabic:
          'حدثنا عبد الله، حدثني أبي، حدثنا يحيى بن سعيد، عن شعبة، حدثني أبو التياح، عن أنس بن مالك رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه"'
      },
      {
        id: 'MA-3',
        hadithNumber: 3,
        chapterArabic: 'مسند عمر بن الخطاب رضي الله عنه',
        hadithArabic:
          'حدثنا عبد الله، حدثني أبي، حدثنا يحيى بن سعيد، عن عبيد الله، أخبرني نافع، عن عبد الله بن عمر رضي الله عنهما أن رسول الله صلى الله عليه وسلم قال: "بني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمداً رسول الله، وإقام الصلاة، وإيتاء الزكاة، والحج، وصوم رمضان"'
      },
      {
        id: 'MA-4',
        hadithNumber: 4,
        chapterArabic: 'مسند عمر بن الخطاب رضي الله عنه',
        hadithArabic:
          'حدثنا عبد الله، حدثني أبي، حدثنا سفيان، عن الزهري، عن سالم، عن أبيه رضي الله عنه قال: سمعت رسول الله صلى الله عليه وسلم يقول: "من حمل علينا السلاح فليس منا"'
      },
      {
        id: 'MA-5',
        hadithNumber: 5,
        chapterArabic: 'مسند عثمان بن عفان رضي الله عنه',
        hadithArabic:
          'حدثنا عبد الله، حدثني أبي، حدثنا يحيى بن سعيد، عن عبيد الله، حدثني سعيد بن أبي سعيد، عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "من مات وهو يعلم أنه لا إله إلا الله دخل الجنة"'
      },
      {
        id: 'MA-6',
        hadithNumber: 6,
        chapterArabic: 'مسند علي بن أبي طالب رضي الله عنه',
        hadithArabic:
          'حدثنا عبد الله، حدثني أبي، حدثنا وكيع، حدثنا الأعمش، عن أبي صالح، عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "الإيمان بضع وسبعون شعبة، فأفضلها قول لا إله إلا الله، وأدناها إماطة الأذى عن الطريق، والحياء شعبة من الإيمان"'
      },
      {
        id: 'MA-7',
        hadithNumber: 7,
        chapterArabic: 'مسند علي بن أبي طالب رضي الله عنه',
        hadithArabic:
          'حدثنا عبد الله، حدثني أبي، حدثنا محمد بن جعفر، حدثنا شعبة، عن قتادة، عن أنس رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "ثلاث من كن فيه وجد حلاوة الإيمان: أن يكون الله ورسوله أحب إليه مما سواهما، وأن يحب المرء لا يحبه إلا لله، وأن يكره أن يعود في الكفر كما يكره أن يقذف في النار"'
      },
      {
        id: 'MA-8',
        hadithNumber: 8,
        chapterArabic: 'مسند أبي هريرة رضي الله عنه',
        hadithArabic:
          'حدثنا عبد الله، حدثني أبي، حدثنا سفيان، عن الزهري، عن سعيد بن المسيب، عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "كل أمتي يدخلون الجنة إلا من أبى" قالوا: يا رسول الله، ومن يأبى؟ قال: "من أطاعني دخل الجنة، ومن عصاني فقد أبى"'
      }
    ],
    'al-silsila-sahiha': [
      {
        id: 'SS-1',
        hadithNumber: 1,
        chapterArabic: 'السلسلة الصحيحة - كتاب العلم',
        hadithArabic:
          'عن عثمان بن عفان رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "خيركم من تعلم القرآن وعلمه" رواه البخاري. قال الألباني: حديث صحيح، وهو من أصح الأحاديث في فضل تعليم القرآن وتعلمه.'
      },
      {
        id: 'SS-2',
        hadithNumber: 2,
        chapterArabic: 'السلسلة الصحيحة - كتاب العلم',
        hadithArabic:
          'عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "من سلك طريقاً يلتمس فيه علماً سهل الله له به طريقاً إلى الجنة" رواه مسلم. قال الألباني: حديث صحيح، وفيه فضل طلب العلم الشرعي.'
      },
      {
        id: 'SS-3',
        hadithNumber: 3,
        chapterArabic: 'السلسلة الصحيحة - كتاب الإيمان',
        hadithArabic:
          'عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "الإيمان بضع وسبعون أو بضع وستون شعبة، فأفضلها قول لا إله إلا الله، وأدناها إماطة الأذى عن الطريق، والحياء شعبة من الإيمان" رواه مسلم. قال الألباني: حديث صحيح.'
      },
      {
        id: 'SS-4',
        hadithNumber: 4,
        chapterArabic: 'السلسلة الصحيحة - كتاب الصلاة',
        hadithArabic:
          'عن أبي هريرة رضي الله عنه أن رسول الله صلى الله عليه وسلم قال: "أرأيتم لو أن نهراً بباب أحدكم يغتسل منه كل يوم خمس مرات، هل يبقى من درنه شيء؟" قالوا: لا يبقى من درنه شيء. قال: "فذلك مثل الصلوات الخمس، يمحو الله بهن الخطايا" متفق عليه. قال الألباني: حديث صحيح.'
      },
      {
        id: 'SS-5',
        hadithNumber: 5,
        chapterArabic: 'السلسلة الصحيحة - كتاب الزكاة',
        hadithArabic:
          'عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "ما نقصت صدقة من مال، وما زاد الله عبداً بعفو إلا عزاً، وما تواضع أحد لله إلا رفعه الله" رواه مسلم. قال الألباني: حديث صحيح.'
      },
      {
        id: 'SS-6',
        hadithNumber: 6,
        chapterArabic: 'السلسلة الصحيحة - كتاب الصيام',
        hadithArabic:
          'عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "من صام رمضان إيماناً واحتساباً غفر له ما تقدم من ذنبه" متفق عليه. قال الألباني: حديث صحيح، وفيه فضل صيام رمضان.'
      },
      {
        id: 'SS-7',
        hadithNumber: 7,
        chapterArabic: 'السلسلة الصحيحة - كتاب الحج',
        hadithArabic:
          'عن أبي هريرة رضي الله عنه قال: سئل رسول الله صلى الله عليه وسلم: أي العمل أفضل؟ قال: "إيمان بالله ورسوله" قيل: ثم ماذا؟ قال: "الجهاد في سبيل الله" قيل: ثم ماذا؟ قال: "حج مبرور" متفق عليه. قال الألباني: حديث صحيح.'
      },
      {
        id: 'SS-8',
        hadithNumber: 8,
        chapterArabic: 'السلسلة الصحيحة - كتاب الذكر',
        hadithArabic:
          'عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم" متفق عليه. قال الألباني: حديث صحيح.'
      }
    ]
  };

  const fetchHadiths = async (book, page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    
    try {
      // Use local API
      const response = await fetch(
        `${API_BASE_URL}/hadiths/${book.collectionName}?page=${page}&limit=50`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.data && data.data.length > 0) {
        const formattedHadiths = data.data.map((h) => ({
          id: h.id,
          hadithNumber: h.hadithNumber,
          chapterArabic: h.chapterArabic || '',
          hadithArabic: h.hadithArabic || '',
          hadithEnglish: h.hadithEnglish || null
        }));
        
        console.log(`✅ Loaded ${formattedHadiths.length} hadiths from local database`);
        
        setHadiths(formattedHadiths);
        setTotalPages(data.pagination.totalPages || 1);
      } else {
        setHadiths([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching hadiths from local API:', error);
      setHadiths([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    fetchHadiths(book, 1);
  };

  const handleBackToLibrary = () => {
    setSelectedBook(null);
    setHadiths([]);
    setCurrentPage(1);
    setTotalPages(1);
  };

  return (
    <div className="hadith-modal-overlay" onClick={onClose}>
      <div className="hadith-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hadith-header">
          <div className="hadith-title">
            <BookOpen size={24} />
            <h2>مكتبة الأحاديث</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {!selectedBook ? (
          <div className="hadith-content">
            {/* Books Library View */}
            <div className="books-list">
              {books.map(book => (
                <div
                  key={book.slug}
                  className="book-card"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="book-info">
                    <h3>{book.name}</h3>
                    <p className="book-author">{book.author}</p>
                    <p className="book-name-en">{book.nameEn}</p>
                  </div>
                  <ChevronRight size={20} className="book-arrow" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="hadith-content">
            {/* Book Reader View */}
            <button 
              className="back-button"
              onClick={handleBackToLibrary}
            >
              ← العودة للمكتبة
            </button>

            {loading ? (
              <div className="hadith-loading">
                <Loader2 className="loading-spinner" size={48} />
                <p>جاري تحميل الكتاب...</p>
              </div>
            ) : (
              <>
                <div className="book-page-container">
                  <div className="book-page-header">
                    <h1>{selectedBook.name}</h1>
                    <h2>{selectedBook.author}</h2>
                    <div className="page-number">صفحة {currentPage} من {totalPages}</div>
                  </div>

                  <div className="book-page-content">
                    {hadiths.map((hadith, idx) => {
                      // Check if this is a new chapter
                      const isNewChapter = idx === 0 || 
                        (hadith.chapterArabic && hadith.chapterArabic !== hadiths[idx - 1]?.chapterArabic);
                      
                      return (
                        <div key={hadith.id || idx}>
                          {isNewChapter && hadith.chapterArabic && (
                            <div className="chapter-title">
                              <div className="chapter-ornament">۞</div>
                              <h3>{hadith.chapterArabic}</h3>
                              <div className="chapter-ornament">۞</div>
                            </div>
                          )}

                          <div className="book-hadith">
                            <div className="hadith-meta">
                              <span className="hadith-num">【{hadith.hadithNumber || idx + 1}】</span>
                            </div>
                            
                            <div className="hadith-text">
                              {hadith.hadithArabic}
                            </div>

                            {hadith.hadithEnglish && (
                              <div className="hadith-translation">
                                {hadith.hadithEnglish}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-controls">
                    <button
                      className="page-button"
                      onClick={() => fetchHadiths(selectedBook, currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← السابق
                    </button>

                    <span className="page-info">
                      صفحة {currentPage} من {totalPages}
                    </span>

                    <button
                      className="page-button"
                      onClick={() => fetchHadiths(selectedBook, currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      التالي →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hadith;
