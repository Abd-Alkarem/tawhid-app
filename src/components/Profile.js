import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, LogOut, Users, Crown, X, Trash2, UserPlus, Smartphone } from 'lucide-react';
import { encryption } from '../utils/encryption';
import './Profile.css';

const Profile = ({ onClose, user, onLogout, onUserUpdate }) => {
  const [users, setUsers] = useState([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user && (user.role === 'owner' || user.role === 'admin')) {
      loadUsers();
    }
  }, [user]);

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
    setUsers(allUsers);
  };

  const handleLogout = () => {
    localStorage.removeItem('tawhid_current_user');
    onLogout();
    onClose();
  };

  const handleMakeAdmin = (userId) => {
    const allUsers = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { ...u, role: 'admin' } : u
    );
    localStorage.setItem('tawhid_users', JSON.stringify(updatedUsers));
    
    // Update current user if it's them
    if (user.id === userId) {
      const updatedUser = { ...user, role: 'admin' };
      localStorage.setItem('tawhid_current_user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);
    }
    
    loadUsers();
  };

  const handleRemoveAdmin = (userId) => {
    const allUsers = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { ...u, role: 'user' } : u
    );
    localStorage.setItem('tawhid_users', JSON.stringify(updatedUsers));
    loadUsers();
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      const allUsers = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
      const updatedUsers = allUsers.filter(u => u.id !== userId);
      localStorage.setItem('tawhid_users', JSON.stringify(updatedUsers));
      loadUsers();
    }
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    const allUsers = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
    const targetUser = allUsers.find(u => u.email === newAdminEmail);
    
    if (targetUser) {
      handleMakeAdmin(targetUser.id);
      setNewAdminEmail('');
      setShowAddAdmin(false);
    } else {
      alert('المستخدم غير موجود');
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      owner: { text: 'المالك', color: '#f59e0b', icon: <Crown size={16} /> },
      admin: { text: 'مشرف', color: '#10b981', icon: <Shield size={16} /> },
      user: { text: 'مستخدم', color: '#6b7280', icon: <User size={16} /> }
    };
    return badges[role] || badges.user;
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <h2>{user.name}</h2>
          <div className="role-badge" style={{ background: getRoleBadge(user.role).color }}>
            {getRoleBadge(user.role).icon}
            <span>{getRoleBadge(user.role).text}</span>
          </div>
        </div>

        {(user.role === 'owner' || user.role === 'admin') && (
          <div className="profile-tabs">
            <button
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              <span>الملف الشخصي</span>
            </button>
            <button
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} />
              <span>إدارة المستخدمين</span>
            </button>
          </div>
        )}

        <div className="profile-content">
          {activeTab === 'profile' ? (
            <div className="profile-info">
              <div className="info-item">
                <Mail size={20} />
                <div>
                  <label>البريد الإلكتروني</label>
                  <p>{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="info-item">
                  <Smartphone size={20} />
                  <div>
                    <label>رقم الهاتف</label>
                    <p>{user.phone}</p>
                  </div>
                </div>
              )}

              <div className="info-item">
                <Calendar size={20} />
                <div>
                  <label>تاريخ الانضمام</label>
                  <p>{new Date(user.createdAt).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>

              <div className="info-item">
                <Shield size={20} />
                <div>
                  <label>الصلاحيات</label>
                  <p>{getRoleBadge(user.role).text}</p>
                </div>
              </div>

              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          ) : (
            <div className="users-management">
              {user.role === 'owner' && (
                <div className="add-admin-section">
                  {!showAddAdmin ? (
                    <button className="add-admin-btn" onClick={() => setShowAddAdmin(true)}>
                      <UserPlus size={20} />
                      <span>إضافة مشرف جديد</span>
                    </button>
                  ) : (
                    <form className="add-admin-form" onSubmit={handleAddAdmin}>
                      <input
                        type="email"
                        placeholder="أدخل البريد الإلكتروني للمستخدم"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        required
                      />
                      <div className="form-actions">
                        <button type="submit">إضافة</button>
                        <button type="button" onClick={() => setShowAddAdmin(false)}>إلغاء</button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              <div className="users-list">
                <h3>جميع المستخدمين ({users.length})</h3>
                {users.map(u => (
                  <div key={u.id} className="user-card">
                    <div className="user-info">
                      <div className="user-avatar">
                        <User size={24} />
                      </div>
                      <div className="user-details">
                        <h4>{u.name}</h4>
                        <p>{u.email}</p>
                      </div>
                      <div className="role-badge" style={{ background: getRoleBadge(u.role).color }}>
                        {getRoleBadge(u.role).icon}
                        <span>{getRoleBadge(u.role).text}</span>
                      </div>
                    </div>

                    {user.role === 'owner' && u.id !== user.id && (
                      <div className="user-actions">
                        {u.role === 'user' && (
                          <button
                            className="action-btn make-admin"
                            onClick={() => handleMakeAdmin(u.id)}
                          >
                            <Shield size={16} />
                            <span>جعله مشرف</span>
                          </button>
                        )}
                        {u.role === 'admin' && (
                          <button
                            className="action-btn remove-admin"
                            onClick={() => handleRemoveAdmin(u.id)}
                          >
                            <Shield size={16} />
                            <span>إزالة الإشراف</span>
                          </button>
                        )}
                        {u.role !== 'owner' && (
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
