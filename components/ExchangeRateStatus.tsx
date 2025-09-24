import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  updateCurrencyRates, 
  areRatesFresh, 
  getCachedRates,
  getExchangeRateStatus 
} from '../utils/currencyService';
import { useTranslation } from '../contexts/TranslationContext';

interface ExchangeRateStatusProps {
  onRatesUpdated?: () => void;
}

const ExchangeRateStatus: React.FC<ExchangeRateStatusProps> = ({ onRatesUpdated }) => {
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [ratesCount, setRatesCount] = useState(0);

  useEffect(() => {
    checkRatesStatus();
  }, []);

  const checkRatesStatus = () => {
    const status = getExchangeRateStatus();
    setRatesCount(status.ratesCount);
    
    if (status.isFresh && status.hasRates) {
      const minutesLeft = Math.floor(status.timeUntilExpiry / (60 * 1000));
      setLastUpdated(`Rates are fresh (${minutesLeft}m left)`);
    } else if (status.hasRates) {
      setLastUpdated('Rates are outdated');
    } else {
      setLastUpdated('No rates available');
    }
  };

  const handleRefreshRates = async () => {
    setIsRefreshing(true);
    
    try {
      const success = await updateCurrencyRates();
      
      if (success) {
        const status = getExchangeRateStatus();
        Alert.alert(
          t('ratesUpdatedSuccessfully'),
          `Currency exchange rates have been updated successfully!\n\n📊 ${status.ratesCount} currencies loaded\n⏰ Fresh for 60 minutes`,
          [
            {
              text: t('ok'),
              onPress: () => {
                checkRatesStatus();
                onRatesUpdated?.();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          t('failedToUpdateRates'),
          'Failed to update exchange rates. Using cached or fallback rates.\n\nThis might be due to:\n• Network connectivity issues\n• API rate limits\n• Server maintenance',
          [
            {
              text: t('ok'),
              onPress: checkRatesStatus,
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        t('error'),
        'An error occurred while updating exchange rates.',
        [
          {
            text: t('ok'),
            onPress: checkRatesStatus,
          },
        ]
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = () => {
    const fresh = areRatesFresh();
    return fresh ? 'text-green-600' : 'text-orange-600';
  };

  const getStatusIcon = () => {
    const fresh = areRatesFresh();
    return fresh ? 'checkmark-circle' : 'warning';
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
            <Ionicons name="trending-up" size={20} color="#2563eb" />
          </View>
          
          <View className="flex-1">
            <Text className="font-semibold text-gray-900 text-base">
              {t('exchangeRates')}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons 
                name={getStatusIcon()} 
                size={16} 
                color={areRatesFresh() ? "#16a34a" : "#ea580c"} 
              />
              <Text className={`text-sm ml-1 ${getStatusColor()}`}>
                {lastUpdated}
              </Text>
            </View>
            {ratesCount > 0 && (
              <Text className="text-gray-500 text-xs mt-1">
                {ratesCount} currencies available
              </Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          className="bg-blue-100 rounded-full p-2"
          onPress={handleRefreshRates}
          disabled={isRefreshing}
        >
          <Ionicons 
            name={isRefreshing ? "sync" : "refresh"} 
            size={20} 
            color="#2563eb" 
            style={isRefreshing ? { transform: [{ rotate: '180deg' }] } : {}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExchangeRateStatus;
