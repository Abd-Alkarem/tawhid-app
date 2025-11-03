require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = process.env.DB_PATH || './database/hadiths.db';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database(path.join(__dirname, DB_PATH), (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Helpers: clean custom markup and HTML from stored text
function cleanText(s) {
  if (!s) return s;
  let t = String(s);
  // Remove custom bracket tags like [narrator ...], [/narrator], [prematn], [matn], etc.
  t = t.replace(/\[\/?narrator[^\]]*\]/gi, '');
  t = t.replace(/\[(?:pre)?matn\]/gi, '');
  // Remove any other bracketed tokens
  t = t.replace(/\[[^\]]+\]/g, '');
  // Strip HTML-like tags
  t = t.replace(/<[^>]*>/g, '');
  // Remove stray anchor attribute fragments that may appear as plain text
  t = t.replace(/\bA id="[^"]*"\s*name="[^"]*"\s*>?/gi, '');
  t = t.replace(/href="[^"]*"/gi, '');
  t = t.replace(/javascript:openquran\([^)]*\)/gi, '');
  // Remove leftover braces often used around verse placeholders
  t = t.replace(/[{}]/g, '');
  // Collapse whitespace
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

// API Routes

// Get all collections
app.get('/api/collections', (req, res) => {
  const sql = `SELECT collection, COUNT(*) as count FROM "HadithTable" GROUP BY collection`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get hadiths by collection with pagination
app.get('/api/hadiths/:collection', (req, res) => {
  const { collection } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  // Get total count
  db.get(
    `SELECT COUNT(*) as total FROM "HadithTable" WHERE collection = ?`,
    [collection],
    (err, countRow) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Get hadiths
      const sql = `
        SELECT 
          ourHadithNumber as id,
          hadithNumber,
          arabicBabName as chapterArabic,
          arabicText as hadithArabic,
          englishBabName as chapterEnglish,
          englishText as hadithEnglish,
          arabicgrade1 as gradeArabic,
          englishgrade1 as gradeEnglish
        FROM "HadithTable"
        WHERE collection = ?
        ORDER BY ourHadithNumber
        LIMIT ? OFFSET ?
      `;

      db.all(sql, [collection, limit, offset], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        // Sanitize text fields
        const cleanRows = rows.map(r => ({
          ...r,
          chapterArabic: cleanText(r.chapterArabic),
          hadithArabic: cleanText(r.hadithArabic),
          chapterEnglish: cleanText(r.chapterEnglish),
          hadithEnglish: cleanText(r.hadithEnglish)
        }));

        const total = countRow.total;
        const totalPages = Math.ceil(total / limit);

        res.json({
          data: cleanRows,
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        });
      });
    }
  );
});

// Search hadiths
app.get('/api/search', (req, res) => {
  const { q, collection } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  if (!q) {
    res.status(400).json({ error: 'Search query required' });
    return;
  }

  let sql = `
    SELECT 
      ourHadithNumber as id,
      collection,
      hadithNumber,
      arabicBabName as chapterArabic,
      arabicText as hadithArabic,
      englishBabName as chapterEnglish,
      englishText as hadithEnglish,
      arabicgrade1 as gradeArabic,
      englishgrade1 as gradeEnglish
    FROM "HadithTable"
    WHERE (arabicText LIKE ? OR englishText LIKE ?)
  `;

  const params = [`%${q}%`, `%${q}%`];

  if (collection) {
    sql += ` AND collection = ?`;
    params.push(collection);
  }

  sql += ` ORDER BY ourHadithNumber LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const cleanRows = rows.map(r => ({
      ...r,
      chapterArabic: cleanText(r.chapterArabic),
      hadithArabic: cleanText(r.hadithArabic),
      chapterEnglish: cleanText(r.chapterEnglish),
      hadithEnglish: cleanText(r.hadithEnglish)
    }));

    res.json({
      data: cleanRows,
      pagination: {
        page,
        limit,
        total: rows.length
      }
    });
  });
});

// Get single hadith by ID
app.get('/api/hadith/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      ourHadithNumber as id,
      collection,
      hadithNumber,
      arabicBabName as chapterArabic,
      arabicText as hadithArabic,
      englishBabName as chapterEnglish,
      englishText as hadithEnglish,
      arabicgrade1 as gradeArabic,
      englishgrade1 as gradeEnglish
    FROM "HadithTable"
    WHERE ourHadithNumber = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Hadith not found' });
      return;
    }
    res.json({
      ...row,
      chapterArabic: cleanText(row.chapterArabic),
      hadithArabic: cleanText(row.hadithArabic),
      chapterEnglish: cleanText(row.chapterEnglish),
      hadithEnglish: cleanText(row.hadithEnglish)
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hadith API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Hadith API Server running on http://localhost:${PORT}`);
  console.log(`📚 Database: ${DB_PATH}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/collections`);
  console.log(`  GET  /api/hadiths/:collection?page=1&limit=50`);
  console.log(`  GET  /api/search?q=prayer&collection=bukhari`);
  console.log(`  GET  /api/hadith/:id`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('\nDatabase connection closed');
    process.exit(0);
  });
});
