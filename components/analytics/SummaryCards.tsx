import React from 'react';
import { View, Text } from 'react-native';
import { AnalyticsData } from '../../utils/analyticsCalculator';
import { formatCurrency } from '../../constants/currencies';
import { useTranslation } from '../../contexts/TranslationContext';

interface SummaryCardsProps {
  analyticsData: AnalyticsData;
  selectedCurrency: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  analyticsData,
  selectedCurrency,
}) => {
  const { t } = useTranslation();

  return (
    <View className="mx-4 mb-4">
      <View className="flex-row space-x-4">
        <View className="flex-1 bg-green-500/10 rounded-xl p-3 border border-green-500/20 items-center m-1">
          <Text className="text-green-400 text-sm font-medium text-center">{t('totalIncome')}</Text>
          <Text className="text-green-300 text-lg font-bold text-center">
            {formatCurrency(analyticsData.totalIncome, selectedCurrency)}
          </Text>
          <Text className="text-green-400 text-xs text-center">
            {t('avg')}: {formatCurrency(analyticsData.averageMonthlyIncome, selectedCurrency)}/mo
          </Text>
        </View>
        
        <View className="flex-1 bg-red-500/10 rounded-xl p-3 border border-red-500/20 items-center m-1">
          <Text className="text-red-400 text-sm font-medium text-center">{t('totalExpenses')}</Text>
          <Text className="text-red-300 text-lg font-bold text-center">
            {formatCurrency(analyticsData.totalExpenses, selectedCurrency)}
          </Text>
          <Text className="text-red-400 text-xs text-center">
            {t('avg')}: {formatCurrency(analyticsData.averageMonthlyExpenses, selectedCurrency)}/mo
          </Text>
        </View>
      </View>
      
      <View className="flex-row space-x-4 mt-4">
        <View className="flex-1 bg-blue-500/10 rounded-xl p-3 border border-blue-500/20 items-center m-1">
          <Text className="text-blue-400 text-sm font-medium text-center">{t('netSavings')}</Text>
          <Text className="text-blue-300 text-lg font-bold text-center">
            {formatCurrency(analyticsData.totalBalance, selectedCurrency)}
          </Text>
          <Text className="text-blue-400 text-xs text-center">
            {t('rate')}: {analyticsData.savingsRate.toFixed(1)}%
          </Text>
        </View>
        
        <View className="flex-1 bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 items-center m-1">
          <Text className="text-purple-400 text-sm font-medium text-center">{t('monthsTracked')}</Text>
          <Text className="text-purple-300 text-lg font-bold text-center">
            {analyticsData.recentMonths}
          </Text>
          <Text className="text-purple-400 text-xs text-center">
            {t('categories')}: {analyticsData.categoryAnalytics.length}
          </Text>
        </View>
      </View>
    </View>
  );
};
