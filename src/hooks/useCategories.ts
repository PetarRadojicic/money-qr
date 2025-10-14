import { useMemo } from "react";
import { shouldTranslateCategoryName } from "../constants/categories";
import { useFinanceStore } from "../store/finance";

export const useCategories = (
  expensesByCategory: Record<string, number>,
  formatAmount: (value: number) => string
) => {
  const customCategories = useFinanceStore((state) => state.customCategories);

  return useMemo(() => {
    return customCategories.map((category) => ({
      key: category.id,
      icon: category.icon,
      color: category.color,
      amountLabel: formatAmount(expensesByCategory[category.id] ?? 0),
      // If the name should be translated, don't set customName (will be translated in component)
      // Otherwise, use the custom name
      customName: shouldTranslateCategoryName(category.name) ? undefined : category.name,
    }));
  }, [expensesByCategory, customCategories, formatAmount]);
};

