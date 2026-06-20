# PRD: Kalkulator Finansial Pribadi (Working Title: "Slip")

**Versi:** 1.3 (semua pertanyaan terbuka resolved — lihat bagian 12)
**Tanggal:** 20 Juni 2026
**Stack:** Next.js + Tailwind CSS
**Status:** Final — siap masuk tahap implementasi

---

## 1. Latar Belakang & Masalah

Banyak orang tidak punya gambaran jelas berapa sisa uang mereka sampai akhir tahun, terutama saat ada kombinasi gaji dengan masa kerja terbatas, pajak/potongan, cicilan/utang dengan tenor berbeda-beda, dan pengeluaran rutin maupun insidental. Kalkulator finansial yang ada di pasaran umumnya cuma menghitung satu hal spesifik (KPR, pajak, atau tabungan saja), bukan gambaran arus kas menyeluruh dari sekarang sampai akhir tahun.

## 2. Tujuan Produk (Goals)

- Memberi pengguna proyeksi saldo bulanan dari bulan berjalan sampai Desember tahun ini.
- Memungkinkan input fleksibel: pajak opsional, tabungan opsional, cicilan/utang dengan masa berbeda-beda.
- Tidak butuh akun/login — data tersimpan lokal di browser (localStorage).
- Selesai dibangun dan deploy dalam satu hari kerja.

## 3. Non-Goals (Di Luar Cakupan V1)

- Tidak menghitung pajak otomatis berdasarkan tabel PPh resmi — pajak 100% input manual dari pengguna.
- Tidak ada sinkronisasi multi-device / akun cloud.
- Tidak ada proyeksi lintas tahun (berhenti di Desember tahun berjalan).
- Tidak ada fitur reminder/notifikasi pembayaran.

## 4. Target Pengguna

Pekerja individu (karyawan tetap, kontrak, atau freelancer) di Indonesia yang ingin tahu gambaran arus kas sisa tahun berjalan, terutama yang punya cicilan/utang dengan tenor spesifik.

---

## 5. Alur Pengguna (User Flow)

Single-page form dengan pola **trigger pertanyaan Ya/Tidak → form detail muncul (repeatable)** di setiap section opsional, diakhiri dashboard hasil.

```
[1] Tambah income (repeatable, minimal 1) ──> per item: nama + nominal + periode + masa
                          │
                          v
   [1a] Ada potongan pajak untuk income ini? ──Ya──> Daftar pajak (repeatable, basis = income ini)
                                          └──Tidak──> lanjut ke income berikutnya / section berikutnya
                          │
                          v
[2] Tabungan saat ini? (toggle include/exclude)
                          │
                          v
[3] Ada cicilan/utang? ──Ya──> Daftar cicilan & utang (repeatable) ──Tidak──> lanjut
                          │
                          v
[4] Ada pengeluaran rutin? ──Ya──> Daftar pengeluaran rutin (repeatable) ──Tidak──> lanjut
                          │
                          v
[5] Ada pengeluaran sekali bayar? ──Ya──> Daftar one-time expense (repeatable) ──Tidak──> lanjut
                          │
                          v
[6] DASHBOARD: Proyeksi bulan berjalan → Desember
```

---

## 6. Spesifikasi Fitur

| #   | Bagian                                         | Input                                                                                                                                                                                  | Sifat                                                            |
| --- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | **Income** _(repeatable, minimal 1)_           | Tombol "Tambah income" → per item: nama (Gaji, Freelance, Sewa, dll) + nominal per periode + periode (harian/mingguan/bulanan/tahunan) + masa (jumlah bulan aktif, atau "tanpa batas") | Wajib, repeatable                                                |
| 1a  | **Pajak/potongan per income**                  | Di tiap kartu income: tombol "Ada potongan pajak?" → bisa tambah >1 baris: nama + jenis (Persen % dari income ini / Nominal tetap Rp)                                                  | Opsional, manual, basis = income tersebut (bukan total gabungan) |
| 2   | **Tabungan saat ini**                          | Saldo sekarang + toggle include/exclude                                                                                                                                                | Opsional                                                         |
| 3   | **Cicilan & Utang** _(satu kategori gabungan)_ | Tombol "Ada cicilan/utang?" → bisa tambah >1 baris: nama + nominal per periode + periode (harian/mingguan/bulanan/tahunan) + masa (jumlah bulan aktif)                                 | Opsional, repeatable                                             |
| 4   | **Pengeluaran rutin**                          | Tombol "Ada pengeluaran rutin?" → title bebas + nominal + periode (harian/mingguan/bulanan)                                                                                            | Opsional, repeatable, tanpa masa (ongoing)                       |
| 5   | **Pengeluaran sekali bayar**                   | Tombol "Ada pengeluaran sekali bayar?" → title + nominal + bulan kejadian                                                                                                              | Opsional, repeatable                                             |
| 6   | **Dashboard**                                  | — (output)                                                                                                                                                                             | Lihat bagian 8                                                   |

---

## 7. Data Model (TypeScript — referensi untuk implementasi Next.js)

```typescript
type Periode = "harian" | "mingguan" | "bulanan" | "tahunan";
type JenisPotongan = "persen" | "nominal";

interface Pajak {
  id: string;
  nama: string;
  jenis: JenisPotongan;
  nilai: number; // persen (0-100) jika jenis="persen", atau Rp jika "nominal"
}

interface Income {
  id: string;
  nama: string; // contoh: "Gaji", "Freelance", "Sewa kos"
  nominal: number;
  periode: Periode;
  masaBulan: number | null; // null = tanpa batas, independen per income
  pajak: Pajak[]; // basis perhitungan = nominal income ini saja, bukan total gabungan
}

interface Tabungan {
  saldoSaatIni: number;
  include: boolean;
}

interface ItemBerkala {
  // dipakai untuk Cicilan & Utang (satu kategori gabungan)
  id: string;
  nama: string;
  nominal: number;
  periode: Periode;
  masaBulan: number; // wajib diisi, durasi aktif dalam bulan
}

interface PengeluaranRutin {
  id: string;
  title: string;
  nominal: number;
  periode: "harian" | "mingguan" | "bulanan"; // tidak ada "tahunan" untuk rutin
}

interface PengeluaranSekaliBayar {
  id: string;
  title: string;
  nominal: number;
  bulanKejadian: number; // index bulan 1-12
}

interface FinancialState {
  incomes: Income[]; // minimal 1 item
  tabungan: Tabungan;
  cicilanUtang: ItemBerkala[]; // gabungan cicilan & utang, satu kategori
  pengeluaranRutin: PengeluaranRutin[];
  pengeluaranSekaliBayar: PengeluaranSekaliBayar[];
}
```

---

## 8. Rumus & Logika Perhitungan

> Bagian ini ditulis eksplisit agar mudah diverifikasi sebelum implementasi.

### 8.1 Konversi nominal ke nilai bulanan (`toMonthly`)

Dipakai untuk cicilan/utang dan pengeluaran rutin yang periodenya bukan bulanan.

| Periode input | Rumus konversi ke nilai bulanan                |
| ------------- | ---------------------------------------------- |
| Harian        | `nominal × 30`                                 |
| Mingguan      | `nominal × 4.33` (asumsi 52 minggu ÷ 12 bulan) |
| Bulanan       | `nominal × 1`                                  |
| Tahunan       | `nominal ÷ 12`                                 |

**Asumsi yang perlu diverifikasi:** konversi ini pakai rata-rata uniform (30 hari/bulan, 4.33 minggu/bulan), bukan kalender presisi per bulan (Februari 28 hari, dst). Kalau presisi kalender penting, ini perlu di-redesign pakai tanggal aktual.

**Keputusan (lihat bagian 12, #1):** tetap pakai uniform average — selisih terbesar hanya ada di item harian pada bulan Februari (~7%), tidak signifikan untuk gambaran arus kas. Sebagai gantinya, UI menampilkan tooltip kecil di field periode: _"diasumsikan 30 hari/bulan, 4.33 minggu/bulan"_ supaya user tahu basis kalkulasinya.

### 8.2 Pajak per income (`taxForIncome`)

Dihitung independen untuk setiap item income — bukan dari total gabungan semua income.

```
Pajak_Income(income) = Σ (untuk setiap item pajak i milik income ini)
  jika jenis_i = "persen"  → pajak_i = toMonthly(income.nominal, income.periode) × (nilai_i / 100)
  jika jenis_i = "nominal" → pajak_i = nilai_i
```

**Asumsi (sudah dikonfirmasi):** basis persen selalu nilai bulanan dari income tersebut sendiri. Kalau ada 2 income (misal Gaji + Freelance), pajak masing-masing dihitung terpisah dan tidak saling memengaruhi.

### 8.3 Status aktif per bulan (`isActive(item, m)`)

`m` = index bulan relatif terhadap bulan berjalan (m = 0 untuk bulan ini, m = 1 untuk bulan depan, dst).

```
Income_i aktif di bulan m        → masaBulan_i === null  ATAU  m < masaBulan_i   (dicek independen per income)
CicilanUtang_i aktif di bulan m  → m < cicilanUtang_i.masaBulan
Pengeluaran rutin                → selalu aktif (tidak ada masa)
```

**Catatan penting:** masing-masing income punya masa sendiri-sendiri (sudah dikonfirmasi). Income A bisa saja sudah berhenti di bulan ke-3 sementara Income B masih aktif sampai Desember — keduanya dicek terpisah, tidak ada masa "global" yang menyamakan semua income. Selain itu, karena masa dinyatakan dalam jumlah bulan bulat, item dianggap berhenti tepat di awal bulan ke-`masaBulan`. Tidak ada perhitungan prorata harian di bulan terakhir.

**Keputusan (lihat bagian 12, #2):** granularitas bulanan penuh ini diterima, dan harus konsisten dengan asumsi bulan berjalan dihitung penuh (lihat 8.6). Supaya user tidak salah ekspektasi kapan item dianggap lunas, label input masa di UI harus eksplisit menyebutkan rentang aktif, contoh: _"Cicilan 12 bulan dimulai Juni → aktif Juni s/d Mei"_.

### 8.4 Total per kategori, per bulan m

```
Pendapatan_Bersih(m) = Σ (untuk setiap income_i yang aktif(m)):
                          toMonthly(income_i.nominal, income_i.periode) − Pajak_Income(income_i)

Total_CicilanUtang(m) = Σ toMonthly(cicilanUtang_i)  untuk semua item cicilanUtang_i yang aktif(m)

Total_PengeluaranRutin(m) = Σ toMonthly(rutin_j)  untuk semua item rutin j (selalu aktif)

Total_SekaliBayar(m) = Σ nominal_k  untuk semua pengeluaran sekali-bayar k
                        dengan bulanKejadian_k === bulan_kalender(m)
```

### 8.5 Arus kas bersih bulanan (cashflow)

```
Cashflow(m) = Pendapatan_Bersih(m)
              − Total_CicilanUtang(m)
              − Total_PengeluaranRutin(m)
              − Total_SekaliBayar(m)
```

### 8.6 Saldo kumulatif (proyeksi akhir tahun)

```
Saldo(0) = Tabungan.include ? Tabungan.saldoSaatIni : 0
Saldo(m) = Saldo(m-1) + Cashflow(m)     untuk m = 0 ... (Desember − bulan_ini)
```

Rentang `m` berjalan dari bulan kalender saat ini sampai Desember tahun berjalan (inklusif). Jumlah total bulan yang dihitung = `12 − bulan_ini_index + 1`.

**Asumsi:** bulan berjalan dihitung penuh satu bulan (tidak prorata sisa hari di bulan saat aplikasi dibuka), supaya logika tetap sederhana dan konsisten kapan pun pengguna membuka aplikasi dalam sebulan itu.

**Keputusan (lihat bagian 12, #3):** asumsi ini diterima karena user tidak perlu mikir "dihitung dari tanggal berapa", dan logika kode jauh lebih sederhana. Sebagai gantinya, dashboard menampilkan baris kecil: _"Proyeksi dihitung dari awal [Bulan] [Tahun]"_ (lihat bagian 10).

### 8.7 Indikator & warning

```
Defisit_Warning(m)              = true jika Saldo(m) < 0
Income_Berakhir_Warning(income) = true jika income.masaBulan !== null DAN income.masaBulan < (12 − bulan_ini_index + 1)
Item_Lunas_Badge(item, m)       = true pada bulan m dimana m === item.masaBulan − 1 (bulan terakhir item ini aktif)

Semua_Income_Berakhir_Warning = true jika SETIAP income_i memenuhi:
                                   income_i.masaBulan !== null DAN income_i.masaBulan < (12 − bulan_ini_index + 1)
Bulan_Pendapatan_Nol = MAX(income_i.masaBulan) dari semua income — bulan dimana income terakhir berhenti
```

Dicek per item income — kalau ada 3 income dan hanya 1 yang masanya habis sebelum Desember, badge per item hanya muncul untuk income tersebut.

**Keputusan (lihat bagian 12, #5):** dua lapis warning ditampilkan sekaligus. Badge per item (`Income_Berakhir_Warning`) tetap ada di baris masing-masing income, **ditambah** satu warning gabungan (`Semua_Income_Berakhir_Warning`) sebagai banner terpisah di bagian atas dashboard — bukan cuma badge inline — karena ini informasi krusial yang gampang terlewat kalau user langsung scroll ke angka akhir.

### 8.8 Ringkasan untuk dashboard

```
Saldo_Akhir_Desember = Saldo(m_terakhir)
Total_Pajak_Tahunan_Sisa = Σ Pajak_Income(income_i) untuk semua income aktif, dijumlah per bulan m
Total_CicilanUtang_Tahunan_Sisa = Σ Total_CicilanUtang(m) untuk semua m
Rasio_CicilanUtang_Pendapatan = Total_CicilanUtang(0) / Pendapatan_Bersih(0)  -- pakai bulan ini sebagai snapshot
```

---

## 9. Validasi Form

**Keputusan (lihat bagian 12, #4):** tidak ada validasi blocking di tengah form. User bisa mengisi section manapun dalam urutan apapun, skip, atau kembali tanpa diblokir. Validasi hanya dijalankan saat user menekan tombol **"Hitung Proyeksi"**.

```
isValidSubmit = incomes.length > 0  DAN  incomes.some(i => i.nominal > 0)
```

Kalau belum valid: halaman auto-scroll ke section Income, dan inline error muncul di bawah field yang kosong/bernilai 0 — bukan alert atau modal. Tidak ada field lain yang perlu divalidasi karena semua selain income bersifat opsional.

---

## 10. Spesifikasi Dashboard (Output)

| Elemen                              | Deskripsi                                                                                                                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angka utama                         | Proyeksi saldo akhir Desember (besar, di atas)                                                                                                                                                             |
| Grafik line/bar                     | Saldo per bulan, dari bulan ini sampai Desember                                                                                                                                                            |
| Breakdown                           | Pie/bar: total pajak vs cicilan & utang vs pengeluaran rutin vs sisa, untuk bulan berjalan                                                                                                                 |
| Badge "lunas"                       | Ditampilkan pada bulan dimana item cicilan/utang tertentu berakhir                                                                                                                                         |
| Warning defisit                     | Highlight merah pada bulan dimana saldo proyeksi < 0                                                                                                                                                       |
| Warning income berakhir (per item)  | Notice pada baris income yang masanya habis sebelum Desember                                                                                                                                               |
| Warning pendapatan habis (gabungan) | Banner di bagian **atas** dashboard, muncul hanya jika SEMUA income berakhir sebelum Desember: _"Pendapatan Anda berakhir pada [bulan X]. Proyeksi bulan [X+1] hingga Desember dihitung tanpa pemasukan."_ |
| Catatan asumsi kalender             | Baris kecil di dekat grafik: _"Proyeksi dihitung dari awal [Bulan] [Tahun]"_                                                                                                                               |

---

## 11. Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **State & persistence:** React state + localStorage (tanpa backend, tanpa database)
- **Chart:** library ringan seperti Recharts atau Chart.js untuk grafik proyeksi
- **Deployment:** Vercel (gratis)

---

## 12. Keputusan Desain (Resolusi Pertanyaan Terbuka)

Lima pertanyaan terbuka dari draft sebelumnya sudah diputuskan sebagai berikut:

**#1 — Konversi 30 hari/bulan & 4.33 minggu/bulan**
Keputusan: pakai uniform average, dokumentasikan asumsinya. Untuk proyeksi finansial personal (bukan akuntansi), selisih kalender presisi vs uniform average tidak mengubah keputusan user — selisih terbesar hanya di item harian pada bulan Februari (~7%), tidak signifikan. Kalender presisi menambah kompleksitas kode yang tidak sebanding nilainya di V1. Yang lebih penting adalah transparansi: tooltip kecil di field periode menyebutkan asumsinya secara eksplisit.

**#2 — Item berakhir di awal bulan ke-`masaBulan`, tanpa prorata**
Keputusan: cukup, dan konsisten dengan keputusan #3. Granularitas harian untuk masa berakhir tidak sebanding dengan kompleksitas implementasinya. Yang penting adalah konsistensi internal — karena bulan berjalan dihitung penuh, item yang mulai bulan ini juga wajar dihitung bulan penuh, supaya tidak mencampur dua granularitas berbeda dalam satu kalkulasi. Label input masa di UI harus eksplisit menyebutkan rentang aktif.

**#3 — Bulan berjalan dihitung penuh tanpa prorata**
Keputusan: diterima, dengan catatan asumsi ditampilkan di dashboard. User yang buka aplikasi tanggal 2 Juni dan tanggal 29 Juni akan dapat hasil yang sama untuk bulan Juni — kurang akurat tapi jauh lebih mudah dipahami, dan logika kode jauh lebih sederhana. Edge case di mana user sudah tahu gaji bulan ini tidak akan masuk bisa diabaikan di V1, karena bisa dihandle manual lewat field masa.

**#4 — Validasi mandatory field**
Keputusan: tidak ada validasi di tengah form, hanya saat user menekan "Hitung Proyeksi". Form mengalir bebas tanpa blokir. Saat submit, dicek apakah ada minimal satu income dengan nominal > 0; kalau belum, auto-scroll ke section income dengan inline error di bawah field — bukan alert/modal. Tidak ada field lain yang perlu divalidasi karena semuanya opsional.

**#5 — Warning kalau semua income berakhir sebelum Desember**
Keputusan: dua lapis warning, keduanya ditampilkan. Warning per item tetap ada (badge di baris income yang bersangkutan), ditambah satu warning gabungan di bagian atas dashboard. Alasannya: warning per item mudah terlewat kalau user langsung scroll ke angka akhir, sementara warning gabungan di atas memastikan user tidak salah baca saldo akhir Desember sebagai angka "normal" — padahal sudah termasuk bulan-bulan tanpa pemasukan sama sekali.

**Ringkasan:**

| #   | Keputusan                                                          |
| --- | ------------------------------------------------------------------ |
| 1   | Uniform average, tampilkan asumsi di tooltip                       |
| 2   | Granularitas bulanan penuh, label UI harus eksplisit rentang aktif |
| 3   | Bulan berjalan dihitung penuh, tampilkan asumsi di dashboard       |
| 4   | Validasi hanya saat submit, inline error di section income         |
| 5   | Warning per item + warning gabungan di hasil perhitungan dashboard |
