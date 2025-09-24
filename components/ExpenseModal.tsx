import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../contexts/TranslationContext';

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
  const [amount, setAmount] = useState('');

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert(t('invalidAmount'), t('invalidAmountMessage'));
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
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-900">
              {t('addExpense')} {categoryName}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">{t('amount')}</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
              <Text className="text-gray-600 text-lg mr-2">$</Text>
              <TextInput
                className="flex-1 text-lg text-gray-900"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                autoFocus={true}
              />
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-gray-200 rounded-xl py-4"
              onPress={handleClose}
            >
              <Text className="text-gray-700 font-semibold text-center">{t('cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-blue-600 rounded-xl py-4"
              onPress={handleConfirm}
            >
              <Text className="text-white font-semibold text-center">{t('add')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ExpenseModal;
