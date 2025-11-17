const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/hadiths.db');

// Find which collection is "بلوغ المرام"
const sql = `
  SELECT DISTINCT collection
  FROM HadithTable
  WHERE arabicBabName LIKE '%بلوغ%' OR englishBabName LIKE '%Bulugh%'
  LIMIT 5
`;

db.all(sql, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Collections matching Bulugh:', rows);
  }
  
  // Also check all collections
  const sql2 = `SELECT DISTINCT collection FROM HadithTable`;
  db.all(sql2, [], (err2, rows2) => {
    if (err2) console.error(err2);
    else {
      console.log('\nAll collections in database:');
      rows2.forEach(r => console.log(`  - ${r.collection}`));
    }
    db.close();
  });
});
