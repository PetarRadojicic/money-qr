import { ExpenseCategoryData, CustomCategory } from '../types';
import { 
  loadCustomCategories, 
  getModifiedCategories, 
  getHiddenCategories 
} from '../utils/dataManager';

// Base category definitions (without amounts)
export const categoryDefinitions = [
  {
    id: 'food',
    name: 'Food',
    icon: {
      library: 'Ionicons' as const,
      name: 'restaurant',
      color: '#ea580c',
    },
    backgroundColor: 'bg-orange-100',
  },
  {
    id: 'cafe',
    name: 'Cafe',
    icon: {
      library: 'Ionicons' as const,
      name: 'cafe',
      color: '#d97706',
    },
    backgroundColor: 'bg-amber-100',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: {
      library: 'Ionicons' as const,
      name: 'film',
      color: '#9333ea',
    },
    backgroundColor: 'bg-purple-100',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: {
      library: 'Ionicons' as const,
      name: 'car',
      color: '#2563eb',
    },
    backgroundColor: 'bg-blue-100',
  },
  {
    id: 'health',
    name: 'Health',
    icon: {
      library: 'Ionicons' as const,
      name: 'medical',
      color: '#16a34a',
    },
    backgroundColor: 'bg-green-100',
  },
  {
    id: 'pets',
    name: 'Pets',
    icon: {
      library: 'FontAwesome5' as const,
      name: 'dog',
      color: '#db2777',
    },
    backgroundColor: 'bg-pink-100',
  },
  {
    id: 'family',
    name: 'Family',
    icon: {
      library: 'MaterialIcons' as const,
      name: 'family-restroom',
      color: '#4f46e5',
    },
    backgroundColor: 'bg-indigo-100',
  },
  {
    id: 'clothes',
    name: 'Clothes',
    icon: {
      library: 'MaterialIcons' as const,
      name: 'checkroom',
      color: '#e11d48',
    },
    backgroundColor: 'bg-rose-100',
  },
];

// Helper function to create expense categories with amounts
export const createExpenseCategories = async (categoryAmounts: { [key: string]: number }): Promise<ExpenseCategoryData[]> => {
  // Load all category modifications
  const [customCategories, modifiedCategories, hiddenCategories] = await Promise.all([
    loadCustomCategories(),
    getModifiedCategories(),
    getHiddenCategories()
  ]);
  
  // Start with default categories, apply modifications and filter hidden ones
  const categories = categoryDefinitions
    .filter(category => !hiddenCategories.includes(category.id))
    .map(category => {
      const modifiedCategory = modifiedCategories[category.id];
      if (modifiedCategory) {
        // Use modified version if it exists
        return {
          ...category,
          ...modifiedCategory,
          amount: categoryAmounts[category.id] || 0,
        };
      }
      // Use original default category
      return {
        ...category,
        amount: categoryAmounts[category.id] || 0,
      };
    });

  // Add custom categories
  Object.values(customCategories).forEach((customCategory: CustomCategory) => {
    if (!hiddenCategories.includes(customCategory.id)) {
      categories.push({
        id: customCategory.id,
        name: customCategory.name,
        amount: categoryAmounts[customCategory.id] || 0,
        icon: customCategory.icon,
        backgroundColor: customCategory.backgroundColor,
      });
    }
  });

  // Add the "Add" button
  categories.push({
    id: 'add',
    name: 'Add',
    amount: 0,
    icon: {
      library: 'Ionicons' as const,
      name: 'add',
      color: '#6b7280',
    },
    backgroundColor: 'bg-gray-200',
    isAddButton: true,
  });

  return categories;
};
