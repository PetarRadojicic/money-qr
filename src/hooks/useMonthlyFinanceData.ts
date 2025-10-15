import { useMemo } from "react";
import { useFinanceStore } from "../store/finance";
import { usePreferencesStore } from "../store/preferences";
import { formatMoney, sum } from "../utils/money";

export const useMonthlyFinanceData = (selectedDate: { month: number; year: number }) => {
  const monthlyData = useFinanceStore((state) => state.monthlyData);
  const totalBalance = useFinanceStore((state) => state.totalBalance);
  const currency = usePreferencesStore((state) => state.currency);

  const monthKey = useMemo(
    () => `${selectedDate.year}-${(selectedDate.month + 1).toString().padStart(2, "0")}`,
    [selectedDate.month, selectedDate.year]
  );

  const activeMonthData = monthlyData[monthKey as `${number}-${string}`];

  const incomeTotal = activeMonthData?.income ?? 0;
  const expensesByCategory = activeMonthData?.expenses ?? {};
  
  // Use dinero.js sum for safe addition
  const expensesTotal = sum(Object.values(expensesByCategory), currency);

  const formatAmount = (value: number) => formatMoney(value, currency);

  return {
    monthKey,
    totalBalance,
    incomeTotal,
    expensesTotal,
    expensesByCategory,
    formatAmount,
  };
};
