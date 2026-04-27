# Logic Project Manajemen Hewan Qurban

Project ini dibuat sebagai aplikasi frontend statis yang bisa berjalan lokal dengan `localStorage`, dan bisa sinkron antar panitia melalui Vercel proxy + Google Apps Script + Google Sheet.

## Root

- `index.html`: kerangka aplikasi, navigasi, dashboard, tabel, form dialog, dan area validasi.
- `hewan.html`: website publik untuk menampilkan daftar hewan qurban, sisa kuota, biaya, bobot, jadwal, dan status.
- `admin.html`: aplikasi operasional Admin/Panitia untuk hewan, peserta, kupon, scan, laporan, dan pengaturan.
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
  - login memakai username dan password dari `modules.users`.
  - Apps Script menerima akses jika `ADMIN_PASSWORD` cocok atau akun di `Modules.users` aktif dan password cocok.
  - akun bawaan lokal: `admin/admin123` untuk Admin dan `panitia/panitia123` untuk Panitia.
  - Admin dapat berpindah mode Admin/Panitia, sedangkan akun Panitia terkunci di menu Panitia.
- Logic kupon:
  - generate kupon otomatis berdasarkan wilayah dan kategori.
  - import kupon pengkurban dari data peserta.
  - kupon umum dapat dibuat tanpa nama penerima.
  - scan kupon menolak kode yang tidak ditemukan atau sudah pernah diterima.
  - setiap scan masuk ke riwayat berisi waktu, petugas, penerima, wilayah, dan status.
  - laporan kupon bisa diunduh CSV dan laporan distribusi bisa dicetak.
- Logic hewan:
  - tambah, edit, hapus hewan.
  - kode hewan dibuat otomatis berdasarkan jenis: `SP-xx` untuk sapi, `KG-xx` untuk kambing, dan `DM-xx` untuk domba.
  - kode hewan wajib unik di frontend dan backend.
  - simpan `photoUrl` untuk profil/foto hewan di halaman publik.
  - jenis hewan menentukan kuota: sapi 7 peserta, kambing/domba 1 peserta.
  - status hewan: `booking`, `paid`, `slaughtered`, `distributed`.
  - hewan tidak boleh dihapus jika masih punya peserta.
- Alur hewan sampai pemotongan:
  - Admin mencatat hewan di menu Data Hewan sebagai sumber utama kode hewan, jenis, harga, jadwal, lokasi, dan status.
  - Peserta/booking memilih hewan dari data tersebut, sehingga kuota dan pembayaran terhubung ke `animalId`.
  - Saat hewan dipotong, panitia membuka `Modul Teknis > Perolehan daging`.
  - Field `Kode hewan` pada Perolehan daging mengambil opsi otomatis dari Data Hewan, bukan input manual.
  - Setelah bobot karkas dan jumlah kantung disimpan, record hewan dengan kode yang sama ikut diperbarui: `carcassWeight` terisi dan status berubah ke `slaughtered` jika sebelumnya masih `booking` atau `paid`.
  - Data perolehan daging tetap tersimpan di `modules.meatYield` sebagai arsip teknis, sedangkan ringkasan utama hewan tetap berada di `animals`.
- Logic peserta:
  - tambah, edit, hapus peserta.
  - peserta wajib memilih hewan.
  - token/invoice peserta wajib unik.
  - nama + telepon yang sama tidak boleh didaftarkan dua kali pada hewan yang sama.
  - iuran otomatis disarankan dari harga beli + biaya operasional dibagi kuota hewan.
  - peserta baru ditolak jika kuota hewan sudah penuh.
  - status pembayaran dihitung dari `paid >= due`.
  - kartu peserta dapat dicetak per peserta atau seluruh peserta dari halaman Peserta.
- Logic distribusi:
  - paket warga, mustahik, panitia, dan peserta.
  - total paket masuk ke ringkasan.
- Logic anti-duplikat:
  - wilayah tidak boleh memakai nama yang sama.
  - user tidak boleh memakai username yang sama.
  - modul teknis menolak baris data yang seluruh field-nya sama dengan baris yang sudah ada.
  - kupon umum manual menolak kombinasi penerima + wilayah + kategori yang sama.
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
- `ModuleService.gs`: simpan dan baca modul teknis, akun, pengaturan, wilayah, kupon, scan, dan profil dari sheet `Modules`.
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

`syncState` menulis seluruh state aplikasi ke Google Sheet:

- `Animals`: data hewan.
- `Participants`: data peserta/pengkurban.
- `Distribution`: paket distribusi dan target distribusi.
- `Modules`: data tambahan dalam JSON per key, termasuk `appSettings`, `areas`, `users`, `coupons`, `scanHistory`, `profile`, dan modul teknis lama.

Dengan pola ini, beberapa panitia dapat memakai URL Vercel yang sama. Saat login, frontend memanggil `GET state` untuk mengambil data terbaru dari Google Sheet. Setiap perubahan lokal akan dikirim kembali melalui `POST syncState`.

## Folder `api`

Folder ini dipakai oleh Vercel Serverless Functions.

- `api/gas.js`: proxy request dari frontend ke Google Apps Script.
- Membaca URL GAS dari environment variable `GAS_WEB_APP_URL`.
- Membaca token admin dari environment variable `GAS_ADMIN_TOKEN`.
- Mendukung `GET` untuk data publik/admin dan `POST` untuk simpan data.
- Membatasi action yang boleh diteruskan agar endpoint proxy tidak bebas dipakai untuk action lain.
- Menambahkan token admin hanya dari sisi server Vercel, bukan dari browser.
- Meneruskan username/password login ke Apps Script untuk validasi akun di sheet `Modules`.

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

## Status Pengembangan Lanjutan

- Selesai: QR code asli untuk kupon distribusi memakai gambar QR scannable pada template cetak kupon.
- Selesai: scanner kamera membaca QR kupon dengan `BarcodeDetector`, dengan input manual tetap tersedia sebagai fallback.
- Sebagian: template cetak kupon distribusi sudah tersedia untuk kategori kupon `Umum`, `Mustahik`, dan `Pengkurban`; kategori `Warga` masih dipakai pada modul distribusi, belum sebagai kategori kupon utama.
- Selesai: import Excel/CSV asli untuk kupon atau peserta dari file `.xlsx`, `.xls`, `.csv`, `.tsv`, atau `.txt`.
- Sebagian: ekspor Excel sudah tersedia untuk laporan kupon dan audit log, sedangkan PDF masih melalui fitur cetak browser/simpan sebagai PDF.
- Selesai: audit log perubahan data mencatat waktu, user, role, aksi, detail, dan versi data.
- Sebagian: permission detail sudah diterapkan di frontend untuk role Admin, Bendahara, Distribusi, Scanner, dan Panitia; backend masih memakai validasi token/akun umum, belum ACL per action.
- Selesai: dashboard publik status distribusi menampilkan ringkasan paket/status tanpa membuka nama penerima.
- Selesai: proteksi konflik sinkronisasi memakai `meta.version` dan `baseVersion` agar perubahan panitia lain tidak tertimpa diam-diam.
