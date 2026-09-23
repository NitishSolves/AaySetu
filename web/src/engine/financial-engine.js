/**
 * ArthSetu — Canonical Financial Engine & Adaptive Allocation Engine
 *
 * CORE RULE:
 * Remaining Money = Today's Income - Essential Expenses
 * All financial allocations (Emergency, Goals, Micro-Investment, Flexible Buffer)
 * are calculated deterministically on Remaining Money, NOT gross income.
 *
 * Code calculates. AI explains.
 */

// ============================================================================
// INCOME VOLATILITY
// ============================================================================

export function calculateIncomeVolatility(transactions = []) {
  const incomeTx = transactions.filter(t => t.type === 'income');
  if (incomeTx.length === 0) {
    return {
      ratio: 0.2,
      score: 'moderate',
      averageDailyIncome: 1200,
      dailyIncomes: [],
      volatilityScore: 50
    };
  }

  // Group by date
  const byDate = {};
  incomeTx.forEach(t => {
    const d = t.date || new Date().toISOString().split('T')[0];
    byDate[d] = (byDate[d] || 0) + (Number(t.amount) || 0);
  });

  const values = Object.values(byDate);
  if (values.length === 0) {
    return {
      ratio: 0.2,
      score: 'moderate',
      averageDailyIncome: 1200,
      dailyIncomes: [],
      volatilityScore: 50
    };
  }

  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;

  if (values.length === 1) {
    return {
      ratio: 0.15,
      score: 'low',
      averageDailyIncome: avg,
      dailyIncomes: values,
      volatilityScore: 15
    };
  }

  const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const ratio = avg > 0 ? stdDev / avg : 0.5;

  let score = 'low';
  let volatilityScore = Math.min(100, Math.round(ratio * 100));

  if (ratio > 0.35) score = 'high';
  else if (ratio > 0.18) score = 'moderate';

  return {
    ratio: Math.round(ratio * 100) / 100,
    score,
    averageDailyIncome: Math.round(avg),
    dailyIncomes: values,
    volatilityScore
  };
}

// ============================================================================
// ESSENTIAL DAILY BURN
// ============================================================================

export function calculateEssentialDailyBurn(transactions = [], days = 30) {
  if (!transactions || transactions.length === 0) {
    return { dailyBurn: 0, totalEssential: 0 };
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const essentialExpenses = transactions.filter(t => {
    const isExpense = t.type === 'expense';
    const isEssential = t.category && [
      'food',
      'transport',
      'rent',
      'utilities',
      'work_expense',
      'groceries',
      'petrol',
      'fuel'
    ].includes(t.category.toLowerCase());
    const isRecent = new Date(t.date) > cutoffDate;

    return isExpense && isEssential && isRecent;
  });

  const totalEssential = essentialExpenses.reduce((sum, t) => sum + t.amount, 0);
  const dailyBurn = days > 0 ? Math.round(totalEssential / days) : 0;

  return { dailyBurn, totalEssential };
}

// ============================================================================
// UPCOMING OBLIGATIONS
// ============================================================================

export function calculateUpcomingObligations(obligations = [], upcomingDays = 30) {
  if (!obligations || obligations.length === 0) {
    return 0;
  }

  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + upcomingDays);

  return obligations
    .filter(o => {
      const dueDate = new Date(o.due_date);
      return dueDate > today && dueDate <= futureDate;
    })
    .reduce((sum, o) => sum + o.amount, 0);
}

// ============================================================================
// MINIMUM CASH BUFFER
// ============================================================================

export function calculateMinimumCashBuffer(params) {
  const {
    essentialDailyBurn,
    volatility,
    upcomingObligations,
    emergencyReserve = 1000
  } = params;

  // Higher volatility = larger buffer
  const volatilityMultiplier = 1 + (volatility / 100) * 0.5; // 1.0 to 1.5x

  const bufferDays = Math.round(15 * volatilityMultiplier);
  const essentialBuffer = essentialDailyBurn * bufferDays;

  return Math.round(essentialBuffer + upcomingObligations + emergencyReserve);
}

// ============================================================================
// SAFE-TO-SAVE (Primary Metric)
// ============================================================================

export function calculateSafeToSave(params) {
  const {
    currentCash,
    todayIncome,
    minimumBuffer,
    upcomingObligations
  } = params;

  const availableSurplus = currentCash + todayIncome;
  const totalProtection = minimumBuffer;

  const safeToSave = Math.max(0, availableSurplus - totalProtection);

  let mode = 'healthy';
  if (safeToSave === 0) mode = 'cash_preservation';
  else if (safeToSave < 200) mode = 'cautious';
  else if (safeToSave > 1000) mode = 'surplus';

  return {
    safeToSave,
    availableSurplus,
    minimumBuffer,
    mode,
    percentOfSurplus: availableSurplus > 0 ? Math.round((safeToSave / availableSurplus) * 100) : 0
  };
}

// ============================================================================
// EMERGENCY RUNWAY
// ============================================================================

export function calculateEmergencyRunway(currentReserve = 0, monthlyEssentialExpenses = 15000) {
  const dailyEssential = monthlyEssentialExpenses / 30 || 500;
  const daysCovered = dailyEssential > 0 ? Math.round(currentReserve / dailyEssential) : 0;
  const targetReserve = monthlyEssentialExpenses * 3; // 3-month benchmark
  const progressRatio = targetReserve > 0 ? currentReserve / targetReserve : 0;

  let status = 'healthy';
  if (progressRatio < 0.3) status = 'critical';
  else if (progressRatio < 0.75) status = 'building';

  return {
    currentReserve,
    targetReserve,
    monthlyEssentialExpenses,
    dailyEssential,
    daysCovered,
    progressRatio: Math.round(progressRatio * 100) / 100,
    status
  };
}

// ============================================================================
// EVALUATE CANONICAL STATE
// ============================================================================

export function evaluateCanonicalState({
  todayIncome = 1500,
  essentialExpenses = 650,
  nonEssentialExpenses = 0,
  currentEmergencyReserve = 8500,
  monthlyEssentialTarget = 15000,
  transactions = [],
  obligations = [],
  goals = [],
  userRiskProfile = 'balanced',
  investmentMode = 'adaptive', // 'adaptive' | 'daily' | 'percentage' | 'roundup'
  customModeValue = 15
}) {
  const remainingMoney = Math.max(0, todayIncome - essentialExpenses);
  const netSurplus = Math.max(0, remainingMoney - nonEssentialExpenses);
  const volatility = calculateIncomeVolatility(transactions);
  const emergency = calculateEmergencyRunway(currentEmergencyReserve, monthlyEssentialTarget);
  const { dailyBurn } = calculateEssentialDailyBurn(transactions);
  const upcomingObligations = calculateUpcomingObligations(obligations);

  // Expense pressure
  const expenseRatio = todayIncome > 0 ? essentialExpenses / todayIncome : 1.0;

  // Calculate Safe-to-Allocate Factor
  let safetyFactor = 0.65;
  if (emergency.status === 'critical') safetyFactor -= 0.20;
  if (volatility.score === 'high') safetyFactor -= 0.15;
  if (volatility.score === 'low') safetyFactor += 0.10;
  if (todayIncome < volatility.averageDailyIncome * 0.7) safetyFactor -= 0.15;
  if (todayIncome > volatility.averageDailyIncome * 1.3) safetyFactor += 0.10;

  // Clamp safety factor between 0.15 and 0.85
  safetyFactor = Math.min(0.85, Math.max(0.15, safetyFactor));

  const safeToAllocate = Math.round(remainingMoney * safetyFactor);

  // Smart Split Logic
  let emergencySavings = 0;
  let goalSavings = 0;
  let microInvestment = 0;
  let flexibleBuffer = 0;
  let guardrailActive = false;
  let guardrailReason = '';

  if (safeToAllocate <= 0) {
    guardrailActive = true;
    guardrailReason = "Income after essential expenses is zero or insufficient for safe allocation.";
  } else {
    // Determine Emergency Allocation Share
    let emergencyShare = 0.35;
    if (emergency.status === 'critical') emergencyShare = 0.65;
    else if (emergency.status === 'building') emergencyShare = 0.40;
    else emergencyShare = 0.20;

    // Hard Safety Guardrail for Micro-Investment
    if (emergency.status === 'critical' || remainingMoney < 150) {
      guardrailActive = true;
      guardrailReason = "Investment temporarily set to ₹0 because emergency reserve is below safety threshold or remaining money is minimal.";
      emergencyShare += 0.20; // Direct all investable cash to safety
    }

    emergencySavings = Math.round(safeToAllocate * emergencyShare);

    // Goal Allocation Share
    let goalShare = 0.30;
    if (goals.length === 0) goalShare = 0.15;
    goalSavings = Math.round(safeToAllocate * goalShare);

    // Micro-Investment Share
    if (!guardrailActive) {
      if (investmentMode === 'percentage') {
        const pct = (Number(customModeValue) || 15) / 100;
        microInvestment = Math.round(safeToAllocate * pct);
      } else if (investmentMode === 'daily') {
        microInvestment = Math.min(safeToAllocate - emergencySavings, Number(customModeValue) || 50);
      } else {
        // Adaptive mode
        let investShare = 0.25;
        if (volatility.score === 'high') investShare = 0.15;
        if (todayIncome > volatility.averageDailyIncome * 1.2) investShare += 0.10;
        microInvestment = Math.round(safeToAllocate * investShare);
      }
    } else {
      microInvestment = 0;
    }

    // Ensure total split doesn't exceed safeToAllocate
    const allocated = emergencySavings + goalSavings + microInvestment;
    flexibleBuffer = Math.max(0, safeToAllocate - allocated);
  }

  // Financial Safety Score (0-100)
  const safetyScore = calculateFinancialSafetyScore({
    safeToAllocate,
    remainingMoney,
    emergency,
    volatility,
    todayIncome,
    essentialExpenses
  });

  // Generate Grounded AI Explanation
  const aiExplanation = generateGroundedExplanation({
    todayIncome,
    essentialExpenses,
    remainingMoney,
    safeToAllocate,
    emergencySavings,
    goalSavings,
    microInvestment,
    flexibleBuffer,
    volatility,
    emergency,
    guardrailActive,
    guardrailReason
  });

  return {
    todayIncome,
    essentialExpenses,
    nonEssentialExpenses,
    remainingMoney,
    netSurplus,
    expenseRatio: Math.round(expenseRatio * 100),
    safeToAllocate,
    safetyFactor: Math.round(safetyFactor * 100),
    safetyScore,
    smartSplit: {
      emergencySavings,
      goalSavings,
      microInvestment,
      flexibleBuffer
    },
    volatility,
    emergency,
    guardrailActive,
    guardrailReason,
    aiExplanation,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// FINANCIAL SAFETY SCORE
// ============================================================================

export function calculateFinancialSafetyScore({
  safeToAllocate,
  remainingMoney,
  emergency,
  volatility,
  todayIncome,
  essentialExpenses
}) {
  let score = 50; // Base score

  // Emergency buffer contribution (40 points max)
  const emergencyScore = Math.min(40, emergency.progressRatio * 40);
  score += emergencyScore;

  // Income stability contribution (30 points max)
  const stabilityScore = Math.max(0, 30 - (volatility.volatilityScore * 0.3));
  score += stabilityScore;

  // Safe allocation contribution (30 points max)
  const allocationRatio = remainingMoney > 0 ? safeToAllocate / remainingMoney : 0;
  const allocationScore = Math.min(30, allocationRatio * 30);
  score += allocationScore;

  return Math.round(Math.min(100, Math.max(0, score)));
}

// ============================================================================
// AFFORDABILITY CHECK
// ============================================================================

export function checkAffordability({
  purchaseAmount,
  currentCash,
  minimumBuffer
}) {
  const canAfford = currentCash - purchaseAmount >= minimumBuffer;
  const remaining = currentCash - purchaseAmount - minimumBuffer;

  return {
    canAfford,
    purchaseAmount,
    currentCash,
    minimumBuffer,
    remainingAfterPurchase: Math.max(0, remaining),
    risk: canAfford ? 'low' : 'high'
  };
}

// ============================================================================
// SCENARIO COMPARISON
// ============================================================================

export function compareDecisionStates(prev, curr) {
  if (!prev || !curr) return null;

  const incomeDiff = curr.todayIncome - prev.todayIncome;
  const safeDiff = curr.safeToAllocate - prev.safeToAllocate;
  const investDiff = curr.smartSplit.microInvestment - prev.smartSplit.microInvestment;

  const reasons = [];
  if (incomeDiff < 0) {
    reasons.push(`Today's income dropped by ₹${Math.abs(incomeDiff).toLocaleString('en-IN')}`);
  } else if (incomeDiff > 0) {
    reasons.push(`Today's income increased by ₹${incomeDiff.toLocaleString('en-IN')}`);
  }

  if (curr.essentialExpenses > prev.essentialExpenses) {
    reasons.push(`Essential expenses increased by ₹${(curr.essentialExpenses - prev.essentialExpenses).toLocaleString('en-IN')}`);
  }

  if (curr.emergency.status === 'critical') {
    reasons.push('Emergency buffer fell below safety target');
  }

  return {
    incomeChange: incomeDiff,
    safeChange: safeDiff,
    investChange: investDiff,
    reasons,
    aiSummary: `Your recommended micro-investment ${investDiff >= 0 ? 'increased' : 'decreased'} by ₹${Math.abs(investDiff)} because ${reasons.join(' and ') || 'financial factors shifted'}.`
  };
}

// ============================================================================
// AI EXPLANATION GENERATION
// ============================================================================

function generateGroundedExplanation(ctx) {
  const parts = [];

  if (ctx.guardrailActive) {
    parts.push(`Today you earned ₹${ctx.todayIncome.toLocaleString('en-IN')} with ₹${ctx.essentialExpenses.toLocaleString('en-IN')} in essential expenses, leaving ₹${ctx.remainingMoney.toLocaleString('en-IN')} remaining.`);
    parts.push(ctx.guardrailReason);
    parts.push(`ArthSetu directed all ₹${ctx.safeToAllocate.toLocaleString('en-IN')} of safe funds toward building your emergency reserve.`);
  } else {
    const isAboveAvg = ctx.todayIncome >= ctx.volatility.averageDailyIncome;
    const diffPct = ctx.volatility.averageDailyIncome > 0
      ? Math.round(Math.abs((ctx.todayIncome - ctx.volatility.averageDailyIncome) / ctx.volatility.averageDailyIncome) * 100)
      : 0;

    parts.push(`You earned ₹${ctx.todayIncome.toLocaleString('en-IN')} today (${diffPct}% ${isAboveAvg ? 'above' : 'below'} your daily average).`);
    parts.push(`After covering ₹${ctx.essentialExpenses.toLocaleString('en-IN')} essential expenses, you have ₹${ctx.remainingMoney.toLocaleString('en-IN')} remaining.`);
    parts.push(`Based on ${ctx.volatility.score} income volatility and your ${ctx.emergency.status} emergency buffer, ₹${ctx.safeToAllocate.toLocaleString('en-IN')} is safe to allocate.`);
    parts.push(`ArthSetu recommends investing ₹${ctx.microInvestment.toLocaleString('en-IN')}, placing ₹${ctx.emergencySavings.toLocaleString('en-IN')} in emergency reserve, ₹${ctx.goalSavings.toLocaleString('en-IN')} in active goals, and keeping ₹${ctx.flexibleBuffer.toLocaleString('en-IN')} as flexible cash.`);
  }

  return parts.join(' ');
}

// ============================================================================
// FINANCIAL STATE CALCULATION (Wrapper)
// ============================================================================

export function calculateFinancialState({
  currentCash = 0,
  todayIncome = 1500,
  transactions = [],
  obligations = [],
  emergencyReserve = 1000,
  goals = [],
  essentialExpenses = 650,
  monthlyEssentialTarget = 15000
}) {
  const nonEssentialExpenses = transactions
    .filter(t => t.type === 'expense' && (!t.category || !['food', 'transport', 'rent', 'utilities', 'work_expense'].includes(t.category.toLowerCase())))
    .reduce((sum, t) => sum + t.amount, 0);

  const state = evaluateCanonicalState({
    todayIncome,
    essentialExpenses,
    nonEssentialExpenses,
    currentEmergencyReserve: emergencyReserve,
    monthlyEssentialTarget,
    transactions,
    obligations,
    goals
  });

  return {
    ...state,
    currentCash,
    minimumBuffer: calculateMinimumCashBuffer({
      essentialDailyBurn: 650,
      volatility: state.volatility.volatilityScore,
      upcomingObligations: calculateUpcomingObligations(obligations),
      emergencyReserve
    })
  };
}
