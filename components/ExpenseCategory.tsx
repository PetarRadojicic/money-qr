import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { formatCurrency } from '../constants/currencies';
import { useTranslation } from '../contexts/TranslationContext';

// Type definition for expense category data
export interface ExpenseCategoryData {
  id: string;
  name: string;
  amount: number;
  icon: {
    library: 'Ionicons' | 'MaterialIcons' | 'FontAwesome5';
    name: string;
    color: string;
  };
  backgroundColor: string;
  isAddButton?: boolean;
}

interface ExpenseCategoryProps {
  category: ExpenseCategoryData;
  onPress?: () => void;
  isEditMode?: boolean;
  currency?: string;
}

const ExpenseCategory: React.FC<ExpenseCategoryProps> = ({ 
  category, 
  onPress,
  isEditMode = false,
  currency = 'USD'
}) => {
  const { t } = useTranslation();
  const renderIcon = () => {
    const iconProps = {
      size: 24,
      color: category.icon.color,
    };

    switch (category.icon.library) {
      case 'Ionicons':
        return <Ionicons name={category.icon.name as any} {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons name={category.icon.name as any} {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={category.icon.name as any} {...iconProps} />;
      default:
        return null;
    }
  };

  const containerStyle = category.isAddButton
    ? "bg-gray-100 rounded-xl p-4 mb-3 w-[48%] shadow-sm items-center justify-center border-2 border-dashed border-gray-300"
    : isEditMode 
      ? "bg-blue-50 rounded-xl p-4 mb-3 w-[48%] shadow-sm items-center border-2 border-blue-200"
      : "bg-white rounded-xl p-4 mb-3 w-[48%] shadow-sm items-center";

  const iconContainerStyle = category.isAddButton
    ? "bg-gray-200 rounded-lg p-3 w-12 h-12 items-center justify-center mb-3"
    : `${category.backgroundColor} rounded-lg p-3 w-12 h-12 items-center justify-center mb-3`;

  const titleStyle = category.isAddButton
    ? "text-gray-600 font-semibold text-center"
    : "text-gray-900 font-semibold text-center";

  const amountStyle = category.isAddButton
    ? "text-gray-500 text-sm text-center"
    : "text-gray-600 text-sm text-center";

  return (
    <TouchableOpacity className={containerStyle} onPress={onPress}>
      <View className={iconContainerStyle}>
        {renderIcon()}
      </View>
      <Text className={titleStyle}>{category.name}</Text>
      {!category.isAddButton && (
        <Text className={amountStyle}>{formatCurrency(category.amount, currency)}</Text>
      )}
      {category.isAddButton && (
        <Text className={amountStyle}>{t('newCategory')}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ExpenseCategory;
