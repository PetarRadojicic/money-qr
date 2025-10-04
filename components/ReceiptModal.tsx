import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '../constants/currencies';
import { ExpenseCategoryData } from './ExpenseCategory';
import { useTranslation } from '../contexts/TranslationContext';
import { useAlert } from './AlertProvider';

interface ReceiptModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (categoryId: string) => void;
  onAddNewCategory: () => void;
  receiptAmount: number;
  receiptCurrency: string;
  receiptMetadata?: {
    date?: string;
    vendor?: string;
  };
  convertedAmount?: number;
  categories: ExpenseCategoryData[];
  currency: string;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  onAddNewCategory,
  receiptAmount,
  receiptCurrency,
  receiptMetadata,
  convertedAmount,
  categories,
  currency,
}) => {
  const { t } = useTranslation();
  const { error } = useAlert();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const modalMaxHeight = Math.round(Dimensions.get('window').height * 0.8);
  const headerHeight = 72; // approx header + border
  const footerHeight = 96; // approx footer buttons area
  const contentMaxHeight = Math.max(200, modalMaxHeight - headerHeight - footerHeight);

  useEffect(() => {
    if (!isVisible) {
      setSelectedCategoryId(null);
    }
  }, [isVisible]);

  const handleConfirm = () => {
    if (!selectedCategoryId) {
      error(t('selectCategory'), t('selectCategoryMessage'));
      return;
    }

    onConfirm(selectedCategoryId);
    onClose();
  };

  const handleClose = () => {
    setSelectedCategoryId(null);
    onClose();
  };

  // Filter out the "add" category
  const selectableCategories = categories.filter(cat => cat.id !== 'add');

  const renderCategoryIcon = (category: any) => {
    const iconProps = { size: 20, color: category.icon.color } as const;
    switch (category.icon.library) {
      case 'Ionicons':
        return <Ionicons name={category.icon.name as any} {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons name={category.icon.name as any} {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={category.icon.name as any} {...iconProps} />;
      default:
        return <Ionicons name="pricetag" size={20} color={category.icon.color} />;
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-4">
        {/* Use explicit maxHeight because percentage-based max-h is not supported in RN */}
        <View className="bg-gray-900/90 rounded-2xl w-full border border-gray-700/50" style={{ maxHeight: modalMaxHeight }}>
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-700/50">
            <Text className="text-xl font-bold text-white">{t('receiptDetails')}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#fbbf24" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: contentMaxHeight }}>
            {/* Receipt Amount */}
            <View className="p-6 border-b border-gray-700/50">
            <View className="bg-green-500/10 rounded-xl p-4 items-center border border-green-500/20">
                <Text className="text-gray-400 text-sm">{t('scannedAmount')}</Text>
                <Text className="text-green-400 text-3xl font-bold mt-1">
                  {formatCurrency(Number.isFinite(receiptAmount) ? receiptAmount : 0, receiptCurrency)}
                </Text>
                {receiptCurrency ? (
                  <Text className="text-gray-500 text-xs mt-1">
                    {t('receiptCurrencyLabel')}: {receiptCurrency}
                  </Text>
                ) : null}
                <Text className="text-gray-500 text-xs mt-1">
                  {t('amountCannotBeChanged')}
                </Text>
              </View>
              
              {/* Additional QR Data */}
              {(receiptMetadata || typeof convertedAmount === 'number') && (
                <View className="mt-4 space-y-2">
                  {receiptMetadata?.vendor && (
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-400 text-sm">{t('receiptVendorLabel')}:</Text>
                      <Text className="text-white text-sm font-medium" numberOfLines={1}>
                        {receiptMetadata.vendor}
                      </Text>
                    </View>
                  )}
                  {receiptMetadata?.date && (
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-400 text-sm">{t('receiptDateLabel')}:</Text>
                      <Text className="text-white text-sm font-medium">{receiptMetadata.date}</Text>
                    </View>
                  )}
                  {typeof convertedAmount === 'number' && receiptCurrency !== currency && (
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-400 text-sm">{t('convertedAmountLabel')}:</Text>
                      <Text className="text-white text-sm font-medium">
                        {formatCurrency(convertedAmount, currency)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Category Selection */}
            <View className="p-6">
              <Text className="text-lg font-semibold text-white mb-4">
                {t('selectCategoryForReceipt')}
              </Text>
              
              {/* Categories Grid */}
              <View className="flex-row flex-wrap justify-between">
                {(selectableCategories || []).map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className={`w-[48%] mb-3 p-3 rounded-xl border-2 ${
                      selectedCategoryId === category.id
                        ? 'border-yellow-500/50 bg-yellow-500/10'
                        : 'border-gray-600/50 bg-gray-800/50'
                    }`}
                    onPress={() => setSelectedCategoryId(category.id)}
                  >
                    <View className="items-center">
                      <View 
                        className="w-12 h-12 rounded-xl items-center justify-center mb-2"
                        style={{ backgroundColor: category.backgroundColor }}
                      >
                        {renderCategoryIcon(category)}
                      </View>
                      <Text className={`text-sm font-medium text-center ${
                        selectedCategoryId === category.id ? 'text-yellow-400' : 'text-white'
                      }`}>
                        {category.name}
                      </Text>
                      {category.amount > 0 && (
                        <Text className="text-xs text-gray-400 mt-1">
                          {formatCurrency(category.amount, currency)}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Add New Category Button */}
              <TouchableOpacity
                className="mt-4 p-4 border-2 border-dashed border-gray-500/50 rounded-xl items-center"
                onPress={onAddNewCategory}
              >
                <Ionicons name="add-circle-outline" size={24} color="#fbbf24" />
                <Text className="text-gray-400 font-medium mt-2">{t('addNewCategory')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="p-6 border-t border-gray-700/50">
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
                disabled={!selectedCategoryId}
              >
                {selectedCategoryId ? (
                  <LinearGradient
                    colors={['#3b82f6', '#1d4ed8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-xl py-4 justify-center items-center"
                  >
                    <Text className="text-white font-semibold">{t('addExpense')}</Text>
                  </LinearGradient>
                ) : (
                  <View className="bg-gray-600/50 rounded-xl py-4 justify-center items-center">
                    <Text className="text-gray-500 font-semibold">{t('addExpense')}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReceiptModal;
