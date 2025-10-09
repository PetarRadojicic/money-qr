import { View, Text, Pressable } from "react-native";

import { useTranslation } from "../../hooks/useTranslation";

type QuickActionsProps = {
  onAddIncome?: () => void;
};

const QuickActions = ({ onAddIncome }: QuickActionsProps) => {
  const { t } = useTranslation();

  return (
    <View className="mt-10">
      <Text className="text-base font-semibold text-slate-800 dark:text-slate-100">{t("quickActions")}</Text>
      <View className="mt-4 gap-3">
        <Pressable
          className="items-center justify-center rounded-3xl border border-slate-200 px-6 py-4 dark:border-slate-700"
          onPress={onAddIncome}
        >
          <Text className="text-base font-semibold text-slate-800 dark:text-slate-100">{t("addToBalance")}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default QuickActions;

