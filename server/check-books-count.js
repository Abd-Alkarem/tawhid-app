const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/hadiths.db');

const collections = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah'];

console.log('Checking book counts for all collections...\n');

collections.forEach(collection => {
  const sql = `
    SELECT DISTINCT bookNumber 
    FROM HadithTable 
    WHERE collection = ?
    ORDER BY CAST(CASE WHEN bookNumber = 'introduction' THEN '-1' ELSE bookNumber END AS INTEGER)
  `;
  
  db.all(sql, [collection], (err, rows) => {
    if (err) {
      console.error(`Error for ${collection}:`, err);
    } else {
      console.log(`\n${collection.toUpperCase()}: ${rows.length} books`);
      console.log('Book numbers:', rows.map(r => r.bookNumber).join(', '));
    }
  });
});

setTimeout(() => db.close(), 3000);
