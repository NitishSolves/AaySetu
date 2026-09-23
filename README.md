# ArthSetu

**ArthSetu** is an income-adaptive micro-investment and savings platform built specifically for gig economy workers (food delivery partners, ride-hailing drivers, technical freelancers, and home service pros).

Unlike traditional fixed monthly SIP applications, ArthSetu is built around irregular daily shift income. It strictly enforces the core financial rule: **Essential expenses are deducted first from gross income**, and all further allocations (Emergency Savings, Goal Savings, Micro-Investment, Flexible Cash Buffer) are calculated deterministically on disposable remaining money.

---

## 🌟 Core Product Architecture

```text
TODAY'S INCOME
      ↓
ESSENTIAL EXPENSES (Rent, Fuel, Food on shift, EMI, Data)
      ↓
REMAINING DISPOSABLE MONEY
      ↓
CANONICAL FINANCIAL ENGINE (Analyzes Volatility & Reserve Status)
      ↓
SAFE-TO-ALLOCATE SURPLUS
      ├── 🛡️ Emergency Savings
      ├── 🎯 Goal Savings
      ├── 📈 Adaptive Micro-Investment
      └── 💵 Flexible Cash Buffer
      ↓
GROUNDED AI EXPLANATION
```

---

## ⚡ Key Features

1. **📊 5-Section Dashboard**:
   - **Section 1 (Today's Journey)**: Visual waterfall from Gross Income → Essential Expenses → Remaining Cash → Safe-to-Allocate.
   - **Section 2 (Your Money Today)**: Smart allocation split.
   - **Section 3 (Financial Pulse)**: Volatility, Runway, Expense Burden, Micro-Invested totals.
   - **Section 4 (Grounded AI Explanation)**: Concise explanation based strictly on exact calculated numbers.
   - **Section 5 (Financial Decision History)**: Audited log explaining why recommendations adjusted.

2. **📈 Micro-Investment Suite (`/invest`)**:
   - **Investable Today**: Displays safe daily investment capacity.
   - **Adaptive Modes**: Adaptive Mode (scales with income & volatility), Fixed Daily Mode, Percentage of Surplus Mode.
   - **Safety Guardrail**: Automatically sets micro-investment to ₹0 if emergency buffer is critically low or income volatility is high.
   - **"Why Did My Investment Change Today?"**: Comparison of yesterday vs today's financial allocation factors.

3. **⚡ Real-Time What-If Financial Simulator (`/simulate`)**:
   - Test preset financial scenarios (Income Shock ₹500, High-Earning Day ₹2,200, Bike Repair Shock ₹6,000) with side-by-side Current vs Simulated metrics using the exact same financial engine.

4. **💼 Interactive Ledger & CSV Export (`/finances`)**:
   - Categorize essential vs non-essential expenses with live Expense Impact feedback.
   - One-click CSV export for bank loan proof or tax filing.

5. **🤖 Grounded AI Copilot (`/copilot`)**:
   - Interactive assistant powered strictly by canonical financial engine state.

---

## 🚀 Running the Web Application

The active web application runs on port **3000**:

```bash
python3 -m http.server 3000 --directory web
```

Access in your browser at: **`http://localhost:3000`**

---

## 🧪 Automated Testing Suite

Run the Python verification test suite to validate all financial engine calculations, safety guardrails, and allocation rules:

```bash
python3 tests/test_engine.py
```

---

## 📄 License & Attribution

Built for Indian Gig Economy Workers | Entrepreneurship Development Project
