import { useState, useEffect } from "react";
import { View, Text, Pressable, Modal, ActivityIndicator, StyleSheet, Linking } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTranslation } from "../../hooks/useTranslation";
import { ErrorModal } from "../modals";

type QRScannerProps = {
  visible: boolean;
  onClose: () => void;
  onScan: (rawData: string) => void;
};

const QRScanner = ({ visible, onClose, onScan }: QRScannerProps) => {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showPermissionError, setShowPermissionError] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  useEffect(() => {
    if (!visible) {
      // Reset states when modal closes
      setIsRequestingPermission(false);
      setShowPermissionError(false);
      return;
    }

    // Reset scanned state when modal opens
    setScanned(false);
    setShowPermissionError(false);
    
    // Request permission if not already granted
    const handlePermission = async () => {
      // If permission is still loading, wait
      if (!permission) {
        return;
      }
      
      // If already granted, do nothing
      if (permission.granted) {
        setIsRequestingPermission(false);
        return;
      }
      
      // Request permission
      setIsRequestingPermission(true);
      const result = await requestPermission();
      setIsRequestingPermission(false);
      
      // If permission was denied and we can't ask again, show error
      if (!result.granted && !result.canAskAgain) {
        setShowPermissionError(true);
      }
    };
    
    handlePermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, permission?.granted]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    onScan(data);
  };

  const handleClose = () => {
    setScanned(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <>
      <Modal transparent visible={visible} animationType="slide" onRequestClose={handleClose}>
        <View className="flex-1 bg-black">
          {!permission || isRequestingPermission ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#ffffff" />
              <Text className="text-white mt-4 text-base">{t("parsingReceipt")}</Text>
            </View>
          ) : !permission.granted ? (
            <View className="flex-1 items-center justify-center px-6">
              <MaterialCommunityIcons name="camera-off" size={80} color="#ef4444" />
              <Text className="text-white text-xl font-bold mt-6 text-center">
                {t("permissionDenied")}
              </Text>
              <Text className="text-slate-400 text-base mt-2 text-center">
                {t("permissionDeniedMessage")}
              </Text>
              {/* Action buttons */}
              {permission.canAskAgain ? (
                <Pressable
                  className="mt-8 bg-white rounded-2xl px-8 py-4"
                  onPress={async () => {
                    setIsRequestingPermission(true);
                    const result = await requestPermission();
                    setIsRequestingPermission(false);
                    if (!result.granted && !result.canAskAgain) {
                      setShowPermissionError(true);
                    }
                  }}
                >
                  <Text className="text-black font-bold text-base">{t("allowCamera")}</Text>
                </Pressable>
              ) : (
                <Pressable
                  className="mt-8 bg-white rounded-2xl px-8 py-4"
                  onPress={() => Linking.openSettings()}
                >
                  <Text className="text-black font-bold text-base">{t("openSettings")}</Text>
                </Pressable>
              )}
              <Pressable
                className="mt-4 bg-white/10 rounded-2xl px-8 py-4"
                onPress={handleClose}
              >
                <Text className="text-white font-bold text-base">{t("back")}</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              />
              
              {/* Overlay */}
              <View className="absolute inset-0 items-center justify-center pointer-events-none">
                <View className="items-center">
                  {/* Scanning frame */}
                  <View className="w-64 h-64 border-4 border-white rounded-3xl opacity-50" />
                  
                  {/* Instructions */}
                  <View className="mt-8 px-6">
                    <Text className="text-white text-lg font-bold text-center">
                      {t("scanningReceipt")}
                    </Text>
                    <Text className="text-slate-300 text-base mt-2 text-center">
                      {t("scanReceiptPrompt")}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Close button */}
              <View className="absolute top-12 left-0 right-0 px-6 pointer-events-box-none">
                <Pressable
                  className="self-end bg-white/20 rounded-full p-3 pointer-events-auto"
                  onPress={handleClose}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
                </Pressable>
              </View>
            </>
          )}
        </View>
      </Modal>

      <ErrorModal
        visible={showPermissionError}
        title={t("permissionDenied")}
        message={t("permissionDeniedMessage")}
        onClose={() => {
          setShowPermissionError(false);
          handleClose();
        }}
      />
    </>
  );
};

export default QRScanner;

