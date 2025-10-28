# How to Start Fresh - Reset All User Data

## Quick Reset (Browser Console)

1. **Open your app in the browser**
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Copy and paste this command:**

```javascript
localStorage.removeItem('tawhid_users');
localStorage.removeItem('tawhid_current_user');
alert('✅ All user data has been reset! Refresh the page.');
location.reload();
```

5. **Press Enter**
6. Done! All accounts deleted, you can create a new owner account.

## Alternative: Use Migration Tool

If the app is already running:

```javascript
window.tawhidMigration.reset()
```

This will:
- Ask for confirmation
- Delete all user accounts
- Clear current session
- Reload the page

## Manual Reset (If Console Doesn't Work)

1. Open Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** in the left sidebar
4. Click on your site URL
5. Find and delete these keys:
   - `tawhid_users`
   - `tawhid_current_user`
6. Refresh the page

## After Reset

1. The app will have no users
2. Create a new account
3. First account becomes the **Owner**
4. All data will be encrypted from the start

## What Gets Deleted

- ✅ All user accounts
- ✅ Current login session
- ✅ All encrypted data

## What Stays

- ✅ App settings
- ✅ Prayer times preferences
- ✅ Other app data (Quran progress, etc.)

## Start Fresh Now!

**Easiest Method:**
1. Open browser console (F12)
2. Paste this one-liner:
```javascript
localStorage.clear(); location.reload();
```

This clears EVERYTHING and reloads the page.

---

**Note:** After reset, the first account you create will automatically become the Owner with full admin privileges.
