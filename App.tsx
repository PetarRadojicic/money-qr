import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ExpenseCategory from './components/ExpenseCategory';
import { expenseCategories } from './constants/expenseCategories';
import './global.css';

export default function App() {
  // Handler functions
  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    if (categoryId === 'add') {
      console.log('Add new category pressed!');
      // TODO: Implement add category functionality
    } else {
      console.log(`${categoryName} category pressed!`);
      // TODO: Navigate to category details or show transactions
    }
  };

  const handleAddToBalance = () => {
    console.log('Add to balance pressed!');
    // TODO: Implement add to balance functionality
  };

  const handleNavigationPress = (tabName: string) => {
    console.log(`${tabName} tab pressed!`);
    // TODO: Implement navigation functionality
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Overall Balance Section */}
        <View className="mx-6 mt-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3 text-center">Overall Balance</Text>
          <View className="bg-blue-600 rounded-2xl p-6 shadow-lg items-center">
            <Text className="text-white text-sm opacity-90 text-center">Total Balance</Text>
            <Text className="text-white text-3xl font-bold mt-1 text-center">$2,450.00</Text>
            <Text className="text-green-300 text-sm mt-2 text-center">+12.5% from last month</Text>
          </View>
          
          {/* Month Navigation */}
          <View className="flex-row items-center justify-center mt-6">
            <TouchableOpacity className="bg-white w-12 h-12 rounded-full shadow-sm mr-4 items-center justify-center">
              <Ionicons name="chevron-back" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">December 2024</Text>
            <TouchableOpacity className="bg-white w-12 h-12 rounded-full shadow-sm ml-4 items-center justify-center">
              <Ionicons name="chevron-forward" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Monthly Overview */}
        <View className="mx-6 mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3 text-center">This Month</Text>
          <View className="flex-row justify-center">
            <View className="bg-white rounded-xl p-4 mr-2 shadow-sm w-32">
              <Text className="text-gray-600 text-sm text-center">Income</Text>
              <Text className="text-green-600 text-xl font-bold mt-1 text-center">$3,200</Text>
            </View>
            <View className="bg-white rounded-xl p-4 ml-2 shadow-sm w-32">
              <Text className="text-gray-600 text-sm text-center">Expenses</Text>
              <Text className="text-red-600 text-xl font-bold mt-1 text-center">$750</Text>
            </View>
          </View>
        </View>

        {/* Expense Categories */}
        <View className="mx-6 mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3 text-center">Spending Categories</Text>
          <View className="flex-row flex-wrap justify-center">
            {expenseCategories.map((category) => (
              <ExpenseCategory
                key={category.id}
                category={category}
                onPress={() => handleCategoryPress(category.id, category.name)}
              />
            ))}
          </View>
        </View>

        {/* Add to Balance Button */}
        <View className="mx-6 mt-6">
          <TouchableOpacity className="bg-blue-600 rounded-2xl p-4 shadow-lg" onPress={handleAddToBalance}>
            <View className="flex-row items-center justify-center">
              <Ionicons name="add-circle" size={24} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">Add to Balance</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom padding for scroll */}
        <View className="h-6" />
      </ScrollView>
      
      {/* Bottom Navigation Bar */}
      <View className="bg-white border-t border-gray-200 px-4 py-2">
        <View className="flex-row justify-around items-center">
          {/* Home Tab */}
          <TouchableOpacity className="items-center py-2" onPress={() => handleNavigationPress('Home')}>
            <Ionicons name="home" size={24} color="#2563eb" />
            <Text className="text-blue-600 text-xs mt-1 font-medium">Home</Text>
          </TouchableOpacity>
          
          {/* Analytics Tab */}
          <TouchableOpacity className="items-center py-2" onPress={() => handleNavigationPress('Analytics')}>
            <Ionicons name="analytics" size={24} color="#6b7280" />
            <Text className="text-gray-500 text-xs mt-1">Analytics</Text>
          </TouchableOpacity>
          
          {/* Settings Tab */}
          <TouchableOpacity className="items-center py-2" onPress={() => handleNavigationPress('Settings')}>
            <Ionicons name="settings" size={24} color="#6b7280" />
            <Text className="text-gray-500 text-xs mt-1">Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
