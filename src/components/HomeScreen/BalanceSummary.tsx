import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTranslation } from "../../hooks/useTranslation";

// Helper function to determine responsive font size based on text length
const getResponsiveFontSize = (text: string, baseSize: number = 32): number => {
  const length = text.length;
  if (length <= 6) return baseSize;
  if (length <= 10) return baseSize * 0.85;
  if (length <= 14) return baseSize * 0.7;
  if (length <= 18) return baseSize * 0.55;
  return baseSize * 0.4; // More aggressive scaling for very long numbers
};

type BalanceSummaryProps = {
  totalBalance: string;
  income: string;
  expenses: string;
};

const BalanceSummary = ({ totalBalance, income, expenses }: BalanceSummaryProps) => {
  const { t } = useTranslation();

  return (
    <View 
      className="mt-6 rounded-[32px] bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        backgroundColor: '#1e293b',
      }}
    >
      <View className="p-6 relative">

        {/* Total Balance Card - Full Width */}
        <View 
          className="rounded-2xl p-6 border mb-4 items-center"
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
          }}
        >
          <View className="flex-row items-center mb-3">
            <View 
              className="rounded-full p-2 mr-2"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.25)' }}
            >
              <MaterialCommunityIcons name="wallet" size={20} color="#60a5fa" />
            </View>
            <Text className="text-sm font-extrabold uppercase tracking-widest text-blue-100">
              {t("totalBalance")}
            </Text>
          </View>
          <Text 
            className="font-extrabold text-white tracking-tight"
            style={{ 
              fontSize: getResponsiveFontSize(totalBalance, 36),
              lineHeight: getResponsiveFontSize(totalBalance, 36) * 1.1,
              textAlign: 'center',
            }}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >
            {totalBalance}
          </Text>
        </View>

        {/* Income and Expenses Cards */}
        <View className="flex-row gap-3">
          {/* Income Card */}
          <View 
            className="flex-1 rounded-2xl p-4 border items-center"
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              borderColor: 'rgba(34, 197, 94, 0.3)',
            }}
          >
            <View className="flex-row items-center mb-3">
              <View 
                className="rounded-full p-1.5 mr-2"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.25)' }}
              >
                <MaterialCommunityIcons name="trending-up" size={16} color="#22c55e" />
              </View>
              <Text className="text-xs font-extrabold uppercase tracking-widest text-green-100">
                {t("income")}
              </Text>
            </View>
            <Text 
              className="font-extrabold text-green-300"
              style={{ 
                fontSize: getResponsiveFontSize(income, 20),
                lineHeight: getResponsiveFontSize(income, 20) * 1.1,
                textAlign: 'center',
              }}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
            >
              {income}
            </Text>
          </View>

          {/* Expenses Card */}
          <View 
            className="flex-1 rounded-2xl p-4 border items-center"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <View className="flex-row items-center mb-3">
              <View 
                className="rounded-full p-1.5 mr-2"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.25)' }}
              >
                <MaterialCommunityIcons name="trending-down" size={16} color="#ef4444" />
              </View>
              <Text className="text-xs font-extrabold uppercase tracking-widest text-red-100">
                {t("expenses")}
              </Text>
            </View>
            <Text 
              className="font-extrabold text-red-300"
              style={{ 
                fontSize: getResponsiveFontSize(expenses, 20),
                lineHeight: getResponsiveFontSize(expenses, 20) * 1.1,
                textAlign: 'center',
              }}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
            >
              {expenses}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BalanceSummary;

