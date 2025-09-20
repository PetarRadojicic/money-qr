// Re-export types from components for easy access
export type { ExpenseCategoryData } from '../components/ExpenseCategory';

// Additional types for the app
export interface BalanceData {
  total: string;
  change: string;
  changeType: 'positive' | 'negative';
}

export interface MonthlyData {
  income: string;
  expenses: string;
}

export interface NavigationTab {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}
