import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BalanceSummary from "../components/HomeScreen/BalanceSummary";
import MonthSelector from "../components/HomeScreen/MonthSelector";
import CategoriesGrid from "../components/HomeScreen/CategoriesGrid";
import QuickActions from "../components/HomeScreen/QuickActions";
import AddIncomeModal from "../components/modals/AddIncomeModal";
import AddExpenseModal from "../components/modals/AddExpenseModal";
import AddCategoryModal from "../components/modals/AddCategoryModal";
import { type CategoryKey, isCategoryKey } from "../constants/categories";
import { useTranslation } from "../hooks/useTranslation";
import { useMonthlyFinanceData } from "../hooks/useMonthlyFinanceData";
import { useCategories } from "../hooks/useCategories";
import { useFinanceStore } from "../store/finance";

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
  const addIncome = useFinanceStore((state) => state.addIncome);
  const addExpense = useFinanceStore((state) => state.addExpense);
  const addCustomCategory = useFinanceStore((state) => state.addCustomCategory);

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
            // Check if it's a default category
            if (isCategoryKey(key)) {
              setExpenseModalState({ key, label: t(key) });
              return;
            }
            
            // Check if it's a custom category
            const customCategory = customCategories.find((c) => c.id === key);
            if (customCategory) {
              setExpenseModalState({ key: customCategory.id, label: customCategory.name });
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
    </SafeAreaView>
  );
};

export default HomeScreen;

