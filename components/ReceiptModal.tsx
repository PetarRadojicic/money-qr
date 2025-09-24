import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { formatCurrency } from '../constants/currencies';
import { useTranslation } from '../contexts/TranslationContext';

interface ReceiptModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (categoryId: string) => void;
  onAddNewCategory: () => void;
  receiptAmount: number;
  receiptData?: any;
  categories: any[];
  currency: string;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  onAddNewCategory,
  receiptAmount,
  receiptData,
  categories,
  currency,
}) => {
  const { t } = useTranslation();
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
      Alert.alert(t('selectCategory'), t('selectCategoryMessage'));
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
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        {/* Use explicit maxHeight because percentage-based max-h is not supported in RN */}
        <View className="bg-white rounded-2xl w-full" style={{ maxHeight: modalMaxHeight }}>
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-900">{t('receiptDetails')}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: contentMaxHeight }}>
            {/* Receipt Amount */}
            <View className="p-6 border-b border-gray-200">
              <View className="bg-green-50 rounded-xl p-4 items-center">
                <Text className="text-gray-600 text-sm">{t('scannedAmount')}</Text>
                <Text className="text-green-600 text-3xl font-bold mt-1">
                  {formatCurrency(Number.isFinite(receiptAmount) ? receiptAmount : 0, currency)}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {t('amountCannotBeChanged')}
                </Text>
              </View>
            </View>

            {/* Category Selection */}
            <View className="p-6">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                {t('selectCategoryForReceipt')}
              </Text>
              
              {/* Categories Grid */}
              <View className="flex-row flex-wrap justify-between">
                {(selectableCategories || []).map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className={`w-[48%] mb-3 p-3 rounded-xl border-2 ${
                      selectedCategoryId === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
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
                        selectedCategoryId === category.id ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {category.name}
                      </Text>
                      {category.amount > 0 && (
                        <Text className="text-xs text-gray-500 mt-1">
                          {formatCurrency(category.amount, currency)}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Add New Category Button */}
              <TouchableOpacity
                className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-xl items-center"
                onPress={onAddNewCategory}
              >
                <Ionicons name="add-circle-outline" size={24} color="#6b7280" />
                <Text className="text-gray-600 font-medium mt-2">{t('addNewCategory')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="p-6 border-t border-gray-200">
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-4"
                onPress={handleClose}
              >
                <Text className="text-gray-700 font-semibold text-center">{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 rounded-xl py-4 ${
                  selectedCategoryId ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onPress={handleConfirm}
                disabled={!selectedCategoryId}
              >
                <Text className={`font-semibold text-center ${
                  selectedCategoryId ? 'text-white' : 'text-gray-500'
                }`}>
                  {t('addExpense')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReceiptModal;
