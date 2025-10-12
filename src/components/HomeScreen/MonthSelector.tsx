import { useEffect, useMemo, useState } from "react";
import { Pressable, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { monthsByLanguage } from "../../i18n/translations";
import { usePreferencesStore } from "../../store/preferences";
import { useTranslation } from "../../hooks/useTranslation";

type MonthSelectorProps = {
  onChange?: (date: { month: number; year: number }) => void;
};

const MonthSelector = ({ onChange }: MonthSelectorProps = {}) => {
  const language = usePreferencesStore((state) => state.language);
  const theme = usePreferencesStore((state) => state.theme);
  const { t } = useTranslation();

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

  // Check if current month is selected
  const isCurrentMonth = useMemo(() => {
    const now = new Date();
    return activeDate.month === now.getMonth() && activeDate.year === now.getFullYear();
  }, [activeDate.month, activeDate.year]);

  useEffect(() => {
    onChange?.(activeDate);
  }, [activeDate, onChange]);

  const updateDate = (updater: (date: { month: number; year: number }) => { month: number; year: number }) => {
    setActiveDate((prev) => updater(prev));
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

  const handleGoToCurrentMonth = () => {
    const now = new Date();
    setActiveDate({
      month: now.getMonth(),
      year: now.getFullYear(),
    });
  };

  return (
    <View className="mt-8">
      <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
      
      {!isCurrentMonth && (
        <Pressable
          className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950"
          onPress={handleGoToCurrentMonth}
        >
          <Text className="text-center text-sm font-medium text-blue-600 dark:text-blue-400">
            {t("goToCurrentMonth")}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default MonthSelector;

