import { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import BalanceSummary from "../components/HomeScreen/BalanceSummary";
import MonthSelector from "../components/HomeScreen/MonthSelector";
import CategoriesGrid from "../components/HomeScreen/CategoriesGrid";
import QuickActions from "../components/HomeScreen/QuickActions";
import AddIncomeModal from "../components/modals/AddIncomeModal";
import AddExpenseModal from "../components/modals/AddExpenseModal";
import AddCategoryModal from "../components/modals/AddCategoryModal";
import EditCategoryModal from "../components/modals/EditCategoryModal";
import { AlertModal, SelectCategoryModal, ErrorModal } from "../components/modals";
import QRScanner from "../components/QRScanner";
import { type CategoryKey, isCategoryKey } from "../constants/categories";
import { useTranslation } from "../hooks/useTranslation";
import { useMonthlyFinanceData } from "../hooks/useMonthlyFinanceData";
import { useCategories } from "../hooks/useCategories";
import { useFinanceStore } from "../store/finance";
import type { TranslationKey } from "../i18n/translations";
import { parseReceipt } from "../services/receiptParser";
import { usePreferencesStore } from "../store/preferences";
import { fetchExchangeRates, convertCurrency } from "../services/currencyConversion";
import type { Currency } from "../store/preferences";

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState<{ month: number; year: number }>(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });
  const [incomeModalVisible, setIncomeModalVisible] = useState(false);
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [expenseModalState, setExpenseModalState] = useState<
    | {
        key: CategoryKey | string;
        label: string;
      }
    | null
  >(null);
  const [editCategoryState, setEditCategoryState] = useState<
    | {
        categoryId: string;
        name: string;
        icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
        color: string;
      }
    | null
  >(null);
  const [deleteConfirmState, setDeleteConfirmState] = useState<
    | {
        categoryId: string;
        categoryName: string;
        transactionCount: number;
      }
    | null
  >(null);
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [isParsingReceipt, setIsParsingReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    total: number;
    currency: string;
    date: string;
    vendor: string;
    originalTotal?: number;
    originalCurrency?: string;
  } | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const { t } = useTranslation();
  const userCurrency = usePreferencesStore((state) => state.currency);

  // Custom hooks for data management
  const {
    totalBalance,
    incomeTotal,
    expensesTotal,
    expensesByCategory,
    formatAmount,
  } = useMonthlyFinanceData(selectedDate);

  const categories = useCategories(expensesByCategory, formatAmount);

  // Store actions
  const customCategories = useFinanceStore((state) => state.customCategories);
  const transactions = useFinanceStore((state) => state.transactions);
  const addIncome = useFinanceStore((state) => state.addIncome);
  const addExpense = useFinanceStore((state) => state.addExpense);
  const addCustomCategory = useFinanceStore((state) => state.addCustomCategory);
  const updateCustomCategory = useFinanceStore((state) => state.updateCustomCategory);
  const deleteCustomCategory = useFinanceStore((state) => state.deleteCustomCategory);

  // QR Scanning handler
  const handleQRScan = async (rawData: string) => {
    setQrScannerVisible(false);
    setIsParsingReceipt(true);

    try {
      const data = await parseReceipt(rawData);

      if ("error" in data) {
        // Handle error responses
        let errorMessage = t("scanFailed");
        if (data.error === "raw_data_required") {
          errorMessage = "Raw data is required";
        } else if (data.error === "raw_data_empty") {
          errorMessage = "Raw data is empty";
        }
        setScanError(errorMessage);
      } else {
        // Success - convert currency if needed
        const receiptCurrency = data.currency as Currency;
        let convertedAmount = data.total;
        let needsConversion = receiptCurrency !== userCurrency;

        if (needsConversion) {
          try {
            const rates = await fetchExchangeRates(receiptCurrency);
            convertedAmount = convertCurrency(data.total, receiptCurrency, userCurrency, rates);
          } catch (error) {
            console.error("Currency conversion failed:", error);
            // Continue with original amount if conversion fails
            needsConversion = false;
          }
        }

        setReceiptData({
          total: convertedAmount,
          currency: userCurrency,
          date: data.date,
          vendor: data.vendor,
          originalTotal: needsConversion ? data.total : undefined,
          originalCurrency: needsConversion ? receiptCurrency : undefined,
        });
      }
    } catch (error) {
      console.error("Error parsing receipt:", error);
      setScanError(t("scanFailed"));
    } finally {
      setIsParsingReceipt(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (receiptData) {
      addExpense({
        amount: receiptData.total,
        category: categoryId,
        ...selectedDate,
      });
      setReceiptData(null);
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <BalanceSummary
          totalBalance={formatAmount(totalBalance)}
          income={formatAmount(incomeTotal)}
          expenses={formatAmount(expensesTotal)}
        />

        <MonthSelector onChange={setSelectedDate} />

        <CategoriesGrid
          categories={categories}
          onSelectCategory={(key) => {
            const category = customCategories.find((c) => c.id === key);
            if (category) {
              // If the name is a translation key, translate it; otherwise use the name directly
              const label = isCategoryKey(category.name as any) ? t(category.name as TranslationKey) : category.name;
              setExpenseModalState({ key: category.id, label });
            }
          }}
          onEditCategory={(key) => {
            const category = customCategories.find((c) => c.id === key);
            if (category) {
              setEditCategoryState({
                categoryId: category.id,
                name: category.name,
                icon: category.icon,
                color: category.color,
              });
            }
          }}
          onAddCategory={() => setAddCategoryModalVisible(true)}
        />

        <QuickActions 
          onAddIncome={() => setIncomeModalVisible(true)} 
          onScanQR={() => setQrScannerVisible(true)}
        />
      </ScrollView>

      {/* Loading overlay for receipt parsing */}
      {isParsingReceipt && (
        <View className="absolute inset-0 bg-black/60 items-center justify-center">
          <View className="bg-white dark:bg-slate-900 rounded-3xl p-8 items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <View className="h-4" />
            <Text className="text-slate-900 dark:text-white font-semibold text-base">
              {t("parsingReceipt")}
            </Text>
          </View>
        </View>
      )}

      <AddIncomeModal
        visible={incomeModalVisible}
        onClose={() => setIncomeModalVisible(false)}
        onSubmit={(amount) => addIncome({ amount, ...selectedDate })}
      />

      <AddExpenseModal
        visible={Boolean(expenseModalState)}
        categoryLabel={expenseModalState?.label ?? ""}
        onClose={() => setExpenseModalState(null)}
        onSubmit={(amount) => {
          const categoryKey = expenseModalState?.key;
          if (!categoryKey) {
            return;
          }
          addExpense({ amount, category: categoryKey, ...selectedDate });
        }}
      />

      <AddCategoryModal
        visible={addCategoryModalVisible}
        onClose={() => setAddCategoryModalVisible(false)}
        onSave={(name, icon, color) => {
          addCustomCategory({ name, icon, color });
          setAddCategoryModalVisible(false);
        }}
      />

      <EditCategoryModal
        visible={Boolean(editCategoryState)}
        onClose={() => setEditCategoryState(null)}
        categoryKey={editCategoryState?.categoryId ?? ""}
        initialName={editCategoryState?.name ?? ""}
        initialIcon={editCategoryState?.icon ?? "help-circle"}
        initialColor={editCategoryState?.color ?? "#38bdf8"}
        onSave={(data) => {
          if (!editCategoryState) return;
          
          updateCustomCategory(editCategoryState.categoryId, {
            name: data.name,
            icon: data.icon,
            color: data.color,
          });
          setEditCategoryState(null);
        }}
        onDelete={() => {
          if (!editCategoryState) return;
          
          // Count transactions for this category
          const transactionCount = transactions.filter(
            (t) => t.category === editCategoryState.categoryId
          ).length;
          
          setDeleteConfirmState({
            categoryId: editCategoryState.categoryId,
            categoryName: editCategoryState.name,
            transactionCount,
          });
        }}
      />

      <AlertModal
        visible={Boolean(deleteConfirmState)}
        title={t("deleteCategoryConfirmTitle")}
        message={
          deleteConfirmState?.transactionCount
            ? t("deleteCategoryConfirmMessage", { count: deleteConfirmState.transactionCount })
            : t("deleteCategoryConfirmMessageNoTransactions")
        }
        confirmText={t("deleteCategoryButton")}
        cancelText={t("cancel")}
        onConfirm={() => {
          if (deleteConfirmState?.categoryId) {
            deleteCustomCategory(deleteConfirmState.categoryId);
          }
          setDeleteConfirmState(null);
          setEditCategoryState(null);
        }}
        onClose={() => setDeleteConfirmState(null)}
      />

      {/* QR Scanner */}
      <QRScanner
        visible={qrScannerVisible}
        onClose={() => setQrScannerVisible(false)}
        onScan={handleQRScan}
      />

      {/* Category Selection Modal */}
      <SelectCategoryModal
        visible={Boolean(receiptData)}
        onClose={() => setReceiptData(null)}
        onSelect={handleCategorySelect}
        categories={customCategories}
        receiptData={receiptData}
      />

      {/* Scan Error Modal */}
      <ErrorModal
        visible={Boolean(scanError)}
        title={t("scanError")}
        message={scanError ?? ""}
        onClose={() => setScanError(null)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

