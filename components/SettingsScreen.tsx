import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { resetAppData, getSelectedCurrency } from '../utils/dataManager';
import { getCurrencyByCode, formatCurrency } from '../constants/currencies';
import CurrencyModal from './CurrencyModal';
import ExchangeRateStatus from './ExchangeRateStatus';

interface SettingsScreenProps {
  onNavigateHome: () => void;
  onNavigateHistory: () => void;
  onDataReset: () => void;
  onCurrencyChange: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onNavigateHome, 
  onNavigateHistory,
  onDataReset, 
  onCurrencyChange
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  useEffect(() => {
    loadCurrentCurrency();
  }, []);

  const loadCurrentCurrency = async () => {
    const current = await getSelectedCurrency();
    setSelectedCurrency(current);
  };

  const handleCurrencyPress = () => {
    setShowCurrencyModal(true);
  };

  const handleCurrencyChange = () => {
    loadCurrentCurrency();
    onCurrencyChange();
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'Are you sure you want to reset the app?\n\nThis will delete:\n• All expenses and income\n• All transaction history\n• All custom categories\n• All modified categories\n\nThis action cannot be undone!',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetAppData();
              Alert.alert(
                'App Reset Complete',
                'All data has been cleared successfully. The app has been restored to its default state.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      onDataReset();
                      onNavigateHome();
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to reset the app. Please try again.');
              console.error('Reset error:', error);
            }
          },
        },
      ]
    );
  };

  const SettingsItem = ({ 
    icon, 
    iconLibrary = 'Ionicons', 
    title, 
    subtitle, 
    onPress, 
    isDestructive = false 
  }: {
    icon: string;
    iconLibrary?: 'Ionicons' | 'FontAwesome5';
    title: string;
    subtitle?: string;
    onPress: () => void;
    isDestructive?: boolean;
  }) => {
    const IconComponent = iconLibrary === 'FontAwesome5' ? FontAwesome5 : Ionicons;
    
    return (
      <TouchableOpacity
        className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center"
        onPress={onPress}
      >
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
          isDestructive ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          <IconComponent 
            name={icon} 
            size={20} 
            color={isDestructive ? '#dc2626' : '#2563eb'} 
          />
        </View>
        
        <View className="flex-1">
          <Text className={`font-semibold text-base ${
            isDestructive ? 'text-red-600' : 'text-gray-900'
          }`}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
          )}
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* Header */}
      <View className="bg-white px-6 py-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onNavigateHome} className="flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="#374151" />
            <Text className="text-lg font-semibold text-gray-900 ml-2">Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>

        {/* Currency Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Currency</Text>
          
          <ExchangeRateStatus onRatesUpdated={handleCurrencyChange} />
          
          <SettingsItem
            icon="cash"
            iconLibrary="Ionicons"
            title="Currency"
            subtitle={`${getCurrencyByCode(selectedCurrency).name} (${formatCurrency(100, selectedCurrency)})`}
            onPress={handleCurrencyPress}
          />
        </View>

        {/* Reset App Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Reset App</Text>
          
          <SettingsItem
            icon="refresh"
            iconLibrary="Ionicons"
            title="Reset App"
            subtitle="Clear all data and restore default settings"
            onPress={handleResetApp}
            isDestructive={true}
          />
        </View>

      </ScrollView>

      {/* Currency Modal */}
      <CurrencyModal
        isVisible={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        onCurrencyChange={handleCurrencyChange}
      />
    </>
  );
};

export default SettingsScreen;
