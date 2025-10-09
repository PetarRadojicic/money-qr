import { useMemo } from "react";
import { useFinanceStore } from "../store/finance";
import { formatCurrency } from "../utils/format";

export const useMonthlyFinanceData = (selectedDate: { month: number; year: number }) => {
  const monthlyData = useFinanceStore((state) => state.monthlyData);
  const totalBalance = useFinanceStore((state) => state.totalBalance);

  const monthKey = useMemo(
    () => `${selectedDate.year}-${(selectedDate.month + 1).toString().padStart(2, "0")}`,
    [selectedDate.month, selectedDate.year]
  );

  const activeMonthData = monthlyData[monthKey as keyof typeof monthlyData];

  const incomeTotal = activeMonthData?.income ?? 0;
  const expensesByCategory = activeMonthData?.expenses ?? {};
  const expensesTotal = Object.values(expensesByCategory).reduce<number>((sum, value) => sum + value, 0);

  const formatAmount = (value: number) => (value === 0 ? "0" : formatCurrency(value));

  return {
    monthKey,
    totalBalance,
    incomeTotal,
    expensesTotal,
    expensesByCategory,
    formatAmount,
  };
};

