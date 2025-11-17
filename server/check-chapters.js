const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'hadiths.db');
const db = new sqlite3.Database(dbPath);

const collections = [
  'bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah', 'ahmad',
  'bulugh', 'forty', 'hisn', 'riyadussalihin', 'shamail', 'adab', 'mishkat'
];

console.log('Checking which collections have chapters (باب)...\n');

collections.forEach(collection => {
  db.all(`
    SELECT DISTINCT bookNumber, babID, arabicBabName
    FROM "HadithTable"
    WHERE collection = ?
    ORDER BY bookNumber, babID
    LIMIT 5
  `, [collection], (err, rows) => {
    if (err) {
      console.error(`Error checking ${collection}:`, err);
      return;
    }
    
    console.log(`\n${collection.toUpperCase()}:`);
    console.log(`Total rows: ${rows.length}`);
    
    if (rows.length > 0) {
      const hasChapters = rows.some(row => row.babID && row.arabicBabName && row.arabicBabName.trim() !== '');
      console.log(`Has chapters: ${hasChapters}`);
      
      rows.forEach(row => {
        console.log(`  Book ${row.bookNumber}, Bab ${row.babID}: ${row.arabicBabName || '(empty)'}`);
      });
    }
  });
});

setTimeout(() => {
  db.close();
}, 5000);
