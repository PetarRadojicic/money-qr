import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import { getCurrentMonthKey, getMonthlyData, calculateTotalBalance, getSelectedCurrency } from '../utils/dataManager';
import { createExpenseCategories } from '../constants/expenseCategories';
import { updateCurrencyRates } from '../utils/currencyService';

// Import all screen components
import HomeScreen from './HomeScreen';
import HistoryScreen from './HistoryScreen';
import SettingsScreen from './SettingsScreen';

export type ScreenType = 'home' | 'history' | 'settings';

interface NavigationManagerProps {
  // Add any global props that all screens might need
  onDataChange?: () => void;
  onCurrencyChange?: () => void;
  onDataReset?: () => void;
}

const NavigationManager: React.FC<NavigationManagerProps> = ({
  onDataChange,
  onCurrencyChange,
  onDataReset,
}) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  
  // Cache data for instant loading
  const [cachedData, setCachedData] = useState({
    monthlyData: null as any,
    totalBalance: 0,
    selectedCurrency: 'USD',
    expenseCategories: [] as any[],
    isLoaded: false,
  });

  // Pre-load data on app start
  useEffect(() => {
    preloadData();
  }, []);

  const preloadData = async () => {
    try {
      const [currency, monthlyData, totalBalance] = await Promise.all([
        getSelectedCurrency(),
        getMonthlyData(getCurrentMonthKey()),
        calculateTotalBalance(),
      ]);

      // Load categories immediately with the data
      const expenseCategories = await createExpenseCategories(monthlyData.categories);

      setCachedData({
        monthlyData,
        totalBalance,
        selectedCurrency: currency,
        expenseCategories,
        isLoaded: true,
      });

      // Fetch exchange rates in background
      updateCurrencyRates();
    } catch (error) {
      console.error('Error preloading data:', error);
    }
  };

  // Memoize navigation handler to prevent unnecessary re-renders
  const handleNavigation = useCallback((screen: ScreenType) => {
    setCurrentScreen(screen);
  }, []);

  // Data refresh handlers
  const handleDataRefresh = useCallback(async () => {
    await preloadData();
    onDataChange?.();
  }, [onDataChange]);

  const handleCurrencyRefresh = useCallback(async () => {
    await preloadData();
    onCurrencyChange?.();
  }, [onCurrencyChange]);

  const handleDataReset = useCallback(async () => {
    await preloadData();
    onDataReset?.();
  }, [onDataReset]);

  // Memoize navigation callbacks to prevent re-renders
  const navigationCallbacks = useMemo(() => ({
    home: {
      onNavigateHistory: () => handleNavigation('history'),
      onNavigateSettings: () => handleNavigation('settings'),
      cachedData,
      onDataRefresh: handleDataRefresh,
    },
    history: {
      onNavigateHome: () => handleNavigation('home'),
      onNavigateSettings: () => handleNavigation('settings'),
      onDataChange: handleDataRefresh,
      cachedData,
    },
    settings: {
      onNavigateHome: () => handleNavigation('home'),
      onNavigateHistory: () => handleNavigation('history'),
      onDataReset: handleDataReset,
      onCurrencyChange: handleCurrencyRefresh,
      cachedData,
    },
  }), [handleNavigation, handleDataRefresh, handleCurrencyRefresh, handleDataReset, cachedData]);

  // Memoize screen components to prevent re-mounting
  const renderCurrentScreen = useMemo(() => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen {...navigationCallbacks.home} />;
      case 'history':
        return <HistoryScreen {...navigationCallbacks.history} />;
      case 'settings':
        return <SettingsScreen {...navigationCallbacks.settings} />;
      default:
        return null;
    }
  }, [currentScreen, navigationCallbacks]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Main Content Area */}
      <View className="flex-1">
        {renderCurrentScreen}
      </View>
      
      {/* Bottom Navigation Bar - Always rendered */}
      <BottomNavigation
        currentScreen={currentScreen}
        onNavigate={handleNavigation}
      />
    </SafeAreaView>
  );
};

// Separate component for bottom navigation to prevent re-renders
interface BottomNavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = React.memo(({ 
  currentScreen, 
  onNavigate 
}) => {
  const isHomeActive = currentScreen === 'home';
  const isHistoryActive = currentScreen === 'history';
  const isSettingsActive = currentScreen === 'settings';

  return (
    <View className="bg-white border-t border-gray-200 px-4 py-2">
      <View className="flex-row justify-around items-center">
        {/* Home Tab */}
        <TouchableOpacity 
          className="items-center py-2 flex-1" 
          onPress={() => onNavigate('home')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="home" 
            size={24} 
            color={isHomeActive ? "#2563eb" : "#6b7280"} 
          />
          <Text className={`text-xs mt-1 ${
            isHomeActive ? 'text-blue-600 font-medium' : 'text-gray-500'
          }`}>
            Home
          </Text>
        </TouchableOpacity>
        
        {/* History Tab */}
        <TouchableOpacity 
          className="items-center py-2 flex-1" 
          onPress={() => onNavigate('history')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="time" 
            size={24} 
            color={isHistoryActive ? "#2563eb" : "#6b7280"} 
          />
          <Text className={`text-xs mt-1 ${
            isHistoryActive ? 'text-blue-600 font-medium' : 'text-gray-500'
          }`}>
            History
          </Text>
        </TouchableOpacity>
        
        {/* Settings Tab */}
        <TouchableOpacity 
          className="items-center py-2 flex-1" 
          onPress={() => onNavigate('settings')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="settings" 
            size={24} 
            color={isSettingsActive ? "#2563eb" : "#6b7280"} 
          />
          <Text className={`text-xs mt-1 ${
            isSettingsActive ? 'text-blue-600 font-medium' : 'text-gray-500'
          }`}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

BottomNavigation.displayName = 'BottomNavigation';

export default NavigationManager;
