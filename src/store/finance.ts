import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dinero, add, subtract, toSnapshot } from "dinero.js";
import { USD } from "@dinero.js/currencies";

import { CATEGORY_KEYS, type CategoryKey } from "../constants/categories";

export type MonthKey = `${number}-${string}`;

export type CustomCategory = {
  id: string;
  name: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
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
  addIncome: (payload: { amount: number; month: number; year: number }) => void;
  addExpense: (payload: { amount: number; category: CategoryKey | string; month: number; year: number }) => void;
  addCustomCategory: (category: Omit<CustomCategory, "id">) => void;
  updateFinancialData: (payload: { totalBalance: number; monthlyData: Record<MonthKey, MonthlyFinance> }) => void;
  resetFinanceData: () => void;
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      totalBalance: 0,
      monthlyData: {},
      customCategories: [],
      addIncome: ({ amount, month, year }) =>
        set((state) => {
          if (!Number.isFinite(amount) || amount <= 0) {
            return state;
          }

          const key = getMonthKey({ month, year });
          const monthData = state.monthlyData[key] ?? createEmptyMonth();

          return {
            totalBalance: safeAdd(state.totalBalance, amount),
            monthlyData: {
              ...state.monthlyData,
              [key]: {
                ...monthData,
                income: safeAdd(monthData.income, amount),
              },
            },
          } satisfies Partial<FinanceState>;
        }),
      addExpense: ({ amount, category, month, year }) =>
        set((state) => {
          if (!Number.isFinite(amount) || amount <= 0) {
            return state;
          }

          const isDefaultCategory = CATEGORY_KEYS.includes(category as CategoryKey);
          const isCustomCategory = state.customCategories.some((c) => c.id === category);

          if (!isDefaultCategory && !isCustomCategory) {
            return state;
          }

          const key = getMonthKey({ month, year });
          const monthData = state.monthlyData[key] ?? createEmptyMonth();
          const currentCategoryTotal = monthData.expenses[category] ?? 0;

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
      updateFinancialData: ({ totalBalance, monthlyData }) =>
        set({
          totalBalance,
          monthlyData,
        }),
      resetFinanceData: () =>
        set({
          totalBalance: 0,
          monthlyData: {},
          customCategories: [],
        }),
    }),
    {
      name: "finance",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ totalBalance, monthlyData, customCategories }) => ({
        totalBalance,
        monthlyData,
        customCategories,
      }),
    }
  )
);

export const buildMonthKey = getMonthKey;


