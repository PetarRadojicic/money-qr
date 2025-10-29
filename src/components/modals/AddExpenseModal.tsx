import { useState } from "react";
import { View, Text, TextInput, Pressable, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTranslation } from "../../hooks/useTranslation";
import { usePreferencesStore } from "../../store/preferences";
import { getCurrencySymbol } from "../../constants/currencies";

type AddExpenseModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  categoryLabel: string;
};

const AddExpenseModal = ({ visible, onClose, onSubmit, categoryLabel }: AddExpenseModalProps) => {
  const { t } = useTranslation();
  const currency = usePreferencesStore((state) => state.currency);
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const parsed = Number.parseFloat(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }
    onSubmit(parsed);
    setAmount("");
    onClose();
  };

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  const isValid = amount && Number.isFinite(Number.parseFloat(amount)) && Number.parseFloat(amount) > 0;
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <Pressable className="flex-1" onPress={handleClose} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View 
            className="bg-white dark:bg-slate-900 rounded-t-[32px] overflow-hidden"
            style={{ paddingBottom: insets.bottom }}
          >
          {/* Drag Indicator */}
          <View className="items-center pt-3 pb-4">
            <View className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
          </View>

          <View className="px-6 pb-6">
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <View className="bg-red-100 dark:bg-red-900/30 rounded-2xl p-3 mr-4">
                <MaterialCommunityIcons name="arrow-down-circle" size={32} color="#ef4444" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Add Expense
                </Text>
                <Text className="text-xl font-bold text-slate-900 dark:text-white" numberOfLines={1}>
                  {categoryLabel}
                </Text>
              </View>
            </View>

            {/* Amount Input */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                {t("amountPlaceholder")}
              </Text>
              <View className="bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
                <View className="flex-row items-center px-5 py-2">
                  <Text className="text-3xl font-bold text-slate-400 dark:text-slate-500 mr-2">{currencySymbol}</Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 text-3xl font-bold text-slate-900 dark:text-white py-2"
                    autoFocus
                  />
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-4">
              <Pressable
                className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl py-4 items-center active:scale-95"
                onPress={handleClose}
              >
                <Text className="text-base font-bold text-slate-700 dark:text-slate-300">
                  {t("cancel")}
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 rounded-2xl py-4 items-center active:scale-95 ${
                  !isValid ? 'opacity-40' : ''
                }`}
                style={{ 
                  backgroundColor: '#ef4444',
                  shadowColor: '#ef4444',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                <Text className="text-base font-bold text-white">{t("save")}</Text>
              </Pressable>
            </View>
          </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddExpenseModal;


