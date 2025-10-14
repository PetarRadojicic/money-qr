import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback } from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import * as SplashScreen from 'expo-splash-screen';

import RootNavigator from "./src/navigation/RootNavigator";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import AnimatedSplashScreen from "./src/components/animations/AnimatedSplashScreen";
import { usePreferencesStore } from "./src/store/preferences";

enableScreens();

// Keep the native splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const theme = usePreferencesStore((state) => state.getEffectiveTheme());
  const hasCompletedOnboarding = usePreferencesStore((state) => state.hasCompletedOnboarding);
  const { setColorScheme } = useColorScheme();
  const navigationTheme = theme === "dark" ? DarkTheme : DefaultTheme;

  const updateColorScheme = useCallback(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  useEffect(() => {
    updateColorScheme();
  }, [updateColorScheme]);

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate loading resources (you can add actual resource loading here)
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const handleAnimationFinish = () => {
    setShowAnimatedSplash(false);
  };

  if (!isReady || showAnimatedSplash) {
    return <AnimatedSplashScreen onAnimationFinish={handleAnimationFinish} />;
  }

  // Show welcome screen if onboarding is not completed
  if (!hasCompletedOnboarding) {
    return (
      <SafeAreaProvider>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <WelcomeScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
