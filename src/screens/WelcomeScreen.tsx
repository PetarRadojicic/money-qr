import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Keyboard,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTranslation } from "../hooks/useTranslation";
import { usePreferencesStore, type Currency, type Language, type ThemePreference } from "../store/preferences";
import { CURRENCY_SYMBOLS } from "../constants/currencies";

const CURRENCIES: { code: Currency; name: string }[] = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
  { code: "RSD", name: "Serbian Dinar" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "ZAR", name: "South African Rand" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "DKK", name: "Danish Krone" },
  { code: "PLN", name: "Polish Zloty" },
  { code: "THB", name: "Thai Baht" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "HUF", name: "Hungarian Forint" },
  { code: "CZK", name: "Czech Koruna" },
  { code: "ILS", name: "Israeli Shekel" },
  { code: "CLP", name: "Chilean Peso" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "AED", name: "UAE Dirham" },
  { code: "COP", name: "Colombian Peso" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "RON", name: "Romanian Leu" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "KRW", name: "South Korean Won" },
  { code: "VND", name: "Vietnamese Dong" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "UAH", name: "Ukrainian Hryvnia" },
  { code: "EGP", name: "Egyptian Pound" },
  { code: "PKR", name: "Pakistani Rupee" },
];

const WelcomeScreen = () => {
  const { t } = useTranslation();
  const theme = usePreferencesStore((state) => state.theme);
  const language = usePreferencesStore((state) => state.language);
  const currency = usePreferencesStore((state) => state.currency);
  const setTheme = usePreferencesStore((state) => state.setTheme);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const setCurrency = usePreferencesStore((state) => state.setCurrency);
  const setHasCompletedOnboarding = usePreferencesStore(
    (state) => state.setHasCompletedOnboarding
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const isDark = theme === "dark";

  const filteredCurrencies = CURRENCIES.filter(
    (curr) =>
      curr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curr.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComplete = () => {
    setHasCompletedOnboarding(true);
  };

  const renderLanguageOption = (
    lang: Language,
    label: string,
    flag: string
  ) => (
    <TouchableOpacity
      onPress={() => setLanguage(lang)}
      className={`mb-3 flex-row items-center rounded-2xl border-2 p-4 ${
        language === lang
          ? isDark
            ? "border-sky-400 bg-sky-400/10"
            : "border-blue-600 bg-blue-50"
          : isDark
          ? "border-slate-700 bg-slate-800/50"
          : "border-slate-200 bg-white"
      }`}
    >
      <Text className="mr-3 text-3xl">{flag}</Text>
      <View className="flex-1">
        <Text
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {label}
        </Text>
      </View>
      {language === lang && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={isDark ? "#38bdf8" : "#2563eb"}
        />
      )}
    </TouchableOpacity>
  );

  const renderThemeOption = (
    themePref: ThemePreference,
    label: string,
    icon: "sunny" | "moon"
  ) => (
    <TouchableOpacity
      onPress={() => setTheme(themePref)}
      className={`mb-3 flex-row items-center rounded-2xl border-2 p-4 ${
        theme === themePref
          ? isDark
            ? "border-sky-400 bg-sky-400/10"
            : "border-blue-600 bg-blue-50"
          : isDark
          ? "border-slate-700 bg-slate-800/50"
          : "border-slate-200 bg-white"
      }`}
    >
      <Ionicons
        name={icon}
        size={28}
        color={
          theme === themePref
            ? isDark
              ? "#38bdf8"
              : "#2563eb"
            : isDark
            ? "#64748b"
            : "#94a3b8"
        }
        style={{ marginRight: 12 }}
      />
      <View className="flex-1">
        <Text
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {label}
        </Text>
      </View>
      {theme === themePref && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={isDark ? "#38bdf8" : "#2563eb"}
        />
      )}
    </TouchableOpacity>
  );

  const renderCurrencyOption = (curr: Currency, name: string) => (
    <TouchableOpacity
      key={curr}
      onPress={() => {
        setCurrency(curr);
        Keyboard.dismiss();
      }}
      className={`mb-2 flex-row items-center rounded-xl border-2 p-3 ${
        currency === curr
          ? isDark
            ? "border-sky-400 bg-sky-400/10"
            : "border-blue-600 bg-blue-50"
          : isDark
          ? "border-slate-700 bg-slate-800/50"
          : "border-slate-200 bg-white"
      }`}
    >
      <Text
        className={`mr-3 text-2xl font-bold ${
          isDark ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {CURRENCY_SYMBOLS[curr]}
      </Text>
      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {curr}
        </Text>
        <Text
          className={`text-sm ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {name}
        </Text>
      </View>
      {currency === curr && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={isDark ? "#38bdf8" : "#2563eb"}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-gradient-to-b from-blue-50 to-white"}`}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Indicator */}
        <View className="mb-8 flex-row items-center justify-center">
          {[1, 2, 3].map((step) => (
            <View key={step} className="flex-row items-center">
              <View
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  currentStep >= step
                    ? isDark
                      ? "bg-sky-400"
                      : "bg-blue-600"
                    : isDark
                    ? "bg-slate-800"
                    : "bg-slate-200"
                }`}
              >
                <Text
                  className={`text-base font-bold ${
                    currentStep >= step
                      ? "text-white"
                      : isDark
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {step}
                </Text>
              </View>
              {step < 3 && (
                <View
                  className={`mx-2 h-1 w-12 ${
                    currentStep > step
                      ? isDark
                        ? "bg-sky-400"
                        : "bg-blue-600"
                      : isDark
                      ? "bg-slate-800"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </View>
          ))}
        </View>

        {/* Step 1: Welcome + Language + Theme */}
        {currentStep === 1 && (
          <View>
            {/* Hero Section */}
            <View className="mb-8 items-center">
                <Image
                  source={require("../../assets/icon.png")}
                  style={{ width: 100, height: 100 }}
                  resizeMode="contain"
                />
              <Text
                className={`mb-2 text-center text-4xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {t("welcomeTitle")}
              </Text>
              <Text
                className={`text-center text-lg ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {t("welcomeSubtitle")}
              </Text>
            </View>

            {/* Language Selection */}
            <View className="mb-6">
              <Text
                className={`mb-4 text-xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {t("selectLanguage")}
              </Text>
              {renderLanguageOption("en", "English", "🇬🇧")}
              {renderLanguageOption("sr", "Српски", "🇷🇸")}
            </View>

            {/* Theme Selection */}
            <View className="mb-6">
              <Text
                className={`mb-4 text-xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {t("selectTheme")}
              </Text>
              {renderThemeOption("light", t("light"), "sunny")}
              {renderThemeOption("dark", t("dark"), "moon")}
            </View>
          </View>
        )}

        {/* Step 2: About Project */}
        {currentStep === 2 && (
          <View>
            <View className="mb-8 items-center">
              <Text
                className={`mb-4 text-center text-3xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {t("aboutProject")}
              </Text>
            </View>

            <View
              className={`mb-6 rounded-3xl border-2 p-6 ${
                isDark
                  ? "border-slate-800 bg-slate-900/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <View className="mb-4 flex-row items-start">
                <View
                  className={`mr-3 mt-1 rounded-full p-2 ${
                    isDark ? "bg-amber-400/20" : "bg-amber-100"
                  }`}
                >
                  <Ionicons
                    name="flask"
                    size={24}
                    color={isDark ? "#fbbf24" : "#f59e0b"}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`mb-2 text-xl font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Beta Version
                  </Text>
                  <Text
                    className={`text-base leading-6 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {t("betaNotice")}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => Linking.openURL("mailto:support@radojicic.co")}
                className={`mt-4 flex-row items-center justify-center rounded-xl border-2 py-3 ${
                  isDark
                    ? "border-sky-400/30 bg-sky-400/10"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <Ionicons
                  name="mail"
                  size={20}
                  color={isDark ? "#38bdf8" : "#2563eb"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={`text-base font-semibold ${
                    isDark ? "text-sky-400" : "text-blue-600"
                  }`}
                >
                  support@radojicic.co
                </Text>
              </TouchableOpacity>
            </View>

            <View
              className={`mb-6 rounded-3xl border-2 p-6 ${
                isDark
                  ? "border-slate-800 bg-slate-900/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <View className="mb-3 flex-row items-center">
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={isDark ? "#38bdf8" : "#2563eb"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={`text-base ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {t("featureTrackIncomeExpenses")}
                </Text>
              </View>
              <View className="mb-3 flex-row items-center">
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={isDark ? "#38bdf8" : "#2563eb"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={`text-base ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {t("featureScanQRReceipts")}
                </Text>
              </View>
              <View className="mb-3 flex-row items-center">
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={isDark ? "#38bdf8" : "#2563eb"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={`text-base ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {t("featureVisualAnalytics")}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={isDark ? "#38bdf8" : "#2563eb"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={`text-base ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {t("featureCustomCategories")}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Step 3: Currency Selection */}
        {currentStep === 3 && (
          <View>
            <View className="mb-6 items-center">
              <Text
                className={`mb-2 text-center text-3xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {t("selectCurrency")}
              </Text>
              <Text
                className={`text-center text-base ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {t("choosePreferredCurrency")}
              </Text>
            </View>

            {/* Search Input */}
            <View
              className={`mb-4 flex-row items-center rounded-2xl border-2 px-4 py-3 ${
                isDark
                  ? "border-slate-700 bg-slate-800"
                  : "border-slate-300 bg-white"
              }`}
            >
              <Ionicons
                name="search"
                size={20}
                color={isDark ? "#64748b" : "#94a3b8"}
                style={{ marginRight: 8 }}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t("searchCurrency")}
                placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                className={`flex-1 text-base ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={isDark ? "#64748b" : "#94a3b8"}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Currency List */}
            <ScrollView
              className="mb-4 max-h-[420px]"
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled={true}
            >
              {filteredCurrencies.map((curr) =>
                renderCurrencyOption(curr.code, curr.name)
              )}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Fixed Footer with Buttons */}
      <View
        className={`px-6 pb-6 pt-4 ${
          isDark ? "bg-slate-950" : "bg-white"
        }`}
      >
        {currentStep === 1 && (
          <TouchableOpacity
            onPress={() => setCurrentStep(2)}
            className={`rounded-2xl py-4 ${
              isDark ? "bg-sky-400" : "bg-blue-600"
            }`}
          >
            <Text className="text-center text-lg font-bold text-white">
              Continue
            </Text>
          </TouchableOpacity>
        )}

        {currentStep === 2 && (
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setCurrentStep(1)}
              className={`flex-1 rounded-2xl border-2 py-4 ${
                isDark
                  ? "border-slate-700 bg-slate-800"
                  : "border-slate-300 bg-white"
              }`}
            >
              <Text
                className={`text-center text-lg font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentStep(3)}
              className={`flex-1 rounded-2xl py-4 ${
                isDark ? "bg-sky-400" : "bg-blue-600"
              }`}
            >
              <Text className="text-center text-lg font-bold text-white">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 3 && (
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setCurrentStep(2)}
              className={`flex-1 rounded-2xl border-2 py-4 ${
                isDark
                  ? "border-slate-700 bg-slate-800"
                  : "border-slate-300 bg-white"
              }`}
            >
              <Text
                className={`text-center text-lg font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleComplete}
              className={`flex-1 rounded-2xl py-4 ${
                isDark ? "bg-sky-400" : "bg-blue-600"
              }`}
            >
              <Text className="text-center text-lg font-bold text-white">
                {t("getStarted")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

