import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '../contexts/TranslationContext';
import { getSelectedCurrency } from '../utils/dataManager';
import { getCurrencyByCode } from '../constants/currencies';

interface AddBalanceModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const AddBalanceModal: React.FC<AddBalanceModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
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
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="bg-gray-900/90 rounded-2xl p-6 w-full max-w-sm border border-gray-700/50" style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
        }}>
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-white">
              {t('addToBalance')}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#fbbf24" />
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View className="mb-6">
            <Text className="text-gray-300 font-medium mb-2">{t('amount')}</Text>
            <View className="flex-row items-center border border-gray-600/50 rounded-xl px-4 py-3 bg-gray-800/50">
              <Text className="text-yellow-400 text-lg mr-2">{currencySymbol}</Text>
              <TextInput
                className="flex-1 text-lg text-white"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
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
              className="flex-1 bg-gray-700/50 rounded-xl py-4 border border-gray-600/50"
              onPress={handleClose}
            >
              <Text className="text-gray-300 font-semibold text-center">{t('cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1"
              onPress={handleConfirm}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-xl py-4 justify-center items-center"
              >
                <Text className="text-white font-semibold">{t('add')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddBalanceModal;
