# 🧩 Ujian Praktik – Cloud Developer  
## Implementasi Koneksi Aplikasi Node.js dengan PostgreSQL (Railway)

### 👨‍💻 Deskripsi Proyek
Proyek ini dibuat sebagai bagian dari ujian praktik Cloud Developer.  
Aplikasi ini merupakan aplikasi sederhana berbasis **Node.js + Express.js** yang terhubung ke **database PostgreSQL** di platform **Railway**.  

Fitur utama dari aplikasi ini meliputi:
- Form input data pengguna (nama, email, dan foto profil)
- Penyimpanan data ke database PostgreSQL
- Upload file gambar ke folder penyimpanan persisten (`uploads`)
- Menampilkan daftar pengguna yang tersimpan di database
- Menggunakan **environment variable** untuk koneksi database

---

### ⚙️ Teknologi yang Digunakan
- **Node.js** (Express Framework)
- **PostgreSQL** (Database)
- **Multer** (Upload file)
- **EJS** (Template Engine)
- **Dotenv** (Konfigurasi environment variable)
- **Railway.app** (Platform PaaS untuk hosting aplikasi dan database)

---

### 🗂️ Struktur Folder Proyek
ujian-praktik-railway/
│
├── node_modules/ # Dependency Node.js
├── public/ # Folder untuk file statis (CSS)
│ └── css/
│ └── style.css
│
├── uploads/ # Folder penyimpanan file upload
│
├── views/ # Template tampilan (EJS)
│ ├── form.ejs # Form input pengguna
│ └── daftar.ejs # Tampilan daftar pengguna
│
├── app.js # File utama aplikasi
├── db-init.js # Inisialisasi database PostgreSQL
├── .env # Environment variable (disembunyikan)
├── .gitignore # Mengabaikan file sensitif seperti .env
├── package.json # Informasi dependensi project
└── README.md # Dokumentasi proyek ini

yaml

### 🔧 Langkah Instalasi dan Konfigurasi

1. **Clone repository ini**
   ```bash
   git clone <url-repo-anda>
   cd ujian-praktik-railway
Instal semua dependensi

bash

npm install
Buat file .env dari contoh

bash

cp .env.example .env
Isi file .env
Tambahkan environment variable (tanpa mencantumkan kredensial asli):

env

DATABASE_URL=<isi_url_database_dari_Railway>
PORT=3000
Inisialisasi Database
Jalankan file db-init.js untuk membuat tabel:

bash

node db-init.js
Jalankan Aplikasi

bash

npm start
Lalu buka di browser:

arduino

http://localhost:3000
🧩 Fitur Aplikasi
📝 1. Form Input Pengguna
Pengguna dapat mengisi:

Nama

Email

Foto Profil (upload gambar)

💾 2. Menyimpan Data
Setiap data yang dikirim melalui form akan:

Disimpan ke database PostgreSQL

File foto disimpan di folder uploads/

👥 3. Menampilkan Daftar Pengguna
Data yang tersimpan dapat dilihat melalui halaman daftar pengguna.
Tampilan daftar mencakup:

Nama

Email

Foto Profil

🌐 Konfigurasi Railway
Membuat PostgreSQL Database

Masuk ke Railway.app

Buat proyek baru → pilih Add → Database → PostgreSQL

Tunggu hingga database aktif, lalu salin Database URL

Masukkan URL tersebut ke file .env sebagai DATABASE_URL

Men-deploy Aplikasi

Hubungkan Railway ke repository GitHub proyek ini

Tambahkan environment variable:

DATABASE_URL

PORT=3000

Klik Deploy
