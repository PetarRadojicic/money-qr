import type { ComponentProps } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTranslation } from "../../hooks/useTranslation";
import type { TranslationKey } from "../../i18n/translations";

type Category = {
  key: TranslationKey;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
  amountLabel?: string;
  customName?: string;
};

type CategoriesGridProps = {
  categories?: Category[];
  onSelectCategory?: (key: TranslationKey) => void;
  onEditCategory?: (key: TranslationKey) => void;
  onAddCategory?: () => void;
};

const CategoriesGrid = ({ categories = [], onSelectCategory, onEditCategory, onAddCategory }: CategoriesGridProps) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between mb-6 px-1">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">
          {t("categories")}
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </Text>
      </View>
      
      <View className="gap-3">
        {categories.map(({ key, icon, color, amountLabel, customName }) => (
          <View 
            key={key}
            className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden"
            style={{ 
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Pressable
              className="active:scale-[0.98]"
              onPress={() => onSelectCategory?.(key)}
            >
              <View className="flex-row items-center p-5">
                {/* Icon Section */}
                <View 
                  className="rounded-2xl p-4 mr-4"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <MaterialCommunityIcons name={icon} size={28} color={color} />
                </View>
                
                {/* Content Section */}
                <View className="flex-1">
                  <Text 
                    className="text-base font-bold text-slate-900 dark:text-white mb-1"
                    numberOfLines={1}
                  >
                    {customName || t(key)}
                  </Text>
                  
                  {amountLabel ? (
                    <Text className="text-lg font-extrabold text-slate-700 dark:text-slate-200">
                      {amountLabel}
                    </Text>
                  ) : (
                    <Text className="text-sm text-slate-400 dark:text-slate-500">
                      No expenses yet
                    </Text>
                  )}
                </View>
                
                {/* Edit Button */}
                <Pressable
                  className="rounded-full p-2.5 mr-1 active:scale-90"
                  style={{ backgroundColor: `${color}15` }}
                  onPress={(e) => {
                    e.stopPropagation();
                    onEditCategory?.(key);
                  }}
                >
                  <MaterialCommunityIcons 
                    name="pencil" 
                    size={20} 
                    color={color}
                  />
                </Pressable>
                
                {/* Arrow Indicator */}
                <MaterialCommunityIcons 
                  name="chevron-right" 
                  size={24} 
                  color="#94a3b8" 
                  style={{ opacity: 0.5 }}
                />
              </View>
            </Pressable>
            
            {/* Accent bar at bottom */}
            <View 
              className="h-1.5"
              style={{ backgroundColor: color }}
            />
          </View>
        ))}
        
        {/* Add Category Button */}
        <Pressable
          className="bg-slate-50 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-3xl overflow-hidden active:scale-[0.98]"
          onPress={onAddCategory}
        >
          <View className="flex-row items-center justify-center p-6">
            <View className="bg-slate-900 dark:bg-slate-200 rounded-full p-2 mr-3">
              <MaterialCommunityIcons 
                name="plus" 
                size={20} 
                color={colorScheme === 'dark' ? '#1e293b' : '#ffffff'}
              />
            </View>
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              {t("addCategory")}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default CategoriesGrid;

