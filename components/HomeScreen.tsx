import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExpenseCategory from './ExpenseCategory';
import ExpenseModal from './ExpenseModal';
import AddBalanceModal from './AddBalanceModal';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import { createExpenseCategories } from '../constants/expenseCategories';
import {
  getCurrentMonthKey,
  getMonthName,
  getAdjacentMonthKey,
  getMonthlyData,
  updateMonthlyData,
  calculateBalance,
  calculateTotalBalance,
  loadCustomCategories,
  saveCustomCategories,
  loadData,
  saveData,
  getModifiedCategories,
  saveModifiedCategories,
  getHiddenCategories,
  saveHiddenCategories,
  addTransaction,
  getSelectedCurrency,
} from '../utils/dataManager';
import { MonthlyData, ModalState, CustomCategory, Transaction } from '../types';
import { formatCurrency } from '../constants/currencies';
import { updateCurrencyRates, areRatesFresh } from '../utils/currencyService';

interface HomeScreenProps {
  onNavigateHistory: () => void;
  onNavigateSettings: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onNavigateHistory, 
  onNavigateSettings 
}) => {
  // State management
  const [currentMonthKey, setCurrentMonthKey] = useState(getCurrentMonthKey());
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [modalState, setModalState] = useState<ModalState>({
    isVisible: false,
    type: null,
  });
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(true);

  // Function to force refresh exchange rates (for manual refresh or currency change)
  const forceRefreshRates = useCallback(async () => {
    console.log('🔄 Force refreshing exchange rates...');
    await updateCurrencyRates();
  }, []);

  // Track initial load completion to avoid full refresh on month switch
  const hasInitialLoaded = useRef(false);

  // Initial load only once
  useEffect(() => {
    const init = async () => {
      await loadAllData();
      hasInitialLoaded.current = true;
    };
    init();
  }, []);

  // On month change, load only month-specific data (no global loading state)
  useEffect(() => {
    if (hasInitialLoaded.current) {
      loadMonthData();
    }
  }, [currentMonthKey]);

  // Watch for currency changes and refresh rates when currency changes
  useEffect(() => {
    const checkCurrencyChange = async () => {
      const currentCurrency = await getSelectedCurrency();
      if (selectedCurrency && selectedCurrency !== currentCurrency) {
        console.log(`💱 Currency changed from ${selectedCurrency} to ${currentCurrency}, refreshing rates...`);
        await forceRefreshRates();
      }
    };

    if (selectedCurrency) {
      checkCurrencyChange();
    }
  }, [selectedCurrency, forceRefreshRates]);

  // Coordinated loading function - loads everything at once
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Load all data in parallel for better performance
      const [currency, monthlyData, totalBalance] = await Promise.all([
        getSelectedCurrency(),
        getMonthlyData(currentMonthKey),
        calculateTotalBalance(),
      ]);

      // Set all state at once to prevent layout shifts
      setSelectedCurrency(currency);
      setMonthlyData(monthlyData);
      setTotalBalance(totalBalance);
      
      // Load categories after other data is set
      const categories = await createExpenseCategories(monthlyData.categories);
      setExpenseCategories(categories);
      
      // Only fetch exchange rates if they're not fresh (non-blocking)
      if (!areRatesFresh()) {
        console.log('🔄 Exchange rates are stale, updating...');
        updateCurrencyRates();
      } else {
        console.log('✅ Exchange rates are fresh, skipping update');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMonthData = async () => {
    const data = await getMonthlyData(currentMonthKey);
    setMonthlyData(data);
    // Load categories with amounts
    const categories = await createExpenseCategories(data.categories);
    setExpenseCategories(categories);
  };

  const loadTotalBalance = async () => {
    const total = await calculateTotalBalance();
    setTotalBalance(total);
  };

  // Navigation handlers
  const handlePreviousMonth = useCallback(() => {
    setCurrentMonthKey(getAdjacentMonthKey(currentMonthKey, 'prev'));
  }, [currentMonthKey]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonthKey(getAdjacentMonthKey(currentMonthKey, 'next'));
  }, [currentMonthKey]);

  const handleGoToCurrent = useCallback(() => {
    setCurrentMonthKey(getCurrentMonthKey());
  }, []);

  // Category handlers
  const handleCategoryPress = useCallback((categoryId: string, categoryName: string) => {
    if (categoryId === 'add') {
      setModalState({
        isVisible: true,
        type: 'addCategory',
      });
    } else if (isEditMode) {
      // In edit mode, open edit modal
      const category = expenseCategories.find(cat => cat.id === categoryId);
      if (category) {
        setEditingCategory({
          id: category.id,
          name: category.name,
          icon: category.icon,
          backgroundColor: category.backgroundColor,
          isCustom: categoryId.startsWith('custom_'),
        });
        setModalState({
          isVisible: true,
          type: 'editCategory',
        });
      }
    } else {
      // Normal mode, open expense modal
      setModalState({
        isVisible: true,
        type: 'expense',
        categoryId,
      });
    }
  }, [expenseCategories, isEditMode]);

  const handleCategoryDelete = useCallback(async (categoryId: string) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    const categoryAmount = monthlyData?.categories[categoryId] || 0;

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?\n\nThis category has ${formatCurrency(categoryAmount, selectedCurrency)} in expenses. This action cannot be undone and the expenses will be removed from your balance calculation.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (categoryId.startsWith('custom_')) {
              // Handle custom category deletion
              const customCategories = await loadCustomCategories();
              delete customCategories[categoryId];
              await saveCustomCategories(customCategories);
            } else {
              // Handle default category deletion - add to hidden categories
              const hiddenCategories = await getHiddenCategories();
              if (!hiddenCategories.includes(categoryId)) {
                hiddenCategories.push(categoryId);
                await saveHiddenCategories(hiddenCategories);
              }
            }
            
            // Remove expenses from all months
            const data = await loadData();
            Object.keys(data).forEach(monthKey => {
              if (data[monthKey].categories[categoryId]) {
                delete data[monthKey].categories[categoryId];
                // Recalculate expenses for this month
                data[monthKey].expenses = Object.values(data[monthKey].categories).reduce((sum, amount) => sum + amount, 0);
              }
            });
            await saveData(data);
            
            await loadAllData();
          },
        },
      ]
    );
  }, [expenseCategories, monthlyData, selectedCurrency]);

  const handleExpenseConfirm = useCallback(async (amount: number) => {
    if (!modalState.categoryId || !monthlyData) return;

    const category = expenseCategories.find(cat => cat.id === modalState.categoryId);
    const categoryName = category?.name || 'Unknown';

    const updatedCategories = {
      ...monthlyData.categories,
      [modalState.categoryId]: (monthlyData.categories[modalState.categoryId] || 0) + amount,
    };

    await updateMonthlyData(currentMonthKey, { categories: updatedCategories });
    
    // Add transaction to history
    const transaction: Transaction = {
      id: `expense_${Date.now()}_${Math.random()}`,
      type: 'expense',
      amount,
      categoryId: modalState.categoryId,
      categoryName,
      monthKey: currentMonthKey,
      date: new Date().toISOString(),
      description: `Expense added to ${categoryName}`,
    };
    await addTransaction(transaction);
    
    await loadAllData();
  }, [modalState.categoryId, monthlyData, expenseCategories, currentMonthKey]);

  const handleAddToBalance = useCallback(() => {
    setModalState({
      isVisible: true,
      type: 'balance',
    });
  }, []);

  const handleBalanceConfirm = useCallback(async (amount: number) => {
    if (!monthlyData) return;

    await updateMonthlyData(currentMonthKey, {
      income: monthlyData.income + amount,
    });
    
    // Add transaction to history
    const transaction: Transaction = {
      id: `income_${Date.now()}_${Math.random()}`,
      type: 'income',
      amount,
      categoryId: 'income',
      categoryName: 'Add to Balance',
      monthKey: currentMonthKey,
      date: new Date().toISOString(),
      description: 'Money added to balance',
    };
    await addTransaction(transaction);
    
    await loadAllData();
  }, [monthlyData, currentMonthKey]);

  const handleModalClose = useCallback(() => {
    setModalState({ isVisible: false, type: null });
    setEditingCategory(null);
  }, []);

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  const handleAddCategoryConfirm = useCallback(async (newCategory: CustomCategory) => {
    const customCategories = await loadCustomCategories();
    customCategories[newCategory.id] = newCategory;
    await saveCustomCategories(customCategories);
    await loadAllData();
  }, []);

  const handleEditCategoryConfirm = useCallback(async (categoryId: string, updates: Partial<CustomCategory>) => {
    if (!editingCategory) return;

    if (editingCategory.isCustom) {
      // Handle custom category editing
      const customCategories = await loadCustomCategories();
      if (customCategories[categoryId]) {
        customCategories[categoryId] = { ...customCategories[categoryId], ...updates };
        await saveCustomCategories(customCategories);
      }
    } else {
      // Handle default category editing - save as modified category
      const modifiedCategories = await getModifiedCategories();
      modifiedCategories[categoryId] = {
        name: updates.name || editingCategory.name,
        icon: updates.icon || editingCategory.icon,
        backgroundColor: updates.backgroundColor || editingCategory.backgroundColor,
      };
      await saveModifiedCategories(modifiedCategories);
    }
    
    await loadAllData();
  }, [editingCategory]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Balance Skeleton */}
      <View className="mx-6 mt-8">
        <View className="h-6 bg-gray-200 rounded mb-3 mx-auto w-32" />
        <View className="bg-gray-200 rounded-2xl p-6 items-center">
          <View className="h-4 bg-gray-300 rounded w-24 mb-2" />
          <View className="h-8 bg-gray-300 rounded w-40 mb-2" />
          <View className="h-4 bg-gray-300 rounded w-32" />
        </View>
        
        {/* Month Navigation Skeleton */}
        <View className="flex-row items-center justify-center mt-6">
          <View className="w-12 h-12 bg-gray-200 rounded-full mr-4" />
          <View className="h-6 bg-gray-200 rounded w-24" />
          <View className="w-12 h-12 bg-gray-200 rounded-full ml-4" />
        </View>
      </View>

      {/* Monthly Overview Skeleton */}
      <View className="mx-6 mt-6">
        <View className="h-6 bg-gray-200 rounded mb-3 mx-auto w-24" />
        <View className="flex-row justify-center">
          <View className="bg-gray-200 rounded-xl p-4 mr-2 w-32 h-20" />
          <View className="bg-gray-200 rounded-xl p-4 ml-2 w-32 h-20" />
        </View>
      </View>

      {/* Categories Skeleton */}
      <View className="mx-6 mt-6">
        <View className="h-6 bg-gray-200 rounded mb-3 mx-auto w-40" />
        <View className="flex-row flex-wrap justify-center">
          {[...Array(8)].map((_, index) => (
            <View key={index} className="bg-gray-200 rounded-xl p-4 m-1 w-20 h-20" />
          ))}
        </View>
      </View>

      {/* Add Button Skeleton */}
      <View className="mx-6 mt-6">
        <View className="bg-gray-200 rounded-2xl p-4 h-16" />
      </View>
    </ScrollView>
  );

  // Show loading skeleton while data is loading
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Overall Balance Section */}
        <View className="mx-6 mt-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3 text-center">Overall Balance</Text>
          <View className="bg-blue-600 rounded-2xl p-6 shadow-lg items-center">
            <Text className="text-white text-sm opacity-90 text-center">Total Balance</Text>
            <Text className="text-white text-3xl font-bold mt-1 text-center">
              {formatCurrency(totalBalance, selectedCurrency)}
            </Text>
            <Text className="text-green-300 text-sm mt-2 text-center">
              {monthlyData ? `Balance this month: ${formatCurrency(calculateBalance(monthlyData), selectedCurrency)}` : 'Loading...'}
            </Text>
          </View>
          
          {/* Month Navigation */}
          <View className="flex-row items-center justify-center mt-6">
            <TouchableOpacity 
              className="bg-white w-12 h-12 rounded-full shadow-sm mr-4 items-center justify-center"
              onPress={handlePreviousMonth}
            >
              <Ionicons name="chevron-back" size={24} color="#6b7280" />
            </TouchableOpacity>
            <View className="items-center">
              <Text className="text-lg font-semibold text-gray-900">{getMonthName(currentMonthKey)}</Text>
              {currentMonthKey !== getCurrentMonthKey() && (
                <TouchableOpacity 
                  className="mt-1 px-3 py-1 bg-blue-100 rounded-full"
                  onPress={handleGoToCurrent}
                >
                  <Text className="text-blue-600 text-xs font-medium">Go to Current</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              className="bg-white w-12 h-12 rounded-full shadow-sm ml-4 items-center justify-center"
              onPress={handleNextMonth}
            >
              <Ionicons name="chevron-forward" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Monthly Overview */}
        <View className="mx-6 mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3 text-center">This Month</Text>
          <View className="flex-row justify-center">
            <View className="bg-white rounded-xl p-4 mr-2 shadow-sm w-32">
              <Text className="text-gray-600 text-sm text-center">Income</Text>
              <Text className="text-green-600 text-xl font-bold mt-1 text-center">
                {formatCurrency(monthlyData?.income || 0, selectedCurrency)}
              </Text>
            </View>
            <View className="bg-white rounded-xl p-4 ml-2 shadow-sm w-32">
              <Text className="text-gray-600 text-sm text-center">Expenses</Text>
              <Text className="text-red-600 text-xl font-bold mt-1 text-center">
                {formatCurrency(monthlyData?.expenses || 0, selectedCurrency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Expense Categories */}
        <View className="mx-6 mt-6">
          <View className="flex-row items-center justify-center mb-3">
            <Text className="text-lg font-semibold text-gray-900">Spending Categories</Text>
            <TouchableOpacity 
              className="ml-2 p-1"
              onPress={handleToggleEditMode}
            >
              <Ionicons 
                name="pencil" 
                size={20} 
                color={isEditMode ? "#2563eb" : "#6b7280"} 
              />
            </TouchableOpacity>
          </View>
          
          {isEditMode && (
            <Text className="text-sm text-gray-600 text-center mb-3">
              Tap any category to edit or delete
            </Text>
          )}
          
          <View className="flex-row flex-wrap justify-center">
            {expenseCategories.map((category) => (
              <ExpenseCategory
                key={category.id}
                category={category}
                onPress={() => handleCategoryPress(category.id, category.name)}
                isEditMode={isEditMode}
                currency={selectedCurrency}
              />
            ))}
          </View>
        </View>

        {/* Add to Balance Button */}
        <View className="mx-6 mt-6">
          <TouchableOpacity className="bg-blue-600 rounded-2xl p-4 shadow-lg" onPress={handleAddToBalance}>
            <View className="flex-row items-center justify-center">
              <Ionicons name="add-circle" size={24} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">Add to Balance</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom padding for scroll */}
        <View className="h-6" />
      </ScrollView>

      {/* Modals */}
      <ExpenseModal
        isVisible={modalState.isVisible && modalState.type === 'expense'}
        onClose={handleModalClose}
        onConfirm={handleExpenseConfirm}
        categoryName={modalState.categoryId ? 
          expenseCategories.find(cat => cat.id === modalState.categoryId)?.name || '' : ''}
      />

      <AddBalanceModal
        isVisible={modalState.isVisible && modalState.type === 'balance'}
        onClose={handleModalClose}
        onConfirm={handleBalanceConfirm}
      />

      <AddCategoryModal
        isVisible={modalState.isVisible && modalState.type === 'addCategory'}
        onClose={handleModalClose}
        onConfirm={handleAddCategoryConfirm}
      />

      <EditCategoryModal
        isVisible={modalState.isVisible && modalState.type === 'editCategory'}
        onClose={handleModalClose}
        onConfirm={handleEditCategoryConfirm}
        onDelete={handleCategoryDelete}
        category={editingCategory}
      />
    </>
  );
};

export default HomeScreen;
