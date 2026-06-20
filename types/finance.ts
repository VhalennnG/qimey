export type Periode = "harian" | "mingguan" | "bulanan" | "tahunan";
export type JenisPotongan = "persen" | "nominal";

export interface Pajak {
  id: string;
  nama: string;
  jenis: JenisPotongan;
  nilai: number; // Persen (0-100) atau nominal
}

export interface Income {
  id: string;
  nama: string;
  nominal: number;
  periode: Periode;
  masaBulan: number | null; // null = tanpa batas
  pajak: Pajak[];
}

export interface Tabungan {
  saldoSaatIni: number;
  include: boolean;
}

export interface ItemBerkala {
  // Untuk Cicilan & Utang
  id: string;
  nama: string;
  nominal: number;
  periode: Periode;
  masaBulan: number; // Tenor dalam bulan (wajib)
}

export interface PengeluaranRutin {
  id: string;
  title: string;
  nominal: number;
  periode: "harian" | "mingguan" | "bulanan"; // Tanpa tahunan
}

export interface PengeluaranSekaliBayar {
  id: string;
  title: string;
  nominal: number;
  bulanKejadian: number; // 0-11 (Januari - Desember)
}

export interface FinancialState {
  incomes: Income[];
  tabungan: Tabungan;
  cicilanUtang: ItemBerkala[];
  pengeluaranRutin: PengeluaranRutin[];
  pengeluaranSekaliBayar: PengeluaranSekaliBayar[];
}

export interface MonthlyProjection {
  bulanIndex: number; // 0-11
  bulanNama: string; // Contoh: "Jun"
  tahun: number; // Contoh: 2026
  pendapatanKotor: number;
  pajakPotongan: number;
  pendapatanBersih: number;
  cicilanUtang: number;
  pengeluaranRutin: number;
  pengeluaranSekaliBayar: number;
  cashflow: number;
  saldo: number;
  defisitWarning: boolean;
  lunasCicilanIds: string[]; // ID cicilan yang lunas di bulan ini (masaBulan habis)
  berakhirIncomeIds: string[]; // ID income yang berakhir di bulan ini (masaBulan habis)
}
