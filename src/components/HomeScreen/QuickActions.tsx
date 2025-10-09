import { View, Text, Pressable } from "react-native";

import { useTranslation } from "../../hooks/useTranslation";

type QuickActionsProps = {
  onScanQr?: () => void;
  onAddToBalance?: () => void;
};

const QuickActions = ({ onScanQr, onAddToBalance }: QuickActionsProps) => {
  const { t } = useTranslation();

  return (
    <View className="mt-10">
      <Text className="text-base font-semibold text-slate-800 dark:text-slate-100">{t("quickActions")}</Text>
      <View className="mt-4 gap-3">
        <Pressable
          className="items-center rounded-3xl bg-emerald-500 px-6 py-4 dark:bg-emerald-400"
          onPress={onScanQr}
        >
          <Text className="text-base font-semibold text-white dark:text-slate-900">{t("scanQr")}</Text>
        </Pressable>
        <Pressable
          className="items-center justify-center rounded-3xl border border-slate-200 px-6 py-4 dark:border-slate-700"
          onPress={onAddToBalance}
        >
          <Text className="text-base font-semibold text-slate-800 dark:text-slate-100">{t("addToBalance")}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default QuickActions;

