import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ExpenseCategory from './components/ExpenseCategory';
import ExpenseModal from './components/ExpenseModal';
import AddBalanceModal from './components/AddBalanceModal';
import AddCategoryModal from './components/AddCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';
import { createExpenseCategories } from './constants/expenseCategories';
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
  recalculateMonthlyExpenses,
  addTransaction,
} from './utils/dataManager';
import { MonthlyData, ModalState, CustomCategory, Transaction } from './types';
import HistoryScreen from './components/HistoryScreen';
import SettingsScreen from './components/SettingsScreen';
import './global.css';

export default function App() {
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
  const [currentScreen, setCurrentScreen] = useState<'home' | 'history' | 'settings'>('home');

  // Load data on component mount and when month changes
  useEffect(() => {
    loadMonthData();
    loadTotalBalance();
  }, [currentMonthKey]);

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
  const handlePreviousMonth = () => {
    setCurrentMonthKey(getAdjacentMonthKey(currentMonthKey, 'prev'));
  };

  const handleNextMonth = () => {
    setCurrentMonthKey(getAdjacentMonthKey(currentMonthKey, 'next'));
  };

  // Category handlers
  const handleCategoryPress = (categoryId: string, categoryName: string) => {
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
  };


  const handleCategoryDelete = async (categoryId: string) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    const categoryAmount = monthlyData?.categories[categoryId] || 0;

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?\n\nThis category has $${categoryAmount.toFixed(2)} in expenses. This action cannot be undone and the expenses will be removed from your balance calculation.`,
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
            
            await loadMonthData();
            await loadTotalBalance();
          },
        },
      ]
    );
  };

  const handleExpenseConfirm = async (amount: number) => {
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
    
    await loadMonthData();
    await loadTotalBalance();
  };

  const handleAddToBalance = () => {
    setModalState({
      isVisible: true,
      type: 'balance',
    });
  };

  const handleBalanceConfirm = async (amount: number) => {
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
    
    await loadMonthData();
    await loadTotalBalance();
  };

  const handleModalClose = () => {
    setModalState({ isVisible: false, type: null });
    setEditingCategory(null);
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleAddCategoryConfirm = async (newCategory: CustomCategory) => {
    const customCategories = await loadCustomCategories();
    customCategories[newCategory.id] = newCategory;
    await saveCustomCategories(customCategories);
    await loadMonthData();
  };

  const handleEditCategoryConfirm = async (categoryId: string, updates: Partial<CustomCategory>) => {
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
    
    await loadMonthData();
  };


  const handleNavigationPress = (tabName: string) => {
    if (tabName === 'History') {
      setCurrentScreen('history');
    } else if (tabName === 'Home') {
      setCurrentScreen('home');
    } else if (tabName === 'Settings') {
      setCurrentScreen('settings');
    }
  };

  const handleNavigateHome = () => {
    setCurrentScreen('home');
  };

  const handleDataChange = () => {
    // Refresh home screen data when history changes
    loadMonthData();
    loadTotalBalance();
  };

  const handleDataReset = () => {
    // Reset all app data and reload
    loadMonthData();
    loadTotalBalance();
    // Categories will be reloaded via loadMonthData
  };

  const isHistoryScreen = currentScreen === 'history';
  const isHomeScreen = currentScreen === 'home';
  const isSettingsScreen = currentScreen === 'settings';


  // Render different screens
  if (currentScreen === 'history') {
    return (
      <HistoryScreen 
        onNavigateHome={handleNavigateHome}
        onDataChange={handleDataChange}
      />
    );
  }

  if (currentScreen === 'settings') {
    return (
      <SettingsScreen 
        onNavigateHome={handleNavigateHome}
        onDataReset={handleDataReset}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Overall Balance Section */}
        <View className="mx-6 mt-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3 text-center">Overall Balance</Text>
          <View className="bg-blue-600 rounded-2xl p-6 shadow-lg items-center">
            <Text className="text-white text-sm opacity-90 text-center">Total Balance</Text>
            <Text className="text-white text-3xl font-bold mt-1 text-center">
              ${totalBalance.toFixed(2)}
            </Text>
            <Text className="text-green-300 text-sm mt-2 text-center">
              {monthlyData ? `Balance this month: $${calculateBalance(monthlyData).toFixed(2)}` : 'Loading...'}
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
            <Text className="text-lg font-semibold text-gray-900">{getMonthName(currentMonthKey)}</Text>
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
                ${monthlyData?.income.toFixed(2) || '0.00'}
              </Text>
            </View>
            <View className="bg-white rounded-xl p-4 ml-2 shadow-sm w-32">
              <Text className="text-gray-600 text-sm text-center">Expenses</Text>
              <Text className="text-red-600 text-xl font-bold mt-1 text-center">
                ${monthlyData?.expenses.toFixed(2) || '0.00'}
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
      
      {/* Bottom Navigation Bar */}
      <View className="bg-white border-t border-gray-200 px-4 py-2">
        <View className="flex-row justify-around items-center">
          {/* Home Tab */}
          <TouchableOpacity className="items-center py-2" onPress={() => handleNavigationPress('Home')}>
            <Ionicons name="home" size={24} color={isHomeScreen ? "#2563eb" : "#6b7280"} />
            <Text className={`text-xs mt-1 ${isHomeScreen ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Home</Text>
          </TouchableOpacity>
          
          {/* History Tab */}
          <TouchableOpacity className="items-center py-2" onPress={() => handleNavigationPress('History')}>
            <Ionicons name="time" size={24} color={isHistoryScreen ? "#2563eb" : "#6b7280"} />
            <Text className={`text-xs mt-1 ${isHistoryScreen ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>History</Text>
          </TouchableOpacity>
          
          {/* Settings Tab */}
          <TouchableOpacity className="items-center py-2" onPress={() => handleNavigationPress('Settings')}>
            <Ionicons name="settings" size={24} color={isSettingsScreen ? "#2563eb" : "#6b7280"} />
            <Text className={`text-xs mt-1 ${isSettingsScreen ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    </SafeAreaView>
  );
}
