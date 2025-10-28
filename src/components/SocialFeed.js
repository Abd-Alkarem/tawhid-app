import React, { useState, useEffect } from 'react';
import { Send, Heart, MessageCircle, Share2, Trash2, User, Clock } from 'lucide-react';
import './SocialFeed.css';

const SocialFeed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [charCount, setCharCount] = useState(0);
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
      alert('يجب تسجيل الدخول للنشر');
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
      comments: [],
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
        // Trigger login modal (you'll need to pass this from App.js)
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
    if (window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem('tawhid_posts', JSON.stringify(updatedPosts));
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setNewPost(text);
      setCharCount(text.length);
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
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    
    return date.toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getRoleBadge = (role) => {
    const badges = {
      owner: { text: 'المالك', color: '#f59e0b' },
      admin: { text: 'مشرف', color: '#10b981' },
      user: { text: '', color: '' }
    };
    return badges[role] || badges.user;
  };

  return (
    <div className="social-feed">
      <div className="feed-header">
        <h2>المنشورات</h2>
        <p>شارك أفكارك مع المجتمع</p>
      </div>

      {/* Post Composer */}
      {currentUser ? (
        <div className="post-composer">
          <div className="composer-header">
            <div className="user-avatar">
              <User size={24} />
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              {currentUser.role !== 'user' && (
                <span 
                  className="role-badge" 
                  style={{ background: getRoleBadge(currentUser.role).color }}
                >
                  {getRoleBadge(currentUser.role).text}
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handlePostSubmit}>
            <textarea
              className="post-input"
              placeholder="ماذا يدور في ذهنك؟"
              value={newPost}
              onChange={handleInputChange}
              rows="3"
            />
            
            <div className="composer-footer">
              <span className={`char-counter ${charCount > MAX_CHARS - 20 ? 'warning' : ''}`}>
                {charCount} / {MAX_CHARS}
              </span>
              <button 
                type="submit" 
                className="post-btn"
                disabled={!newPost.trim() || charCount > MAX_CHARS}
              >
                <Send size={18} />
                <span>نشر</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="login-prompt">
          <User size={48} className="login-icon" />
          <h3>انضم إلى المحادثة</h3>
          <p>سجل الدخول لنشر المنشورات والتفاعل مع المجتمع</p>
          <button className="login-prompt-btn" onClick={() => window.location.hash = '#login'}>
            تسجيل الدخول
          </button>
          <span className="browse-note">يمكنك تصفح المنشورات بدون تسجيل الدخول</span>
        </div>
      )}

      {/* Posts Feed */}
      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <MessageCircle size={48} />
            <p>لا توجد منشورات بعد</p>
            <span>كن أول من ينشر!</span>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-user">
                  <div className="user-avatar">
                    <User size={20} />
                  </div>
                  <div className="user-details">
                    <div className="user-name-row">
                      <span className="user-name">{post.userName}</span>
                      {post.userRole !== 'user' && (
                        <span 
                          className="role-badge small" 
                          style={{ background: getRoleBadge(post.userRole).color }}
                        >
                          {getRoleBadge(post.userRole).text}
                        </span>
                      )}
                    </div>
                    <span className="post-time">
                      <Clock size={14} />
                      {formatTime(post.createdAt)}
                    </span>
                  </div>
                </div>

                {currentUser && (currentUser.id === post.userId || currentUser.role === 'owner' || currentUser.role === 'admin') && (
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="post-content">
                <p>{post.content}</p>
              </div>

              <div className="post-actions">
                <button 
                  className={`action-btn ${post.likes?.includes(currentUser?.id) ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                  title={!currentUser ? 'سجل الدخول للإعجاب' : ''}
                >
                  <Heart size={18} />
                  <span>{post.likes?.length || 0}</span>
                </button>

                <button 
                  className="action-btn" 
                  onClick={() => !currentUser && window.confirm('يجب تسجيل الدخول للتعليق. هل تريد تسجيل الدخول الآن؟') && (window.location.hash = '#login')}
                  title={!currentUser ? 'سجل الدخول للتعليق' : ''}
                >
                  <MessageCircle size={18} />
                  <span>{post.comments?.length || 0}</span>
                </button>

                <button 
                  className="action-btn"
                  onClick={() => !currentUser && window.confirm('يجب تسجيل الدخول للمشاركة. هل تريد تسجيل الدخول الآن؟') && (window.location.hash = '#login')}
                  title={!currentUser ? 'سجل الدخول للمشاركة' : ''}
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SocialFeed;
