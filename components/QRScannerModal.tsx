import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../contexts/TranslationContext';

interface QRScannerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onQRScanned: (data: string) => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isVisible,
  onClose,
  onQRScanned,
}) => {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setScanned(false);
    }
  }, [isVisible]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      onQRScanned(data);
      onClose();
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return null;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center">
              <Ionicons name="camera" size={48} color="#6b7280" />
              <Text className="text-lg font-bold text-gray-900 mt-4 text-center">
                {t('cameraPermissionRequired')}
              </Text>
              <Text className="text-gray-600 mt-2 text-center">
                {t('cameraAccessNeeded')}
              </Text>
              <View className="flex-row space-x-3 mt-6 w-full">
                <TouchableOpacity
                  className="flex-1 bg-gray-200 rounded-xl py-3"
                  onPress={onClose}
                >
                  <Text className="text-gray-700 font-semibold text-center">{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-blue-600 rounded-xl py-3"
                  onPress={requestPermission}
                >
                  <Text className="text-white font-semibold text-center">{t('allowCamera')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        {/* Header */}
        <View className="absolute top-0 left-0 right-0 z-10 bg-black/50 pt-12 pb-4 px-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-lg font-semibold">{t('scanReceiptQRCode')}</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-white/80 text-sm mt-2">
            {t('positionQRCode')}
          </Text>
        </View>

        {/* Camera */}
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417', 'datamatrix', 'code128', 'ean13', 'ean8'],
          }}
        >
          {/* Scanning overlay */}
          <View className="flex-1 justify-center items-center">
            <View className="w-64 h-64 border-2 border-white/50">
              <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
              <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
              <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
              <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />
            </View>
          </View>
        </CameraView>

        {/* Instructions */}
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-6">
          <Text className="text-white text-center text-sm">
            {t('pointCameraAtQR')}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default QRScannerModal;
