import React, { useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';

// Import all screen components
import HomeScreen from './HomeScreen';
import HistoryScreen from './HistoryScreen';
import SettingsScreen from './SettingsScreen';
import AnalyticsScreen from './AnalyticsScreen';

export type ScreenType = 'home' | 'analytics' | 'history' | 'settings';

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

  // Memoize navigation handler to prevent unnecessary re-renders
  const handleNavigation = useCallback((screen: ScreenType) => {
    setCurrentScreen(screen);
  }, []);

  // Memoize navigation callbacks to prevent re-renders
  const navigationCallbacks = useMemo(() => ({
    home: {
      onNavigateHistory: () => handleNavigation('history'),
      onNavigateSettings: () => handleNavigation('settings'),
    },
    analytics: {
      onNavigateHome: () => handleNavigation('home'),
      onNavigateHistory: () => handleNavigation('history'),
      onNavigateSettings: () => handleNavigation('settings'),
    },
    history: {
      onNavigateHome: () => handleNavigation('home'),
      onNavigateSettings: () => handleNavigation('settings'),
      onDataChange: onDataChange || (() => {}),
    },
    settings: {
      onNavigateHome: () => handleNavigation('home'),
      onNavigateHistory: () => handleNavigation('history'),
      onDataReset: onDataReset || (() => {}),
      onCurrencyChange: onCurrencyChange || (() => {}),
    },
  }), [handleNavigation, onDataChange, onDataReset, onCurrencyChange]);

  // Memoize screen components to prevent re-mounting
  const renderCurrentScreen = useMemo(() => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen {...navigationCallbacks.home} />;
      case 'analytics':
        return <AnalyticsScreen {...navigationCallbacks.analytics} />;
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
  const isAnalyticsActive = currentScreen === 'analytics';
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
        
        {/* Analytics Tab */}
        <TouchableOpacity 
          className="items-center py-2 flex-1" 
          onPress={() => onNavigate('analytics')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="analytics" 
            size={24} 
            color={isAnalyticsActive ? "#2563eb" : "#6b7280"} 
          />
          <Text className={`text-xs mt-1 ${
            isAnalyticsActive ? 'text-blue-600 font-medium' : 'text-gray-500'
          }`}>
            Analytics
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
