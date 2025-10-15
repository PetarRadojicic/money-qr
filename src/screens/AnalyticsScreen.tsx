import { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TimePeriodSelector, { type TimePeriod } from "../components/AnalyticsScreen/TimePeriodSelector";
import TotalsSummary from "../components/AnalyticsScreen/TotalsSummary";
import ExpensesByCategoryChart from "../components/AnalyticsScreen/ExpensesByCategoryChart";
import IncomeVsExpensesChart from "../components/AnalyticsScreen/IncomeVsExpensesChart";
import { useFinanceStore } from "../store/finance";
import { usePreferencesStore } from "../store/preferences";
import { useTranslation } from "../hooks/useTranslation";
import { formatCurrency } from "../utils/format";
import { sum } from "../utils/money";

const AnalyticsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(3);
  const theme = usePreferencesStore((state) => state.theme);
  const currency = usePreferencesStore((state) => state.currency);
  const transactions = useFinanceStore((state) => state.transactions);
  const { t, language } = useTranslation();
  const isDark = theme === "dark";

  // Helper function to get correct period form for Serbian
  const getPeriodForm = (period: number) => {
    if (language === 'sr') {
      if (period === 1) return `${period} mesec`;
      if (period >= 2 && period <= 4) return `${period} meseca`;
      return `${period} meseci`;
    }
    return period === 1 ? `${period} month` : `${period} months`;
  };

  // Calculate totals based on selected period
  const { totalIncome, totalExpenses, filteredCount, totalCount, filteredTransactions } = useMemo(() => {
    const now = new Date();
    let cutoffDate: Date;

    if (selectedPeriod === "all") {
      // Include all transactions
      cutoffDate = new Date(0);
    } else {
      // Calculate cutoff date for 3, 6, or 9 months
      cutoffDate = new Date(now);
      cutoffDate.setMonth(cutoffDate.getMonth() - selectedPeriod);
    }

    // Filter transactions by period (exclude future transactions)
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= cutoffDate && transactionDate <= now;
    });

    // Calculate totals using safe money operations
    const incomeTransactions = filteredTransactions.filter((t) => t.type === "income");
    const expenseTransactions = filteredTransactions.filter((t) => t.type === "expense");
    
    const income = sum(incomeTransactions.map(t => t.amount), currency);
    const expenses = sum(expenseTransactions.map(t => t.amount), currency);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      filteredCount: filteredTransactions.length,
      totalCount: transactions.length,
      filteredTransactions,
    };
  }, [selectedPeriod, transactions]);

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}
    >
      {/* Header */}
      <View className="px-5 py-4 border-b" style={{ borderBottomColor: isDark ? "#1e293b" : "#e2e8f0" }}>
        <Text
          className={`text-2xl font-bold text-center ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {t("analyticsTitle")}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Time Period Selector */}
        <TimePeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        {/* Info Message - Show when all transactions are in current period */}
        {filteredCount === totalCount && totalCount > 0 && selectedPeriod !== "all" && (
          <View className="px-5 py-2">
            <View
              className={`rounded-xl p-3 ${
                isDark ? "bg-blue-950/50" : "bg-blue-50"
              }`}
              style={{
                borderWidth: 1,
                borderColor: isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)",
              }}
            >
              <Text
                className={`text-xs text-center ${
                  isDark ? "text-blue-300" : "text-blue-700"
                }`}
              >
                {t("allTransactionsInPeriod", {
                  count: totalCount,
                  period: getPeriodForm(selectedPeriod),
                })}
              </Text>
            </View>
          </View>
        )}

        {/* Totals Summary */}
        <TotalsSummary
          totalIncome={formatCurrency(totalIncome, currency)}
          totalExpenses={formatCurrency(totalExpenses, currency)}
        />

        {/* Charts */}
        <View className="gap-4 mt-2">
          {/* Income vs Expenses Chart */}
          <IncomeVsExpensesChart
            filteredTransactions={filteredTransactions}
            selectedPeriod={selectedPeriod}
          />

          {/* Expenses by Category Chart */}
          <ExpensesByCategoryChart filteredTransactions={filteredTransactions} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;

