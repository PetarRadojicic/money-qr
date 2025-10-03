import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation, Language } from '../contexts/TranslationContext';
import { CURRENCIES, getCurrencyByCode } from '../constants/currencies';
import { saveSelectedCurrency, setOnboardingDone } from '../utils/dataManager';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { t, language, setLanguage } = useTranslation();
  const [page, setPage] = useState<number>(0); // 0 -> language, 1 -> intro, 2 -> currency
  const [selectedCurrency, setSelectedCurrencyState] = useState<string>('USD');

  const popular = useMemo(() => ['USD', 'EUR', 'RSD', 'GBP'], []);

  const handleNext = () => setPage(page + 1);
  const handleBack = () => setPage(page - 1);

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
    <View className="flex-1 bg-black">
      {/* Gold Gradient Background */}
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        locations={[0, 0.5, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* Gold Vertical Lines Pattern */}
      <View className="absolute inset-0 opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            className="absolute bg-gradient-to-b from-transparent via-yellow-400 to-transparent"
            style={{
              left: (width / 8) * i,
              width: 2,
              height: height,
              opacity: 0.3 - (Math.abs(i - 4) * 0.05),
            }}
          />
        ))}
      </View>

      {/* Header */}
      <View className="px-6 pt-12 pb-6 relative z-10">
        {page > 0 ? (
          <TouchableOpacity onPress={handleBack} className="flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
            <Text className="text-lg font-semibold text-white ml-3">
              {page === 1 ? t('welcomeTitle') : t('selectCurrency')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="items-center">
            <Text className="text-3xl font-black text-white mb-2">{t('moneyQR')}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      {page === 0 ? (
        // Language Selection Page
        <ScrollView className="flex-1 px-6 relative z-10" showsVerticalScrollIndicator={false}>
          {/* Welcome to Money QR Section */}
          <View className="items-center mb-8 mt-8">
            <Text className="text-4xl font-black text-white text-center mb-2">
              {t('nextGenOfFinances')}
            </Text>
            <Text className="text-gray-300 text-center mb-6">
              {t('trackExpensesGrow')}
            </Text>
          </View>

          {/* Language Selection Card */}
          <View className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-gray-700">
            <Text className="text-xl font-bold text-white mb-2">{t('language')}</Text>
            <Text className="text-gray-300 mb-6">{t('chooseLanguage')}</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => handleLanguageChange('en')}
                className="flex-1 rounded-2xl overflow-hidden"
                activeOpacity={0.8}
              >
                {language === 'en' ? (
                  <LinearGradient
                    colors={['#EAB308', '#F59E0B']}
                    className="py-4 rounded-2xl"
                  >
                    <Text className="text-black font-bold text-lg text-center">English</Text>
                  </LinearGradient>
                ) : (
                  <View className="bg-gray-800 border border-gray-600 py-4 rounded-2xl">
                    <Text className="text-white font-bold text-lg text-center">English</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLanguageChange('sr')}
                className="flex-1 rounded-2xl overflow-hidden"
                activeOpacity={0.8}
              >
                {language === 'sr' ? (
                  <LinearGradient
                    colors={['#EAB308', '#F59E0B']}
                    className="py-4 rounded-2xl"
                  >
                    <Text className="text-black font-bold text-lg text-center">Srpski</Text>
                  </LinearGradient>
                ) : (
                  <View className="bg-gray-800 border border-gray-600 py-4 rounded-2xl">
                    <Text className="text-white font-bold text-lg text-center">Srpski</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : page === 1 ? (
        // Welcome Text Page
        <ScrollView className="flex-1 px-6 relative z-10" showsVerticalScrollIndicator={false}>
          <View className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-gray-700">
            <Text className="text-2xl font-bold text-white mb-4">{t('welcomeHeadline')}</Text>
            <Text className="text-gray-300 mb-4 text-base leading-6">{t('welcomeBody1')}</Text>
            <Text className="text-gray-300 mb-4 text-base leading-6">{t('welcomeBody2')}</Text>
            <Text className="text-gray-300 text-base leading-6">{t('welcomeContact', { email: 'placeholder@gmail.com' })}</Text>
          </View>

          <View className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-gray-700">
            <Text className="text-white font-bold text-lg mb-4">{t('welcomeHighlightsTitle')}</Text>
            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                <Text className="text-gray-300 flex-1">{t('welcomeHighlight1')}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                <Text className="text-gray-300 flex-1">{t('welcomeHighlight2')}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                <Text className="text-gray-300 flex-1">{t('welcomeHighlight3')}</Text>
              </View>
            </View>
          </View>

          {/* QR Testing Warning */}
          <View className="bg-yellow-900/20 border border-yellow-500/30 rounded-3xl p-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="warning" size={22} color="#FFD700" />
              <Text className="text-yellow-400 font-bold ml-3 text-lg">{t('qrTestingWarning')}</Text>
            </View>
            <Text className="text-yellow-300 text-sm leading-5">{t('qrTestingWarningText')}</Text>
          </View>
        </ScrollView>
      ) : (
        // Currency Selection Page
        <ScrollView className="flex-1 px-6 relative z-10" showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View className="items-center mb-8 mt-4">
            <Text className="text-3xl font-black text-white text-center mb-2">
              {t('selectCurrency')}
            </Text>
          </View>

          {/* Popular Currencies Section */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-6 bg-yellow-500 rounded-full mr-3" />
              <Text className="text-yellow-400 font-bold text-lg">{t('popularCurrencies')}</Text>
            </View>
            
            <View className="flex-row flex-wrap gap-3">
              {popular.map(code => {
                const c = getCurrencyByCode(code);
                const selected = selectedCurrency === code;
                return (
                  <TouchableOpacity
                    key={code}
                    onPress={() => handleCurrencyChange(code)}
                    className="flex-1 min-w-[45%] rounded-2xl overflow-hidden"
                    activeOpacity={0.8}
                  >
                    {selected ? (
                      <LinearGradient
                        colors={['#EAB308', '#F59E0B']}
                        className="p-4 rounded-2xl shadow-lg"
                      >
                        <View className="items-center">
                          <Text className="text-black font-bold text-lg mb-1">{c.code}</Text>
                          <Text className="text-black/80 font-medium text-sm">{c.name}</Text>
                          <View className="w-6 h-6 bg-black/20 rounded-full items-center justify-center mt-2">
                            <Ionicons name="checkmark" size={14} color="#000000" />
                          </View>
                        </View>
                      </LinearGradient>
                    ) : (
                      <View className="bg-gray-800/60 border border-gray-600/50 p-4 rounded-2xl backdrop-blur-sm">
                        <View className="items-center">
                          <Text className="text-white font-bold text-lg mb-1">{c.code}</Text>
                          <Text className="text-gray-300 font-medium text-sm">{c.name}</Text>
                          <View className="w-6 h-6 bg-gray-600 rounded-full items-center justify-center mt-2">
                            <View className="w-2 h-2 bg-gray-400 rounded-full" />
                          </View>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* All Currencies Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-6 bg-gray-400 rounded-full mr-3" />
              <Text className="text-gray-300 font-bold text-lg">{t('allCurrencies')}</Text>
            </View>
            
            <View className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                <View className="flex-row flex-wrap gap-2">
                  {CURRENCIES.map(c => {
                    const selected = selectedCurrency === c.code;
                    const isPopular = popular.includes(c.code);
                    return (
                      <TouchableOpacity
                        key={c.code}
                        onPress={() => handleCurrencyChange(c.code)}
                        className="rounded-xl overflow-hidden"
                        activeOpacity={0.8}
                      >
                        {selected ? (
                          <LinearGradient
                            colors={['#EAB308', '#F59E0B']}
                            className="px-3 py-2 rounded-xl"
                          >
                            <Text className="font-bold text-black text-sm">{c.code}</Text>
                          </LinearGradient>
                        ) : (
                          <View className={`px-3 py-2 rounded-xl border ${isPopular ? 'bg-gray-700/50 border-yellow-500/30' : 'bg-gray-800/50 border-gray-600/30'}`}>
                            <Text className={`font-semibold text-sm ${isPopular ? 'text-yellow-300' : 'text-gray-300'}`}>
                              {c.code}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Selected Currency Preview */}
          <View className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50">
            <View className="items-center">
              <Text className="text-gray-400 font-medium text-sm mb-2">{t('selectedCurrency')}</Text>
              <View className="flex-row items-center">
                <Text className="text-white font-bold text-2xl mr-3">
                  {getCurrencyByCode(selectedCurrency).symbol}
                </Text>
                <View>
                  <Text className="text-white font-bold text-xl">
                    {getCurrencyByCode(selectedCurrency).code}
                  </Text>
                  <Text className="text-gray-300 text-sm">
                    {getCurrencyByCode(selectedCurrency).name}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Footer */}
      <View className="px-6 py-6 relative z-10">
        {page === 0 ? (
          <TouchableOpacity onPress={handleNext} className="rounded-2xl overflow-hidden shadow-lg" activeOpacity={0.8}>
            <LinearGradient colors={['#EAB308', '#F59E0B']} className="py-4 items-center">
              <View className="flex-row items-center">
                <Text className="text-black font-bold text-lg mr-2">{t('continue')}</Text>
                <Ionicons name="arrow-forward" size={20} color="#000000" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : page === 1 ? (
          <TouchableOpacity onPress={handleNext} className="rounded-2xl overflow-hidden shadow-lg" activeOpacity={0.8}>
            <LinearGradient colors={['#EAB308', '#F59E0B']} className="py-4 items-center">
              <View className="flex-row items-center">
                <Text className="text-black font-bold text-lg mr-2">{t('continue')}</Text>
                <Ionicons name="arrow-forward" size={20} color="#000000" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleFinish} className="rounded-2xl overflow-hidden shadow-lg" activeOpacity={0.8}>
            <LinearGradient colors={['#EAB308', '#F59E0B']} className="py-4 items-center">
              <View className="flex-row items-center">
                <Text className="text-black font-bold text-lg mr-2">{t('finish')}</Text>
                <Ionicons name="checkmark" size={20} color="#000000" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default WelcomeScreen;


