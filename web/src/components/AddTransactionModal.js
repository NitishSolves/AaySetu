import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import {
  INCOME_SOURCES,
  EXPENSE_CATEGORIES,
  getTodayFormattedDate,
} from '../data/sampleData';

export default function AddTransactionModal({
  visible,
  type, // 'income' | 'expense'
  onClose,
  onSave,
}) {
  const isIncome = type === 'income';
  const categories = isIncome ? INCOME_SOURCES : EXPENSE_CATEGORIES;

  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || '');
  const [customName, setCustomName] = useState('');
  const [date, setDate] = useState(getTodayFormattedDate());

  // Reset form whenever modal opens or type changes
  useEffect(() => {
    if (visible) {
      setAmount('');
      setSelectedCategory(categories[0]?.name || '');
      setCustomName('');
      setDate(getTodayFormattedDate());
    }
  }, [visible, type]);

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    const categoryObj = categories.find((c) => c.name === selectedCategory);
    let title = selectedCategory;
    let icon = categoryObj ? categoryObj.icon : (isIncome ? '💰' : '💸');

    if (selectedCategory === 'Other' && customName.trim().length > 0) {
      title = customName.trim();
    }

    const newTransaction = {
      id: 'tx-' + Date.now(),
      type: type,
      title: title,
      category: title,
      amount: parsedAmount,
      date: date.trim() || getTodayFormattedDate(),
      icon: icon,
      timestamp: Date.now(),
    };

    onSave(newTransaction);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isIncome ? colors.incomeBg : colors.expenseBg },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: isIncome ? colors.incomeText : colors.expenseText },
                  ]}
                >
                  {isIncome ? '+ INCOME' : '− EXPENSE'}
                </Text>
              </View>
              <Text style={styles.headerTitle}>
                {isIncome ? 'Add New Income' : 'Add New Expense'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
            {/* Amount Input */}
            <Text style={styles.fieldLabel}>Amount (₹)</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                autoFocus={false}
              />
            </View>

            {/* Category / Source Selection */}
            <Text style={styles.fieldLabel}>
              {isIncome ? 'Select Source' : 'Select Category'}
            </Text>
            <View style={styles.chipsContainer}>
              {categories.map((item) => {
                const isSelected = selectedCategory === item.name;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.chip,
                      isSelected && {
                        backgroundColor: isIncome ? colors.incomeBg : colors.expenseBg,
                        borderColor: isIncome ? colors.income : colors.expense,
                      },
                    ]}
                    onPress={() => setSelectedCategory(item.name)}
                  >
                    <Text style={styles.chipIcon}>{item.icon}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && {
                          color: isIncome ? colors.incomeText : colors.expenseText,
                          fontWeight: '700',
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Name if 'Other' is selected */}
            {selectedCategory === 'Other' && (
              <View style={styles.customNameContainer}>
                <Text style={styles.fieldLabel}>Custom Description</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Bonus, Tips, Toll"
                  placeholderTextColor={colors.textMuted}
                  value={customName}
                  onChangeText={setCustomName}
                />
              </View>
            )}

            {/* Date Input */}
            <Text style={styles.fieldLabel}>Date</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 15 Sep 2026"
              placeholderTextColor={colors.textMuted}
              value={date}
              onChangeText={setDate}
            />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: isIncome ? colors.income : colors.expense },
              ]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                {isIncome ? 'Save Income' : 'Save Expense'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    fontSize: 20,
    color: colors.textSecondary,
    padding: 4,
  },
  formScroll: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currencySymbol: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    padding: 0,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chipIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  customNameContainer: {
    marginTop: 6,
  },
  textInput: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveButton: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
