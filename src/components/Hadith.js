import React, { useState } from 'react';
import { BookOpen, X, ChevronRight, Loader2 } from 'lucide-react';
import './Hadith.css';

function Hadith({ onClose }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_KEY = '$2y$10$vabsTau4KVlqw6cXEe3TEutrDG3mNFzIN227g2fuzUWo8r6hFsOq';

  // Available hadith books
  const books = [
    { slug: 'sahih-bukhari', name: 'صحيح البخاري', nameEn: 'Sahih Bukhari', author: 'الإمام البخاري' },
    { slug: 'sahih-muslim', name: 'صحيح مسلم', nameEn: 'Sahih Muslim', author: 'الإمام مسلم' },
    { slug: 'al-tirmidhi', name: 'جامع الترمذي', nameEn: "Jami' Al-Tirmidhi", author: 'الإمام الترمذي' },
    { slug: 'abu-dawood', name: 'سنن أبي داود', nameEn: 'Sunan Abu Dawood', author: 'الإمام أبو داود' },
    { slug: 'ibn-e-majah', name: 'سنن ابن ماجه', nameEn: 'Sunan Ibn-e-Majah', author: 'الإمام ابن ماجه' },
    { slug: 'sunan-nasai', name: 'سنن النسائي', nameEn: "Sunan An-Nasa'i", author: 'الإمام النسائي' },
    { slug: 'mishkat', name: 'مشكاة المصابيح', nameEn: 'Mishkat Al-Masabih', author: 'الخطيب التبريزي' },
    { slug: 'musnad-ahmad', name: 'مسند أحمد', nameEn: 'Musnad Ahmad', author: 'الإمام أحمد بن حنبل' },
    { slug: 'al-silsila-sahiha', name: 'السلسلة الصحيحة', nameEn: 'Al-Silsila Sahiha', author: 'الشيخ الألباني' }
  ];

  const fetchHadiths = async (book, page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    
    try {
      // Fetch more hadiths per page to show book-like content
      const response = await fetch(
        `https://hadithapi.com/api/hadiths?apiKey=${API_KEY}&book=${book.slug}&paginate=50&page=${page}`
      );
      const data = await response.json();

      if (data.hadiths && data.hadiths.data) {
        setHadiths(data.hadiths.data);
        setTotalPages(data.hadiths.last_page || 1);
      } else {
        setHadiths([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching hadiths:', error);
      setHadiths([]);
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
                              {hadith.status && (
                                <span className={`hadith-grade status-${hadith.status.toLowerCase()}`}>
                                  {hadith.status}
                                </span>
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
