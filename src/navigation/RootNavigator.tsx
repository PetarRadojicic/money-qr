import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";

import { useTranslation } from "../hooks/useTranslation";
import HomeScreen from "../screens/HomeScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { usePreferencesStore } from "../store/preferences";

export type RootTabParamList = {
  Home: undefined;
  Analytics: undefined;
  History: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

type IconConfig = {
  focused: keyof typeof Ionicons.glyphMap;
  unfocused: keyof typeof Ionicons.glyphMap;
};

const TAB_ICONS: Record<keyof RootTabParamList, IconConfig> = {
  Home: {
    focused: "home",
    unfocused: "home-outline",
  },
  Analytics: {
    focused: "stats-chart",
    unfocused: "stats-chart",
  },
  History: {
    focused: "time",
    unfocused: "time-outline",
  },
  Settings: {
    focused: "settings",
    unfocused: "settings-outline",
  },
};

const getScreenOptions = (
  theme: "light" | "dark"
): ((props: {
  route: { name: string };
}) => BottomTabNavigationOptions) => {
  const isDark = theme === "dark";

  return ({ route }) => {
    const iconConfig = TAB_ICONS[route.name as keyof RootTabParamList];
    return {
      headerShown: false,
      tabBarIcon: ({ color, size, focused }) => {
        if (!iconConfig) {
          return null;
        }
        const iconName = focused ? iconConfig.focused : iconConfig.unfocused;
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: isDark ? "#38bdf8" : "#2563eb",
      tabBarInactiveTintColor: isDark ? "#64748b" : "#94a3b8",
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        backgroundColor: isDark ? "#020617" : "#ffffff",
        borderTopColor: isDark ? "#1e293b" : "#e2e8f0",
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
      },
    } satisfies BottomTabNavigationOptions;
  };
};

const RootNavigator = () => {
  const themePreference = usePreferencesStore((state) => state.theme);
  const getEffectiveTheme = usePreferencesStore((state) => state.getEffectiveTheme);
  const { t } = useTranslation();

  const effectiveTheme = getEffectiveTheme();
  const screenOptions = useMemo(() => getScreenOptions(effectiveTheme), [effectiveTheme, themePreference]);

  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t("homeTitle") }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: t("historyTitle") }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ title: t("analyticsTitle") }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t("settingsTitle") }}
      />
    </Tab.Navigator>
  );
};

export default RootNavigator;

