const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'hadiths.db');
const sqlFilePath = path.join(__dirname, '..', 'HADITH BOOKS', 'HadithTable.sql');

// Create database directory
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Delete existing database
if (fs.existsSync(dbPath)) {
  console.log('Deleting existing database...');
  fs.unlinkSync(dbPath);
}

console.log('Creating new SQLite database...');
const db = new sqlite3.Database(dbPath);

// Create table
const createTableSQL = `
CREATE TABLE IF NOT EXISTS "HadithTable" (
  "collection" TEXT NOT NULL,
  "bookNumber" TEXT NOT NULL,
  "babID" REAL NOT NULL,
  "englishBabNumber" TEXT,
  "arabicBabNumber" TEXT,
  "hadithNumber" TEXT NOT NULL,
  "ourHadithNumber" INTEGER NOT NULL,
  "arabicURN" INTEGER NOT NULL PRIMARY KEY,
  "arabicBabName" TEXT,
  "arabicText" TEXT,
  "arabicgrade1" TEXT NOT NULL,
  "englishURN" INTEGER NOT NULL,
  "englishBabName" TEXT,
  "englishText" TEXT,
  "englishgrade1" TEXT NOT NULL,
  "last_updated" TEXT,
  "xrefs" TEXT NOT NULL
);
`;

console.log('Creating table...');
db.run(createTableSQL, (err) => {
  if (err) {
    console.error('Error creating table:', err);
    process.exit(1);
  }
  console.log('Table created successfully\n');

  console.log('Reading SQL file...');
  console.log('This will take a few minutes as the file is 71MB...\n');

  // Read entire file (it's only 139 lines but each line is huge)
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  // Split by lines and find INSERT statements
  const lines = sqlContent.split('\n');
  const insertLines = lines.filter(line => line.trim().startsWith('INSERT INTO'));
  
  console.log(`Found ${insertLines.length} INSERT statements`);
  
  if (insertLines.length === 0) {
    console.log('No INSERT statements found!');
    db.close();
    return;
  }

  let imported = 0;
  let failed = 0;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    insertLines.forEach((line, index) => {
      // Convert MySQL to SQLite syntax
      const sqliteLine = line
        .replace(/INSERT INTO `HadithTable`/g, 'INSERT INTO "HadithTable"')
        .replace(/`/g, '"');

      db.run(sqliteLine, (err) => {
        if (err) {
          failed++;
          if (failed <= 5) {
            console.error(`Error on line ${index + 1}:`, err.message.substring(0, 100));
          }
        } else {
          imported++;
        }

        // Progress update
        if ((index + 1) % 10 === 0) {
          console.log(`Progress: ${index + 1}/${insertLines.length} statements processed...`);
        }

        // When done
        if (index === insertLines.length - 1) {
          db.run('COMMIT', (err) => {
            if (err) {
              console.error('Error committing:', err);
            }

            console.log(`\n✅ Import complete!`);
            console.log(`   Successfully imported: ${imported}`);
            console.log(`   Failed: ${failed}`);

            // Get statistics
            db.all(`SELECT collection, COUNT(*) as count FROM "HadithTable" GROUP BY collection`, (err, rows) => {
              if (!err && rows) {
                console.log('\nCollections in database:');
                rows.forEach(row => {
                  console.log(`  ${row.collection}: ${row.count} hadiths`);
                });
              } else {
                console.log('\nNo data in database - all imports failed');
              }
              db.close();
            });
          });
        }
      });
    });
  });
});
