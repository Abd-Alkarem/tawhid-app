const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/hadiths.db');

// Check for variations of the missing collections
const searches = [
  { name: 'Muwatta Malik', patterns: ['malik', 'muwatta', 'موطأ'] },
  { name: 'Arbaeen/Forty Collections', patterns: ['arbaeen', 'arbain', 'الاربعين', 'forty'] },
  { name: 'Sunan ad-Darimi', patterns: ['darimi', 'الدارمي'] }
];

console.log('Searching for missing collections...\n');

// Get all collections
db.all('SELECT DISTINCT collection FROM HadithTable', [], (err, rows) => {
  if (err) {
    console.error(err);
    db.close();
    return;
  }
  
  const allCollections = rows.map(r => r.collection);
  console.log('All collections in database:');
  allCollections.forEach(c => console.log(`  - ${c}`));
  console.log('\n');
  
  // Search for each missing collection
  searches.forEach(search => {
    console.log(`🔍 Searching for: ${search.name}`);
    const found = allCollections.filter(c => 
      search.patterns.some(p => c.toLowerCase().includes(p.toLowerCase()))
    );
    
    if (found.length > 0) {
      console.log(`   ✅ FOUND: ${found.join(', ')}`);
      
      // Get book count
      found.forEach(collectionName => {
        db.get(
          `SELECT COUNT(DISTINCT bookNumber) as count FROM HadithTable WHERE collection = ?`,
          [collectionName],
          (err2, result) => {
            if (!err2 && result) {
              console.log(`      Books: ${result.count}`);
            }
          }
        );
      });
    } else {
      console.log(`   ❌ NOT FOUND in database`);
    }
    console.log('');
  });
  
  setTimeout(() => db.close(), 2000);
});
