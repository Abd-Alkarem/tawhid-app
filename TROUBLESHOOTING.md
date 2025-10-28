# 🔧 Troubleshooting Guide

## ✅ Fixed Issues

### Error: "views.includes is not a function"
**Status:** ✅ FIXED

**What was wrong:**
- Old posts didn't have `views` array
- Code tried to call `.includes()` on undefined

**How it was fixed:**
- Added array validation in `loadData()`
- Ensures all arrays are properly initialized
- Backwards compatible with old posts

**What to do:**
- Refresh the page
- Error should be gone
- Old posts now work with new features

---

## 🐛 Common Issues

### 1. Profile Picture Not Uploading

**Symptoms:**
- Click upload but nothing happens
- Image doesn't show

**Solutions:**
- Check file size (< 5MB recommended)
- Use JPG or PNG format
- Clear browser cache
- Try different image

**Fix:**
```javascript
// In browser console:
localStorage.removeItem('profile_' + currentUser.id);
location.reload();
```

### 2. Posts Not Showing

**Symptoms:**
- Feed is empty
- Posts disappeared

**Solutions:**
- Check if you're on "Following" tab (shows only followed users)
- Switch to "For You" tab
- Check localStorage

**Fix:**
```javascript
// In browser console:
const posts = JSON.parse(localStorage.getItem('tawhid_posts') || '[]');
console.log('Posts:', posts.length);
```

### 3. Follow Button Not Working

**Symptoms:**
- Click follow but nothing happens
- Count doesn't update

**Solutions:**
- Make sure you're logged in
- Refresh the page
- Check localStorage quota

**Fix:**
```javascript
// In browser console:
localStorage.removeItem('following_' + currentUser.id);
localStorage.removeItem('followers_' + userId);
location.reload();
```

### 4. Search Not Finding Results

**Symptoms:**
- Type in search but no results
- Results are incomplete

**Solutions:**
- Check spelling
- Try different keywords
- Make sure posts exist with that content
- Clear search and try again

**Fix:**
- Click X button to clear search
- Type new query
- Results appear instantly

### 5. Hashtags Not Clickable

**Symptoms:**
- Hashtags appear but not blue
- Can't click them

**Solutions:**
- Make sure hashtag starts with #
- No spaces in hashtag
- Refresh page

**Example:**
- ✅ `#رمضان` - Works
- ❌ `# رمضان` - Doesn't work (space)
- ❌ `رمضان#` - Doesn't work (wrong position)

### 6. Views Not Counting

**Symptoms:**
- View count stays at 0
- Views not increasing

**Solutions:**
- Make sure you're logged in
- Wait 1 second after post appears
- Each user counted only once
- Refresh to see updated count

**How it works:**
- Post must be visible for 1 second
- User ID added to views array
- Count increments
- Same user can't add multiple views

### 7. Mentions Not Working

**Symptoms:**
- @mentions not highlighted
- Can't click mentions

**Solutions:**
- Make sure mention starts with @
- No spaces after @
- Username must exist

**Example:**
- ✅ `@أحمد` - Works
- ❌ `@ أحمد` - Doesn't work (space)
- ❌ `أحمد@` - Doesn't work (wrong position)

---

## 🔄 Reset Options

### Option 1: Clear All Posts
```javascript
// In browser console:
localStorage.removeItem('tawhid_posts');
location.reload();
```

### Option 2: Clear All Users
```javascript
// In browser console:
localStorage.removeItem('tawhid_users');
localStorage.removeItem('tawhid_current_user');
location.reload();
```

### Option 3: Clear Everything
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### Option 4: Clear Specific User Data
```javascript
// In browser console:
// Replace USER_ID with actual ID
localStorage.removeItem('profile_USER_ID');
localStorage.removeItem('following_USER_ID');
localStorage.removeItem('followers_USER_ID');
location.reload();
```

---

## 🔍 Debug Tools

### Check Posts
```javascript
// In browser console:
const posts = JSON.parse(localStorage.getItem('tawhid_posts') || '[]');
console.table(posts.map(p => ({
  id: p.id,
  user: p.userName,
  likes: p.likes?.length || 0,
  views: p.viewCount || 0,
  hashtags: p.hashtags?.length || 0
})));
```

### Check Following
```javascript
// In browser console:
// Replace USER_ID with your ID
const following = JSON.parse(localStorage.getItem('following_USER_ID') || '[]');
console.log('Following:', following.length, 'users');
console.log(following);
```

### Check Followers
```javascript
// In browser console:
// Replace USER_ID with your ID
const followers = JSON.parse(localStorage.getItem('followers_USER_ID') || '[]');
console.log('Followers:', followers.length, 'users');
console.log(followers);
```

### Check Profile Picture
```javascript
// In browser console:
// Replace USER_ID with your ID
const profile = localStorage.getItem('profile_USER_ID');
if (profile) {
  const data = JSON.parse(profile);
  console.log('Profile picture exists:', data.picture.substring(0, 50) + '...');
} else {
  console.log('No profile picture');
}
```

### Check Storage Usage
```javascript
// In browser console:
let total = 0;
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    total += localStorage[key].length + key.length;
  }
}
console.log('Storage used:', (total / 1024).toFixed(2), 'KB');
console.log('Limit: ~5-10 MB');
```

---

## ⚠️ Known Limitations

### localStorage Limits
- **Size:** ~5-10 MB per domain
- **Scope:** Per browser (not synced)
- **Persistence:** Until manually cleared

**Solution:** Set up Firebase for unlimited storage

### Browser-Specific Data
- Each browser has separate data
- Incognito mode has separate data
- Different devices have separate data

**Solution:** Set up Firebase for cross-device sync

### Performance
- Large images slow down app
- Many posts slow down loading
- Search can be slow with many posts

**Solution:**
- Compress images before upload
- Limit post history
- Set up Firebase for better performance

---

## 🆘 Still Having Issues?

### Step 1: Check Console
1. Press F12
2. Go to Console tab
3. Look for red errors
4. Copy error message

### Step 2: Check Network
1. Press F12
2. Go to Network tab
3. Refresh page
4. Look for failed requests

### Step 3: Check Storage
1. Press F12
2. Go to Application tab
3. Click Local Storage
4. Check data exists

### Step 4: Try Safe Mode
1. Open incognito/private window
2. Test the app
3. If works → Clear cache in normal window
4. If doesn't work → Code issue

### Step 5: Reset Everything
```javascript
// Last resort - deletes everything
localStorage.clear();
location.reload();
```

---

## 📞 Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Can't login | Clear localStorage and try again |
| Posts missing | Check "For You" tab, not "Following" |
| Follow not working | Refresh page |
| Search empty | Make sure posts exist |
| Profile pic missing | Re-upload image |
| Hashtags not blue | Check format: #word |
| Mentions not blue | Check format: @word |
| Views at 0 | Login and wait 1 second |

---

## ✅ Verification Checklist

After fixing issues, verify:

- [ ] Can login successfully
- [ ] Can create posts
- [ ] Can upload profile picture
- [ ] Can follow/unfollow users
- [ ] Can see view counts
- [ ] Hashtags are clickable
- [ ] Mentions are clickable
- [ ] Search works
- [ ] Following tab shows correct posts
- [ ] Trending shows real hashtags

---

**Most issues are fixed by refreshing the page!** 🔄

If problem persists, try clearing localStorage and starting fresh.
