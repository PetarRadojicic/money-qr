import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";

import RootNavigator from "./src/navigation/RootNavigator";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { usePreferencesStore } from "./src/store/preferences";

enableScreens();

export default function App() {
  const theme = usePreferencesStore((state) => state.theme);
  const hasCompletedOnboarding = usePreferencesStore((state) => state.hasCompletedOnboarding);
  const { setColorScheme } = useColorScheme();
  const navigationTheme = theme === "dark" ? DarkTheme : DefaultTheme;

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

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
