import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Dimensions, RefreshControl, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  loadData,
  loadTransactionHistory,
  getSelectedCurrency,
  getCurrentMonthKey,
  getMonthName,
  getAdjacentMonthKey,
  calculateBalance,
} from '../utils/dataManager';
import { AppData, MonthlyData, Transaction, HistoryData } from '../types';
import { formatCurrency } from '../constants/currencies';
import { 
  analyzeCategoryTrends, 
  calculateYearOverYearComparison 
} from '../utils/analyticsUtils';
import { useTranslation } from '../contexts/TranslationContext';
import { getTranslatedMonthName } from '../utils/translationUtils';

interface GlobalData {
  appData: any;
  transactionHistory: any;
  selectedCurrency: string;
  isDataReady: boolean;
}

interface AnalyticsScreenProps {
  onNavigateHome: () => void;
  onNavigateHistory: () => void;
  onNavigateSettings: () => void;
  globalData?: GlobalData;
  skipInitialLoading?: boolean;
}

interface MonthlyAnalytics {
  monthKey: string;
  monthName: string;
  income: number;
  expenses: number;
  balance: number;
  topCategory: { name: string; amount: number; percentage: number } | null;
  categoryCount: number;
}

interface CategoryAnalytics {
  id: string;
  name: string;
  totalAmount: number;
  percentage: number;
  monthlyAverage: number;
  transactionCount: number;
}

interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  monthlyAnalytics: MonthlyAnalytics[];
  categoryAnalytics: CategoryAnalytics[];
  recentMonths: number;
  averageMonthlyIncome: number;
  averageMonthlyExpenses: number;
  savingsRate: number;
  topSpendingCategory: CategoryAnalytics | null;
  mostActiveMonth: MonthlyAnalytics | null;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  onNavigateHome,
  onNavigateHistory,
  onNavigateSettings,
  globalData,
  skipInitialLoading = false,
}) => {
  const { t, translations } = useTranslation();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(!skipInitialLoading);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'specific' | 'all'>('all');
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  // Load currency immediately on mount
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const currency = await getSelectedCurrency();
        setSelectedCurrency(currency);
      } catch (error) {
        console.error('Error loading initial currency:', error);
      }
    };
    loadCurrency();
  }, []);

  // Fast loading from preloaded cache
  const loadAnalyticsDataFromCache = useCallback(async () => {
    try {
      if (globalData?.isDataReady && globalData.appData && globalData.transactionHistory) {
        // Always get fresh currency to ensure consistency
        const currentCurrency = await getSelectedCurrency();
        setSelectedCurrency(currentCurrency);
        
        // Get available months from preloaded data
        const months = Object.keys(globalData.appData).sort();
        setAvailableMonths(months);

        // If no months selected and we have data, select all months
        if (selectedMonths.length === 0 && months.length > 0) {
          setSelectedMonths(months);
        }

        const analytics = calculateAnalytics(globalData.appData, globalData.transactionHistory, timeRange, selectedMonths);
        setAnalyticsData(analytics);
        return; // Exit early - we're done!
      }
      
      // Fallback: Load data normally
      await loadAnalyticsData(false);
    } catch (error) {
      console.error('Error loading analytics data from cache:', error);
    }
  }, [globalData, timeRange, selectedMonths]);

  // Load analytics data
  const loadAnalyticsData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const [appData, historyData, currency] = await Promise.all([
        loadData(),
        loadTransactionHistory(),
        getSelectedCurrency(),
      ]);

      setSelectedCurrency(currency);

      // Get available months from data
      const months = Object.keys(appData).sort();
      setAvailableMonths(months);

      // If no months selected and we have data, select all months
      if (selectedMonths.length === 0 && months.length > 0) {
        setSelectedMonths(months);
      }

      const analytics = calculateAnalytics(appData, historyData, timeRange, selectedMonths);
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [timeRange, selectedMonths]);

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    loadAnalyticsData(true);
  }, [loadAnalyticsData]);

  // Load all data in coordinated manner
  useEffect(() => {
    if (skipInitialLoading && globalData?.isDataReady) {
      // Use preloaded data
      loadAnalyticsDataFromCache();
    } else {
      loadAnalyticsData();
    }
  }, [timeRange, selectedMonths, skipInitialLoading, globalData?.isDataReady]);

  // Recompute when selected currency changes via global data
  useEffect(() => {
    if (!globalData?.isDataReady) return;
    const refreshOnCurrency = async () => {
      try {
        // Always get fresh currency to ensure consistency
        const currentCurrency = await getSelectedCurrency();
        setSelectedCurrency(currentCurrency);
        
        if (globalData?.appData && globalData?.transactionHistory) {
          const analytics = calculateAnalytics(
            globalData.appData,
            globalData.transactionHistory,
            timeRange,
            selectedMonths
          );
          setAnalyticsData(analytics);
        } else {
          await loadAnalyticsData();
        }
      } catch (e) {
        await loadAnalyticsData();
      }
    };
    refreshOnCurrency();
  }, [globalData?.selectedCurrency]);

  // Calculate analytics from data
  const calculateAnalytics = (
    appData: AppData,
    historyData: HistoryData,
    range: 'specific' | 'all',
    monthsToInclude: string[] = []
  ): AnalyticsData => {
    const currentMonthKey = getCurrentMonthKey();
    const monthKeys = Object.keys(appData).sort();
    
    // Filter months based on selection
    let filteredMonthKeys = monthKeys;
    if (range === 'specific' && monthsToInclude.length > 0) {
      filteredMonthKeys = monthsToInclude.filter(month => monthKeys.includes(month)).sort();
    } else if (range === 'all') {
      filteredMonthKeys = monthKeys;
    }

    // Calculate monthly analytics
    const monthlyAnalytics: MonthlyAnalytics[] = filteredMonthKeys.map(monthKey => {
      const monthData = appData[monthKey];
      const balance = calculateBalance(monthData);
      
      // Find top category
      const categories = Object.entries(monthData.categories);
      const topCategory = categories.length > 0 
        ? categories.reduce((top, [id, amount]) => amount > top.amount ? { id, amount } : top, { id: '', amount: 0 })
        : null;

      return {
        monthKey,
        monthName: getTranslatedMonthName(monthKey, translations),
        income: monthData.income,
        expenses: monthData.expenses,
        balance,
        topCategory: topCategory && topCategory.amount > 0 ? {
          name: getCategoryNameFromTransactions(topCategory.id, historyData.transactions),
          amount: topCategory.amount,
          percentage: monthData.expenses > 0 ? (topCategory.amount / monthData.expenses) * 100 : 0
        } : null,
        categoryCount: Object.keys(monthData.categories).length
      };
    });

    // Calculate category analytics
    const categoryTotals: { [categoryId: string]: { amount: number; transactions: number; name: string } } = {};
    
    filteredMonthKeys.forEach(monthKey => {
      const monthData = appData[monthKey];
      Object.entries(monthData.categories).forEach(([categoryId, amount]) => {
        if (!categoryTotals[categoryId]) {
          categoryTotals[categoryId] = { 
            amount: 0, 
            transactions: 0, 
            name: getCategoryNameFromTransactions(categoryId, historyData.transactions) 
          };
        }
        categoryTotals[categoryId].amount += amount;
        
        // Count transactions for this category in this month
        const categoryTransactions = historyData.transactions.filter(
          t => t.categoryId === categoryId && t.monthKey === monthKey && t.type === 'expense' && !t.isReverted
        );
        categoryTotals[categoryId].transactions += categoryTransactions.length;
      });
    });

    const totalExpenses = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.amount, 0);
    
    const categoryAnalytics: CategoryAnalytics[] = Object.entries(categoryTotals)
      .map(([id, data]) => ({
        id,
        name: data.name,
        totalAmount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        monthlyAverage: data.amount / filteredMonthKeys.length,
        transactionCount: data.transactions
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    // Calculate totals
    const totalIncome = monthlyAnalytics.reduce((sum, month) => sum + month.income, 0);
    const totalExpensesCalc = monthlyAnalytics.reduce((sum, month) => sum + month.expenses, 0);
    const totalBalance = monthlyAnalytics.reduce((sum, month) => sum + month.balance, 0);

    const averageMonthlyIncome = totalIncome / filteredMonthKeys.length;
    const averageMonthlyExpenses = totalExpensesCalc / filteredMonthKeys.length;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpensesCalc) / totalIncome) * 100 : 0;

    const topSpendingCategory = categoryAnalytics.length > 0 ? categoryAnalytics[0] : null;
    const mostActiveMonth = monthlyAnalytics.reduce((most, month) => 
      month.expenses > most.expenses ? month : most, monthlyAnalytics[0] || null
    );

    return {
      totalIncome,
      totalExpenses: totalExpensesCalc,
      totalBalance,
      monthlyAnalytics,
      categoryAnalytics,
      recentMonths: filteredMonthKeys.length,
      averageMonthlyIncome,
      averageMonthlyExpenses,
      savingsRate,
      topSpendingCategory,
      mostActiveMonth
    };
  };

  // Helper function to get category name from transactions
  const getCategoryNameFromTransactions = (categoryId: string, transactions: Transaction[]): string => {
    const transaction = transactions.find(t => t.categoryId === categoryId);
    return transaction?.categoryName || categoryId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // (Removed) financial health score UI

  // Render simple bar chart for monthly data
  const renderMonthlyChart = () => {
    if (!analyticsData || analyticsData.monthlyAnalytics.length === 0) return null;

    const maxAmount = Math.max(
      ...analyticsData.monthlyAnalytics.map(m => Math.max(m.income, m.expenses))
    );

    const chartWidth = screenWidth - 48; // Account for padding
    const barWidth = (chartWidth - 40) / analyticsData.monthlyAnalytics.length;

    return (
      <View className="bg-white rounded-xl p-4 mx-6 mb-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {t('monthlyIncomeVsExpenses')}
        </Text>
        
        <View className="flex-row items-end justify-between h-40 mb-2">
          {analyticsData.monthlyAnalytics.map((month, index) => {
            const incomeHeight = maxAmount > 0 ? (month.income / maxAmount) * 120 : 0;
            const expenseHeight = maxAmount > 0 ? (month.expenses / maxAmount) * 120 : 0;

            return (
              <View key={month.monthKey} className="items-center" style={{ width: barWidth }}>
                <View className="flex-row items-end space-x-1" style={{ height: 120 }}>
                  <View 
                    className="bg-green-500 rounded-t w-3"
                    style={{ height: incomeHeight }}
                  />
                  <View 
                    className="bg-red-500 rounded-t w-3"
                    style={{ height: expenseHeight }}
                  />
                </View>
                <Text className="text-xs text-gray-600 mt-1 text-center">
                  {month.monthName.split(' ')[0].slice(0, 3)}
                </Text>
              </View>
            );
          })}
        </View>
        
        <View className="flex-row justify-center space-x-4">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-green-500 rounded mr-1" />
            <Text className="text-xs text-gray-600">{t('income')}</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-red-500 rounded mr-1" />
            <Text className="text-xs text-gray-600">{t('expenses')}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render category breakdown
  const renderCategoryBreakdown = () => {
    if (!analyticsData || analyticsData.categoryAnalytics.length === 0) return null;

    const topCategories = analyticsData.categoryAnalytics.slice(0, 5);

    return (
      <View className="bg-white rounded-xl p-4 mx-6 mb-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {t('topSpendingCategories')}
        </Text>
        
        {topCategories.map((category, index) => {
          const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500'];
          const color = colors[index % colors.length];

          return (
            <View key={category.id} className="mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm font-medium text-gray-900">{category.name}</Text>
                <Text className="text-sm text-gray-600">
                  {formatCurrency(category.totalAmount, selectedCurrency)}
                </Text>
              </View>
              
              <View className="bg-gray-200 rounded-full h-2 mb-1">
                <View 
                  className={`${color} h-2 rounded-full`}
                  style={{ width: `${category.percentage}%` }}
                />
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">
                  {category.percentage.toFixed(1)}% {t('ofTotal')}
                </Text>
                <Text className="text-xs text-gray-500">
                  {category.transactionCount} {t('transactions')}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="mx-6 mt-8">
        {[...Array(6)].map((_, index) => (
          <View key={index} className="bg-gray-200 rounded-xl p-4 mb-4 h-32" />
        ))}
      </View>
    </ScrollView>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!analyticsData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500 text-lg">{t('noDataAvailable')}</Text>
      </View>
    );
  }

  return (
    <>
    <ScrollView 
      className="flex-1" 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="mx-6 mt-8 mb-4">
        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">{t('analytics')}</Text>
        
        {/* Time Range Selector */}
        <View className="flex-row justify-center space-x-3">
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              timeRange === 'all' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            onPress={() => {
              setTimeRange('all');
              setSelectedMonths(availableMonths);
            }}
          >
            <Text className={`text-sm ${
              timeRange === 'all' ? 'text-white font-medium' : 'text-gray-600'
            }`}>
              {t('allTime')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              timeRange === 'specific' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            onPress={() => setShowMonthPicker(true)}
          >
            <View className="flex-row items-center">
              <Text className={`text-sm ${
                timeRange === 'specific' ? 'text-white font-medium' : 'text-gray-600'
              }`}>
                {timeRange === 'specific' && selectedMonths.length > 0 
                  ? `${selectedMonths.length} ${selectedMonths.length !== 1 ? t('selectMonths').toLowerCase() : t('selectMonths').toLowerCase().slice(0, -1)}`
                  : t('selectMonths')
                }
              </Text>
              <Ionicons 
                name="chevron-down" 
                size={16} 
                color={timeRange === 'specific' ? 'white' : '#6b7280'} 
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Cards */}
      <View className="mx-6 mb-4">
        <View className="flex-row space-x-3">
          <View className="flex-1 bg-green-100 rounded-xl p-4">
            <Text className="text-green-600 text-sm font-medium">{t('totalIncome')}</Text>
            <Text className="text-green-800 text-xl font-bold">
              {formatCurrency(analyticsData.totalIncome, selectedCurrency)}
            </Text>
            <Text className="text-green-600 text-xs">
              {t('avg')}: {formatCurrency(analyticsData.averageMonthlyIncome, selectedCurrency)}/mo
            </Text>
          </View>
          
          <View className="flex-1 bg-red-100 rounded-xl p-4">
            <Text className="text-red-600 text-sm font-medium">{t('totalExpenses')}</Text>
            <Text className="text-red-800 text-xl font-bold">
              {formatCurrency(analyticsData.totalExpenses, selectedCurrency)}
            </Text>
            <Text className="text-red-600 text-xs">
              {t('avg')}: {formatCurrency(analyticsData.averageMonthlyExpenses, selectedCurrency)}/mo
            </Text>
          </View>
        </View>
        
        <View className="flex-row space-x-3 mt-3">
          <View className="flex-1 bg-blue-100 rounded-xl p-4">
            <Text className="text-blue-600 text-sm font-medium">{t('netSavings')}</Text>
            <Text className="text-blue-800 text-xl font-bold">
              {formatCurrency(analyticsData.totalBalance, selectedCurrency)}
            </Text>
            <Text className="text-blue-600 text-xs">
              {t('rate')}: {analyticsData.savingsRate.toFixed(1)}%
            </Text>
          </View>
          
          <View className="flex-1 bg-purple-100 rounded-xl p-4">
            <Text className="text-purple-600 text-sm font-medium">{t('monthsTracked')}</Text>
            <Text className="text-purple-800 text-xl font-bold">
              {analyticsData.recentMonths}
            </Text>
            <Text className="text-purple-600 text-xs">
              {t('categories')}: {analyticsData.categoryAnalytics.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Financial Health Score removed */}

      {/* Monthly Chart */}
      {renderMonthlyChart()}

      {/* Category Breakdown */}
      {renderCategoryBreakdown()}


      {/* Insights */}
      <View className="bg-white rounded-xl p-4 mx-6 mb-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {t('keyInsights')}
        </Text>
        
        {analyticsData.topSpendingCategory && (
          <View className="mb-3 p-3 bg-orange-50 rounded-lg">
            <View className="flex-row items-center mb-1">
              <Ionicons name="trending-up" size={16} color="#ea580c" />
              <Text className="text-orange-700 font-medium ml-2">{t('topSpendingCategory')}</Text>
            </View>
            <Text className="text-gray-700">
              {t('youSpent')} {formatCurrency(analyticsData.topSpendingCategory.totalAmount, selectedCurrency)} {t('on')}{' '}
              <Text className="font-semibold">{analyticsData.topSpendingCategory.name}</Text>
              {' '}({analyticsData.topSpendingCategory.percentage.toFixed(1)}% {t('ofTotal')} {t('expenses').toLowerCase()})
            </Text>
          </View>
        )}
        
        {analyticsData.mostActiveMonth && (
          <View className="mb-3 p-3 bg-blue-50 rounded-lg">
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar" size={16} color="#2563eb" />
              <Text className="text-blue-700 font-medium ml-2">{t('mostActiveMonth')}</Text>
            </View>
            <Text className="text-gray-700">
              <Text className="font-semibold">{analyticsData.mostActiveMonth.monthName}</Text> {t('wasYourMostExpensive')}{' '}
              {formatCurrency(analyticsData.mostActiveMonth.expenses, selectedCurrency)} {t('inExpenses')}
            </Text>
          </View>
        )}
        
        <View className="p-3 bg-green-50 rounded-lg">
          <View className="flex-row items-center mb-1">
            <Ionicons name="wallet" size={16} color="#059669" />
            <Text className="text-green-700 font-medium ml-2">{t('savingsPerformance')}</Text>
          </View>
          <Text className="text-gray-700">
            {t('yourSavingsRateIs')} {analyticsData.savingsRate.toFixed(1)}%
            {analyticsData.savingsRate > 20 ? ' - Excellent!' : 
             analyticsData.savingsRate > 10 ? ' - Good work!' : 
             ' - Consider reducing expenses'}
          </Text>
        </View>
      </View>

      {/* Quick Tips */}
      <View className="bg-white rounded-xl p-4 mx-6 mb-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {t('quickTips')}
        </Text>
        
        <View>
          <View className="flex-row items-start mb-3">
            <View className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3" />
            <Text className="text-gray-700 flex-1">
              {t('trackExpensesDaily')}
            </Text>
          </View>
          
          <View className="flex-row items-start mb-3">
            <View className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3" />
            <Text className="text-gray-700 flex-1">
              {t('aimToSave')}
            </Text>
          </View>
          
          <View className="flex-row items-start mb-3">
            <View className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3" />
            <Text className="text-gray-700 flex-1">
              {t('reviewSpending')}
            </Text>
          </View>
          
          <View className="flex-row items-start">
            <View className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3" />
            <Text className="text-gray-700 flex-1">
              {t('useHistoryTab')}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom padding */}
      <View className="h-6" />
    </ScrollView>

    {/* Month Picker Modal */}
    <MonthPickerModal
      visible={showMonthPicker}
      availableMonths={availableMonths}
      selectedMonths={selectedMonths}
      onClose={() => setShowMonthPicker(false)}
      onApply={(months) => {
        setSelectedMonths(months);
        setTimeRange('specific');
        setShowMonthPicker(false);
      }}
    />
  </>
  );
};

// Month Picker Modal Component
interface MonthPickerModalProps {
  visible: boolean;
  availableMonths: string[];
  selectedMonths: string[];
  onClose: () => void;
  onApply: (months: string[]) => void;
}

const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  visible,
  availableMonths,
  selectedMonths,
  onClose,
  onApply,
}) => {
  const { t, translations } = useTranslation();
  const [tempSelectedMonths, setTempSelectedMonths] = useState<string[]>(selectedMonths);

  useEffect(() => {
    if (visible) {
      setTempSelectedMonths(selectedMonths);
    }
  }, [visible, selectedMonths]);

  const toggleMonth = (monthKey: string) => {
    setTempSelectedMonths(prev => 
      prev.includes(monthKey) 
        ? prev.filter(m => m !== monthKey)
        : [...prev, monthKey].sort()
    );
  };

  const selectAll = () => {
    setTempSelectedMonths(availableMonths);
  };

  const clearAll = () => {
    setTempSelectedMonths([]);
  };

  const handleApply = () => {
    onApply(tempSelectedMonths);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-96">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 pb-4 border-b border-gray-200">
            <Text className="text-xl font-semibold text-gray-900">{t('selectMonths')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-between px-6 py-3 border-b border-gray-100">
            <TouchableOpacity 
              className="px-4 py-2 bg-blue-100 rounded-lg"
              onPress={selectAll}
            >
              <Text className="text-blue-600 font-medium">{t('selectAll')}</Text>
            </TouchableOpacity>
            
            <Text className="text-sm text-gray-500 self-center">
              {tempSelectedMonths.length} {t('of')} {availableMonths.length} {t('selected')}
            </Text>
            
            <TouchableOpacity 
              className="px-4 py-2 bg-gray-100 rounded-lg"
              onPress={clearAll}
            >
              <Text className="text-gray-600 font-medium">{t('clearAll')}</Text>
            </TouchableOpacity>
          </View>

          {/* Month List */}
          <ScrollView className="max-h-64 px-6 py-2">
            {availableMonths.map((monthKey) => {
              const isSelected = tempSelectedMonths.includes(monthKey);
              const monthName = getTranslatedMonthName(monthKey, translations);
              
              return (
                <TouchableOpacity
                  key={monthKey}
                  className="flex-row items-center justify-between py-3 border-b border-gray-50"
                  onPress={() => toggleMonth(monthKey)}
                >
                  <Text className="text-gray-900 font-medium">{monthName}</Text>
                  <View className={`w-6 h-6 rounded-full border-2 ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-gray-300'
                  } items-center justify-center`}>
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View className="flex-row space-x-3 p-6 pt-4">
            <TouchableOpacity 
              className="flex-1 py-3 border border-gray-300 rounded-xl"
              onPress={onClose}
            >
              <Text className="text-gray-600 font-medium text-center">{t('cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`flex-1 py-3 rounded-xl ${
                tempSelectedMonths.length > 0 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300'
              }`}
              onPress={handleApply}
              disabled={tempSelectedMonths.length === 0}
            >
              <Text className={`font-medium text-center ${
                tempSelectedMonths.length > 0 
                  ? 'text-white' 
                  : 'text-gray-500'
              }`}>
                {t('apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AnalyticsScreen;
