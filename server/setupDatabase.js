const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'hadiths.db');
const sqlFilePath = path.join(__dirname, '..', 'HADITH BOOKS', 'HadithTable.sql');

// Create database directory if it doesn't exist
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Delete existing database
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Deleted existing database');
}

console.log('Creating new SQLite database...');
const db = new sqlite3.Database(dbPath);

// Read and parse SQL file
console.log('Reading SQL file...');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Extract CREATE TABLE statement
const createTableMatch = sqlContent.match(/CREATE TABLE `HadithTable`[^;]+;/s);
if (!createTableMatch) {
  console.error('Could not find CREATE TABLE statement');
  process.exit(1);
}

// Convert MySQL syntax to SQLite
let createTableSQL = createTableMatch[0]
  .replace(/`/g, '"')
  .replace(/COLLATE utf8_unicode_ci/g, '')
  .replace(/ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci/g, '')
  .replace(/varchar\((\d+)\)/g, 'TEXT')
  .replace(/decimal\([^)]+\)/g, 'REAL')
  .replace(/int\(\d+\)/g, 'INTEGER')
  .replace(/timestamp/g, 'TEXT')
  .replace(/UNIQUE KEY "[^"]+"/g, 'UNIQUE')
  .replace(/,\s*KEY "[^"]+"\s*\([^)]+\)/g, '') // Remove KEY indexes
  .replace(/,\s*\)/g, ')'); // Clean up trailing commas

console.log('Creating table...');
db.serialize(() => {
  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating table:', err);
      process.exit(1);
    }
    console.log('Table created successfully');

    // Extract INSERT statements
    console.log('Parsing INSERT statements...');
    const insertPattern = /INSERT INTO `HadithTable` VALUES \(([^)]+(?:\([^)]*\)[^)]*)*)\);/g;
    let matches = [];
    let match;
    
    while ((match = insertPattern.exec(sqlContent)) !== null) {
      matches.push(match[1]);
    }

    console.log(`Found ${matches.length} hadiths to insert`);

    if (matches.length === 0) {
      console.log('No hadiths found. Database setup complete (empty).');
      db.close();
      return;
    }

    // Insert in batches
    const batchSize = 100;
    let count = 0;

    const insertBatch = (startIndex) => {
      const endIndex = Math.min(startIndex + batchSize, matches.length);
      const batch = matches.slice(startIndex, endIndex);

      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        batch.forEach((values, idx) => {
          const insertSQL = `INSERT INTO "HadithTable" VALUES (${values});`;
          db.run(insertSQL, (err) => {
            if (err && count < 5) {
              console.error('Error inserting row:', err.message.substring(0, 100));
            }
          });
          count++;
        });

        db.run('COMMIT', (err) => {
          if (err) {
            console.error('Error committing batch:', err.message);
          }

          if (count % 1000 === 0 || endIndex === matches.length) {
            console.log(`Inserted ${count} / ${matches.length} hadiths...`);
          }

          if (endIndex < matches.length) {
            // Insert next batch
            insertBatch(endIndex);
          } else {
            // All done
            console.log(`\n✅ Database setup complete! Total hadiths inserted: ${count}`);
            
            // Get statistics
            db.all(`SELECT collection, COUNT(*) as count FROM "HadithTable" GROUP BY collection`, (err, rows) => {
              if (!err && rows) {
                console.log('\nCollections:');
                rows.forEach(row => {
                  console.log(`  ${row.collection}: ${row.count} hadiths`);
                });
              }
              db.close();
            });
          }
        });
      });
    };

    // Start inserting
    insertBatch(0);
  });
});
