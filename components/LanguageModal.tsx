import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation, Language } from '../contexts/TranslationContext';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'sr',
    name: 'Serbian',
    nativeName: 'Srpski',
    flag: '🇷🇸',
  },
];

interface LanguageModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isVisible, onClose }) => {
  const { t, language, setLanguage } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  useEffect(() => {
    if (isVisible) {
      setSelectedLanguage(language);
    }
  }, [isVisible, language]);

  const handleLanguageSelect = async (languageOption: LanguageOption) => {
    if (languageOption.code === selectedLanguage) {
      onClose();
      return;
    }

    setSelectedLanguage(languageOption.code);
    await setLanguage(languageOption.code);
    onClose();
  };

  const LanguageItem = ({ languageOption }: { languageOption: LanguageOption }) => {
    const isSelected = languageOption.code === selectedLanguage;
    
    return (
      <TouchableOpacity
        className={`bg-white rounded-xl p-4 mb-3 shadow-sm ${
          isSelected ? 'border-2 border-blue-500' : 'border border-gray-200'
        }`}
        onPress={() => handleLanguageSelect(languageOption)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
              isSelected ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Text className="text-lg">
                {languageOption.flag}
              </Text>
            </View>
            
            <View className="flex-1">
              <Text className={`font-semibold text-base ${
                isSelected ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {languageOption.name}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {languageOption.nativeName}
              </Text>
            </View>
          </View>
          
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-6 py-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">{t('language')}</Text>
            <View className="w-6" />
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
          <Text className="text-gray-600 text-sm mb-4">
            {t('language') === 'Language' ? 'Choose your preferred language. The app will restart with the new language.' : 'Izaberite željeni jezik. Aplikacija će se restartovati sa novim jezikom.'}
          </Text>

          {/* Languages */}
          <View className="mb-6">
            {LANGUAGES.map((languageOption) => (
              <LanguageItem key={languageOption.code} languageOption={languageOption} />
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default LanguageModal;
