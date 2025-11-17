const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/hadiths.db');

// Check Bukhari book 1 structure
const sql = `
  SELECT 
    bookNumber,
    babID,
    arabicBabName,
    englishBabName,
    hadithNumber
  FROM HadithTable 
  WHERE collection = 'bukhari' AND bookNumber = '1'
  ORDER BY babID
  LIMIT 10
`;

db.all(sql, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Bukhari Book 1 - First 10 chapters:\n');
    rows.forEach(row => {
      console.log(`Bab ${row.babID}:`);
      console.log(`  Arabic: ${row.arabicBabName ? row.arabicBabName.substring(0, 100) : 'N/A'}`);
      console.log(`  English: ${row.englishBabName ? row.englishBabName.substring(0, 100) : 'N/A'}`);
      console.log('');
    });
  }
  
  // Now check Muslim
  const sql2 = `
    SELECT 
      bookNumber,
      babID,
      arabicBabName,
      englishBabName
    FROM HadithTable 
    WHERE collection = 'muslim' AND bookNumber = '1'
    ORDER BY babID
    LIMIT 10
  `;
  
  db.all(sql2, [], (err2, rows2) => {
    if (err2) {
      console.error(err2);
    } else {
      console.log('\n\nMuslim Book 1 - First 10 chapters:\n');
      rows2.forEach(row => {
        console.log(`Bab ${row.babID}:`);
        console.log(`  Arabic: ${row.arabicBabName ? row.arabicBabName.substring(0, 100) : 'N/A'}`);
        console.log(`  English: ${row.englishBabName ? row.englishBabName.substring(0, 100) : 'N/A'}`);
        console.log('');
      });
    }
    db.close();
  });
});
