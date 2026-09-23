/**
 * ArthSetu — Main Application Controller & View Orchestrator
 */

import {
  OCCUPATIONS,
  DEMO_PROFILES,
  GIG_PLATFORMS,
  EXPENSE_CATEGORIES,
  getRegisteredUsers,
  getUserProfile,
  saveUserProfile,
  clearUserProfile,
  getStoredTransactions,
  saveTransactions,
  resetToSeedData,
  getStoredGoals,
  saveGoals,
  getDecisionHistory,
  logDecisionEvent,
  getInvestmentPortfolio,
  saveInvestmentPortfolio,
  formatCurrency,
  exportToCSV
} from './data.js';

import {
  evaluateCanonicalState,
  compareDecisionStates
} from './engine.js';

// App State
let currentUser = getUserProfile();
let transactions = getStoredTransactions();
let goals = getStoredGoals();
let portfolio = getInvestmentPortfolio();
let currentView = 'dashboard'; // 'landing' | 'auth' | 'dashboard' | 'invest' | 'finances' | 'goals' | 'simulate' | 'insights' | 'copilot'
let lastCanonicalState = null;

// DOM Elements
const authView = document.getElementById('authView');
const landingView = document.getElementById('landingView');
const dashboardView = document.getElementById('dashboardView');
const investView = document.getElementById('investView');
const financesView = document.getElementById('financesView');
const goalsView = document.getElementById('goalsView');
const simulateView = document.getElementById('simulateView');
const insightsView = document.getElementById('insightsView');
const copilotView = document.getElementById('copilotView');
const mainNavTabsBar = document.getElementById('mainNavTabsBar');
const userProfileMenuWrap = document.getElementById('userProfileMenuWrap');

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupEventListeners();
  checkAuthAndRender();
});

/**
 * Check Authentication & Initial View Routing
 */
function checkAuthAndRender() {
  currentUser = getUserProfile();

  if (currentUser && currentUser.name) {
    userProfileMenuWrap.style.display = 'block';
    mainNavTabsBar.style.display = 'flex';
    document.getElementById('navUserName').textContent = currentUser.name;
    document.getElementById('navUserOccupation').textContent = currentUser.occupationTitle || 'Gig Worker';
    switchView(currentView === 'landing' ? 'dashboard' : currentView);
  } else {
    userProfileMenuWrap.style.display = 'none';
    mainNavTabsBar.style.display = 'none';
    switchView('landing');
  }
}

/**
 * View Router
 */
function switchView(viewName) {
  currentView = viewName;

  // Hide all views
  [landingView, authView, dashboardView, investView, financesView, goalsView, simulateView, insightsView, copilotView].forEach(v => {
    if (v) v.style.display = 'none';
  });

  // Activate tab buttons
  document.querySelectorAll('.nav-tab-btn, .mobile-nav-btn').forEach(btn => {
    if (btn.dataset.view === viewName) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Show target view
  if (viewName === 'landing') landingView.style.display = 'block';
  else if (viewName === 'auth') authView.style.display = 'flex';
  else if (viewName === 'dashboard') {
    dashboardView.style.display = 'block';
    renderDashboard();
  } else if (viewName === 'invest') {
    investView.style.display = 'block';
    renderInvestView();
  } else if (viewName === 'finances') {
    financesView.style.display = 'block';
    renderFinancesView();
  } else if (viewName === 'goals') {
    goalsView.style.display = 'block';
    renderGoalsView();
  } else if (viewName === 'simulate') {
    simulateView.style.display = 'block';
    renderSimulateView();
  } else if (viewName === 'insights') {
    insightsView.style.display = 'block';
  } else if (viewName === 'copilot') {
    copilotView.style.display = 'block';
    renderCopilotView();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Core Render: Computes Canonical Financial Engine State & Updates UI
 */
function computeCurrentEngineState(incomeOverride = null, expenseOverride = null) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTx = transactions.filter(t => (t.date === todayStr || t.date === 'today'));

  let todayIncome = todayTx.filter(t => t.type === 'income').reduce((s, t) => s + (Number(t.amount) || 0), 0);
  let essentialExpenses = todayTx.filter(t => t.type === 'expense' && t.isEssential).reduce((s, t) => s + (Number(t.amount) || 0), 0);

  // Fallbacks if no transaction logged today yet
  if (todayIncome === 0) todayIncome = incomeOverride !== null ? incomeOverride : 1500;
  if (essentialExpenses === 0) essentialExpenses = expenseOverride !== null ? expenseOverride : 650;

  const currentEmergencyReserve = goals.find(g => g.isEmergency)?.currentAmount || 8500;

  const canonical = evaluateCanonicalState({
    todayIncome,
    essentialExpenses,
    currentEmergencyReserve,
    monthlyEssentialTarget: 15000,
    transactions,
    goals,
    investmentMode: portfolio.mode || 'adaptive',
    customModeValue: portfolio.modeValue || 15
  });

  return canonical;
}

/**
 * Render Dashboard Section by Section
 */
function renderDashboard() {
  const canonical = computeCurrentEngineState();

  // Log Decision Event if state shifted significantly
  if (lastCanonicalState) {
    const comp = compareDecisionStates(lastCanonicalState, canonical);
    if (comp && Math.abs(comp.investChange) >= 20) {
      logDecisionEvent({
        event: 'Engine Allocation Recalculation',
        title: `Micro-Investment ${comp.investChange >= 0 ? 'Increased' : 'Decreased'} by ₹${Math.abs(comp.investChange)}`,
        reason: comp.aiSummary,
        impact: `Safe-to-Allocate: ₹${canonical.safeToAllocate}, Micro-Investment: ₹${canonical.smartSplit.microInvestment}`,
        safeToAllocate: canonical.safeToAllocate,
        microInvestment: canonical.smartSplit.microInvestment,
        emergencySavings: canonical.smartSplit.emergencySavings
      });
    }
  }
  lastCanonicalState = canonical;

  // Banner Greeting
  const bannerGreeting = document.getElementById('bannerGreeting');
  if (bannerGreeting && currentUser) {
    bannerGreeting.textContent = `Good day, ${currentUser.name || 'Rahul'}!`;
  }

  // Section 1 — Financial Waterfall
  document.getElementById('dashTodayIncomeVal').textContent = formatCurrency(canonical.todayIncome);
  document.getElementById('dashEssentialVal').textContent = `-${formatCurrency(canonical.essentialExpenses)}`;
  document.getElementById('dashRemainingVal').textContent = formatCurrency(canonical.remainingMoney);
  document.getElementById('dashSafeToAllocateVal').textContent = formatCurrency(canonical.safeToAllocate);

  // Section 2 — Your Money Today (Smart Split)
  document.getElementById('dashSplitEmergencyVal').textContent = formatCurrency(canonical.smartSplit.emergencySavings);
  document.getElementById('dashSplitGoalVal').textContent = formatCurrency(canonical.smartSplit.goalSavings);
  document.getElementById('dashSplitInvestVal').textContent = formatCurrency(canonical.smartSplit.microInvestment);
  document.getElementById('dashSplitBufferVal').textContent = formatCurrency(canonical.smartSplit.flexibleBuffer);

  // Section 3 — Financial Pulse
  document.getElementById('dashVolatilityScoreVal').textContent = `${canonical.volatility.score.toUpperCase()} (${Math.round(canonical.volatility.ratio * 100)}%)`;
  document.getElementById('dashRunwayDaysVal').textContent = `${canonical.emergency.daysCovered} Days`;
  document.getElementById('dashExpenseBurdenVal').textContent = `${canonical.expenseRatio}%`;
  document.getElementById('dashTotalInvestedVal').textContent = formatCurrency(portfolio.totalInvested || 2450);

  // Section 4 — AI Explanation
  document.getElementById('dashAiExplanationBox').textContent = canonical.aiExplanation;

  // Section 5 — Decision History
  renderDecisionHistoryList();
}

function renderDecisionHistoryList() {
  const container = document.getElementById('dashDecisionHistoryList');
  if (!container) return;
  const history = getDecisionHistory();

  if (history.length === 0) {
    container.innerHTML = '<div style="font-size:13px; color:var(--text-muted);">No decision history logged yet.</div>';
    return;
  }

  container.innerHTML = history.slice(0, 4).map(item => `
    <div style="background: var(--bg-surface-alt); border-left: 4px solid var(--primary); padding: 14px; border-radius: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong style="font-size: 13.5px;">${item.title}</strong>
        <span style="font-size: 11px; color: var(--text-muted);">${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 4px;">${item.reason}</p>
      <div style="font-size: 11.5px; color: var(--primary); font-weight: 700; margin-top: 6px;">Impact: ${item.impact}</div>
    </div>
  `).join('');
}

/**
 * Render Micro-Investments View (/invest)
 */
function renderInvestView() {
  const canonical = computeCurrentEngineState();
  document.getElementById('investHeroVal').textContent = formatCurrency(canonical.smartSplit.microInvestment);

  const banner = document.getElementById('investGuardrailBanner');
  if (canonical.guardrailActive) {
    banner.style.display = 'flex';
    document.getElementById('investGuardrailReason').textContent = canonical.guardrailReason;
  } else {
    banner.style.display = 'none';
  }

  // Why Did My Investment Change comparison
  const box = document.getElementById('investComparisonBox');
  if (box) {
    box.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div><strong>Current Recommended Micro-Investment:</strong> ${formatCurrency(canonical.smartSplit.microInvestment)}/day</div>
        <div><strong>Income Level:</strong> ${formatCurrency(canonical.todayIncome)} (${canonical.volatility.score} volatility)</div>
        <div><strong>Essential Expense Pressure:</strong> ${formatCurrency(canonical.essentialExpenses)} (${canonical.expenseRatio}%)</div>
        <div><strong>Emergency Buffer Status:</strong> ${canonical.emergency.status.toUpperCase()} (${canonical.emergency.daysCovered} days runway)</div>
        <div style="margin-top: 6px; padding-top: 8px; border-top: 1px solid var(--border-color); font-weight: 600; color: var(--primary);">
          🤖 AI Note: ${canonical.aiExplanation}
        </div>
      </div>
    `;
  }
}

/**
 * Render Finances / Ledger View (/finances)
 */
function renderFinancesView() {
  const tbody = document.getElementById('txTableBody');
  if (!tbody) return;

  tbody.innerHTML = transactions.map(t => `
    <tr>
      <td>
        <div style="display:flex; align-items:center; gap:8px;">
          <span>${t.icon || '💰'}</span>
          <strong>${t.title}</strong>
        </div>
      </td>
      <td><span class="badge-tag">${t.category}</span></td>
      <td>${t.type === 'expense' ? (t.isEssential ? '🔴 YES' : '⚪ NO') : '—'}</td>
      <td><span class="badge-tag ${t.type === 'income' ? 'tag-green' : 'tag-red'}">${t.type.toUpperCase()}</span></td>
      <td>${t.date}</td>
      <td style="font-weight:700; color:${t.type === 'income' ? 'var(--income)' : 'var(--expense)'};">
        ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
      </td>
      <td style="text-align:right;">
        <button class="btn-icon btn-del-tx" data-id="${t.id}" title="Delete">🗑️</button>
      </td>
    </tr>
  `).join('');

  // Attach delete handlers
  document.querySelectorAll('.btn-del-tx').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      transactions = transactions.filter(t => t.id !== id);
      saveTransactions(transactions);
      renderFinancesView();
      showToast('Record deleted');
    });
  });
}

/**
 * Render Goals View (/goals)
 */
function renderGoalsView() {
  const grid = document.getElementById('goalsListGrid');
  if (!grid) return;

  grid.innerHTML = goals.map(g => {
    const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
    return `
      <div class="split-card" style="border-left: 6px solid ${g.isEmergency ? 'var(--primary)' : 'var(--income)'};">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size: 24px;">${g.icon}</span>
          <span class="badge-tag ${g.isEmergency ? 'tag-green' : ''}">${g.category}</span>
        </div>
        <h3 style="font-size: 16px; font-weight: 800; margin-top: 8px;">${g.title}</h3>
        <div style="font-size: 20px; font-weight: 800; margin: 4px 0;">${formatCurrency(g.currentAmount)} / ${formatCurrency(g.targetAmount)}</div>
        <div class="progress-track" style="margin-top: 10px;">
          <div class="progress-bar-fill" style="width: ${pct}%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11.5px; color:var(--text-muted); margin-top:6px;">
          <span>Target Progress: ${pct}%</span>
          <span>Deadline: ${g.deadline}</span>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render What-If Simulator View (/simulate)
 */
function renderSimulateView() {
  updateSimulatedOutcome(1500, 650);
}

function updateSimulatedOutcome(simIncome, simExpense) {
  const current = computeCurrentEngineState();
  const simulated = evaluateCanonicalState({
    todayIncome: simIncome,
    essentialExpenses: simExpense,
    currentEmergencyReserve: goals.find(g => g.isEmergency)?.currentAmount || 8500,
    monthlyEssentialTarget: 15000,
    transactions,
    goals
  });

  document.getElementById('simCurrentIncome').textContent = formatCurrency(current.todayIncome);
  document.getElementById('simCurrentExpense').textContent = formatCurrency(current.essentialExpenses);
  document.getElementById('simCurrentRemaining').textContent = formatCurrency(current.remainingMoney);
  document.getElementById('simCurrentInvest').textContent = formatCurrency(current.smartSplit.microInvestment);

  document.getElementById('simSimulatedIncome').textContent = formatCurrency(simulated.todayIncome);
  document.getElementById('simSimulatedExpense').textContent = formatCurrency(simulated.essentialExpenses);
  document.getElementById('simSimulatedRemaining').textContent = formatCurrency(simulated.remainingMoney);
  document.getElementById('simSimulatedInvest').textContent = formatCurrency(simulated.smartSplit.microInvestment);

  const box = document.getElementById('simExplanationBox');
  if (box) {
    box.innerHTML = `
      <strong>Simulator Engine Analysis:</strong><br/>
      ${simulated.aiExplanation}
    `;
  }
}

/**
 * Render AI Copilot View (/copilot)
 */
function renderCopilotView() {
  // Setup preset prompts
  document.querySelectorAll('.copilot-prompt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const q = e.target.textContent;
      const canonical = computeCurrentEngineState();
      const box = document.getElementById('copilotChatBox');

      let reply = `<strong>Question:</strong> ${q}<br/><br/><strong>ArthSetu Copilot:</strong> `;
      if (q.includes('₹100')) {
        reply += `You can safely invest ₹${canonical.smartSplit.microInvestment} today because after covering ₹${canonical.essentialExpenses} essential expenses from ₹${canonical.todayIncome} income, you have ₹${canonical.remainingMoney} remaining. The engine calculated ₹${canonical.safeToAllocate} as safe to allocate, leaving ₹${canonical.smartSplit.microInvestment} for micro-investment while keeping your emergency fund protected.`;
      } else if (q.includes('₹500 tomorrow')) {
        reply += `If you earn ₹500 tomorrow with ₹400 essential expenses, remaining money drops to ₹100. ArthSetu's safety guardrail will automatically set micro-investments to ₹0 and prioritize your emergency buffer.`;
      } else {
        reply += canonical.aiExplanation;
      }

      box.innerHTML = reply;
    });
  });
}

/**
 * Setup Event Listeners & Modals
 */
function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('.nav-tab-btn, .mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.currentTarget.dataset.view;
      if (view) switchView(view);
    });
  });

  // Brand Logo Click -> Dashboard or Landing
  document.getElementById('brandLogoBtn')?.addEventListener('click', () => {
    switchView(currentUser ? 'dashboard' : 'landing');
  });

  // Landing CTAs
  document.getElementById('landingCtaBtn')?.addEventListener('click', () => switchView('auth'));
  document.getElementById('landingDemoBtn')?.addEventListener('click', () => {
    loginAsDemoProfile('usr-rahul');
  });

  // Auth Button
  document.getElementById('btnCompleteAuth')?.addEventListener('click', () => {
    const name = document.getElementById('authFullName').value || 'Rahul Sharma';
    const phone = document.getElementById('authPhone').value || '+91 98765 43210';
    const city = document.getElementById('authCity').value || 'Bengaluru';
    const occId = document.getElementById('authOccSelect').value;
    const occObj = OCCUPATIONS.find(o => o.id === occId) || OCCUPATIONS[0];

    currentUser = saveUserProfile({
      name,
      phone,
      city,
      occupationId: occId,
      occupationTitle: occObj.title
    });

    checkAuthAndRender();
    showToast(`Welcome, ${name}!`);
  });

  // Demo Profile Logins
  document.getElementById('demoRahulBtn')?.addEventListener('click', () => loginAsDemoProfile('usr-rahul'));
  document.getElementById('demoPoojaBtn')?.addEventListener('click', () => loginAsDemoProfile('usr-pooja'));
  document.getElementById('demoHarpreetBtn')?.addEventListener('click', () => loginAsDemoProfile('usr-harpreet'));

  // Quick Action Modals (+ Add Income, - Add Expense)
  document.getElementById('quickAddIncomeBtn')?.addEventListener('click', () => openAddModal('income'));
  document.getElementById('quickAddExpenseBtn')?.addEventListener('click', () => openAddModal('expense'));
  document.getElementById('quickIncomeBtn')?.addEventListener('click', () => openAddModal('income'));
  document.getElementById('btnFinAddIncome')?.addEventListener('click', () => openAddModal('income'));
  document.getElementById('btnFinAddExpense')?.addEventListener('click', () => openAddModal('expense'));

  document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn')?.addEventListener('click', closeModal);
  document.getElementById('saveModalBtn')?.addEventListener('click', handleSaveRecord);

  // User Profile Dropdown
  document.getElementById('userProfileBtn')?.addEventListener('click', () => {
    const menu = document.getElementById('userDropdownMenu');
    menu.classList.toggle('show');
  });

  document.getElementById('logoutMenuBtn')?.addEventListener('click', () => {
    clearUserProfile();
    currentUser = null;
    checkAuthAndRender();
    showToast('Signed out');
  });

  // Simulator Presets
  document.querySelectorAll('.sim-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const preset = e.target.dataset.preset;
      if (preset === 'shock') updateSimulatedOutcome(500, 400);
      else if (preset === 'strong') updateSimulatedOutcome(2200, 650);
      else if (preset === 'repair') updateSimulatedOutcome(1500, 6650);
      else if (preset === 'reset') renderSimulateView();
    });
  });

  // Export CSV
  document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
    exportToCSV(transactions);
    showToast('Financial report exported to CSV');
  });
}

function loginAsDemoProfile(id) {
  const demo = DEMO_PROFILES.find(p => p.id === id) || DEMO_PROFILES[0];
  currentUser = saveUserProfile(demo);
  checkAuthAndRender();
  showToast(`Signed in as ${demo.name}`);
}

/**
 * Modal Handling
 */
let currentModalMode = 'income';

function openAddModal(type) {
  currentModalMode = type;
  const modal = document.getElementById('addModalBackdrop');
  const headline = document.getElementById('modalHeadline');
  const badge = document.getElementById('modalTypeBadge');
  const essentialWrap = document.getElementById('modalEssentialWrap');

  if (type === 'income') {
    headline.textContent = 'Log Shift Earnings';
    badge.textContent = '+ INFLOW';
    badge.className = 'badge-tag tag-green';
    essentialWrap.style.display = 'none';
  } else {
    headline.textContent = 'Log Work / Living Expense';
    badge.textContent = '− OUTFLOW';
    badge.className = 'badge-tag tag-red';
    essentialWrap.style.display = 'block';
  }

  modal.classList.add('show');
}

function closeModal() {
  document.getElementById('addModalBackdrop').classList.remove('show');
}

function handleSaveRecord() {
  const amt = Number(document.getElementById('modalAmountInput').value);
  if (!amt || amt <= 0) {
    showToast('Please enter a valid amount');
    return;
  }

  const category = document.getElementById('modalCatSelect').value;
  const title = document.getElementById('modalTitleInput').value || (currentModalMode === 'income' ? 'Shift Income' : category);
  const isEssential = currentModalMode === 'expense' ? document.getElementById('modalEssentialCheckbox').checked : false;

  const newTx = {
    id: `tx-${Date.now()}`,
    type: currentModalMode,
    title,
    category,
    isEssential,
    amount: amt,
    date: new Date().toISOString().slice(0, 10),
    icon: currentModalMode === 'income' ? '💰' : '⛽'
  };

  transactions.unshift(newTx);
  saveTransactions(transactions);
  closeModal();

  // Show Expense Impact Feedback
  if (currentModalMode === 'expense' && isEssential) {
    showToast(`Logged ₹${amt} Essential Expense → Recalculating Safe-to-Allocate & Investment Capacity`);
  } else {
    showToast(`Logged ${formatCurrency(amt)} ${currentModalMode}`);
  }

  renderDashboard();
  if (currentView === 'finances') renderFinancesView();
}

/**
 * Theme Toggle
 */
function initTheme() {
  const theme = localStorage.getItem('arthsetu_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);

  document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
    const curr = document.documentElement.getAttribute('data-theme');
    const next = curr === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('arthsetu_theme', next);
  });
}

/**
 * Toast Notice
 */
function showToast(msg) {
  const toast = document.getElementById('toastNotice');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
