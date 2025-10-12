import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePreferencesStore } from "../../store/preferences";
import { useTranslation } from "../../hooks/useTranslation";

interface TotalsSummaryProps {
  totalIncome: string;
  totalExpenses: string;
}

const TotalsSummary = ({ totalIncome, totalExpenses }: TotalsSummaryProps) => {
  const theme = usePreferencesStore((state) => state.theme);
  const { t } = useTranslation();
  const isDark = theme === "dark";

  return (
    <View className="px-5 py-4 gap-4">
      {/* Total Income Card */}
      <View
        className={`rounded-3xl p-6 ${
          isDark ? "bg-slate-900" : "bg-white"
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {t("totalIncome")}
            </Text>
            <Text className="text-3xl font-bold text-emerald-500">
              {totalIncome}
            </Text>
          </View>
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: isDark
                ? "rgba(34, 197, 94, 0.15)"
                : "rgba(34, 197, 94, 0.1)",
            }}
          >
            <MaterialCommunityIcons
              name="trending-up"
              size={32}
              color="#22c55e"
            />
          </View>
        </View>
      </View>

      {/* Total Expenses Card */}
      <View
        className={`rounded-3xl p-6 ${
          isDark ? "bg-slate-900" : "bg-white"
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {t("totalExpenses")}
            </Text>
            <Text className="text-3xl font-bold text-red-500">
              {totalExpenses}
            </Text>
          </View>
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: isDark
                ? "rgba(248, 113, 113, 0.15)"
                : "rgba(248, 113, 113, 0.1)",
            }}
          >
            <MaterialCommunityIcons
              name="trending-down"
              size={32}
              color="#f87171"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default TotalsSummary;

