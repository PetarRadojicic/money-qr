import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../contexts/TranslationContext';

interface AnalyticsHeaderProps {
  timeRange: 'specific' | 'all';
  selectedMonthsCount: number;
  onTimeRangeChange: (range: 'all') => void;
  onShowMonthPicker: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  timeRange,
  selectedMonthsCount,
  onTimeRangeChange,
  onShowMonthPicker,
}) => {
  const { t } = useTranslation();

  return (
    <View className="mx-6 mt-8 mb-4">
      <Text className="text-2xl font-bold text-white text-center mb-2">{t('analytics')}</Text>
      
      {/* Time Range Selector */}
      <View className="flex-row justify-center space-x-3">
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${
            timeRange === 'all' ? 'bg-yellow-500' : 'bg-gray-800'
          }`}
          onPress={() => onTimeRangeChange('all')}
        >
          <Text className={`text-sm ${
            timeRange === 'all' ? 'text-black font-bold' : 'text-gray-300'
          }`}>
            {t('allTime')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${
            timeRange === 'specific' ? 'bg-yellow-500' : 'bg-gray-800'
          }`}
          onPress={onShowMonthPicker}
        >
          <View className="flex-row items-center">
            <Text className={`text-sm ${
              timeRange === 'specific' ? 'text-black font-bold' : 'text-gray-300'
            }`}>
              {timeRange === 'specific' && selectedMonthsCount > 0 
                ? `${selectedMonthsCount} ${selectedMonthsCount !== 1 ? t('selectMonths').toLowerCase() : t('selectMonths').toLowerCase().slice(0, -1)}`
                : t('selectMonths')
              }
            </Text>
            <Ionicons 
              name="chevron-down" 
              size={16} 
              color={timeRange === 'specific' ? '#000000' : '#9CA3AF'} 
              style={{ marginLeft: 4 }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
