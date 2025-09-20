import { ExpenseCategoryData } from '../types';

export const expenseCategories: ExpenseCategoryData[] = [
  {
    id: 'food',
    name: 'Food',
    amount: '$280',
    icon: {
      library: 'Ionicons',
      name: 'restaurant',
      color: '#ea580c',
    },
    backgroundColor: 'bg-orange-100',
  },
  {
    id: 'cafe',
    name: 'Cafe',
    amount: '$85',
    icon: {
      library: 'Ionicons',
      name: 'cafe',
      color: '#d97706',
    },
    backgroundColor: 'bg-amber-100',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    amount: '$120',
    icon: {
      library: 'Ionicons',
      name: 'film',
      color: '#9333ea',
    },
    backgroundColor: 'bg-purple-100',
  },
  {
    id: 'transport',
    name: 'Transport',
    amount: '$95',
    icon: {
      library: 'Ionicons',
      name: 'car',
      color: '#2563eb',
    },
    backgroundColor: 'bg-blue-100',
  },
  {
    id: 'health',
    name: 'Health',
    amount: '$60',
    icon: {
      library: 'Ionicons',
      name: 'medical',
      color: '#16a34a',
    },
    backgroundColor: 'bg-green-100',
  },
  {
    id: 'pets',
    name: 'Pets',
    amount: '$45',
    icon: {
      library: 'FontAwesome5',
      name: 'dog',
      color: '#db2777',
    },
    backgroundColor: 'bg-pink-100',
  },
  {
    id: 'family',
    name: 'Family',
    amount: '$35',
    icon: {
      library: 'MaterialIcons',
      name: 'family-restroom',
      color: '#4f46e5',
    },
    backgroundColor: 'bg-indigo-100',
  },
  {
    id: 'clothes',
    name: 'Clothes',
    amount: '$30',
    icon: {
      library: 'MaterialIcons',
      name: 'checkroom',
      color: '#e11d48',
    },
    backgroundColor: 'bg-rose-100',
  },
  {
    id: 'add',
    name: 'Add',
    amount: '',
    icon: {
      library: 'Ionicons',
      name: 'add',
      color: '#6b7280',
    },
    backgroundColor: 'bg-gray-200',
    isAddButton: true,
  },
];
