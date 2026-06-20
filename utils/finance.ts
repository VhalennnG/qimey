import { FinancialState, Income, ItemBerkala, MonthlyProjection, Periode } from "../types/finance";

// Month abbreviations in Indonesian
export const INDONESIAN_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

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
 * Generates the monthly financial projections from the current month until December.
 * Dibuat berdasarkan PRD seksyen 8.3 sampai 8.8.
 */
export function calculateProjection(
  state: FinancialState,
  startMonthIndex: number, // 0-11
  currentYear: number
): MonthlyProjection[] {
  const projections: MonthlyProjection[] = [];
  const totalMonths = 12 - startMonthIndex;
  
  let previousSaldo = state.tabungan.include ? state.tabungan.saldoSaatIni : 0;
  
  for (let m = 0; m < totalMonths; m++) {
    const calendarMonthIndex = startMonthIndex + m;
    const bulanNama = INDONESIAN_MONTHS[calendarMonthIndex];
    
    // 1. Pendapatan (PRD 8.3 & 8.4)
    let totalPendapatanKotor = 0;
    let totalPajakPotongan = 0;
    const berakhirIncomeIds: string[] = [];
    
    state.incomes.forEach((income) => {
      // isActive(income, m)
      const isActive = income.masaBulan === null || m < income.masaBulan;
      if (isActive) {
        const kotor = toMonthly(income.nominal, income.periode);
        const pajak = calculateTaxForIncome(income);
        totalPendapatanKotor += kotor;
        totalPajakPotongan += pajak;
      }
      
      // Check if it ends in this specific month (last active month is m === masaBulan - 1)
      if (income.masaBulan !== null && m === income.masaBulan - 1) {
        berakhirIncomeIds.push(income.id);
      }
    });
    
    const pendapatanBersih = totalPendapatanKotor - totalPajakPotongan;
    
    // 2. Cicilan & Utang (PRD 8.3 & 8.4)
    let totalCicilanUtang = 0;
    const lunasCicilanIds: string[] = [];
    
    state.cicilanUtang.forEach((debt) => {
      // isActive(debt, m)
      const isActive = m < debt.masaBulan;
      if (isActive) {
        totalCicilanUtang += toMonthly(debt.nominal, debt.periode);
      }
      
      // Check if it is paid off in this month (last active month is m === masaBulan - 1)
      if (m === debt.masaBulan - 1) {
        lunasCicilanIds.push(debt.id);
      }
    });
    
    // 3. Pengeluaran Rutin (selalu aktif)
    let totalRoutine = 0;
    state.pengeluaranRutin.forEach((routine) => {
      totalRoutine += toMonthly(routine.nominal, routine.periode);
    });
    
    // 4. Pengeluaran Sekali Bayar (aktif jika bulanKejadian === calendarMonthIndex)
    let totalOneTime = 0;
    state.pengeluaranSekaliBayar.forEach((expense) => {
      if (expense.bulanKejadian === calendarMonthIndex) {
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
      tahun: currentYear,
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
