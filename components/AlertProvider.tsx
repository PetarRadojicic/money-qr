import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import CustomAlertModal, { CustomAlertOptions } from './CustomAlertModal';
import AlertService from '../utils/alertService';

interface AlertContextType {
  alert: (title: string, message?: string, buttons?: any[], type?: 'info' | 'warning' | 'error' | 'success') => void;
  success: (title: string, message?: string, buttons?: any[]) => void;
  error: (title: string, message?: string, buttons?: any[]) => void;
  warning: (title: string, message?: string, buttons?: any[]) => void;
  info: (title: string, message?: string, buttons?: any[]) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [currentAlert, setCurrentAlert] = useState<CustomAlertOptions | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = AlertService.getInstance().subscribe((alert) => {
      setCurrentAlert(alert);
      setIsVisible(alert !== null);
    });

    return unsubscribe;
  }, []);

  const handleClose = () => {
    AlertService.getInstance().closeCurrentAlert();
  };

  const alertService = AlertService.getInstance();

  const contextValue: AlertContextType = {
    alert: alertService.alert.bind(alertService),
    success: alertService.success.bind(alertService),
    error: alertService.error.bind(alertService),
    warning: alertService.warning.bind(alertService),
    info: alertService.info.bind(alertService),
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {currentAlert && (
        <CustomAlertModal
          visible={isVisible}
          options={currentAlert}
          onClose={handleClose}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
