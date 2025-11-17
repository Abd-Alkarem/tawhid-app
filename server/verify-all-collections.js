const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/hadiths.db');
const fs = require('fs');

// Collections from the image
const expectedCollections = [
  { slug: 'sahih-bukhari', name: 'Sahih al-Bukhari', dbName: 'bukhari', arabic: 'صحيح البخاري' },
  { slug: 'sahih-muslim', name: 'Sahih Muslim', dbName: 'muslim', arabic: 'صحيح مسلم' },
  { slug: 'sunan-nasai', name: "Sunan an-Nasa'i", dbName: 'nasai', arabic: 'سنن النسائي' },
  { slug: 'sunan-abi-dawud', name: 'Sunan Abi Dawud', dbName: 'abudawud', arabic: 'سنن أبي داود' },
  { slug: 'jami-tirmidhi', name: "Jami' at-Tirmidhi", dbName: 'tirmidhi', arabic: 'جامع الترمذي' },
  { slug: 'sunan-ibn-majah', name: 'Sunan Ibn Majah', dbName: 'ibnmajah', arabic: 'سنن ابن ماجه' },
  { slug: 'muwatta-malik', name: 'Muwatta Malik', dbName: 'malik', arabic: 'موطأ مالك' },
  { slug: 'musnad-ahmad', name: 'Musnad Ahmad', dbName: 'ahmad', arabic: 'مسند أحمد' },
  { slug: 'sunan-darimi', name: 'Sunan ad-Darimi', dbName: 'darimi', arabic: 'سنن الدارمي' },
  { slug: 'forty-hadith', name: "An-Nawawi's 40 Hadith", dbName: 'forty', arabic: 'الأربعون النووية' },
  { slug: 'riyad-salihin', name: 'Riyad as-Salihin', dbName: 'riyadussalihin', arabic: 'رياض الصالحين' },
  { slug: 'adab-mufrad', name: 'Al-Adab Al-Mufrad', dbName: 'adab', arabic: 'الأدب المفرد' },
  { slug: 'shamail', name: 'Ash-Shama\'il Al-Muhammadiyah', dbName: 'shamail', arabic: 'الشمائل المحمدية' },
  { slug: 'mishkat', name: 'Mishkat al-Masabih', dbName: 'mishkat', arabic: 'مشكاة المصابيح' },
  { slug: 'bulugh-maram', name: 'Bulugh al-Maram', dbName: 'bulugh', arabic: 'بلوغ المرام' },
  { slug: 'forty-collections', name: 'Collections of Forty', dbName: 'forty', arabic: 'الأربعينيات' },
  { slug: 'hisn-muslim', name: 'Hisn al-Muslim', dbName: 'hisn', arabic: 'حصن المسلم' }
];

// Get all collections from database
db.all('SELECT DISTINCT collection FROM HadithTable', [], (err, dbCollections) => {
  if (err) {
    console.error('Error:', err);
    db.close();
    return;
  }
  
  const dbCollectionNames = dbCollections.map(c => c.collection);
  console.log('📊 Collections in Database:', dbCollectionNames.length);
  console.log(dbCollectionNames.join(', '));
  console.log('\n');
  
  // Check each expected collection
  console.log('✅ Checking Expected Collections:\n');
  
  expectedCollections.forEach(col => {
    const existsInDB = dbCollectionNames.includes(col.dbName);
    const mappingFile = `${col.dbName}-books.json`;
    const hasMappingFile = fs.existsSync(mappingFile);
    
    const status = existsInDB ? '✅' : '❌';
    const mappingStatus = hasMappingFile ? '📚' : '⚠️';
    
    console.log(`${status} ${mappingStatus} ${col.name} (${col.arabic})`);
    console.log(`   DB: ${col.dbName} ${existsInDB ? 'EXISTS' : 'MISSING'}`);
    console.log(`   Mapping: ${mappingFile} ${hasMappingFile ? 'EXISTS' : 'MISSING'}`);
    
    if (existsInDB) {
      // Count books
      db.get(`SELECT COUNT(DISTINCT bookNumber) as count FROM HadithTable WHERE collection = ?`, 
        [col.dbName], 
        (err2, result) => {
          if (!err2 && result) {
            console.log(`   Books: ${result.count}`);
          }
        }
      );
    }
    console.log('');
  });
  
  // Find collections in DB but not in expected list
  console.log('\n📋 Collections in DB not in expected list:');
  const expectedDBNames = expectedCollections.map(c => c.dbName);
  const extraCollections = dbCollectionNames.filter(c => !expectedDBNames.includes(c));
  if (extraCollections.length > 0) {
    extraCollections.forEach(c => console.log(`  - ${c}`));
  } else {
    console.log('  None');
  }
  
  setTimeout(() => db.close(), 2000);
});
