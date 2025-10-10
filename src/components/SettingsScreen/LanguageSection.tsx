import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTranslation } from "../../hooks/useTranslation";
import { usePreferencesStore } from "../../store/preferences";
import LanguageModal from "../modals/LanguageModal";

const languageLabels = {
  en: "English",
  sr: "Српски",
};

const LanguageSection = () => {
  const { t } = useTranslation();
  const language = usePreferencesStore((state) => state.language);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Pressable 
        className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 active:scale-[0.98]"
        onPress={() => setIsModalVisible(true)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t("language")}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {languageLabels[language]}
            </Text>
          </View>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={24} 
            color="#94a3b8" 
          />
        </View>
      </Pressable>

      <LanguageModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default LanguageSection;

