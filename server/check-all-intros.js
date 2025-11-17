const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/hadiths.db');

const collections = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah'];

collections.forEach(collection => {
  const sql = `
    SELECT DISTINCT bookNumber 
    FROM HadithTable 
    WHERE collection = ? 
      AND (bookNumber = 'introduction' OR bookNumber = '0' OR bookNumber = 'intro')
  `;
  
  db.all(sql, [collection], (err, rows) => {
    if (err) {
      console.error(`Error for ${collection}:`, err);
    } else if (rows.length > 0) {
      console.log(`\n✅ ${collection} has introduction book(s):`, rows.map(r => r.bookNumber));
    } else {
      console.log(`❌ ${collection} - no introduction book found`);
    }
  });
});

setTimeout(() => db.close(), 2000);
