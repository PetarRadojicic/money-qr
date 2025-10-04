import React, { useState } from 'react';
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

interface AddCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (category: CustomCategory) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const { error } = useAlert();
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(categoryIcons[0]);
  const [selectedCategory, setSelectedCategory] = useState('Food');

  const handleConfirm = () => {
    if (!categoryName.trim()) {
      error(t('invalidName'), t('invalidNameMessage'));
      return;
    }

    const newCategory: CustomCategory = {
      id: `custom_${Date.now()}`, // Unique ID
      name: categoryName.trim(),
      icon: {
        library: selectedIcon.library,
        name: selectedIcon.name,
        color: getRandomColor(),
      },
      backgroundColor: getRandomBackgroundColor(),
      isCustom: true,
    };

    onConfirm(newCategory);
    setCategoryName('');
    onClose();
  };

  const handleClose = () => {
    setCategoryName('');
    setSelectedIcon(categoryIcons[0]);
    onClose();
  };

  const getRandomColor = () => {
    const colors = [
      '#ea580c', '#d97706', '#9333ea', '#2563eb', '#16a34a',
      '#db2777', '#4f46e5', '#e11d48', '#059669', '#7c3aed',
      '#dc2626', '#0891b2', '#be185d', '#65a30d', '#c2410c'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomBackgroundColor = () => {
    const backgrounds = [
      'bg-orange-100', 'bg-amber-100', 'bg-purple-100', 'bg-blue-100',
      'bg-green-100', 'bg-pink-100', 'bg-indigo-100', 'bg-rose-100',
      'bg-emerald-100', 'bg-violet-100', 'bg-red-100', 'bg-cyan-100',
      'bg-fuchsia-100', 'bg-lime-100', 'bg-orange-100'
    ];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  };

  const renderIcon = (icon: typeof categoryIcons[0]) => {
    const iconProps = {
      size: 24,
      color: selectedIcon.name === icon.name ? '#fbbf24' : '#9ca3af',
    };

    switch (icon.library) {
      case 'Ionicons':
        return <Ionicons name={icon.name as any} {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons name={icon.name as any} {...iconProps} />;
      default:
        return null;
    }
  };

  const filteredIcons = categoryIcons.filter(icon => 
    selectedCategory === 'All' || icon.category === selectedCategory
  );

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
                {t('addNewCategory')}
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
            <Text className="text-gray-300 font-medium mb-3">Icon Category</Text>
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
                    All
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
            <Text className="text-gray-300 font-medium mb-3">Choose Icon</Text>
            <ScrollView className="max-h-48" showsVerticalScrollIndicator={false}>
              <View className="flex-row flex-wrap justify-center">
                {filteredIcons.map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`w-16 h-16 items-center justify-center rounded-xl mb-2 mx-1 border-2 ${
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
              className="flex-1 bg-gray-800/60 border border-gray-600 rounded-2xl py-4"
              onPress={handleClose}
            >
              <Text className="text-gray-300 font-bold text-center">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 rounded-2xl overflow-hidden"
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#EAB308', '#F59E0B']} className="py-4">
                <Text className="text-black font-bold text-center">Add Category</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCategoryModal;
