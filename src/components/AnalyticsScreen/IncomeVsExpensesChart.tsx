import { View, Text, Dimensions, ScrollView } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";
import { usePreferencesStore } from "../../store/preferences";
import { useTranslation } from "../../hooks/useTranslation";
import type { TimePeriod } from "./TimePeriodSelector";

interface IncomeVsExpensesChartProps {
  filteredTransactions: any[];
  selectedPeriod: TimePeriod;
}

type MonthData = {
  income: number;
  expenses: number;
  monthKey: string;
};

const IncomeVsExpensesChart = ({
  filteredTransactions,
  selectedPeriod,
}: IncomeVsExpensesChartProps) => {
  const theme = usePreferencesStore((state) => state.theme);
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const screenWidth = Dimensions.get("window").width;

  // Group transactions by month
  const dataByMonth = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { income: 0, expenses: 0, monthKey };
    }
    
    if (transaction.type === "income") {
      acc[monthKey].income += transaction.amount;
    } else {
      acc[monthKey].expenses += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, MonthData>);

  // Sort by month and show last 6 months max for readability
  const sortedData = (Object.values(dataByMonth) as MonthData[])
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .slice(-6);

  if (sortedData.length === 0) {
    return (
      <View
        className={`mx-5 rounded-3xl p-6 ${isDark ? "bg-slate-900" : "bg-white"}`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <Text
          className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {t("incomeVsExpenses")}
        </Text>
        <Text
          className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}
        >
          {t("noTransactionsData")}
        </Text>
      </View>
    );
  }

  // Format month labels (e.g., "Jan", "Feb")
  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  // Prepare data for chart
  const labels = sortedData.map((item) => formatMonthLabel(item.monthKey));

  const chartData = {
    labels,
    legend: [t("income"), t("expenses")],
    data: sortedData.map((item) => [item.income, item.expenses]),
    barColors: ["#22c55e", "#ef4444"], // green for income, red for expenses
  };

  const chartConfig = {
    backgroundColor: isDark ? "#0f172a" : "#ffffff",
    backgroundGradientFrom: isDark ? "#1e293b" : "#ffffff",
    backgroundGradientTo: isDark ? "#0f172a" : "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => (isDark ? `rgba(148, 163, 184, ${opacity})` : `rgba(71, 85, 105, ${opacity})`),
    labelColor: (opacity = 1) => (isDark ? `rgba(203, 213, 225, ${opacity})` : `rgba(71, 85, 105, ${opacity})`),
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 11,
      fontWeight: "600",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: isDark ? "#334155" : "#e2e8f0",
      strokeWidth: 1,
    },
  };

  return (
    <View
      className={`mx-5 rounded-3xl p-6 ${isDark ? "bg-slate-900" : "bg-white"}`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <Text
        className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
      >
        {t("incomeVsExpenses")}
      </Text>

      {/* Legend */}
      <View className="flex-row justify-center gap-6 mb-4">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full mr-2 bg-emerald-500" />
          <Text
            className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            {t("income")}
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full mr-2 bg-red-500" />
          <Text
            className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            {t("expenses")}
          </Text>
        </View>
      </View>

      {/* Stacked Bar Chart */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="-mx-3"
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        <StackedBarChart
          data={chartData}
          width={Math.max(screenWidth - 80, sortedData.length * 80)}
          height={220}
          chartConfig={chartConfig}
          style={{
            borderRadius: 16,
          }}
          hideLegend={true}
          segments={4}
        />
      </ScrollView>
    </View>
  );
};

export default IncomeVsExpensesChart;
