import { View, Text, Pressable, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ErrorModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

const ErrorModal = ({
  visible,
  onClose,
  title = "Error",
  message,
  confirmText = "OK",
  cancelText,
  onConfirm,
  icon = "alert-circle-outline",
}: ErrorModalProps) => {
  const insets = useSafeAreaInsets();
  
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleCancel}>
      <View 
        className="flex-1 bg-black/60 justify-center items-center px-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Pressable className="absolute inset-0" onPress={handleCancel} />
        
        <View className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden w-full max-w-md">
          <View className="px-6 pt-6 pb-6">
            {/* Header */}
            <View className="items-center mb-6">
              <View className="bg-red-100 dark:bg-red-900/30 rounded-2xl p-4 mb-4">
                <MaterialCommunityIcons name={icon} size={40} color="#ef4444" />
              </View>
              <Text className="text-xl font-bold text-slate-900 dark:text-white text-center mb-3">
                {title}
              </Text>
              <Text className="text-base text-slate-600 dark:text-slate-400 text-center leading-6">
                {message}
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              {cancelText && (
                <Pressable
                  className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl py-4 items-center active:scale-95"
                  onPress={handleCancel}
                >
                  <Text className="text-base font-bold text-slate-700 dark:text-slate-300">
                    {cancelText}
                  </Text>
                </Pressable>
              )}
              <Pressable
                className={`${cancelText ? 'flex-1' : 'w-full'} rounded-2xl py-4 items-center active:scale-95`}
                style={{ 
                  backgroundColor: '#ef4444',
                  shadowColor: '#ef4444',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                onPress={handleConfirm}
              >
                <Text className="text-base font-bold text-white">{confirmText}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;

