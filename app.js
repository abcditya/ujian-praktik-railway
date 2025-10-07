// app.js
// Jalankan: npm install -> npm run init-db -> npm start
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// === PostgreSQL Pool ===
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Jika Railway memerlukan SSL, gunakan:
// const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// === Folder upload ===
const STORAGE_PATH = process.env.STORAGE_PATH || path.join(__dirname, 'uploads');
fs.mkdirSync(STORAGE_PATH, { recursive: true });

// === Multer Setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, STORAGE_PATH),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_');
    cb(null, Date.now() + '-' + base + ext);
  }
});
const upload = multer({ storage });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/uploads', express.static(STORAGE_PATH));

// === Template Helper ===
function pageTemplate(title, body) {
  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body {
        font-family: "Segoe UI", sans-serif;
        background: linear-gradient(135deg, #1e1f26, #2c2f36);
        color: #eee;
        margin: 0;
        padding: 0;
      }
      header {
        background: #3a3f47;
        color: #fff;
        padding: 1rem 2rem;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }
      main {
        max-width: 700px;
        margin: 3rem auto;
        background: #2b2f36;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      }
      form label {
        display: block;
        margin-bottom: .5rem;
        font-weight: 500;
      }
      form input {
        width: 100%;
        padding: .7rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        border: 1px solid #555;
        background: #3b3f47;
        color: #fff;
      }
      button {
        background: #4CAF50;
        color: white;
        border: none;
        padding: .7rem 1.2rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s;
      }
      button:hover {
        background: #45a049;
      }
      a {
        color: #58a6ff;
        text-decoration: none;
      }
      a:hover { text-decoration: underline; }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        background: #3a3f47;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }
      img {
        display: block;
        margin-top: .5rem;
        border-radius: 6px;
        max-width: 120px;
      }
      .back-link {
        display: inline-block;
        margin-top: 1rem;
        background: #555;
        color: #fff;
        padding: .5rem 1rem;
        border-radius: 8px;
      }
      .back-link:hover {
        background: #666;
      }
    </style>
  </head>
  <body>
    <header><h1>${title}</h1></header>
    <main>${body}</main>
  </body>
  </html>`;
}

// === Routes ===
app.get('/', (req, res) => {
  const body = `
    <form method="POST" action="/users" enctype="multipart/form-data">
      <label>Nama:</label>
      <input name="name" placeholder="Masukkan nama lengkap" required>

      <label>Email:</label>
      <input name="email" type="email" placeholder="Masukkan email aktif" required>

      <label>Foto Profil:</label>
      <input name="avatar" type="file" accept="image/*">

      <button type="submit">💾 Simpan</button>
    </form>
    <p style="text-align:center; margin-top:1.5rem;">
      <a href="/users" class="back-link">📋 Lihat daftar pengguna</a>
    </p>
  `;
  res.send(pageTemplate('Form Input Pengguna', body));
});

app.post('/users', upload.single('avatar'), async (req, res) => {
  const { name, email } = req.body;
  const filename = req.file ? req.file.filename : null;
  try {
    await pool.query('INSERT INTO users (name, email, filename) VALUES ($1, $2, $3)', [name, email, filename]);
    res.send(pageTemplate('Berhasil', `
      <p>✅ Data pengguna berhasil disimpan!</p>
      <p><a href="/users" class="back-link">Lihat daftar pengguna</a></p>
      <p><a href="/" class="back-link">Kembali ke form</a></p>
    `));
  } catch (err) {
    console.error('Error menyimpan data:', err);
    res.status(500).send(pageTemplate('Error', `<p>❌ Gagal menyimpan data.</p>`));
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, filename FROM users ORDER BY id DESC');
    let list = '';
    if (result.rows.length === 0) {
      list = '<p>Belum ada pengguna yang terdaftar.</p>';
    } else {
      for (const row of result.rows) {
        list += `
          <li>
            <strong>${escapeHtml(row.name)}</strong><br>
            <small>${escapeHtml(row.email)}</small>
            ${row.filename ? `<img src="/uploads/${encodeURIComponent(row.filename)}" alt="avatar">` : ''}
          </li>`;
      }
    }
    const body = `
      <ul>${list}</ul>
      <p style="text-align:center;"><a href="/" class="back-link">⬅️ Kembali ke Form</a></p>
    `;
    res.send(pageTemplate('Daftar Pengguna', body));
  } catch (err) {
    console.error('Gagal mengambil data:', err);
    res.status(500).send(pageTemplate('Error', `<p>❌ Gagal mengambil data.</p>`));
  }
});

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

// === Cek koneksi database ===
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Berhasil terhubung ke database.');
  } catch (err) {
    console.error('❌ Gagal terkoneksi ke database:', err.message || err);
  }
  app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));
})();
