/**
 * ArthSetu — Core Data Layer, Storage Engine & User Isolation
 */

export const OCCUPATIONS = [
  {
    id: 'delivery',
    title: 'Food & Grocery Delivery Partner',
    shortTitle: 'Delivery Partner',
    icon: '🛵',
    description: 'Swiggy, Zomato, Zepto, Blinkit, BigBasket',
    color: '#FC8019',
    badgeBg: 'rgba(252, 128, 25, 0.12)',
    platforms: ['Swiggy', 'Zomato', 'Zepto', 'Blinkit'],
    popularExpenses: ['Fuel & Petrol', 'Bike Maintenance', 'Mobile Data', 'Food on Shift'],
  },
  {
    id: 'freelancer',
    title: 'Freelancer / Digital Specialist',
    shortTitle: 'Freelancer',
    icon: '💻',
    description: 'Tech, Web Dev, Design, Video Editing, Content',
    color: '#8B5CF6',
    badgeBg: 'rgba(139, 92, 246, 0.12)',
    platforms: ['Tech Clients', 'Upwork', 'Fiverr', 'Direct Contracts'],
    popularExpenses: ['Mobile Data & Internet', 'Software Subscriptions', 'Food on Shift'],
  },
  {
    id: 'driver',
    title: 'Cab & Auto Ride Driver',
    shortTitle: 'Ride Driver',
    icon: '🚗',
    description: 'Uber, Ola, Rapido, InDrive, BluSmart',
    color: '#2563EB',
    badgeBg: 'rgba(37, 99, 235, 0.12)',
    platforms: ['Uber', 'Ola', 'Rapido'],
    popularExpenses: ['Fuel & CNG', 'Toll & Parking', 'Vehicle Service', 'Insurance'],
  },
  {
    id: 'services',
    title: 'Home & Technical Services Pro',
    shortTitle: 'Service Pro',
    icon: '🛠️',
    description: 'Urban Company, Electrician, Plumber, AC Service',
    color: '#00B074',
    badgeBg: 'rgba(0, 176, 116, 0.12)',
    platforms: ['Urban Company', 'Direct Client Work'],
    popularExpenses: ['Tools & Raw Materials', 'Fuel & Transport', 'Equipment Repair'],
  },
  {
    id: 'logistics',
    title: 'Logistics & Express Courier',
    shortTitle: 'Logistics Courier',
    icon: '📦',
    description: 'Porter, Shadowfax, Dunzo, Amazon Flex',
    color: '#F59E0B',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    platforms: ['Porter', 'Shadowfax', 'Amazon Flex'],
    popularExpenses: ['Fuel & Petrol', 'Toll & Vehicle Servicing'],
  },
  {
    id: 'other',
    title: 'Custom Gig Occupation',
    shortTitle: 'Custom Gig',
    icon: '✍️',
    description: 'Custom work profile',
    color: '#64748B',
    badgeBg: 'rgba(100, 116, 139, 0.12)',
    platforms: ['Other Gigs'],
    popularExpenses: ['Miscellaneous Expenses', 'Mobile Data'],
  },
];

export const DEMO_PROFILES = [
  {
    id: 'usr-rahul',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    occupationId: 'delivery',
    customOccupation: '',
    occupationTitle: 'Food & Grocery Delivery Partner',
    city: 'Bengaluru',
    dailyTarget: 2000,
  },
  {
    id: 'usr-pooja',
    name: 'Pooja Verma',
    phone: '+91 98111 22334',
    occupationId: 'freelancer',
    customOccupation: 'Freelance UI/UX Designer',
    occupationTitle: 'Freelance UI/UX Designer',
    city: 'Pune',
    dailyTarget: 3500,
  },
  {
    id: 'usr-harpreet',
    name: 'Harpreet Singh',
    phone: '+91 97123 45678',
    occupationId: 'driver',
    customOccupation: '',
    occupationTitle: 'Cab & Auto Ride Driver',
    city: 'Delhi NCR',
    dailyTarget: 3000,
  },
];

export const GIG_PLATFORMS = [
  { id: 'swiggy', name: 'Swiggy', icon: '🍔', color: '#FC8019', badgeBg: 'rgba(252, 128, 25, 0.12)' },
  { id: 'zomato', name: 'Zomato', icon: '🍕', color: '#E23744', badgeBg: 'rgba(226, 55, 68, 0.12)' },
  { id: 'uber', name: 'Uber', icon: '🚗', color: '#111827', badgeBg: 'rgba(17, 24, 39, 0.12)' },
  { id: 'zepto', name: 'Zepto', icon: '⚡', color: '#8800EC', badgeBg: 'rgba(136, 0, 236, 0.12)' },
  { id: 'blinkit', name: 'Blinkit', icon: '🛒', color: '#F8CB46', badgeBg: 'rgba(248, 203, 70, 0.18)' },
  { id: 'urban_company', name: 'Urban Company', icon: '🛠️', color: '#00B074', badgeBg: 'rgba(0, 176, 116, 0.12)' },
  { id: 'freelancing', name: 'Freelancing / Tech', icon: '💻', color: '#2563EB', badgeBg: 'rgba(37, 99, 235, 0.12)' },
  { id: 'other_income', name: 'Other Gigs', icon: '💼', color: '#64748B', badgeBg: 'rgba(100, 116, 139, 0.12)' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'rent_emi', name: 'Rent & EMI Contribution', icon: '🏠', isEssential: true, color: '#9333EA' },
  { id: 'fuel', name: 'Fuel & Petrol', icon: '⛽', isEssential: true, color: '#DC2626' },
  { id: 'food', name: 'Food & Chai on Shift', icon: '🍛', isEssential: true, color: '#EA580C' },
  { id: 'maintenance', name: 'Bike/Vehicle Servicing', icon: '🔧', isEssential: true, color: '#D97706' },
  { id: 'mobile', name: 'Mobile Data & Phone Bill', icon: '📱', isEssential: true, color: '#4F46E5' },
  { id: 'toll_parking', name: 'Toll & Parking Fees', icon: '🅿️', isEssential: true, color: '#0891B2' },
  { id: 'other_expense', name: 'Other Expenses', icon: '🛒', isEssential: false, color: '#64748B' },
];

export const SEED_TRANSACTIONS = [
  {
    id: 'tx-101',
    type: 'income',
    title: 'Swiggy Shifts (Today)',
    category: 'Swiggy',
    platform: 'swiggy',
    amount: 1500,
    date: new Date().toISOString().slice(0, 10),
    icon: '🍔',
    notes: 'Shift earnings (14 deliveries + tips)',
  },
  {
    id: 'tx-102',
    type: 'expense',
    title: 'Rent & EMI Shift Share',
    category: 'Rent & EMI Contribution',
    isEssential: true,
    amount: 300,
    date: new Date().toISOString().slice(0, 10),
    icon: '🏠',
    notes: 'Daily allocation for home rent',
  },
  {
    id: 'tx-103',
    type: 'expense',
    title: 'Shift Meal & Tea',
    category: 'Food & Chai on Shift',
    isEssential: true,
    amount: 150,
    date: new Date().toISOString().slice(0, 10),
    icon: '🍛',
    notes: 'Thali & tea on shift',
  },
  {
    id: 'tx-104',
    type: 'expense',
    title: 'Petrol Refuel',
    category: 'Fuel & Petrol',
    isEssential: true,
    amount: 100,
    date: new Date().toISOString().slice(0, 10),
    icon: '⛽',
    notes: 'Daily petrol for delivery runs',
  },
  {
    id: 'tx-105',
    type: 'expense',
    title: 'Mobile Recharge Daily Share',
    category: 'Mobile Data & Phone Bill',
    isEssential: true,
    amount: 30,
    date: new Date().toISOString().slice(0, 10),
    icon: '📱',
    notes: 'GPS & order app connectivity',
  },
  {
    id: 'tx-106',
    type: 'expense',
    title: 'Bike Loan EMI Daily Share',
    category: 'Rent & EMI Contribution',
    isEssential: true,
    amount: 70,
    date: new Date().toISOString().slice(0, 10),
    icon: '🔧',
    notes: 'Vehicle loan daily share',
  },
  {
    id: 'tx-107',
    type: 'income',
    title: 'Zomato Dinner Peak',
    category: 'Zomato',
    platform: 'zomato',
    amount: 1800,
    date: '2026-09-22',
    icon: '🍕',
    notes: 'Rain surge + peak hour bonus',
  },
  {
    id: 'tx-108',
    type: 'income',
    title: 'Zepto Morning Grocery Slot',
    category: 'Zepto',
    platform: 'zepto',
    amount: 900,
    date: '2026-09-21',
    icon: '⚡',
    notes: '6am-10am morning orders',
  },
];

export const DEFAULT_GOALS = [
  {
    id: 'goal-emergency',
    title: 'Emergency Safety Buffer',
    category: 'Safety',
    targetAmount: 20000,
    currentAmount: 8500,
    deadline: '2026-12-31',
    icon: '🛡️',
    isEmergency: true
  },
  {
    id: 'goal-laptop',
    title: 'New Vehicle / Work Laptop',
    category: 'Asset',
    targetAmount: 50000,
    currentAmount: 14200,
    deadline: '2027-03-31',
    icon: '💻',
    isEmergency: false
  }
];

export const SEED_DECISIONS = [
  {
    id: 'dec-1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    event: 'Income Adaptive Adjustment',
    title: 'Allocation Recalculated for Higher Income',
    reason: "Today's income (₹1,800) was 25% above recent daily average.",
    impact: 'Increased Micro-Investment allocation to ₹120 and Goal Savings to ₹180.',
    safeToAllocate: 650,
    microInvestment: 120,
    emergencySavings: 200
  },
  {
    id: 'dec-2',
    timestamp: new Date().toISOString(),
    event: 'Essential Safety Protection',
    title: 'Essential Expenses Protected First',
    reason: '₹650 in essential expenses deducted before evaluating safe surplus.',
    impact: 'Remaining disposable cash = ₹850. Safe-to-Allocate set to ₹500.',
    safeToAllocate: 500,
    microInvestment: 100,
    emergencySavings: 200
  }
];

const STORAGE_KEY = 'arthsetu_tx_v1';
const GOAL_STORAGE_KEY = 'arthsetu_goals_v1';
const PROFILE_STORAGE_KEY = 'arthsetu_profile_v1';
const USERS_REGISTRY_KEY = 'arthsetu_users_v1';
const DECISION_KEY = 'arthsetu_decisions_v1';
const INVEST_KEY = 'arthsetu_investments_v1';

export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Registered users load error:', err);
  }
  return DEMO_PROFILES;
}

export function saveRegisteredUser(profile) {
  try {
    const users = getRegisteredUsers();
    const cleanPhone = (profile.phone || '').replace(/\s+/g, '');
    const cleanName = (profile.name || '').trim().toLowerCase();

    const existingIndex = users.findIndex((u) => {
      const uPhone = (u.phone || '').replace(/\s+/g, '');
      const uName = (u.name || '').trim().toLowerCase();
      return (cleanPhone && uPhone === cleanPhone) || (cleanName && uName === cleanName);
    });

    const userRecord = {
      id: profile.id || `usr-${Date.now()}`,
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userRecord };
    } else {
      users.unshift(userRecord);
    }

    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
    return userRecord;
  } catch (err) {
    console.error('Error saving user:', err);
    return profile;
  }
}

export function findRegisteredUser(query) {
  if (!query) return null;
  const qClean = query.replace(/\s+/g, '').toLowerCase();
  const users = getRegisteredUsers();
  return users.find((u) => {
    const phoneClean = (u.phone || '').replace(/\s+/g, '').toLowerCase();
    const nameClean = (u.name || '').replace(/\s+/g, '').toLowerCase();
    return phoneClean.includes(qClean) || nameClean.includes(qClean);
  }) || null;
}

export function getUserProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Profile read error:', err);
  }
  return DEMO_PROFILES[0]; // Default to Rahul Sharma
}

export function saveUserProfile(profile) {
  try {
    const data = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
    saveRegisteredUser(data);
    return data;
  } catch (err) {
    console.error('Profile save error:', err);
    return profile;
  }
}

export function clearUserProfile() {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (err) {
    console.error('Logout error:', err);
  }
}

export function getStoredTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Transactions load error, using seeds:', err);
  }
  return [...SEED_TRANSACTIONS];
}

export function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Transactions save error:', err);
  }
}

export function resetToSeedData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DECISION_KEY);
  localStorage.removeItem(INVEST_KEY);
  return [...SEED_TRANSACTIONS];
}

export function getStoredGoals() {
  try {
    const raw = localStorage.getItem(GOAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Goals load error:', e);
  }
  return [...DEFAULT_GOALS];
}

export function saveGoals(goals) {
  try {
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goals));
  } catch (e) {
    console.error('Goals save error:', e);
  }
}

export function getDecisionHistory() {
  try {
    const raw = localStorage.getItem(DECISION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Decision history error:', e);
  }
  return [...SEED_DECISIONS];
}

export function logDecisionEvent(event) {
  try {
    const history = getDecisionHistory();
    history.unshift({
      id: `dec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...event
    });
    localStorage.setItem(DECISION_KEY, JSON.stringify(history.slice(0, 30)));
  } catch (e) {
    console.error('Decision log error:', e);
  }
}

export function getInvestmentPortfolio() {
  try {
    const raw = localStorage.getItem(INVEST_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Investments load error:', e);
  }
  return {
    totalInvested: 2450,
    mode: 'adaptive',
    modeValue: 15,
    history: [
      { date: '2026-09-20', amount: 120, mode: 'adaptive' },
      { date: '2026-09-21', amount: 80, mode: 'adaptive' },
      { date: '2026-09-22', amount: 150, mode: 'adaptive' },
      { date: new Date().toISOString().slice(0, 10), amount: 100, mode: 'adaptive' }
    ]
  };
}

export function saveInvestmentPortfolio(data) {
  try {
    localStorage.setItem(INVEST_KEY, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN');
}

export function exportToCSV(transactions) {
  const headers = ['ID', 'Type', 'Title / Source', 'Category', 'Is Essential', 'Amount (INR)', 'Date', 'Notes'];
  const rows = transactions.map((t) => [
    t.id,
    t.type.toUpperCase(),
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.isEssential ? 'YES' : 'NO',
    t.amount,
    t.date,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ArthSetu_Financial_Report_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
