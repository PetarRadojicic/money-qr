import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { resetAppData } from '../utils/dataManager';

interface SettingsScreenProps {
  onNavigateHome: () => void;
  onDataReset: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigateHome, onDataReset }) => {
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
    <SafeAreaView className="flex-1 bg-gray-50">
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
        {/* App Info Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">App Information</Text>
          
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="wallet" size={24} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 text-base">Money Tracker</Text>
                <Text className="text-gray-500 text-sm mt-1">Track your finances easily</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data Management Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Data Management</Text>
          
          <SettingsItem
            icon="refresh"
            iconLibrary="Ionicons"
            title="Reset App"
            subtitle="Clear all data and restore default settings"
            onPress={handleResetApp}
            isDestructive={true}
          />
        </View>

        {/* Categories Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Categories</Text>
          
          <View className="bg-white rounded-xl p-4 shadow-sm mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="list" size={20} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">Default Categories</Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Food, Transport, Entertainment, Health, Pets, Family, Clothes, Cafe
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="add-circle" size={20} color="#9333ea" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">Custom Categories</Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Add your own categories with custom icons
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Features</Text>
          
          <View className="bg-white rounded-xl p-4 shadow-sm mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="calendar" size={20} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">Monthly Tracking</Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Separate data for each month
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-4">
                <FontAwesome5 name="history" size={20} color="#ea580c" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">Transaction History</Text>
                <Text className="text-gray-500 text-sm mt-1">
                  View and revert any transaction
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="pencil" size={20} color="#db2777" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">Edit Categories</Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Edit, delete, or add new categories
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Version Info */}
        <View className="items-center py-8">
          <Text className="text-gray-400 text-sm">Money Tracker v1.0</Text>
          <Text className="text-gray-400 text-xs mt-1">Built with React Native & NativeWind</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
