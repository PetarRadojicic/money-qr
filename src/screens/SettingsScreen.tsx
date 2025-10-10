import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppearanceSection from "../components/SettingsScreen/AppearanceSection";
import LanguageSection from "../components/SettingsScreen/LanguageSection";
import CurrencySection from "../components/SettingsScreen/CurrencySection";
import ResetSection from "../components/SettingsScreen/ResetSection";

const SettingsScreen = () => {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-slate-50 px-6 py-6 dark:bg-slate-950"
    >
      <View className="gap-8">
        <AppearanceSection />

        <LanguageSection />

        <CurrencySection />

        <ResetSection />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

