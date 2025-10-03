import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { resetAppData, getSelectedCurrency } from '../utils/dataManager';
import { getCurrencyByCode, formatCurrency } from '../constants/currencies';
import CurrencyModal from '../components/CurrencyModal';
import LanguageModal from '../components/LanguageModal';
import ExchangeRateStatus from '../components/ExchangeRateStatus';
import { useTranslation, Language } from '../contexts/TranslationContext';

interface SettingsScreenProps {
  onNavigateHome: () => void;
  onNavigateHistory: () => void;
  onDataReset: () => void;
  onCurrencyChange: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onNavigateHome, 
  onNavigateHistory,
  onDataReset, 
  onCurrencyChange
}) => {
  const { t, language, setLanguage } = useTranslation();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    loadCurrentCurrency();
  }, []);

  const loadCurrentCurrency = async () => {
    const current = await getSelectedCurrency();
    setSelectedCurrency(current);
  };

  const handleCurrencyPress = () => {
    setShowCurrencyModal(true);
  };

  const handleLanguagePress = () => {
    setShowLanguageModal(true);
  };

  const getLanguageDisplayName = (lang: Language): string => {
    switch (lang) {
      case 'en':
        return 'English';
      case 'sr':
        return 'Srpski';
      default:
        return 'English';
    }
  };

  const handleCurrencyChange = () => {
    loadCurrentCurrency();
    onCurrencyChange();
  };

  const handleResetApp = () => {
    Alert.alert(
      t('resetApp'),
      t('resetAppMessage'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('resetApp'),
          style: 'destructive',
          onPress: async () => {
            try {
              await resetAppData();
              Alert.alert(
                'App Reset Complete',
                t('resetAppCompleteMessage'),
                [
                  {
                    text: t('ok'),
                    onPress: () => {
                      onDataReset();
                      onNavigateHome();
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert(t('error'), 'Failed to reset the app. Please try again.');
              console.error('Reset error:', error);
            }
          },
        },
      ]
    );
  };

  const SettingsItem = ({ 
    icon, 
    iconLibrary = 'Ionicons', 
    title, 
    subtitle, 
    onPress, 
    isDestructive = false 
  }: {
    icon: string;
    iconLibrary?: 'Ionicons' | 'FontAwesome5';
    title: string;
    subtitle?: string;
    onPress: () => void;
    isDestructive?: boolean;
  }) => {
    const IconComponent = iconLibrary === 'FontAwesome5' ? FontAwesome5 : Ionicons;
    
    return (
      <TouchableOpacity
        className="bg-gray-800/50 rounded-xl p-4 mb-3 border border-gray-700/50 flex-row items-center"
        onPress={onPress}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
          isDestructive ? 'bg-red-900/30' : 'bg-yellow-500/20'
        }`}>
          <IconComponent 
            name={icon} 
            size={20} 
            color={isDestructive ? '#f87171' : '#fbbf24'} 
          />
        </View>
        
        <View className="flex-1">
          <Text className={`font-semibold text-base ${
            isDestructive ? 'text-red-400' : 'text-white'
          }`}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-gray-400 text-sm mt-1">{subtitle}</Text>
          )}
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="bg-gray-900/50 px-6 py-4 border-b border-gray-800/50">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onNavigateHome} className="flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="#fbbf24" />
            <Text className="text-lg font-semibold text-white ml-2">{t('settings')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>

        {/* Language Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-4">{t('language')}</Text>
          
          <SettingsItem
            icon="language"
            iconLibrary="Ionicons"
            title={t('language')}
            subtitle={getLanguageDisplayName(language)}
            onPress={handleLanguagePress}
          />
        </View>

        {/* Currency Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-4">{t('currency')}</Text>
          
          <ExchangeRateStatus onRatesUpdated={handleCurrencyChange} />
          
          <SettingsItem
            icon="cash"
            iconLibrary="Ionicons"
            title={t('currency')}
            subtitle={`${getCurrencyByCode(selectedCurrency).name} (${formatCurrency(100, selectedCurrency)})`}
            onPress={handleCurrencyPress}
          />
        </View>

        {/* Reset App Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-4">{t('resetApp')}</Text>
          
          <SettingsItem
            icon="refresh"
            iconLibrary="Ionicons"
            title={t('resetApp')}
            subtitle={t('clearAllData')}
            onPress={handleResetApp}
            isDestructive={true}
          />
        </View>

      </ScrollView>

      {/* Currency Modal */}
      <CurrencyModal
        isVisible={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* Language Modal */}
      <LanguageModal
        isVisible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </View>
  );
};

export default SettingsScreen;
