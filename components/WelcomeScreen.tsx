import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation, Language } from '../contexts/TranslationContext';
import { CURRENCIES, getCurrencyByCode } from '../constants/currencies';
import { saveSelectedCurrency, setOnboardingDone } from '../utils/dataManager';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { t, language, setLanguage } = useTranslation();
  const [page, setPage] = useState<number>(0); // 0 -> intro, 1 -> language+currency
  const [selectedCurrency, setSelectedCurrencyState] = useState<string>('USD');

  const popular = useMemo(() => ['USD', 'EUR', 'RSD', 'GBP'], []);

  const handleNext = () => setPage(1);
  const handleBack = () => setPage(0);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrencyState(code);
  };

  const handleFinish = async () => {
    await saveSelectedCurrency(selectedCurrency);
    await setOnboardingDone(true);
    onComplete();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-12 pb-6">
        {page === 1 ? (
          <TouchableOpacity onPress={handleBack} className="flex-row items-center">
            <Ionicons name="arrow-back" size={22} color="#374151" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">{t('welcomeTitle')}</Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-2xl font-extrabold text-gray-900">{t('welcomeTitle')}</Text>
        )}
      </View>

      {/* Content */}
      {page === 0 ? (
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="bg-gray-50 rounded-2xl p-5 mb-4">
            <Text className="text-xl font-bold text-gray-900 mb-2">{t('welcomeHeadline')}</Text>
            <Text className="text-gray-600 mb-3">{t('welcomeBody1')}</Text>
            <Text className="text-gray-600 mb-3">{t('welcomeBody2')}</Text>
            <Text className="text-gray-600">{t('welcomeContact', { email: 'placeholder@gmail.com' })}</Text>
          </View>

          <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <Text className="text-gray-900 font-semibold mb-2">{t('welcomeHighlightsTitle')}</Text>
            <Text className="text-gray-600 mb-1">• {t('welcomeHighlight1')}</Text>
            <Text className="text-gray-600 mb-1">• {t('welcomeHighlight2')}</Text>
            <Text className="text-gray-600 mb-1">• {t('welcomeHighlight3')}</Text>
          </View>

          {/* QR Testing Warning */}
          <View className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mt-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="warning" size={20} color="#D97706" />
              <Text className="text-yellow-800 font-semibold ml-2">{t('qrTestingWarning')}</Text>
            </View>
            <Text className="text-yellow-700 text-sm">{t('qrTestingWarningText')}</Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">{t('language')}</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => handleLanguageChange('en')}
                className={`px-4 py-2 rounded-xl ${language === 'en' ? 'bg-blue-600' : 'bg-gray-100'}`}
              >
                <Text className={`${language === 'en' ? 'text-white' : 'text-gray-900'} font-semibold`}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLanguageChange('sr')}
                className={`px-4 py-2 rounded-xl ${language === 'sr' ? 'bg-blue-600' : 'bg-gray-100'}`}
              >
                <Text className={`${language === 'sr' ? 'text-white' : 'text-gray-900'} font-semibold`}>Srpski</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">{t('selectCurrency')}</Text>
            <Text className="text-gray-600 mb-3">{t('choosePreferredCurrency')}</Text>
            <Text className="text-gray-500 mb-2">{t('popularCurrencies')}</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {popular.map(code => {
                const c = getCurrencyByCode(code);
                const selected = selectedCurrency === code;
                return (
                  <TouchableOpacity
                    key={code}
                    onPress={() => handleCurrencyChange(code)}
                    className={`px-3 py-2 rounded-xl border ${selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                  >
                    <Text className={`font-semibold ${selected ? 'text-white' : 'text-gray-900'}`}>{c.name} ({c.code})</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text className="text-gray-500 mb-2">{t('allCurrencies')}</Text>
            <View className="flex-row flex-wrap gap-2">
              {CURRENCIES.map(c => {
                const selected = selectedCurrency === c.code;
                return (
                  <TouchableOpacity
                    key={c.code}
                    onPress={() => handleCurrencyChange(c.code)}
                    className={`px-3 py-2 rounded-xl border ${selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                  >
                    <Text className={`font-semibold ${selected ? 'text-white' : 'text-gray-900'}`}>{c.name} ({c.code})</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}

      {/* Footer */}
      <View className="px-6 py-4 border-t border-gray-100 bg-white">
        {page === 0 ? (
          <TouchableOpacity onPress={handleNext} className="bg-blue-600 rounded-xl py-4 items-center">
            <Text className="text-white font-semibold">{t('continue')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleFinish} className="bg-blue-600 rounded-xl py-4 items-center">
            <Text className="text-white font-semibold">{t('finish')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default WelcomeScreen;


