import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import {
  formatCurrency,
  calculateTotals,
  getExpenseBreakdown,
  getIncomeBreakdown,
} from '../data/sampleData';

export default function SummaryScreen({ transactions, onResetSampleData }) {
  const { totalEarnings, totalExpenses, netIncome } = calculateTotals(transactions);
  const expenseBreakdown = getExpenseBreakdown(transactions);
  const incomeBreakdown = getIncomeBreakdown(transactions);

  // Compute savings rate
  const savingsRate =
    totalEarnings > 0 ? Math.round((netIncome / totalEarnings) * 100) : 0;

  const handleReset = () => {
    Alert.alert(
      'Reset Demo Data',
      'This will reset all data back to the default sample transactions (Total: ₹8,500 Earnings, ₹2,300 Expenses). Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: onResetSampleData },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Financial Summary</Text>
        <Text style={styles.subtitle}>Overview of earnings & expenditures</Text>
      </View>

      {/* Net Income Banner Card */}
      <View style={styles.netSummaryCard}>
        <View style={styles.netHeaderRow}>
          <Text style={styles.netCardLabel}>Net Cash Retained</Text>
          <View style={styles.savingsRateBadge}>
            <Text style={styles.savingsRateText}>{savingsRate}% Saved</Text>
          </View>
        </View>
        <Text style={styles.netAmount}>{formatCurrency(netIncome)}</Text>
        <Text style={styles.netDetail}>
          Calculated as: Total Earnings ({formatCurrency(totalEarnings)}) − Total Expenses ({formatCurrency(totalExpenses)})
        </Text>
      </View>

      {/* Metric Cards Row */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { borderTopColor: colors.income }]}>
          <Text style={styles.metricLabel}>Total Earnings</Text>
          <Text style={[styles.metricValue, { color: colors.income }]}>
            {formatCurrency(totalEarnings)}
          </Text>
        </View>

        <View style={[styles.metricCard, { borderTopColor: colors.expense }]}>
          <Text style={styles.metricLabel}>Total Expenses</Text>
          <Text style={[styles.metricValue, { color: colors.expense }]}>
            {formatCurrency(totalExpenses)}
          </Text>
        </View>
      </View>

      {/* Expense Breakdown Card */}
      <View style={styles.breakdownCard}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.breakdownTitle}>Expense Breakdown</Text>
          <Text style={styles.categoryCount}>
            {expenseBreakdown.length} Categories
          </Text>
        </View>
        <Text style={styles.breakdownSubtitle}>
          Where your hard-earned money went
        </Text>

        {expenseBreakdown.length === 0 ? (
          <Text style={styles.emptyText}>No expenses logged yet.</Text>
        ) : (
          expenseBreakdown.map((item, index) => (
            <View key={item.name} style={styles.breakdownItem}>
              <View style={styles.itemTopRow}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemEmoji}>{item.icon}</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemAmount}>
                    {formatCurrency(item.amount)}
                  </Text>
                  <Text style={styles.itemPercent}>({item.percentage}%)</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(item.percentage, 100)}%`,
                      backgroundColor:
                        index === 0
                          ? '#DC2626'
                          : index === 1
                          ? '#F97316'
                          : index === 2
                          ? '#FBBF24'
                          : '#64748B',
                    },
                  ]}
                />
              </View>
            </View>
          ))
        )}
      </View>

      {/* Income Sources Breakdown Card */}
      <View style={styles.breakdownCard}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.breakdownTitle}>Income by Source</Text>
          <Text style={styles.categoryCount}>
            {incomeBreakdown.length} Sources
          </Text>
        </View>
        <Text style={styles.breakdownSubtitle}>
          Distribution of gig earnings
        </Text>

        {incomeBreakdown.length === 0 ? (
          <Text style={styles.emptyText}>No income logged yet.</Text>
        ) : (
          incomeBreakdown.map((item, index) => (
            <View key={item.name} style={styles.breakdownItem}>
              <View style={styles.itemTopRow}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemEmoji}>{item.icon}</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemAmountIncome}>
                    {formatCurrency(item.amount)}
                  </Text>
                  <Text style={styles.itemPercent}>({item.percentage}%)</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(item.percentage, 100)}%`,
                      backgroundColor:
                        index === 0
                          ? '#16A34A'
                          : index === 1
                          ? '#0D9488'
                          : index === 2
                          ? '#2563EB'
                          : '#6366F1',
                    },
                  ]}
                />
              </View>
            </View>
          ))
        )}
      </View>

      {/* Reset Demo Data Button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetIcon}>🔄</Text>
        <Text style={styles.resetButtonText}>Reset to College Sample Data</Text>
      </TouchableOpacity>
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
    paddingBottom: 36,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  netSummaryCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  netHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  netCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  savingsRateBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  savingsRateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  netAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  netDetail: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  breakdownSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 14,
  },
  breakdownItem: {
    marginBottom: 12,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.expense,
  },
  itemAmountIncome: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.income,
  },
  itemPercent: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    paddingVertical: 10,
    fontStyle: 'italic',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 6,
    gap: 8,
  },
  resetIcon: {
    fontSize: 16,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
