import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ExpenseCategory from '../components/ExpenseCategory';
import ExpenseModal from '../components/ExpenseModal';
import AddBalanceModal from '../components/AddBalanceModal';
import AddCategoryModal from '../components/AddCategoryModal';
import EditCategoryModal from '../components/EditCategoryModal';
import QRScannerModal from '../components/QRScannerModal';
import ReceiptModal from '../components/ReceiptModal';
import { createExpenseCategories } from '../constants/expenseCategories';
import {
  getCurrentMonthKey,
  getMonthName,
  getAdjacentMonthKey,
  getMonthlyData,
  updateMonthlyData,
  calculateBalance,
  calculateTotalBalance,
  loadCustomCategories,
  saveCustomCategories,
  loadData,
  saveData,
  getModifiedCategories,
  saveModifiedCategories,
  getHiddenCategories,
  saveHiddenCategories,
  addTransaction,
  getSelectedCurrency,
  addVisitedMonth,
} from '../utils/dataManager';
import { MonthlyData, ModalState, CustomCategory, Transaction } from '../types';
import { formatCurrency } from '../constants/currencies';
import { updateCurrencyRates, areRatesFresh, convertAmount } from '../utils/currencyService';
import { parseReceiptFromRawData } from '../utils/receiptService';
import { useTranslation } from '../contexts/TranslationContext';
import { getTranslatedMonthName } from '../utils/translationUtils';
import { useAlert } from '../components/AlertProvider';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigateHistory: () => void;
  onNavigateSettings: () => void;
  onDataChange?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onNavigateHistory, 
  onNavigateSettings,
  onDataChange
}) => {
  const { t, translations } = useTranslation();
  const { alert, error } = useAlert();
  // State management
  const [currentMonthKey, setCurrentMonthKey] = useState(getCurrentMonthKey());
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [modalState, setModalState] = useState<ModalState>({
    isVisible: false,
    type: null,
  });
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(true);
  const [isQRScannerVisible, setIsQRScannerVisible] = useState(false);
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [isFetchingReceipt, setIsFetchingReceipt] = useState(false);
  const [receiptAmount, setReceiptAmount] = useState<number | null>(null);
  const [receiptCurrency, setReceiptCurrency] = useState<string>('USD');
  const [receiptMetadata, setReceiptMetadata] = useState<{ vendor?: string; date?: string } | undefined>(undefined);
  const [receiptConvertedAmount, setReceiptConvertedAmount] = useState<number | undefined>(undefined);


  // QR parsing is disabled; keeping modal UI but without parsing logic

  // Function to force refresh exchange rates (for manual refresh or currency change)
  const forceRefreshRates = useCallback(async () => {
    await updateCurrencyRates();
  }, []);

  // Track initial load completion to avoid full refresh on month switch
  const hasInitialLoaded = useRef(false);

  // Initial load only once
  useEffect(() => {
    const init = async () => {
      // Track current month as visited
      await addVisitedMonth(currentMonthKey);
      await loadAllData();
      hasInitialLoaded.current = true;
    };
    init();
  }, []);

  // On month change, load only month-specific data (no global loading state)
  useEffect(() => {
    if (hasInitialLoaded.current) {
      loadMonthData();
    }
  }, [currentMonthKey]);

  // Reload categories when language changes
  useEffect(() => {
    if (hasInitialLoaded.current && monthlyData) {
      const reloadCategories = async () => {
        const categories = await createExpenseCategories(monthlyData.categories, translations);
        setExpenseCategories(categories);
      };
      reloadCategories();
    }
  }, [translations, monthlyData]);

  // Watch for currency changes and refresh rates when currency changes
  useEffect(() => {
    const checkCurrencyChange = async () => {
      const currentCurrency = await getSelectedCurrency();
      if (selectedCurrency && selectedCurrency !== currentCurrency) {
        await forceRefreshRates();
      }
    };

    if (selectedCurrency) {
      checkCurrencyChange();
    }
  }, [selectedCurrency, forceRefreshRates]);

  // Coordinated loading function - loads everything at once
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Load all data in parallel for better performance
      const [currency, monthlyData, totalBalance] = await Promise.all([
        getSelectedCurrency(),
        getMonthlyData(currentMonthKey),
        calculateTotalBalance(),
      ]);

      // Set all state at once to prevent layout shifts
      setSelectedCurrency(currency);
      setMonthlyData(monthlyData);
      setTotalBalance(totalBalance);
      
      // Load categories after other data is set
      const categories = await createExpenseCategories(monthlyData.categories, translations);
      setExpenseCategories(categories);
      
      // Notify NavigationManager that data has changed
      onDataChange?.();
      
      // Only fetch exchange rates if they're not fresh (non-blocking)
      if (!areRatesFresh()) {
        updateCurrencyRates();
      } else {
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMonthData = async () => {
    const data = await getMonthlyData(currentMonthKey);
    setMonthlyData(data);
    // Load categories with amounts
    const categories = await createExpenseCategories(data.categories, translations);
    setExpenseCategories(categories);
  };

  const loadTotalBalance = async () => {
    const total = await calculateTotalBalance();
    setTotalBalance(total);
  };

  // Navigation handlers
  const handlePreviousMonth = useCallback(() => {
    setCurrentMonthKey(getAdjacentMonthKey(currentMonthKey, 'prev'));
  }, [currentMonthKey]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonthKey(getAdjacentMonthKey(currentMonthKey, 'next'));
  }, [currentMonthKey]);

  const handleGoToCurrent = useCallback(() => {
    setCurrentMonthKey(getCurrentMonthKey());
  }, []);

  // Category handlers
  const handleCategoryPress = useCallback((categoryId: string, categoryName: string) => {
    if (categoryId === 'add') {
      setModalState({
        isVisible: true,
        type: 'addCategory',
      });
    } else if (isEditMode) {
      // In edit mode, open edit modal
      const category = expenseCategories.find(cat => cat.id === categoryId);
      if (category) {
        setEditingCategory({
          id: category.id,
          name: category.name,
          icon: category.icon,
          backgroundColor: category.backgroundColor,
          isCustom: categoryId.startsWith('custom_'),
        });
        setModalState({
          isVisible: true,
          type: 'editCategory',
        });
      }
    } else {
      // Normal mode, open expense modal
      setModalState({
        isVisible: true,
        type: 'expense',
        categoryId,
      });
    }
  }, [expenseCategories, isEditMode]);

  const handleCategoryDelete = useCallback(async (categoryId: string) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    const categoryAmount = monthlyData?.categories[categoryId] || 0;

    alert(
      t('deleteCategory'),
      t('deleteCategoryMessage', { 
        categoryName: category.name, 
        amount: formatCurrency(categoryAmount, selectedCurrency) 
      }),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            if (categoryId.startsWith('custom_')) {
              // Handle custom category deletion
              const customCategories = await loadCustomCategories();
              delete customCategories[categoryId];
              await saveCustomCategories(customCategories);
            } else {
              // Handle default category deletion - add to hidden categories
              const hiddenCategories = await getHiddenCategories();
              if (!hiddenCategories.includes(categoryId)) {
                hiddenCategories.push(categoryId);
                await saveHiddenCategories(hiddenCategories);
              }
            }
            
            // Remove expenses from all months
            const data = await loadData();
            Object.keys(data).forEach(monthKey => {
              if (data[monthKey].categories[categoryId]) {
                delete data[monthKey].categories[categoryId];
                // Recalculate expenses for this month
                data[monthKey].expenses = Object.values(data[monthKey].categories).reduce((sum, amount) => sum + amount, 0);
              }
            });
            await saveData(data);
            
            await loadAllData();
          },
        },
      ],
      'warning'
    );
  }, [expenseCategories, monthlyData, selectedCurrency, t]);

  const handleExpenseConfirm = useCallback(async (amount: number) => {
    if (!modalState.categoryId || !monthlyData) return;

    const category = expenseCategories.find(cat => cat.id === modalState.categoryId);
    const categoryName = category?.name || 'Unknown';

    const updatedCategories = {
      ...monthlyData.categories,
      [modalState.categoryId]: (monthlyData.categories[modalState.categoryId] || 0) + amount,
    };

    await updateMonthlyData(currentMonthKey, { categories: updatedCategories });
    
    // Add transaction to history
    const transaction: Transaction = {
      id: `expense_${Date.now()}_${Math.random()}`,
      type: 'expense',
      amount,
      categoryId: modalState.categoryId,
      categoryName,
      monthKey: currentMonthKey,
      date: new Date().toISOString(),
      description: t('expenseAdded', { categoryName }),
    };
    await addTransaction(transaction);
    
    await loadAllData();
  }, [modalState.categoryId, monthlyData, expenseCategories, currentMonthKey, t]);

  const handleAddToBalance = useCallback(() => {
    setModalState({
      isVisible: true,
      type: 'balance',
    });
  }, []);

  const handleBalanceConfirm = useCallback(async (amount: number) => {
    if (!monthlyData) return;

    await updateMonthlyData(currentMonthKey, {
      income: monthlyData.income + amount,
    });
    
    // Add transaction to history
    const transaction: Transaction = {
      id: `income_${Date.now()}_${Math.random()}`,
      type: 'income',
      amount,
      categoryId: 'income',
      categoryName: t('historyIncomeLabel'),
      monthKey: currentMonthKey,
      date: new Date().toISOString(),
      description: t('moneyAddedToBalance'),
    };
    await addTransaction(transaction);
    
    await loadAllData();
  }, [monthlyData, currentMonthKey, t]);

  const handleModalClose = useCallback(() => {
    setModalState({ isVisible: false, type: null });
    setEditingCategory(null);
  }, []);

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  const handleAddCategoryConfirm = useCallback(async (newCategory: CustomCategory) => {
    const customCategories = await loadCustomCategories();
    customCategories[newCategory.id] = newCategory;
    await saveCustomCategories(customCategories);
    await loadAllData();
  }, []);

  const handleEditCategoryConfirm = useCallback(async (categoryId: string, updates: Partial<CustomCategory>) => {
    if (!editingCategory) return;

    if (editingCategory.isCustom) {
      // Handle custom category editing
      const customCategories = await loadCustomCategories();
      if (customCategories[categoryId]) {
        customCategories[categoryId] = { ...customCategories[categoryId], ...updates };
        await saveCustomCategories(customCategories);
      }
    } else {
      // Handle default category editing - save as modified category
      const modifiedCategories = await getModifiedCategories();
      modifiedCategories[categoryId] = {
        name: updates.name || editingCategory.name,
        icon: updates.icon || editingCategory.icon,
        backgroundColor: updates.backgroundColor || editingCategory.backgroundColor,
      };
      await saveModifiedCategories(modifiedCategories);
    }
    
    await loadAllData();
  }, [editingCategory]);

  // QR Scanner handlers
  const handleOpenQRScanner = useCallback(() => {
    if (isFetchingReceipt) {
      return;
    }
    setIsQRScannerVisible(true);
  }, [isFetchingReceipt]);


  const handleQRScanned = useCallback(async (qrData: string) => {
    if (!qrData || qrData.trim().length === 0) {
      error(t('emptyQRCode'), t('emptyQRMessage'));
      return;
    }

    setIsQRScannerVisible(false);
    setIsFetchingReceipt(true);

    try {
      const result = await parseReceiptFromRawData(qrData);

      setReceiptAmount(result.total);
      setReceiptCurrency(result.currency);
      setReceiptMetadata({ vendor: result.vendor, date: result.date });

      const currentCurrency = await getSelectedCurrency();
      setSelectedCurrency(currentCurrency);

      if (result.currency && currentCurrency && result.currency !== currentCurrency) {
        const converted = await convertAmount(result.total, result.currency, currentCurrency);
        setReceiptConvertedAmount(converted);
      } else {
        setReceiptConvertedAmount(undefined);
      }

      setIsReceiptModalVisible(true);
    } catch (error: any) {
      console.error('Failed to parse receipt:', error);
      error(t('error'), error?.message || 'Unable to parse receipt.');
    } finally {
      setIsFetchingReceipt(false);
    }
  }, [t]);

  // URL/WebView extraction disabled with parsing removal

  const handleCloseQRScanner = useCallback(() => {
    setIsQRScannerVisible(false);
  }, []);

  const handleReceiptModalClose = useCallback(() => {
    setIsReceiptModalVisible(false);
    setReceiptAmount(null);
    setReceiptMetadata(undefined);
    setReceiptConvertedAmount(undefined);
    setReceiptCurrency(selectedCurrency);
  }, [selectedCurrency]);

  const handleReceiptCategorySelect = useCallback(async (categoryId: string) => {
    const amountToApply = typeof receiptConvertedAmount === 'number' ? receiptConvertedAmount : receiptAmount;
    if (!amountToApply || amountToApply <= 0 || !monthlyData) {
      error(t('amountNotFound'), t('amountNotFoundMessage'));
      handleReceiptModalClose();
      return;
    }

    const category = expenseCategories.find(cat => cat.id === categoryId);
    const categoryName = category?.name || 'Receipt';

    const updatedCategories = {
      ...monthlyData.categories,
      [categoryId]: (monthlyData.categories[categoryId] || 0) + amountToApply,
    };

    await updateMonthlyData(currentMonthKey, { categories: updatedCategories });

    const transaction: Transaction = {
      id: `receipt_${Date.now()}_${Math.random()}`,
      type: 'expense',
      amount: amountToApply,
      categoryId,
      categoryName,
      monthKey: currentMonthKey,
      date: new Date().toISOString(),
      description: t('receiptExpense', { categoryName }),
    };
    await addTransaction(transaction);

    handleReceiptModalClose();
    await loadAllData();
  }, [receiptConvertedAmount, receiptAmount, monthlyData, expenseCategories, currentMonthKey, t, handleReceiptModalClose]);

  const handleReceiptAddNewCategory = useCallback(() => {
    // Close receipt modal and open add category modal
    setIsReceiptModalVisible(false);
    setModalState({
      isVisible: true,
      type: 'addCategory',
    });
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <View className="flex-1 bg-black">
      {/* Gold Gradient Background */}
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        locations={[0, 0.5, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* Gold Vertical Lines Pattern */}
      <View className="absolute inset-0 opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            className="absolute bg-gradient-to-b from-transparent via-yellow-400 to-transparent"
            style={{
              left: (width / 8) * i,
              width: 2,
              height: height,
              opacity: 0.3 - (Math.abs(i - 4) * 0.05),
            }}
          />
        ))}
      </View>

      <ScrollView className="flex-1 relative z-10" showsVerticalScrollIndicator={false}>
        {/* Balance Skeleton */}
        <View className="mx-6 mt-8">
          <View className="h-6 bg-gray-700 rounded mb-3 mx-auto w-32" />
          <View className="bg-gray-800 rounded-2xl p-6 items-center">
            <View className="h-4 bg-gray-600 rounded w-24 mb-2" />
            <View className="h-8 bg-gray-600 rounded w-40 mb-2" />
            <View className="h-4 bg-gray-600 rounded w-32" />
          </View>
          
          {/* Month Navigation Skeleton */}
          <View className="flex-row items-center justify-center mt-6">
            <View className="w-12 h-12 bg-gray-700 rounded-full mr-4" />
            <View className="h-6 bg-gray-700 rounded w-24" />
            <View className="w-12 h-12 bg-gray-700 rounded-full ml-4" />
          </View>
        </View>

        {/* Monthly Overview Skeleton */}
        <View className="mx-6 mt-6">
          <View className="h-6 bg-gray-700 rounded mb-3 mx-auto w-24" />
          <View className="flex-row justify-center">
            <View className="bg-gray-800 rounded-xl p-4 mr-2 w-32 h-20" />
            <View className="bg-gray-800 rounded-xl p-4 ml-2 w-32 h-20" />
          </View>
        </View>

        {/* Categories Skeleton */}
        <View className="mx-6 mt-6">
          <View className="h-6 bg-gray-700 rounded mb-3 mx-auto w-40" />
          <View className="flex-row flex-wrap justify-center">
            {[...Array(8)].map((_, index) => (
              <View key={index} className="bg-gray-800 rounded-xl p-4 m-1 w-20 h-20" />
            ))}
          </View>
        </View>

        {/* Add Button Skeleton */}
        <View className="mx-6 mt-6">
          <View className="bg-gray-800 rounded-2xl p-4 h-16" />
        </View>
      </ScrollView>
    </View>
  );

  // Show loading skeleton while data is loading
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <View className="flex-1 bg-black">
      {/* Gold Gradient Background */}
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        locations={[0, 0.5, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* Gold Vertical Lines Pattern */}
      <View className="absolute inset-0 opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            className="absolute bg-gradient-to-b from-transparent via-yellow-400 to-transparent"
            style={{
              left: (width / 8) * i,
              width: 2,
              height: height,
              opacity: 0.3 - (Math.abs(i - 4) * 0.05),
            }}
          />
        ))}
      </View>

      <ScrollView className="flex-1 relative z-10" showsVerticalScrollIndicator={false}>
        {/* Overall Balance Section */}
        <View className="mx-6 mt-8">
          <Text className="text-lg font-semibold text-white mb-4 text-center">{t('overallBalance')}</Text>
          <View className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-700 shadow-lg">
            <Text className="text-gray-300 text-sm opacity-90 text-center mb-2">{t('totalBalance')}</Text>
            <Text className="text-white text-4xl font-black mt-1 text-center mb-2">
              {formatCurrency(totalBalance, selectedCurrency)}
            </Text>
            <View className="bg-yellow-500/20 rounded-2xl p-3 mt-3">
              <Text className="text-yellow-300 text-sm text-center font-medium">
                {monthlyData ? `${t('balanceThisMonth')}: ${formatCurrency(calculateBalance(monthlyData), selectedCurrency)}` : t('loading')}
              </Text>
            </View>
          </View>
          
          {/* Month Navigation */}
          <View className="flex-row items-center justify-center mt-6">
            <TouchableOpacity 
              className="bg-gray-800/60 border border-gray-600 w-12 h-12 rounded-full backdrop-blur-sm mr-4 items-center justify-center"
              onPress={handlePreviousMonth}
            >
              <Ionicons name="chevron-back" size={24} color="#FFD700" />
            </TouchableOpacity>
            <View className="items-center">
              <Text className="text-lg font-bold text-white">{getTranslatedMonthName(currentMonthKey, translations)}</Text>
              {currentMonthKey !== getCurrentMonthKey() && (
                <TouchableOpacity 
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-full"
                  onPress={handleGoToCurrent}
                >
                  <Text className="text-yellow-400 text-xs font-medium">{t('goToCurrent')}</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              className="bg-gray-800/60 border border-gray-600 w-12 h-12 rounded-full backdrop-blur-sm ml-4 items-center justify-center"
              onPress={handleNextMonth}
            >
              <Ionicons name="chevron-forward" size={24} color="#FFD700" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Monthly Overview */}
        <View className="mx-6 mt-6">
          <Text className="text-lg font-bold text-white mb-4 text-center">{t('thisMonth')}</Text>
          <View className="flex-row justify-center gap-4">
            <View className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700 shadow-lg flex-1 max-w-[160px]">
              <View className="items-center">
                <View className="w-8 h-8 bg-green-500/20 rounded-full items-center justify-center mb-2">
                  <Ionicons name="trending-up" size={16} color="#10B981" />
                </View>
                <Text className="text-gray-300 text-sm text-center font-medium">{t('income')}</Text>
                <Text className="text-green-400 text-xl font-bold mt-1 text-center">
                  {formatCurrency(monthlyData?.income || 0, selectedCurrency)}
                </Text>
              </View>
            </View>
            <View className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700 shadow-lg flex-1 max-w-[160px]">
              <View className="items-center">
                <View className="w-8 h-8 bg-red-500/20 rounded-full items-center justify-center mb-2">
                  <Ionicons name="trending-down" size={16} color="#EF4444" />
                </View>
                <Text className="text-gray-300 text-sm text-center font-medium">{t('expenses')}</Text>
                <Text className="text-red-400 text-xl font-bold mt-1 text-center">
                  {formatCurrency(monthlyData?.expenses || 0, selectedCurrency)}
                </Text>
              </View>
            </View>
          </View>
        </View>

         {/* QR Scanner Button */}
         <View className="mx-6 mt-6">
           <TouchableOpacity 
             className="rounded-2xl overflow-hidden shadow-lg"
             onPress={handleOpenQRScanner}
             activeOpacity={0.8}
           >
             <LinearGradient colors={['#EAB308', '#F59E0B']} className="p-4 flex-row items-center justify-center">
               <Ionicons name="qr-code-outline" size={24} color="black" />
               <Text className="text-black text-lg font-bold ml-2">{t('scanReceiptQR')}</Text>
             </LinearGradient>
           </TouchableOpacity>
         </View>

        {/* Expense Categories */}
        <View className="mx-6 mt-6">
          <View className="flex-row items-center justify-center mb-4">
            <Text className="text-lg font-bold text-white">{t('spendingCategories')}</Text>
            <TouchableOpacity 
              className="ml-3 p-2 bg-gray-800/60 border border-gray-600 rounded-xl"
              onPress={handleToggleEditMode}
            >
              <Ionicons 
                name="pencil" 
                size={18} 
                color={isEditMode ? "#FFD700" : "#9CA3AF"} 
              />
            </TouchableOpacity>
          </View>
          
          {isEditMode && (
            <View className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-3 mb-4">
              <Text className="text-yellow-300 text-sm text-center font-medium">
                {t('tapCategoryToEdit')}
              </Text>
            </View>
          )}
          
          <View className="flex-row flex-wrap justify-center">
            {expenseCategories.map((category) => (
              <ExpenseCategory
                key={category.id}
                category={category}
                onPress={() => handleCategoryPress(category.id, category.name)}
                isEditMode={isEditMode}
                currency={selectedCurrency}
              />
            ))}
          </View>
        </View>

        {/* Add to Balance Button */}
        <View className="mx-6 mt-6">
          <TouchableOpacity 
            className="rounded-2xl overflow-hidden shadow-lg" 
            onPress={handleAddToBalance}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#EAB308', '#F59E0B']} className="p-4">
              <View className="flex-row items-center justify-center">
                <Ionicons name="add-circle" size={24} color="black" />
                <Text className="text-black text-lg font-bold ml-2">{t('addToBalance')}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bottom padding for scroll */}
        <View className="h-6" />
      </ScrollView>

      {/* Modals */}
      <ExpenseModal
        isVisible={modalState.isVisible && modalState.type === 'expense'}
        onClose={handleModalClose}
        onConfirm={handleExpenseConfirm}
        categoryName={modalState.categoryId ? 
          expenseCategories.find(cat => cat.id === modalState.categoryId)?.name || '' : ''}
      />

      <AddBalanceModal
        isVisible={modalState.isVisible && modalState.type === 'balance'}
        onClose={handleModalClose}
        onConfirm={handleBalanceConfirm}
      />

      <AddCategoryModal
        isVisible={modalState.isVisible && modalState.type === 'addCategory'}
        onClose={handleModalClose}
        onConfirm={handleAddCategoryConfirm}
      />

      <EditCategoryModal
        isVisible={modalState.isVisible && modalState.type === 'editCategory'}
        onClose={handleModalClose}
        onConfirm={handleEditCategoryConfirm}
        onDelete={handleCategoryDelete}
        category={editingCategory}
      />

      <QRScannerModal
        isVisible={isQRScannerVisible}
        onClose={handleCloseQRScanner}
        onQRScanned={handleQRScanned}
      />

      <ReceiptModal
        isVisible={isReceiptModalVisible}
        onClose={handleReceiptModalClose}
        onConfirm={handleReceiptCategorySelect}
        onAddNewCategory={handleReceiptAddNewCategory}
        receiptAmount={receiptAmount ?? 0}
        receiptCurrency={receiptCurrency}
        receiptMetadata={receiptMetadata}
        convertedAmount={receiptConvertedAmount}
        categories={expenseCategories}
        currency={selectedCurrency}
      />

      {/* Loading Overlay for QR Processing */}
      <Modal
        visible={isFetchingReceipt}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/80 justify-center items-center">
          <View className="bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8 items-center shadow-2xl border border-gray-700">
            <ActivityIndicator size="large" color="#FFD700" />
            <Text className="text-white text-lg font-bold mt-4">
              {t('processingReceipt')}
            </Text>
            <Text className="text-gray-300 text-sm mt-2 text-center">
              {t('pleaseWait')}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
