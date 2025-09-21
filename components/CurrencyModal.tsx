import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CURRENCIES, Currency, getCurrencyByCode, formatCurrency } from '../constants/currencies';
import { getSelectedCurrency, convertAllDataToCurrency } from '../utils/dataManager';

interface CurrencyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCurrencyChange: () => void;
}

const CurrencyModal: React.FC<CurrencyModalProps> = ({ isVisible, onClose, onCurrencyChange }) => {
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
      
      Alert.alert(
        'Currency Changed',
        `All your data has been converted to ${currency.name} (${currency.symbol}).\n\nExample: ${formatCurrency(100, currency.code)}`,
        [
          {
            text: 'OK',
            onPress: () => {
              onCurrencyChange();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to convert currency. Please try again.');
      console.error('Currency conversion error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const CurrencyItem = ({ currency }: { currency: Currency }) => {
    const isSelected = currency.code === selectedCurrency;
    
    return (
      <TouchableOpacity
        className={`bg-white rounded-xl p-4 mb-3 shadow-sm ${
          isSelected ? 'border-2 border-blue-500' : 'border border-gray-200'
        }`}
        onPress={() => handleCurrencySelect(currency)}
        disabled={isConverting}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
              isSelected ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Text className={`text-lg font-bold ${
                isSelected ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {currency.symbol}
              </Text>
            </View>
            
            <View className="flex-1">
              <Text className={`font-semibold text-base ${
                isSelected ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {currency.name}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {currency.code} • {formatCurrency(100, currency.code)}
              </Text>
            </View>
          </View>
          
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
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
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-6 py-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">Select Currency</Text>
            <View className="w-6" />
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
          {isConverting && (
            <View className="bg-blue-50 rounded-xl p-4 mb-4">
              <View className="flex-row items-center">
                <Ionicons name="sync" size={20} color="#2563eb" />
                <Text className="text-blue-600 font-medium ml-2">
                  Converting all data to new currency...
                </Text>
              </View>
            </View>
          )}

          <Text className="text-gray-600 text-sm mb-4">
            Choose your preferred currency. All existing data will be automatically converted.
          </Text>

          {/* Popular Currencies */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Popular</Text>
            {CURRENCIES.slice(0, 8).map((currency) => (
              <CurrencyItem key={currency.code} currency={currency} />
            ))}
          </View>

          {/* All Currencies */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">All Currencies</Text>
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
