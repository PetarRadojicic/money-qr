import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

export type FinanceState = {
  totalBalance: number;
  monthlyData: Record<MonthKey, MonthlyFinance>;
  customCategories: CustomCategory[];
  addIncome: (payload: { amount: number; month: number; year: number }) => void;
  addExpense: (payload: { amount: number; category: CategoryKey | string; month: number; year: number }) => void;
  addCustomCategory: (category: Omit<CustomCategory, "id">) => void;
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
            totalBalance: state.totalBalance + amount,
            monthlyData: {
              ...state.monthlyData,
              [key]: {
                ...monthData,
                income: monthData.income + amount,
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
            totalBalance: state.totalBalance - amount,
            monthlyData: {
              ...state.monthlyData,
              [key]: {
                ...monthData,
                expenses: {
                  ...monthData.expenses,
                  [category]: currentCategoryTotal + amount,
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


