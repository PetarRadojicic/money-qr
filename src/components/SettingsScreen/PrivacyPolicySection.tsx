import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTranslation } from "../../hooks/useTranslation";

interface PrivacyPolicySectionProps {
  onPress: () => void;
}

const PrivacyPolicySection = ({ onPress }: PrivacyPolicySectionProps) => {
  const { t } = useTranslation();

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <View className="gap-3">
        <View>
          <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {t("privacyPolicy")}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            {t("privacyPolicyDescription")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onPress}
          className="flex-row items-center justify-between rounded-xl bg-slate-100 px-4 py-3 active:opacity-80 dark:bg-slate-800"
        >
          <Text className="text-base font-medium text-slate-700 dark:text-slate-300">
            {t("viewPrivacyPolicy")}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrivacyPolicySection;
