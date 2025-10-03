import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
        className={`bg-gray-800/50 rounded-xl p-4 mb-3 border ${
          isSelected ? 'border-yellow-500/50' : 'border-gray-700/50'
        }`}
        onPress={() => handleLanguageSelect(languageOption)}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
              isSelected ? 'bg-yellow-500/20' : 'bg-gray-700/50'
            }`}>
              <Text className="text-lg">
                {languageOption.flag}
              </Text>
            </View>
            
            <View className="flex-1">
              <Text className={`font-semibold text-base ${
                isSelected ? 'text-yellow-400' : 'text-white'
              }`}>
                {languageOption.name}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                {languageOption.nativeName}
              </Text>
            </View>
          </View>
          
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#fbbf24" />
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
      <View className="flex-1 bg-black">
        {/* Header */}
        <View className="bg-gray-900/50 px-6 py-4 border-b border-gray-800/50">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fbbf24" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-white">{t('language')}</Text>
            <View className="w-6" />
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
          <Text className="text-gray-400 text-sm mb-4">
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
