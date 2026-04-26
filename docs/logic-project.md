# Logic Project Manajemen Hewan Qurban

Project ini dibuat sebagai aplikasi frontend statis. Semua data tersimpan di `localStorage`, sehingga bisa dipakai langsung tanpa backend.

## Root

- `index.html`: kerangka aplikasi, navigasi, dashboard, tabel, form dialog, dan area validasi.
- `hewan.html`: website publik untuk menampilkan daftar hewan qurban, sisa kuota, biaya, bobot, jadwal, dan status.
- `vercel.json`: konfigurasi deploy Vercel untuk header dan clean URL.
- `.env.example`: contoh environment variable Vercel.
- `styles/main.css`: tampilan aplikasi operasional yang responsif untuk desktop dan mobile.

## Folder `src`

- `src/app.js`: pusat logic aplikasi.
- `src/config.js`: tempat mengisi URL Web App Google Apps Script.
- `src/public-animals.js`: logic website publik list hewan qurban.
- Pada Vercel, frontend memakai `apiBaseUrl: "/api/gas"` sehingga URL GAS tidak terbuka di browser.
- State utama berisi `animals`, `participants`, dan `distribution`.
- Data operasional role Admin/Panitia disimpan di `modules` agar tetap ikut tersinkron oleh endpoint `syncState`.
- Logic role:
  - Admin melihat dashboard, pengaturan aplikasi, wilayah, user, kupon, scan, riwayat, laporan, profil, dan modul data pendukung.
  - Panitia melihat dashboard, scan kupon, riwayat scan, dan profil akun.
- Logic kupon:
  - generate kupon otomatis berdasarkan wilayah dan kategori.
  - import kupon pengkurban dari data peserta.
  - kupon umum dapat dibuat tanpa nama penerima.
  - scan kupon menolak kode yang tidak ditemukan atau sudah pernah diterima.
  - setiap scan masuk ke riwayat berisi waktu, petugas, penerima, wilayah, dan status.
- Logic hewan:
  - tambah, edit, hapus hewan.
  - simpan `photoUrl` untuk profil/foto hewan di halaman publik.
  - jenis hewan menentukan kuota: sapi 7 peserta, kambing/domba 1 peserta.
  - status hewan: `booking`, `paid`, `slaughtered`, `distributed`.
  - hewan tidak boleh dihapus jika masih punya peserta.
- Logic peserta:
  - tambah, edit, hapus peserta.
  - peserta wajib memilih hewan.
  - iuran otomatis disarankan dari harga beli + biaya operasional dibagi kuota hewan.
  - peserta baru ditolak jika kuota hewan sudah penuh.
  - status pembayaran dihitung dari `paid >= due`.
- Logic distribusi:
  - paket warga, mustahik, panitia, dan peserta.
  - total paket masuk ke ringkasan.
- Logic validasi:
  - cek hewan tanpa peserta.
  - cek hewan tanpa jadwal sembelih.
  - cek kuota hewan yang melebihi batas.
  - cek peserta yang belum lunas.

## Folder `styles`

- Mengatur layout sidebar, topbar, ringkasan, tabel, dialog, dan responsive mobile.
- `styles/public.css` mengatur tampilan publik daftar hewan, filter, ringkasan kuota, dan kartu hewan.
- Warna dibuat tenang untuk aplikasi panitia: hijau tua, krem, amber, dan merah status.

## Folder `assets`

- `qurban-mark.svg`: identitas visual sederhana untuk aplikasi.
- `qurban-hero.svg`: visual suasana Idul Adha untuk hero website publik.
- `animal-sapi.svg`, `animal-kambing.svg`, `animal-domba.svg`: fallback profil hewan jika `photoUrl` belum diisi.

## Folder `gas`

Backend Google Apps Script dibuat modular supaya mudah dirawat.

- `Code.gs`: entrypoint `doGet`, `doPost`, dan `installBackend`.
- `Auth.gs`: validasi token admin dari Script Properties.
- `Config.gs`: konfigurasi spreadsheet, nama sheet, header kolom, dan waktu.
- `Response.gs`: response JSON dan JSONP untuk website statis.
- `SheetService.gs`: setup sheet, baca data, tulis data, upsert, dan delete row.
- `AnimalService.gs`: CRUD hewan, validasi hewan, normalisasi data, dan logic kuota jenis hewan.
- `ParticipantService.gs`: CRUD peserta, validasi peserta, cek hewan tersedia, dan pencegahan kuota penuh.
- `DistributionService.gs`: baca dan simpan data distribusi paket daging.
- `SummaryService.gs`: hitung total hewan, kuota, pembayaran, dan paket.
- `Router.gs`: mapping action API ke service yang sesuai.
- `appsscript.json`: manifest Apps Script.

Action GET:

- `setup`: membuat sheet dan header.
- `publicAnimals`: data hewan untuk website publik.
- `animals`: data hewan, peserta, dan ringkasan.
- `participants`: data peserta.
- `distribution`: data distribusi.
- `state`: semua data.

Action POST:

- `saveAnimal`
- `deleteAnimal`
- `saveParticipant`
- `deleteParticipant`
- `saveDistribution`
- `syncState`

## Folder `api`

Folder ini dipakai oleh Vercel Serverless Functions.

- `api/gas.js`: proxy request dari frontend ke Google Apps Script.
- Membaca URL GAS dari environment variable `GAS_WEB_APP_URL`.
- Membaca token admin dari environment variable `GAS_ADMIN_TOKEN`.
- Mendukung `GET` untuk data publik/admin dan `POST` untuk simpan data.
- Membatasi action yang boleh diteruskan agar endpoint proxy tidak bebas dipakai untuk action lain.
- Menambahkan token admin hanya dari sisi server Vercel, bukan dari browser.

## Alur Deploy

1. Deploy backend `gas/` ke Google Apps Script sebagai Web App.
2. Jalankan `installSecureBackend()` di Apps Script editor untuk membuat `ADMIN_TOKEN` dan setup sheet.
3. Push project frontend + `api/gas.js` ke GitHub.
4. Connect repo GitHub ke Vercel.
5. Di Vercel, isi environment variable `GAS_WEB_APP_URL` dan `GAS_ADMIN_TOKEN`.
6. Vercel deploy website dan endpoint `/api/gas`.
7. `hewan.html` memanggil `/api/gas?action=publicAnimals`.
8. `index.html` admin memanggil `/api/gas?action=state` dan sync data lewat `POST /api/gas`.
9. `/api/gas` meneruskan request ke Google Apps Script dengan token admin untuk action private.

## Pengembangan Berikutnya

- Tambah backend atau Google Sheet untuk sinkronisasi antar panitia.
- Tambah fitur cetak kartu peserta.
- Tambah ekspor Excel/PDF laporan.
- Tambah akun admin dan role panitia.
