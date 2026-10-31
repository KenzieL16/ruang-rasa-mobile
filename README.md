# Ruang Rasa Mobile 📱✨

Aplikasi mobile **Ruang Rasa** berbasis **React Native** dan **Expo**, sama persis dengan versi web `ruang-rasa`

---

## 🔒 Fitur Keamanan & Autentikasi
- **Strict Auth Guard**: Tidak ada halaman (Beranda, Menu, Detail Menu, Keranjang, Checkout, maupun Admin Panel) yang dapat diakses sebelum pengguna login.
- **Login Pelanggan**: Masuk menggunakan email & password.
- **Register Pelanggan**: Pendaftaran akun baru langsung terhubung ke backend MongoDB.
- **Login Admin**: Pilihan login terpisah untuk akun ber-role `admin` (`/admin/login`).
- **Penyimpanan Sesi Aman**: Token JWT dan sesi pengguna disimpan menggunakan `@react-native-async-storage/async-storage` dengan verifikasi berkala ke endpoint `/api/auth/me`.

---

## 🍽️ Halaman-Halaman (Sama Persis dengan Versi Web)

### 1. Pelanggan (Customer View)
- **Beranda (Home)**:
  - Hero section: *"Satu meja, banyak cerita."*, tombol *"Lihat Menu →"*, dan foto hero.
  - Dari Dapur Kami: Kategori pilihan (*Makanan Utama*, *Camilan*, *Dessert*, *Minuman*).
  - Tentang Kami: Cerita Ruang Rasa dan foto resto.
- **Menu**:
  - Pencarian menu interaktif.
  - Filter kategori horizontal (*Semua*, *Makanan Utama*, *Camilan*, *Dessert*, *Minuman*).
  - Kartu produk lengkap dengan gambar lokal/remote, harga Rupiah, dan tombol *+ Keranjang*.
- **Detail Menu**:
  - Foto hidangan resolusi tinggi, deskripsi lengkap, harga, dan tombol *Tambah ke Keranjang*.
- **Keranjang (Cart)**:
  - Daftar pesanan dengan kontrol kuantitas (`+` / `-`), hapus item, dan ringkasan total harga.
- **Checkout**:
  - Form pemesanan (Nama lengkap & nomor telepon terisi otomatis dari profil).
  - Pilihan metode: *Dine In* atau *Take Away*.
  - Pilihan pembayaran: *QRIS* (simulasi) atau *Cash di Kasir*.
  - Integrasi API order ke backend (`POST /api/orders`) dan layar konfirmasi pesanan berhasil.
- **Profil**:
  - Informasi akun, riwayat pesanan (*My Orders*), pengaturan URL server API, dan tombol keluar (*Logout*).

### 2. Panel Admin (Admin View)
- **Admin Dashboard**: Kartu statistik *Total Produk*, *Total Pengguna*, dan *Total Pesanan*.
- **Manage Products**: Katalog produk restoran Ruang Rasa.
- **Manage Users**: Daftar pengguna yang terdaftar dari backend database.
- **Manage Orders**: Pantau pesanan pelanggan dan ubah status pesanan (*pending*, *confirmed*, *ready*, *completed*, *cancelled*).
- **Akses Fleksibel**: Admin dapat berpindah antara tampilan Admin Panel dan tampilan Website pelanggan.

---

## ⚙️ Konfigurasi URL Backend

Secara default, URL backend otomatis disesuaikan di .env

> 💡 **Tip:** Anda juga dapat mengubah atau memeriksa IP backend langsung dari dalam aplikasi melalui tombol ikon **⚙️** di pojok atas layar!

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan backend (`backend-ta-sem-3`) sudah berjalan di port `5000`:
```bash
# Di folder backend-ta-sem-3
npm install
set akun admin di .env backend
npm run seed
npm run dev
```

Lalu jalankan project mobile menggunakan perintah dev:
```bash
# Masuk ke folder mobile
cd ruang-rasa-mobile

# Jalankan development server
npm run dev
# atau: npx expo start
```

### Pilihan Menjalankan:
- Tekan **`i`** untuk membuka di iOS Simulator.
- Tekan **`a`** untuk membuka di Android Emulator.
- Tekan **`w`** untuk membuka di browser Web.
- Pindai **QR Code** menggunakan aplikasi **Expo Go** di HP fisik Anda (pastikan HP dan laptop terhubung ke jaringan Wi-Fi yang sama).

