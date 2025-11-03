const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlFilePath = path.join(__dirname, '..', 'HADITH BOOKS', 'HadithTable.sql');
const outputPath = path.join(__dirname, '..', 'public', 'hadiths.json');

console.log('Reading SQL file...');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Extract INSERT statements
const insertPattern = /INSERT INTO `HadithTable` VALUES \('([^']+)','([^']+)',([^,]+),'([^']*?)','([^']*?)','([^']*?)',(\d+),(\d+),'([^']*?)','([^']*?)','([^']*?)',(\d+),'([^']*?)','([^']*?)','([^']*?)'/g;

const hadiths = {};
let match;
let count = 0;

console.log('Parsing hadiths...');

while ((match = insertPattern.exec(sqlContent)) !== null) {
  const [
    _,
    collection,
    bookNumber,
    babID,
    englishBabNumber,
    arabicBabNumber,
    hadithNumber,
    ourHadithNumber,
    arabicURN,
    arabicBabName,
    arabicText,
    arabicGrade,
    englishURN,
    englishBabName,
    englishText,
    englishGrade
  ] = match;

  // Initialize collection if not exists
  if (!hadiths[collection]) {
    hadiths[collection] = {
      name: collection,
      hadiths: []
    };
  }

  // Add hadith to collection
  hadiths[collection].hadiths.push({
    id: parseInt(arabicURN),
    collection,
    bookNumber,
    babID: parseFloat(babID),
    hadithNumber,
    ourHadithNumber: parseInt(ourHadithNumber),
    arabicBabName: arabicBabName.replace(/\\r/g, '').replace(/\\n/g, '\n'),
    arabicText: arabicText.replace(/\\r/g, '').replace(/\\n/g, '\n').substring(0, 1000), // Limit text length
    arabicGrade,
    englishBabName: englishBabName.replace(/\\r/g, '').replace(/\\n/g, '\n'),
    englishText: englishText.replace(/\\r/g, '').replace(/\\n/g, '\n').substring(0, 1000), // Limit text length
    englishGrade
  });

  count++;
  if (count % 1000 === 0) {
    console.log(`Parsed ${count} hadiths...`);
  }
}

// Convert to array format
const hadithsArray = Object.values(hadiths);

// Get statistics
const stats = hadithsArray.map(col => ({
  collection: col.name,
  count: col.hadiths.length
}));

console.log('\nStatistics:');
stats.forEach(s => console.log(`${s.collection}: ${s.count} hadiths`));

// Save to JSON file
console.log(`\nSaving to ${outputPath}...`);
fs.writeFileSync(outputPath, JSON.stringify(hadithsArray, null, 2));

console.log(`\nDone! Total hadiths: ${count}`);
console.log(`Collections: ${hadithsArray.length}`);
