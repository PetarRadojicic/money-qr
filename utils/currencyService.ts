import axios from 'axios';
import { Currency } from '../constants/currencies';

// Cache for exchange rates to avoid excessive API calls
let exchangeRatesCache: { [key: string]: number } = {};
let lastFetchTime: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Axios instance with default configuration
const currencyAPI = axios.create({
  baseURL: 'https://api.exchangerate-api.com/v4',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
currencyAPI.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
currencyAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ Exchange rates API error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

// Fallback rates (same as your current hardcoded rates)
const FALLBACK_RATES: { [key: string]: number } = {
  USD: 1.0,
  RSD: 108.0,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  INR: 74.0,
  BRL: 5.2,
  MXN: 20.0,
  KRW: 1180.0,
  SGD: 1.35,
  NZD: 1.45,
  SEK: 8.5,
  NOK: 8.8,
  DKK: 6.3,
  PLN: 3.9,
  CZK: 21.5,
  HUF: 300.0,
  RUB: 73.0,
  ZAR: 14.5,
  TRY: 8.5,
  ILS: 3.2,
  AED: 3.67,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.30,
  BHD: 0.38,
  OMR: 0.38,
};

// Retry function for failed requests
const retryRequest = async (fn: () => Promise<any>, retries = 2, delay = 1000): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const fetchExchangeRates = async (): Promise<{ [key: string]: number }> => {
  const now = Date.now();
  
  // Return cached rates if they're still fresh
  if (Object.keys(exchangeRatesCache).length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    return exchangeRatesCache;
  }

  try {
    // Use axios instance with retry logic
    const response = await retryRequest(async () => {
      return await currencyAPI.get('/latest/USD');
    });
    
    if (response.status === 200 && response.data && response.data.rates) {
      // Convert to our format (rates relative to USD)
      exchangeRatesCache = response.data.rates;
      lastFetchTime = now;
      
      return exchangeRatesCache;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    // In production, avoid noisy warnings/logs; only fallback silently
    return FALLBACK_RATES;
  }
};

export const getExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<number> => {
  const rates = await fetchExchangeRates();
  
  // If either currency is USD, use direct rate
  if (fromCurrency === 'USD') {
    return rates[toCurrency] || FALLBACK_RATES[toCurrency] || 1.0;
  }
  
  if (toCurrency === 'USD') {
    return 1 / (rates[fromCurrency] || FALLBACK_RATES[fromCurrency] || 1.0);
  }
  
  // Convert through USD
  const fromRate = rates[fromCurrency] || FALLBACK_RATES[fromCurrency] || 1.0;
  const toRate = rates[toCurrency] || FALLBACK_RATES[toCurrency] || 1.0;
  
  return toRate / fromRate;
};

export const convertAmount = async (amount: number, fromCurrency: string, toCurrency: string): Promise<number> => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = amount * rate;
  
  return convertedAmount; // Do not round here; leave rounding to display layer
};

export const updateCurrencyRates = async (): Promise<boolean> => {
  try {
    const rates = await fetchExchangeRates();
    return Object.keys(rates).length > 0;
  } catch (error) {
    console.error('Failed to update currency rates:', error);
    return false;
  }
};

// Get cached rates without making API call
export const getCachedRates = (): { [key: string]: number } => {
  return exchangeRatesCache;
};

// Check if rates are fresh (less than 1 hour old)
export const areRatesFresh = (): boolean => {
  const now = Date.now();
  return Object.keys(exchangeRatesCache).length > 0 && (now - lastFetchTime) < CACHE_DURATION;
};

// Get detailed status information
export const getExchangeRateStatus = () => {
  const now = Date.now();
  const isFresh = areRatesFresh();
  const ratesCount = Object.keys(exchangeRatesCache).length;
  const timeSinceUpdate = now - lastFetchTime;
  const timeUntilExpiry = CACHE_DURATION - timeSinceUpdate;
  
  return {
    isFresh,
    ratesCount,
    lastUpdateTime: lastFetchTime,
    timeSinceUpdate,
    timeUntilExpiry: Math.max(0, timeUntilExpiry),
    hasRates: ratesCount > 0,
  };
};
