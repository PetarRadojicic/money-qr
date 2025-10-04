import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '../contexts/TranslationContext';
import { getSelectedCurrency } from '../utils/dataManager';
import { getCurrencyByCode } from '../constants/currencies';
import { useAlert } from './AlertProvider';

interface ExpenseModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  categoryName: string;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  categoryName,
}) => {
  const { t } = useTranslation();
  const { error } = useAlert();
  const [amount, setAmount] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const code = await getSelectedCurrency();
        const currency = getCurrencyByCode(code);
        setCurrencySymbol(currency.symbol);
      } catch (e) {
        setCurrencySymbol('$');
      }
    };
    if (isVisible) {
      loadCurrency();
    }
  }, [isVisible]);

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      error(t('invalidAmount'), t('invalidAmountMessage'));
      return;
    }

    onConfirm(numericAmount);
    setAmount('');
    onClose();
  };

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-gray-900/95 backdrop-blur-sm rounded-3xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-1">
              <Text className="text-xl font-bold text-white">
                {t('addExpense')}
              </Text>
              <Text className="text-yellow-400 font-medium text-sm mt-1">
                {categoryName}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={handleClose}
              className="bg-gray-800/60 border border-gray-600 rounded-xl p-2"
            >
              <Ionicons name="close" size={20} color="#FFD700" />
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View className="mb-6">
            <Text className="text-gray-300 font-medium mb-3">{t('amount')}</Text>
            <View className="bg-gray-800/60 border border-gray-600 rounded-2xl px-4 py-4">
              <View className="flex-row items-center">
                <View className="bg-yellow-500/20 rounded-xl px-3 py-2 mr-3">
                  <Text className="text-yellow-400 text-lg font-bold">{currencySymbol}</Text>
                </View>
                <TextInput
                  className="flex-1 text-xl text-white font-semibold"
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  autoFocus={true}
                />
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-gray-800/60 border border-gray-600 rounded-2xl py-4"
              onPress={handleClose}
            >
              <Text className="text-gray-300 font-bold text-center">{t('cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 rounded-2xl overflow-hidden"
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#EAB308', '#F59E0B']} className="py-4">
                <Text className="text-black font-bold text-center">{t('add')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ExpenseModal;
