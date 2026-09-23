import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { colors } from "../theme/colors";
import { calculateFinancialState } from "../engine/financial-engine";
import { formatCurrency } from "../data/sampleData";

const { width } = Dimensions.get("window");

export default function DashboardScreen({ transactions, onOpenSimulator }) {
  const financialState = useMemo(() => {
    // Calculate total by type
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
      essentialExpenses: Math.round(essentialExpenses),
      monthlyEssentialTarget: 15000,
    });
  }, [transactions]);

  const getSafetyColor = (score) => {
    if (score >= 70) return "#10B981"; // Green
    if (score >= 40) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  const getSafetyLabel = (score) => {
    if (score >= 70) return "Healthy";
    if (score >= 40) return "Caution";
    return "Critical";
  };

  const getStatusEmoji = (score) => {
    if (score >= 70) return "✅";
    if (score >= 40) return "⚠️";
    return "🚨";
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Financial Dashboard</Text>
        <Text style={styles.headerSubtitle}>Safe allocation for today</Text>
      </View>

      {/* Safe-to-Save Card - Main Hero */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroLabel}>💰 Safe-to-Save Today</Text>
          <Text style={styles.heroEmoji}>
            {getStatusEmoji(financialState.safetyScore)}
          </Text>
        </View>
        <Text style={styles.heroAmount}>
          {formatCurrency(financialState.safeToAllocate)}
        </Text>
        <Text style={styles.heroStatus}>
          Mode:{" "}
          <Text style={{ fontWeight: "800" }}>
            {financialState.smartSplit.emergencySavings > 0
              ? "Allocating"
              : "Preserving"}
          </Text>
        </Text>
      </View>

      {/* Financial Safety Score */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreLabel}>Financial Safety Score</Text>
          <View
            style={[
              styles.scoreBadge,
              {
                backgroundColor:
                  getSafetyColor(financialState.safetyScore) + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.scoreBadgeText,
                { color: getSafetyColor(financialState.safetyScore) },
              ]}
            >
              {financialState.safetyScore}/100
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(100, financialState.safetyScore)}%`,
                backgroundColor: getSafetyColor(financialState.safetyScore),
              },
            ]}
          />
        </View>

        <Text
          style={[
            styles.scoreStatus,
            { color: getSafetyColor(financialState.safetyScore) },
          ]}
        >
          {getSafetyLabel(financialState.safetyScore)}
        </Text>
      </View>

      {/* Income & Expenses Breakdown */}
      <View style={styles.breakdownGrid}>
        <View style={[styles.breakdownCard, styles.incomeCard]}>
          <Text style={styles.breakdownLabel}>Today's Income</Text>
          <Text style={styles.breakdownAmount}>
            {formatCurrency(financialState.todayIncome)}
          </Text>
          <Text style={styles.breakdownCompare}>
            {financialState.volatility.volatilityScore}% volatility
          </Text>
        </View>

        <View style={[styles.breakdownCard, styles.expensesCard]}>
          <Text style={styles.breakdownLabel}>Essential Expenses</Text>
          <Text style={styles.breakdownAmount}>
            {formatCurrency(financialState.essentialExpenses)}
          </Text>
          <Text style={styles.breakdownCompare}>
            {Math.round(
              (financialState.essentialExpenses / financialState.todayIncome) *
                100
            )}
            % of income
          </Text>
        </View>

        <View style={[styles.breakdownCard, styles.remainingCard]}>
          <Text style={styles.breakdownLabel}>Remaining Money</Text>
          <Text style={styles.breakdownAmount}>
            {formatCurrency(financialState.remainingMoney)}
          </Text>
          <Text style={styles.breakdownCompare}>After essentials</Text>
        </View>

        <View style={[styles.breakdownCard, styles.emergencyCard]}>
          <Text style={styles.breakdownLabel}>Emergency Buffer</Text>
          <Text style={styles.breakdownAmount}>
            {financialState.emergency.daysCovered}d
          </Text>
          <Text style={styles.breakdownCompare}>
            {financialState.emergency.status}
          </Text>
        </View>
      </View>

      {/* Dynamic Allocation Card */}
      <View style={styles.allocationCard}>
        <View style={styles.allocationHeader}>
          <Text style={styles.allocationTitle}>🎯 Recommended Allocation</Text>
          <Text style={styles.allocationTotal}>
            Total: {formatCurrency(financialState.safeToAllocate)}
          </Text>
        </View>

        {financialState.guardrailActive ? (
          <View style={styles.guardrailBox}>
            <Text style={styles.guardrailIcon}>⚠️</Text>
            <Text style={styles.guardrailText}>
              {financialState.guardrailReason}
            </Text>
          </View>
        ) : (
          <>
            {/* Emergency Savings */}
            <View style={styles.allocationRow}>
              <View style={styles.allocationLeftContent}>
                <Text style={styles.allocationLabel}>🏦 Emergency Reserve</Text>
                <Text style={styles.allocationPercent}>
                  {Math.round(
                    (financialState.smartSplit.emergencySavings /
                      financialState.safeToAllocate) *
                      100
                  ) || 0}
                  %
                </Text>
              </View>
              <Text style={styles.allocationValue}>
                {formatCurrency(financialState.smartSplit.emergencySavings)}
              </Text>
            </View>

            {/* Goal Savings */}
            {financialState.smartSplit.goalSavings > 0 && (
              <View style={styles.allocationRow}>
                <View style={styles.allocationLeftContent}>
                  <Text style={styles.allocationLabel}>🎯 Goal Savings</Text>
                  <Text style={styles.allocationPercent}>
                    {Math.round(
                      (financialState.smartSplit.goalSavings /
                        financialState.safeToAllocate) *
                        100
                    )}
                    %
                  </Text>
                </View>
                <Text style={styles.allocationValue}>
                  {formatCurrency(financialState.smartSplit.goalSavings)}
                </Text>
              </View>
            )}

            {/* Micro Investment */}
            {financialState.smartSplit.microInvestment > 0 && (
              <View style={styles.allocationRow}>
                <View style={styles.allocationLeftContent}>
                  <Text style={styles.allocationLabel}>
                    💼 Micro Investment
                  </Text>
                  <Text style={styles.allocationPercent}>
                    {Math.round(
                      (financialState.smartSplit.microInvestment /
                        financialState.safeToAllocate) *
                        100
                    )}
                    %
                  </Text>
                </View>
                <Text style={styles.allocationValue}>
                  {formatCurrency(financialState.smartSplit.microInvestment)}
                </Text>
              </View>
            )}

            {/* Flexible Buffer */}
            {financialState.smartSplit.flexibleBuffer > 0 && (
              <View style={styles.allocationRow}>
                <View style={styles.allocationLeftContent}>
                  <Text style={styles.allocationLabel}>💳 Flexible Buffer</Text>
                  <Text style={styles.allocationPercent}>
                    {Math.round(
                      (financialState.smartSplit.flexibleBuffer /
                        financialState.safeToAllocate) *
                        100
                    ) || 0}
                    %
                  </Text>
                </View>
                <Text style={styles.allocationValue}>
                  {formatCurrency(financialState.smartSplit.flexibleBuffer)}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* AI Explanation */}
      <View style={styles.explanationCard}>
        <Text style={styles.explanationTitle}>🤖 AI Explanation</Text>
        <Text style={styles.explanationText}>
          {financialState.aiExplanation}
        </Text>
      </View>

      {/* Simulator CTA */}
      <TouchableOpacity
        style={styles.simulatorButton}
        onPress={onOpenSimulator}
      >
        <Text style={styles.simulatorButtonText}>
          📊 Open What-If Simulator
        </Text>
      </TouchableOpacity>

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
  heroCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heroEmoji: {
    fontSize: 24,
  },
  heroAmount: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1,
    marginBottom: 8,
  },
  heroStatus: {
    fontSize: 13,
    color: "#38BDF8",
    fontWeight: "500",
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  scoreStatus: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  breakdownGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  breakdownCard: {
    width: (width - 40) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  expensesCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  remainingCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  emergencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  breakdownLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  breakdownAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  breakdownCompare: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  allocationCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  allocationHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  allocationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  allocationTotal: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  guardrailBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  guardrailIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  guardrailText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#78350F",
    lineHeight: 18,
  },
  allocationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  allocationLeftContent: {
    flex: 1,
  },
  allocationLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  allocationPercent: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  allocationValue: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primary,
  },
  explanationCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
    lineHeight: 20,
  },
  simulatorButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  simulatorButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
