import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import SafeAreaViewWrapper from "../components/SafeAreaViewWrapper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useFinanceStore, type Transaction } from "../store/finance";
import { useTranslation } from "../hooks/useTranslation";
import { usePreferencesStore } from "../store/preferences";
import { CATEGORY_CONFIG, type CategoryKey, isCategoryKey } from "../constants/categories";
import { formatCurrency } from "../utils/format";
import { monthsByLanguage } from "../i18n/translations";
import { WarnModal, AlertModal } from "../components/modals";

const HistoryScreen = () => {
  const { t } = useTranslation();
  const theme = usePreferencesStore((state) => state.theme);
  const language = usePreferencesStore((state) => state.language);
  const currency = usePreferencesStore((state) => state.currency);
  const transactions = useFinanceStore((state) => state.transactions);
  const customCategories = useFinanceStore((state) => state.customCategories);
  const revertTransaction = useFinanceStore((state) => state.revertTransaction);

  const [showRevertConfirm, setShowRevertConfirm] = useState(false);
  const [showRevertSuccess, setShowRevertSuccess] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const isDark = theme === "dark";

  const getCategoryInfo = (categoryKey?: string) => {
    if (!categoryKey) return null;
    
    // Check default categories
    if (isCategoryKey(categoryKey as CategoryKey)) {
      const config = CATEGORY_CONFIG.find((c) => c.key === categoryKey);
      return {
        name: t(categoryKey as CategoryKey),
        icon: config?.icon || "help-circle",
        color: config?.color || "#64748b",
      };
    }
    
    // Check custom categories
    const customCategory = customCategories.find((c) => c.id === categoryKey);
    if (customCategory) {
      return {
        name: customCategory.name,
        icon: customCategory.icon,
        color: customCategory.color,
      };
    }
    
    return null;
  };

  const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `${t("today")} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (isYesterday) {
      return `${t("yesterday")} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }

    const months = monthsByLanguage[language];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return `${day} ${month} ${year} • ${time}`;
  };

  const handleRevertTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowRevertConfirm(true);
  };

  const confirmRevert = () => {
    if (selectedTransaction) {
      revertTransaction(selectedTransaction.id);
      setShowRevertSuccess(true);
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === "income";
    const categoryInfo = isIncome ? null : getCategoryInfo(item.category);
    const amount = formatCurrency(item.amount, currency);

    return (
      <View
        className={`mx-5 mb-3 rounded-2xl border ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        } overflow-hidden`}
      >
        <View className="flex-row items-center p-4">
          {/* Icon */}
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-4"
            style={{
              backgroundColor: isIncome
                ? isDark
                  ? "rgba(34, 197, 94, 0.15)"
                  : "rgba(34, 197, 94, 0.1)"
                : categoryInfo?.color
                ? `${categoryInfo.color}20`
                : isDark
                ? "rgba(248, 113, 113, 0.15)"
                : "rgba(248, 113, 113, 0.1)",
            }}
          >
            <MaterialCommunityIcons
              name={
                isIncome
                  ? "trending-up"
                  : categoryInfo?.icon || "currency-usd"
              }
              size={24}
              color={
                isIncome
                  ? "#22c55e"
                  : categoryInfo?.color || "#f87171"
              }
            />
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text
              className={`text-base font-semibold mb-1 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {isIncome ? t("income") : categoryInfo?.name || t("expenses")}
            </Text>
            <Text
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {formatTransactionDate(item.date)}
            </Text>
          </View>

          {/* Amount */}
          <View className="items-end">
            <Text
              className={`text-lg font-bold ${
                isIncome
                  ? "text-emerald-500"
                  : "text-red-500"
              }`}
            >
              {isIncome ? "+" : "-"}{amount}
            </Text>

            {/* Revert Button */}
            <TouchableOpacity
              onPress={() => handleRevertTransaction(item)}
              className={`mt-2 px-3 py-1 rounded-full ${
                isDark ? "bg-slate-800" : "bg-slate-100"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isDark ? "text-sky-400" : "text-sky-600"
                }`}
              >
                {t("revertTransaction")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8 py-20">
      <View
        className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${
          isDark ? "bg-slate-800" : "bg-slate-100"
        }`}
      >
        <MaterialCommunityIcons
          name="history"
          size={48}
          color={isDark ? "#64748b" : "#94a3b8"}
        />
      </View>
      <Text
        className={`text-xl font-bold mb-2 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        {t("noTransactions")}
      </Text>
      <Text
        className={`text-base text-center ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {t("noTransactionsDescription")}
      </Text>
    </View>
  );

  return (
    <SafeAreaViewWrapper
      edges={["top", "left", "right"]}
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}
    >
      {/* Header */}
      <View className="px-5 py-4 border-b" style={{ borderBottomColor: isDark ? "#1e293b" : "#e2e8f0" }}>
        <Text
          className={`text-2xl font-bold text-center ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {t("allTransactions")}
        </Text>
      </View>

      {/* Transaction List */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 32,
          flexGrow: 1,
        }}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Modals */}
      <WarnModal
        visible={showRevertConfirm}
        onClose={() => setShowRevertConfirm(false)}
        title={t("revertConfirmTitle")}
        message={t("revertConfirmMessage")}
        confirmText={t("revertConfirmButton")}
        cancelText={t("cancel")}
        onConfirm={confirmRevert}
        icon="undo-variant"
      />

      <AlertModal
        visible={showRevertSuccess}
        onClose={() => setShowRevertSuccess(false)}
        title=""
        message={t("transactionReverted")}
        confirmText="OK"
        icon="check-circle-outline"
      />
    </SafeAreaViewWrapper>
  );
};

export default HistoryScreen;

