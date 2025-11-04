import { useState, useMemo, useEffect } from "react";
import { View, Text, Modal, Pressable, TextInput, ScrollView, useColorScheme, KeyboardAvoidingView, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ComponentProps } from "react";

import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store/finance";
import { shouldTranslateCategoryName } from "../../constants/categories";
import type { TranslationKey } from "../../i18n/translations";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const AVAILABLE_ICONS: IconName[] = [
  "shopping",
  "cart",
  "home",
  "car",
  "bus",
  "train",
  "airplane",
  "bike",
  "walk",
  "food",
  "food-apple",
  "coffee",
  "pizza",
  "hamburger",
  "silverware-fork-knife",
  "gamepad-variant",
  "controller-classic",
  "music",
  "headphones",
  "movie",
  "theater",
  "basketball",
  "soccer",
  "tennis",
  "dumbbell",
  "heart",
  "medical-bag",
  "pill",
  "hospital-box",
  "school",
  "book-open-variant",
  "laptop",
  "cellphone",
  "phone",
  "wallet",
  "credit-card",
  "bank",
  "cash",
  "piggy-bank",
  "gift",
  "party-popper",
  "cake",
  "candle",
  "tshirt-crew",
  "shoe-sneaker",
  "watch",
  "glasses",
  "briefcase",
  "badge-account",
  "wrench",
  "hammer",
  "tools",
  "lightning-bolt",
  "water",
  "fire",
  "leaf",
  "flower",
  "dog",
  "cat",
  "paw",
  "tree",
  "weather-sunny",
  "weather-night",
  "star",
  "shield-check",
  "lock",
  "key",
  "alert",
  "bell",
  "email",
  "phone-in-talk",
  "transit-connection-variant",
];

const AVAILABLE_COLORS = [
  "#38bdf8",
  "#f97316",
  "#22c55e",
  "#a855f7",
  "#facc15",
  "#ef4444",
  "#ec4899",
  "#3b82f6",
  "#14b8a6",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
];

type AddCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, icon: IconName, color: string) => void;
};

const AddCategoryModal = ({ visible, onClose, onSave }: AddCategoryModalProps) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<IconName>("help-circle");
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const customCategories = useFinanceStore((state) => state.customCategories);
  
  // Get all existing category names (both custom and default)
  const existingCategoryNames = useMemo(() => {
    const names: string[] = [];
    
    // Add custom category names
    customCategories.forEach((category) => {
      if (shouldTranslateCategoryName(category.name)) {
        // For default categories, use translated name
        names.push(t(category.name as TranslationKey).toLowerCase().trim());
      } else {
        // For custom categories, use the name directly
        names.push(category.name.toLowerCase().trim());
      }
    });
    
    return names;
  }, [customCategories, t]);

  const handleSave = () => {
    const trimmedName = categoryName.trim();
    
    if (!trimmedName) {
      return;
    }
    
    // Check if category name already exists (case-insensitive)
    const normalizedInputName = trimmedName.toLowerCase().trim();
    const isDuplicate = existingCategoryNames.some(
      (existingName) => existingName === normalizedInputName
    );
    
    if (isDuplicate) {
      setErrorMessage(t("categoryAlreadyExists"));
      return;
    }
    
    // Clear error and save
    setErrorMessage(null);
    onSave(trimmedName, selectedIcon, selectedColor);
    setCategoryName("");
    setSelectedIcon("help-circle");
    setSelectedColor(AVAILABLE_COLORS[0]);
    onClose();
  };

  const handleCancel = () => {
    setCategoryName("");
    setSelectedIcon("help-circle");
    setSelectedColor(AVAILABLE_COLORS[0]);
    setErrorMessage(null);
    onClose();
  };
  
  const handleNameChange = (text: string) => {
    setCategoryName(text);
    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage(null);
    }
  };
  
  // Clear error when modal opens
  useEffect(() => {
    if (visible) {
      setErrorMessage(null);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <Pressable className="flex-1" onPress={handleCancel} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View 
            className="bg-white dark:bg-slate-900 rounded-t-[32px] overflow-hidden"
            style={{ paddingBottom: insets.bottom }}
          >
          {/* Header with Drag Indicator */}
          <View className="items-center pt-3 pb-4">
            <View className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
          </View>

          {/* Title and Preview */}
          <View className="px-6 pb-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("addCategory")}
              </Text>
              {/* Preview of selected category */}
              <View 
                className="rounded-2xl p-3"
                style={{ backgroundColor: `${selectedColor}20` }}
              >
                <MaterialCommunityIcons name={selectedIcon} size={32} color={selectedColor} />
              </View>
            </View>

            {/* Category Name Input */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                {t("categoryName")}
              </Text>
              <View className={`bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 overflow-hidden ${
                errorMessage 
                  ? "border-red-500 dark:border-red-500" 
                  : "border-slate-200 dark:border-slate-700"
              }`}>
                <TextInput
                  className="px-5 py-4 text-lg font-semibold text-slate-900 dark:text-white"
                  placeholder={t("categoryNamePlaceholder")}
                  placeholderTextColor="#94a3b8"
                  value={categoryName}
                  onChangeText={handleNameChange}
                  autoFocus
                />
              </View>
              {errorMessage && (
                <Text className="text-red-500 text-sm mt-2 font-medium">
                  {errorMessage}
                </Text>
              )}
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView className="max-h-[50vh] px-6" showsVerticalScrollIndicator={false}>
            {/* Color Selection */}
            <View className="mb-8">
              <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
                {t("selectColor")}
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {AVAILABLE_COLORS.map((color) => (
                  <Pressable
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className="active:scale-90"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: color,
                      shadowColor: selectedColor === color ? color : '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: selectedColor === color ? 0.4 : 0.1,
                      shadowRadius: 8,
                      elevation: selectedColor === color ? 6 : 2,
                    }}
                  >
                    <View className="flex-1 items-center justify-center">
                      {selectedColor === color && (
                        <View className="bg-white/30 rounded-full p-1">
                          <MaterialCommunityIcons name="check-bold" size={28} color="white" />
                        </View>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Icon Selection */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
                {t("selectIcon")}
              </Text>
              <View className="flex-row flex-wrap gap-2.5">
                {AVAILABLE_ICONS.map((icon) => (
                  <Pressable
                    key={icon}
                    onPress={() => setSelectedIcon(icon)}
                    className={`w-14 h-14 rounded-2xl items-center justify-center active:scale-90 ${
                      selectedIcon === icon
                        ? "bg-slate-900 dark:bg-white"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                    style={selectedIcon === icon ? {
                      shadowColor: selectedColor,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 3,
                    } : {}}
                  >
                    <MaterialCommunityIcons
                      name={icon}
                      size={26}
                      color={selectedIcon === icon ? (colorScheme === 'dark' ? '#1e293b' : '#ffffff') : '#64748b'}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View className="flex-row gap-4 p-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Pressable
              className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl py-4 items-center active:scale-95"
              onPress={handleCancel}
            >
              <Text className="text-base font-bold text-slate-700 dark:text-slate-300">
                {t("cancel")}
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded-2xl py-4 items-center active:scale-95 ${
                !categoryName.trim() ? 'opacity-40' : ''
              }`}
              style={{ 
                backgroundColor: selectedColor,
                shadowColor: selectedColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={handleSave}
              disabled={!categoryName.trim()}
            >
              <Text className="text-base font-bold text-white">{t("save")}</Text>
            </Pressable>
          </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddCategoryModal;

