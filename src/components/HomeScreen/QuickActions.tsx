import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTranslation } from "../../hooks/useTranslation";

type QuickActionsProps = {
  onAddIncome?: () => void;
  onScanQR?: () => void;
};

const QuickActions = ({ onAddIncome, onScanQR }: QuickActionsProps) => {
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
        
        <Pressable
          className="flex-row items-center justify-center rounded-3xl border border-slate-200 px-6 py-4 dark:border-slate-700 active:scale-98"
          onPress={onScanQR}
        >
          <MaterialCommunityIcons 
            name="qrcode-scan" 
            size={20} 
            color="#64748b" 
            style={{ marginRight: 8 }}
          />
          <Text className="text-base font-semibold text-slate-800 dark:text-slate-100">{t("scanQRCode")}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default QuickActions;

