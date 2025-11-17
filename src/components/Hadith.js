import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, X, ChevronRight, Loader2, ChevronLeft } from 'lucide-react';
import './Hadith.css';

function Hadith({ onClose }) {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('collections'); // 'collections', 'books', 'chapters', 'hadiths'
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hadithsPerPage] = useState(5); // Number of hadiths per page
  
  // Swipe gesture state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pageContentRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Available hadith collections - Only collections from local SQL database
  const collections = [
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
    { slug: 'hisn', name: 'حصن المسلم', nameEn: 'Hisn al-Muslim', author: 'سعيد بن وهف القحطاني', collectionName: 'hisn', inSQL: true },
    // Note: The following collections are not available in the database yet
    // { slug: 'muwatta', name: 'موطأ مالك', nameEn: 'Muwatta Malik', author: 'الإمام مالك', collectionName: 'malik', inSQL: false },
    // { slug: 'darimi', name: 'سنن الدارمي', nameEn: 'Sunan ad-Darimi', author: 'الإمام الدارمي', collectionName: 'darimi', inSQL: false }
  ];

  // Fetch books/chapters for a collection
  const fetchBooks = async (collection) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/books/${collection.collectionName}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.data && data.data.length > 0) {
        console.log(`✅ Loaded ${data.data.length} books from ${collection.name}`);
        setBooks(data.data);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chapters (أبواب) for a book
  const fetchChapters = async (collection, book) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/chapters/${collection.collectionName}/book/${book.bookNumber}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.data && data.data.length > 0) {
        console.log(`✅ Loaded ${data.data.length} chapters from book ${book.bookNumber}`);
        setChapters(data.data);
      } else {
        setChapters([]);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setChapters([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hadiths for a specific chapter
  const fetchHadiths = async (collection, book, chapter) => {
    setLoading(true);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/hadiths/${collection.collectionName}/book/${book.bookNumber}/bab/${chapter.babID}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.data && data.data.length > 0) {
        console.log(`✅ Loaded ${data.data.length} hadiths from chapter ${chapter.babID}`);
        setHadiths(data.data);
      } else {
        setHadiths([]);
      }
    } catch (error) {
      console.error('Error fetching hadiths:', error);
      setHadiths([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hadiths directly by book (for collections without chapters)
  const fetchHadithsByBook = async (collection, book) => {
    setLoading(true);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/hadiths/${collection.collectionName}/book/${book.bookNumber}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.data && data.data.length > 0) {
        console.log(`✅ Loaded ${data.data.length} hadiths from book ${book.bookNumber}`);
        setHadiths(data.data);
      } else {
        setHadiths([]);
      }
    } catch (error) {
      console.error('Error fetching hadiths:', error);
      setHadiths([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
    setView('books');
    fetchBooks(collection);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    
    // Check if this book has chapters
    if (book.hasChapters) {
      setView('chapters');
      fetchChapters(selectedCollection, book);
    } else {
      // No chapters, fetch hadiths directly
      setView('hadiths');
      fetchHadithsByBook(selectedCollection, book);
    }
  };

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    setView('hadiths');
    setCurrentPage(1); // Reset to first page
    fetchHadiths(selectedCollection, selectedBook, chapter);
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
    setSelectedBook(null);
    setSelectedChapter(null);
    setBooks([]);
    setChapters([]);
    setHadiths([]);
    setView('collections');
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setSelectedChapter(null);
    setChapters([]);
    setHadiths([]);
    setView('books');
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setHadiths([]);
    setCurrentPage(1);
    setView('chapters');
  };

  // Calculate total pages
  const totalPages = Math.ceil(hadiths.length / hadithsPerPage);
  
  // Get current page hadiths
  const indexOfLastHadith = currentPage * hadithsPerPage;
  const indexOfFirstHadith = indexOfLastHadith - hadithsPerPage;
  const currentHadiths = hadiths.slice(indexOfFirstHadith, indexOfLastHadith);

  // Page navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentPage(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentPage(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Swipe gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNextPage();
    }
    if (isRightSwipe) {
      goToPrevPage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (view === 'hadiths') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (e.key === 'ArrowRight') {
            goToPrevPage(); // Right arrow = previous (RTL)
          } else {
            goToNextPage(); // Left arrow = next (RTL)
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [view, currentPage, totalPages]);

  // Scroll to top when page changes
  useEffect(() => {
    if (pageContentRef.current) {
      pageContentRef.current.scrollTop = 0;
    }
  }, [currentPage]);

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

        {view === 'collections' ? (
          <div className="hadith-content">
            {/* Collections Library View */}
            <div className="books-list">
              {collections.map(collection => (
                <div
                  key={collection.slug}
                  className="book-card"
                  onClick={() => handleCollectionClick(collection)}
                >
                  <div className="book-info">
                    <h3>{collection.name}</h3>
                    <p className="book-author">{collection.author}</p>
                    <p className="book-name-en">{collection.nameEn}</p>
                  </div>
                  <ChevronRight size={20} className="book-arrow" />
                </div>
              ))}
            </div>
          </div>
        ) : view === 'books' ? (
          <div className="hadith-content">
            {/* Books/Chapters List View */}
            <button 
              className="back-button"
              onClick={handleBackToCollections}
            >
              ← العودة للمكتبة
            </button>

            {loading ? (
              <div className="hadith-loading">
                <Loader2 className="loading-spinner" size={48} />
                <p>جاري تحميل الكتب...</p>
              </div>
            ) : (
              <div className="books-list">
                <div className="collection-header">
                  <h2>{selectedCollection?.name}</h2>
                  <p>{selectedCollection?.author}</p>
                </div>
                {books.map((book, idx) => (
                  <div
                    key={idx}
                    className="chapter-card"
                    onClick={() => handleBookClick(book)}
                  >
                    <div className="chapter-number">{book.bookNumber}</div>
                    <div className="chapter-info">
                      <h3>{book.bookTitleArabic}</h3>
                      <p className="chapter-english">{book.bookTitleEnglish}</p>
                      <p className="chapter-meta">
                        {book.startHadith} to {book.endHadith} ({book.hadithCount} hadiths)
                      </p>
                    </div>
                    <ChevronRight size={20} className="book-arrow" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : view === 'chapters' ? (
          <div className="hadith-content">
            {/* Chapters (أبواب) List View */}
            <button 
              className="back-button"
              onClick={handleBackToBooks}
            >
              ← العودة للكتب
            </button>

            {loading ? (
              <div className="hadith-loading">
                <Loader2 className="loading-spinner" size={48} />
                <p>جاري تحميل الأبواب...</p>
              </div>
            ) : (
              <div className="books-list">
                <div className="collection-header">
                  <h2>{selectedBook?.bookTitleArabic}</h2>
                  <p>{selectedBook?.bookTitleEnglish}</p>
                </div>
                {chapters.map((chapter, idx) => (
                  <div
                    key={idx}
                    className="chapter-card"
                    onClick={() => handleChapterClick(chapter)}
                  >
                    <div className="chapter-number">{chapter.arabicBabNumber || chapter.babID}</div>
                    <div className="chapter-info">
                      <h3>{chapter.chapterArabic}</h3>
                      <p className="chapter-english">{chapter.chapterEnglish}</p>
                      <p className="chapter-meta">
                        {chapter.startHadith} to {chapter.endHadith} ({chapter.hadithCount} hadiths)
                      </p>
                    </div>
                    <ChevronRight size={20} className="book-arrow" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="hadith-content">
            {/* Hadiths Reader View */}
            <button 
              className="back-button"
              onClick={selectedBook?.hasChapters ? handleBackToChapters : handleBackToBooks}
            >
              {selectedBook?.hasChapters ? '← العودة للأبواب' : '← العودة للكتب'}
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
                    <h1>{selectedCollection?.name}</h1>
                    <h2>{selectedBook?.bookTitleArabic}</h2>
                    {selectedChapter && (
                      <>
                        <h3>{selectedChapter?.chapterArabic}</h3>
                        <p className="chapter-english">{selectedChapter?.chapterEnglish}</p>
                      </>
                    )}
                  </div>

                  <div 
                    className={`book-page-content ${isTransitioning ? 'page-transitioning' : ''}`}
                    ref={pageContentRef}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    {currentHadiths.map((hadith, idx) => (
                      <div key={hadith.id || idx} className="book-hadith">
                        <div className="hadith-meta">
                          <span className="hadith-num">【{hadith.hadithNumber}】</span>
                          {hadith.gradeArabic && (
                            <span className="hadith-grade">{hadith.gradeArabic}</span>
                          )}
                        </div>
                        
                        <div className="hadith-text">
                          {hadith.hadithArabic}
                        </div>

                        {hadith.hadithEnglish && (
                          <div className="hadith-translation">
                            {hadith.hadithEnglish}
                          </div>
                        )}

                        {hadith.gradeEnglish && (
                          <div className="hadith-grade-english">
                            Grade: {hadith.gradeEnglish}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="hadith-pagination-controls">
                      <button 
                        className="hadith-page-button" 
                        onClick={goToNextPage}
                        disabled={currentPage >= totalPages || isTransitioning}
                        title="الصفحة التالية"
                      >
                        <ChevronLeft size={20} />
                        التالي
                      </button>
                      
                      <div className="hadith-page-info">
                        <span className="page-number">{currentPage}</span>
                        <span className="page-separator">/</span>
                        <span className="total-pages">{totalPages}</span>
                      </div>
                      
                      <button 
                        className="hadith-page-button" 
                        onClick={goToPrevPage}
                        disabled={currentPage <= 1 || isTransitioning}
                        title="الصفحة السابقة"
                      >
                        السابق
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>

              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hadith;
