# Social Feed Feature - Twitter-like Posts

## Overview
The Tawhid app now includes a Twitter-like social feed where users can post text updates and interact with each other's posts.

## Features

### 📝 Post Creation
- **Text-only posts** (no images or files)
- **280 character limit** (like Twitter)
- **Character counter** with warning when approaching limit
- **Real-time posting** with instant feed update
- **User authentication required** to post

### ❤️ Interactions
- **Like posts** - Heart button with counter
- **View likes count** - See how many people liked
- **Unlike posts** - Toggle like on/off
- **Delete own posts** - Remove your posts
- **Admin/Owner deletion** - Admins can delete any post

### 👤 User Features
- **User avatars** - Colored circular avatars
- **Role badges** - Owner (gold) and Admin (green) badges
- **Timestamps** - Relative time (e.g., "منذ 5 دقائق")
- **User profiles** - Display name and role

### 🎨 Design
- **Twitter-inspired UI** - Familiar and clean design
- **Blue gradient header** - Twitter-like branding
- **Responsive layout** - Works on all screen sizes
- **Smooth animations** - Hover effects and transitions
- **Empty state** - Friendly message when no posts

## How to Use

### Creating a Post
1. **Login required** - Must be logged in to post
2. Click on **"المنشورات"** (Posts) tab in bottom navigation
3. Type your message in the text area
4. Character counter shows remaining characters
5. Click **"نشر"** (Post) button
6. Post appears instantly at the top of feed

### Liking Posts
1. Click the **heart icon** on any post
2. Heart fills red and counter increases
3. Click again to unlike
4. Must be logged in to like

### Deleting Posts
1. **Own posts**: Click trash icon on your posts
2. **Admin/Owner**: Can delete any post
3. Confirmation dialog appears
4. Post removed permanently

## User Interface

### Post Composer
```
┌─────────────────────────────────────┐
│ 👤 Your Name [Owner/Admin Badge]    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ماذا يدور في ذهنك؟             │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 0 / 280              [📤 نشر]      │
└─────────────────────────────────────┘
```

### Post Card
```
┌─────────────────────────────────────┐
│ 👤 User Name [Badge]    🗑️         │
│    ⏰ منذ 5 دقائق                   │
│                                     │
│ Post content goes here...           │
│ Can be multiple lines               │
│                                     │
│ ────────────────────────────────── │
│ ❤️ 5    💬 0    🔗                 │
└─────────────────────────────────────┘
```

## Role Badges

| Role | Badge | Color | Permissions |
|------|-------|-------|-------------|
| Owner | المالك | Gold (#f59e0b) | Delete any post |
| Admin | مشرف | Green (#10b981) | Delete any post |
| User | - | - | Delete own posts only |

## Data Storage

Posts are stored in localStorage:

```javascript
{
  id: "1234567890",
  userId: "user_id",
  userName: "User Name",
  userRole: "owner" | "admin" | "user",
  content: "Post text content",
  likes: ["user_id_1", "user_id_2"],
  comments: [], // Reserved for future
  createdAt: "2024-10-27T20:00:00.000Z"
}
```

## Time Display

Posts show relative time:
- **< 1 minute**: "الآن" (Now)
- **< 60 minutes**: "منذ X دقيقة" (X minutes ago)
- **< 24 hours**: "منذ X ساعة" (X hours ago)
- **< 7 days**: "منذ X يوم" (X days ago)
- **> 7 days**: Full date in Arabic

## Responsive Design

### Desktop (> 768px)
- Full-width post composer
- Spacious post cards
- All action buttons with text

### Tablet (481px - 768px)
- Adjusted padding
- Optimized spacing
- Readable text sizes

### Mobile (< 480px)
- Compact composer
- Smaller avatars
- Icon-only action buttons
- Touch-friendly targets

## Future Enhancements

### Planned Features
- 💬 **Comments** - Reply to posts
- 🔗 **Share** - Share posts
- 📌 **Pin posts** - Pin important posts
- 🔍 **Search** - Search posts
- #️⃣ **Hashtags** - Tag posts
- 📊 **Trending** - Popular posts
- 🔔 **Notifications** - Like/comment alerts
- 📷 **Images** - Upload images (optional)
- 🎥 **Videos** - Share videos (optional)
- ✏️ **Edit posts** - Edit after posting
- 📱 **Mentions** - @mention users

### Backend Integration (Production)
- Real-time updates with WebSocket
- Database storage (MongoDB/PostgreSQL)
- Image upload to cloud storage
- Push notifications
- Content moderation
- Report/block users
- Analytics and insights

## Console Commands

### View All Posts
```javascript
const posts = JSON.parse(localStorage.getItem('tawhid_posts') || '[]');
console.table(posts);
```

### Clear All Posts
```javascript
localStorage.removeItem('tawhid_posts');
location.reload();
```

### Export Posts
```javascript
const posts = JSON.parse(localStorage.getItem('tawhid_posts') || '[]');
const dataStr = JSON.stringify(posts, null, 2);
console.log(dataStr);
```

## Security & Moderation

### Current Implementation
- ✅ Login required to post
- ✅ User ID tracking
- ✅ Role-based deletion
- ✅ Character limit enforcement
- ✅ XSS protection (React escapes HTML)

### Production Recommendations
- Content filtering for inappropriate words
- Rate limiting (prevent spam)
- Report system
- Block/mute users
- Admin moderation panel
- Automated content moderation
- IP tracking and bans

## Accessibility

- ✅ Keyboard navigation
- ✅ Screen reader friendly
- ✅ High contrast colors
- ✅ Clear focus indicators
- ✅ Semantic HTML
- ✅ ARIA labels

## Performance

- ✅ Efficient rendering
- ✅ Optimized re-renders
- ✅ Lazy loading ready
- ✅ Minimal bundle size
- ✅ Fast localStorage access

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ⚠️ IE11 not supported

## Files Created

- `src/components/SocialFeed.js` - Main component
- `src/components/SocialFeed.css` - Styles
- `SOCIAL_FEED_GUIDE.md` - This documentation

## Files Modified

- `src/components/BottomNav.js` - Added Posts tab
- `src/App.js` - Integrated SocialFeed

---

**Enjoy sharing your thoughts with the Tawhid community! 🎉📱💬**
