import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { usePreferencesStore } from "../../store/preferences";
import { useFinanceStore } from "../../store/finance";
import { useTranslation } from "../../hooks/useTranslation";
import { formatCurrency } from "../../utils/format";

interface ExpensesByCategoryChartProps {
  filteredTransactions: any[];
}

const ExpensesByCategoryChart = ({ filteredTransactions }: ExpensesByCategoryChartProps) => {
  const theme = usePreferencesStore((state) => state.theme);
  const currency = usePreferencesStore((state) => state.currency);
  const customCategories = useFinanceStore((state) => state.customCategories);
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const screenWidth = Dimensions.get("window").width;

  // Calculate expenses by category
  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === "expense" && t.category)
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  // Transform data for the pie chart
  const chartData = Object.entries(expensesByCategory)
    .map(([categoryId, amount]) => {
      const category = customCategories.find((c) => c.id === categoryId);
      // Try to translate if it's a known category key, otherwise use the name as-is
      let displayName = categoryId;
      if (category) {
        try {
          displayName = t(category.name as any);
        } catch {
          displayName = category.name;
        }
      }
      return {
        name: "", // Empty name to hide labels on the chart
        displayName: displayName, // For legend
        amount: amount as number,
        color: category?.color || "#64748b",
        legendFontColor: isDark ? "#cbd5e1" : "#475569",
        legendFontSize: 13,
      };
    })
    .sort((a, b) => (b.amount as number) - (a.amount as number)) // Sort by amount descending
    .slice(0, 8); // Limit to top 8 categories to avoid clutter

  if (chartData.length === 0) {
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
          {t("expensesByCategory")}
        </Text>
        <Text
          className={`text-center py-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}
        >
          {t("noExpensesData")}
        </Text>
      </View>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.amount, 0);

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
        {t("expensesByCategory")}
      </Text>

      {/* Pie Chart */}
      <View className="items-center justify-center">
        <PieChart
          data={chartData}
          width={screenWidth - 80}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[50, 0]}
          absolute={false}
          hasLegend={false}
        />
      </View>

      {/* Legend with amounts */}
      <View className="mt-4 gap-2">
        {chartData.map((item, index) => {
          const percentage = ((item.amount / total) * 100).toFixed(1);
          return (
            <View key={index} className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                />
                <Text
                  className={`text-sm font-medium flex-1 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                  numberOfLines={1}
                >
                  {item.displayName}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text
                  className={`text-xs font-medium ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {percentage}%
                </Text>
                <Text
                  className={`text-sm font-semibold ${
                    isDark ? "text-slate-200" : "text-slate-900"
                  }`}
                >
                  {formatCurrency(item.amount, currency)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ExpensesByCategoryChart;
