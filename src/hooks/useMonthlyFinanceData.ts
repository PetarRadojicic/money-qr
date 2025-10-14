import { useMemo } from "react";
import { dinero, add, toSnapshot } from "dinero.js";
import { USD } from "@dinero.js/currencies";
import { useFinanceStore } from "../store/finance";
import { usePreferencesStore } from "../store/preferences";
import { formatCurrency } from "../utils/format";

// Safe addition helper using Dinero.js
const safeAdd = (a: number, b: number): number => {
  const toMinorUnits = (amount: number) => Math.round(amount * Math.pow(10, USD.exponent));
  const toDecimal = (minorUnits: number) => minorUnits / Math.pow(10, USD.exponent);
  
  const dineroA = dinero({ amount: toMinorUnits(a), currency: USD });
  const dineroB = dinero({ amount: toMinorUnits(b), currency: USD });
  const result = add(dineroA, dineroB);
  return toDecimal(toSnapshot(result).amount);
};

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
  const expensesTotal = Object.values(expensesByCategory).reduce<number>((sum, value) => safeAdd(sum, value), 0);

  const formatAmount = (value: number) => formatCurrency(value, currency);

  return {
    monthKey,
    totalBalance,
    incomeTotal,
    expensesTotal,
    expensesByCategory,
    formatAmount,
  };
};

