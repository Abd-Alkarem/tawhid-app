const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/hadiths.db');
const fs = require('fs');

const collections = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah'];

async function extractBooks(collection) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT DISTINCT 
        bookNumber,
        arabicBabName,
        englishBabName
      FROM HadithTable 
      WHERE collection = ?
      ORDER BY CAST(CASE WHEN bookNumber = 'introduction' THEN '-1' ELSE bookNumber END AS INTEGER)
      LIMIT 1000
    `;
    
    db.all(sql, [collection], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Group by bookNumber and get the first bab name (which is usually the book title)
        const books = {};
        rows.forEach(row => {
          if (!books[row.bookNumber]) {
            // Extract book title from the first bab name
            let arabicTitle = row.arabicBabName || '';
            let englishTitle = row.englishBabName || '';
            
            // Try to extract "كتاب" part from Arabic
            const kitabMatch = arabicTitle.match(/كتاب\s+[^،]+/);
            if (kitabMatch) {
              arabicTitle = kitabMatch[0];
            }
            
            // Clean up English title
            if (englishTitle.toLowerCase().includes('chapter')) {
              const bookMatch = englishTitle.match(/The Book of [^,]+/i);
              if (bookMatch) {
                englishTitle = bookMatch[0];
              }
            }
            
            books[row.bookNumber] = {
              ar: arabicTitle.trim(),
              en: englishTitle.trim()
            };
          }
        });
        
        resolve(books);
      }
    });
  });
}

async function main() {
  console.log('Extracting book titles from database...\n');
  
  for (const collection of collections) {
    try {
      const books = await extractBooks(collection);
      const filename = `${collection}-books-extracted.json`;
      
      fs.writeFileSync(filename, JSON.stringify(books, null, 2), 'utf8');
      console.log(`✅ ${collection}: ${Object.keys(books).length} books extracted to ${filename}`);
      
      // Show first 3 books as preview
      const preview = Object.entries(books).slice(0, 3);
      preview.forEach(([num, title]) => {
        console.log(`   ${num}: ${title.ar} | ${title.en}`);
      });
      console.log('');
    } catch (err) {
      console.error(`❌ Error extracting ${collection}:`, err);
    }
  }
  
  db.close();
}

main();
