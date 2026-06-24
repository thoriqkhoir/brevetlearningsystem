# Panduan Pengujian Performa dengan k6

Folder ini berisi skrip pengujian performa menggunakan **k6** untuk aplikasi Laravel **taxlearning**. Skrip ini memverifikasi stabilitas, kecepatan respon, serta performa aplikasi saat diakses oleh banyak pengguna virtual (Virtual Users / VUs) secara bersamaan.

## Prasyarat

Sebelum memulai, pastikan k6 telah terinstal di sistem Anda.

Jika belum terinstal, Anda dapat menginstalnya dengan:

- **macOS** (menggunakan Homebrew):
  ```bash
  brew install k6
  ```
- **Windows** (menggunakan winget atau download installer):
  ```powershell
  winget install gnu.k6
  ```
- **Linux** (Debian/Ubuntu):
  ```bash
  sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD194422B70F3415B3A8002880B87F77C6C491
  echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
  sudo apt-get update
  sudo apt-get install k6
  ```

---

## Cara Menjalankan Pengujian

Jalankan perintah berikut di root folder proyek:

### 1. Uji Coba Cepat (Smoke Test)
Digunakan untuk memverifikasi bahwa skrip berjalan dengan benar dan endpoint merespon tanpa error. Hanya mensimulasikan 1 Virtual User (VU).
```bash
k6 run tests/k6/load-test.js
```
atau secara eksplisit:
```bash
k6 run -e TEST_TYPE=smoke tests/k6/load-test.js
```

### 2. Pengujian Beban Normal (Load Test)
Mensimulasikan beban normal pada aplikasi (ramp-up secara bertahap hingga 20 VU, bertahan selama 3 menit, lalu ramp-down).
```bash
k6 run -e TEST_TYPE=load tests/k6/load-test.js
```

### 3. Pengujian Stress (Stress Test)
Menguji batas maksimal sistem (breaking point) dengan menaikkan beban hingga 100 VU untuk melihat apakah server crash atau performa menurun drastis.
```bash
k6 run -e TEST_TYPE=stress tests/k6/load-test.js
```

### 4. Pengujian Rendam (Soak / Endurance Test)
Menguji sistem dengan beban konstan (15 VU) dalam durasi lama (30 menit) untuk mendeteksi adanya kebocoran memori (memory leaks) atau penumpukan resource.
```bash
k6 run -e TEST_TYPE=soak tests/k6/load-test.js
```

---

## Variabel Lingkungan (Environment Variables)

Anda dapat mengubah parameter pengujian menggunakan argumen `-e` atau `--env`:

- **`BASE_URL`**: Menentukan target server yang akan diuji (default: `http://localhost:8000`).
  ```bash
  k6 run -e BASE_URL=https://staging.taxlearning.test -e TEST_TYPE=load tests/k6/load-test.js
  ```
- **`TEST_TYPE`**: Tipe skenario pengujian (`smoke`, `load`, `stress`, `soak`).

---

## Metrik & Ambang Batas (Thresholds)

Pengujian ini menggunakan kriteria lulus/gagal (thresholds) sebagai berikut:
- **`http_req_failed`**: Kurang dari 1% request yang gagal (error rate < 1%).
- **`http_req_duration`**: 95% dari total request harus selesai dalam waktu kurang dari 500ms (`p(95) < 500`).

Hasil pengujian akan ditunjukkan dengan tanda centang hijau (pass) atau silang merah (fail) pada terminal Anda setelah pengujian selesai.
