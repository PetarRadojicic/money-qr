import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { categoryIcons, getAllCategories } from '../constants/categoryIcons';
import { CustomCategory } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { useAlert } from './AlertProvider';

interface EditCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (categoryId: string, updates: Partial<CustomCategory>) => void;
  onDelete: (categoryId: string) => void;
  category: CustomCategory | null;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  onDelete,
  category,
}) => {
  const { t } = useTranslation();
  const { error } = useAlert();
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(categoryIcons[0]);
  const [selectedCategory, setSelectedCategory] = useState('Food');

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      // Find the icon in our library
      const icon = categoryIcons.find(i => i.name === category.icon.name);
      if (icon) {
        setSelectedIcon(icon);
        setSelectedCategory(icon.category);
      }
    }
  }, [category]);

  const handleConfirm = () => {
    if (!categoryName.trim() || !category) {
      error(t('invalidName'), t('invalidNameMessage'));
      return;
    }

    const updates: Partial<CustomCategory> = {
      name: categoryName.trim(),
      icon: {
        library: selectedIcon.library,
        name: selectedIcon.name,
        color: category.icon.color, // Keep original color
      },
    };

    onConfirm(category.id, updates);
    onClose();
  };

  const handleClose = () => {
    setCategoryName('');
    setSelectedIcon(categoryIcons[0]);
    onClose();
  };

  const handleDelete = () => {
    if (category) {
      onDelete(category.id);
      onClose();
    }
  };

  const renderIcon = (icon: typeof categoryIcons[0]) => {
    const iconProps = {
      size: 24,
      color: selectedIcon.name === icon.name ? '#fbbf24' : '#9ca3af',
    };

    const iconName = icon.name as any;

    switch (icon.library) {
      case 'Ionicons':
        return <Ionicons name={iconName} {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons name={iconName} {...iconProps} />;
      default:
        return null;
    }
  };

  const filteredIcons = categoryIcons.filter(icon => 
    selectedCategory === 'All' || icon.category === selectedCategory
  );

  if (!category) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-gray-900/95 backdrop-blur-sm rounded-3xl p-6 w-full max-w-lg max-h-[90%] border border-gray-700 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-1">
              <Text className="text-xl font-bold text-white">
                {t('editCategory')}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={handleClose}
              className="bg-gray-800/60 border border-gray-600 rounded-xl p-2"
            >
              <Ionicons name="close" size={20} color="#FFD700" />
            </TouchableOpacity>
          </View>

          {/* Category Name Input */}
          <View className="mb-6">
            <Text className="text-gray-300 font-medium mb-3">{t('categoryName')}</Text>
            <TextInput
              className="bg-gray-800/60 border border-gray-600 rounded-2xl px-4 py-4 text-xl text-white font-semibold"
              placeholder={t('pleaseEnterCategoryName')}
              placeholderTextColor="#9CA3AF"
              value={categoryName}
              onChangeText={setCategoryName}
              autoFocus={true}
            />
          </View>

          {/* Category Filter */}
          <View className="mb-4">
            <Text className="text-gray-300 font-medium mb-3">{t('icons')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === 'All' ? 'bg-yellow-500/20' : 'bg-gray-800/60'
                  }`}
                  onPress={() => setSelectedCategory('All')}
                >
                  <Text className={`text-sm font-medium ${
                    selectedCategory === 'All' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {t('all')}
                  </Text>
                </TouchableOpacity>
                {getAllCategories().map(category => (
                  <TouchableOpacity
                    key={category}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === category ? 'bg-yellow-500/20' : 'bg-gray-800/60'
                    }`}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text className={`text-sm font-medium ${
                      selectedCategory === category ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Icon Selection */}
          <View className="mb-6">
            <Text className="text-gray-300 font-medium mb-3">{t('selectIcon')}</Text>
            <ScrollView className="max-h-48" showsVerticalScrollIndicator={false}>
              <View className="flex-row flex-wrap justify-between">
                {filteredIcons.map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`w-16 h-16 items-center justify-center rounded-xl mb-2 border-2 ${
                      selectedIcon.name === icon.name 
                        ? 'border-yellow-500/50 bg-yellow-500/10' 
                        : 'border-gray-600 bg-gray-800/60'
                    }`}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    {renderIcon(icon)}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 rounded-2xl overflow-hidden"
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#DC2626', '#B91C1C']} className="py-4">
                <Text className="text-white font-bold text-center">{t('delete')}</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-gray-800/60 border border-gray-600 rounded-2xl py-4"
              onPress={handleClose}
            >
              <Text className="text-gray-300 font-bold text-center">{t('cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 rounded-2xl overflow-hidden"
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#EAB308', '#F59E0B']} className="py-4">
                <Text className="text-black font-bold text-center">{t('save')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditCategoryModal;
