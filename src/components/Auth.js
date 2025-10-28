import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, X, Smartphone } from 'lucide-react';
import { encryption } from '../utils/encryption';
import VerificationModal from './VerificationModal';
import './Auth.css';

const Auth = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (isLogin) {
      // Login logic with backward compatibility for old unencrypted accounts
      const users = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
      
      for (const user of users) {
        let userEmail = user.email;
        let userName = user.name;
        let userPhone = user.phone;
        
        // Try to decrypt - if it fails, it's an old unencrypted account
        try {
          const decrypted = encryption.decrypt(user.email);
          // Check if decryption produced valid email format
          if (decrypted && decrypted.includes('@')) {
            userEmail = decrypted;
            userName = encryption.decrypt(user.name);
            userPhone = user.phone ? encryption.decrypt(user.phone) : null;
          }
        } catch (e) {
          // Old unencrypted account - use as is
          userEmail = user.email;
          userName = user.name;
          userPhone = user.phone;
        }
        
        // Check if email matches
        if (userEmail === formData.email) {
          // Check password - handle both hashed and plain text (old accounts)
          let isPasswordValid = false;
          
          try {
            // Try new hashed password verification
            isPasswordValid = await encryption.verifyPassword(formData.password, user.password);
          } catch (e) {
            // Fallback to plain text comparison for old accounts
            isPasswordValid = (formData.password === user.password);
          }
          
          if (isPasswordValid) {
            // Create session with decrypted data for display
            const sessionUser = {
              ...user,
              name: userName,
              email: userEmail,
              phone: userPhone
            };
            localStorage.setItem('tawhid_current_user', JSON.stringify(sessionUser));
            onLogin(sessionUser);
            onClose();
            return;
          }
        }
      }
      
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } else {
      // Signup logic - show verification modal
      const users = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
      
      // Check if email already exists (decrypt to check)
      for (const user of users) {
        if (encryption.decrypt(user.email) === formData.email) {
          setError('البريد الإلكتروني مستخدم بالفعل');
          return;
        }
      }

      // Create pending user with encrypted data
      const hashedPassword = await encryption.hashPassword(formData.password);
      
      // Check if an owner already exists (prevent multiple owners)
      const hasOwner = users.some(u => u.role === 'owner');
      
      const newUser = {
        id: Date.now().toString(),
        name: encryption.encrypt(formData.name),
        email: encryption.encrypt(formData.email),
        phone: formData.phone ? encryption.encrypt(formData.phone) : null,
        password: hashedPassword,
        role: hasOwner ? 'user' : 'owner', // Only first user ever becomes owner
        createdAt: new Date().toISOString(),
        avatar: null,
        verified: false
      };

      setPendingUser(newUser);
      setShowVerification(true);
    }
  };

  const handleVerificationComplete = () => {
    if (pendingUser) {
      // Mark as verified
      pendingUser.verified = true;
      
      const users = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
      users.push(pendingUser);
      localStorage.setItem('tawhid_users', JSON.stringify(users));
      
      // Create session with decrypted data
      const sessionUser = {
        ...pendingUser,
        name: encryption.decrypt(pendingUser.name),
        email: encryption.decrypt(pendingUser.email),
        phone: pendingUser.phone ? encryption.decrypt(pendingUser.phone) : null
      };
      
      localStorage.setItem('tawhid_current_user', JSON.stringify(sessionUser));
      onLogin(sessionUser);
      setShowVerification(false);
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="auth-header">
          <div className="auth-icon">
            <User size={48} />
          </div>
          <h2>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
          <p>{isLogin ? 'مرحباً بعودتك' : 'انضم إلى مجتمع توحيد'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>
                <User size={20} />
                <span>الاسم</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>
              <Mail size={20} />
              <span>البريد الإلكتروني</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>
                <Smartphone size={20} />
                <span>رقم الهاتف (اختياري)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+966 XX XXX XXXX"
              />
            </div>
          )}

          <div className="form-group">
            <label>
              <Lock size={20} />
              <span>كلمة المرور</span>
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>
                <Lock size={20} />
                <span>تأكيد كلمة المرور</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}
            </button>
          </p>
        </div>
      </div>

      {showVerification && (
        <VerificationModal
          onClose={() => setShowVerification(false)}
          onVerify={handleVerificationComplete}
          email={formData.email}
          phone={formData.phone}
          type="signup"
        />
      )}
    </div>
  );
};

export default Auth;
