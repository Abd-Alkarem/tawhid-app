import React, { useState, useEffect } from 'react';
import { Mail, Smartphone, X, RefreshCw } from 'lucide-react';
import './VerificationModal.css';

const VerificationModal = ({ onClose, onVerify, email, phone, type = 'signup' }) => {
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [generatedEmailCode, setGeneratedEmailCode] = useState('');
  const [generatedPhoneCode, setGeneratedPhoneCode] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Generate verification codes
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    setGeneratedEmailCode(emailVerificationCode);
    setGeneratedPhoneCode(phoneVerificationCode);

    // Simulate sending codes (in production, this would be an API call)
    console.log('📧 Email Verification Code:', emailVerificationCode);
    console.log('📱 Phone Verification Code:', phoneVerificationCode);
    
    // Show alert with codes (for demo purposes)
    alert(`Verification Codes (Demo Mode):\n\nEmail Code: ${emailVerificationCode}\nPhone Code: ${phoneVerificationCode}\n\nIn production, these would be sent via email/SMS.`);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    const newEmailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newPhoneCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    setGeneratedEmailCode(newEmailCode);
    setGeneratedPhoneCode(newPhoneCode);
    setTimer(300);
    setCanResend(false);
    setError('');

    console.log('📧 New Email Code:', newEmailCode);
    console.log('📱 New Phone Code:', newPhoneCode);
    
    alert(`New Verification Codes:\n\nEmail: ${newEmailCode}\nPhone: ${newPhoneCode}`);
  };

  const handleVerify = () => {
    setError('');

    // Verify email code
    if (emailCode !== generatedEmailCode) {
      setError('رمز البريد الإلكتروني غير صحيح');
      return;
    }

    // Verify phone code if phone number was provided
    if (phone && phoneCode !== generatedPhoneCode) {
      setError('رمز الهاتف غير صحيح');
      return;
    }

    // If phone wasn't provided, only email verification is needed
    if (!phone && emailCode === generatedEmailCode) {
      onVerify();
      return;
    }

    // Both codes are correct
    onVerify();
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    return `${username[0]}${'*'.repeat(username.length - 2)}${username[username.length - 1]}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    if (phone.length <= 4) return phone;
    return `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}`;
  };

  return (
    <div className="verification-overlay" onClick={onClose}>
      <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
        <button className="verification-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="verification-header">
          <div className="verification-icon">
            <Mail size={48} />
          </div>
          <h2>التحقق من الحساب</h2>
          <p>أدخل رموز التحقق المرسلة</p>
        </div>

        <div className="verification-content">
          <div className="verification-info">
            <Mail size={20} />
            <div>
              <label>تم إرسال رمز إلى</label>
              <p>{maskEmail(email)}</p>
            </div>
          </div>

          <div className="code-input-group">
            <label>رمز البريد الإلكتروني</label>
            <input
              type="text"
              maxLength="6"
              placeholder="000000"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
              className="code-input"
            />
          </div>

          {phone && (
            <>
              <div className="verification-info">
                <Smartphone size={20} />
                <div>
                  <label>تم إرسال رمز إلى</label>
                  <p>{maskPhone(phone)}</p>
                </div>
              </div>

              <div className="code-input-group">
                <label>رمز الهاتف</label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="000000"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                  className="code-input"
                />
              </div>
            </>
          )}

          {error && <div className="verification-error">{error}</div>}

          <div className="verification-timer">
            {canResend ? (
              <button className="resend-btn" onClick={handleResend}>
                <RefreshCw size={16} />
                <span>إعادة إرسال الرموز</span>
              </button>
            ) : (
              <p>يمكنك إعادة الإرسال بعد {formatTime(timer)}</p>
            )}
          </div>

          <button
            className="verify-btn"
            onClick={handleVerify}
            disabled={!emailCode || (phone && !phoneCode)}
          >
            تحقق الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
