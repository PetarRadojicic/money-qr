import React from 'react';
import { View, ScrollView } from 'react-native';

export const LoadingSkeleton: React.FC = () => (
  <View className="flex-1 bg-black">
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="mx-6 mt-8">
        {[...Array(6)].map((_, index) => (
          <View key={index} className="bg-gray-800 rounded-xl p-4 mb-4 h-32" />
        ))}
      </View>
    </ScrollView>
  </View>
);
