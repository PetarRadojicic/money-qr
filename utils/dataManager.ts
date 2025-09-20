import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, MonthlyData, Transaction, HistoryData } from '../types';

const STORAGE_KEY = 'money_tracker_data';
const HISTORY_STORAGE_KEY = 'transaction_history';

// Helper function to get current month key (YYYY-MM format)
export const getCurrentMonthKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Helper function to get month name from key
export const getMonthName = (monthKey: string): string => {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
};

// Helper function to get previous/next month key
export const getAdjacentMonthKey = (currentKey: string, direction: 'prev' | 'next'): string => {
  const [year, month] = currentKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  
  if (direction === 'prev') {
    date.setMonth(date.getMonth() - 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${newYear}-${newMonth}`;
};

// Initialize default monthly data
export const createDefaultMonthlyData = (): MonthlyData => ({
  income: 0,
  expenses: 0,
  categories: {},
});

// Custom categories storage key
const CUSTOM_CATEGORIES_KEY = 'custom_categories';

// Load custom categories
export const loadCustomCategories = async (): Promise<{[key: string]: any}> => {
  try {
    const data = await AsyncStorage.getItem(CUSTOM_CATEGORIES_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Error loading custom categories:', error);
    return {};
  }
};

// Save custom categories
export const saveCustomCategories = async (categories: {[key: string]: any}): Promise<void> => {
  try {
    await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving custom categories:', error);
  }
};

// Get or create modified categories (for default categories that have been edited)
export const getModifiedCategories = async (): Promise<{[key: string]: any}> => {
  try {
    const data = await AsyncStorage.getItem('modified_categories');
    if (data) {
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Error loading modified categories:', error);
    return {};
  }
};

// Save modified categories
export const saveModifiedCategories = async (categories: {[key: string]: any}): Promise<void> => {
  try {
    await AsyncStorage.setItem('modified_categories', JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving modified categories:', error);
  }
};

// Get or create hidden categories (for default categories that have been deleted)
export const getHiddenCategories = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem('hidden_categories');
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading hidden categories:', error);
    return [];
  }
};

// Save hidden categories
export const saveHiddenCategories = async (categoryIds: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem('hidden_categories', JSON.stringify(categoryIds));
  } catch (error) {
    console.error('Error saving hidden categories:', error);
  }
};

// Load data from AsyncStorage
export const loadData = async (): Promise<AppData> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Error loading data:', error);
    return {};
  }
};

// Save data to AsyncStorage
export const saveData = async (data: AppData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Get or create monthly data
export const getMonthlyData = async (monthKey: string): Promise<MonthlyData> => {
  const data = await loadData();
  if (!data[monthKey]) {
    data[monthKey] = createDefaultMonthlyData();
    await saveData(data);
  }
  return data[monthKey];
};

// Update monthly data
export const updateMonthlyData = async (monthKey: string, updates: Partial<MonthlyData>): Promise<void> => {
  const data = await loadData();
  if (!data[monthKey]) {
    data[monthKey] = createDefaultMonthlyData();
  }
  
  data[monthKey] = { ...data[monthKey], ...updates };
  
  // Recalculate totals
  const categories = data[monthKey].categories;
  data[monthKey].expenses = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
  
  await saveData(data);
};

// Recalculate expenses for a specific month
export const recalculateMonthlyExpenses = async (monthKey: string): Promise<void> => {
  const data = await loadData();
  if (data[monthKey]) {
    const categories = data[monthKey].categories;
    data[monthKey].expenses = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
    await saveData(data);
  }
};

// Calculate balance for a month
export const calculateBalance = (monthlyData: MonthlyData): number => {
  return monthlyData.income - monthlyData.expenses;
};

// Calculate total balance across all months
export const calculateTotalBalance = async (): Promise<number> => {
  const data = await loadData();
  let total = 0;
  
  Object.values(data).forEach(monthlyData => {
    total += calculateBalance(monthlyData);
  });
  
  return total;
};

// Transaction History Functions
export const loadTransactionHistory = async (): Promise<HistoryData> => {
  try {
    const data = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return { transactions: [] };
  } catch (error) {
    console.error('Error loading transaction history:', error);
    return { transactions: [] };
  }
};

export const saveTransactionHistory = async (history: HistoryData): Promise<void> => {
  try {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving transaction history:', error);
  }
};

export const addTransaction = async (transaction: Transaction): Promise<void> => {
  const history = await loadTransactionHistory();
  history.transactions.unshift(transaction); // Add to beginning (most recent first)
  await saveTransactionHistory(history);
};

export const revertTransaction = async (transactionId: string): Promise<boolean> => {
  const history = await loadTransactionHistory();
  const transactionIndex = history.transactions.findIndex(t => t.id === transactionId);
  
  if (transactionIndex === -1) {
    return false;
  }
  
  const transaction = history.transactions[transactionIndex];
  
  if (transaction.isReverted) {
    return false; // Already reverted
  }
  
  // Mark as reverted
  history.transactions[transactionIndex].isReverted = true;
  await saveTransactionHistory(history);
  
  // Update the actual data
  const data = await loadData();
  const monthlyData = data[transaction.monthKey];
  
  if (monthlyData) {
    if (transaction.type === 'income') {
      monthlyData.income = Math.max(0, monthlyData.income - transaction.amount);
    } else {
      if (monthlyData.categories[transaction.categoryId]) {
        monthlyData.categories[transaction.categoryId] = Math.max(0, 
          monthlyData.categories[transaction.categoryId] - transaction.amount
        );
      }
    }
    
    // Recalculate expenses
    monthlyData.expenses = Object.values(monthlyData.categories).reduce((sum, amount) => sum + amount, 0);
    
    await saveData(data);
  }
  
  return true;
};

// Reset all app data
export const resetAppData = async (): Promise<void> => {
  try {
    // Clear all AsyncStorage keys
    await AsyncStorage.multiRemove([
      STORAGE_KEY,
      HISTORY_STORAGE_KEY,
      CUSTOM_CATEGORIES_KEY,
      'modified_categories',
      'hidden_categories'
    ]);
  } catch (error) {
    console.error('Error resetting app data:', error);
    throw error;
  }
};
