// Re-export types from components for easy access
export type { ExpenseCategoryData } from '../components/ExpenseCategory';

// Additional types for the app
export interface BalanceData {
  total: number;
  change: number;
  changeType: 'positive' | 'negative';
}

export interface MonthlyData {
  income: number;
  expenses: number;
  categories: {
    [categoryId: string]: number;
  };
}

export interface NavigationTab {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

export interface AppData {
  [monthKey: string]: MonthlyData;
}

export interface ModalState {
  isVisible: boolean;
  type: 'expense' | 'balance' | 'addCategory' | 'editCategory' | 'deleteCategory' | null;
  categoryId?: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  icon: {
    library: 'Ionicons' | 'MaterialIcons' | 'FontAwesome5';
    name: string;
    color: string;
  };
  backgroundColor: string;
  isCustom: boolean;
}

export interface CategoryIcon {
  name: string;
  library: 'Ionicons' | 'MaterialIcons' | 'FontAwesome5';
  category: string;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  categoryId: string;
  categoryName: string;
  monthKey: string;
  date: string; // ISO date string
  description?: string;
  isReverted?: boolean;
}

export interface HistoryData {
  transactions: Transaction[];
}
