import { AlertButton, CustomAlertOptions } from '../components/CustomAlertModal';

class AlertService {
  private static instance: AlertService;
  private alertQueue: CustomAlertOptions[] = [];
  private currentAlert: CustomAlertOptions | null = null;
  private listeners: Set<(alert: CustomAlertOptions | null) => void> = new Set();

  private constructor() {}

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  subscribe(listener: (alert: CustomAlertOptions | null) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentAlert));
  }

  private processQueue() {
    if (this.currentAlert === null && this.alertQueue.length > 0) {
      this.currentAlert = this.alertQueue.shift() || null;
      this.notifyListeners();
    }
  }

  alert(
    title: string,
    message?: string,
    buttons?: AlertButton[],
    type?: 'info' | 'warning' | 'error' | 'success'
  ) {
    const alertOptions: CustomAlertOptions = {
      title,
      message,
      buttons: buttons || [{ text: 'OK' }],
      type: type || 'info',
    };

    this.alertQueue.push(alertOptions);
    this.processQueue();
  }

  // Convenience methods for different alert types
  success(title: string, message?: string, buttons?: AlertButton[]) {
    this.alert(title, message, buttons, 'success');
  }

  error(title: string, message?: string, buttons?: AlertButton[]) {
    this.alert(title, message, buttons, 'error');
  }

  warning(title: string, message?: string, buttons?: AlertButton[]) {
    this.alert(title, message, buttons, 'warning');
  }

  info(title: string, message?: string, buttons?: AlertButton[]) {
    this.alert(title, message, buttons, 'info');
  }

  // Close current alert and process next in queue
  closeCurrentAlert() {
    this.currentAlert = null;
    this.notifyListeners();
    this.processQueue();
  }

  // Clear all pending alerts
  clearQueue() {
    this.alertQueue = [];
    this.currentAlert = null;
    this.notifyListeners();
  }
}

export default AlertService;
