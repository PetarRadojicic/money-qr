import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Transaction } from '../types';
import { loadTransactionHistory, revertTransaction } from '../utils/dataManager';
import { formatCurrency } from '../constants/currencies';
import { useTranslation } from '../contexts/TranslationContext';

interface HistoryScreenProps {
  onNavigateHome: () => void;
  onNavigateSettings: () => void;
  onDataChange: () => void;
  currency?: string;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ 
  onNavigateHome, 
  onNavigateSettings,
  onDataChange, 
  currency = 'USD'
}) => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const history = await loadTransactionHistory();
      setTransactions(history.transactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const handleRevertTransaction = async (transaction: Transaction) => {
    if (transaction.isReverted) {
      Alert.alert(t('alreadyReverted'), t('alreadyRevertedMessage'));
      return;
    }

    const transactionType = transaction.type === 'income' ? 'income' : 'expense';
    const actionText = transactionType === 'income' ? t('removeThisIncome') : t('removeThisExpense');

    Alert.alert(
      t('revertTransaction'),
      `${t('areYouSureRevert')} ${actionText}?\n\n${transaction.categoryName}: ${formatCurrency(transaction.amount, currency)}\nDate: ${formatDate(transaction.date)}`,
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('revert'),
          style: 'destructive',
          onPress: async () => {
            const success = await revertTransaction(transaction.id);
            if (success) {
              Alert.alert(t('success'), t('transactionReverted'));
              await loadTransactions();
              onDataChange(); // Refresh home screen data
            } else {
              Alert.alert(t('error'), t('failedToRevert'));
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.isReverted) {
      return <Ionicons name="close-circle" size={24} color="#ef4444" />;
    }
    if (transaction.type === 'income') {
      return <Ionicons name="add-circle" size={24} color="#16a34a" />;
    }
    return <Ionicons name="remove-circle" size={24} color="#dc2626" />;
  };

  const getTransactionColor = (transaction: Transaction) => {
    if (transaction.isReverted) {
      return 'text-gray-500';
    }
    if (transaction.type === 'income') {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const getAmountPrefix = (transaction: Transaction) => {
    if (transaction.isReverted) {
      return '';
    }
    if (transaction.type === 'income') {
      return '+';
    }
    return '-';
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="bg-gray-900/95 backdrop-blur-sm px-6 py-4 border-b border-gray-700">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onNavigateHome} className="flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
            <Text className="text-lg font-bold text-white ml-2">{t('transactionHistory')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh} className="bg-gray-800/60 border border-gray-600 rounded-xl p-2">
            <Ionicons name="refresh" size={20} color="#FFD700" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {transactions.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="receipt-outline" size={64} color="#6b7280" />
            <Text className="text-gray-300 text-lg font-bold mt-4">{t('noTransactionsYet')}</Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              {t('transactionHistoryDescription')}
            </Text>
          </View>
        ) : (
          <View className="px-6 py-4">
            <Text className="text-gray-300 text-sm mb-4">
              {transactions.length} {transactions.length !== 1 ? t('transactions') : t('transaction')} {t('transactionsFound')}
            </Text>
            
            {transactions.map((transaction) => (
              <View
                key={transaction.id}
                className={`bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 mb-3 border border-gray-700 shadow-lg ${
                  transaction.isReverted ? 'opacity-60' : ''
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="mr-3">
                      {getTransactionIcon(transaction)}
                    </View>
                    
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="font-bold text-white text-base">
                          {transaction.categoryName}
                        </Text>
                        <Text className={`font-bold text-lg ${getTransactionColor(transaction)}`}>
                          {getAmountPrefix(transaction)}{formatCurrency(transaction.amount, currency)}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center justify-between mt-1">
                        <Text className="text-gray-400 text-sm">
                          {formatDate(transaction.date)}
                        </Text>
                        <Text className="text-gray-400 text-sm">
                          {transaction.monthKey}
                        </Text>
                      </View>
                      
                      {transaction.isReverted && (
                        <View className="mt-2">
                          <Text className="text-red-400 text-sm font-bold">
                            {t('reverted')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {!transaction.isReverted && (
                    <TouchableOpacity
                      className="ml-3 p-2 bg-gray-800/60 border border-gray-600 rounded-xl"
                      onPress={() => handleRevertTransaction(transaction)}
                    >
                      <FontAwesome5 name="undo" size={16} color="#FFD700" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;
