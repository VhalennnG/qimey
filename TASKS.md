# Tasks & Roadmap: Qimey ("Slip")

## Alur Kerja & Progress

Dokumen ini melacak kemajuan implementasi aplikasi Qimey. Pengerjaan dilakukan secara bertahap dengan memverifikasi kriteria selesai (DoD) pada setiap langkah sebelum melangkah ke tugas berikutnya.

---

## TUGAS 1: Setup Proyek & Struktur Dasar

_Inisialisasi aplikasi Next.js (App Router), konfigurasi Tailwind CSS, serta setup utilitas dasar dan file ikon._

### Sub-Tugas Checklist

- [ ] Inisialisasi proyek Next.js dengan App Router di direktori aktif (`./`).
- [ ] Konfigurasi Tailwind CSS dan variabel sistem warna (merujuk pada gaya premium di `mockup.html`).
- [ ] Instalasi dependensi tambahan (`recharts` untuk visualisasi chart dan Lucide/Tabler icons jika diperlukan, atau SVG manual).
- [ ] Setup folder utilitas matematika finansial (`utils/finance.ts`) dan tipe data global (`types/finance.ts`).
- [ ] Konfigurasi SEO dasar (Meta tags, viewport, title "Qimey - Kalkulator Finansial Pribadi").

### Kriteria Selesai (DoD)

- **Kebenaran Fungsional:** Proyek berhasil dikompilasi menggunakan `npm run dev` tanpa error.
- **Kualitas Desain & UX:** Variabel CSS/Tailwind CSS terdefinisi dengan palet warna modern (Glassmorphism, dark/light tones).
- **Stabilitas Kode:** Struktur folder bersih, tipe TypeScript dasar tervalidasi dengan ketat.
- **Pengujian:** Verifikasi halaman awal Next.js bisa diakses di local browser.

---

## TUGAS 2: Implementasi Model Data & Utilitas Perhitungan (Engine)

_Membangun tipe data TypeScript lengkap dan fungsi utilitas finansial yang melakukan perhitungan proyeksi sesuai rumus PRD bagian 8._

### Sub-Tugas Checklist

- [ ] Menulis file `types/finance.ts` sesuai dengan model data di PRD.
- [ ] Membuat fungsi `toMonthly(nominal, periode)` di `utils/finance.ts` dengan asumsi uniform average (30 hari/bulan, 4.33 minggu/bulan) disertai tooltip.
- [ ] Membuat fungsi `calculateTaxForIncome(income)` yang menghitung pajak per income secara independen.
- [ ] Membuat fungsi `calculateProjection(state, startMonth)` untuk menghitung proyeksi kas bulanan dari bulan berjalan hingga Desember (termasuk status aktif/lunas per bulan, saldo kumulatif, warning defisit, dan warning income berakhir).
- [ ] Menulis unit test sederhana atau file skrip verifikasi untuk memastikan rumus matematika finansial bekerja 100% presisi.

### Kriteria Selesai (DoD)

- **Kebenaran Fungsional:** Perhitungan matematika proyeksi berjalan 100% benar sesuai target data model PRD, termasuk skenario income berakhir di tengah jalan.
- **Stabilitas Kode:** Tidak ada eror TypeScript compiler (`tsc`).
- **Pengujian:** Tes simulasi data manual memberikan angka saldo akhir Desember yang sama persis dengan kalkulasi teoretis.

---

## TUGAS 3: Komponen Input Form (Langkah 1 - 5)

_Membangun formulir input dinamis yang interaktif untuk Income, Tabungan, Cicilan/Utang, Pengeluaran Rutin, dan Pengeluaran Sekali Bayar._

### Sub-Tugas Checklist

- [ ] Membuat komponen `IncomeSection` (repeatable, form nama, nominal, periode, masa aktif, dan toggle/rows untuk pajak).
- [ ] Membuat komponen `SavingsSection` (input saldo saat ini dan toggle include/exclude).
- [ ] Membuat komponen `DebtSection` (repeatable, nama, nominal, periode, masa aktif bulan).
- [ ] Membuat komponen `RoutineExpensesSection` (repeatable, nama, nominal, periode).
- [ ] Membuat komponen `OneTimeExpensesSection` (repeatable, nama, nominal, pilihan bulan kejadian).
- [ ] Integrasi validasi form saat menekan tombol "Hitung Proyeksi" (hanya valid jika minimal ada 1 income dengan nominal > 0; jika tidak valid, auto-scroll ke section Income dengan inline error).

### Kriteria Selesai (DoD)

- **Kebenaran Fungsional:** Pengguna bisa menambah/menghapus item dinamis di setiap kategori.
- **Kualitas Desain & UX:** Sesuai mockup, bersih, responsif, dengan tooltip edukatif mengenai pembagian kalender uniform average. Validasi bersifat non-blocking saat pengisian dan hanya memblokir saat submit dengan indikator inline error yang jelas.
- **Stabilitas Kode:** Kontrol input (controlled components) sinkron dengan state utama.

---

## TUGAS 4: Dashboard Hasil Perhitungan (Terintegrasi ke Bawah)

_Menampilkan hasil perhitungan proyeksi langsung di bawah form input secara dinamis setelah tombol "Hitung Proyeksi" ditekan, bukan dalam tab terpisah._

### Sub-Tugas Checklist

- [ ] Membuat layout penampung hasil di bawah form yang muncul/update secara dinamis (scrolling/stacked vertically).
- [ ] Komponen `DashHero`: Menampilkan saldo akhir Desember dan info awal bulan perhitungan.
- [ ] Komponen `MetricsSummary`: Menampilkan total pendapatan bersih, total pajak/potongan, total cicilan/utang, dan rasio cicilan/pendapatan.
- [ ] Komponen `ProjectionChart`: Grafik proyeksi bulanan dari bulan berjalan s/d Desember menggunakan Recharts (menangani rendering client-side dengan aman di Next.js).
- [ ] Komponen `CompositionBreakdown`: Menampilkan pie/bar chart komposisi pengeluaran bulan berjalan.
- [ ] Komponen `StatusDetails`: Menampilkan rincian status cicilan (badge lunas) dan pemberitahuan berakhirnya income secara spesifik hanya pada area hasil hitung (tidak pada form input).
- [ ] Menambahkan banner peringatan global (`Semua_Income_Berakhir_Warning`) di bagian atas dashboard jika semua income habis sebelum Desember.

### Kriteria Selesai (DoD)

- **Kebenaran Fungsional:** Hasil kalkulasi langsung ter-render di bawah form setelah tombol ditekan, dan halaman melakukan scroll halus ke bagian dashboard.
- **Kualitas Desain & UX:** Visualisasi Recharts responsif, status lunas/berakhir tampil dengan badge warna harmonis, warning global menonjol. Badge lunas dan status berakhirnya cicilan/pendapatan _hanya_ muncul pada hasil hitung (sesuai masukan pengguna).
- **Stabilitas Kode:** Recharts ter-import dengan dinamis (`ssr: false`) untuk mencegah error hidrasi di Next.js App Router.

---

## TUGAS 5: State Persistence & LocalStorage

_Mengintegrasikan penyimpanan otomatis state formulir ke localStorage agar data pengguna tidak hilang saat reload halaman._

### Sub-Tugas Checklist

- [ ] Membuat hook `useLocalStorage` atau fungsi utility untuk menyimpan/memuat state keuangan secara otomatis.
- [ ] Menambahkan _hydration safety check_ untuk memastikan localStorage tidak menyebabkan masalah error hidrasi di server-side rendering Next.js.
- [ ] Menambahkan fungsionalitas auto-save setiap kali ada perubahan pada input form.

### Kriteria Selesai (DoD)

- **Kebenaran Fungsional:** Ketika halaman direfresh, semua data yang diinput tetap ada dan dashboard langsung menampilkan hasil proyeksi yang sesuai (jika sudah pernah dihitung).
- **Stabilitas Kode:** Penanganan fallback state aman jika localStorage kosong atau tidak didukung oleh browser.

---

## TUGAS 6: Polish UI, Audit Keamanan, & Final Verification

_Sentuhan akhir keindahan visual, optimalisasi performa, audit keamanan pihak ketiga menggunakan Snyk, dan uji kelayakan produksi._

### Sub-Tugas Checklist

- [ ] Memperhalus animasi mikro (hover effect pada kartu, transisi penampilan dashboard, dll.).
- [ ] Menjalankan audit keamanan kode pihak pertama menggunakan `snyk_code_scan` dan memperbaiki kerentanan yang terdeteksi.
- [ ] Menghapus log debug dan kode yang tidak terpakai.
- [ ] Menjalankan build produksi (`npm run build`) untuk memverifikasi kesiapan kompilasi tanpa error.

### Kriteria Selesai (DoD)

- **Kebenaran Fungsional:** Aplikasi berfungsi penuh di lingkungan build produksi.
- **Kualitas Desain & UX:** Desain terasa premium, responsif di mobile & desktop, teks informatif jelas.
- **Stabilitas Kode:** Audit keamanan Snyk bersih dari masalah tingkat tinggi (high severity vulnerabilities).
