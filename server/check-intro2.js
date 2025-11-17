const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/hadiths.db');

// Check for intro texts (hadithNumber might be '0', 'intro', or similar)
const sql = `
  SELECT DISTINCT
    collection,
    bookNumber,
    hadithNumber,
    babID,
    SUBSTR(arabicText, 1, 300) as arabicPreview
  FROM HadithTable 
  WHERE collection='muslim' 
    AND (hadithNumber = '0' OR hadithNumber LIKE '%intro%' OR hadithNumber LIKE '%a' OR CAST(hadithNumber AS INTEGER) = 0)
  ORDER BY bookNumber, babID
  LIMIT 20
`;

db.all(sql, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Found ${rows.length} potential intro texts`);
    rows.forEach(row => {
      console.log('\n---');
      console.log('Collection:', row.collection);
      console.log('Book:', row.bookNumber);
      console.log('Hadith #:', row.hadithNumber);
      console.log('Bab ID:', row.babID);
      console.log('Preview:', row.arabicPreview);
    });
  }
  db.close();
});
