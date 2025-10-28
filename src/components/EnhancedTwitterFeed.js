import React, { useState, useEffect, useRef } from 'react';
import { Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Heart, MessageCircle, Repeat2, Share, BarChart2, Image as ImageIcon, Smile, X, Upload, UserPlus, UserMinus } from 'lucide-react';
import './EnhancedTwitterFeed.css';

const EnhancedTwitterFeed = ({ currentUser, onOpenAuth }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState('forYou');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [mentions, setMentions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const fileInputRef = useRef(null);
  const MAX_CHARS = 280;

  useEffect(() => {
    loadData();
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  const loadData = () => {
    const savedPosts = JSON.parse(localStorage.getItem('tawhid_posts') || '[]');
    const savedUsers = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
    
    // Ensure views is always an array
    const postsWithViews = savedPosts.map(post => ({
      ...post,
      views: Array.isArray(post.views) ? post.views : [],
      viewCount: post.viewCount || 0,
      likes: Array.isArray(post.likes) ? post.likes : [],
      retweets: Array.isArray(post.retweets) ? post.retweets : [],
      replies: Array.isArray(post.replies) ? post.replies : [],
      hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
      mentions: Array.isArray(post.mentions) ? post.mentions : []
    }));
    
    setPosts(postsWithViews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setUsers(savedUsers);
  };

  const loadUserProfile = () => {
    const savedProfile = localStorage.getItem(`profile_${currentUser.id}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setProfilePicture(profile.picture);
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfilePicture(imageData);
        
        // Save to localStorage
        const profile = {
          picture: imageData,
          userId: currentUser.id
        };
        localStorage.setItem(`profile_${currentUser.id}`, JSON.stringify(profile));
        
        // Update user in users list
        const updatedUsers = users.map(u => 
          u.id === currentUser.id ? { ...u, avatar: imageData } : u
        );
        localStorage.setItem('tawhid_users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#[\u0600-\u06FFa-zA-Z0-9_]+/g;
    return text.match(hashtagRegex) || [];
  };

  const extractMentions = (text) => {
    const mentionRegex = /@[\u0600-\u06FFa-zA-Z0-9_]+/g;
    return text.match(mentionRegex) || [];
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

    const hashtags = extractHashtags(newPost);
    const mentions = extractMentions(newPost);

    const post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userAvatar: profilePicture,
      content: newPost.trim(),
      hashtags: hashtags,
      mentions: mentions,
      likes: [],
      retweets: [],
      replies: [],
      views: [],
      viewCount: 0,
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

  const trackView = (postId) => {
    if (!currentUser) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const views = Array.isArray(post.views) ? post.views : [];
        if (!views.includes(currentUser.id)) {
          return {
            ...post,
            views: [...views, currentUser.id],
            viewCount: (post.viewCount || 0) + 1
          };
        }
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('tawhid_posts', JSON.stringify(updatedPosts));
  };

  const handleFollow = (userId) => {
    if (!currentUser) {
      if (window.confirm('يجب تسجيل الدخول للمتابعة. هل تريد تسجيل الدخول الآن؟')) {
        window.location.hash = '#login';
      }
      return;
    }

    const following = JSON.parse(localStorage.getItem(`following_${currentUser.id}`) || '[]');
    const isFollowing = following.includes(userId);

    let updatedFollowing;
    if (isFollowing) {
      updatedFollowing = following.filter(id => id !== userId);
    } else {
      updatedFollowing = [...following, userId];
    }

    localStorage.setItem(`following_${currentUser.id}`, JSON.stringify(updatedFollowing));
    
    // Update followers for the other user
    const followers = JSON.parse(localStorage.getItem(`followers_${userId}`) || '[]');
    const updatedFollowers = isFollowing 
      ? followers.filter(id => id !== currentUser.id)
      : [...followers, currentUser.id];
    
    localStorage.setItem(`followers_${userId}`, JSON.stringify(updatedFollowers));
    
    loadData();
  };

  const isFollowing = (userId) => {
    if (!currentUser) return false;
    const following = JSON.parse(localStorage.getItem(`following_${currentUser.id}`) || '[]');
    return following.includes(userId);
  };

  const getFollowersCount = (userId) => {
    const followers = JSON.parse(localStorage.getItem(`followers_${userId}`) || '[]');
    return followers.length;
  };

  const getFollowingCount = (userId) => {
    const following = JSON.parse(localStorage.getItem(`following_${userId}`) || '[]');
    return following.length;
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    setShowSearch(true);
    const lowerQuery = query.toLowerCase();

    // Search posts by content, hashtags, or mentions
    const matchingPosts = posts.filter(post => 
      post.content.toLowerCase().includes(lowerQuery) ||
      post.hashtags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      post.mentions?.some(mention => mention.toLowerCase().includes(lowerQuery)) ||
      post.userName.toLowerCase().includes(lowerQuery)
    );

    // Search users
    const matchingUsers = users.filter(user =>
      user.name?.toLowerCase().includes(lowerQuery) ||
      user.email?.toLowerCase().includes(lowerQuery)
    );

    setSearchResults({
      posts: matchingPosts,
      users: matchingUsers
    });
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
    return num || 0;
  };

  const getRoleBadge = (role) => {
    if (role === 'owner') return { icon: '👑', color: '#ffd700' };
    if (role === 'admin') return { icon: '✓', color: '#1d9bf0' };
    return null;
  };

  const renderTextWithLinks = (text) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className="hashtag" onClick={() => handleSearch(part)}>
            {part}
          </span>
        );
      } else if (part.startsWith('@')) {
        return (
          <span key={index} className="mention" onClick={() => handleSearch(part)}>
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getTrendingHashtags = () => {
    const hashtagCount = {};
    posts.forEach(post => {
      post.hashtags?.forEach(tag => {
        hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
      });
    });

    return Object.entries(hashtagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
  };

  const getWhoToFollow = () => {
    if (!currentUser) return [];
    
    const following = JSON.parse(localStorage.getItem(`following_${currentUser.id}`) || '[]');
    return users
      .filter(u => u.id !== currentUser.id && !following.includes(u.id))
      .slice(0, 3);
  };

  const filteredPosts = activeTab === 'following' && currentUser
    ? posts.filter(post => {
        const following = JSON.parse(localStorage.getItem(`following_${currentUser.id}`) || '[]');
        return following.includes(post.userId) || post.userId === currentUser.id;
      })
    : posts;

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
          <button className="nav-item" onClick={() => setShowSearch(true)}>
            <Search size={26} />
            <span>بحث</span>
          </button>
          <button className="nav-item">
            <Bell size={26} />
            <span>الإشعارات</span>
          </button>
          <button className="nav-item">
            <Bookmark size={26} />
            <span>المحفوظات</span>
          </button>
          <button className="nav-item" onClick={() => setShowProfileUpload(!showProfileUpload)}>
            <User size={26} />
            <span>الملف الشخصي</span>
          </button>
        </nav>

        {currentUser ? (
          <>
            <button className="post-button">نشر</button>
            <div className="sidebar-profile">
              <div className="profile-avatar" onClick={() => setShowProfileUpload(!showProfileUpload)}>
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="profile-info">
                <div className="profile-name">{currentUser.name}</div>
                <div className="profile-stats">
                  <span>{getFollowingCount(currentUser.id)} متابَع</span>
                  <span>{getFollowersCount(currentUser.id)} متابِع</span>
                </div>
              </div>
              <button className="icon-btn-small" onClick={() => setShowProfileUpload(!showProfileUpload)}>
                <Upload size={16} />
              </button>
            </div>
          </>
        ) : (
          <button className="login-button" onClick={() => window.location.hash = '#login'}>
            تسجيل الدخول
          </button>
        )}

        {showProfileUpload && currentUser && (
          <div className="profile-upload-box">
            <h4>تحديث الصورة الشخصية</h4>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              style={{ display: 'none' }}
            />
            <button onClick={() => fileInputRef.current?.click()} className="upload-btn">
              <ImageIcon size={18} />
              اختر صورة
            </button>
          </div>
        )}
      </div>

      {/* Main Feed */}
      <div className="twitter-main">
        <div className="main-header">
          <h1>الرئيسية</h1>
        </div>

        {/* Search Bar */}
        <div className="main-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="ابحث عن منشورات، مستخدمين، #هاشتاغ..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => handleSearch('')}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search Results */}
        {showSearch && searchResults.posts && (
          <div className="search-results">
            <h3>نتائج البحث</h3>
            
            {searchResults.users?.length > 0 && (
              <div className="search-section">
                <h4>المستخدمون</h4>
                {searchResults.users.map(user => (
                  <div key={user.id} className="user-result">
                    <div className="user-result-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="user-result-info">
                      <div className="user-result-name">{user.name}</div>
                      <div className="user-result-stats">
                        {getFollowersCount(user.id)} متابِع
                      </div>
                    </div>
                    {currentUser && user.id !== currentUser.id && (
                      <button
                        className={`follow-btn-small ${isFollowing(user.id) ? 'following' : ''}`}
                        onClick={() => handleFollow(user.id)}
                      >
                        {isFollowing(user.id) ? (
                          <>
                            <UserMinus size={16} />
                            إلغاء
                          </>
                        ) : (
                          <>
                            <UserPlus size={16} />
                            متابعة
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {searchResults.posts?.length > 0 && (
              <div className="search-section">
                <h4>المنشورات ({searchResults.posts.length})</h4>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        {!showSearch && (
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
        )}

        {/* Post Composer */}
        {!showSearch && currentUser && (
          <div className="tweet-composer">
            <div className="composer-avatar">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="composer-content">
              <textarea
                placeholder="ماذا يحدث؟! استخدم # للهاشتاغ و @ للإشارة"
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
                  <button className="icon-btn" title="رموز تعبيرية">
                    <Smile size={20} />
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
        )}

        {/* Posts Feed */}
        <div className="tweets-feed">
          {(showSearch ? searchResults.posts : filteredPosts)?.length === 0 ? (
            <div className="empty-feed-twitter">
              <h2>{showSearch ? 'لا توجد نتائج' : 'مرحباً بك!'}</h2>
              <p>{showSearch ? 'جرب البحث بكلمات أخرى' : activeTab === 'following' ? 'تابع حسابات لرؤية منشوراتهم' : 'ابدأ بنشر أول تغريدة'}</p>
            </div>
          ) : (
            (showSearch ? searchResults.posts : filteredPosts)?.map(post => {
              // Track view when post is rendered
              if (currentUser && !post.views?.includes(currentUser.id)) {
                setTimeout(() => trackView(post.id), 1000);
              }

              return (
                <div key={post.id} className="tweet">
                  <div className="tweet-avatar">
                    {post.userAvatar ? (
                      <img src={post.userAvatar} alt={post.userName} />
                    ) : (
                      <User size={20} />
                    )}
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
                        <span className="tweet-time">· {formatTime(post.createdAt)}</span>
                      </div>

                      {currentUser && (currentUser.id === post.userId || ['owner', 'admin'].includes(currentUser.role)) && (
                        <button className="tweet-menu" onClick={() => handleDelete(post.id)}>
                          <MoreHorizontal size={18} />
                        </button>
                      )}
                    </div>

                    <div className="tweet-text">
                      {renderTextWithLinks(post.content)}
                    </div>

                    {post.hashtags?.length > 0 && (
                      <div className="tweet-hashtags">
                        {post.hashtags.map((tag, idx) => (
                          <span key={idx} className="hashtag-badge" onClick={() => handleSearch(tag)}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

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
                        <span>{formatNumber(post.likes?.length || 0)}</span>
                      </button>

                      <button className="action-btn-twitter views">
                        <BarChart2 size={18} />
                        <span>{formatNumber(post.viewCount || 0)}</span>
                      </button>

                      <button className="action-btn-twitter">
                        <Share size={18} />
                      </button>
                    </div>

                    {currentUser && post.userId !== currentUser.id && (
                      <div className="tweet-follow">
                        <button
                          className={`follow-btn-inline ${isFollowing(post.userId) ? 'following' : ''}`}
                          onClick={() => handleFollow(post.userId)}
                        >
                          {isFollowing(post.userId) ? 'إلغاء المتابعة' : 'متابعة'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Sidebar - Trending */}
      <div className="twitter-widgets">
        <div className="widget">
          <h2>الهاشتاغات الرائجة</h2>
          {getTrendingHashtags().length > 0 ? (
            getTrendingHashtags().map((item, index) => (
              <div key={index} className="trending-item" onClick={() => handleSearch(item.tag)}>
                <div className="trending-info">
                  <span className="trending-category">رائج</span>
                  <h3>{item.tag}</h3>
                  <span className="trending-posts">{item.count} منشور</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-trends">لا توجد هاشتاغات بعد</p>
          )}
        </div>

        {currentUser && (
          <div className="widget">
            <h2>من تتابع</h2>
            {getWhoToFollow().length > 0 ? (
              getWhoToFollow().map(user => (
                <div key={user.id} className="follow-suggestion">
                  <div className="suggestion-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className="suggestion-info">
                    <div className="suggestion-name">
                      {user.name}
                      {getRoleBadge(user.role) && (
                        <span className="verified-badge" style={{ color: getRoleBadge(user.role).color }}>
                          {getRoleBadge(user.role).icon}
                        </span>
                      )}
                    </div>
                    <div className="suggestion-stats">
                      {getFollowersCount(user.id)} متابِع
                    </div>
                  </div>
                  <button className="follow-btn" onClick={() => handleFollow(user.id)}>
                    متابعة
                  </button>
                </div>
              ))
            ) : (
              <p className="no-suggestions">لا توجد اقتراحات</p>
            )}
          </div>
        )}

        <div className="footer-links">
          <a href="#">الشروط</a>
          <a href="#">الخصوصية</a>
          <a href="#">© 2024 Tawhid</a>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTwitterFeed;
