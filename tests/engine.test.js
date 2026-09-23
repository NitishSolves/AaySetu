/**
 * Automated Test Suite for ArthSetu Financial Engine
 */

import {
  calculateIncomeVolatility,
  calculateEmergencyRunway,
  evaluateCanonicalState,
  compareDecisionStates
} from '../web/js/engine.js';
import assert from 'node.assert/strict';

console.log('🧪 Running ArthSetu Financial Engine Tests...\n');

// 1. Core Rule: Remaining Money = Today's Income - Essential Expenses
console.log('Test 1: Core Financial Rule (Remaining Money)');
const state1 = evaluateCanonicalState({
  todayIncome: 1500,
  essentialExpenses: 650,
  nonEssentialExpenses: 0,
  currentEmergencyReserve: 15000,
  monthlyEssentialTarget: 15000,
  transactions: [
    { type: 'income', amount: 1500, date: '2026-09-22' },
    { type: 'income', amount: 1400, date: '2026-09-21' }
  ]
});

assert.equal(state1.todayIncome, 1500, "Today's income should be 1500");
assert.equal(state1.essentialExpenses, 650, "Essential expenses should be 650");
assert.equal(state1.remainingMoney, 850, "Remaining money must equal 1500 - 650 = 850");
console.log('✅ PASS: Remaining Money correctly calculated as ₹850');

// 2. Critical Safety Guardrail (Emergency Reserve Low)
console.log('\nTest 2: Emergency Safety Guardrail (Micro-Investment -> 0)');
const stateGuardrail = evaluateCanonicalState({
  todayIncome: 1200,
  essentialExpenses: 400,
  currentEmergencyReserve: 1000, // <30% of target
  monthlyEssentialTarget: 15000,
  transactions: []
});

assert.equal(stateGuardrail.guardrailActive, true, "Guardrail should trigger when emergency reserve is critical");
assert.equal(stateGuardrail.smartSplit.microInvestment, 0, "Micro-investment must be 0 when guardrail is active");
assert.ok(stateGuardrail.smartSplit.emergencySavings > 0, "Emergency savings should receive priority allocation");
console.log('✅ PASS: Guardrail active, Micro-Investment set to ₹0, Emergency prioritized');

// 3. Low Income Day (Remaining Money < 150)
console.log('\nTest 3: Low Income Day Guardrail');
const stateLowIncome = evaluateCanonicalState({
  todayIncome: 450,
  essentialExpenses: 400,
  currentEmergencyReserve: 12000,
  monthlyEssentialTarget: 15000,
  transactions: []
});

assert.equal(stateLowIncome.remainingMoney, 50, "Remaining money is 50");
assert.equal(stateLowIncome.smartSplit.microInvestment, 0, "Micro-investment must be 0 when remaining money is < 150");
console.log('✅ PASS: Low income day safely protects cash');

// 4. Volatility Calculation
console.log('\nTest 4: Income Volatility Analysis');
const sampleTx = [
  { type: 'income', amount: 2000, date: '2026-09-20' },
  { type: 'income', amount: 500, date: '2026-09-21' },
  { type: 'income', amount: 2500, date: '2026-09-22' }
];
const volatility = calculateIncomeVolatility(sampleTx);
assert.ok(volatility.ratio > 0, "Volatility ratio should be calculated");
assert.equal(volatility.score, 'high', "Score should be high for volatile daily amounts (500 to 2500)");
console.log(`✅ PASS: Volatility score calculated as ${volatility.score} (ratio: ${volatility.ratio})`);

// 5. Smart Split Conservation (Sum of split components == Safe-to-Allocate)
console.log('\nTest 5: Smart Split Sum Conservation');
const sumSplit = state1.smartSplit.emergencySavings +
  state1.smartSplit.goalSavings +
  state1.smartSplit.microInvestment +
  state1.smartSplit.flexibleBuffer;
assert.equal(sumSplit, state1.safeToAllocate, "Sum of split allocations must equal safeToAllocate");
console.log(`✅ PASS: Smart split sum (${sumSplit}) equals safeToAllocate (${state1.safeToAllocate})`);

// 6. Decision State Comparison ("Why did my investment change?")
console.log('\nTest 6: Decision State Comparison');
const comp = compareDecisionStates(state1, stateLowIncome);
assert.ok(comp.investChange < 0, "Investment change should be negative when comparing high to low income");
assert.ok(comp.reasons.length > 0, "Comparison must include reason strings");
console.log('✅ PASS: Decision comparison generated clean explanation summary');

console.log('\n🎉 ALL ENGINE TESTS PASSED SUCCESSFULLY!');
