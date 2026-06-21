export type Language = "id" | "en";

export const translations = {
  id: {
    appName: "Qimey",
    title: "Simulasi masa depan finansialmu",
    subtitle:
      "Ketahui sisa saldo tabungan kumulatif Anda dari bulan berjalan sampai Desember secara transparan dan aman di browser lokal Anda.",

    // Form Sections
    incomeTitle: "Pendapatan",
    incomeSub: "Tambahkan satu atau lebih sumber pemasukan bulanan Anda.",
    incomeLabel: "Sumber Pendapatan",
    incomeNameLabel: "Nama Pendapatan",
    period: "Periode",
    duration: "Masa Aktif",
    amount: "Nominal",
    unlimited: "Tanpa Batas",
    months: "Bulan",
    startFrom: "Mulai Dari",
    until: "Sampai Dengan",
    selectMonthYear: "Pilih Bulan & Tahun",
    noLimit: "Tanpa Batas",
    daily: "Harian",
    weekly: "Mingguan",
    monthly: "Bulanan",
    yearly: "Tahunan",

    // Taxes
    taxToggle: "Potongan Pajak & Pengurangan",
    taxCount: "potongan pajak ditambahkan",
    taxNone: "Belum ada potongan pajak untuk pendapatan ini.",
    addTax: "Tambah Potongan",
    taxName: "Nama Potongan",
    taxType: "Jenis",
    taxValue: "Nilai",
    taxPercent: "Persen %",
    taxNominal: "Nominal",
    addIncome: "Tambah Sumber Pendapatan",

    // Savings
    savingsTitle: "Tabungan Saat Ini",
    savingsSub: "Proyeksikan sisa saldo Anda dengan atau tanpa tabungan awal.",
    savingsToggle: "Sertakan saldo tabungan dalam proyeksi",
    savingsToggleSub: "Saldo awal akan ditambahkan ke proyeksi bulan ini",
    savingsAmount: "Saldo Saat Ini",
    savingsBadge: "Disertakan",

    // Debt
    debtTitle: "Cicilan & Utang",
    debtSub:
      "Kewajiban rutin bulanan dengan tenor tertentu (akan lunas setelah masa tenor berakhir).",
    debtName: "Nama Cicilan / Keterangan",
    debtDuration: "Tenor (Bulan)",
    addDebt: "Tambah Cicilan / Utang",

    // Routine
    routineTitle: "Pengeluaran Rutin",
    routineSub:
      "Pengeluaran rutin berkelanjutan tanpa masa berakhir (misal: kos, internet, makan).",
    routineName: "Nama Pengeluaran",
    addRoutine: "Tambah Pengeluaran Rutin",

    // One Time
    oneTimeTitle: "Pengeluaran Sekali Bayar",
    oneTimeSub:
      "Pengeluaran non-rutin yang terjadi sekali di bulan tertentu (misal: servis AC, pajak motor, beli kado).",
    oneTimeName: "Nama Pengeluaran",
    oneTimeMonth: "Bulan Kejadian",
    addOneTime: "Tambah Pengeluaran Sekali Bayar",

    // Global actions
    saveAuto: "Semua data Anda tersimpan secara otomatis di browser",
    calculateBtn: "Hitung Proyeksi Arus Kas ↗",
    updateBtn: "Perbarui Proyeksi Arus Kas ↗",
    upToDateBtn: "Proyeksi Sudah Terkini ✓",
    resetBtn: "Reset Data",

    // Dashboard Results
    dashHeader: "Dashboard Hasil Proyeksi",
    dashSub: "Analisis arus kas kumulatif Anda hingga akhir tahun berjalan.",
    alertHeader: "Peringatan Kontrak Kerja / Pendapatan Habis",
    alertDetail:
      "Seluruh pendapatan Anda berakhir pada {lastActiveMonth}. Proyeksi bulan {nextMonth} hingga akhir periode dihitung tanpa pemasukan sama sekali.",
    projDec: "Proyeksi Saldo Akhir Desember",
    calculatedFrom: "Proyeksi dihitung penuh mulai dari awal",
    totalNetIncome: "Total Pendapatan Bersih",
    totalTaxes: "Total Pajak & Potongan",
    totalDebts: "Total Cicilan & Utang",
    debtToIncomeRatio: "Rasio Cicilan / Pendapatan",
    chartTitle: "Proyeksi Saldo Bulanan",
    chartAssumption: "diasumsikan 30 hari/bulan, 4.33 minggu/bulan",
    positiveBalance: "Saldo Positif",
    deficit: "Defisit",
    paidOff: "Lunas Cicilan",
    compositionTitle: "Komposisi Pengeluaran & Sisa — Bulan Akhir",
    compTax: "Pajak & Potongan",
    compDebt: "Cicilan & Utang",
    compRoutine: "Pengeluaran Rutin",
    compOneTime: "Sekali Bayar",
    compSavings: "Sisa (Tabungan)",
    detailStatusTitle: "Detail Status Kontrak & Tenor",
    paidOffIn: "lunas pada",
    endsIn: "berakhir pada",
    paidOffBadge: "lunas",
    endedBadge: "berakhir",
    errorIncomeNominal:
      "Nominal pendapatan wajib diisi dan harus lebih besar dari 0.",
    errorGlobalIncome: "Harus ada minimal 1 sumber pendapatan.",
    tooltipAssumption: "Diasumsikan 30 hari/bulan dan 4,33 minggu/bulan.",
    changeTax: "Ubah",
    addTaxShort: "+ Tambah",
    optional: "opsional",
    loading: "Memuat kalkulator Qimey...",
    subTitleProj: "Proyeksi Keuangan Mandiri",
    cashflowTitle: "Arus Kas Bulanan",
    grossIncome: "Pendapatan Bersih",

    // Projection Range
    projectionRange: "Rentang Proyeksi",
    projectionRangeSub: "Pilih sampai bulan dan tahun berapa proyeksi Anda",
    endMonth: "Bulan Akhir",
    endYear: "Tahun Akhir",

    // Report Table
    reportTitle: "Laporan Simulasi Keuangan",
    reportSub: "Rincian arus kas bulanan dalam bentuk tabel",
    colMonth: "Bulan",
    colIncome: "Pendapatan",
    colTax: "Pajak",
    colDebt: "Cicilan",
    colRoutine: "Rutin",
    colOneTime: "Sekali Bayar",
    colCashflow: "Arus Kas",
    colBalance: "Saldo",
    colNotes: "Keterangan",
    notesPaidOff: "Lunas",
    notesEnded: "Berakhir",
    notesDeficit: "Defisit",
  },
  en: {
    appName: "Qimey",
    title: "Simulate your financial future",
    subtitle:
      "Know your cumulative savings balance from the current month until December transparently and securely in your local browser.",

    // Form Sections
    incomeTitle: "Income",
    incomeSub: "Add one or more monthly income sources.",
    incomeLabel: "Income Source",
    incomeNameLabel: "Income Name",
    period: "Period",
    duration: "Duration",
    amount: "Amount",
    unlimited: "Unlimited",
    months: "Months",
    startFrom: "Start From",
    until: "Until",
    selectMonthYear: "Select Month & Year",
    noLimit: "No Limit",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",

    // Taxes
    taxToggle: "Tax Deductions & Reductions",
    taxCount: "tax deductions added",
    taxNone: "No tax deductions for this income.",
    addTax: "Add Deduction",
    taxName: "Deduction Name",
    taxType: "Type",
    taxValue: "Value",
    taxPercent: "Percent %",
    taxNominal: "Amount",
    addIncome: "Add Income Source",

    // Savings
    savingsTitle: "Current Savings",
    savingsSub: "Project your balance with or without starting savings.",
    savingsToggle: "Include savings balance in projection",
    savingsToggleSub:
      "Starting balance will be added to this month's projection",
    savingsAmount: "Current Balance",
    savingsBadge: "Included",

    // Debt
    debtTitle: "Installments & Debts",
    debtSub:
      "Regular monthly obligations with a specific duration (will be paid off when the duration ends).",
    debtName: "Installment Name / Description",
    debtDuration: "Duration (Months)",
    addDebt: "Add Installment / Debt",

    // Routine
    routineTitle: "Routine Expenses",
    routineSub:
      "Ongoing routine expenses without an end date (e.g. rent, internet, food).",
    routineName: "Expense Name",
    addRoutine: "Add Routine Expense",

    // One Time
    oneTimeTitle: "One-Time Expenses",
    oneTimeSub:
      "One-time expenses occurring in a specific month (e.g. AC service, vehicle tax, gifts).",
    oneTimeName: "Expense Name",
    oneTimeMonth: "Occurred Month",
    addOneTime: "Add One-Time Expense",

    // Global actions
    saveAuto: "All your data is saved automatically in your browser",
    calculateBtn: "Calculate Cash Flow Projection ↗",
    updateBtn: "Update Cash Flow Projection ↗",
    upToDateBtn: "Projection Up to Date ✓",
    resetBtn: "Reset Data",

    // Dashboard Results
    dashHeader: "Projection Results Dashboard",
    dashSub:
      "Analysis of your cumulative cash flow until the end of the current year.",
    alertHeader: "Income / Contract Expiry Alert",
    alertDetail:
      "All your income ends in {lastActiveMonth}. Projections for {nextMonth} through end of projection period are calculated with zero income.",
    projDec: "Projected Balance End of December",
    calculatedFrom:
      "Projections calculated in full starting from the beginning of",
    totalNetIncome: "Total Net Income",
    totalTaxes: "Total Taxes & Deductions",
    totalDebts: "Total Debt & Installments",
    debtToIncomeRatio: "Debt to Income Ratio",
    chartTitle: "Monthly Balance Projection",
    chartAssumption: "assumed 30 days/month, 4.33 weeks/month",
    positiveBalance: "Positive Balance",
    deficit: "Deficit",
    paidOff: "Paid Off",
    compositionTitle: "Expenses & Savings Composition — End Month",
    compTax: "Taxes & Deductions",
    compDebt: "Debt & Installments",
    compRoutine: "Routine Expenses",
    compOneTime: "One-Time Expense",
    compSavings: "Savings (Remaining)",
    detailStatusTitle: "Contract & Tenor Status Details",
    paidOffIn: "paid off in",
    endsIn: "ends in",
    paidOffBadge: "paid off",
    endedBadge: "ends",
    errorIncomeNominal: "Income amount is required and must be greater than 0.",
    errorGlobalIncome: "Must have at least 1 income source.",
    tooltipAssumption: "Assumed 30 days/month and 4.33 weeks/month.",
    changeTax: "Change",
    addTaxShort: "+ Add",
    optional: "optional",
    loading: "Loading Qimey calculator...",
    subTitleProj: "Self-guided Financial Projection",
    cashflowTitle: "Monthly Cash Flow",
    grossIncome: "Net Income",

    // Projection Range
    projectionRange: "Projection Range",
    projectionRangeSub: "Set the end month and year for your projections",
    endMonth: "End Month",
    endYear: "End Year",

    // Report Table
    reportTitle: "Financial Simulation Report",
    reportSub: "Monthly cash flow breakdown in table format",
    colMonth: "Month",
    colIncome: "Income",
    colTax: "Tax",
    colDebt: "Debt",
    colRoutine: "Routine",
    colOneTime: "One-Time",
    colCashflow: "Cash Flow",
    colBalance: "Balance",
    colNotes: "Notes",
    notesPaidOff: "Paid Off",
    notesEnded: "Ended",
    notesDeficit: "Deficit",
  },
};

export const ENGLISH_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const INDONESIAN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
