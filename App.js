import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from './src/theme/colors';
import { initialTransactions } from './src/data/sampleData';
import HomeScreen from './src/components/HomeScreen';
import TransactionsScreen from './src/components/TransactionsScreen';
import SummaryScreen from './src/components/SummaryScreen';
import AddTransactionModal from './src/components/AddTransactionModal';

const STORAGE_KEY = '@gigfinance_transactions_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'transactions' | 'summary'
  const [transactions, setTransactions] = useState(initialTransactions);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('income'); // 'income' | 'expense'

  // Load persisted transactions on startup (if any)
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData !== null) {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTransactions(parsed);
          }
        }
      } catch (e) {
        // Fallback gracefully to default sample data if storage fails
        console.log('AsyncStorage load fallback:', e);
      }
    };
    loadTransactions();
  }, []);

  // Persist transactions whenever they change
  const saveTransactions = async (newTxList) => {
    setTransactions(newTxList);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTxList));
    } catch (e) {
      console.log('AsyncStorage save error:', e);
    }
  };

  // Open Add Income modal
  const handleOpenAddIncome = () => {
    setModalType('income');
    setModalVisible(true);
  };

  // Open Add Expense modal
  const handleOpenAddExpense = () => {
    setModalType('expense');
    setModalVisible(true);
  };

  // Save new transaction handler
  const handleSaveTransaction = (newTx) => {
    // Prepend to list so newest appears at top
    const updated = [newTx, ...transactions];
    saveTransactions(updated);
    // Return to home screen
    setActiveTab('home');
  };

  // Reset demo data back to original sample data
  const handleResetSampleData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.log('Storage clear error:', e);
    }
    setTransactions(initialTransactions);
    setActiveTab('home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={colors.background} />

      {/* Main Screen Content */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen
            transactions={transactions}
            onOpenAddIncome={handleOpenAddIncome}
            onOpenAddExpense={handleOpenAddExpense}
            onViewAllTransactions={() => setActiveTab('transactions')}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsScreen transactions={transactions} />
        )}

        {activeTab === 'summary' && (
          <SummaryScreen
            transactions={transactions}
            onResetSampleData={handleResetSampleData}
          />
        )}
      </View>

      {/* Clean Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.navIconBox,
              activeTab === 'home' && styles.navIconBoxActive,
            ]}
          >
            <Text style={styles.navEmoji}>🏠</Text>
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'home' && styles.navLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Transactions Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('transactions')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.navIconBox,
              activeTab === 'transactions' && styles.navIconBoxActive,
            ]}
          >
            <Text style={styles.navEmoji}>📋</Text>
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'transactions' && styles.navLabelActive,
            ]}
          >
            Transactions
          </Text>
        </TouchableOpacity>

        {/* Summary Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('summary')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.navIconBox,
              activeTab === 'summary' && styles.navIconBoxActive,
            ]}
          >
            <Text style={styles.navEmoji}>📊</Text>
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'summary' && styles.navLabelActive,
            ]}
          >
            Summary
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        visible={modalVisible}
        type={modalType}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconBox: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
  },
  navIconBoxActive: {
    backgroundColor: colors.primaryLight,
  },
  navEmoji: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.inactiveTab,
    marginTop: 2,
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
