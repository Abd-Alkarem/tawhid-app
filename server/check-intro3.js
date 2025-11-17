const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/hadiths.db');

// Check for book 0 or introduction
const sql = `
  SELECT 
    collection,
    bookNumber,
    hadithNumber,
    babID,
    arabicBabName,
    SUBSTR(arabicText, 1, 500) as arabicPreview,
    SUBSTR(englishText, 1, 500) as englishPreview
  FROM HadithTable 
  WHERE collection='muslim' AND (bookNumber = '0' OR bookNumber = 'intro' OR bookNumber = 'introduction')
  ORDER BY babID
  LIMIT 10
`;

db.all(sql, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Found ${rows.length} introduction entries`);
    if (rows.length > 0) {
      rows.forEach(row => {
        console.log('\n=== INTRODUCTION FOUND ===');
        console.log('Book:', row.bookNumber);
        console.log('Hadith #:', row.hadithNumber);
        console.log('Bab:', row.arabicBabName);
        console.log('\nArabic:\n', row.arabicPreview);
        console.log('\nEnglish:\n', row.englishPreview);
      });
    } else {
      console.log('\nNo book 0 found. Checking first few entries of book 1...\n');
      
      const sql2 = `
        SELECT 
          hadithNumber,
          babID,
          SUBSTR(arabicBabName, 1, 100) as babName,
          SUBSTR(arabicText, 1, 200) as preview
        FROM HadithTable 
        WHERE collection='muslim' AND bookNumber = '1'
        ORDER BY babID, CAST(hadithNumber AS INTEGER)
        LIMIT 3
      `;
      
      db.all(sql2, [], (err2, rows2) => {
        if (err2) console.error(err2);
        else {
          rows2.forEach(r => {
            console.log('\nHadith:', r.hadithNumber, 'Bab:', r.babID);
            console.log('Bab Name:', r.babName);
            console.log('Preview:', r.preview);
          });
        }
        db.close();
      });
    }
  }
  if (rows.length > 0) db.close();
});
