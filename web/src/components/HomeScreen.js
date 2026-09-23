import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { formatCurrency, calculateTotals } from '../data/sampleData';

export default function HomeScreen({
  transactions,
  onOpenAddIncome,
  onOpenAddExpense,
  onViewAllTransactions,
}) {
  const { totalEarnings, totalExpenses, netIncome } = calculateTotals(transactions);
  const recentTransactions = transactions.slice(0, 4);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Banner */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>PROTOTYPE</Text>
        </View>
        <Text style={styles.appTitle}>GigFinance</Text>
        <Text style={styles.appSubtitle}>Finance Tracker for Gig Workers</Text>
      </View>

      {/* 3 Financial Cards */}
      <View style={styles.cardsGrid}>
        {/* Net Income Card (Primary Highlight) */}
        <View style={[styles.card, styles.netIncomeCard]}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.netIncomeLabel}>Net Income (Savings)</Text>
            <Text style={styles.cardIcon}>💼</Text>
          </View>
          <Text style={styles.netIncomeAmount}>{formatCurrency(netIncome)}</Text>
          <Text style={styles.cardSubtext}>
            {netIncome >= 0 ? 'Surplus cash in hand' : 'Expenses exceed earnings'}
          </Text>
        </View>

        {/* Total Earnings & Total Expenses Row */}
        <View style={styles.dualCardsRow}>
          {/* Total Earnings */}
          <View style={[styles.miniCard, styles.earningsCard]}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.miniCardLabel}>Total Earnings</Text>
              <Text style={styles.miniCardIcon}>📈</Text>
            </View>
            <Text style={[styles.miniCardAmount, { color: colors.income }]}>
              {formatCurrency(totalEarnings)}
            </Text>
            <View style={styles.cardTagGreen}>
              <Text style={styles.cardTagTextGreen}>+ Inflow</Text>
            </View>
          </View>

          {/* Total Expenses */}
          <View style={[styles.miniCard, styles.expensesCard]}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.miniCardLabel}>Total Expenses</Text>
              <Text style={styles.miniCardIcon}>📉</Text>
            </View>
            <Text style={[styles.miniCardAmount, { color: colors.expense }]}>
              {formatCurrency(totalExpenses)}
            </Text>
            <View style={styles.cardTagRed}>
              <Text style={styles.cardTagTextRed}>− Outflow</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Two Large Action Buttons */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={[styles.bigButton, styles.incomeButton]}
          onPress={onOpenAddIncome}
          activeOpacity={0.8}
        >
          <Text style={styles.bigButtonIcon}>+</Text>
          <View>
            <Text style={styles.bigButtonTitle}>Add Income</Text>
            <Text style={styles.bigButtonSubtitle}>Swiggy, Uber, etc.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bigButton, styles.expenseButton]}
          onPress={onOpenAddExpense}
          activeOpacity={0.8}
        >
          <Text style={styles.bigButtonIcon}>−</Text>
          <View>
            <Text style={styles.bigButtonTitle}>Add Expense</Text>
            <Text style={styles.bigButtonSubtitle}>Fuel, Food, etc.</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions Section */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={onViewAllTransactions}>
            <Text style={styles.seeAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🧾</Text>
            <Text style={styles.emptyStateText}>No transactions recorded yet.</Text>
          </View>
        ) : (
          recentTransactions.map((tx) => {
            const isInc = tx.type === 'income';
            return (
              <View key={tx.id} style={styles.transactionRow}>
                <View style={styles.txLeft}>
                  <View
                    style={[
                      styles.txIconContainer,
                      { backgroundColor: isInc ? colors.incomeBg : colors.expenseBg },
                    ]}
                  >
                    <Text style={styles.txEmoji}>{tx.icon || (isInc ? '🍔' : '⛽')}</Text>
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txTitle}>{tx.title || tx.category}</Text>
                    <Text style={styles.txDate}>{tx.date}</Text>
                  </View>
                </View>
                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: isInc ? colors.income : colors.expense },
                    ]}
                  >
                    {isInc ? '+ ' : '− '}
                    {formatCurrency(tx.amount)}
                  </Text>
                  <Text style={styles.txTypeLabel}>
                    {isInc ? 'Income' : 'Expense'}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
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
    marginBottom: 16,
  },
  headerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardsGrid: {
    marginBottom: 18,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  netIncomeCard: {
    backgroundColor: '#0F172A', // Premium dark contrast card
    borderColor: '#1E293B',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  netIncomeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cardIcon: {
    fontSize: 20,
  },
  netIncomeAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  cardSubtext: {
    fontSize: 12,
    color: '#38BDF8',
    marginTop: 4,
    fontWeight: '500',
  },
  dualCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  earningsCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.income,
  },
  expensesCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.expense,
  },
  miniCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  miniCardIcon: {
    fontSize: 14,
  },
  miniCardAmount: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  cardTagGreen: {
    alignSelf: 'flex-start',
    backgroundColor: colors.incomeBg,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
  },
  cardTagTextGreen: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.incomeText,
  },
  cardTagRed: {
    alignSelf: 'flex-start',
    backgroundColor: colors.expenseBg,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
  },
  cardTagTextRed: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.expenseText,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  bigButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incomeButton: {
    backgroundColor: colors.income,
  },
  expenseButton: {
    backgroundColor: colors.expense,
  },
  bigButtonIcon: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 10,
  },
  bigButtonTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bigButtonSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },
  recentSection: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceAlt,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  txIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txEmoji: {
    fontSize: 20,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  txDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800',
  },
  txTypeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
