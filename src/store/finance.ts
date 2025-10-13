import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dinero, add, subtract, toSnapshot } from "dinero.js";
import { USD } from "@dinero.js/currencies";

import { CATEGORY_KEYS, CATEGORY_CONFIG, type CategoryKey } from "../constants/categories";

export type MonthKey = `${number}-${string}`;

export type CustomCategory = {
  id: string;
  name: string;
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

// Helper functions for safe money arithmetic using Dinero.js
const toMinorUnits = (amount: number): number => {
  return Math.round(amount * Math.pow(10, USD.exponent));
};

const toDecimal = (minorUnits: number): number => {
  return minorUnits / Math.pow(10, USD.exponent);
};

const safeAdd = (a: number, b: number): number => {
  const dineroA = dinero({ amount: toMinorUnits(a), currency: USD });
  const dineroB = dinero({ amount: toMinorUnits(b), currency: USD });
  const result = add(dineroA, dineroB);
  return toDecimal(toSnapshot(result).amount);
};

const safeSubtract = (a: number, b: number): number => {
  const dineroA = dinero({ amount: toMinorUnits(a), currency: USD });
  const dineroB = dinero({ amount: toMinorUnits(b), currency: USD });
  const result = subtract(dineroA, dineroB);
  return toDecimal(toSnapshot(result).amount);
};

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
    name: key, // Store the translation key as the name
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
            id: `income_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "income",
            amount,
            date: new Date().toISOString(),
            month,
            year,
            monthKey: key,
          };

          return {
            totalBalance: safeAdd(state.totalBalance, amount),
            monthlyData: {
              ...state.monthlyData,
              [key]: {
                ...monthData,
                income: safeAdd(monthData.income, amount),
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

          const categoryExists = state.customCategories.some((c) => c.id === category);

          if (!categoryExists) {
            return state;
          }

          const key = getMonthKey({ month, year });
          const monthData = state.monthlyData[key] ?? createEmptyMonth();
          const currentCategoryTotal = monthData.expenses[category] ?? 0;

          const transaction: Transaction = {
            id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "expense",
            amount,
            category,
            date: new Date().toISOString(),
            month,
            year,
            monthKey: key,
          };

          return {
            totalBalance: safeSubtract(state.totalBalance, amount),
            monthlyData: {
              ...state.monthlyData,
              [key]: {
                ...monthData,
                expenses: {
                  ...monthData.expenses,
                  [category]: safeAdd(currentCategoryTotal, amount),
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
              id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
              totalBalance: safeSubtract(state.totalBalance, transaction.amount),
              monthlyData: {
                ...state.monthlyData,
                [key]: {
                  ...monthData,
                  income: safeSubtract(monthData.income, transaction.amount),
                },
              },
              transactions: state.transactions.filter((t) => t.id !== transactionId),
            } satisfies Partial<FinanceState>;
          } else {
            // expense
            const category = transaction.category!;
            const currentCategoryTotal = monthData.expenses[category] ?? 0;

            return {
              totalBalance: safeAdd(state.totalBalance, transaction.amount),
              monthlyData: {
                ...state.monthlyData,
                [key]: {
                  ...monthData,
                  expenses: {
                    ...monthData.expenses,
                    [category]: safeSubtract(currentCategoryTotal, transaction.amount),
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


