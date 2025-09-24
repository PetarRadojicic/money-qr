import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../contexts/TranslationContext';

interface AppLayoutProps {
  children: React.ReactNode;
  currentScreen: 'home' | 'history' | 'settings';
  onNavigationPress: (tabName: string) => void;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentScreen,
  onNavigationPress,
  title,
  showBackButton = false,
  onBackPress,
}) => {
  const { t } = useTranslation();
  const isHomeScreen = currentScreen === 'home';
  const isHistoryScreen = currentScreen === 'history';
  const isSettingsScreen = currentScreen === 'settings';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header for non-home screens */}
      {(isHistoryScreen || isSettingsScreen) && (
        <View className="bg-white px-6 py-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            {showBackButton && onBackPress ? (
              <TouchableOpacity onPress={onBackPress} className="flex-row items-center">
                <Ionicons name="arrow-back" size={24} color="#374151" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">{title}</Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-lg font-semibold text-gray-900">{title}</Text>
            )}
            <View className="w-6" />
          </View>
        </View>
      )}

      {/* Main Content */}
      <View className="flex-1">
        {children}
      </View>
      
      {/* Bottom Navigation Bar */}
      <View className="bg-white border-t border-gray-200 px-4 py-2">
        <View className="flex-row justify-around items-center">
          {/* Home Tab */}
          <TouchableOpacity 
            className="items-center py-2" 
            onPress={() => onNavigationPress('Home')}
          >
            <Ionicons 
              name="home" 
              size={24} 
              color={isHomeScreen ? "#2563eb" : "#6b7280"} 
            />
            <Text className={`text-xs mt-1 ${
              isHomeScreen ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              {t('home')}
            </Text>
          </TouchableOpacity>
          
          {/* History Tab */}
          <TouchableOpacity 
            className="items-center py-2" 
            onPress={() => onNavigationPress('History')}
          >
            <Ionicons 
              name="time" 
              size={24} 
              color={isHistoryScreen ? "#2563eb" : "#6b7280"} 
            />
            <Text className={`text-xs mt-1 ${
              isHistoryScreen ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              {t('history')}
            </Text>
          </TouchableOpacity>
          
          {/* Settings Tab */}
          <TouchableOpacity 
            className="items-center py-2" 
            onPress={() => onNavigationPress('Settings')}
          >
            <Ionicons 
              name="settings" 
              size={24} 
              color={isSettingsScreen ? "#2563eb" : "#6b7280"} 
            />
            <Text className={`text-xs mt-1 ${
              isSettingsScreen ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              {t('settings')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppLayout;
