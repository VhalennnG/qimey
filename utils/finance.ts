import { FinancialState, Income, ItemBerkala, MonthlyProjection, Periode, BulanTahun } from "../types/finance";

// Month abbreviations in Indonesian
export const INDONESIAN_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

/** Convert a BulanTahun to an absolute month index for comparison */
function toAbsoluteMonth(bt: BulanTahun): number {
  return bt.tahun * 12 + bt.bulan;
}

/**
 * Converts any periodic nominal amount into its monthly equivalent
 * as specified in PRD section 8.1.
 */
export function toMonthly(nominal: number, periode: Periode): number {
  switch (periode) {
    case "harian":
      return nominal * 30;
    case "mingguan":
      return nominal * 4.33; // Uniform average (52 weeks / 12 months)
    case "bulanan":
      return nominal;
    case "tahunan":
      return nominal / 12;
    default:
      return nominal;
  }
}

/**
 * Calculates total monthly tax deductions for a specific income item
 * as specified in PRD section 8.2.
 */
export function calculateTaxForIncome(income: Income): number {
  let totalTax = 0;
  const incomeMonthlyKotor = toMonthly(income.nominal, income.periode);
  
  for (const tax of income.pajak) {
    if (tax.jenis === "persen") {
      totalTax += incomeMonthlyKotor * (tax.nilai / 100);
    } else {
      totalTax += tax.nilai; // Fixed nominal deduction is already assumed monthly or as-is
    }
  }
  
  return totalTax;
}

/**
 * Helper to extract bulan and tahun from a PengeluaranSekaliBayar.bulanKejadian,
 * supporting both legacy (number) and new ({ bulan, tahun }) formats.
 */
function parseBulanKejadian(
  bulanKejadian: number | { bulan: number; tahun: number },
  fallbackYear: number
): { bulan: number; tahun: number } {
  if (typeof bulanKejadian === "number") {
    return { bulan: bulanKejadian, tahun: fallbackYear };
  }
  return bulanKejadian;
}

/**
 * Generates the monthly financial projections from the start month/year
 * to the specified end month/year (inclusive).
 */
export function calculateProjection(
  state: FinancialState,
  startMonthIndex: number, // 0-11
  startYear: number,
  endMonthIndex: number = 11, // 0-11, default December
  endYear: number = startYear // default same year
): MonthlyProjection[] {
  const projections: MonthlyProjection[] = [];
  
  // Calculate total months in the projection range
  const totalMonths = (endYear - startYear) * 12 + (endMonthIndex - startMonthIndex) + 1;
  
  let previousSaldo = state.tabungan.include ? state.tabungan.saldoSaatIni : 0;
  
  for (let m = 0; m < totalMonths; m++) {
    const calendarMonthIndex = (startMonthIndex + m) % 12;
    const calendarYear = startYear + Math.floor((startMonthIndex + m) / 12);
    const bulanNama = INDONESIAN_MONTHS[calendarMonthIndex];
    const currentAbsMonth = calendarYear * 12 + calendarMonthIndex;
    
    // 1. Pendapatan (PRD 8.3 & 8.4)
    let totalPendapatanKotor = 0;
    let totalPajakPotongan = 0;
    const berakhirIncomeIds: string[] = [];
    
    state.incomes.forEach((income) => {
      const startAbs = toAbsoluteMonth(income.mulaiBulan);
      const endAbs = income.selesaiBulan ? toAbsoluteMonth(income.selesaiBulan) : Infinity;
      const isActive = currentAbsMonth >= startAbs && currentAbsMonth <= endAbs;
      
      if (isActive) {
        const kotor = toMonthly(income.nominal, income.periode);
        const pajak = calculateTaxForIncome(income);
        totalPendapatanKotor += kotor;
        totalPajakPotongan += pajak;
      }
      
      // Check if it ends in this specific month
      if (income.selesaiBulan && currentAbsMonth === endAbs) {
        berakhirIncomeIds.push(income.id);
      }
    });
    
    const pendapatanBersih = totalPendapatanKotor - totalPajakPotongan;
    
    // 2. Cicilan & Utang (PRD 8.3 & 8.4)
    let totalCicilanUtang = 0;
    const lunasCicilanIds: string[] = [];
    
    state.cicilanUtang.forEach((debt) => {
      const startAbs = toAbsoluteMonth(debt.mulaiBulan);
      const endAbs = toAbsoluteMonth(debt.selesaiBulan);
      const isActive = currentAbsMonth >= startAbs && currentAbsMonth <= endAbs;
      
      if (isActive) {
        totalCicilanUtang += toMonthly(debt.nominal, debt.periode);
      }
      
      // Check if it is paid off in this month
      if (currentAbsMonth === endAbs) {
        lunasCicilanIds.push(debt.id);
      }
    });
    
    // 3. Pengeluaran Rutin (selalu aktif)
    let totalRoutine = 0;
    state.pengeluaranRutin.forEach((routine) => {
      totalRoutine += toMonthly(routine.nominal, routine.periode);
    });
    
    // 4. Pengeluaran Sekali Bayar (aktif jika bulan & tahun cocok)
    let totalOneTime = 0;
    state.pengeluaranSekaliBayar.forEach((expense) => {
      const parsed = parseBulanKejadian(expense.bulanKejadian, startYear);
      if (parsed.bulan === calendarMonthIndex && parsed.tahun === calendarYear) {
        totalOneTime += expense.nominal;
      }
    });
    
    // 5. Cashflow (PRD 8.5)
    const cashflow = pendapatanBersih - totalCicilanUtang - totalRoutine - totalOneTime;
    
    // 6. Saldo Kumulatif (PRD 8.6)
    const saldo = previousSaldo + cashflow;
    previousSaldo = saldo;
    
    // 7. Warning Defisit (PRD 8.7)
    const defisitWarning = saldo < 0;
    
    projections.push({
      bulanIndex: calendarMonthIndex,
      bulanNama,
      tahun: calendarYear,
      pendapatanKotor: totalPendapatanKotor,
      pajakPotongan: totalPajakPotongan,
      pendapatanBersih,
      cicilanUtang: totalCicilanUtang,
      pengeluaranRutin: totalRoutine,
      pengeluaranSekaliBayar: totalOneTime,
      cashflow,
      saldo,
      defisitWarning,
      lunasCicilanIds,
      berakhirIncomeIds
    });
  }
  
  return projections;
}
