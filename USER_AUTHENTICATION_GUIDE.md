# User Authentication & Admin Management System

## Overview
The Tawhid app now includes a complete user authentication system with role-based access control and admin management capabilities.

## Features

### 1. **User Roles**
- **Owner**: The first user to register becomes the owner (full control)
- **Admin**: Can be promoted by the owner, has user management access
- **User**: Regular users with standard access

### 2. **Authentication**
- **Sign Up**: Create a new account with name, email, and password
- **Login**: Access your account with email and password
- **Logout**: Securely log out from your profile

### 3. **Profile Management**
- View your profile information
- See your role and join date
- Access user management (Owner/Admin only)

### 4. **Admin Management (Owner Only)**
- **View All Users**: See complete list of registered users
- **Promote to Admin**: Make any user an administrator
- **Remove Admin**: Demote admins back to regular users
- **Delete Users**: Remove users from the system (except owner)
- **Add Admin by Email**: Directly promote users by their email address

## How to Use

### First Time Setup
1. Click "تسجيل الدخول" (Login) button in the header
2. Click "إنشاء حساب" (Create Account)
3. Fill in your details:
   - Name
   - Email
   - Password
   - Confirm Password
4. Click "إنشاء الحساب" (Create Account)
5. **You are now the Owner!** (First user gets owner privileges)

### For Subsequent Users
1. Click "تسجيل الدخول" (Login) button
2. Click "إنشاء حساب" (Create Account)
3. Fill in your details
4. You'll be registered as a regular user
5. The owner can promote you to admin if needed

### Owner: Managing Admins
1. Click your name in the header to open your profile
2. Click "إدارة المستخدمين" (User Management) tab
3. You'll see all registered users with their roles
4. For each user, you can:
   - **Make Admin**: Click "جعله مشرف" button
   - **Remove Admin**: Click "إزالة الإشراف" button
   - **Delete User**: Click the trash icon
5. To add admin by email:
   - Click "إضافة مشرف جديد" (Add New Admin)
   - Enter the user's email address
   - Click "إضافة" (Add)

### Viewing Your Profile
1. Click your name in the header
2. View your:
   - Email address
   - Join date
   - Current role
3. Click "تسجيل الخروج" (Logout) to sign out

## Data Storage
- All user data is stored in browser's localStorage
- Data persists across sessions
- Data structure:
  ```javascript
  {
    id: "unique_id",
    name: "User Name",
    email: "user@email.com",
    password: "hashed_password", // Note: In production, use proper encryption
    role: "owner" | "admin" | "user",
    createdAt: "ISO_date_string",
    avatar: null
  }
  ```

## Security Notes
⚠️ **Important**: This is a client-side implementation suitable for demonstration purposes.

For production use, you should:
1. Implement server-side authentication
2. Use proper password hashing (bcrypt, argon2)
3. Add JWT tokens for session management
4. Implement HTTPS
5. Add rate limiting
6. Use a real database instead of localStorage
7. Add email verification
8. Implement password reset functionality

## Role Permissions

| Feature | User | Admin | Owner |
|---------|------|-------|-------|
| View Profile | ✅ | ✅ | ✅ |
| Use App Features | ✅ | ✅ | ✅ |
| View All Users | ❌ | ✅ | ✅ |
| Promote to Admin | ❌ | ❌ | ✅ |
| Remove Admin | ❌ | ❌ | ✅ |
| Delete Users | ❌ | ❌ | ✅ |
| Cannot be Deleted | ❌ | ❌ | ✅ |

## Components

### Auth.js
- Login/Signup modal
- Form validation
- Password visibility toggle
- Error handling

### Profile.js
- User profile display
- Role badge with icons
- User management interface (Owner/Admin)
- Logout functionality

### Integration
- Header shows login button when logged out
- Header shows user name when logged in
- Clicking user name opens profile
- User state persists across page reloads

## Future Enhancements
- Email verification
- Password reset
- Two-factor authentication
- User avatars
- Activity logs
- Permission customization
- Bulk user management
- Export user data
- User search and filters
