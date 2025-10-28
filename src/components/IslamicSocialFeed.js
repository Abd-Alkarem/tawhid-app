import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, MessageCircle, Share2, BarChart2, Image as ImageIcon, Smile, X, Upload, UserPlus, UserMinus, MoreHorizontal, Trash2 } from 'lucide-react';
import './IslamicSocialFeed.css';

const IslamicSocialFeed = ({ currentUser, onOpenAuth }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState('forYou');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyToPost, setReplyToPost] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quotePost, setQuotePost] = useState(null);
  const [quoteText, setQuoteText] = useState('');
  const [expandedThreads, setExpandedThreads] = useState({});
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
        
        const profile = {
          picture: imageData,
          userId: currentUser.id
        };
        localStorage.setItem(`profile_${currentUser.id}`, JSON.stringify(profile));
        
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
        const likes = Array.isArray(post.likes) ? post.likes : [];
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

    const matchingPosts = posts.filter(post => 
      post.content.toLowerCase().includes(lowerQuery) ||
      post.hashtags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      post.mentions?.some(mention => mention.toLowerCase().includes(lowerQuery)) ||
      post.userName.toLowerCase().includes(lowerQuery)
    );

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

  const handleReply = (post) => {
    if (!currentUser) {
      if (window.confirm('يجب تسجيل الدخول للرد. هل تريد تسجيل الدخول الآن؟')) {
        window.location.hash = '#login';
      }
      return;
    }
    setReplyToPost(post);
    setShowReplyModal(true);
  };

  const submitReply = () => {
    if (!replyText.trim() || !replyToPost) return;

    const hashtags = extractHashtags(replyText);
    const mentions = extractMentions(replyText);

    const reply = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userAvatar: profilePicture,
      content: replyText.trim(),
      hashtags: hashtags,
      mentions: mentions,
      likes: [],
      retweets: [],
      replies: [],
      views: [],
      viewCount: 0,
      replyTo: replyToPost.id,
      replyToUser: replyToPost.userName,
      createdAt: new Date().toISOString()
    };

    // Add reply to posts
    const updatedPosts = [reply, ...posts];
    
    // Update parent post's reply count
    const postsWithReply = updatedPosts.map(post => {
      if (post.id === replyToPost.id) {
        return {
          ...post,
          replies: [...(post.replies || []), reply.id]
        };
      }
      return post;
    });

    setPosts(postsWithReply);
    localStorage.setItem('tawhid_posts', JSON.stringify(postsWithReply));
    
    setReplyText('');
    setShowReplyModal(false);
    setReplyToPost(null);
  };

  const handleRepost = (postId) => {
    if (!currentUser) {
      if (window.confirm('يجب تسجيل الدخول لإعادة النشر. هل تريد تسجيل الدخول الآن؟')) {
        window.location.hash = '#login';
      }
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const retweets = Array.isArray(post.retweets) ? post.retweets : [];
        const hasRetweeted = retweets.some(rt => rt.userId === currentUser.id);
        
        if (hasRetweeted) {
          // Remove repost
          return {
            ...post,
            retweets: retweets.filter(rt => rt.userId !== currentUser.id)
          };
        } else {
          // Add repost
          return {
            ...post,
            retweets: [...retweets, {
              userId: currentUser.id,
              userName: currentUser.name,
              createdAt: new Date().toISOString()
            }]
          };
        }
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('tawhid_posts', JSON.stringify(updatedPosts));
  };

  const handleQuote = (post) => {
    if (!currentUser) {
      if (window.confirm('يجب تسجيل الدخول للاقتباس. هل تريد تسجيل الدخول الآن؟')) {
        window.location.hash = '#login';
      }
      return;
    }
    setQuotePost(post);
    setShowQuoteModal(true);
  };

  const submitQuote = () => {
    if (!quoteText.trim() || !quotePost) return;

    const hashtags = extractHashtags(quoteText);
    const mentions = extractMentions(quoteText);

    const quote = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userAvatar: profilePicture,
      content: quoteText.trim(),
      hashtags: hashtags,
      mentions: mentions,
      likes: [],
      retweets: [],
      replies: [],
      views: [],
      viewCount: 0,
      quotedPost: quotePost,
      createdAt: new Date().toISOString()
    };

    const updatedPosts = [quote, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('tawhid_posts', JSON.stringify(updatedPosts));
    
    setQuoteText('');
    setShowQuoteModal(false);
    setQuotePost(null);
  };

  const toggleThread = (postId) => {
    setExpandedThreads(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const getReplies = (postId) => {
    return posts.filter(post => post.replyTo === postId);
  };

  const hasRetweeted = (post) => {
    if (!currentUser) return false;
    const retweets = Array.isArray(post.retweets) ? post.retweets : [];
    return retweets.some(rt => rt.userId === currentUser.id);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    
    return date.toLocaleDateString('ar', { month: 'short', day: 'numeric' });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num || 0;
  };

  const renderTextWithLinks = (text) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className="hashtag-islamic" onClick={() => handleSearch(part)}>
            {part}
          </span>
        );
      } else if (part.startsWith('@')) {
        return (
          <span key={index} className="mention-islamic" onClick={() => handleSearch(part)}>
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

  const filteredPosts = activeTab === 'following' && currentUser
    ? posts.filter(post => {
        const following = JSON.parse(localStorage.getItem(`following_${currentUser.id}`) || '[]');
        return following.includes(post.userId) || post.userId === currentUser.id;
      })
    : posts;

  return (
    <div className="islamic-social-container">
      {/* Header */}
      <div className="social-header">
        <h1>المنشورات</h1>
        <p>شارك أفكارك مع المجتمع</p>
      </div>

      {/* Search */}
      <div className="search-container">
        <div className="search-box-islamic">
          <Search size={20} />
          <input
            type="text"
            placeholder="ابحث عن منشورات، مستخدمين، #هاشتاغ..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => handleSearch('')}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {showSearch && searchResults.posts && (
        <div className="search-results-islamic">
          <h3>نتائج البحث</h3>
          
          {searchResults.users?.length > 0 && (
            <div className="search-section-islamic">
              <h4>المستخدمون ({searchResults.users.length})</h4>
              {searchResults.users.map(user => (
                <div key={user.id} className="user-result-islamic">
                  <div className="user-result-avatar-islamic">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div className="user-result-info-islamic">
                    <div className="user-result-name-islamic">{user.name}</div>
                    <div className="user-result-stats-islamic">
                      {getFollowersCount(user.id)} متابِع
                    </div>
                  </div>
                  {currentUser && user.id !== currentUser.id && (
                    <button
                      className={`follow-btn-islamic ${isFollowing(user.id) ? 'following' : ''}`}
                      onClick={() => handleFollow(user.id)}
                    >
                      {isFollowing(user.id) ? (
                        <>
                          <UserMinus size={16} />
                          إلغاء المتابعة
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
            <div className="search-section-islamic">
              <h4>المنشورات ({searchResults.posts.length})</h4>
            </div>
          )}
        </div>
      )}

      {/* Profile Section */}
      {!showSearch && currentUser && (
        <div className="profile-section-islamic">
          <div className="profile-header-islamic">
            <div className="profile-avatar-islamic" onClick={() => fileInputRef.current?.click()}>
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" />
              ) : (
                <span style={{fontSize: '24px'}}>👤</span>
              )}
            </div>
            <div className="profile-info-islamic">
              <div className="profile-name-islamic">{currentUser.name}</div>
              <div className="profile-stats-islamic">
                <span>{getFollowingCount(currentUser.id)} متابَع</span>
                <span>·</span>
                <span>{getFollowersCount(currentUser.id)} متابِع</span>
              </div>
            </div>
            <button className="upload-photo-btn" onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} />
              تحديث الصورة
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      {!showSearch && (
        <div className="feed-tabs-islamic">
          <button 
            className={`tab-islamic ${activeTab === 'forYou' ? 'active' : ''}`}
            onClick={() => setActiveTab('forYou')}
          >
            لك
          </button>
          <button 
            className={`tab-islamic ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            المتابَعون
          </button>
        </div>
      )}

      {/* Post Composer */}
      {!showSearch && currentUser && (
        <div className="post-composer-islamic">
          <div className="composer-header-islamic">
            <div className="composer-avatar-islamic">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" />
              ) : (
                <span style={{fontSize: '20px'}}>👤</span>
              )}
            </div>
            <div className="composer-input-islamic">
              <textarea
                placeholder="ماذا يدور في ذهنك؟ استخدم # للهاشتاغ و @ للإشارة"
                value={newPost}
                onChange={(e) => {
                  setNewPost(e.target.value);
                  setCharCount(e.target.value.length);
                }}
                maxLength={MAX_CHARS}
              />
            </div>
          </div>
          
          <div className="composer-footer-islamic">
            <div className="composer-tools-islamic">
              <button className="tool-btn-islamic" title="صورة">
                <ImageIcon size={20} />
              </button>
              <button className="tool-btn-islamic" title="رموز تعبيرية">
                <Smile size={20} />
              </button>
            </div>

            <div className="composer-submit-islamic">
              <span className={`char-counter-islamic ${charCount > 260 ? 'warning' : ''}`}>
                {charCount} / {MAX_CHARS}
              </span>
              <button 
                className="post-btn-islamic"
                onClick={handlePostSubmit}
                disabled={!newPost.trim() || charCount > MAX_CHARS}
              >
                نشر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt */}
      {!showSearch && !currentUser && (
        <div className="login-prompt-islamic">
          <div className="empty-icon-islamic">🌙</div>
          <h3>انضم إلى المجتمع</h3>
          <p>سجل الدخول لنشر المنشورات والتفاعل مع الآخرين</p>
          <button className="login-btn-islamic" onClick={() => window.location.hash = '#login'}>
            تسجيل الدخول
          </button>
        </div>
      )}

      {/* Posts Feed */}
      <div className="posts-feed-islamic">
        {(showSearch ? searchResults.posts : filteredPosts)?.length === 0 ? (
          <div className="empty-state-islamic">
            <div className="empty-icon-islamic">📝</div>
            <h2>{showSearch ? 'لا توجد نتائج' : 'لا توجد منشورات'}</h2>
            <p>{showSearch ? 'جرب البحث بكلمات أخرى' : activeTab === 'following' ? 'تابع حسابات لرؤية منشوراتهم' : 'كن أول من ينشر!'}</p>
          </div>
        ) : (
          (showSearch ? searchResults.posts : filteredPosts)?.map(post => {
            if (currentUser && !post.views?.includes(currentUser.id)) {
              setTimeout(() => trackView(post.id), 1000);
            }

            return (
              <div key={post.id} className="post-card-islamic">
                <div className="post-header-islamic">
                  <div className="post-avatar-islamic">
                    {post.userAvatar ? (
                      <img src={post.userAvatar} alt={post.userName} />
                    ) : (
                      <span style={{fontSize: '20px'}}>👤</span>
                    )}
                  </div>

                  <div className="post-info-islamic">
                    <div className="post-author-islamic">
                      <span className="author-name-islamic">{post.userName}</span>
                      {post.userRole === 'owner' && (
                        <span className="role-badge-islamic owner">👑 مالك</span>
                      )}
                      {post.userRole === 'admin' && (
                        <span className="role-badge-islamic admin">✓ مشرف</span>
                      )}
                      <span className="post-time-islamic">· {formatTime(post.createdAt)}</span>
                    </div>
                  </div>

                  {currentUser && (currentUser.id === post.userId || ['owner', 'admin'].includes(currentUser.role)) && (
                    <button className="post-menu-islamic" onClick={() => handleDelete(post.id)}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="post-content-islamic">
                  {renderTextWithLinks(post.content)}
                </div>

                {post.hashtags?.length > 0 && (
                  <div className="hashtags-container-islamic">
                    {post.hashtags.map((tag, idx) => (
                      <span key={idx} className="hashtag-badge-islamic" onClick={() => handleSearch(tag)}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Reply indicator */}
                {post.replyTo && (
                  <div className="reply-indicator">
                    <MessageCircle size={14} />
                    <span>رداً على @{post.replyToUser}</span>
                  </div>
                )}

                {/* Quoted post */}
                {post.quotedPost && (
                  <div className="quoted-post-islamic">
                    <div className="quoted-header">
                      <span className="quoted-author">{post.quotedPost.userName}</span>
                      <span className="quoted-time">· {formatTime(post.quotedPost.createdAt)}</span>
                    </div>
                    <div className="quoted-content">{post.quotedPost.content}</div>
                  </div>
                )}

                <div className="post-actions-islamic">
                  <button 
                    className="action-btn-islamic"
                    onClick={() => handleReply(post)}
                  >
                    <MessageCircle size={18} />
                    <span>{post.replies?.length || 0}</span>
                  </button>

                  <button 
                    className={`action-btn-islamic ${hasRetweeted(post) ? 'retweeted' : ''}`}
                    onClick={() => handleRepost(post.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleQuote(post);
                    }}
                    title="انقر للإعادة نشر، انقر بزر الماوس الأيمن للاقتباس"
                  >
                    <Share2 size={18} />
                    <span>{post.retweets?.length || 0}</span>
                  </button>

                  <button 
                    className={`action-btn-islamic ${post.likes?.includes(currentUser?.id) ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={18} />
                    <span>{formatNumber(post.likes?.length || 0)}</span>
                  </button>

                  <button className="action-btn-islamic">
                    <BarChart2 size={18} />
                    <span>{formatNumber(post.viewCount || 0)}</span>
                  </button>
                </div>

                {/* Thread toggle */}
                {getReplies(post.id).length > 0 && (
                  <button 
                    className="thread-toggle-btn"
                    onClick={() => toggleThread(post.id)}
                  >
                    {expandedThreads[post.id] ? '🔽' : '▶️'} 
                    {' '}عرض {getReplies(post.id).length} رد
                  </button>
                )}

                {/* Thread replies */}
                {expandedThreads[post.id] && getReplies(post.id).map(reply => (
                  <div key={reply.id} className="thread-reply">
                    <div className="reply-line"></div>
                    <div className="reply-content-wrapper">
                      <div className="post-header-islamic">
                        <div className="post-avatar-islamic small">
                          {reply.userAvatar ? (
                            <img src={reply.userAvatar} alt={reply.userName} />
                          ) : (
                            <span style={{fontSize: '16px'}}>👤</span>
                          )}
                        </div>
                        <div className="post-info-islamic">
                          <div className="post-author-islamic">
                            <span className="author-name-islamic">{reply.userName}</span>
                            <span className="post-time-islamic">· {formatTime(reply.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="post-content-islamic">
                        {renderTextWithLinks(reply.content)}
                      </div>
                      <div className="post-actions-islamic small">
                        <button 
                          className={`action-btn-islamic ${reply.likes?.includes(currentUser?.id) ? 'liked' : ''}`}
                          onClick={() => handleLike(reply.id)}
                        >
                          <Heart size={16} />
                          <span>{reply.likes?.length || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {currentUser && post.userId !== currentUser.id && (
                  <div className="follow-section-islamic">
                    <button
                      className={`follow-btn-islamic ${isFollowing(post.userId) ? 'following' : ''}`}
                      onClick={() => handleFollow(post.userId)}
                    >
                      {isFollowing(post.userId) ? 'إلغاء المتابعة' : 'متابعة'}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Trending Widget */}
      {!showSearch && getTrendingHashtags().length > 0 && (
        <div className="trending-widget-islamic">
          <h2>🔥 الهاشتاغات الرائجة</h2>
          {getTrendingHashtags().map((item, index) => (
            <div key={index} className="trending-item-islamic" onClick={() => handleSearch(item.tag)}>
              <div className="trending-tag-islamic">{item.tag}</div>
              <div className="trending-count-islamic">{item.count} منشور</div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && replyToPost && (
        <div className="modal-overlay" onClick={() => setShowReplyModal(false)}>
          <div className="modal-content-islamic" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>الرد على @{replyToPost.userName}</h3>
              <button className="modal-close" onClick={() => setShowReplyModal(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Original post */}
            <div className="original-post-preview">
              <div className="post-header-islamic">
                <div className="post-avatar-islamic small">
                  {replyToPost.userAvatar ? (
                    <img src={replyToPost.userAvatar} alt={replyToPost.userName} />
                  ) : (
                    <span style={{fontSize: '16px'}}>👤</span>
                  )}
                </div>
                <div className="post-info-islamic">
                  <span className="author-name-islamic">{replyToPost.userName}</span>
                  <span className="post-time-islamic">· {formatTime(replyToPost.createdAt)}</span>
                </div>
              </div>
              <div className="post-content-islamic">{replyToPost.content}</div>
            </div>

            {/* Reply composer */}
            <div className="reply-composer">
              <div className="composer-avatar-islamic small">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" />
                ) : (
                  <span style={{fontSize: '16px'}}>👤</span>
                )}
              </div>
              <textarea
                placeholder="اكتب ردك..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                maxLength={MAX_CHARS}
                autoFocus
              />
            </div>

            <div className="modal-footer">
              <span className="char-counter-islamic">{replyText.length} / {MAX_CHARS}</span>
              <button 
                className="post-btn-islamic"
                onClick={submitReply}
                disabled={!replyText.trim()}
              >
                رد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && quotePost && (
        <div className="modal-overlay" onClick={() => setShowQuoteModal(false)}>
          <div className="modal-content-islamic" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>اقتباس منشور</h3>
              <button className="modal-close" onClick={() => setShowQuoteModal(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Quote composer */}
            <div className="reply-composer">
              <div className="composer-avatar-islamic small">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" />
                ) : (
                  <span style={{fontSize: '16px'}}>👤</span>
                )}
              </div>
              <textarea
                placeholder="أضف تعليقك..."
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                maxLength={MAX_CHARS}
                autoFocus
              />
            </div>

            {/* Quoted post preview */}
            <div className="quoted-post-preview">
              <div className="post-header-islamic">
                <div className="post-avatar-islamic small">
                  {quotePost.userAvatar ? (
                    <img src={quotePost.userAvatar} alt={quotePost.userName} />
                  ) : (
                    <span style={{fontSize: '16px'}}>👤</span>
                  )}
                </div>
                <div className="post-info-islamic">
                  <span className="author-name-islamic">{quotePost.userName}</span>
                  <span className="post-time-islamic">· {formatTime(quotePost.createdAt)}</span>
                </div>
              </div>
              <div className="post-content-islamic">{quotePost.content}</div>
            </div>

            <div className="modal-footer">
              <span className="char-counter-islamic">{quoteText.length} / {MAX_CHARS}</span>
              <button 
                className="post-btn-islamic"
                onClick={submitQuote}
                disabled={!quoteText.trim()}
              >
                نشر الاقتباس
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IslamicSocialFeed;
