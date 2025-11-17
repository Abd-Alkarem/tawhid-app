const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/hadiths.db');

const sql = `
  SELECT 
    hadithNumber,
    babID,
    arabicBabName,
    SUBSTR(arabicText, 1, 200) as arabicPreview,
    SUBSTR(englishText, 1, 200) as englishPreview
  FROM HadithTable 
  WHERE collection='muslim' AND bookNumber='1'
  ORDER BY babID, CAST(hadithNumber AS INTEGER)
  LIMIT 10
`;

db.all(sql, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    rows.forEach(row => {
      console.log('\n---');
      console.log('Hadith #:', row.hadithNumber);
      console.log('Bab ID:', row.babID);
      console.log('Bab Name:', row.arabicBabName ? row.arabicBabName.substring(0, 50) : 'N/A');
      console.log('Arabic Preview:', row.arabicPreview);
      console.log('English Preview:', row.englishPreview);
    });
  }
  db.close();
});
