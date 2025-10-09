import { View, Text, Pressable } from "react-native";

import { useTranslation } from "../../hooks/useTranslation";
import { usePreferencesStore, type Language } from "../../store/preferences";

const languageOptions: { value: Language; translationKey: "english" | "serbian" }[] = [
  { value: "en", translationKey: "english" },
  { value: "sr", translationKey: "serbian" },
];

const LanguageSection = () => {
  const { t } = useTranslation();
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">{t("language")}</Text>
      <View className="mt-4 flex-row gap-3">
        {languageOptions.map((option) => {
          const isActive = option.value === language;
          return (
            <Pressable
              key={option.value}
              className={`flex-1 items-center rounded-2xl border px-4 py-3 ${
                isActive
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
              }`}
              onPress={() => setLanguage(option.value)}
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? "text-white" : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {t(option.translationKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default LanguageSection;

