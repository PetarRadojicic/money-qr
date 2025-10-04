import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CURRENCIES, Currency, getCurrencyByCode, formatCurrency } from '../constants/currencies';
import { getSelectedCurrency, convertAllDataToCurrency } from '../utils/dataManager';
import { useTranslation } from '../contexts/TranslationContext';
import { useAlert } from './AlertProvider';

interface CurrencyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCurrencyChange: () => void;
}

const CurrencyModal: React.FC<CurrencyModalProps> = ({ isVisible, onClose, onCurrencyChange }) => {
  const { t } = useTranslation();
  const { success, error } = useAlert();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadCurrentCurrency();
    }
  }, [isVisible]);

  const loadCurrentCurrency = async () => {
    const current = await getSelectedCurrency();
    setSelectedCurrency(current);
  };

  const handleCurrencySelect = async (currency: Currency) => {
    if (currency.code === selectedCurrency) {
      onClose();
      return;
    }

    setIsConverting(true);

    try {
      await convertAllDataToCurrency(currency.code);
      
      success(
        t('currencyChanged'),
        t('currencyConvertedMessage')
          .replace('{currencyName}', currency.name)
          .replace('{currencySymbol}', currency.symbol)
          .replace('{example}', formatCurrency(100, currency.code)),
        [
          {
            text: t('ok'),
            onPress: () => {
              onCurrencyChange();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      error(t('error'), 'Failed to convert currency. Please try again.');
      console.error('Currency conversion error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const CurrencyItem = ({ currency }: { currency: Currency }) => {
    const isSelected = currency.code === selectedCurrency;
    
    return (
      <TouchableOpacity
        className={`bg-gray-800/50 rounded-xl p-4 mb-3 border ${
          isSelected ? 'border-yellow-500/50' : 'border-gray-700/50'
        }`}
        onPress={() => handleCurrencySelect(currency)}
        disabled={isConverting}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
              isSelected ? 'bg-yellow-500/20' : 'bg-gray-700/50'
            }`}>
              <Text className={`text-lg font-bold ${
                isSelected ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {currency.symbol}
              </Text>
            </View>
            
            <View className="flex-1">
              <Text className={`font-semibold text-base ${
                isSelected ? 'text-yellow-400' : 'text-white'
              }`}>
                {currency.name}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                {currency.code} • {formatCurrency(100, currency.code)}
              </Text>
            </View>
          </View>
          
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#fbbf24" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        {/* Header */}
        <View className="bg-gray-900/50 px-6 py-4 border-b border-gray-800/50">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fbbf24" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-white">{t('selectCurrency')}</Text>
            <View className="w-6" />
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
          {isConverting && (
            <View className="bg-yellow-500/10 rounded-xl p-4 mb-4 border border-yellow-500/20">
              <View className="flex-row items-center">
                <Ionicons name="sync" size={20} color="#fbbf24" />
                <Text className="text-yellow-400 font-medium ml-2">
                  {t('convertingCurrency')}
                </Text>
              </View>
            </View>
          )}

          {/* Popular Currencies */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-white mb-3">{t('popularCurrencies')}</Text>
            {CURRENCIES.slice(0, 8).map((currency) => (
              <CurrencyItem key={currency.code} currency={currency} />
            ))}
          </View>

          {/* All Currencies */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-white mb-3">{t('allCurrencies')}</Text>
            {CURRENCIES.slice(8).map((currency) => (
              <CurrencyItem key={currency.code} currency={currency} />
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default CurrencyModal;
