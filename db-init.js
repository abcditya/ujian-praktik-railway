// db-init.js
// Jalankan sekali untuk membuat tabel users (node db-init.js)
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        filename TEXT
      );
    `);
    console.log('Tabel users berhasil dibuat (atau sudah ada).');
  } catch (err) {
    console.error('Gagal membuat tabel:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
