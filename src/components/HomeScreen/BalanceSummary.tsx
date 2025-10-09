import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTranslation } from "../../hooks/useTranslation";

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
        {/* Decorative circles */}
        <View 
          className="absolute -top-12 -right-12 opacity-10"
          style={{
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: '#ffffff',
          }}
        />
        <View 
          className="absolute -bottom-8 -left-8 opacity-10"
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#ffffff',
          }}
        />

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
          <Text className="text-5xl font-extrabold text-white tracking-tight">
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
            <Text className="text-2xl font-extrabold text-green-300">
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
            <Text className="text-2xl font-extrabold text-red-300">
              {expenses}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BalanceSummary;

