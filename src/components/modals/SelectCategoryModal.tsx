import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import { usePreferencesStore } from "../../store/preferences";
import { getCurrencySymbol } from "../../constants/currencies";
import { shouldTranslateCategoryName } from "../../constants/categories";
import type { TranslationKey } from "../../i18n/translations";

type ReceiptData = {
  total: number;
  currency: string;
  date: string;
  vendor: string;
  originalTotal?: number;
  originalCurrency?: string;
};

type Category = {
  id: string;
  name: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
};

type SelectCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (categoryId: string) => void;
  categories: Category[];
  receiptData: ReceiptData | null;
};

const SelectCategoryModal = ({
  visible,
  onClose,
  onSelect,
  categories,
  receiptData,
}: SelectCategoryModalProps) => {
  const { t } = useTranslation();
  const currency = usePreferencesStore((state) => state.currency);
  const currencySymbol = getCurrencySymbol(currency);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleSelect = (categoryId: string) => {
    onSelect(categoryId);
    onClose();
  };

  if (!receiptData) return null;

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <Pressable className="flex-1" onPress={onClose} />

        <View className="bg-white dark:bg-slate-900 rounded-t-[32px] overflow-hidden">
          {/* Drag Indicator */}
          <View className="items-center pt-3 pb-4">
            <View className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
            {/* Receipt Info */}
            <View className="mb-6">
                <View className="flex-row items-center mb-4">
                  <View className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-3 mr-4">
                    <MaterialCommunityIcons name="receipt" size={32} color="#22c55e" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      {t("receiptScanned")}
                    </Text>
                    <Text className="text-xl font-bold text-slate-900 dark:text-white" numberOfLines={1}>
                      {receiptData.vendor}
                    </Text>
                  </View>
                </View>

                {/* Receipt Details */}
                <View className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-3">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {t("receiptAmount")}
                    </Text>
                    <View className="items-end">
                      <Text className="text-2xl font-bold text-slate-900 dark:text-white">
                        {currencySymbol}
                        {receiptData.total.toFixed(2)}
                      </Text>
                      {receiptData.originalTotal && receiptData.originalCurrency && (
                        <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Original: {receiptData.originalTotal.toFixed(2)} {receiptData.originalCurrency}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View className="h-px bg-slate-200 dark:bg-slate-700" />
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {t("receiptDate")}
                    </Text>
                    <Text className="text-base font-semibold text-slate-900 dark:text-white">
                      {formatDate(receiptData.date)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Category Selection */}
              <View>
                <Text className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  {t("selectCategoryForExpense")}
                </Text>

                {categories.length === 0 ? (
                  <View className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 items-center">
                    <MaterialCommunityIcons name="alert-circle" size={48} color="#94a3b8" />
                    <Text className="text-slate-600 dark:text-slate-400 mt-4 text-center">
                      No categories available. Please add categories from the home screen first.
                    </Text>
                  </View>
                ) : (
                  <View style={{ gap: 12 }}>
                    {categories.map((category) => {
                      const label = shouldTranslateCategoryName(category.name)
                        ? t(category.name as TranslationKey)
                        : category.name;

                      return (
                        <Pressable
                          key={category.id}
                          className="flex-row items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-4"
                          onPress={() => handleSelect(category.id)}
                        >
                          <View
                            className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <MaterialCommunityIcons
                              name={category.icon}
                              size={28}
                              color={category.color}
                            />
                          </View>
                          <Text className="flex-1 text-base font-semibold text-slate-900 dark:text-white">
                            {label}
                          </Text>
                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={24}
                            color="#94a3b8"
                          />
                        </Pressable>
                      );
                    })}
                  </View>
                )}
            </View>
          </ScrollView>

          {/* Cancel Button */}
          <View className="px-6 pb-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Pressable
              className="bg-slate-100 dark:bg-slate-800 rounded-2xl py-4 items-center active:scale-95"
              onPress={onClose}
            >
              <Text className="text-base font-bold text-slate-700 dark:text-slate-300">
                {t("cancel")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SelectCategoryModal;

