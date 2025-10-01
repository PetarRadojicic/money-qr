import axios from 'axios';
import { Platform } from 'react-native';

const DEFAULT_BASE_URL = (() => {
  if (process.env.EXPO_PUBLIC_RECEIPT_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RECEIPT_API_BASE_URL;
  }

  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Android emulators resolve localhost via 10.0.2.2
      return 'http://10.0.2.2:3000';
    }
    return 'http://localhost:3000';
  }

  return 'http://localhost:3000';
})();

const DEFAULT_PARSE_PATH = process.env.EXPO_PUBLIC_RECEIPT_API_PATH ?? '/parse-receipt';

const buildEndpoint = () => {
  const base = DEFAULT_BASE_URL.replace(/\/$/, '');
  const path = DEFAULT_PARSE_PATH.startsWith('/') ? DEFAULT_PARSE_PATH : `/${DEFAULT_PARSE_PATH}`;
  return `${base}${path}`;
};

export interface ReceiptParseResult {
  total: number;
  currency: string;
  date?: string;
  vendor?: string;
}

export const parseReceiptFromRawData = async (rawData: string): Promise<ReceiptParseResult> => {
  if (!rawData.trim()) {
    throw new Error('rawData is empty');
  }

  const response = await axios.post(buildEndpoint(), {
    rawData,
  });

  return response.data as ReceiptParseResult;
};

