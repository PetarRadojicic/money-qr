import { useState } from "react";
import { ScrollView } from "react-native";
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
import { AlertModal } from "../components/modals";
import { type CategoryKey, isCategoryKey } from "../constants/categories";
import { useTranslation } from "../hooks/useTranslation";
import { useMonthlyFinanceData } from "../hooks/useMonthlyFinanceData";
import { useCategories } from "../hooks/useCategories";
import { useFinanceStore } from "../store/finance";
import type { TranslationKey } from "../i18n/translations";

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

  const { t } = useTranslation();

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

        <QuickActions onAddIncome={() => setIncomeModalVisible(true)} />
      </ScrollView>

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
        onCancel={() => setDeleteConfirmState(null)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

