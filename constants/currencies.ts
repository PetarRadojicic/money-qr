export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to USD (1.0)
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'RSD', rate: 108.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.0 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.92 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74.0 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 20.0 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1180.0 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.35 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.45 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 8.5 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 8.8 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', rate: 6.3 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', rate: 3.9 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', rate: 21.5 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', rate: 300.0 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 73.0 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 14.5 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 8.5 },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', rate: 3.2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', rate: 3.75 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼', rate: 3.64 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', rate: 0.30 },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب', rate: 0.38 },
  { code: 'OMR', name: 'Omani Rial', symbol: '﷼', rate: 0.38 },
];

export const DEFAULT_CURRENCY = 'USD';

export const getCurrencyByCode = (code: string): Currency => {
  return CURRENCIES.find(currency => currency.code === code) || CURRENCIES[0];
};

// This function is now deprecated - use convertAmount from currencyService.ts instead
export const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const from = getCurrencyByCode(fromCurrency);
  const to = getCurrencyByCode(toCurrency);
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / from.rate;
  const convertedAmount = usdAmount * to.rate;
  
  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = getCurrencyByCode(currencyCode);
  
  // Handle currencies that typically don't use decimal places
  const decimalPlaces = ['JPY', 'KRW', 'HUF', 'RUB'].includes(currencyCode) ? 0 : 2;
  
  const formattedAmount = amount.toFixed(decimalPlaces);
  
  // Format with proper symbol placement
  if (currencyCode === 'RSD') {
    return `${formattedAmount} RSD`;
  }
  if (currency.symbol === '$' && currencyCode !== 'USD') {
    return `${currency.symbol}${formattedAmount}`;
  } else if (currency.symbol === '¥' && currencyCode === 'JPY') {
    return `${currency.symbol}${formattedAmount}`;
  } else if (currency.symbol === '¥' && currencyCode === 'CNY') {
    return `${currency.symbol}${formattedAmount}`;
  } else if (currency.symbol === '₩') {
    return `${currency.symbol}${formattedAmount}`;
  } else if (currency.symbol === '₹') {
    return `${currency.symbol}${formattedAmount}`;
  } else if (currency.symbol === '₽') {
    return `${currency.symbol}${formattedAmount}`;
  } else if (currency.symbol === '₺') {
    return `${currency.symbol}${formattedAmount}`;
  } else if (currency.symbol === '₪') {
    return `${currency.symbol}${formattedAmount}`;
  } else if (currency.symbol === 'د.إ' || currency.symbol === '﷼' || currency.symbol === 'د.ك' || currency.symbol === 'د.ب') {
    return `${formattedAmount} ${currency.symbol}`;
  } else if (currency.symbol === 'kr') {
    return `${formattedAmount} ${currency.symbol}`;
  } else if (currency.symbol === 'zł') {
    return `${formattedAmount} ${currency.symbol}`;
  } else if (currency.symbol === 'Kč') {
    return `${formattedAmount} ${currency.symbol}`;
  } else if (currency.symbol === 'Ft') {
    return `${formattedAmount} ${currency.symbol}`;
  } else if (currency.symbol === 'R') {
    return `${currency.symbol}${formattedAmount}`;
  } else {
    return `${currency.symbol}${formattedAmount}`;
  }
};
