# Shamela Books Integration Setup

## Overview
This app now includes a proxy server to fetch real book content from Shamela.ws and display it directly in your app.

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Enable cross-origin requests
- `axios` - HTTP client for fetching pages
- `cheerio` - HTML parser to extract content
- `concurrently` - Run multiple commands simultaneously

### 2. Start the Application

**Option A: Run Both Servers Together (Recommended)**
```bash
npm run dev
```

This starts:
- React app on `http://localhost:3000`
- Proxy server on `http://localhost:3001`

**Option B: Run Separately**

Terminal 1 - React App:
```bash
npm start
```

Terminal 2 - Proxy Server:
```bash
npm run server
```
# Terminal 1
cd server
npm start


git add .
git commit -m "Fix"
git push

npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npm run build
npx cap add android
npx cap open android

## How It Works

1. **User clicks a book** → React app sends request to proxy server
2. **Proxy server** → Fetches book page from shamela.ws
3. **Extracts content** → Parses HTML and extracts book text
4. **Returns to app** → Content displayed in your app

## Features

✅ **500+ Books** from Shamela database
✅ **Real Content** fetched and displayed
✅ **No CORS Issues** - Proxy server handles it
✅ **Pagination** - Content split into readable pagesnpm start
✅ **Search & Filter** - Find books by category
✅ **Offline Fallback** - Shows info if content unavailable

## Troubleshooting

### "Proxy server error" or "Make sure proxy server is running"
- Make sure you ran `npm install`
- Start the proxy server: `npm run server`
- Check if port 3001 is available

### No content showing
- Check browser console (F12) for errors
- Verify proxy server is running (should see logs)
- Some books may not have content available

### Port already in use
- Change port in `server.js`: `const PORT = 3002;`
- Update Books.js fetch URL to match new port

## API Endpoints

### GET /api/book/:bookId
Fetches book content from Shamela

**Example:**
```bash
curl http://localhost:3001/api/book/6387
```

**Response:**
```json
{
  "success": true,
  "bookId": "6387",
  "content": "<html content>",
  "length": 12345
}
```

### GET /health
Check if server is running

```bash
curl http://localhost:3001/health
```

## Production Deployment

For production, you'll need to:
1. Deploy the proxy server separately (Heroku, Railway, etc.)
2. Update the fetch URL in Books.js to your deployed server
3. Add rate limiting and caching for better performance

## Notes

- The proxy server respects Shamela's content
- Content is fetched on-demand, not stored
- First load may be slow as it fetches from Shamela
- Consider adding caching for frequently accessed books
