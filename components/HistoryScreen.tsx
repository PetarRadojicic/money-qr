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
import { Transaction } from '../types';
import { loadTransactionHistory, revertTransaction } from '../utils/dataManager';
import { formatCurrency } from '../constants/currencies';

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
      Alert.alert('Already Reverted', 'This transaction has already been reverted.');
      return;
    }

    const transactionType = transaction.type === 'income' ? 'income' : 'expense';
    const actionText = transactionType === 'income' ? 'remove this income' : 'remove this expense';

    Alert.alert(
      'Revert Transaction',
      `Are you sure you want to ${actionText}?\n\n${transaction.categoryName}: ${formatCurrency(transaction.amount, currency)}\nDate: ${formatDate(transaction.date)}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Revert',
          style: 'destructive',
          onPress: async () => {
            const success = await revertTransaction(transaction.id);
            if (success) {
              Alert.alert('Success', 'Transaction has been reverted.');
              await loadTransactions();
              onDataChange(); // Refresh home screen data
            } else {
              Alert.alert('Error', 'Failed to revert transaction.');
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
    <>
      {/* Header */}
      <View className="bg-white px-6 py-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onNavigateHome} className="flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="#374151" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">Transaction History</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh}>
            <Ionicons name="refresh" size={24} color="#6b7280" />
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
            <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-4">No Transactions Yet</Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              Your transaction history will appear here once you start adding expenses or income.
            </Text>
          </View>
        ) : (
          <View className="px-6 py-4">
            <Text className="text-gray-600 text-sm mb-4">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found
            </Text>
            
            {transactions.map((transaction) => (
              <View
                key={transaction.id}
                className={`bg-white rounded-xl p-4 mb-3 shadow-sm ${
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
                        <Text className="font-semibold text-gray-900 text-base">
                          {transaction.categoryName}
                        </Text>
                        <Text className={`font-bold text-lg ${getTransactionColor(transaction)}`}>
                          {getAmountPrefix(transaction)}{formatCurrency(transaction.amount, currency)}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center justify-between mt-1">
                        <Text className="text-gray-500 text-sm">
                          {formatDate(transaction.date)}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {transaction.monthKey}
                        </Text>
                      </View>
                      
                      {transaction.isReverted && (
                        <View className="mt-2">
                          <Text className="text-red-500 text-sm font-medium">
                            Reverted
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {!transaction.isReverted && (
                    <TouchableOpacity
                      className="ml-3 p-2"
                      onPress={() => handleRevertTransaction(transaction)}
                    >
                      <FontAwesome5 name="undo" size={18} color="#6b7280" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default HistoryScreen;
