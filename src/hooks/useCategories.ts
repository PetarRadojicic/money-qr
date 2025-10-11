import { useMemo } from "react";
import { isCategoryKey } from "../constants/categories";
import { useFinanceStore } from "../store/finance";

export const useCategories = (
  expensesByCategory: Record<string, number>,
  formatAmount: (value: number) => string
) => {
  const customCategories = useFinanceStore((state) => state.customCategories);

  return useMemo(() => {
    return customCategories.map((category) => ({
      key: category.id as any,
      icon: category.icon,
      color: category.color,
      amountLabel: formatAmount(expensesByCategory[category.id] ?? 0),
      // If the name is a translation key, don't set customName (will be translated in component)
      // Otherwise, use the custom name
      customName: isCategoryKey(category.name as any) ? undefined : category.name,
    }));
  }, [expensesByCategory, customCategories, formatAmount]);
};

