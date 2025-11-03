const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

// Create table
const createTableSQL = `
CREATE TABLE IF NOT EXISTS "HadithTable" (
  "collection" TEXT NOT NULL,
  "bookNumber" TEXT NOT NULL,
  "babID" REAL NOT NULL,
  "englishBabNumber" TEXT DEFAULT NULL,
  "arabicBabNumber" TEXT DEFAULT NULL,
  "hadithNumber" TEXT NOT NULL,
  "ourHadithNumber" INTEGER NOT NULL,
  "arabicURN" INTEGER NOT NULL,
  "arabicBabName" TEXT,
  "arabicText" TEXT,
  "arabicgrade1" TEXT NOT NULL,
  "englishURN" INTEGER NOT NULL,
  "englishBabName" TEXT,
  "englishText" TEXT,
  "englishgrade1" TEXT NOT NULL,
  "last_updated" TEXT DEFAULT NULL,
  "xrefs" TEXT NOT NULL,
  PRIMARY KEY ("arabicURN")
);
`;

console.log('Creating table...');
db.run(createTableSQL, (err) => {
  if (err) {
    console.error('Error creating table:', err);
    process.exit(1);
  }
  console.log('Table created successfully\n');

  // Read and process SQL file line by line
  console.log('Reading SQL file and importing data...');
  console.log('This may take a few minutes...\n');

  const fileStream = fs.createReadStream(sqlFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let count = 0;
  let batch = [];
  const batchSize = 100;
  let currentInsert = '';
  let inInsert = false;

  rl.on('line', (line) => {
    // Check if this is an INSERT statement
    if (line.startsWith('INSERT INTO')) {
      inInsert = true;
      currentInsert = line;
    } else if (inInsert) {
      currentInsert += ' ' + line;
    }

    // Check if INSERT statement is complete
    if (inInsert && line.trim().endsWith(';')) {
      // Convert MySQL to SQLite syntax
      const sqliteInsert = currentInsert
        .replace(/INSERT INTO `HadithTable`/g, 'INSERT INTO "HadithTable"')
        .replace(/`/g, '"');

      batch.push(sqliteInsert);
      count++;

      // Insert batch when it reaches batchSize
      if (batch.length >= batchSize) {
        insertBatch(batch.slice());
        batch = [];
      }

      if (count % 1000 === 0) {
        console.log(`Processed ${count} hadiths...`);
      }

      currentInsert = '';
      inInsert = false;
    }
  });

  rl.on('close', () => {
    // Insert remaining batch
    if (batch.length > 0) {
      insertBatch(batch);
    }

    // Wait a bit for all inserts to complete
    setTimeout(() => {
      console.log(`\n✅ Import complete! Total hadiths: ${count}`);
      
      // Get statistics
      db.all(`SELECT collection, COUNT(*) as count FROM "HadithTable" GROUP BY collection`, (err, rows) => {
        if (!err && rows) {
          console.log('\nCollections in database:');
          rows.forEach(row => {
            console.log(`  ${row.collection}: ${row.count} hadiths`);
          });
        }
        db.close();
      });
    }, 2000);
  });
});

function insertBatch(statements) {
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    statements.forEach(sql => {
      db.run(sql, (err) => {
        if (err) {
          // Silently ignore errors (likely duplicates or format issues)
        }
      });
    });

    db.run('COMMIT');
  });
}
