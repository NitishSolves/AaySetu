// Initial sample data and financial utility functions for GigFinance

export const INCOME_SOURCES = [
  { id: 'swiggy', name: 'Swiggy', icon: '🍔' },
  { id: 'zomato', name: 'Zomato', icon: '🍕' },
  { id: 'uber', name: 'Uber', icon: '🚗' },
  { id: 'freelancing', name: 'Freelancing', icon: '💻' },
  { id: 'other_income', name: 'Other', icon: '💼' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'fuel', name: 'Fuel', icon: '⛽' },
  { id: 'food', name: 'Food', icon: '🍛' },
  { id: 'maintenance', name: 'Vehicle Maintenance', icon: '🔧' },
  { id: 'mobile', name: 'Mobile/Internet', icon: '📱' },
  { id: 'other_expense', name: 'Other', icon: '🛒' },
];

export const initialTransactions = [
  {
    id: 'tx-1',
    type: 'income',
    title: 'Swiggy',
    category: 'Swiggy',
    amount: 4000,
    date: '15 Sep 2026',
    icon: '🍔',
    timestamp: 1789459200000,
  },
  {
    id: 'tx-2',
    type: 'expense',
    title: 'Fuel',
    category: 'Fuel',
    amount: 1200,
    date: '15 Sep 2026',
    icon: '⛽',
    timestamp: 1789455600000,
  },
  {
    id: 'tx-3',
    type: 'income',
    title: 'Uber',
    category: 'Uber',
    amount: 3000,
    date: '14 Sep 2026',
    icon: '🚗',
    timestamp: 1789372800000,
  },
  {
    id: 'tx-4',
    type: 'expense',
    title: 'Food',
    category: 'Food',
    amount: 500,
    date: '14 Sep 2026',
    icon: '🍛',
    timestamp: 1789369200000,
  },
  {
    id: 'tx-5',
    type: 'expense',
    title: 'Mobile/Internet',
    category: 'Mobile/Internet',
    amount: 300,
    date: '13 Sep 2026',
    icon: '📱',
    timestamp: 1789282800000,
  },
  {
    id: 'tx-6',
    type: 'income',
    title: 'Freelancing',
    category: 'Freelancing',
    amount: 1500,
    date: '12 Sep 2026',
    icon: '💻',
    timestamp: 1789196400000,
  },
  {
    id: 'tx-7',
    type: 'expense',
    title: 'Vehicle Maintenance',
    category: 'Vehicle Maintenance',
    amount: 300,
    date: '11 Sep 2026',
    icon: '🔧',
    timestamp: 1789110000000,
  },
];

// Format number into Indian Rupee format: e.g. ₹8,500
export const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return '₹' + num.toLocaleString('en-IN');
};

// Calculate Total Earnings, Total Expenses, and Net Income
export const calculateTotals = (transactions) => {
  let totalEarnings = 0;
  let totalExpenses = 0;

  transactions.forEach((tx) => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      totalEarnings += amt;
    } else if (tx.type === 'expense') {
      totalExpenses += amt;
    }
  });

  const netIncome = totalEarnings - totalExpenses;
  return { totalEarnings, totalExpenses, netIncome };
};

// Group expenses by category and calculate % share
export const getExpenseBreakdown = (transactions) => {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const total = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const groups = {};
  expenses.forEach((t) => {
    const cat = t.category || 'Other';
    if (!groups[cat]) {
      groups[cat] = {
        name: cat,
        amount: 0,
        icon: t.icon || '💸',
      };
    }
    groups[cat].amount += Number(t.amount) || 0;
  });

  return Object.values(groups)
    .map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

// Group income by source and calculate % share
export const getIncomeBreakdown = (transactions) => {
  const incomes = transactions.filter((t) => t.type === 'income');
  const total = incomes.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const groups = {};
  incomes.forEach((t) => {
    const src = t.category || t.title || 'Other';
    if (!groups[src]) {
      groups[src] = {
        name: src,
        amount: 0,
        icon: t.icon || '💰',
      };
    }
    groups[src].amount += Number(t.amount) || 0;
  });

  return Object.values(groups)
    .map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

// Helper to get formatted date string for today (e.g., "15 Sep 2026")
export const getTodayFormattedDate = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
};
