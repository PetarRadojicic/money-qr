import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTranslation } from "../../hooks/useTranslation";
import { usePreferencesStore, type Language } from "../../store/preferences";

type LanguageModalProps = {
  visible: boolean;
  onClose: () => void;
};

type LanguageOption = {
  value: Language;
  label: string;
  nativeLabel: string;
};

const languageOptions: LanguageOption[] = [
  { value: "en", label: "English", nativeLabel: "English" },
  { value: "sr", label: "Serbian", nativeLabel: "Српски" },
];

const LanguageModal = ({ visible, onClose }: LanguageModalProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        
        <View 
          className="bg-white dark:bg-slate-900 rounded-t-[32px] overflow-hidden"
          style={{ paddingBottom: insets.bottom }}
        >
          {/* Drag Indicator */}
          <View className="items-center pt-3 pb-4">
            <View className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
          </View>

          <View className="px-6 pb-6">
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <View className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-3 mr-4">
                <MaterialCommunityIcons name="translate" size={32} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {t("settingsTitle")}
                </Text>
                <Text className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("language")}
                </Text>
              </View>
            </View>

            {/* Language List */}
            <ScrollView className="max-h-[400px]" showsVerticalScrollIndicator={false}>
              <View className="gap-3">
                {languageOptions.map((option) => {
                  const isActive = option.value === language;
                  return (
                    <Pressable
                      key={option.value}
                      className={`flex-row items-center justify-between rounded-2xl border p-4 ${
                        isActive
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                      }`}
                      onPress={() => handleLanguageSelect(option.value)}
                    >
                      <View className="flex-1">
                        <Text
                          className={`text-lg font-bold mb-1 ${
                            isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {option.nativeLabel}
                        </Text>
                        <Text
                          className={`text-sm font-medium ${
                            isActive ? "text-emerald-600 dark:text-emerald-500" : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {option.label}
                        </Text>
                      </View>
                      {isActive && (
                        <View className="bg-emerald-500 rounded-full p-1">
                          <MaterialCommunityIcons name="check" size={20} color="white" />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageModal;

