import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { formatCurrency } from '../data/sampleData';

export default function TransactionsScreen({ transactions }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'income' | 'expense'

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  return (
    <View style={styles.container}>
      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.title}>All Transactions</Text>
        <Text style={styles.subtitle}>
          {filteredTransactions.length}{' '}
          {filteredTransactions.length === 1 ? 'record' : 'records'} found
        </Text>

        {/* Filter Segmented Control */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'all' && styles.filterTabActive,
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive,
              ]}
            >
              All ({transactions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'income' && styles.filterTabActiveIncome,
            ]}
            onPress={() => setFilter('income')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'income' && styles.filterTextActiveIncome,
              ]}
            >
              + Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'expense' && styles.filterTabActiveExpense,
            ]}
            onPress={() => setFilter('expense')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'expense' && styles.filterTextActiveExpense,
              ]}
            >
              − Expense
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyTitle}>No transactions here</Text>
            <Text style={styles.emptySubtitle}>
              Tap "Add Income" or "Add Expense" to record a transaction.
            </Text>
          </View>
        ) : (
          filteredTransactions.map((tx) => {
            const isInc = tx.type === 'income';
            return (
              <View key={tx.id} style={styles.txCard}>
                <View style={styles.txMainRow}>
                  {/* Left: Category Icon and Info */}
                  <View style={styles.txLeft}>
                    <View
                      style={[
                        styles.iconBox,
                        {
                          backgroundColor: isInc
                            ? colors.incomeBg
                            : colors.expenseBg,
                        },
                      ]}
                    >
                      <Text style={styles.iconEmoji}>
                        {tx.icon || (isInc ? '💰' : '💸')}
                      </Text>
                    </View>

                    <View style={styles.detailsBox}>
                      <Text style={styles.txTitle}>
                        {tx.title || tx.category}
                      </Text>
                      <View style={styles.metaRow}>
                        <View
                          style={[
                            styles.typePill,
                            {
                              backgroundColor: isInc
                                ? colors.incomeBg
                                : colors.expenseBg,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.typePillText,
                              {
                                color: isInc
                                  ? colors.incomeText
                                  : colors.expenseText,
                              },
                            ]}
                          >
                            {isInc ? 'Income' : 'Expense'}
                          </Text>
                        </View>
                        <Text style={styles.txDate}>{tx.date}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Right: Amount */}
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
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterTabActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTabActiveIncome: {
    backgroundColor: colors.incomeBg,
  },
  filterTabActiveExpense: {
    backgroundColor: colors.expenseBg,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  filterTextActiveIncome: {
    color: colors.incomeText,
    fontWeight: '700',
  },
  filterTextActiveExpense: {
    color: colors.expenseText,
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  txCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  txMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 22,
  },
  detailsBox: {
    flex: 1,
  },
  txTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  typePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  txDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  txRight: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  txAmount: {
    fontSize: 17,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
