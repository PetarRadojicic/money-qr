import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../contexts/TranslationContext';
import { getTranslatedMonthName } from '../../utils/translationUtils';

interface MonthPickerModalProps {
  visible: boolean;
  availableMonths: string[];
  selectedMonths: string[];
  onClose: () => void;
  onApply: (months: string[]) => void;
}

export const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  visible,
  availableMonths,
  selectedMonths,
  onClose,
  onApply,
}) => {
  const { t, translations } = useTranslation();
  const [tempSelectedMonths, setTempSelectedMonths] = useState<string[]>(selectedMonths);

  useEffect(() => {
    if (visible) {
      setTempSelectedMonths(selectedMonths);
    }
  }, [visible, selectedMonths]);

  const toggleMonth = (monthKey: string) => {
    setTempSelectedMonths(prev => 
      prev.includes(monthKey) 
        ? prev.filter(m => m !== monthKey)
        : [...prev, monthKey].sort()
    );
  };

  const selectAll = () => {
    setTempSelectedMonths(availableMonths);
  };

  const clearAll = () => {
    setTempSelectedMonths([]);
  };

  const handleApply = () => {
    onApply(tempSelectedMonths);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-gray-900 rounded-t-3xl max-h-96 border-t border-gray-700">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 pb-4 border-b border-gray-700">
            <Text className="text-xl font-bold text-white">{t('selectMonths')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#FFD700" />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-between px-6 py-3 border-b border-gray-700">
            <TouchableOpacity 
              className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg"
              onPress={selectAll}
            >
              <Text className="text-yellow-400 font-bold">{t('selectAll')}</Text>
            </TouchableOpacity>
            
            <Text className="text-sm text-gray-300 self-center">
              {tempSelectedMonths.length} {t('of')} {availableMonths.length} {t('selected')}
            </Text>
            
            <TouchableOpacity 
              className="px-4 py-2 bg-gray-700/60 border border-gray-600 rounded-lg"
              onPress={clearAll}
            >
              <Text className="text-gray-300 font-bold">{t('clearAll')}</Text>
            </TouchableOpacity>
          </View>

          {/* Month List */}
          <ScrollView className="max-h-64 px-6 py-2">
            {availableMonths.map((monthKey) => {
              const isSelected = tempSelectedMonths.includes(monthKey);
              const monthName = getTranslatedMonthName(monthKey, translations);
              
              return (
                <TouchableOpacity
                  key={monthKey}
                  className="flex-row items-center justify-between py-3 border-b border-gray-800"
                  onPress={() => toggleMonth(monthKey)}
                >
                  <Text className="text-white font-bold">{monthName}</Text>
                  <View className={`w-6 h-6 rounded-full border-2 ${
                    isSelected 
                      ? 'bg-yellow-500 border-yellow-500' 
                      : 'border-gray-600'
                  } items-center justify-center`}>
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="black" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View className="flex-row space-x-3 p-6 pt-4">
            <TouchableOpacity 
              className="flex-1 py-3 border border-gray-600 rounded-xl bg-gray-800/60"
              onPress={onClose}
            >
              <Text className="text-gray-300 font-bold text-center">{t('cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`flex-1 py-3 rounded-xl ${
                tempSelectedMonths.length > 0 
                  ? 'bg-yellow-500' 
                  : 'bg-gray-700'
              }`}
              onPress={handleApply}
              disabled={tempSelectedMonths.length === 0}
            >
              <Text className={`font-bold text-center ${
                tempSelectedMonths.length > 0 
                  ? 'text-black' 
                  : 'text-gray-400'
              }`}>
                {t('apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
