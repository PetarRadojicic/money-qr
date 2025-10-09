import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-slate-900">
          NativeWind is ready to go! 🎉
        </Text>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}
