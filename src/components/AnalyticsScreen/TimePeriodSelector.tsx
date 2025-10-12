import { View, Text, TouchableOpacity } from "react-native";
import { usePreferencesStore } from "../../store/preferences";
import { useTranslation } from "../../hooks/useTranslation";

export type TimePeriod = 3 | 6 | 9 | "all";

interface TimePeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const TimePeriodSelector = ({ selectedPeriod, onPeriodChange }: TimePeriodSelectorProps) => {
  const theme = usePreferencesStore((state) => state.theme);
  const { t } = useTranslation();
  const isDark = theme === "dark";

  const periods: TimePeriod[] = [3, 6, 9, "all"];

  const getPeriodLabel = (period: TimePeriod): string => {
    if (period === "all") {
      return t("allTime");
    }
    return t("months", { count: period });
  };

  return (
    <View className="px-5 py-4">
      <View
        className={`flex-row rounded-2xl p-1 ${
          isDark ? "bg-slate-900" : "bg-white"
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {periods.map((period) => {
          const isSelected = selectedPeriod === period;
          return (
            <TouchableOpacity
              key={period}
              onPress={() => onPeriodChange(period)}
              className={`flex-1 py-3 rounded-xl ${
                isSelected
                  ? isDark
                    ? "bg-sky-500"
                    : "bg-blue-600"
                  : ""
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center font-semibold text-sm ${
                  isSelected
                    ? "text-white"
                    : isDark
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}
              >
                {getPeriodLabel(period)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TimePeriodSelector;

