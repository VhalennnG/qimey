# Qimey - Financial Calculator

[![Next.js Version](https://img.shields.io/badge/Next.js-14.2.16-blue?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](License.md)

Qimey is a Next.js and Tailwind CSS-based personal financial calculator web application designed to provide a transparent and comprehensive monthly cashflow projection from the current month until December of the current year.

Many people struggle to estimate their remaining funds at the end of the year due to the complexity of calculating combinations of income with limited active periods, tax deductions per income item, debts with different tenors, and routine and incidental expenses. Qimey was created to solve this problem by visualizing all of this financial data in a single interactive dashboard without requiring account registration.

---

## ✨ Key Features

- **Dynamic Monthly Cashflow Projection**: Automatically calculates and projects your financial balance cumulatively from the beginning of the current month to December.
- **Multi-Income Management**: Supports adding multiple income sources (salary, side jobs, etc.) dynamically with independent periods (daily, weekly, monthly, yearly) and active durations.
- **Independent Taxes & Deductions**: Configure tax deductions (percentage or fixed nominal) that are directly bound to and calculated separately for each income item.
- **Tenor-Based Debt & Loan Simulation**: Input debts/loans with nominal amounts and active tenors (start month to end month) which are calculated precisely and automatically paid off in the dashboard according to the schedule.
- **Routine & Incidental Expense Tracking**: Flexibly enter your routine expenses (daily, weekly, or monthly) and planned one-time (incidental) expenses for specific months.
- **Interactive Analysis Dashboard & Charts**:
  - **Metrics Summary**: Total net income, total tax, total debt, and the debt-to-net-income ratio for the current month.
  - **Projection Chart**: Interactive bar chart using Recharts visualizing monthly balance fluctuations.
  - **Composition Breakdown**: Stacked bar chart to see the breakdown of current month's expenses.
  - **Payoff Status**: Detailed info and badges indicating when a debt is paid off or when an income source ends.
- **Early Warning System**:
  - Red warning banner on months with a projected negative balance (deficit).
  - Global warning banner if all of your income sources are projected to end before December.
- **Local Security & Privacy**: No login or external database. All sensitive financial data is securely stored in your browser via `localStorage` with safe Next.js hydration handling.

---

## ⚙️ Prerequisites & Installation

### Prerequisites

Before starting, make sure your device has the following installed:
- **Node.js** (version 18.x or newer)
- **npm** or **yarn**

### Installation Steps

1. **Clone this project repository:**

   ```bash
   git clone https://github.com/vhalen/imey.git
   cd qimey
   ```

2. **Install the required dependencies:**

   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and access the page at [http://localhost:3000](http://localhost:3000).

---

## 🚀 How to Use

1. **Input Income**: Enter at least one income source with a nominal value > 0. Click the "Ada potongan pajak?" (Is there a tax deduction?) button on the income card to configure specific deductions for that income.
2. **Current Savings**: Enter your current savings balance and choose whether to include or exclude it in the projected balance accumulation.
3. **Debt & Loans**: Add ongoing debts or loans, enter the nominal value, and select the tenor's end month for automatic payoff simulation.
4. **Routine Expenses**: Add your daily, weekly, or monthly routine expenses.
5. **One-Time Expenses**: Add planned major incidental expenses and select the specific month of occurrence.
6. **Calculate Projection**: Click the **"Hitung Proyeksi"** (Calculate Projection) button at the bottom of the form. The page will automatically scroll down to the interactive analysis dashboard showing your financial summary.

---

## 🛠️ Configuration & Calculation Assumptions

### Environment Configuration

This project runs entirely on the client side. No special environment variables (`.env`) or external databases are required to run it. Your data is stored in the browser using the key `fyvian_financial_state`.

### Financial Formula Assumptions (`toMonthly`)

To keep calculations easy to understand and consistent, the projection applies the following financial math assumptions:
- **Uniform Average Calendar**: Non-monthly period conversions use a uniform average:
  - Daily: `Nominal x 30`
  - Weekly: `Nominal x 4.33` (52 weeks ÷ 12 months)
  - Monthly: `Nominal x 1`
  - Yearly: `Nominal ÷ 12`
- **Full Current Month**: The current month in which the application is opened is calculated as a full month without pro-rating the remaining days.

---

## 📄 License

This project is licensed under the **MIT License**. See the [License.md](License.md) file for more details.
