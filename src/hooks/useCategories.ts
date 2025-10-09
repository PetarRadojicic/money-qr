import { useMemo } from "react";
import { CATEGORY_CONFIG } from "../constants/categories";
import { useFinanceStore } from "../store/finance";

export const useCategories = (
  expensesByCategory: Record<string, number>,
  formatAmount: (value: number) => string
) => {
  const customCategories = useFinanceStore((state) => state.customCategories);

  return useMemo(() => {
    const defaultCategories = CATEGORY_CONFIG.map(({ key, icon, color }) => ({
      key,
      icon,
      color,
      amountLabel: formatAmount(expensesByCategory[key] ?? 0),
    }));

    const customCategoryItems = customCategories.map((category) => ({
      key: category.id as any,
      icon: category.icon,
      color: category.color,
      amountLabel: formatAmount(expensesByCategory[category.id] ?? 0),
      customName: category.name,
    }));

    return [...defaultCategories, ...customCategoryItems];
  }, [expensesByCategory, customCategories, formatAmount]);
};

