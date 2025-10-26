const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Cache for downloaded books
const bookCache = new Map();

// Proxy endpoint to fetch book content from Shamela
app.get('/api/book/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    
    console.log(`\n=== Fetching book ${bookId} ===`);
    
    // Check cache first
    if (bookCache.has(bookId)) {
      console.log('✓ Returning cached book');
      return res.json(bookCache.get(bookId));
    }
    
    // Try multiple approaches to get actual book content
    
    // Approach 1: Use shamela library to download complete book with ALL pages
    try {
      console.log('Trying shamela library (downloading book database)...');
      const { getBook } = await import('shamela');
      
      // This downloads the book's SQLite database and extracts ALL pages
      console.log('  - Downloading book database (this may take 10-30 seconds)...');
      const book = await getBook(parseInt(bookId));
      
      if (book && book.pages && book.pages.length > 0) {
        // Extract ALL page content
        const allPages = book.pages.map((page, idx) => {
          return `<div class="page-${idx + 1}">
                    <h3 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">
                      صفحة ${idx + 1}
                    </h3>
                    <div style="line-height: 2; text-align: right; padding: 20px 0;">
                      ${page.content}
                    </div>
                  </div>`;
        }).join('<br><br>');
        
        console.log(`✓ SUCCESS! Got complete book from shamela library!`);
        console.log(`  - Total Pages: ${book.pages.length}`);
        console.log(`  - Total Content: ${allPages.length} chars`);
        
        const response = {
          success: true,
          bookId,
          content: allPages,
          pages: book.pages.length,
          totalLength: allPages.length,
          source: 'shamela-library'
        };
        
        // Cache the result
        bookCache.set(bookId, response);
        
        return res.json(response);
      } else {
        console.log('  - Book downloaded but has no pages');
      }
    } catch (err) {
      console.log('Shamela library failed:', err.message);
      console.log('  - This is normal if book is not in Shamela database');
    }
    
    // Approach 2: Try to fetch from Shamela's text API endpoint
    try {
      const apiUrl = `https://shamela.ws/api/v1/books/${bookId}/text`;
      console.log(`Trying API: ${apiUrl}`);
      const apiResponse = await axios.get(apiUrl);
      
      if (apiResponse.data && apiResponse.data.text) {
        console.log(`✓ Got content from API (${apiResponse.data.text.length} chars)`);
        return res.json({
          success: true,
          bookId,
          content: apiResponse.data.text,
          source: 'api'
        });
      }
    } catch (err) {
      console.log('API approach failed:', err.message);
    }
    
    // Approach 2: Try to fetch book page and extract text content
    const bookUrl = `https://shamela.ws/book/${bookId}`;
    console.log(`Fetching page: ${bookUrl}`);
    
    const response = await axios.get(bookUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    // Parse HTML
    const $ = cheerio.load(response.data);
    
    // Try to extract book content from various possible selectors
    let content = '';
    let contentText = '';
    
    // Shamela-specific selectors (most likely to have full content)
    const shamelaSelectors = [
      '.nass',           // Main text container in Shamela
      '#nass',
      '.book-page',
      '.book-content',
      '.book-text',
      '.text',
      'article',
      '.content',
      'main',
      '#book-content',
      '.text-content',
      '[class*="book"]',
      '[class*="text"]',
      '[class*="content"]'
    ];
    
    // Try each selector
    for (const selector of shamelaSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        const html = element.html();
        const text = element.text().trim();
        
        if (text.length > contentText.length) {
          content = html;
          contentText = text;
          console.log(`Found content using selector: ${selector} (${text.length} chars)`);
        }
      }
    }
    
    // If still no good content, try to get all text from body
    if (contentText.length < 500) {
      // Get all divs with substantial text
      $('div').each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > contentText.length && text.length > 500) {
          content = $(el).html();
          contentText = text;
          console.log(`Found content in div (${text.length} chars)`);
        }
      });
    }
    
    // Last resort: get all paragraphs
    if (contentText.length < 500) {
      const paragraphs = $('p');
      if (paragraphs.length > 0) {
        content = paragraphs.map((i, el) => $(el).html()).get().join('<br><br>');
        contentText = paragraphs.map((i, el) => $(el).text()).get().join(' ');
        console.log(`Extracted ${paragraphs.length} paragraphs (${contentText.length} chars)`);
      }
    }
    
    console.log(`Total content length: ${contentText.length} characters`);
    
    // Clean up and extract only book text content
    if (content) {
      const $content = cheerio.load(content);
      
      // Remove ALL unwanted elements
      $content('script').remove();
      $content('style').remove();
      $content('nav').remove();
      $content('header').remove();
      $content('footer').remove();
      $content('form').remove();
      $content('input').remove();
      $content('button').remove();
      $content('select').remove();
      // Unwrap anchors but keep their text (many Shamela texts are inside <a>)
      $content('a').each((i, el) => {
        const txt = $content(el).text();
        $content(el).replaceWith(txt);
      });
      $content('.nav').remove();
      $content('.navigation').remove();
      $content('.menu').remove();
      $content('.header').remove();
      $content('.footer').remove();
      $content('.toc').remove();  // Remove table of contents
      $content('.index').remove();
      $content('[class*="nav"]').remove();
      $content('[class*="menu"]').remove();
      $content('[class*="toolbar"]').remove();
      $content('[class*="search"]').remove();
      $content('[class*="toc"]').remove();
      $content('[class*="index"]').remove();
      $content('[class*="فهرس"]').remove();
      
      // Try to find actual book text paragraphs
      let bookText = [];

      // Prefer the primary text container used by Shamela ('.nass' / '#nass')
      let primary = null;
      if ($content('.nass').length) primary = $content('.nass').first();
      else if ($content('#nass').length) primary = $content('#nass').first();

      if (primary) {
        // Preserve line breaks as paragraph boundaries
        const rawHtml = primary.html() || '';
        const withNewlines = rawHtml
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<p[^>]*>/gi, '')
          .replace(/<\/p>/gi, '\n')
          .replace(/<[^>]+>/g, '');
        const lines = withNewlines
          .split(/\n+/)
          .map(t => t.trim())
          .filter(t => t.length >= 8 && !/فهرس|نسخ الرابط|بحث|نشر/.test(t));
        bookText.push(...lines);
      }

      // If no good lines from primary, fall back to paragraphs
      if (bookText.length === 0) {
        $content('p').each((i, el) => {
          const text = $content(el).text().trim();
          if (text.length > 20 && !/فهرس|نسخ الرابط|بحث|نشر/.test(text)) {
            bookText.push(text);
          }
        });
      }
      
      // If no good paragraphs, try divs with text
      if (bookText.length === 0) {
        $content('div').each((i, el) => {
          const text = $content(el).text().trim();
          if (text.length > 80 && !/فهرس|نسخ الرابط|بحث|نشر/.test(text)) {
            bookText.push(text);
          }
        });
      }
      
      const finalContent = bookText.join('<br><br>');
      const finalText = bookText.join(' ');
      
      console.log(`Extracted ${bookText.length} text blocks`);
      console.log(`Final content length: ${finalText.length} characters`);
      
      if (finalText.length > 200) {
        const responsePayload = {
          success: true,
          bookId,
          content: finalContent,
          length: finalContent.length,
          textLength: finalText.length,
          blocks: bookText.length,
          source: 'extracted'
        };
        bookCache.set(bookId, responsePayload);
        return res.json(responsePayload);
      }
    }
    
    // Approach 4: Use Puppeteer to render JavaScript and get actual content
    console.log('Previous methods failed, trying Puppeteer (headless browser)...');
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.goto(bookUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // First, try to click on the book title to open the actual content
      try {
        // Look for the book title link that opens the reader
        await page.waitForSelector('a[href*="/reader/"], .book-title a, h1 a, h2 a', { timeout: 5000 });
        
        const clicked = await page.evaluate(() => {
          // Find and click the link to open the book reader
          const bookLink = document.querySelector('a[href*="/reader/"]') ||
                          document.querySelector('.book-title a') ||
                          document.querySelector('h1 a') ||
                          document.querySelector('h2 a') ||
                          document.querySelector('a[onclick*="read"]') ||
                          document.querySelector('a[onclick*="open"]');
          
          if (bookLink) {
            bookLink.click();
            return true;
          }
          return false;
        });
        
        if (clicked) {
          console.log('  - Clicked on book title, opening reader...');
          // Wait for the reader to load
          await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
        }
      } catch (err) {
        console.log('  - Could not find book title link, trying direct content extraction...');
      }
      
      // Wait for the main content container
      await page.waitForSelector('.nass, #nass, .book-content, .page-content, #book-text, pre', { timeout: 10000 });
      
      // First, try to get ALL content if it's already loaded in the page
      let allTextAtOnce = null;
      try {
        allTextAtOnce = await page.evaluate(() => {
          // Some books load all content at once in a scrollable container
          const fullTextContainer = document.querySelector('pre') || 
                                    document.querySelector('.full-text') ||
                                    document.querySelector('[class*="full"]');
          
          if (fullTextContainer) {
            const text = fullTextContainer.innerText || fullTextContainer.textContent;
            if (text && text.length > 1000) {
              return text.trim();
            }
          }
          return null;
        });
        
        if (allTextAtOnce) {
          console.log(`  - Found full text container (${allTextAtOnce.length} chars)`);
        }
      } catch (err) {
        console.log('  - Error checking for full text:', err.message);
      }
      
      if (allTextAtOnce) {
        console.log(`✓ Got full book content at once! (${allTextAtOnce.length} chars)`);
        
        const paragraphs = allTextAtOnce
          .split(/\n+/)
          .map(p => p.trim())
          .filter(p => p.length > 20 && !/فهرس|نسخ الرابط|بحث|نشر/.test(p));
        
        const finalContent = paragraphs.join('<br><br>');
        
        const responsePayload = {
          success: true,
          bookId,
          content: finalContent,
          length: finalContent.length,
          textLength: allTextAtOnce.length,
          paragraphs: paragraphs.length,
          source: 'puppeteer-full'
        };
        
        bookCache.set(bookId, responsePayload);
        await browser.close();
        return res.json(responsePayload);
      }
      
      // Otherwise, get pages one by one
      let allContent = [];
      let currentPageNum = 1;
      const maxPages = 50; // Limit to prevent infinite loops
      
      while (currentPageNum <= maxPages) {
        // Extract current page content
        const pageContent = await page.evaluate(() => {
          // Try multiple selectors for Shamela's reader interface
          const container = document.querySelector('.nass') || 
                           document.querySelector('#nass') || 
                           document.querySelector('.book-content') ||
                           document.querySelector('.page-content') ||
                           document.querySelector('#book-text') ||
                           document.querySelector('.reading-area') ||
                           document.querySelector('[class*="text"]') ||
                           document.querySelector('pre'); // Some books use <pre> tags
          
          if (!container) return null;
          
          // Get all text, preserve line breaks
          const text = container.innerText || container.textContent;
          return text.trim();
        });
        
        if (pageContent && pageContent.length > 50) {
          allContent.push(pageContent);
          console.log(`  - Page ${currentPageNum}: ${pageContent.length} chars`);
        }
        
        // Try to go to next page
        const hasNextPage = await page.evaluate(() => {
          // Look for next page button/link - Shamela specific selectors
          const nextBtn = document.querySelector('a[title*="التالي"]') ||
                         document.querySelector('a[title*="التالية"]') ||
                         document.querySelector('a[title*="next"]') ||
                         document.querySelector('.next-page') ||
                         document.querySelector('[onclick*="nextPage"]') ||
                         document.querySelector('[onclick*="goNext"]') ||
                         document.querySelector('button:has-text("التالي")') ||
                         document.querySelector('a.next') ||
                         document.querySelector('[class*="next"]:not([class*="disabled"])') ||
                         document.querySelector('a[href*="page="]:last-child') ||
                         // Look for pagination links with page numbers
                         (() => {
                           const links = document.querySelectorAll('a[href*="/reader/"]');
                           for (let link of links) {
                             if (link.textContent.includes('»') || 
                                 link.textContent.includes('←') ||
                                 link.textContent.includes('التالي')) {
                               return link;
                             }
                           }
                           return null;
                         })();
          
          if (nextBtn && !nextBtn.disabled && !nextBtn.classList.contains('disabled')) {
            console.log('Found next button:', nextBtn.textContent || nextBtn.title);
            nextBtn.click();
            return true;
          }
          return false;
        });
        
        if (!hasNextPage) {
          console.log(`  - No more pages found after page ${currentPageNum}`);
          break;
        }
        
        if (currentPageNum >= 20) {
          // Stop after 20 pages to avoid very long waits
          console.log(`  - Reached page limit (20 pages)`);
          break;
        }
        
        // Wait for new content to load
        await page.waitForTimeout(2000); // Give more time for content to load
        currentPageNum++;
      }
      
      await browser.close();
      
      const fullBookContent = allContent.join('\n\n===الصفحة التالية===\n\n');
      
      if (fullBookContent && fullBookContent.length > 200) {
        console.log(`✓ Got content via Puppeteer! ${allContent.length} pages, ${fullBookContent.length} total chars`);
        
        // Split into paragraphs
        const paragraphs = fullBookContent
          .split(/\n+/)
          .map(p => p.trim())
          .filter(p => p.length > 20 && !/فهرس|نسخ الرابط|بحث|نشر/.test(p));
        
        const finalContent = paragraphs.join('<br><br>');
        
        const responsePayload = {
          success: true,
          bookId,
          content: finalContent,
          length: finalContent.length,
          textLength: fullBookContent.length,
          pages: allContent.length,
          paragraphs: paragraphs.length,
          source: 'puppeteer'
        };
        
        bookCache.set(bookId, responsePayload);
        return res.json(responsePayload);
      } else {
        console.log('Puppeteer returned no content');
      }
    } catch (err) {
      console.error('Puppeteer failed:', err.message);
      console.error('Full error:', err);
      // Make sure browser is closed even on error
      try {
        if (browser) await browser.close();
      } catch (e) {
        // Ignore close errors
      }
    }
    
    // Final fallback: return error
    res.json({
      success: false,
      message: 'Could not extract book content from any source',
      bookId
    });
    
  } catch (error) {
    console.error('Error fetching book:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Dorar.net API proxy endpoint
app.get('/api/dorar/search', async (req, res) => {
  try {
    const { skey, page = 1 } = req.query;
    
    if (!skey) {
      return res.status(400).json({ error: 'Search key is required' });
    }
    
    console.log(`\n=== Dorar.net Search: ${skey} (Page: ${page}) ===`);
    
    // Dorar.net API supports pagination with &page= parameter
    const dorarUrl = `https://dorar.net/dorar_api.json?skey=${encodeURIComponent(skey)}&page=${page}`;
    
    const response = await axios.get(dorarUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/javascript, */*',
        'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
        'Referer': 'https://dorar.net/'
      },
      timeout: 10000
    });
    
    // Dorar.net returns HTML inside ahadith.result, not a JSON array
    // We need to parse the HTML to extract hadith data
    const htmlResult = response.data?.ahadith?.result;
    
    if (!htmlResult) {
      console.log('No HTML result found');
      return res.json({ ahadith: [] });
    }
    
    // Parse HTML using cheerio
    const $ = cheerio.load(htmlResult);
    const ahadithArray = [];
    
    // Split by the separator "-------------- <br/>"
    const hadithBlocks = htmlResult.split('--------------');
    
    hadithBlocks.forEach((block, index) => {
      if (!block.trim()) return;
      
      const $block = cheerio.load(block);
      
      // Extract hadith text (remove the number prefix like "1 - ")
      let hadithText = $block('.hadith').text().trim();
      // Remove leading number and dash
      hadithText = hadithText.replace(/^\d+\s*-\s*/, '');
      
      if (!hadithText) return;
      
      // Extract metadata from hadith-info div
      const infoDiv = $block('.hadith-info');
      
      // Get all text and parse it
      const infoText = infoDiv.text();
      
      // Extract each field using regex or text parsing
      const rawiMatch = infoText.match(/الراوي:\s*([^]*?)(?=المحدث:|$)/);
      const mohdithMatch = infoText.match(/المحدث:\s*([^]*?)(?=المصدر:|$)/);
      const mhkmMatch = infoText.match(/المصدر:\s*([^]*?)(?=الصفحة أو الرقم:|$)/);
      const numMatch = infoText.match(/الصفحة أو الرقم:\s*([^]*?)(?=خلاصة حكم المحدث:|التخريج:|$)/);
      const gradeMatch = infoText.match(/خلاصة حكم المحدث:\s*([^]*?)(?=التخريج:|$)/);
      const takMatch = infoText.match(/التخريج:\s*([^]*?)$/);
      
      // Extract التصنيف الموضوعي from the full block HTML
      const tasnifMatch = block.match(/التصنيف الموضوعي:\s*([^<]*)/);
      
      ahadithArray.push({
        th: hadithText,
        hadith: hadithText,
        rawi: rawiMatch ? rawiMatch[1].trim() : '',
        mohdith: mohdithMatch ? mohdithMatch[1].trim() : '',
        mhkm: mhkmMatch ? mhkmMatch[1].trim() : '',
        num: numMatch ? numMatch[1].trim() : '',
        grade: gradeMatch ? gradeMatch[1].trim() : '',
        tak: takMatch ? takMatch[1].trim() : '',
        tasnif: tasnifMatch ? tasnifMatch[1].trim() : ''
      });
    });
    
    console.log(`✓ Parsed ${ahadithArray.length} hadiths from HTML`);
    
    res.json({ ahadith: ahadithArray });
    
  } catch (error) {
    console.error('Error fetching from Dorar.net:', error.message);
    res.status(500).json({
      error: error.message,
      ahadith: []
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Shamela proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`Shamela proxy server running on http://localhost:${PORT}`);
  console.log(`Use http://localhost:${PORT}/api/book/:bookId to fetch books`);
  console.log(`Use http://localhost:${PORT}/api/dorar/search?skey=TEXT to search hadiths`);
});
