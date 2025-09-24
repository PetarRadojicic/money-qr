import { Translations } from '../contexts/TranslationContext';

// Helper function to get translated month name from key
export const getTranslatedMonthName = (monthKey: string, translations: Translations): string => {
  const [year, month] = monthKey.split('-');
  const monthNumber = parseInt(month) - 1; // 0-based month index
  
  const monthKeys: (keyof Translations)[] = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  
  const monthName = translations[monthKeys[monthNumber]];
  return `${monthName} ${year}`;
};

// Helper function to get translated category name
export const getTranslatedCategoryName = (categoryId: string, originalName: string, translations: Translations): string => {
  // Check if this is a default category that has translation
  const categoryTranslationKey = categoryId as keyof Translations;
  
  // Only translate if the key exists in translations and matches one of our default categories
  const defaultCategories = ['food', 'cafe', 'entertainment', 'transport', 'health', 'pets', 'family', 'clothes', 'add'];
  
  if (defaultCategories.includes(categoryId) && translations[categoryTranslationKey]) {
    return translations[categoryTranslationKey];
  }
  
  // Return original name for custom categories or categories without translation
  return originalName;
};
