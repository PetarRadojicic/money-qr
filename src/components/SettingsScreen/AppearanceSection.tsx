import { useCallback } from "react";
import { View, Text, Switch } from "react-native";

import { useTranslation } from "../../hooks/useTranslation";
import { usePreferencesStore } from "../../store/preferences";

const AppearanceSection = () => {
  const { t } = useTranslation();
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);

  const handleAppearanceSwitch = useCallback(
    (nextValue: boolean) => {
      setTheme(nextValue ? "dark" : "light");
    },
    [setTheme]
  );

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">{t("appearance")}</Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            {theme === "dark" ? t("dark") : t("light")}
          </Text>
        </View>
        <Switch value={theme === "dark"} onValueChange={handleAppearanceSwitch} />
      </View>
    </View>
  );
};

export default AppearanceSection;

