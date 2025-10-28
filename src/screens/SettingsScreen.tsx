import { useState } from "react";
import { View, Text } from "react-native";
import SafeAreaViewWrapper from "../components/SafeAreaViewWrapper";

import AppearanceSection from "../components/SettingsScreen/AppearanceSection";
import LanguageSection from "../components/SettingsScreen/LanguageSection";
import CurrencySection from "../components/SettingsScreen/CurrencySection";
import ResetSection from "../components/SettingsScreen/ResetSection";
import PrivacyPolicySection from "../components/SettingsScreen/PrivacyPolicySection";
import PrivacyPolicyScreen from "./PrivacyPolicyScreen";
import { useTranslation } from "../hooks/useTranslation";
import { usePreferencesStore } from "../store/preferences";

const SettingsScreen = () => {
  const { t } = useTranslation();
  const theme = usePreferencesStore((state) => state.theme);
  const isDark = theme === "dark";
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handlePrivacyPolicyPress = () => {
    setShowPrivacyPolicy(true);
  };

  const handleBackFromPrivacyPolicy = () => {
    setShowPrivacyPolicy(false);
  };

  if (showPrivacyPolicy) {
    return <PrivacyPolicyScreen onBack={handleBackFromPrivacyPolicy} />;
  }

  return (
    <SafeAreaViewWrapper
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

        <PrivacyPolicySection onPress={handlePrivacyPolicyPress} />

        <ResetSection />
      </View>
    </SafeAreaViewWrapper>
  );
};

export default SettingsScreen;

