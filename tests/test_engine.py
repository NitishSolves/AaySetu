"""
ArthSetu Financial Engine Verification Test Suite (Python Validation)
"""
import math

def calculate_income_volatility(daily_incomes):
    if not daily_incomes:
        return {'ratio': 0.2, 'score': 'moderate', 'average': 1200}
    avg = sum(daily_incomes) / len(daily_incomes)
    if len(daily_incomes) == 1:
        return {'ratio': 0.15, 'score': 'low', 'average': avg}
    variance = sum((x - avg) ** 2 for x in daily_incomes) / len(daily_incomes)
    std_dev = math.sqrt(variance)
    ratio = std_dev / avg if avg > 0 else 0.5
    score = 'high' if ratio > 0.35 else ('moderate' if ratio > 0.18 else 'low')
    return {'ratio': round(ratio, 2), 'score': score, 'average': round(avg)}

def evaluate_canonical_state(today_income, essential_expenses, emergency_reserve, monthly_target, daily_incomes):
    remaining_money = max(0, today_income - essential_expenses)
    volatility = calculate_income_volatility(daily_incomes)
    
    target_reserve = monthly_target * 3
    progress_ratio = emergency_reserve / target_reserve if target_reserve > 0 else 0
    emergency_status = 'critical' if progress_ratio < 0.3 else ('building' if progress_ratio < 0.75 else 'healthy')
    
    # Safety Factor
    safety_factor = 0.65
    if emergency_status == 'critical':
        safety_factor -= 0.20
    if volatility['score'] == 'high':
        safety_factor -= 0.15
    if volatility['score'] == 'low':
        safety_factor += 0.10
    if today_income < volatility['average'] * 0.7:
        safety_factor -= 0.15
    elif today_income > volatility['average'] * 1.3:
        safety_factor += 0.10
        
    safety_factor = min(0.85, max(0.15, safety_factor))
    safe_to_allocate = round(remaining_money * safety_factor)
    
    guardrail_active = False
    guardrail_reason = ""
    
    if safe_to_allocate <= 0:
        guardrail_active = True
        guardrail_reason = "Insufficient surplus"
        micro_investment = 0
        emergency_savings = 0
        goal_savings = 0
        flexible_buffer = 0
    else:
        if emergency_status == 'critical' or remaining_money < 150:
            guardrail_active = True
            guardrail_reason = "Emergency reserve critical or remaining money minimal"
            micro_investment = 0
            emergency_savings = round(safe_to_allocate * 0.75)
            goal_savings = round(safe_to_allocate * 0.15)
            flexible_buffer = max(0, safe_to_allocate - (emergency_savings + goal_savings))
        else:
            emergency_savings = round(safe_to_allocate * 0.30)
            goal_savings = round(safe_to_allocate * 0.30)
            micro_investment = round(safe_to_allocate * 0.25)
            flexible_buffer = max(0, safe_to_allocate - (emergency_savings + goal_savings + micro_investment))
            
    return {
        'today_income': today_income,
        'essential_expenses': essential_expenses,
        'remaining_money': remaining_money,
        'safe_to_allocate': safe_to_allocate,
        'emergency_savings': emergency_savings,
        'goal_savings': goal_savings,
        'micro_investment': micro_investment,
        'flexible_buffer': flexible_buffer,
        'guardrail_active': guardrail_active,
        'guardrail_reason': guardrail_reason,
        'emergency_status': emergency_status,
        'volatility': volatility
    }

def run_tests():
    print("🧪 Running ArthSetu Financial Engine Python Verification...\n")
    
    # 1. Remaining money test
    res1 = evaluate_canonical_state(1500, 650, 15000, 15000, [1500, 1400])
    assert res1['remaining_money'] == 850, f"Expected 850, got {res1['remaining_money']}"
    print("✅ PASS: Remaining Money = 1500 - 650 = ₹850")
    
    # 2. Guardrail test (low emergency reserve)
    res2 = evaluate_canonical_state(1200, 400, 1000, 15000, [1200, 1300])
    assert res2['guardrail_active'] == True, "Guardrail should activate"
    assert res2['micro_investment'] == 0, "Micro-investment should be 0"
    print("✅ PASS: Guardrail active, Micro-investment set to ₹0")
    
    # 3. Sum conservation
    split_sum = res1['emergency_savings'] + res1['goal_savings'] + res1['micro_investment'] + res1['flexible_buffer']
    assert split_sum == res1['safe_to_allocate'], f"Sum {split_sum} != SafeToAllocate {res1['safe_to_allocate']}"
    print(f"✅ PASS: Split sum ({split_sum}) equals Safe to Allocate ({res1['safe_to_allocate']})")
    
    print("\n🎉 ALL PYTHON ENGINE VERIFICATION TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    run_tests()
