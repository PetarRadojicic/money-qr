import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { CATEGORY_KEYS, CATEGORY_CONFIG, type CategoryKey } from "../constants/categories";
import { formatMoney, add, subtract } from "../utils/money";

// Generate unique IDs using crypto.getRandomValues if available, fallback to Date + random
const generateId = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  let randomPart: string;

  try {
    // Use crypto.getRandomValues if available (React Native doesn't have crypto in all environments)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(8);
      crypto.getRandomValues(array);
      randomPart = Array.from(array, byte => byte.toString(36)).join('').slice(0, 8);
    } else {
      // Fallback for environments without crypto
      randomPart = Math.random().toString(36).slice(2, 10);
    }
  } catch {
    // Final fallback
    randomPart = Math.random().toString(36).slice(2, 10);
  }

  return `${prefix}_${timestamp}_${randomPart}`;
};

export type MonthKey = `${number}-${string}`;

export type CustomCategory = {
  id: string;
  name: string; // Can be a translation key for default categories or custom name for user categories
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
};

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category?: CategoryKey | string;
  date: string; // ISO date string
  month: number;
  year: number;
  monthKey: MonthKey;
};

type MonthlyFinance = {
  income: number;
  expenses: Record<CategoryKey | string, number>;
};

const createEmptyMonth = (): MonthlyFinance => ({
  income: 0,
  expenses: CATEGORY_KEYS.reduce<MonthlyFinance["expenses"]>((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as MonthlyFinance["expenses"]),
});

const getMonthKey = ({ month, year }: { month: number; year: number }): MonthKey => {
  const normalizedMonth = month + 1;
  const monthLabel = normalizedMonth.toString().padStart(2, "0");
  return `${year}-${monthLabel}` as MonthKey;
};

// Note: All monetary calculations use dinero.js through the money utils
// Amounts are stored as decimals and converted to/from dinero for calculations

export type FinanceState = {
  totalBalance: number;
  monthlyData: Record<MonthKey, MonthlyFinance>;
  customCategories: CustomCategory[];
  transactions: Transaction[];
  addIncome: (payload: { amount: number; month: number; year: number }) => void;
  addExpense: (payload: { amount: number; category: CategoryKey | string; month: number; year: number }) => void;
  addCustomCategory: (category: Omit<CustomCategory, "id">) => void;
  updateCustomCategory: (categoryId: string, updates: Omit<CustomCategory, "id">) => void;
  deleteCustomCategory: (categoryId: string) => void;
  revertTransaction: (transactionId: string) => void;
  updateFinancialData: (payload: { totalBalance: number; monthlyData: Record<MonthKey, MonthlyFinance>; transactions?: Transaction[] }) => void;
  resetFinanceData: () => void;
};

// Initialize default categories as regular categories on first load
const initializeDefaultCategories = (): CustomCategory[] => {
  return CATEGORY_CONFIG.map(({ key, icon, color }) => ({
    id: key, // Use the category key as the ID for default categories
    name: key, // Store the translation key as the name (will be translated in UI)
    icon,
    color,
  }));
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      totalBalance: 0,
      monthlyData: {},
      customCategories: initializeDefaultCategories(),
      transactions: [],
      addIncome: ({ amount, month, year }) =>
        set((state) => {
          if (!Number.isFinite(amount) || amount <= 0) {
            return state;
          }

          const key = getMonthKey({ month, year });
          const monthData = state.monthlyData[key] ?? createEmptyMonth();

          const transaction: Transaction = {
            id: generateId("income"),
            type: "income",
            amount,
            date: new Date().toISOString(),
            month,
            year,
            monthKey: key,
          };

          return {
            totalBalance: add(state.totalBalance, amount),
            monthlyData: {
              ...state.monthlyData,
              [key]: {
                ...monthData,
                income: add(monthData.income, amount),
              },
            },
            transactions: [transaction, ...state.transactions],
          } satisfies Partial<FinanceState>;
        }),
      addExpense: ({ amount, category, month, year }) =>
        set((state) => {
          if (!Number.isFinite(amount) || amount <= 0) {
            return state;
          }

          const categoryExists = state.customCategories.some((c) => c.id === category) ||
                                 CATEGORY_KEYS.includes(category as CategoryKey);

          if (!categoryExists) {
            return state;
          }

          const key = getMonthKey({ month, year });
          const monthData = state.monthlyData[key] ?? createEmptyMonth();
          const currentCategoryTotal = monthData.expenses[category] ?? 0;

          const transaction: Transaction = {
            id: generateId("expense"),
            type: "expense",
            amount,
            category,
            date: new Date().toISOString(),
            month,
            year,
            monthKey: key,
          };

          return {
            totalBalance: subtract(state.totalBalance, amount),
            monthlyData: {
              ...state.monthlyData,
              [key]: {
                ...monthData,
                expenses: {
                  ...monthData.expenses,
                  [category]: add(currentCategoryTotal, amount),
                },
              },
            },
            transactions: [transaction, ...state.transactions],
          } satisfies Partial<FinanceState>;
        }),
      addCustomCategory: (category) =>
        set((state) => ({
          customCategories: [
            ...state.customCategories,
            {
              ...category,
              id: generateId("custom"),
            },
          ],
        })),
      updateCustomCategory: (categoryId, updates) =>
        set((state) => ({
          customCategories: state.customCategories.map((cat) =>
            cat.id === categoryId ? { id: categoryId, ...updates } : cat
          ),
        })),
      deleteCustomCategory: (categoryId) =>
        set((state) => ({
          customCategories: state.customCategories.filter((cat) => cat.id !== categoryId),
        })),
      revertTransaction: (transactionId) =>
        set((state) => {
          const transaction = state.transactions.find((t) => t.id === transactionId);
          if (!transaction) {
            return state;
          }

          const key = transaction.monthKey;
          const monthData = state.monthlyData[key] ?? createEmptyMonth();

          if (transaction.type === "income") {
            return {
              totalBalance: subtract(state.totalBalance, transaction.amount),
              monthlyData: {
                ...state.monthlyData,
                [key]: {
                  ...monthData,
                  income: subtract(monthData.income, transaction.amount),
                },
              },
              transactions: state.transactions.filter((t) => t.id !== transactionId),
            } satisfies Partial<FinanceState>;
          } else {
            // expense
            const category = transaction.category;
            if (!category) {
              console.warn(`Transaction ${transactionId} has no category, cannot revert`);
              return state;
            }
            
            const currentCategoryTotal = monthData.expenses[category] ?? 0;

            return {
              totalBalance: add(state.totalBalance, transaction.amount),
              monthlyData: {
                ...state.monthlyData,
                [key]: {
                  ...monthData,
                  expenses: {
                    ...monthData.expenses,
                    [category]: subtract(currentCategoryTotal, transaction.amount),
                  },
                },
              },
              transactions: state.transactions.filter((t) => t.id !== transactionId),
            } satisfies Partial<FinanceState>;
          }
        }),
      updateFinancialData: ({ totalBalance, monthlyData, transactions }) =>
        set((state) => ({
          totalBalance,
          monthlyData,
          transactions: transactions ?? state.transactions,
        })),
      resetFinanceData: () =>
        set({
          totalBalance: 0,
          monthlyData: {},
          customCategories: initializeDefaultCategories(),
          transactions: [],
        }),
    }),
    {
      name: "finance",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ totalBalance, monthlyData, customCategories, transactions }) => ({
        totalBalance,
        monthlyData,
        customCategories,
        transactions,
      }),
    }
  )
);

export const buildMonthKey = getMonthKey;

