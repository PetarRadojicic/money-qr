import { AppData, MonthlyData, Transaction, HistoryData } from '../types';
import { calculateBalance, getCurrentMonthKey, getMonthName } from './dataManager';

export interface TrendData {
  monthKey: string;
  monthName: string;
  value: number;
  change: number;
  changePercentage: number;
}

export interface CategoryTrend {
  categoryId: string;
  categoryName: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
  currentMonthAmount: number;
  previousMonthAmount: number;
}

export interface SpendingPattern {
  dayOfWeek: { [key: string]: number };
  timeOfDay: { [key: string]: number };
  weeklyAverage: number;
  monthlyPeak: string;
}

export interface BudgetRecommendation {
  categoryId: string;
  categoryName: string;
  currentSpend: number;
  recommendedBudget: number;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

// (Removed) FinancialHealth interface and related calculation

/**
 * Calculate income and expense trends over time
 */
export const calculateTrends = (appData: AppData, months: number = 6): {
  incomeTrend: TrendData[];
  expenseTrend: TrendData[];
  balanceTrend: TrendData[];
} => {
  const sortedMonths = Object.keys(appData).sort();
  const recentMonths = sortedMonths.slice(-months);
  
  const incomeTrend: TrendData[] = [];
  const expenseTrend: TrendData[] = [];
  const balanceTrend: TrendData[] = [];
  
  recentMonths.forEach((monthKey, index) => {
    const monthData = appData[monthKey];
    const previousMonthData = index > 0 ? appData[recentMonths[index - 1]] : null;
    
    // Income trend
    const incomeChange = previousMonthData ? monthData.income - previousMonthData.income : 0;
    const incomeChangePercentage = previousMonthData && previousMonthData.income > 0 
      ? (incomeChange / previousMonthData.income) * 100 : 0;
    
    incomeTrend.push({
      monthKey,
      monthName: getMonthName(monthKey),
      value: monthData.income,
      change: incomeChange,
      changePercentage: incomeChangePercentage
    });
    
    // Expense trend
    const expenseChange = previousMonthData ? monthData.expenses - previousMonthData.expenses : 0;
    const expenseChangePercentage = previousMonthData && previousMonthData.expenses > 0 
      ? (expenseChange / previousMonthData.expenses) * 100 : 0;
    
    expenseTrend.push({
      monthKey,
      monthName: getMonthName(monthKey),
      value: monthData.expenses,
      change: expenseChange,
      changePercentage: expenseChangePercentage
    });
    
    // Balance trend
    const balance = calculateBalance(monthData);
    const previousBalance = previousMonthData ? calculateBalance(previousMonthData) : 0;
    const balanceChange = balance - previousBalance;
    const balanceChangePercentage = previousBalance !== 0 
      ? (balanceChange / Math.abs(previousBalance)) * 100 : 0;
    
    balanceTrend.push({
      monthKey,
      monthName: getMonthName(monthKey),
      value: balance,
      change: balanceChange,
      changePercentage: balanceChangePercentage
    });
  });
  
  return { incomeTrend, expenseTrend, balanceTrend };
};

/**
 * Analyze category spending trends
 */
export const analyzeCategoryTrends = (
  appData: AppData, 
  historyData: HistoryData
): CategoryTrend[] => {
  const sortedMonths = Object.keys(appData).sort();
  if (sortedMonths.length < 2) return [];
  
  const currentMonth = sortedMonths[sortedMonths.length - 1];
  const previousMonth = sortedMonths[sortedMonths.length - 2];
  
  const currentMonthData = appData[currentMonth];
  const previousMonthData = appData[previousMonth];
  
  const trends: CategoryTrend[] = [];
  
  // Get all categories from both months
  const allCategories = new Set([
    ...Object.keys(currentMonthData.categories),
    ...Object.keys(previousMonthData.categories)
  ]);
  
  allCategories.forEach(categoryId => {
    const currentAmount = currentMonthData.categories[categoryId] || 0;
    const previousAmount = previousMonthData.categories[categoryId] || 0;
    
    if (currentAmount === 0 && previousAmount === 0) return;
    
    const change = currentAmount - previousAmount;
    const changePercentage = previousAmount > 0 ? (change / previousAmount) * 100 : 
                            currentAmount > 0 ? 100 : 0;
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (Math.abs(changePercentage) > 10) {
      trend = changePercentage > 0 ? 'increasing' : 'decreasing';
    }
    
    const categoryName = getCategoryNameFromTransactions(categoryId, historyData.transactions);
    
    trends.push({
      categoryId,
      categoryName,
      trend,
      changePercentage,
      currentMonthAmount: currentAmount,
      previousMonthAmount: previousAmount
    });
  });
  
  return trends.sort((a, b) => Math.abs(b.changePercentage) - Math.abs(a.changePercentage));
};

/**
 * Analyze spending patterns from transaction history
 */
export const analyzeSpendingPatterns = (historyData: HistoryData): SpendingPattern => {
  const dayOfWeek: { [key: string]: number } = {
    'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0,
    'Thursday': 0, 'Friday': 0, 'Saturday': 0
  };
  
  const timeOfDay: { [key: string]: number } = {
    'Morning': 0, 'Afternoon': 0, 'Evening': 0, 'Night': 0
  };
  
  const weeklyTotals: { [week: string]: number } = {};
  const monthlyTotals: { [month: string]: number } = {};
  
  historyData.transactions
    .filter(t => t.type === 'expense' && !t.isReverted)
    .forEach(transaction => {
      const date = new Date(transaction.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const hour = date.getHours();
      
      // Day of week analysis
      dayOfWeek[dayName] += transaction.amount;
      
      // Time of day analysis
      if (hour >= 6 && hour < 12) timeOfDay['Morning'] += transaction.amount;
      else if (hour >= 12 && hour < 17) timeOfDay['Afternoon'] += transaction.amount;
      else if (hour >= 17 && hour < 22) timeOfDay['Evening'] += transaction.amount;
      else timeOfDay['Night'] += transaction.amount;
      
      // Weekly analysis
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      weeklyTotals[weekKey] = (weeklyTotals[weekKey] || 0) + transaction.amount;
      
      // Monthly analysis
      const monthKey = transaction.monthKey;
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + transaction.amount;
    });
  
  const weeklyAmounts = Object.values(weeklyTotals);
  const weeklyAverage = weeklyAmounts.length > 0 ? 
    weeklyAmounts.reduce((sum, amount) => sum + amount, 0) / weeklyAmounts.length : 0;
  
  const monthlyPeak = Object.entries(monthlyTotals)
    .reduce((peak, [month, amount]) => amount > peak.amount ? { month, amount } : peak, 
            { month: '', amount: 0 }).month;
  
  return {
    dayOfWeek,
    timeOfDay,
    weeklyAverage,
    monthlyPeak: monthlyPeak ? getMonthName(monthlyPeak) : 'N/A'
  };
};

/**
 * Generate budget recommendations based on spending history
 */
export const generateBudgetRecommendations = (
  appData: AppData, 
  historyData: HistoryData,
  months: number = 6
): BudgetRecommendation[] => {
  const sortedMonths = Object.keys(appData).sort().slice(-months);
  const categoryTotals: { [categoryId: string]: number[] } = {};
  
  // Collect spending data for each category across months
  sortedMonths.forEach(monthKey => {
    const monthData = appData[monthKey];
    Object.entries(monthData.categories).forEach(([categoryId, amount]) => {
      if (!categoryTotals[categoryId]) categoryTotals[categoryId] = [];
      categoryTotals[categoryId].push(amount);
    });
  });
  
  const recommendations: BudgetRecommendation[] = [];
  
  Object.entries(categoryTotals).forEach(([categoryId, amounts]) => {
    if (amounts.length === 0) return;
    
    const average = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const max = Math.max(...amounts);
    const min = Math.min(...amounts);
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - average, 2), 0) / amounts.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Calculate recommended budget
    let recommendedBudget = average;
    let reasoning = '';
    let priority: 'high' | 'medium' | 'low' = 'medium';
    
    // High variance = unstable spending
    if (standardDeviation > average * 0.3) {
      recommendedBudget = average + standardDeviation;
      reasoning = 'High spending variance - budget includes buffer for fluctuations';
      priority = 'high';
    } 
    // Increasing trend
    else if (amounts.length >= 3 && amounts[amounts.length - 1] > amounts[0] * 1.2) {
      recommendedBudget = max * 1.1;
      reasoning = 'Increasing spending trend - budget set above recent peak';
      priority = 'high';
    }
    // Stable spending
    else {
      recommendedBudget = average * 1.1;
      reasoning = 'Stable spending pattern - budget set slightly above average';
      priority = 'low';
    }
    
    const categoryName = getCategoryNameFromTransactions(categoryId, historyData.transactions);
    
    recommendations.push({
      categoryId,
      categoryName,
      currentSpend: amounts[amounts.length - 1] || 0,
      recommendedBudget: Math.round(recommendedBudget),
      reasoning,
      priority
    });
  });
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

/**
 * Calculate financial health score and recommendations
 */
// (Removed) calculateFinancialHealth

/**
 * Helper function to get category name from transactions
 */
const getCategoryNameFromTransactions = (categoryId: string, transactions: Transaction[]): string => {
  const transaction = transactions.find(t => t.categoryId === categoryId);
  return transaction?.categoryName || categoryId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Calculate year-over-year comparisons
 */
export const calculateYearOverYearComparison = (appData: AppData) => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  
  const currentYearData = Object.entries(appData)
    .filter(([monthKey]) => monthKey.startsWith(currentYear.toString()))
    .reduce((acc, [, monthData]) => ({
      income: acc.income + monthData.income,
      expenses: acc.expenses + monthData.expenses
    }), { income: 0, expenses: 0 });
  
  const previousYearData = Object.entries(appData)
    .filter(([monthKey]) => monthKey.startsWith(previousYear.toString()))
    .reduce((acc, [, monthData]) => ({
      income: acc.income + monthData.income,
      expenses: acc.expenses + monthData.expenses
    }), { income: 0, expenses: 0 });
  
  const incomeChange = previousYearData.income > 0 ? 
    ((currentYearData.income - previousYearData.income) / previousYearData.income) * 100 : 0;
  
  const expenseChange = previousYearData.expenses > 0 ? 
    ((currentYearData.expenses - previousYearData.expenses) / previousYearData.expenses) * 100 : 0;
  
  return {
    currentYear: currentYearData,
    previousYear: previousYearData,
    incomeChange,
    expenseChange
  };
};

