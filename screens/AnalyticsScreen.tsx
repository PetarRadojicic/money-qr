import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import {
  loadData,
  loadTransactionHistory,
  getSelectedCurrency,
} from '../utils/dataManager';
import { AppData, HistoryData } from '../types';
import { calculateAnalytics, AnalyticsData } from '../utils/analyticsCalculator';
import { useTranslation } from '../contexts/TranslationContext';

// Import components
import {
  AnalyticsHeader,
  SummaryCards,
  KeyInsights,
  MonthPickerModal,
  LoadingSkeleton,
} from '../components/analytics';

interface GlobalData {
  appData: any;
  transactionHistory: any;
  selectedCurrency: string;
  isDataReady: boolean;
}

interface AnalyticsScreenProps {
  onNavigateHome: () => void;
  onNavigateHistory: () => void;
  onNavigateSettings: () => void;
  globalData?: GlobalData;
  skipInitialLoading?: boolean;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  onNavigateHome,
  onNavigateHistory,
  onNavigateSettings,
  globalData,
  skipInitialLoading = false,
}) => {
  const { t, translations } = useTranslation();
  
  // State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(!skipInitialLoading);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'specific' | 'all'>('all');
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Load currency on mount
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const currency = await getSelectedCurrency();
        setSelectedCurrency(currency);
      } catch (error) {
        console.error('Error loading initial currency:', error);
      }
    };
    loadCurrency();
  }, []);

  // Load analytics data from cache (fast path)
  const loadAnalyticsDataFromCache = useCallback(async () => {
    try {
      if (globalData?.isDataReady && globalData.appData && globalData.transactionHistory) {
        const currentCurrency = await getSelectedCurrency();
        setSelectedCurrency(currentCurrency);
        
        const months = Object.keys(globalData.appData).sort();
        setAvailableMonths(months);

        if (selectedMonths.length === 0 && months.length > 0) {
          setSelectedMonths(months);
        }

        const analytics = await calculateAnalytics(
          globalData.appData, 
          globalData.transactionHistory, 
          timeRange, 
          selectedMonths,
          translations
        );
        setAnalyticsData(analytics);
        return;
      }
      
      await loadAnalyticsData(false);
    } catch (error) {
      console.error('Error loading analytics data from cache:', error);
    }
  }, [globalData, timeRange, selectedMonths, translations]);

  // Load analytics data (fallback)
  const loadAnalyticsData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const [appData, historyData, currency] = await Promise.all([
        loadData(),
        loadTransactionHistory(),
        getSelectedCurrency(),
      ]);

      setSelectedCurrency(currency);

      const months = Object.keys(appData).sort();
      setAvailableMonths(months);

      if (selectedMonths.length === 0 && months.length > 0) {
        setSelectedMonths(months);
      }

      const analytics = await calculateAnalytics(appData, historyData, timeRange, selectedMonths, translations);
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [timeRange, selectedMonths, translations]);

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    loadAnalyticsData(true);
  }, [loadAnalyticsData]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    if (skipInitialLoading && globalData?.isDataReady) {
      loadAnalyticsDataFromCache();
    } else {
      loadAnalyticsData();
    }
  }, [timeRange, selectedMonths, skipInitialLoading, globalData?.isDataReady]);

  // Refresh when currency changes
  useEffect(() => {
    if (!globalData?.isDataReady) return;
    
    const refreshOnCurrency = async () => {
      try {
        const currentCurrency = await getSelectedCurrency();
        setSelectedCurrency(currentCurrency);
        
        if (globalData?.appData && globalData?.transactionHistory) {
          const analytics = await calculateAnalytics(
            globalData.appData,
            globalData.transactionHistory,
            timeRange,
            selectedMonths,
            translations
          );
          setAnalyticsData(analytics);
        } else {
          await loadAnalyticsData();
        }
      } catch (e) {
        await loadAnalyticsData();
      }
    };
    refreshOnCurrency();
  }, [globalData?.selectedCurrency, timeRange, selectedMonths, translations]);

  // Event handlers
  const handleTimeRangeChange = useCallback((range: 'all') => {
    setTimeRange(range);
    setSelectedMonths(availableMonths);
  }, [availableMonths]);

  const handleMonthPickerApply = useCallback((months: string[]) => {
    setSelectedMonths(months);
    setTimeRange('specific');
    setShowMonthPicker(false);
  }, []);

  // Render loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Render no data state
  if (!analyticsData) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-gray-300 text-lg">{t('noDataAvailable')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      {/* Header */}
        <AnalyticsHeader
          timeRange={timeRange}
          selectedMonthsCount={selectedMonths.length}
          onTimeRangeChange={handleTimeRangeChange}
          onShowMonthPicker={() => setShowMonthPicker(true)}
        />

      {/* Summary Cards */}
        <SummaryCards
          analyticsData={analyticsData}
          selectedCurrency={selectedCurrency}
        />

        {/* Key Insights */}
        <KeyInsights
          analyticsData={analyticsData}
          selectedCurrency={selectedCurrency}
        />

      {/* Bottom padding */}
      <View className="h-6" />
    </ScrollView>

    {/* Month Picker Modal */}
    <MonthPickerModal
      visible={showMonthPicker}
      availableMonths={availableMonths}
      selectedMonths={selectedMonths}
      onClose={() => setShowMonthPicker(false)}
        onApply={handleMonthPickerApply}
    />
    </View>
  );
};

export default AnalyticsScreen;