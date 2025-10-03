import { AppData, MonthlyData, Transaction, HistoryData } from '../types';
import { calculateBalance, getCurrentMonthKey, getVisitedMonths } from './dataManager';
import { getTranslatedMonthName } from './translationUtils';

export interface MonthlyAnalytics {
  monthKey: string;
  monthName: string;
  income: number;
  expenses: number;
  balance: number;
  topCategory: { name: string; amount: number; percentage: number } | null;
  categoryCount: number;
}

export interface CategoryAnalytics {
  id: string;
  name: string;
  totalAmount: number;
  percentage: number;
  monthlyAverage: number;
  transactionCount: number;
}

export interface AnalyticsData {
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

/**
 * Get category name from transaction history or fallback to formatted ID
 */
const getCategoryName = (categoryId: string, transactions: Transaction[]): string => {
  const transaction = transactions.find(t => t.categoryId === categoryId);
  return transaction?.categoryName || categoryId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get all available month keys from multiple sources
 */
const getAllMonthKeys = async (appData: AppData, historyData: HistoryData): Promise<string[]> => {
  const existingMonthKeys = Object.keys(appData).sort();
  const visitedMonths = await getVisitedMonths();
  
  // Get months from transaction history
  const historyMonthKeys = historyData.transactions
    .map(t => t.monthKey)
    .filter((monthKey, index, arr) => arr.indexOf(monthKey) === index)
    .sort();
  
  // Merge and deduplicate
  const allMonthKeys = [...new Set([...existingMonthKeys, ...historyMonthKeys, ...visitedMonths])].sort();
  
  // Ensure we have at least current month
  if (allMonthKeys.length === 0) {
    return [getCurrentMonthKey()];
  }
  
  return allMonthKeys;
};

/**
 * Calculate monthly analytics for a single month
 */
const calculateMonthlyAnalytics = (
  monthKey: string, 
  monthData: MonthlyData, 
  historyData: HistoryData,
  translations: any
): MonthlyAnalytics => {
  const balance = calculateBalance(monthData);
  
  // Find top spending category
  const categories = Object.entries(monthData.categories);
  const topCategoryEntry = categories.length > 0 
    ? categories.reduce((top, [id, amount]) => amount > top.amount ? { id, amount } : top, { id: '', amount: 0 })
    : null;

  const topCategory = topCategoryEntry && topCategoryEntry.amount > 0 ? {
    name: getCategoryName(topCategoryEntry.id, historyData.transactions),
    amount: topCategoryEntry.amount,
    percentage: monthData.expenses > 0 ? (topCategoryEntry.amount / monthData.expenses) * 100 : 0
  } : null;

  return {
    monthKey,
    monthName: getTranslatedMonthName(monthKey, translations),
    income: monthData.income,
    expenses: monthData.expenses,
    balance,
    topCategory,
    categoryCount: Object.keys(monthData.categories).length
  };
};

/**
 * Calculate category analytics across all selected months
 */
const calculateCategoryAnalytics = (
  monthKeys: string[],
  appData: AppData,
  historyData: HistoryData
): CategoryAnalytics[] => {
  const categoryTotals: { [categoryId: string]: { amount: number; transactions: number; name: string } } = {};
  
  monthKeys.forEach(monthKey => {
    const monthData = appData[monthKey] || { income: 0, expenses: 0, categories: {} };
    
    Object.entries(monthData.categories).forEach(([categoryId, amount]) => {
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = { 
          amount: 0, 
          transactions: 0, 
          name: getCategoryName(categoryId, historyData.transactions) 
        };
      }
      categoryTotals[categoryId].amount += amount;
      
      // Count transactions for this category in this month
      const categoryTransactions = historyData.transactions.filter(
        t => t.categoryId === categoryId && 
             t.monthKey === monthKey && 
             t.type === 'expense' && 
             !t.isReverted
      );
      categoryTotals[categoryId].transactions += categoryTransactions.length;
    });
  });

  const totalExpenses = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.amount, 0);
  
  return Object.entries(categoryTotals)
    .map(([id, data]) => ({
      id,
      name: data.name,
      totalAmount: data.amount,
      percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
      monthlyAverage: data.amount / monthKeys.length,
      transactionCount: data.transactions
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
};

/**
 * Main analytics calculation function
 */
export const calculateAnalytics = async (
  appData: AppData,
  historyData: HistoryData,
  range: 'specific' | 'all',
  monthsToInclude: string[] = [],
  translations: any
): Promise<AnalyticsData> => {
  // Get all available month keys
  const allMonthKeys = await getAllMonthKeys(appData, historyData);
  
  // Filter months based on selection
  const filteredMonthKeys = range === 'specific' && monthsToInclude.length > 0
    ? monthsToInclude.filter(month => allMonthKeys.includes(month)).sort()
    : allMonthKeys;

  // Calculate monthly analytics
  const monthlyAnalytics: MonthlyAnalytics[] = filteredMonthKeys.map(monthKey => {
    const monthData = appData[monthKey] || { income: 0, expenses: 0, categories: {} };
    return calculateMonthlyAnalytics(monthKey, monthData, historyData, translations);
  });

  // Calculate category analytics
  const categoryAnalytics = calculateCategoryAnalytics(filteredMonthKeys, appData, historyData);

  // Calculate totals and averages
  const totalIncome = monthlyAnalytics.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = monthlyAnalytics.reduce((sum, month) => sum + month.expenses, 0);
  const totalBalance = monthlyAnalytics.reduce((sum, month) => sum + month.balance, 0);

  const averageMonthlyIncome = totalIncome / filteredMonthKeys.length;
  const averageMonthlyExpenses = totalExpenses / filteredMonthKeys.length;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const topSpendingCategory = categoryAnalytics.length > 0 ? categoryAnalytics[0] : null;
  const mostActiveMonth = monthlyAnalytics.reduce((most, month) => 
    month.expenses > most.expenses ? month : most, monthlyAnalytics[0] || null
  );

  return {
    totalIncome,
    totalExpenses,
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
