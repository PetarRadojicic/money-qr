import React, { useState, useCallback, useMemo, memo, useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '../contexts/TranslationContext';

// Import all screen components
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

// Import data loading functions
import { loadData, loadTransactionHistory, getSelectedCurrency, getIsOnboardingDone } from '../utils/dataManager';
import WelcomeScreen from '../screens/WelcomeScreen';

export type ScreenType = 'home' | 'analytics' | 'history' | 'settings';

interface GlobalData {
  appData: any;
  transactionHistory: any;
  selectedCurrency: string;
  isDataReady: boolean;
}

interface NavigationManagerProps {
  // Add any global props that all screens might need
  onDataChange?: () => void;
  onCurrencyChange?: () => void;
  onDataReset?: () => void;
  dataChangeCounter?: number;
  resetCounter?: number;
  currencyChangeCounter?: number;
}

const NavigationManager: React.FC<NavigationManagerProps> = ({
  onDataChange,
  onCurrencyChange,
  onDataReset,
  dataChangeCounter,
  resetCounter,
  currencyChangeCounter,
}) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [globalData, setGlobalData] = useState<GlobalData>({
    appData: {},
    transactionHistory: { transactions: [] },
    selectedCurrency: 'USD',
    isDataReady: false,
  });
  
  // Track which screens have been preloaded
  const preloadedScreens = useRef<Set<ScreenType>>(new Set(['home']));
  
  // Track preloading state
  const [preloadingScreen, setPreloadingScreen] = useState<ScreenType | null>(null);
  const preloadTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Overlay fade animation to avoid shadow/border artifacts
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Preload global data on app start and check onboarding
  useEffect(() => {
    const preloadGlobalData = async () => {
      try {
        const [appData, transactionHistory, selectedCurrency, onboardingDone] = await Promise.all([
          loadData(),
          loadTransactionHistory(),
          getSelectedCurrency(),
          getIsOnboardingDone(),
        ]);
        
        setGlobalData({
          appData,
          transactionHistory,
          selectedCurrency,
          isDataReady: true,
        });

        if (!onboardingDone) {
          setShowWelcome(true);
        }
      } catch (error) {
        console.error('Error preloading global data:', error);
        // Set data ready to true even on error to prevent infinite loading
        setGlobalData(prev => ({ ...prev, isDataReady: true }));
      }
    };
    
    preloadGlobalData();
  }, []);

  // Re-check onboarding flag when parent signals a reset
  useEffect(() => {
    const checkOnboarding = async () => {
      const done = await getIsOnboardingDone();
      setShowWelcome(!done);
    };
    checkOnboarding();
  }, [resetCounter]);

  useEffect(() => {
    // When currency changes or other global changes occur, no-op for welcome
  }, [globalData.selectedCurrency]);

  // Fade overlay out on initial data ready
  useEffect(() => {
    if (globalData.isDataReady) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [globalData.isDataReady, fadeAnim]);

  // Fade in the welcome screen when it appears
  useEffect(() => {
    if (showWelcome) {
      fadeAnim.setValue(1);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [showWelcome, fadeAnim]);

  const handleWelcomeComplete = useCallback(() => {
    // Show overlay, wait 150ms for smooth transition, then reveal app
    fadeAnim.setValue(1);
    setTimeout(() => {
      setShowWelcome(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 150);
  }, [fadeAnim]);

  // Update global data when currency changes
  useEffect(() => {
    if (!globalData.isDataReady) return;
    const refreshForCurrencyChange = async () => {
      try {
        const [appData, transactionHistory, currency] = await Promise.all([
          loadData(),
          loadTransactionHistory(),
          getSelectedCurrency(),
        ]);
        setGlobalData(prev => ({
          ...prev,
          appData,
          transactionHistory,
          selectedCurrency: currency,
        }));
      } catch (e) {
        // Still try to at least update currency so UI formats correctly
        const currency = await getSelectedCurrency();
        setGlobalData(prev => ({ ...prev, selectedCurrency: currency }));
      }
    };
    refreshForCurrencyChange();
  }, [currencyChangeCounter, globalData.isDataReady]);

  // Refresh global data when data changes
  const refreshGlobalData = useCallback(async () => {
    if (globalData.isDataReady) {
      try {
        const [appData, transactionHistory] = await Promise.all([
          loadData(),
          loadTransactionHistory(),
        ]);
        setGlobalData(prev => ({ 
          ...prev, 
          appData, 
          transactionHistory 
        }));
      } catch (error) {
        console.error('Error refreshing global data:', error);
      }
    }
  }, [globalData.isDataReady]);

  // Watch for data changes and refresh
  useEffect(() => {
    if (dataChangeCounter !== undefined && dataChangeCounter > 0) {
      refreshGlobalData();
    }
  }, [dataChangeCounter, refreshGlobalData]);

  // Cleanup preload timeout on unmount
  useEffect(() => {
    return () => {
      if (preloadTimeout.current) {
        clearTimeout(preloadTimeout.current);
      }
    };
  }, []);

  // Preload screen function - starts loading the screen without switching to it
  const preloadScreen = useCallback((screen: ScreenType) => {
    if (screen === currentScreen || preloadingScreen === screen) return;
    
    setPreloadingScreen(screen);
    // Mark screen as being preloaded
    preloadedScreens.current.add(screen);
  }, [currentScreen, preloadingScreen]);

  // Navigation handler with preloading mechanism
  const handleNavigationWithPreload = useCallback((screen: ScreenType) => {
    if (screen === currentScreen) return;
    
    // Clear any existing preload timeout
    if (preloadTimeout.current) {
      clearTimeout(preloadTimeout.current);
    }
    
    // Start preloading the screen immediately
    preloadScreen(screen);
    
    // Wait 100ms before actually switching screens
    preloadTimeout.current = setTimeout(() => {
      // Only animate if data is ready to prevent showing loading states
      if (globalData.isDataReady) {
        // Show overlay before switching screens
        fadeAnim.setValue(1);
      }

      // Switch to the preloaded screen
      setCurrentScreen(screen);
      setPreloadingScreen(null);
      
      if (globalData.isDataReady) {
        // Fade overlay out after content is ready
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500, // Consistent with welcome screen fade
          useNativeDriver: true,
        }).start();
      }
    }, 100);
  }, [currentScreen, globalData.isDataReady, fadeAnim, preloadScreen]);

  // Keep the old immediate navigation for backwards compatibility
  const handleNavigation = useCallback((screen: ScreenType) => {
    if (screen === currentScreen) return;
    
    // Only animate if data is ready to prevent showing loading states
    if (globalData.isDataReady) {
      // Show overlay before switching screens
      fadeAnim.setValue(1);
    }

    // Mark screen as preloaded when navigating to it
    preloadedScreens.current.add(screen);
    setCurrentScreen(screen);
    
    if (globalData.isDataReady) {
      // Fade overlay out after content is ready
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [currentScreen, globalData.isDataReady, fadeAnim]);

  // Memoize individual navigation callbacks with preloading
  const navigateToHome = useCallback(() => handleNavigationWithPreload('home'), [handleNavigationWithPreload]);
  const navigateToAnalytics = useCallback(() => handleNavigationWithPreload('analytics'), [handleNavigationWithPreload]);
  const navigateToHistory = useCallback(() => handleNavigationWithPreload('history'), [handleNavigationWithPreload]);
  const navigateToSettings = useCallback(() => handleNavigationWithPreload('settings'), [handleNavigationWithPreload]);
  
  // Memoize screen-specific callbacks
  const homeCallbacks = useMemo(() => ({
    onNavigateHistory: navigateToHistory,
    onNavigateSettings: navigateToSettings,
    onDataChange: onDataChange || (() => {}),
    globalData,
    skipInitialLoading: preloadedScreens.current.has('home') && globalData.isDataReady,
  }), [navigateToHistory, navigateToSettings, onDataChange, globalData]);
  
  const analyticsCallbacks = useMemo(() => ({
    onNavigateHome: navigateToHome,
    onNavigateHistory: navigateToHistory,
    onNavigateSettings: navigateToSettings,
    globalData,
    skipInitialLoading: preloadedScreens.current.has('analytics') && globalData.isDataReady,
  }), [navigateToHome, navigateToHistory, navigateToSettings, globalData]);
  
  const historyCallbacks = useMemo(() => ({
    onNavigateHome: navigateToHome,
    onNavigateSettings: navigateToSettings,
    onDataChange: onDataChange || (() => {}),
    globalData,
    skipInitialLoading: preloadedScreens.current.has('history') && globalData.isDataReady,
  }), [navigateToHome, navigateToSettings, onDataChange, globalData]);
  
  const settingsCallbacks = useMemo(() => ({
    onNavigateHome: navigateToHome,
    onNavigateHistory: navigateToHistory,
    onDataReset: onDataReset || (() => {}),
    onCurrencyChange: onCurrencyChange || (() => {}),
    globalData,
    skipInitialLoading: preloadedScreens.current.has('settings') && globalData.isDataReady,
  }), [navigateToHome, navigateToHistory, onDataReset, onCurrencyChange, globalData]);

  // Memoize screen components to prevent re-mounting
  const renderCurrentScreen = useMemo(() => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen {...homeCallbacks} />;
      case 'analytics':
        return <AnalyticsScreen {...analyticsCallbacks} />;
      case 'history':
        return <HistoryScreen {...historyCallbacks} />;
      case 'settings':
        return <SettingsScreen {...settingsCallbacks} />;
      default:
        return null;
    }
  }, [currentScreen, homeCallbacks, analyticsCallbacks, historyCallbacks, settingsCallbacks]);

  // Render preloading screen in background (hidden)
  const renderPreloadingScreen = useMemo(() => {
    if (!preloadingScreen || preloadingScreen === currentScreen) return null;
    
    const PreloadComponent = () => {
      switch (preloadingScreen) {
        case 'home':
          return <HomeScreen {...homeCallbacks} />;
        case 'analytics':
          return <AnalyticsScreen {...analyticsCallbacks} />;
        case 'history':
          return <HistoryScreen {...historyCallbacks} />;
        case 'settings':
          return <SettingsScreen {...settingsCallbacks} />;
        default:
          return null;
      }
    };

    return (
      <View style={{ position: 'absolute', left: -9999, top: -9999, opacity: 0 }}>
        <PreloadComponent />
      </View>
    );
  }, [preloadingScreen, currentScreen, homeCallbacks, analyticsCallbacks, historyCallbacks, settingsCallbacks]);

  // Render only the welcome screen while onboarding
  if (showWelcome) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar style="dark" />
        <WelcomeScreen onComplete={handleWelcomeComplete} />
        {/* Black overlay to match main app background */}
        <Animated.View 
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000000',
            opacity: fadeAnim,
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="dark" />
      
      {/* Main Content Area */}
      <Animated.View 
        className="flex-1"
        style={{ backgroundColor: '#000000' }}
      >
        {renderCurrentScreen}
      </Animated.View>
      
      {/* Preloading screen in background (hidden) */}
      {renderPreloadingScreen}
      
      {/* Dark overlay to avoid gray borders during fades */}
      <Animated.View 
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000000',
          opacity: fadeAnim,
        }}
      />
      
      {/* Bottom Navigation Bar */}
      <BottomNavigation
        currentScreen={currentScreen}
        onNavigate={handleNavigationWithPreload}
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
  const { t } = useTranslation();
  const isHomeActive = currentScreen === 'home';
  const isAnalyticsActive = currentScreen === 'analytics';
  const isHistoryActive = currentScreen === 'history';
  const isSettingsActive = currentScreen === 'settings';

  return (
    <View className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 px-4 py-3">
      <View className="flex-row justify-around items-center">
        {/* Home Tab */}
        <TouchableOpacity 
          className="items-center py-2 flex-1" 
          onPress={() => onNavigate('home')}
          activeOpacity={0.7}
        >
          {isHomeActive ? (
            <View className="bg-yellow-500/20 rounded-xl p-2 mb-1">
              <Ionicons 
                name="home" 
                size={24} 
                color="#FFD700" 
              />
            </View>
          ) : (
            <Ionicons 
              name="home-outline" 
              size={24} 
              color="#9CA3AF" 
            />
          )}
          <Text className={`text-xs mt-1 ${
            isHomeActive ? 'text-yellow-400 font-bold' : 'text-gray-400'
          }`}>
            {t('home')}
          </Text>
        </TouchableOpacity>
        
        {/* Analytics Tab */}
        <TouchableOpacity 
          className="items-center py-2 flex-1" 
          onPress={() => onNavigate('analytics')}
          activeOpacity={0.7}
        >
          {isAnalyticsActive ? (
            <View className="bg-yellow-500/20 rounded-xl p-2 mb-1">
              <Ionicons 
                name="analytics" 
                size={24} 
                color="#FFD700" 
              />
            </View>
          ) : (
            <Ionicons 
              name="analytics-outline" 
              size={24} 
              color="#9CA3AF" 
            />
          )}
          <Text className={`text-xs mt-1 ${
            isAnalyticsActive ? 'text-yellow-400 font-bold' : 'text-gray-400'
          }`}>
            {t('analytics')}
          </Text>
        </TouchableOpacity>
        
        {/* History Tab */}
        <TouchableOpacity 
          className="items-center py-2 flex-1" 
          onPress={() => onNavigate('history')}
          activeOpacity={0.7}
        >
          {isHistoryActive ? (
            <View className="bg-yellow-500/20 rounded-xl p-2 mb-1">
              <Ionicons 
                name="time" 
                size={24} 
                color="#FFD700" 
              />
            </View>
          ) : (
            <Ionicons 
              name="time-outline" 
              size={24} 
              color="#9CA3AF" 
            />
          )}
          <Text className={`text-xs mt-1 ${
            isHistoryActive ? 'text-yellow-400 font-bold' : 'text-gray-400'
          }`}>
            {t('history')}
          </Text>
        </TouchableOpacity>
        
        {/* Settings Tab */}
        <TouchableOpacity 
          className="items-center py-2 flex-1" 
          onPress={() => onNavigate('settings')}
          activeOpacity={0.7}
        >
          {isSettingsActive ? (
            <View className="bg-yellow-500/20 rounded-xl p-2 mb-1">
              <Ionicons 
                name="settings" 
                size={24} 
                color="#FFD700" 
              />
            </View>
          ) : (
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color="#9CA3AF" 
            />
          )}
          <Text className={`text-xs mt-1 ${
            isSettingsActive ? 'text-yellow-400 font-bold' : 'text-gray-400'
          }`}>
            {t('settings')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

BottomNavigation.displayName = 'BottomNavigation';

export default NavigationManager;
