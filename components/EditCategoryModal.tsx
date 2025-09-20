import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { categoryIcons, getAllCategories } from '../constants/categoryIcons';
import { CustomCategory } from '../types';

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
      Alert.alert('Invalid Name', 'Please enter a category name.');
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
      color: selectedIcon.name === icon.name ? '#2563eb' : '#6b7280',
    };

    switch (icon.library) {
      case 'Ionicons':
        return <Ionicons name={icon.name as any} {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons name={icon.name as any} {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={icon.name as any} {...iconProps} />;
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
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90%]">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-900">
              Edit Category
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Category Name Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Category Name</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-lg text-gray-900"
              placeholder="Enter category name"
              value={categoryName}
              onChangeText={setCategoryName}
              autoFocus={true}
            />
          </View>

          {/* Category Filter */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Icon Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === 'All' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                  onPress={() => setSelectedCategory('All')}
                >
                  <Text className={`text-sm font-medium ${
                    selectedCategory === 'All' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    All
                  </Text>
                </TouchableOpacity>
                {getAllCategories().map(category => (
                  <TouchableOpacity
                    key={category}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === category ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text className={`text-sm font-medium ${
                      selectedCategory === category ? 'text-blue-600' : 'text-gray-600'
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
            <Text className="text-gray-700 font-medium mb-2">Choose Icon</Text>
            <ScrollView className="max-h-48" showsVerticalScrollIndicator={false}>
              <View className="flex-row flex-wrap justify-between">
                {filteredIcons.map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`w-16 h-16 items-center justify-center rounded-xl mb-2 border-2 ${
                      selectedIcon.name === icon.name 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50'
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
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-red-600 rounded-xl py-4"
              onPress={handleDelete}
            >
              <Text className="text-white font-semibold text-center">Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-gray-200 rounded-xl py-4"
              onPress={handleClose}
            >
              <Text className="text-gray-700 font-semibold text-center">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-blue-600 rounded-xl py-4"
              onPress={handleConfirm}
            >
              <Text className="text-white font-semibold text-center">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditCategoryModal;
