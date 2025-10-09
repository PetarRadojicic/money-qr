import { useMemo, useState } from "react";
import { Pressable, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { monthsByLanguage } from "../../i18n/translations";
import { usePreferencesStore } from "../../store/preferences";

type MonthSelectorProps = {
  onChange?: (date: { month: number; year: number }) => void;
};

const MonthSelector = ({ onChange }: MonthSelectorProps = {}) => {
  const language = usePreferencesStore((state) => state.language);
  const theme = usePreferencesStore((state) => state.theme);

  const months = useMemo(() => monthsByLanguage[language], [language]);
  const [activeDate, setActiveDate] = useState(() => {
    const now = new Date();
    return {
      month: now.getMonth(),
      year: now.getFullYear(),
    };
  });

  const arrowColor = theme === "dark" ? "#cbd5f5" : "#475569";
  const monthLabel = months[activeDate.month];

  const updateDate = (updater: (date: { month: number; year: number }) => { month: number; year: number }) => {
    setActiveDate((prev) => {
      const nextDate = updater(prev);
      onChange?.(nextDate);
      return nextDate;
    });
  };

  const handlePreviousMonth = () => {
    updateDate(({ month, year }) => {
      if (month === 0) {
        return { month: 11, year: year - 1 };
      }
      return { month: month - 1, year };
    });
  };

  const handleNextMonth = () => {
    updateDate(({ month, year }) => {
      if (month === 11) {
        return { month: 0, year: year + 1 };
      }
      return { month: month + 1, year };
    });
  };

  return (
    <View className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <View className="flex-row items-center justify-between">
        <Pressable
          className="rounded-full border border-slate-200 p-2 dark:border-slate-700"
          onPress={handlePreviousMonth}
        >
          <Feather name="chevron-left" size={20} color={arrowColor} />
        </Pressable>
        <View className="items-center">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-50">{monthLabel}</Text>
          <Text className="text-xs text-slate-400 dark:text-slate-500">{activeDate.year}</Text>
        </View>
        <Pressable
          className="rounded-full border border-slate-200 p-2 dark:border-slate-700"
          onPress={handleNextMonth}
        >
          <Feather name="chevron-right" size={20} color={arrowColor} />
        </Pressable>
      </View>
    </View>
  );
};

export default MonthSelector;

