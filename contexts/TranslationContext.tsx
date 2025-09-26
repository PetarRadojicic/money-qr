import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Translation keys interface
export interface Translations {
  // Common
  cancel: string;
  delete: string;
  ok: string;
  confirm: string;
  loading: string;
  error: string;
  
  // HomeScreen
  overallBalance: string;
  totalBalance: string;
  balanceThisMonth: string;
  thisMonth: string;
  income: string;
  expenses: string;
  scanReceiptQR: string;
  spendingCategories: string;
  addToBalance: string;
  // Label for income entry shown in History list (better phrasing than addToBalance)
  historyIncomeLabel: string;
  goToCurrent: string;
  tapCategoryToEdit: string;
  
  // Months
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
  
  // Categories
  food: string;
  cafe: string;
  entertainment: string;
  transport: string;
  health: string;
  pets: string;
  family: string;
  clothes: string;
  add: string;
  
  // Settings
  settings: string;
  language: string;
  currency: string;
  resetApp: string;
  clearAllData: string;
  
  // Alerts
  deleteCategory: string;
  deleteCategoryMessage: string;
  resetAppMessage: string;
  resetAppCompleteMessage: string;
  
  // QR Scanner
  emptyQRCode: string;
  emptyQRMessage: string;
  qrNotSupported: string;
  qrNotSupportedMessage: string;
  amountNotFound: string;
  amountNotFoundMessage: string;
  qrCodeParsedSuccessfully: string;
  showRawData: string;
  rawQRData: string;
  merchant: string;
  format: string;
  
  // Transaction descriptions
  expenseAdded: string;
  moneyAddedToBalance: string;
  receiptExpense: string;
  
  // Analytics
  analytics: string;
  allTime: string;
  selectMonths: string;
  totalIncome: string;
  totalExpenses: string;
  netSavings: string;
  monthsTracked: string;
  categories: string;
  avg: string;
  rate: string;
  monthlyIncomeVsExpenses: string;
  topSpendingCategories: string;
  keyInsights: string;
  quickTips: string;
  topSpendingCategory: string;
  mostActiveMonth: string;
  savingsPerformance: string;
  ofTotal: string;
  transactions: string;
  selectAll: string;
  clearAll: string;
  apply: string;
  noDataAvailable: string;
  excellent: string;
  goodWork: string;
  considerReducing: string;
  trackExpensesDaily: string;
  aimToSave: string;
  reviewSpending: string;
  useHistoryTab: string;
  wasYourMostExpensive: string;
  inExpenses: string;
  youSpent: string;
  on: string;
  yourSavingsRateIs: string;
  selected: string;
  of: string;
  
  // History Screen
  transactionHistory: string;
  noTransactionsYet: string;
  transactionHistoryDescription: string;
  transactionsFound: string;
  transaction: string;
  reverted: string;
  alreadyReverted: string;
  alreadyRevertedMessage: string;
  revertTransaction: string;
  removeThisIncome: string;
  removeThisExpense: string;
  areYouSureRevert: string;
  revert: string;
  success: string;
  transactionReverted: string;
  failedToRevert: string;
  
  // Modals
  addExpense: string;
  enterAmount: string;
  amount: string;
  addCategory: string;
  editCategory: string;
  categoryName: string;
  selectIcon: string;
  selectColor: string;
  save: string;
  addMoney: string;
  selectCategoryForReceipt: string;
  scannedAmount: string;
  receiptDetails: string;
  addNewCategory: string;
  invalidAmount: string;
  invalidAmountMessage: string;
  selectCategory: string;
  selectCategoryMessage: string;
  amountCannotBeChanged: string;
  invalidName: string;
  invalidNameMessage: string;
  pleaseEnterCategoryName: string;
  colors: string;
  icons: string;
  
  // QR Scanner
  cameraPermissionRequired: string;
  cameraAccessNeeded: string;
  allowCamera: string;
  scanReceiptQRCode: string;
  positionQRCode: string;
  pointCameraAtQR: string;
  
  // Navigation
  home: string;
  history: string;
  
  // Additional Components
  newCategory: string;
  selectCurrency: string;
  popularCurrencies: string;
  allCurrencies: string;
  currencyChanged: string;
  currencyConvertedMessage: string;
  convertingCurrency: string;
  choosePreferredCurrency: string;
  exchangeRates: string;
  lastUpdated: string;
  updating: string;
  failed: string;
  refresh: string;
  ratesUpdatedSuccessfully: string;
  failedToUpdateRates: string;
  editingCategory: string;
  all: string;
}

// English translations
const englishTranslations: Translations = {
  // Common
  cancel: 'Cancel',
  delete: 'Delete',
  ok: 'OK',
  confirm: 'Confirm',
  loading: 'Loading...',
  error: 'Error',
  
  // HomeScreen
  overallBalance: 'Overall Balance',
  totalBalance: 'Total Balance',
  balanceThisMonth: 'Balance this month',
  thisMonth: 'This Month',
  income: 'Income',
  expenses: 'Expenses',
  scanReceiptQR: 'Scan Receipt QR Code',
  spendingCategories: 'Spending Categories',
  addToBalance: 'Add to Balance',
  historyIncomeLabel: 'Income',
  goToCurrent: 'Go to Current',
  tapCategoryToEdit: 'Tap any category to edit or delete',
  
  // Months
  january: 'January',
  february: 'February',
  march: 'March',
  april: 'April',
  may: 'May',
  june: 'June',
  july: 'July',
  august: 'August',
  september: 'September',
  october: 'October',
  november: 'November',
  december: 'December',
  
  // Categories
  food: 'Food',
  cafe: 'Cafe',
  entertainment: 'Entertainment',
  transport: 'Transport',
  health: 'Health',
  pets: 'Pets',
  family: 'Family',
  clothes: 'Clothes',
  add: 'Add',
  
  // Settings
  settings: 'Settings',
  language: 'Language',
  currency: 'Currency',
  resetApp: 'Reset App',
  clearAllData: 'Clear all data and restore default settings',
  
  // Alerts
  deleteCategory: 'Delete Category',
  deleteCategoryMessage: 'Are you sure you want to delete "{categoryName}"?\n\nThis category has {amount} in expenses. This action cannot be undone and the expenses will be removed from your balance calculation.',
  resetAppMessage: 'Are you sure you want to reset the app?\n\nThis will delete:\n• All expenses and income\n• All transaction history\n• All custom categories\n• All modified categories\n\nThis action cannot be undone!',
  resetAppCompleteMessage: 'All data has been cleared successfully. The app has been restored to its default state.',
  
  // QR Scanner
  emptyQRCode: 'Empty QR Code',
  emptyQRMessage: 'The QR code appears to be empty. Please try scanning again.',
  qrNotSupported: 'QR Not Supported',
  qrNotSupportedMessage: 'This QR format is not supported. Only payment QR codes and receipt URLs are supported.',
  amountNotFound: 'Amount Not Found',
  amountNotFoundMessage: 'Could not read total from the page.',
  qrCodeParsedSuccessfully: 'QR Code parsed successfully!',
  showRawData: 'Show Raw Data',
  rawQRData: 'Raw QR Data',
  merchant: 'Merchant',
  format: 'Format',
  
  // Transaction descriptions
  expenseAdded: 'Expense added to {categoryName}',
  moneyAddedToBalance: 'Money added to balance',
  receiptExpense: 'Receipt expense - {categoryName}',
  
  // Analytics
  analytics: 'Analytics',
  allTime: 'All Time',
  selectMonths: 'Select Months',
  totalIncome: 'Total Income',
  totalExpenses: 'Total Expenses',
  netSavings: 'Net Savings',
  monthsTracked: 'Months Tracked',
  categories: 'Categories',
  avg: 'Avg',
  rate: 'Rate',
  monthlyIncomeVsExpenses: 'Monthly Income vs Expenses',
  topSpendingCategories: 'Top Spending Categories',
  keyInsights: 'Key Insights',
  quickTips: '💡 Quick Tips',
  topSpendingCategory: 'Top Spending Category',
  mostActiveMonth: 'Most Active Month',
  savingsPerformance: 'Savings Performance',
  ofTotal: 'of total',
  transactions: 'transactions',
  selectAll: 'Select All',
  clearAll: 'Clear All',
  apply: 'Apply',
  noDataAvailable: 'No data available for analytics',
  excellent: ' - Excellent!',
  goodWork: ' - Good work!',
  considerReducing: ' - Consider reducing expenses',
  trackExpensesDaily: 'Track expenses daily for better insights and patterns',
  aimToSave: 'Aim to save at least 20% of your income each month',
  reviewSpending: 'Review your spending patterns monthly to identify areas for improvement',
  useHistoryTab: 'Use the history tab to analyze your transaction patterns',
  wasYourMostExpensive: 'was your most expensive month with',
  inExpenses: 'in expenses',
  youSpent: 'You spent',
  on: 'on',
  yourSavingsRateIs: 'Your savings rate is',
  selected: 'selected',
  of: 'of',
  
  // History Screen
  transactionHistory: 'Transaction History',
  noTransactionsYet: 'No Transactions Yet',
  transactionHistoryDescription: 'Your transaction history will appear here once you start adding expenses or income.',
  transactionsFound: 'transactions found',
  transaction: 'transaction',
  reverted: 'Reverted',
  alreadyReverted: 'Already Reverted',
  alreadyRevertedMessage: 'This transaction has already been reverted.',
  revertTransaction: 'Revert Transaction',
  removeThisIncome: 'remove this income',
  removeThisExpense: 'remove this expense',
  areYouSureRevert: 'Are you sure you want to',
  revert: 'Revert',
  success: 'Success',
  transactionReverted: 'Transaction has been reverted.',
  failedToRevert: 'Failed to revert transaction.',
  
  // Modals
  addExpense: 'Add Expense',
  enterAmount: 'Enter amount',
  amount: 'Amount',
  addCategory: 'Add Category',
  editCategory: 'Edit Category',
  categoryName: 'Category Name',
  selectIcon: 'Select Icon',
  selectColor: 'Select Color',
  save: 'Save',
  addMoney: 'Add Money',
  selectCategoryForReceipt: 'Select Category for Receipt',
  scannedAmount: 'Scanned Amount',
  receiptDetails: 'Receipt Details',
  addNewCategory: 'Add New Category',
  invalidAmount: 'Invalid Amount',
  invalidAmountMessage: 'Please enter a valid amount greater than 0.',
  selectCategory: 'Select Category',
  selectCategoryMessage: 'Please select a spending category for this receipt.',
  amountCannotBeChanged: 'This amount cannot be changed',
  invalidName: 'Invalid Name',
  invalidNameMessage: 'Please enter a category name.',
  pleaseEnterCategoryName: 'Please enter a category name',
  colors: 'Colors',
  icons: 'Icons',
  
  // QR Scanner
  cameraPermissionRequired: 'Camera Permission Required',
  cameraAccessNeeded: 'We need camera access to scan QR codes on receipts',
  allowCamera: 'Allow Camera',
  scanReceiptQRCode: 'Scan Receipt QR Code',
  positionQRCode: 'Position the QR code within the frame',
  pointCameraAtQR: 'Point your camera at the QR code on your receipt',
  
  // Navigation
  home: 'Home',
  history: 'History',
  
  // Additional Components
  newCategory: 'New Category',
  selectCurrency: 'Select Currency',
  popularCurrencies: 'Popular',
  allCurrencies: 'All Currencies',
  currencyChanged: 'Currency Changed',
  currencyConvertedMessage: 'All your data has been converted to {currencyName} ({currencySymbol}).\n\nExample: {example}',
  convertingCurrency: 'Converting all data to new currency...',
  choosePreferredCurrency: 'Choose your preferred currency. All existing data will be automatically converted.',
  exchangeRates: 'Exchange Rates',
  lastUpdated: 'Last updated',
  updating: 'Updating...',
  failed: 'Failed',
  refresh: 'Refresh',
  ratesUpdatedSuccessfully: 'Exchange rates updated successfully',
  failedToUpdateRates: 'Failed to update exchange rates',
  editingCategory: 'Editing Category',
  all: 'All',
};

// Serbian translations
const serbianTranslations: Translations = {
  // Common
  cancel: 'Otkaži',
  delete: 'Obriši',
  ok: 'U redu',
  confirm: 'Potvrdi',
  loading: 'Učitava...',
  error: 'Greška',
  
  // HomeScreen
  overallBalance: 'Ukupno stanje',
  totalBalance: 'Ukupno stanje',
  balanceThisMonth: 'Stanje ovog meseca',
  thisMonth: 'Ovaj mesec',
  income: 'Prihodi',
  expenses: 'Troškovi',
  scanReceiptQR: 'Skeniraj QR kod računa',
  spendingCategories: 'Kategorije troškova',
  addToBalance: 'Dodaj u stanje',
  historyIncomeLabel: 'Prihod',
  goToCurrent: 'Idi na trenutni',
  tapCategoryToEdit: 'Dodirnite bilo koju kategoriju da je uredite ili obrišete',
  
  // Months
  january: 'Januar',
  february: 'Februar',
  march: 'Mart',
  april: 'April',
  may: 'Maj',
  june: 'Jun',
  july: 'Jul',
  august: 'Avgust',
  september: 'Septembar',
  october: 'Oktobar',
  november: 'Novembar',
  december: 'Decembar',
  
  // Categories
  food: 'Hrana',
  cafe: 'Kafić',
  entertainment: 'Zabava',
  transport: 'Prevoz',
  health: 'Zdravlje',
  pets: 'Kućni ljubimci',
  family: 'Porodica',
  clothes: 'Odeća',
  add: 'Dodaj',
  
  // Settings
  settings: 'Podešavanja',
  language: 'Jezik',
  currency: 'Valuta',
  resetApp: 'Resetuj aplikaciju',
  clearAllData: 'Obriši sve podatke i vrati na početna podešavanja',
  
  // Alerts
  deleteCategory: 'Obriši kategoriju',
  deleteCategoryMessage: 'Da li ste sigurni da želite da obrišete "{categoryName}"?\n\nOva kategorija ima {amount} troškova. Ova akcija se ne može poništiti i troškovi će biti uklonjeni iz kalkulacije stanja.',
  resetAppMessage: 'Da li ste sigurni da želite da resetujete aplikaciju?\n\nOvo će obrisati:\n• Sve troškove i prihode\n• Svu istoriju transakcija\n• Sve prilagođene kategorije\n• Sve izmenjene kategorije\n\nOva akcija se ne može poništiti!',
  resetAppCompleteMessage: 'Svi podaci su uspešno obrisani. Aplikacija je vraćena na početno stanje.',
  
  // QR Scanner
  emptyQRCode: 'Prazan QR kod',
  emptyQRMessage: 'QR kod izgleda da je prazan. Molimo pokušajte ponovo da skenirate.',
  qrNotSupported: 'QR nije podržan',
  qrNotSupportedMessage: 'Ovaj format QR koda nije podržan. Podržani su samo QR kodovi za plaćanje i URL-ovi računa.',
  amountNotFound: 'Iznos nije pronađen',
  amountNotFoundMessage: 'Nije moguće pročitati ukupan iznos sa stranice.',
  qrCodeParsedSuccessfully: 'QR kod je uspešno parsiran!',
  showRawData: 'Prikaži sirove podatke',
  rawQRData: 'Sirovi QR podaci',
  merchant: 'Trgovac',
  format: 'Format',
  
  // Transaction descriptions
  expenseAdded: 'Trošak dodat u {categoryName}',
  moneyAddedToBalance: 'Novac dodat u stanje',
  receiptExpense: 'Trošak računa - {categoryName}',
  
  // Analytics
  analytics: 'Analitika',
  allTime: 'Sve vreme',
  selectMonths: 'Izaberi mesece',
  totalIncome: 'Ukupni prihodi',
  totalExpenses: 'Ukupni troškovi',
  netSavings: 'Neto štednja',
  monthsTracked: 'Praćeni meseci',
  categories: 'Kategorije',
  avg: 'Prosek',
  rate: 'Stopa',
  monthlyIncomeVsExpenses: 'Mesečni prihodi vs troškovi',
  topSpendingCategories: 'Top kategorije troškova',
  keyInsights: 'Ključni uvidi',
  quickTips: '💡 Brzi saveti',
  topSpendingCategory: 'Top kategorija troškova',
  mostActiveMonth: 'Najaktivniji mesec',
  savingsPerformance: 'Performanse štednje',
  ofTotal: 'od ukupno',
  transactions: 'transakcije',
  selectAll: 'Izaberi sve',
  clearAll: 'Obriši sve',
  apply: 'Primeni',
  noDataAvailable: 'Nema dostupnih podataka za analitiku',
  excellent: ' - Odlično!',
  goodWork: ' - Dobar rad!',
  considerReducing: ' - Razmislite o smanjenju troškova',
  trackExpensesDaily: 'Pratite troškove dnevno za bolje uvide i obrasce',
  aimToSave: 'Cilj je da štedite najmanje 20% svojih prihoda mesečno',
  reviewSpending: 'Pregledate svoje obrasce troškova mesečno da identifikujete oblasti za poboljšanje',
  useHistoryTab: 'Koristite tab istorije da analizirate svoje obrasce transakcija',
  wasYourMostExpensive: 'je bio vaš najskuplji mesec sa',
  inExpenses: 'troškova',
  youSpent: 'Potrošili ste',
  on: 'na',
  yourSavingsRateIs: 'Vaša stopa štednje je',
  selected: 'izabrano',
  of: 'od',
  
  // History Screen
  transactionHistory: 'Istorija transakcija',
  noTransactionsYet: 'Još nema transakcija',
  transactionHistoryDescription: 'Istorija vaših transakcija će se pojaviti ovde kada počnete da dodajete troškove ili prihode.',
  transactionsFound: 'transakcija pronađeno',
  transaction: 'transakcija',
  reverted: 'Poništeno',
  alreadyReverted: 'Već poništeno',
  alreadyRevertedMessage: 'Ova transakcija je već poništena.',
  revertTransaction: 'Poništi transakciju',
  removeThisIncome: 'ukloniti ovaj prihod',
  removeThisExpense: 'ukloniti ovaj trošak',
  areYouSureRevert: 'Da li ste sigurni da želite da',
  revert: 'Poništi',
  success: 'Uspeh',
  transactionReverted: 'Transakcija je poništena.',
  failedToRevert: 'Neuspešno poništavanje transakcije.',
  
  // Modals
  addExpense: 'Dodaj trošak',
  enterAmount: 'Unesite iznos',
  amount: 'Iznos',
  addCategory: 'Dodaj kategoriju',
  editCategory: 'Uredi kategoriju',
  categoryName: 'Ime kategorije',
  selectIcon: 'Izaberite ikonu',
  selectColor: 'Izaberite boju',
  save: 'Sačuvaj',
  addMoney: 'Dodaj novac',
  selectCategoryForReceipt: 'Izaberite kategoriju za račun',
  scannedAmount: 'Skeniran iznos',
  receiptDetails: 'Detalji računa',
  addNewCategory: 'Dodaj novu kategoriju',
  invalidAmount: 'Neispravan iznos',
  invalidAmountMessage: 'Molimo unesite ispravan iznos veći od 0.',
  selectCategory: 'Izaberite kategoriju',
  selectCategoryMessage: 'Molimo izaberite kategoriju troška za ovaj račun.',
  amountCannotBeChanged: 'Ovaj iznos se ne može promeniti',
  invalidName: 'Neispravno ime',
  invalidNameMessage: 'Molimo unesite ime kategorije.',
  pleaseEnterCategoryName: 'Molimo unesite ime kategorije',
  colors: 'Boje',
  icons: 'Ikone',
  
  // QR Scanner
  cameraPermissionRequired: 'Potrebna dozvola za kameru',
  cameraAccessNeeded: 'Potreban nam je pristup kameri da skeniramo QR kodove na računima',
  allowCamera: 'Dozvoli kameru',
  scanReceiptQRCode: 'Skeniraj QR kod računa',
  positionQRCode: 'Postavite QR kod unutar okvira',
  pointCameraAtQR: 'Usmerite kameru na QR kod na vašem računu',
  
  // Navigation
  home: 'Početna',
  history: 'Istorija',
  
  // Additional Components
  newCategory: 'Nova kategorija',
  selectCurrency: 'Izaberite valutu',
  popularCurrencies: 'Popularne',
  allCurrencies: 'Sve valute',
  currencyChanged: 'Valuta promenjena',
  currencyConvertedMessage: 'Svi vaši podaci su konvertovani u {currencyName} ({currencySymbol}).\n\nPrimer: {example}',
  convertingCurrency: 'Konvertovanje svih podataka u novu valutu...',
  choosePreferredCurrency: 'Izaberite željenu valutu. Svi postojeći podaci će biti automatski konvertovani.',
  exchangeRates: 'Kursne liste',
  lastUpdated: 'Poslednje ažuriranje',
  updating: 'Ažuriranje...',
  failed: 'Neuspešno',
  refresh: 'Osveži',
  ratesUpdatedSuccessfully: 'Kursne liste uspešno ažurirane',
  failedToUpdateRates: 'Neuspešno ažuriranje kursnih lista',
  editingCategory: 'Uređivanje kategorije',
  all: 'Sve',
};

export type Language = 'en' | 'sr';

interface TranslationContextType {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations, params?: Record<string, string>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const STORAGE_KEY = 'app_language';

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(englishTranslations);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'sr')) {
        setLanguageState(savedLanguage);
        setTranslations(savedLanguage === 'sr' ? serbianTranslations : englishTranslations);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
      setLanguageState(lang);
      setTranslations(lang === 'sr' ? serbianTranslations : englishTranslations);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: keyof Translations, params?: Record<string, string>): string => {
    let translation = translations[key];
    
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation;
  };

  return (
    <TranslationContext.Provider value={{ language, translations, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
