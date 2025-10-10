import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, FlatList } from "react-native";

import { useTranslation } from "../../hooks/useTranslation";
import { usePreferencesStore, type Currency } from "../../store/preferences";
import { useFinanceStore } from "../../store/finance";
import { convertAllFinancialData } from "../../services/currencyConversion";
import { getCurrencySymbol } from "../../constants/currencies";

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

const CurrencySection = () => {
  const { t } = useTranslation();
  const currency = usePreferencesStore((state) => state.currency);
  const setCurrency = usePreferencesStore((state) => state.setCurrency);
  const totalBalance = useFinanceStore((state) => state.totalBalance);
  const monthlyData = useFinanceStore((state) => state.monthlyData);
  const updateFinancialData = useFinanceStore((state) => state.updateFinancialData);
  
  const [isConverting, setIsConverting] = useState(false);

  const handleCurrencyChange = async (newCurrency: Currency) => {
    if (newCurrency === currency) return;

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
      // If conversion fails, still update the currency preference
      // but keep the same numerical values
      setCurrency(newCurrency);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">
        {t("currency")}
      </Text>
      
      {isConverting && (
        <View className="mt-3 flex-row items-center gap-2">
          <ActivityIndicator size="small" color="#10b981" />
          <Text className="text-sm text-slate-600 dark:text-slate-400">
            {t("convertingCurrency")}
          </Text>
        </View>
      )}

      <FlatList
        data={allCurrencies}
        numColumns={4}
        keyExtractor={(item) => item}
        scrollEnabled={true}
        className="mt-4 max-h-[300px]"
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item: currencyCode }) => {
          const isActive = currencyCode === currency;
          return (
            <Pressable
              className={`flex-1 items-center justify-center rounded-2xl border px-2 py-3 ${
                isActive
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
              } ${isConverting ? "opacity-50" : ""}`}
              onPress={() => handleCurrencyChange(currencyCode)}
              disabled={isConverting}
            >
              <Text
                className={`text-base font-bold mb-1 ${
                  isActive ? "text-white" : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {getCurrencySymbol(currencyCode)}
              </Text>
              <Text
                className={`text-xs font-semibold ${
                  isActive ? "text-white" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {currencyCode}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default CurrencySection;

