const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/hadiths.db');
const fs = require('fs');

const collections = ['bulugh', 'forty', 'hisn', 'riyadussalihin', 'shamail', 'adab', 'mishkat'];

async function extractBookTitles(collection) {
  return new Promise((resolve, reject) => {
    // Get first bab of each book to extract book title
    const sql = `
      SELECT DISTINCT 
        bookNumber,
        MIN(babID) as firstBab
      FROM HadithTable 
      WHERE collection = ?
      GROUP BY bookNumber
      ORDER BY CAST(CASE WHEN bookNumber = 'introduction' THEN '-1' ELSE bookNumber END AS INTEGER)
    `;
    
    db.all(sql, [collection], (err, bookRows) => {
      if (err) {
        reject(err);
        return;
      }
      
      const books = {};
      let completed = 0;
      
      if (bookRows.length === 0) {
        resolve(books);
        return;
      }
      
      bookRows.forEach(bookRow => {
        const sql2 = `
          SELECT arabicBabName, englishBabName
          FROM HadithTable
          WHERE collection = ? AND bookNumber = ? AND babID = ?
          LIMIT 1
        `;
        
        db.get(sql2, [collection, bookRow.bookNumber, bookRow.firstBab], (err2, row) => {
          if (!err2 && row) {
            let arabicTitle = row.arabicBabName || `كتاب ${bookRow.bookNumber}`;
            let englishTitle = row.englishBabName || `Book ${bookRow.bookNumber}`;
            
            // Extract "كتاب" part from Arabic if it exists
            const kitabMatch = arabicTitle.match(/كتاب\s+[^\s،]+(\s+[^\s،]+)?/);
            if (kitabMatch) {
              arabicTitle = kitabMatch[0].trim();
            } else if (arabicTitle.includes('باب')) {
              // If it's a "bab", try to extract meaningful part
              arabicTitle = arabicTitle.replace(/^باب\s*/, '').split('،')[0].trim();
              if (!arabicTitle.startsWith('كتاب')) {
                arabicTitle = `كتاب ${arabicTitle}`;
              }
            }
            
            // Extract English book title
            if (englishTitle.toLowerCase().includes('the book of')) {
              const bookMatch = englishTitle.match(/The Book of [^,\n]+/i);
              if (bookMatch) {
                englishTitle = bookMatch[0].trim();
              }
            } else if (englishTitle.toLowerCase().includes('chapter')) {
              englishTitle = englishTitle.split(',')[0].trim();
              if (!englishTitle.toLowerCase().includes('book')) {
                englishTitle = `The Book of ${englishTitle.replace(/^Chapter\s+/i, '')}`;
              }
            }
            
            books[bookRow.bookNumber] = {
              ar: arabicTitle,
              en: englishTitle
            };
          }
          
          completed++;
          if (completed === bookRows.length) {
            resolve(books);
          }
        });
      });
    });
  });
}

async function main() {
  console.log('Extracting book titles for missing collections...\n');
  
  for (const collection of collections) {
    try {
      const books = await extractBookTitles(collection);
      const filename = `${collection}-books.json`;
      
      fs.writeFileSync(filename, JSON.stringify(books, null, 2), 'utf8');
      console.log(`✅ ${collection}: ${Object.keys(books).length} books → ${filename}`);
      
      // Show first 3 books
      const preview = Object.entries(books).slice(0, 3);
      preview.forEach(([num, title]) => {
        console.log(`   ${num}: ${title.ar}`);
      });
      console.log('');
    } catch (err) {
      console.error(`❌ Error extracting ${collection}:`, err);
    }
  }
  
  db.close();
}

main();
