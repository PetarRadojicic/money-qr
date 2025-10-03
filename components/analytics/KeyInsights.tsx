import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalyticsData } from '../../utils/analyticsCalculator';
import { formatCurrency } from '../../constants/currencies';
import { useTranslation } from '../../contexts/TranslationContext';

interface KeyInsightsProps {
  analyticsData: AnalyticsData;
  selectedCurrency: string;
}

export const KeyInsights: React.FC<KeyInsightsProps> = ({
  analyticsData,
  selectedCurrency,
}) => {
  const { t } = useTranslation();

  const hasInsights = (analyticsData.topSpendingCategory && analyticsData.topSpendingCategory.totalAmount > 0) ||
    (analyticsData.mostActiveMonth && analyticsData.mostActiveMonth.expenses > 0) ||
    (analyticsData.savingsRate !== 0);

  if (!hasInsights) {
    return null;
  }

  return (
    <View className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 mx-6 mb-4 border border-gray-700 shadow-lg">
      <Text className="text-lg font-semibold text-white mb-4 text-center">
        {t('keyInsights')}
      </Text>
      
      {analyticsData.topSpendingCategory && analyticsData.topSpendingCategory.totalAmount > 0 && (
        <View className="mb-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <View className="flex-row items-center mb-1">
            <Ionicons name="trending-up" size={16} color="#f97316" />
            <Text className="text-orange-400 font-medium ml-2">{t('topSpendingCategory')}</Text>
          </View>
          <Text className="text-gray-300">
            {t('youSpent')} {formatCurrency(analyticsData.topSpendingCategory.totalAmount, selectedCurrency)} {t('on')}{' '}
            <Text className="font-semibold text-white">{analyticsData.topSpendingCategory.name}</Text>
            {' '}({analyticsData.topSpendingCategory.percentage.toFixed(1)}% {t('ofTotal')} {t('expenses').toLowerCase()})
          </Text>
        </View>
      )}
      
      {analyticsData.mostActiveMonth && analyticsData.mostActiveMonth.expenses > 0 && (
        <View className="mb-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <View className="flex-row items-center mb-1">
            <Ionicons name="calendar" size={16} color="#3b82f6" />
            <Text className="text-blue-400 font-medium ml-2">{t('mostActiveMonth')}</Text>
          </View>
          <Text className="text-gray-300">
            <Text className="font-semibold text-white">{analyticsData.mostActiveMonth.monthName}</Text> {t('wasYourMostExpensive')}{' '}
            {formatCurrency(analyticsData.mostActiveMonth.expenses, selectedCurrency)} {t('inExpenses')}
          </Text>
        </View>
      )}
      
      {analyticsData.savingsRate !== 0 && (
        <View className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <View className="flex-row items-center mb-1">
            <Ionicons name="wallet" size={16} color="#10b981" />
            <Text className="text-green-400 font-medium ml-2">{t('savingsPerformance')}</Text>
          </View>
          <Text className="text-gray-300">
            {t('yourSavingsRateIs')} {analyticsData.savingsRate.toFixed(1)}%
            {analyticsData.savingsRate > 20 ? ' - Excellent!' : 
             analyticsData.savingsRate > 10 ? ' - Good work!' : 
             ' - Consider reducing expenses'}
          </Text>
        </View>
      )}
    </View>
  );
};
