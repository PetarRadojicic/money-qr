import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store/finance";
import { usePreferencesStore } from "../../store/preferences";
import { WarnModal, AlertModal } from "../modals";

const ResetSection = () => {
  const { t } = useTranslation();
  const resetFinanceData = useFinanceStore((state) => state.resetFinanceData);
  const resetPreferences = usePreferencesStore((state) => state.resetPreferences);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  const handleReset = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  const confirmReset = () => {
    resetFinanceData();
    resetPreferences();
    setShowResetSuccess(true);
  };

  return (
    <>
      <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <View className="gap-3">
          <View>
            <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">{t("resetApp")}</Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {t("resetAppDescription")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleReset}
            className="rounded-xl bg-red-500 px-4 py-3 active:opacity-80"
          >
            <Text className="text-center text-base font-semibold text-white">{t("resetAppButton")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <WarnModal
        visible={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title={t("resetConfirmTitle")}
        message={t("resetConfirmMessage")}
        confirmText={t("resetConfirmButton")}
        cancelText={t("cancel")}
        onConfirm={confirmReset}
        icon="alert-octagon"
      />

      <AlertModal
        visible={showResetSuccess}
        onClose={() => setShowResetSuccess(false)}
        title={t("resetSuccess")}
        message=""
        confirmText="OK"
        icon="check-circle-outline"
      />
    </>
  );
};

export default ResetSection;

