import { View, Text } from "react-native";

import { useTranslation } from "../../hooks/useTranslation";

type BalanceSummaryProps = {
  totalBalance?: string;
  income?: string;
  incomeChangeLabel?: string;
  expenses?: string;
  expensesChangeLabel?: string;
};

const BalanceSummary = ({
  totalBalance,
  income,
  incomeChangeLabel,
  expenses,
  expensesChangeLabel,
}: BalanceSummaryProps) => {
  const { t } = useTranslation();

  return (
    <View className="mt-6 rounded-3xl bg-slate-900 p-6 dark:bg-slate-800">
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-sm text-slate-300">{t("totalBalance")}</Text>
          {totalBalance ? (
            <Text className="mt-2 text-4xl font-semibold text-white">{totalBalance}</Text>
          ) : null}
        </View>
        <View className="rounded-full bg-slate-800 px-3 py-1">
          <Text className="text-xs font-medium uppercase tracking-wide text-slate-200">
            {t("balanceUpdated")}
          </Text>
        </View>
      </View>

      <View className="mt-6 flex-row justify-between">
        <View>
          <Text className="text-xs uppercase text-slate-400">{t("income")}</Text>
          {income ? (
            <Text className="mt-1 text-xl font-semibold text-emerald-300">{income}</Text>
          ) : null}
          {incomeChangeLabel ? <Text className="text-xs text-emerald-200">{incomeChangeLabel}</Text> : null}
        </View>
        <View>
          <Text className="text-xs uppercase text-slate-400">{t("expenses")}</Text>
          {expenses ? (
            <Text className="mt-1 text-xl font-semibold text-rose-300">{expenses}</Text>
          ) : null}
          {expensesChangeLabel ? <Text className="text-xs text-rose-200">{expensesChangeLabel}</Text> : null}
        </View>
      </View>
    </View>
  );
};

export default BalanceSummary;

