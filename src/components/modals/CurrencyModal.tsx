import { useState } from "react";
import { View, Text, TextInput, Pressable, Modal, FlatList, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTranslation } from "../../hooks/useTranslation";
import { usePreferencesStore, type Currency } from "../../store/preferences";
import { useFinanceStore } from "../../store/finance";
import { convertAllFinancialData } from "../../services/currencyConversion";
import { getCurrencySymbol } from "../../constants/currencies";
import ErrorModal from "./ErrorModal";

type CurrencyModalProps = {
  visible: boolean;
  onClose: () => void;
};

// All supported currencies
const allCurrencies: Currency[] = [
  "USD", "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG",
  "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB",
  "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP",
  "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD",
  "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP",
  "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG",
  "HUF", "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD",
  "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD",
  "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA",
  "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR",
  "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN",
  "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF",
  "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS",
  "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP",
  "TRY", "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "UYU", "UZS", "VES",
  "VND", "VUV", "WST", "XAF", "XCD", "XCG", "XDR", "XOF", "XPF", "YER",
  "ZAR", "ZMW", "ZWL"
];

const CurrencyModal = ({ visible, onClose }: CurrencyModalProps) => {
  const { t } = useTranslation();
  const currency = usePreferencesStore((state) => state.currency);
  const setCurrency = usePreferencesStore((state) => state.setCurrency);
  const totalBalance = useFinanceStore((state) => state.totalBalance);
  const monthlyData = useFinanceStore((state) => state.monthlyData);
  const updateFinancialData = useFinanceStore((state) => state.updateFinancialData);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [showConversionError, setShowConversionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCurrencySelect = async (newCurrency: Currency) => {
    if (newCurrency === currency) {
      onClose();
      return;
    }

    setIsConverting(true);

    try {
      // Convert all financial data to the new currency
      const converted = await convertAllFinancialData(
        currency,
        newCurrency,
        totalBalance,
        monthlyData
      );

      // Update the finance store with converted data
      updateFinancialData(converted);

      // Update the currency preference
      setCurrency(newCurrency);
    } catch (error) {
      console.error("Error converting currency:", error);
      // Show the specific error message to the user
      const message = error instanceof Error ? error.message : 'Failed to convert currency data. Please try again.';
      setErrorMessage(message);
      setShowConversionError(true);
      // Don't change currency if conversion fails - keep current currency
    } finally {
      setIsConverting(false);
      onClose();
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  // Filter currencies based on search query
  // Support searching by code and symbol (e.g., "rsd" or "din" for RSD)
  const filteredCurrencies = allCurrencies.filter((curr) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const code = curr.toLowerCase();
    const symbol = getCurrencySymbol(curr).toLowerCase();
    return code.includes(query) || symbol.includes(query);
  });

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <Pressable className="flex-1" onPress={handleClose} />
        
        <View className="bg-white dark:bg-slate-900 rounded-t-[32px] overflow-hidden">
          {/* Drag Indicator */}
          <View className="items-center pt-3 pb-4">
            <View className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
          </View>

          <View className="px-6 pb-6">
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <View className="bg-amber-100 dark:bg-amber-900/30 rounded-2xl p-3 mr-4">
                <MaterialCommunityIcons name="currency-usd" size={32} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {t("settingsTitle")}
                </Text>
                <Text className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("currency")}
                </Text>
              </View>
            </View>

            {/* Search Input */}
            <View className="mb-4">
              <View className="bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
                <View className="flex-row items-center px-4 py-3">
                  <MaterialCommunityIcons 
                    name="magnify" 
                    size={24} 
                    color="#94a3b8" 
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search currency..."
                    placeholderTextColor="#94a3b8"
                    className="flex-1 text-base text-slate-900 dark:text-white"
                  />
                  {searchQuery.length > 0 && (
                    <Pressable onPress={() => setSearchQuery("")}>
                      <MaterialCommunityIcons name="close-circle" size={20} color="#94a3b8" />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>

            {/* Converting Indicator */}
            {isConverting && (
              <View className="mb-4 flex-row items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-3">
                <ActivityIndicator size="small" color="#10b981" />
                <Text className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {t("convertingCurrency")}
                </Text>
              </View>
            )}

            {/* Currency List */}
            <FlatList
              data={filteredCurrencies}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              className="max-h-[400px]"
              contentContainerStyle={{ gap: 8 }}
              ListEmptyComponent={() => (
                <View className="py-8 items-center">
                  <MaterialCommunityIcons name="currency-usd-off" size={48} color="#94a3b8" />
                  <Text className="text-slate-500 dark:text-slate-400 mt-2 text-center">
                    No currencies found
                  </Text>
                </View>
              )}
              renderItem={({ item: currencyCode }) => {
                const isActive = currencyCode === currency;
                const currencySymbol = getCurrencySymbol(currencyCode);
                return (
                  <Pressable
                    className={`flex-row items-center justify-between rounded-2xl border p-4 ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                    } ${isConverting ? "opacity-50" : ""}`}
                    onPress={() => handleCurrencySelect(currencyCode)}
                    disabled={isConverting}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        className={`w-12 h-12 rounded-full items-center justify-center ${
                          isActive
                            ? "bg-emerald-500"
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      >
                        <Text
                          className={`text-xl font-bold ${
                            isActive ? "text-white" : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {currencySymbol}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text
                          className={`text-base font-bold ${
                            isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {currencyCode}
                        </Text>
                        <Text
                          className={`text-sm font-medium ${
                            isActive ? "text-emerald-600 dark:text-emerald-500" : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {currencySymbol}
                        </Text>
                      </View>
                    </View>
                    {isActive && (
                      <View className="bg-emerald-500 rounded-full p-1">
                        <MaterialCommunityIcons name="check" size={20} color="white" />
                      </View>
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </View>

      {/* Error Modal */}
      <ErrorModal
        visible={showConversionError}
        onClose={() => setShowConversionError(false)}
        title="Conversion Error"
        message={errorMessage}
        icon="currency-usd-off"
      />
    </Modal>
  );
};

export default CurrencyModal;

