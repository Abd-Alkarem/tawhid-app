import React, { useState, useEffect } from 'react';
import { Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Heart, MessageCircle, Repeat2, Share, BarChart2, Image as ImageIcon, Smile, Calendar, MapPin } from 'lucide-react';
import './TwitterFeed.css';

const TwitterFeed = ({ currentUser, onOpenAuth }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState('forYou');
  const MAX_CHARS = 280;

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const savedPosts = JSON.parse(localStorage.getItem('tawhid_posts') || '[]');
    setPosts(savedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      if (window.confirm('يجب تسجيل الدخول للنشر. هل تريد تسجيل الدخول الآن؟')) {
        window.location.hash = '#login';
      }
      return;
    }

    if (!newPost.trim() || newPost.length > MAX_CHARS) {
      return;
    }

    const post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      content: newPost.trim(),
      likes: [],
      retweets: [],
      replies: [],
      views: 0,
      createdAt: new Date().toISOString()
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('tawhid_posts', JSON.stringify(updatedPosts));
    
    setNewPost('');
    setCharCount(0);
  };

  const handleLike = (postId) => {
    if (!currentUser) {
      if (window.confirm('يجب تسجيل الدخول للإعجاب. هل تريد تسجيل الدخول الآن؟')) {
        window.location.hash = '#login';
      }
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes || [];
        const hasLiked = likes.includes(currentUser.id);
        
        return {
          ...post,
          likes: hasLiked 
            ? likes.filter(id => id !== currentUser.id)
            : [...likes, currentUser.id]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('tawhid_posts', JSON.stringify(updatedPosts));
  };

  const handleDelete = (postId) => {
    if (window.confirm('حذف المنشور؟')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem('tawhid_posts', JSON.stringify(updatedPosts));
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `${diffMins}د`;
    if (diffHours < 24) return `${diffHours}س`;
    if (diffDays < 7) return `${diffDays}ي`;
    
    return date.toLocaleDateString('ar', { month: 'short', day: 'numeric' });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const getRoleBadge = (role) => {
    if (role === 'owner') return { icon: '👑', color: '#ffd700' };
    if (role === 'admin') return { icon: '✓', color: '#1d9bf0' };
    return null;
  };

  const trendingTopics = [
    { category: 'الإسلام', title: '#رمضان_كريم', posts: '45.2K' },
    { category: 'الدين', title: '#القرآن_الكريم', posts: '32.1K' },
    { category: 'Trending', title: '#الصلاة', posts: '28.5K' },
    { category: 'الأخبار', title: '#الحج', posts: '19.8K' }
  ];

  return (
    <div className="twitter-container">
      {/* Sidebar */}
      <div className="twitter-sidebar">
        <div className="sidebar-logo">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <Home size={26} />
            <span>الرئيسية</span>
          </button>
          <button className="nav-item">
            <Search size={26} />
            <span>استكشف</span>
          </button>
          <button className="nav-item">
            <Bell size={26} />
            <span>الإشعارات</span>
          </button>
          <button className="nav-item">
            <Mail size={26} />
            <span>الرسائل</span>
          </button>
          <button className="nav-item">
            <Bookmark size={26} />
            <span>العلامات</span>
          </button>
          <button className="nav-item">
            <User size={26} />
            <span>الملف الشخصي</span>
          </button>
          <button className="nav-item">
            <MoreHorizontal size={26} />
            <span>المزيد</span>
          </button>
        </nav>

        {currentUser ? (
          <button className="post-button">نشر</button>
        ) : (
          <button className="login-button" onClick={() => window.location.hash = '#login'}>
            تسجيل الدخول
          </button>
        )}

        {currentUser && (
          <div className="sidebar-profile">
            <div className="profile-avatar">
              <User size={20} />
            </div>
            <div className="profile-info">
              <div className="profile-name">{currentUser.name}</div>
              <div className="profile-handle">@{currentUser.email.split('@')[0]}</div>
            </div>
            <MoreHorizontal size={18} />
          </div>
        )}
      </div>

      {/* Main Feed */}
      <div className="twitter-main">
        <div className="main-header">
          <h1>الرئيسية</h1>
        </div>

        {/* Tabs */}
        <div className="feed-tabs">
          <button 
            className={`tab ${activeTab === 'forYou' ? 'active' : ''}`}
            onClick={() => setActiveTab('forYou')}
          >
            لك
          </button>
          <button 
            className={`tab ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            المتابَعون
          </button>
        </div>

        {/* Post Composer */}
        {currentUser ? (
          <div className="tweet-composer">
            <div className="composer-avatar">
              <User size={20} />
            </div>
            <div className="composer-content">
              <textarea
                placeholder="ماذا يحدث؟!"
                value={newPost}
                onChange={(e) => {
                  setNewPost(e.target.value);
                  setCharCount(e.target.value.length);
                }}
                maxLength={MAX_CHARS}
              />
              
              <div className="composer-actions">
                <div className="composer-icons">
                  <button className="icon-btn" title="صورة">
                    <ImageIcon size={20} />
                  </button>
                  <button className="icon-btn" title="GIF">
                    <span style={{fontWeight: 'bold', fontSize: '14px'}}>GIF</span>
                  </button>
                  <button className="icon-btn" title="استطلاع">
                    <BarChart2 size={20} />
                  </button>
                  <button className="icon-btn" title="رموز تعبيرية">
                    <Smile size={20} />
                  </button>
                  <button className="icon-btn" title="جدولة">
                    <Calendar size={20} />
                  </button>
                  <button className="icon-btn" title="موقع">
                    <MapPin size={20} />
                  </button>
                </div>

                <div className="composer-submit">
                  {charCount > 0 && (
                    <div className="char-indicator">
                      <svg width="20" height="20" viewBox="0 0 20 20">
                        <circle
                          cx="10"
                          cy="10"
                          r="8"
                          fill="none"
                          stroke={charCount > 260 ? '#f91880' : '#1d9bf0'}
                          strokeWidth="2"
                          strokeDasharray={`${(charCount / MAX_CHARS) * 50.265} 50.265`}
                          transform="rotate(-90 10 10)"
                        />
                      </svg>
                      {charCount > 260 && <span className="char-count">{MAX_CHARS - charCount}</span>}
                    </div>
                  )}
                  <button 
                    className="tweet-btn"
                    onClick={handlePostSubmit}
                    disabled={!newPost.trim() || charCount > MAX_CHARS}
                  >
                    نشر
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="login-prompt-twitter">
            <p>سجل الدخول للمشاركة في المحادثة</p>
            <button onClick={() => window.location.hash = '#login'}>تسجيل الدخول</button>
          </div>
        )}

        {/* Posts Feed */}
        <div className="tweets-feed">
          {posts.length === 0 ? (
            <div className="empty-feed-twitter">
              <h2>مرحباً بك في توحيد!</h2>
              <p>ابدأ بمتابعة الحسابات لرؤية منشوراتهم هنا</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="tweet">
                <div className="tweet-avatar">
                  <User size={20} />
                </div>

                <div className="tweet-content">
                  <div className="tweet-header">
                    <div className="tweet-author">
                      <span className="author-name">{post.userName}</span>
                      {getRoleBadge(post.userRole) && (
                        <span className="verified-badge" style={{ color: getRoleBadge(post.userRole).color }}>
                          {getRoleBadge(post.userRole).icon}
                        </span>
                      )}
                      <span className="author-handle">@{post.userName.replace(/\s/g, '')}</span>
                      <span className="tweet-time">· {formatTime(post.createdAt)}</span>
                    </div>

                    {currentUser && (currentUser.id === post.userId || ['owner', 'admin'].includes(currentUser.role)) && (
                      <button className="tweet-menu" onClick={() => handleDelete(post.id)}>
                        <MoreHorizontal size={18} />
                      </button>
                    )}
                  </div>

                  <div className="tweet-text">
                    {post.content}
                  </div>

                  <div className="tweet-actions">
                    <button className="action-btn-twitter">
                      <MessageCircle size={18} />
                      <span>{post.replies?.length || 0}</span>
                    </button>

                    <button className="action-btn-twitter retweet">
                      <Repeat2 size={18} />
                      <span>{post.retweets?.length || 0}</span>
                    </button>

                    <button 
                      className={`action-btn-twitter like ${post.likes?.includes(currentUser?.id) ? 'liked' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart size={18} />
                      <span>{post.likes?.length || 0}</span>
                    </button>

                    <button className="action-btn-twitter views">
                      <BarChart2 size={18} />
                      <span>{formatNumber(Math.floor(Math.random() * 10000))}</span>
                    </button>

                    <button className="action-btn-twitter">
                      <Share size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar - Trending */}
      <div className="twitter-widgets">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="بحث" />
        </div>

        <div className="widget">
          <h2>المواضيع الرائجة</h2>
          {trendingTopics.map((topic, index) => (
            <div key={index} className="trending-item">
              <div className="trending-info">
                <span className="trending-category">{topic.category}</span>
                <h3>{topic.title}</h3>
                <span className="trending-posts">{topic.posts} منشور</span>
              </div>
              <button className="trending-menu">
                <MoreHorizontal size={18} />
              </button>
            </div>
          ))}
          <button className="show-more">عرض المزيد</button>
        </div>

        <div className="widget">
          <h2>من تتابع</h2>
          <div className="follow-suggestion">
            <div className="suggestion-avatar">
              <User size={20} />
            </div>
            <div className="suggestion-info">
              <div className="suggestion-name">الإسلام <span className="verified-badge">✓</span></div>
              <div className="suggestion-handle">@Islam</div>
            </div>
            <button className="follow-btn">متابعة</button>
          </div>
          <button className="show-more">عرض المزيد</button>
        </div>

        <div className="footer-links">
          <a href="#">الشروط</a>
          <a href="#">سياسة الخصوصية</a>
          <a href="#">سياسة ملفات تعريف الارتباط</a>
          <a href="#">معلومات الإعلانات</a>
          <a href="#">المزيد ···</a>
          <span>© 2024 Tawhid</span>
        </div>
      </div>
    </div>
  );
};

export default TwitterFeed;
