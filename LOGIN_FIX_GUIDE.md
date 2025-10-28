# Login Issue Fix & Migration Guide

## Problem
After adding encryption, old accounts (created before encryption) cannot log in because the login system expects encrypted data.

## Solution
The system now has **backward compatibility** - it can handle both:
- ✅ Old unencrypted accounts
- ✅ New encrypted accounts

## How It Works

### Login Process
1. System tries to decrypt the email
2. If decryption works → encrypted account
3. If decryption fails → old unencrypted account
4. Password verification works for both types

### You Can Now:
- ✅ Login with old accounts (unencrypted)
- ✅ Login with new accounts (encrypted)
- ✅ Create new accounts (will be encrypted)
- ✅ Mix old and new accounts

## Migration Options

### Option 1: Keep Using Old Accounts (Recommended)
**No action needed!** The system works with your existing accounts.

- Old accounts work as-is
- New accounts will be encrypted
- Both types can coexist

### Option 2: Migrate Old Accounts to Encrypted Format
If you want to encrypt all existing accounts:

1. Open browser console (F12)
2. Run this command:
```javascript
await window.tawhidMigration.migrate()
```

This will:
- Encrypt all old account data
- Hash all passwords
- Keep all accounts working
- Show migration results

### Option 3: Start Fresh (Clean Slate)
If you want to delete everything and start over:

1. Open browser console (F12)
2. Run this command:
```javascript
window.tawhidMigration.reset()
```

⚠️ **WARNING**: This deletes ALL accounts!

## Console Tools Available

Open browser console (F12) and use:

### 1. Migrate Accounts
```javascript
await window.tawhidMigration.migrate()
```
- Encrypts all old accounts
- Safe to run multiple times
- Shows how many accounts migrated

### 2. Export Backup
```javascript
window.tawhidMigration.export()
```
- Downloads JSON file with all users
- Data is decrypted for backup
- Useful before migration

### 3. Reset Everything
```javascript
window.tawhidMigration.reset()
```
- Deletes all accounts
- Requires confirmation
- Cannot be undone!

## Testing Login

### Test with Old Account
1. Use email/password from before encryption
2. Should login successfully
3. Data displayed normally

### Test with New Account
1. Create new account (will be encrypted)
2. Verify with codes
3. Login with encrypted credentials
4. Should work perfectly

## Checking Account Type

Open browser console and run:
```javascript
const users = JSON.parse(localStorage.getItem('tawhid_users') || '[]');
console.table(users.map(u => ({
  email: u.email.includes('@') ? 'Unencrypted' : 'Encrypted',
  name: u.name.length > 50 ? 'Encrypted' : 'Unencrypted',
  password: u.password.length > 50 ? 'Hashed' : 'Plain'
})));
```

This shows which accounts are encrypted vs unencrypted.

## Troubleshooting

### Can't Login with Old Account
1. Check email is correct
2. Check password is correct
3. Try opening console for errors
4. Check localStorage has users:
```javascript
localStorage.getItem('tawhid_users')
```

### Want to See Stored Data
```javascript
// View all users (encrypted)
console.log(JSON.parse(localStorage.getItem('tawhid_users')));

// View current session (decrypted)
console.log(JSON.parse(localStorage.getItem('tawhid_current_user')));
```

### Migration Failed
1. Export backup first:
```javascript
window.tawhidMigration.export()
```

2. Try migration again:
```javascript
await window.tawhidMigration.migrate()
```

3. If still fails, reset and start fresh:
```javascript
window.tawhidMigration.reset()
```

## Data Format Examples

### Old Account (Unencrypted)
```json
{
  "id": "1234567890",
  "name": "John Doe",
  "email": "john@email.com",
  "password": "mypassword123",
  "role": "owner"
}
```

### New Account (Encrypted)
```json
{
  "id": "1234567890",
  "name": "Sm9obiBEb2U=",
  "email": "am9obkBlbWFpbC5jb20=",
  "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
  "role": "owner",
  "verified": true
}
```

## Best Practices

1. **Backup First**: Always export before migration
2. **Test Login**: Verify you can login before migrating
3. **Gradual Migration**: Old accounts work fine, migrate when ready
4. **Keep Credentials**: Save your email/password somewhere safe

## Security Notes

- Old accounts use plain text passwords (less secure)
- New accounts use hashed passwords (more secure)
- Migration improves security
- Backward compatibility is temporary feature
- Production should use only encrypted accounts

## Need Help?

If you're stuck:
1. Export your data as backup
2. Check console for errors
3. Try resetting and creating fresh account
4. Contact support with console error messages
