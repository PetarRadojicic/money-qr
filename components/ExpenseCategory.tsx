import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

  if (category.isAddButton) {
    return (
      <TouchableOpacity 
        className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 mb-3 mx-1 w-[47%] border-2 border-dashed border-gray-600 items-center justify-center"
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View className="bg-gray-700/60 rounded-xl p-3 w-12 h-12 items-center justify-center mb-3">
          <Ionicons name="add" size={24} color="#FFD700" />
        </View>
        <Text className="text-gray-300 font-bold text-center text-sm">{t('newCategory')}</Text>
      </TouchableOpacity>
    );
  }

  const isEditModeStyle = isEditMode 
    ? "bg-yellow-500/20 border-2 border-yellow-500/50" 
    : "bg-gray-800/60 border border-gray-700";

  return (
    <TouchableOpacity 
      className={`${isEditModeStyle} rounded-2xl p-4 mb-3 mx-1 w-[47%] backdrop-blur-sm shadow-lg items-center`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className={`${category.backgroundColor} rounded-xl p-3 w-12 h-12 items-center justify-center mb-3 shadow-sm`}>
        {renderIcon()}
      </View>
      <Text className="text-white font-bold text-center text-sm mb-1">{category.name}</Text>
      <View className="bg-gray-700/40 rounded-xl px-2 py-1">
        <Text className="text-gray-300 text-xs text-center font-medium">
          {formatCurrency(category.amount, currency)}
        </Text>
      </View>
      {isEditMode && (
        <View className="absolute top-2 right-2 w-4 h-4 bg-yellow-500 rounded-full items-center justify-center">
          <Ionicons name="pencil" size={8} color="#000000" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ExpenseCategory;
