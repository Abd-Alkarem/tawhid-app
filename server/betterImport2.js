const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'hadiths.db');
const sqlFilePath = path.join(__dirname, '..', 'HADITH BOOKS', 'HadithTable.sql');

// Ensure DB dir exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// Remove old DB if exists
if (fs.existsSync(dbPath)) {
  console.log('Deleting existing database...');
  fs.unlinkSync(dbPath);
}

console.log('Creating SQLite database...');
const db = new sqlite3.Database(dbPath);

const run = (sql, params=[]) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err){ if(err) reject(err); else resolve(this); });
});
const all = (sql, params=[]) => new Promise((resolve,reject)=>{
  db.all(sql, params, (e,rows)=> e?reject(e):resolve(rows));
});

(async () => {
  try {
    await run('PRAGMA journal_mode=MEMORY');
    await run('PRAGMA synchronous=OFF');
    await run('PRAGMA foreign_keys=OFF');

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
    await run(createTableSQL);
    console.log('Table created');

    console.log('Reading SQL dump (this may take a minute)...');
    const dump = fs.readFileSync(sqlFilePath, 'utf8');

    // Extract all INSERT INTO `HadithTable` ... VALUES (...);
    const insertLines = dump.split('\n').filter(l => l.startsWith('INSERT INTO `HadithTable` VALUES'));
    console.log(`Found ${insertLines.length} INSERT statements`);

    // Helper: split multi-row VALUES into list of value-groups
    function splitValueGroups(valuesPart){
      const groups = [];
      let i=0, n=valuesPart.length;
      let depth=0, inStr=false, escape=false, buf='';
      while(i<n){
        const ch = valuesPart[i];
        if(inStr){
          if(escape){ escape=false; buf+=ch; }
          else if(ch==='\\'){ escape=true; buf+=ch; }
          else if(ch==="'"){ inStr=false; buf+=ch; }
          else { buf+=ch; }
        } else {
          if(ch==="'"){ inStr=true; buf+=ch; }
          else if(ch==='('){ depth++; buf+=ch; }
          else if(ch===')'){ depth--; buf+=ch; if(depth===0){ groups.push(buf.trim()); buf=''; } }
          else if(ch===',' && depth===0){ /* separator between groups */ }
          else { buf+=ch; }
        }
        i++;
      }
      return groups;
    }

    // Helper: parse a single parenthesized value group into array of JS values
    function parseTuple(group){
      // group like: ( 'bukhari','1',1.00,... )
      let inner = group.trim();
      if(inner.startsWith('(')) inner = inner.slice(1);
      if(inner.endsWith(')')) inner = inner.slice(0, -1);

      const out = [];
      let i=0, n=inner.length, inStr=false, escape=false, token='';
      while(i<n){
        const ch = inner[i];
        if(inStr){
          if(escape){
            // Keep common escapes, convert \n and \r
            if(ch==='n') token+='\n';
            else if(ch==='r') token+='\r';
            else token+=ch; // include escaped quote and backslashes literally
            escape=false;
          } else if(ch==='\\'){
            escape=true;
          } else if(ch==="'"){
            inStr=false;
          } else {
            token+=ch;
          }
        } else {
          if(ch==="'"){
            inStr=true;
          } else if(ch===','){
            out.push(convertToken(token.trim()));
            token='';
          } else {
            token+=ch;
          }
        }
        i++;
      }
      // Always push the last token (even if empty string "")
      out.push(convertToken(token.trim()));
      return out;
    }

    function convertToken(tok){
      if(tok==='NULL') return null;
      // numbers like 1.00 or 19800
      if(/^[-+]?\d+(?:\.\d+)?$/.test(tok)) return Number(tok);
      // everything else is string (already unescaped)
      return tok;
    }

    const insertSQL = `INSERT INTO "HadithTable" (
      collection, bookNumber, babID, englishBabNumber, arabicBabNumber,
      hadithNumber, ourHadithNumber, arabicURN, arabicBabName, arabicText,
      arabicgrade1, englishURN, englishBabName, englishText, englishgrade1,
      last_updated, xrefs
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    await run('BEGIN TRANSACTION');
    const stmt = db.prepare(insertSQL);
    let ok=0, fail=0;

    let dbgShown = 0;
    for(const line of insertLines){
      const start = line.indexOf('VALUES');
      const valuesPart = line.slice(start + 'VALUES'.length).trim().replace(/;\s*$/, '');
      const groups = splitValueGroups(valuesPart);
      for(const g of groups){
        try{
          let vals = parseTuple(g);

          // If tuple shorter than expected, pad with null/empty values (most common: missing xrefs)
          if (vals.length < 17) {
            while (vals.length < 17) vals.push("");
          }

          // If tuple longer than expected (very rare), merge overflow into englishText field
          if (vals.length > 17) {
            // columns indexes (0-based): englishText is index 13, englishgrade1 is 14
            const head = vals.slice(0, 14);
            const tail = vals.slice(14);
            // move everything except the last two back into englishText
            // ensure we end up with 17 total: merge tail.slice(0, tail.length-2) into englishText
            if (tail.length >= 3) {
              head[13] = String(head[13] ?? '') + tail.slice(0, tail.length - 2).map(v=>String(v)).join(',');
              vals = head.concat(tail.slice(-2));
            } else {
              // fallback: truncate
              vals = vals.slice(0,17);
            }
          }

          if (dbgShown < 3) {
            dbgShown++;
            console.log('Tuple length after normalize:', vals.length);
          }
          await new Promise((res, rej)=> stmt.run(vals, (e)=> e?rej(e):res()));
          ok++;
        }catch(e){
          fail++;
          if(fail<=3) console.error('Insert error:', e.message.substring(0,120));
        }
      }
    }

    await run('COMMIT');
    stmt.finalize();

    console.log(`\n✅ Import finished. Inserted: ${ok}, Failed: ${fail}`);

    const rows = await all('SELECT collection, COUNT(*) as count FROM "HadithTable" GROUP BY collection ORDER BY collection');
    if(!rows.length) console.log('No rows in database.');
    else {
      console.log('\nCollections:');
      for(const r of rows){
        console.log(`  ${r.collection}: ${r.count}`);
      }
    }

    db.close();
  } catch (e) {
    console.error('Fatal error:', e);
    try{ db.close(); }catch{}
    process.exit(1);
  }
})();
