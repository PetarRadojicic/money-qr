import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  updateCurrencyRates, 
  areRatesFresh, 
  getCachedRates,
  getExchangeRateStatus 
} from '../utils/currencyService';
import { useTranslation } from '../contexts/TranslationContext';
import { useAlert } from './AlertProvider';

interface ExchangeRateStatusProps {
  onRatesUpdated?: () => void;
}

const ExchangeRateStatus: React.FC<ExchangeRateStatusProps> = ({ onRatesUpdated }) => {
  const { t } = useTranslation();
  const { success, error } = useAlert();
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
      setLastUpdated(t('ratesFreshWithTime', { minutesLeft: String(minutesLeft) }));
    } else if (status.hasRates) {
      setLastUpdated(t('ratesOutdated'));
    } else {
      setLastUpdated(t('noRatesAvailable'));
    }
  };

  const handleRefreshRates = async () => {
    setIsRefreshing(true);
    
    try {
      const success = await updateCurrencyRates();
      
      if (success) {
        const status = getExchangeRateStatus();
        success(
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
        error(
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
      error(
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
    return fresh ? 'text-green-400' : 'text-orange-400';
  };

  const getStatusIcon = () => {
    const fresh = areRatesFresh();
    return fresh ? 'checkmark-circle' : 'warning';
  };

  return (
    <View className="bg-gray-800/50 rounded-xl p-4 mb-3 border border-gray-700/50" style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-blue-500/20 rounded-full items-center justify-center mr-4">
            <Ionicons name="trending-up" size={20} color="#60a5fa" />
          </View>
          
          <View className="flex-1">
            <Text className="font-semibold text-white text-base">
              {t('exchangeRates')}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons 
                name={getStatusIcon()} 
                size={16} 
                color={areRatesFresh() ? "#4ade80" : "#fb923c"} 
              />
              <Text className={`text-sm ml-1 ${getStatusColor()}`}>
                {lastUpdated}
              </Text>
            </View>
            {ratesCount > 0 && (
              <Text className="text-gray-400 text-xs mt-1">
                {t('currenciesAvailableCount', { count: String(ratesCount) })}
              </Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          className="bg-blue-500/20 rounded-full p-2"
          onPress={handleRefreshRates}
          disabled={isRefreshing}
        >
          <Ionicons 
            name={isRefreshing ? "sync" : "refresh"} 
            size={20} 
            color="#60a5fa" 
            style={isRefreshing ? { transform: [{ rotate: '180deg' }] } : {}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExchangeRateStatus;
