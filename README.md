# Manajemen Hewan Qurban

Aplikasi frontend statis untuk membantu panitia mencatat hewan qurban, peserta, pembayaran, jadwal sembelih, dan distribusi paket daging.

## Cara Menjalankan

- Buka `index.html` untuk admin panitia.
- Buka `hewan.html` untuk website publik list hewan qurban.
- Data admin lokal tersimpan otomatis di browser melalui `localStorage`.

## Struktur Folder

- `index.html`: halaman utama aplikasi.
- `hewan.html`: halaman publik daftar hewan qurban.
- `src/app.js`: semua logic data, validasi, CRUD, rekap, dan penyimpanan lokal.
- `src/public-animals.js`: logic tampilan list hewan publik.
- `src/config.js`: konfigurasi URL Google Apps Script.
- `styles/main.css`: tampilan responsive aplikasi.
- `styles/public.css`: tampilan website publik list hewan.
- `assets/`: identitas visual aplikasi.
- `gas/`: backend modular Google Apps Script.
- `api/gas.js`: proxy Vercel ke Google Apps Script. URL GAS disimpan di environment variable Vercel.
- `docs/logic-project.md`: catatan logic yang diperlukan di tiap folder.

## Fitur Utama

- Dashboard distribusi daging untuk Admin dan Panitia.
- Mode role Admin/Panitia dengan menu sesuai tugas masing-masing.
- Pengaturan aplikasi: data masjid/lembaga, tahun kurban, kontak, dan status pembagian.
- Data wilayah distribusi.
- Data user admin dan panitia scan.
- Akun login berbasis username/password dengan role `Admin` dan `Panitia`.
- Data kupon: generate otomatis, import kupon pengkurban dari peserta, dan kupon umum tanpa nama.
- Scan kupon manual untuk verifikasi pengambilan daging.
- Riwayat scan berisi petugas, penerima, waktu, dan status verifikasi.
- Rekap laporan pembagian dengan cetak laporan dan unduh CSV kupon.
- CRUD hewan qurban.
- Profil hewan dengan foto/URL gambar.
- CRUD peserta qurban.
- Cetak kartu peserta qurban per orang atau seluruh peserta.
- Validasi kuota sapi 7 peserta dan kambing/domba 1 peserta.
- Rekap dana terkumpul dan paket distribusi.
- Validasi data panitia: kuota, jadwal, peserta kosong, dan pembayaran belum lunas.

## Backend Google Apps Script

1. Buat Google Spreadsheet baru.
2. Buka Apps Script dari spreadsheet tersebut.
3. Salin semua file di folder `gas/` ke Apps Script dengan nama file yang sama.
4. Jalankan fungsi `installBackend()` sekali untuk membuat sheet:
   - `Animals`
   - `Participants`
   - `Distribution`
   - `Modules`
5. Deploy sebagai Web App dengan akses `Anyone`.
6. Jalankan fungsi `installSecureBackend()` sekali dari Apps Script editor.
7. Salin nilai `adminToken` dari hasil eksekusi fungsi tersebut.
8. Salin nilai `adminPassword` dari hasil eksekusi fungsi tersebut untuk login admin/panitia.
9. Deploy sebagai Web App dengan akses `Anyone`.
10. Salin URL Web App untuk dipakai di Vercel Environment Variable `GAS_WEB_APP_URL`.

Script Properties yang dipakai:

- `SPREADSHEET_ID`: ID Google Sheet. Boleh kosong jika Apps Script terikat langsung ke spreadsheet.
- `ADMIN_TOKEN`: token rahasia untuk action admin.

Endpoint utama:

- `GET ?action=publicAnimals`: data publik hewan qurban.
- `GET ?action=state`: semua data admin.
- `POST action=saveAnimal`: simpan hewan.
- `POST action=saveParticipant`: simpan peserta.
- `POST action=saveDistribution`: simpan distribusi.
- `POST action=syncState`: sinkron semua data frontend ke Google Sheet.

Sheet `Modules` menyimpan data operasional tambahan dalam format JSON per key:

- `appSettings`: pengaturan masjid/lembaga, tahun kurban, kontak, dan status aplikasi.
- `areas`: wilayah distribusi.
- `users`: akun admin dan panitia.
- `coupons`: kupon distribusi.
- `scanHistory`: riwayat scan kupon.
- `profile`: profil akun aktif.
- modul lama seperti `savers`, `transactions`, `meatYield`, `recipients`, dan `minutes`.

Akun demo lokal:

- Admin: username `admin`, password `admin123`.
- Panitia: username `panitia`, password `panitia123`.

Pada mode Vercel + Google Apps Script, login bisa memakai `ADMIN_PASSWORD` master atau akun aktif yang tersimpan di `Modules.users`. Role `Panitia` hanya membuka dashboard, scan kupon, riwayat scan, dan profil.

Kolom hewan mendukung `photoUrl`. Isi dengan URL gambar publik, misalnya gambar dari Google Drive yang sudah dibuat public, CDN, atau path asset lokal.

## Alur GitHub ke Vercel

Alur yang disiapkan:

1. Code project ini dipush ke GitHub.
2. Vercel dihubungkan ke repository GitHub.
3. Tambahkan Environment Variable di Vercel:
   - Name: `GAS_WEB_APP_URL`
   - Value: URL deploy Google Apps Script, contoh `https://script.google.com/macros/s/xxx/exec`
   - Name: `GAS_ADMIN_TOKEN`
   - Value: token yang sama dengan `ADMIN_TOKEN` di Script Properties Apps Script
4. Deploy Vercel.
5. Website publik memanggil `/api/gas?action=publicAnimals`.
6. Admin memanggil `/api/gas?action=state` dan `POST /api/gas`.
7. File `api/gas.js` meneruskan request ke Google Apps Script memakai `process.env.GAS_WEB_APP_URL` dan `process.env.GAS_ADMIN_TOKEN`.
8. Setiap panitia yang login melalui URL Vercel akan memuat data terbaru dari Google Sheet dan perubahan akan disinkronkan lewat `syncState`.

Catatan penting:

- Jangan isi URL GAS di file publik jika deploy memakai Vercel.
- `src/config.js` cukup memakai `apiBaseUrl: "/api/gas"`.
- `.env` lokal tidak ikut Git karena sudah masuk `.gitignore`.
- Token admin tidak pernah ditulis di file frontend.
