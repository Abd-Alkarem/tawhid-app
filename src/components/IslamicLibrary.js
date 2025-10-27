import React, { useState, useEffect } from 'react';
import { Book, Search, Download, BookOpen, X, Loader2 } from 'lucide-react';
import './IslamicLibrary.css';

// Curated list of important Salafi/Ahl Al-Sunnah books from Shamela
const SALAFI_BOOKS = [
  // Aqeedah (Creed)
  { 
    id: 11318, 
    title: 'كتاب التوحيد', 
    author: 'محمد بن عبد الوهاب', 
    category: 'العقيدة', 
    priority: 1,
    url: 'https://read.shamela.ws/book/11318',
    description: 'كتاب في التوحيد وبيان أنواعه وما ينافيه من الشرك الأكبر والأصغر'
  },
  { 
    id: 21626, 
    title: 'العقيدة الواسطية', 
    author: 'ابن تيمية', 
    category: 'العقيدة', 
    priority: 1,
    url: 'https://read.shamela.ws/book/21626',
    description: 'من أهم المتون في العقيدة على منهج أهل السنة والجماعة'
  },
  { 
    id: 21520, 
    title: 'العقيدة الطحاوية', 
    author: 'الطحاوي', 
    category: 'العقيدة', 
    priority: 1,
    url: 'https://read.shamela.ws/book/21520',
    description: 'متن مختصر في بيان عقيدة أهل السنة والجماعة'
  },
  { 
    id: 8424, 
    title: 'الأصول الثلاثة', 
    author: 'محمد بن عبد الوهاب', 
    category: 'العقيدة', 
    priority: 1,
    url: 'https://read.shamela.ws/book/8424',
    description: 'رسالة مختصرة في معرفة الرب والدين والنبي'
  },
  { 
    id: 8425, 
    title: 'القواعد الأربع', 
    author: 'محمد بن عبد الوهاب', 
    category: 'العقيدة', 
    priority: 1,
    url: 'https://read.shamela.ws/book/8425',
    description: 'أربع قواعد تكشف شبهات المشركين'
  },
  
  // Hadith
  { 
    id: 1284, 
    title: 'صحيح البخاري', 
    author: 'البخاري', 
    category: 'الحديث', 
    priority: 1,
    url: 'https://read.shamela.ws/book/1284',
    description: 'أصح كتاب بعد كتاب الله تعالى'
  },
  { 
    id: 1285, 
    title: 'صحيح مسلم', 
    author: 'مسلم', 
    category: 'الحديث', 
    priority: 1,
    url: 'https://read.shamela.ws/book/1285',
    description: 'ثاني أصح كتب الحديث بعد صحيح البخاري'
  },
  { 
    id: 2348, 
    title: 'رياض الصالحين', 
    author: 'النووي', 
    category: 'الحديث', 
    priority: 1,
    url: 'https://read.shamela.ws/book/2348',
    description: 'مختارات من الأحاديث الصحيحة في الأخلاق والآداب'
  },
  { 
    id: 1296, 
    title: 'بلوغ المرام', 
    author: 'ابن حجر', 
    category: 'الحديث', 
    priority: 1,
    url: 'https://read.shamela.ws/book/1296',
    description: 'أحاديث الأحكام من أمهات كتب الحديث'
  },
  { 
    id: 1359, 
    title: 'الأربعون النووية', 
    author: 'النووي', 
    category: 'الحديث', 
    priority: 1,
    url: 'https://read.shamela.ws/book/1359',
    description: 'اثنان وأربعون حديثاً جامعة لأصول الإسلام'
  },
  
  // Fiqh (Jurisprudence)
  { 
    id: 11444, 
    title: 'عمدة الفقه', 
    author: 'ابن قدامة', 
    category: 'الفقه', 
    priority: 1,
    url: 'https://read.shamela.ws/book/11444',
    description: 'مختصر في الفقه على مذهب الإمام أحمد'
  },
  { 
    id: 11920, 
    title: 'الملخص الفقهي', 
    author: 'صالح الفوزان', 
    category: 'الفقه', 
    priority: 1,
    url: 'https://read.shamela.ws/book/11920',
    description: 'ملخص ميسر للأحكام الفقهية'
  },
  { 
    id: 11445, 
    title: 'زاد المستقنع', 
    author: 'الحجاوي', 
    category: 'الفقه', 
    priority: 2,
    url: 'https://read.shamela.ws/book/11445',
    description: 'متن مختصر في الفقه الحنبلي'
  },
  
  // Tafsir
  { 
    id: 1713, 
    title: 'تفسير ابن كثير', 
    author: 'ابن كثير', 
    category: 'التفسير', 
    priority: 1,
    url: 'https://read.shamela.ws/book/1713',
    description: 'من أشهر كتب التفسير بالمأثور'
  },
  { 
    id: 7951, 
    title: 'تفسير السعدي', 
    author: 'السعدي', 
    category: 'التفسير', 
    priority: 1,
    url: 'https://read.shamela.ws/book/7951',
    description: 'تفسير ميسر واضح العبارة'
  },
  { 
    id: 9372, 
    title: 'تفسير الطبري', 
    author: 'الطبري', 
    category: 'التفسير', 
    priority: 2,
    url: 'https://read.shamela.ws/book/9372',
    description: 'من أعظم كتب التفسير بالمأثور'
  },
  
  // Seerah
  { 
    id: 7006, 
    title: 'الرحيق المختوم', 
    author: 'المباركفوري', 
    category: 'السيرة', 
    priority: 1,
    url: 'https://read.shamela.ws/book/7006',
    description: 'سيرة نبوية مختصرة ميسرة'
  },
  { 
    id: 1536, 
    title: 'زاد المعاد', 
    author: 'ابن القيم', 
    category: 'السيرة', 
    priority: 1,
    url: 'https://read.shamela.ws/book/1536',
    description: 'في هدي خير العباد'
  },
  { 
    id: 7004, 
    title: 'السيرة النبوية', 
    author: 'ابن هشام', 
    category: 'السيرة', 
    priority: 2,
    url: 'https://read.shamela.ws/book/7004',
    description: 'من أشهر كتب السيرة النبوية'
  },
  
  // General Islamic Knowledge
  { 
    id: 8426, 
    title: 'كشف الشبهات', 
    author: 'محمد بن عبد الوهاب', 
    category: 'العلوم العامة', 
    priority: 1,
    url: 'https://read.shamela.ws/book/8426',
    description: 'في الرد على شبهات المشركين'
  },
];

const CATEGORIES = [
  { id: 'all', name: 'الكل', icon: '📚' },
  { id: 'العقيدة', name: 'العقيدة', icon: '☪️' },
  { id: 'الحديث', name: 'الحديث', icon: '📖' },
  { id: 'الفقه', name: 'الفقه', icon: '⚖️' },
  { id: 'التفسير', name: 'التفسير', icon: '📜' },
  { id: 'السيرة', name: 'السيرة', icon: '🕌' },
  { id: 'العلوم العامة', name: 'العلوم العامة', icon: '🎓' },
];

function IslamicLibrary({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookContent, setBookContent] = useState(null);
  const [showReader, setShowReader] = useState(false);

  const filteredBooks = SALAFI_BOOKS.filter(book => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesSearch = book.title.includes(searchTerm) || book.author.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setBookContent({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description,
      coverUrl: `https://shamela.ws/covers/${book.id}.jpg`,
      externalUrl: book.url
    });
  };

  const handleDownload = (book) => {
    // Open Shamela download page
    window.open(book.url, '_blank');
  };

  const handleReadOnline = (book) => {
    setShowReader(true);
  };

  const handleCloseReader = () => {
    setShowReader(false);
    setSelectedBook(null);
    setBookContent(null);
  };

  return (
    <div className="islamic-library-overlay">
      <div className="islamic-library-container">
        {/* Header */}
        <div className="library-header">
          <div className="header-content">
            <Book size={28} />
            <h2>المكتبة الإسلامية السلفية</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="library-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="ابحث عن كتاب أو مؤلف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="library-categories">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="books-grid">
          {filteredBooks.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-cover">
                <img 
                  src={`https://shamela.ws/covers/${book.id}.jpg`}
                  alt={book.title}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280"><rect width="200" height="280" fill="%23667eea"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="24">📖</text></svg>';
                  }}
                />
                {book.priority === 1 && (
                  <span className="priority-badge">مهم</span>
                )}
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <span className="book-category">{book.category}</span>
              </div>
              <div className="book-actions">
                <button 
                  className="btn-read"
                  onClick={() => handleBookClick(book)}
                >
                  <BookOpen size={18} />
                  قراءة
                </button>
                <button 
                  className="btn-download"
                  onClick={() => handleDownload(book)}
                >
                  <Download size={18} />
                  تحميل
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Book Viewer Modal */}
        {selectedBook && (
          <div className="book-viewer-overlay" onClick={() => setSelectedBook(null)}>
            <div className="book-viewer" onClick={(e) => e.stopPropagation()}>
              <div className="viewer-header">
                <h3>{selectedBook.title}</h3>
                <button onClick={() => setSelectedBook(null)}>
                  <X size={24} />
                </button>
              </div>
              
              {bookContent ? (
                <div className="viewer-content">
                  <div className="book-details">
                    <img 
                      src={bookContent.coverUrl}
                      alt={bookContent.title}
                      className="book-cover-large"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280"><rect width="200" height="280" fill="%23667eea"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="40">📖</text></svg>';
                      }}
                    />
                    <div className="book-meta">
                      <h4>{bookContent.title}</h4>
                      <p><strong>المؤلف:</strong> {bookContent.author}</p>
                      <p><strong>التصنيف:</strong> {bookContent.category}</p>
                      <p className="book-description">{bookContent.description}</p>
                      <div className="book-actions-viewer">
                        <button 
                          onClick={handleReadOnline}
                          className="read-online-btn"
                        >
                          <BookOpen size={20} />
                          اقرأ الكتاب الآن
                        </button>
                        <a 
                          href={bookContent.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link-btn"
                        >
                          افتح في الشاملة
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="viewer-note">
                    <p>📚 هذا الكتاب متوفر على موقع المكتبة الشاملة</p>
                    <p>انقر على الزر أعلاه للقراءة المباشرة أو التحميل</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Embedded Book Reader */}
        {showReader && selectedBook && (
          <div className="book-reader-fullscreen">
            <div className="reader-header">
              <div className="reader-title">
                <BookOpen size={24} />
                <h3>{selectedBook.title}</h3>
                <span className="reader-author">- {selectedBook.author}</span>
              </div>
              <button className="close-reader-btn" onClick={handleCloseReader}>
                <X size={28} />
              </button>
            </div>
            <div className="reader-content">
              <iframe
                src={selectedBook.url}
                title={selectedBook.title}
                className="book-iframe"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
            <div className="reader-footer">
              <a 
                href={selectedBook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="open-external-btn"
              >
                افتح في نافذة جديدة
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IslamicLibrary;
