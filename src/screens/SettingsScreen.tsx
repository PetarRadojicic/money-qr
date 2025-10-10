import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppearanceSection from "../components/SettingsScreen/AppearanceSection";
import LanguageSection from "../components/SettingsScreen/LanguageSection";
import CurrencySection from "../components/SettingsScreen/CurrencySection";
import ResetSection from "../components/SettingsScreen/ResetSection";
import { useTranslation } from "../hooks/useTranslation";
import { usePreferencesStore } from "../store/preferences";

const SettingsScreen = () => {
  const { t } = useTranslation();
  const theme = usePreferencesStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-slate-50 dark:bg-slate-950"
    >
      {/* Header */}
      <View className="px-5 py-4 border-b" style={{ borderBottomColor: isDark ? "#1e293b" : "#e2e8f0" }}>
        <Text
          className={`text-2xl font-bold text-center ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {t("settingsTitle")}
        </Text>
      </View>

      {/* Settings Content */}
      <View className="gap-8 px-6 py-6">
        <AppearanceSection />

        <LanguageSection />

        <CurrencySection />

        <ResetSection />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

