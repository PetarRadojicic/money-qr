import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface CustomAlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  type?: 'info' | 'warning' | 'error' | 'success';
}

interface CustomAlertModalProps {
  visible: boolean;
  options: CustomAlertOptions;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  visible,
  options,
  onClose,
}) => {
  const { title, message, buttons = [{ text: 'OK' }], type = 'info' } = options;

  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle' as const,
          iconColor: '#10b981',
          iconBg: '#10b981/20',
        };
      case 'warning':
        return {
          icon: 'warning' as const,
          iconColor: '#f59e0b',
          iconBg: '#f59e0b/20',
        };
      case 'error':
        return {
          icon: 'close-circle' as const,
          iconColor: '#ef4444',
          iconBg: '#ef4444/20',
        };
      default:
        return {
          icon: 'information-circle' as const,
          iconColor: '#fbbf24',
          iconBg: '#fbbf24/20',
        };
    }
  };

  const { icon, iconColor, iconBg } = getIconAndColors();

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  };

  const getButtonStyle = (button: AlertButton) => {
    switch (button.style) {
      case 'destructive':
        return {
          container: 'flex-1 bg-red-900/30 border border-red-700/50 rounded-2xl py-4',
          text: 'text-red-400 font-bold text-center',
          useGradient: false,
        };
      case 'cancel':
        return {
          container: 'flex-1 bg-gray-800/60 border border-gray-600 rounded-2xl py-4',
          text: 'text-gray-300 font-bold text-center',
          useGradient: false,
        };
      default:
        return {
          container: 'flex-1 rounded-2xl overflow-hidden',
          text: 'text-black font-bold text-center',
          useGradient: true,
        };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View 
          className="bg-gray-900/95 backdrop-blur-sm rounded-3xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {/* Icon */}
          <View className="items-center mb-6">
            <View className={`w-16 h-16 rounded-full items-center justify-center ${iconBg}`}>
              <Ionicons name={icon} size={32} color={iconColor} />
            </View>
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-white text-center mb-3">
            {title}
          </Text>

          {/* Message */}
          {message && (
            <Text className="text-gray-300 text-base text-center mb-6 leading-6">
              {message}
            </Text>
          )}

          {/* Buttons */}
          <View className={`flex-row gap-3 ${buttons.length === 1 ? 'justify-center' : ''}`}>
            {buttons.map((button, index) => {
              const buttonStyle = getButtonStyle(button);
              
              if (buttonStyle.useGradient) {
                return (
                  <TouchableOpacity
                    key={index}
                    className={buttonStyle.container}
                    onPress={() => handleButtonPress(button)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient colors={['#EAB308', '#F59E0B']} className="py-4">
                      <Text className={buttonStyle.text}>{button.text}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={index}
                  className={buttonStyle.container}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.8}
                >
                  <Text className={buttonStyle.text}>{button.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlertModal;
