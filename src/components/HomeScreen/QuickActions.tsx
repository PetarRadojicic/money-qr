import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useTranslation } from "../../hooks/useTranslation";
import { usePreferencesStore } from "../../store/preferences";

type QuickActionsProps = {
  onAddIncome?: () => void;
  onScanQR?: () => void;
};

const QuickActions = ({ onAddIncome, onScanQR }: QuickActionsProps) => {
  const { t } = useTranslation();
  const theme = usePreferencesStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <View className="mt-8">
      <Text className="mb-4 text-lg font-bold text-slate-800 dark:text-slate-100">
        {t("quickActions")}
      </Text>
      
      <View className="gap-4">
        {/* Add to Balance Card */}
        <Pressable
          onPress={onAddIncome}
          className="overflow-hidden rounded-2xl active:scale-98"
          style={{ elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}
        >
          <LinearGradient
            colors={isDark ? ["#10b981", "#059669"] : ["#34d399", "#10b981"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-row items-center justify-between px-6 py-5"
          >
            <View className="flex-1">
              <Text className="mb-1 text-sm font-medium text-emerald-100">
                {t("income")}
              </Text>
              <Text className="text-lg font-bold text-white">
                {t("addToBalance")}
              </Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <MaterialCommunityIcons 
                name="cash-plus" 
                size={28} 
                color="#ffffff"
              />
            </View>
          </LinearGradient>
        </Pressable>

        {/* Scan QR Code Card */}
        <Pressable
          onPress={onScanQR}
          className="overflow-hidden rounded-2xl active:scale-98"
          style={{ elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}
        >
          <LinearGradient
            colors={isDark ? ["#3b82f6", "#2563eb"] : ["#60a5fa", "#3b82f6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-row items-center justify-between px-6 py-5"
          >
            <View className="flex-1">
              <Text className="mb-1 text-sm font-medium text-blue-100">
                Quick Scan
              </Text>
              <Text className="text-lg font-bold text-white">
                {t("scanQRCode")}
              </Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <MaterialCommunityIcons 
                name="qrcode-scan" 
                size={28} 
                color="#ffffff"
              />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
};

export default QuickActions;

