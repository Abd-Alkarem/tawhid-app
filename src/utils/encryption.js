// Simple encryption utility using Web Crypto API
// For production, use a proper backend with bcrypt/argon2

class EncryptionService {
  constructor() {
    this.secretKey = 'tawhid-app-secret-key-2024'; // In production, use environment variable
  }

  // Simple XOR encryption (for demo purposes)
  // In production, use proper encryption libraries
  encrypt(text) {
    if (!text) return '';
    
    try {
      const encrypted = btoa(
        String.fromCharCode(
          ...new TextEncoder().encode(text).map((byte, i) => 
            byte ^ this.secretKey.charCodeAt(i % this.secretKey.length)
          )
        )
      );
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return text;
    }
  }

  decrypt(encryptedText) {
    if (!encryptedText) return '';
    
    try {
      const decrypted = new TextDecoder().decode(
        new Uint8Array(
          atob(encryptedText).split('').map((char, i) => 
            char.charCodeAt(0) ^ this.secretKey.charCodeAt(i % this.secretKey.length)
          )
        )
      );
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedText;
    }
  }

  // Hash password (one-way)
  async hashPassword(password) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + this.secretKey);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      console.error('Hashing error:', error);
      // Fallback to simple hash
      return this.encrypt(password);
    }
  }

  // Verify password against hash
  async verifyPassword(password, hash) {
    const hashedPassword = await this.hashPassword(password);
    return hashedPassword === hash;
  }

  // Generate verification code
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Mask email for display
  maskEmail(email) {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    return `${username[0]}${'*'.repeat(username.length - 2)}${username[username.length - 1]}@${domain}`;
  }

  // Mask phone for display
  maskPhone(phone) {
    if (!phone) return '';
    if (phone.length <= 4) return phone;
    return `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}`;
  }
}

export const encryption = new EncryptionService();
