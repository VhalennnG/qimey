# Qimey - Financial Calculator

[![Next.js Version](https://img.shields.io/badge/Next.js-14.2.16-blue?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](License.md)

Qimey is a personal financial planning and cashflow projection web application built with Next.js (App Router), TypeScript, and Tailwind CSS. It is designed to help individuals—such as contract employees, freelancers, or salaried workers—simulate their future financial health by calculating and visualizing cumulative cashflow projections over a customizable planning period.

Many people struggle to estimate their remaining funds at the end of the year due to the complexity of calculating combinations of income with limited active periods, tax deductions per income item, debts with different tenors, and routine and incidental expenses. Qimey was created to solve this problem by visualizing all of this financial data in a single interactive dashboard without requiring account registration.

---

## ✨ Key Features

- **Flexible Planning Periods**: Set a custom planning range spanning multiple months or years. The projection automatically adjusts, showing year-boundary separators in tables and formatting chart axis labels.
- **Dynamic Cashflow & Balance Projections**: Automatically calculates and charts your cumulative balance from the current month through your selected end date using Recharts.
- **Independent Taxes per Income**: Add tax or fee deductions (as a percentage or fixed amount) directly bound to each specific income source.
- **Tenor-Based Debt & Loan Simulation**: Track credit cards, loans, and installments with a start month and end month. The engine simulates these obligations and flags their payoff status automatically.
- **Multi-Currency Support**: Input any currency symbol (predefined list includes `Rp`, `$`, `€`, `S$`, `£`, `¥`, `₩`, etc.) or use a custom one. Numbers format automatically as you type with the appropriate local decimal and thousands separators.
- **Advanced Export Formats**: Export your planning reports to:
  - **Excel (.xlsx)** spreadsheets.
  - **CSV (.csv)** files.
  - **PDF (.pdf)** landscape reports featuring formatted auto-tables.
- **Bilingual Interface**: Seamless translation switching between Indonesian (🇮🇩) and English (🇬🇧) via a custom gooey toggle switch.
- **State Persistence & Safekeeping**: Form entries are saved in the browser's `localStorage` automatically (safeguarded against SSR hydration mismatches).
- **Edit & Recalculate Workflows**: Implements a "dirty state" check, prompting you to recalculate only when you choose. This avoids jarring screen jumps while editing entries.
- **Deficit & Expiry Warnings**:
  - Highlights deficit months in red in the report and chart.
  - Displays a global alert banner if all income sources end before the planning period concludes.

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

1. **Set Currency & Range**: Select your preferred currency and choose the custom planning start and end months/years in the **Planning Period** section.
2. **Input Income**: Add your income source(s). Click "+ Add" under the tax section on the card to apply specific percentage or nominal deductions.
3. **Current Savings**: Input your current savings balance and toggle whether to use it as the starting balance for your projection.
4. **Debts & Expenses**:
   - Add **Installments & Debts** and select their starting and ending month/year.
   - Enter **Routine Expenses** (daily, weekly, or monthly).
   - Enter **One-Time Expenses** and select the month they will occur.
5. **Calculate Cashflow**: Click **"Calculate Cash Flow ↗"**. The page will smoothly scroll to the dashboard.
6. **Analyze and Export**:
   - Filter the chart zoom (3 Months, 6 Months, 1 Year, or All).
   - Review payoff details and warnings.
   - Open the **Export** dropdown on the table to download the report as PDF, Excel, or CSV.

---

## 🛠️ Configuration & Calculation Assumptions

### Environment Configuration

This project is completely client-side. No environment variables (`.env`) or databases are required. Your state is serialized to JSON and persisted locally under the key `fyvian_financial_state`.

### Financial Formula Assumptions (`toMonthly`)

The mathematical engine in `utils/finance.ts` uses the following rules:

- **Uniform Average Calendar**: Period conversions use uniform averages for calendar consistency:
  - Daily: `Nominal x 30`
  - Weekly: `Nominal x 4.33` (52 weeks ÷ 12 months)
  - Monthly: `Nominal x 1`
  - Yearly: `Nominal ÷ 12`
- **Full Current Month**: The current month is calculated as a full month (no daily pro-rating) to keep predictions straightforward.

---

## 📄 License

This project is licensed under the **MIT License**. See the [License.md](License.md) file for more details.
