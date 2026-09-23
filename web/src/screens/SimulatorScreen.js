import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import { colors } from "../theme/colors";
import {
  calculateFinancialState,
  compareDecisionStates,
} from "../engine/financial-engine";
import { formatCurrency } from "../data/sampleData";

const { width } = Dimensions.get("window");

export default function SimulatorScreen({ transactions }) {
  const [scenarioIncome, setScenarioIncome] = useState("1500");
  const [scenarioExpense, setScenarioExpense] = useState("650");
  const [showComparison, setShowComparison] = useState(false);

  // Calculate baseline state
  const baselineState = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const essentialExpenses = expenses
      .filter(
        (t) =>
          t.category &&
          ["food", "transport", "rent", "utilities", "work_expense"].includes(
            t.category.toLowerCase()
          )
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return calculateFinancialState({
      currentCash: 5000,
      todayIncome: 1500,
      transactions,
      obligations: [],
      emergencyReserve: 8500,
      goals: [],
      essentialExpenses: Math.round(essentialExpenses) || 650,
      monthlyEssentialTarget: 15000,
    });
  }, [transactions]);

  // Calculate scenario state
  const scenarioState = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const essentialExpenses = expenses
      .filter(
        (t) =>
          t.category &&
          ["food", "transport", "rent", "utilities", "work_expense"].includes(
            t.category.toLowerCase()
          )
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return calculateFinancialState({
      currentCash: 5000,
      todayIncome: Number(scenarioIncome) || 1500,
      transactions,
      obligations: [],
      emergencyReserve: 8500,
      goals: [],
      essentialExpenses:
        Number(scenarioExpense) || Math.round(essentialExpenses) || 650,
      monthlyEssentialTarget: 15000,
    });
  }, [transactions, scenarioIncome, scenarioExpense]);

  const comparison = useMemo(() => {
    return compareDecisionStates(baselineState, scenarioState);
  }, [baselineState, scenarioState]);

  const handleReset = () => {
    setScenarioIncome("1500");
    setScenarioExpense("650");
    setShowComparison(false);
  };

  const getSafetyColor = (score) => {
    if (score >= 70) return "#10B981";
    if (score >= 40) return "#F59E0B";
    return "#EF4444";
  };

  const getChangeColor = (change) => {
    if (change > 0) return "#10B981";
    if (change < 0) return "#EF4444";
    return colors.textSecondary;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>What-If Simulator</Text>
        <Text style={styles.headerSubtitle}>Explore financial scenarios</Text>
      </View>

      {/* Input Controls */}
      <View style={styles.controlCard}>
        <Text style={styles.controlTitle}>Adjust Your Scenario</Text>

        {/* Income Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Daily Income (₹)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>₹</Text>
            <TextInput
              style={styles.textInput}
              value={scenarioIncome}
              onChangeText={setScenarioIncome}
              keyboardType="number-pad"
              placeholder="1500"
            />
          </View>
          <Text style={styles.inputHint}>
            Baseline: ₹{formatCurrency(baselineState.todayIncome)} → Change:{" "}
            {Number(scenarioIncome) - baselineState.todayIncome > 0 ? "+" : ""}
            {formatCurrency(Number(scenarioIncome) - baselineState.todayIncome)}
          </Text>
        </View>

        {/* Expense Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Essential Expenses (₹)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>₹</Text>
            <TextInput
              style={styles.textInput}
              value={scenarioExpense}
              onChangeText={setScenarioExpense}
              keyboardType="number-pad"
              placeholder="650"
            />
          </View>
          <Text style={styles.inputHint}>
            Baseline: ₹{formatCurrency(baselineState.essentialExpenses)} →
            Change:{" "}
            {Number(scenarioExpense) - baselineState.essentialExpenses > 0
              ? "+"
              : ""}
            {formatCurrency(
              Number(scenarioExpense) - baselineState.essentialExpenses
            )}
          </Text>
        </View>

        {/* Preset Scenarios */}
        <Text style={styles.presetsTitle}>Quick Presets</Text>
        <View style={styles.presetsGrid}>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              setScenarioIncome("800");
              setScenarioExpense("750");
            }}
          >
            <Text style={styles.presetEmoji}>😰</Text>
            <Text style={styles.presetLabel}>Bad Day</Text>
            <Text style={styles.presetValue}>₹800 income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              setScenarioIncome("2000");
              setScenarioExpense("650");
            }}
          >
            <Text style={styles.presetEmoji}>😊</Text>
            <Text style={styles.presetLabel}>Good Day</Text>
            <Text style={styles.presetValue}>₹2000 income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              setScenarioIncome("3000");
              setScenarioExpense("650");
            }}
          >
            <Text style={styles.presetEmoji}>🚀</Text>
            <Text style={styles.presetLabel}>Surge</Text>
            <Text style={styles.presetValue}>₹3000 income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              setScenarioIncome("1500");
              setScenarioExpense("1200");
            }}
          >
            <Text style={styles.presetEmoji}>💥</Text>
            <Text style={styles.presetLabel}>Expense Shock</Text>
            <Text style={styles.presetValue}>₹1200 expenses</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Comparison Section */}
      <View style={styles.comparisonCard}>
        <Text style={styles.comparisonTitle}>
          📊 Comparison: Baseline vs Scenario
        </Text>

        {/* Side by Side Comparison */}
        <View style={styles.comparisonRow}>
          {/* Baseline Column */}
          <View style={styles.comparisonColumn}>
            <Text style={styles.columnLabel}>Baseline</Text>
            <Text style={styles.columnValue}>
              {formatCurrency(baselineState.safeToAllocate)}
            </Text>
            <Text style={styles.columnSubtext}>Safe-to-Save</Text>
            <View
              style={[
                styles.scoreIndicator,
                {
                  backgroundColor:
                    getSafetyColor(baselineState.safetyScore) + "40",
                },
              ]}
            >
              <Text
                style={[
                  styles.scoreIndicatorText,
                  { color: getSafetyColor(baselineState.safetyScore) },
                ]}
              >
                {baselineState.safetyScore}
              </Text>
            </View>
          </View>

          {/* Change Arrow */}
          <View style={styles.comparisonArrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>

          {/* Scenario Column */}
          <View style={styles.comparisonColumn}>
            <Text style={styles.columnLabel}>Scenario</Text>
            <Text style={styles.columnValue}>
              {formatCurrency(scenarioState.safeToAllocate)}
            </Text>
            <Text style={styles.columnSubtext}>Safe-to-Save</Text>
            <View
              style={[
                styles.scoreIndicator,
                {
                  backgroundColor:
                    getSafetyColor(scenarioState.safetyScore) + "40",
                },
              ]}
            >
              <Text
                style={[
                  styles.scoreIndicatorText,
                  { color: getSafetyColor(scenarioState.safetyScore) },
                ]}
              >
                {scenarioState.safetyScore}
              </Text>
            </View>
          </View>
        </View>

        {/* Comparison Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Safe-to-Save Change</Text>
            <Text
              style={[
                styles.statValue,
                { color: getChangeColor(comparison.safeChange) },
              ]}
            >
              {comparison.safeChange > 0 ? "+" : ""}
              {formatCurrency(comparison.safeChange)}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Investment Change</Text>
            <Text
              style={[
                styles.statValue,
                { color: getChangeColor(comparison.investChange) },
              ]}
            >
              {comparison.investChange > 0 ? "+" : ""}
              {formatCurrency(comparison.investChange)}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Income Change</Text>
            <Text
              style={[
                styles.statValue,
                { color: getChangeColor(comparison.incomeChange) },
              ]}
            >
              {comparison.incomeChange > 0 ? "+" : ""}
              {formatCurrency(comparison.incomeChange)}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Expense Change</Text>
            <Text
              style={[
                styles.statValue,
                {
                  color: getChangeColor(
                    -(Number(scenarioExpense) - baselineState.essentialExpenses)
                  ),
                },
              ]}
            >
              {Number(scenarioExpense) - baselineState.essentialExpenses > 0
                ? "+"
                : ""}
              {formatCurrency(
                Number(scenarioExpense) - baselineState.essentialExpenses
              )}
            </Text>
          </View>
        </View>
      </View>

      {/* Detailed Scenario Breakdown */}
      <View style={styles.breakdownCard}>
        <Text style={styles.breakdownTitle}>Scenario Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Daily Income</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(scenarioState.todayIncome)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Essential Expenses</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(scenarioState.essentialExpenses)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Remaining Money</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(scenarioState.remainingMoney)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Safe-to-Allocate</Text>
          <Text style={[styles.detailValue, { color: colors.primary }]}>
            {formatCurrency(scenarioState.safeToAllocate)}
          </Text>
        </View>

        {!scenarioState.guardrailActive && (
          <>
            <View style={styles.divider} />
            <Text style={styles.allocationSubtitle}>Allocation Breakdown</Text>

            <View style={styles.allocationDetail}>
              <Text style={styles.allocationLabel}>🏦 Emergency Reserve</Text>
              <Text style={styles.allocationDetailValue}>
                {formatCurrency(scenarioState.smartSplit.emergencySavings)}
              </Text>
            </View>

            <View style={styles.allocationDetail}>
              <Text style={styles.allocationLabel}>🎯 Goal Savings</Text>
              <Text style={styles.allocationDetailValue}>
                {formatCurrency(scenarioState.smartSplit.goalSavings)}
              </Text>
            </View>

            <View style={styles.allocationDetail}>
              <Text style={styles.allocationLabel}>💼 Micro Investment</Text>
              <Text style={styles.allocationDetailValue}>
                {formatCurrency(scenarioState.smartSplit.microInvestment)}
              </Text>
            </View>

            <View style={styles.allocationDetail}>
              <Text style={styles.allocationLabel}>💳 Flexible Buffer</Text>
              <Text style={styles.allocationDetailValue}>
                {formatCurrency(scenarioState.smartSplit.flexibleBuffer)}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>↻ Reset Scenario</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setShowComparison(!showComparison)}
        >
          <Text style={styles.saveButtonText}>✓ Apply Scenario</Text>
        </TouchableOpacity>
      </View>

      {/* Spacer */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  controlCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  inputHint: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  presetsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 10,
  },
  presetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  presetButton: {
    width: (width - 52) / 2,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  presetValue: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  comparisonCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  comparisonColumn: {
    flex: 1,
    alignItems: "center",
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  columnValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  columnSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 6,
  },
  scoreIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreIndicatorText: {
    fontSize: 18,
    fontWeight: "800",
  },
  comparisonArrow: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  allocationSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  allocationDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  allocationLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  allocationDetailValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

