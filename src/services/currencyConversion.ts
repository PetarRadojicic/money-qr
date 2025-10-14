import { dinero, convert, toSnapshot } from "dinero.js";
import * as DineroCurrencies from "@dinero.js/currencies";
import type { Currency as CurrencyType } from "../store/preferences";
import type { Transaction } from "../store/finance";
import { API_BASE_URL } from "@env";
import { FALLBACK_EXCHANGE_RATES } from "../constants/exchangeRates";

// Map currency codes to Dinero currency objects
// We'll dynamically create this map from available Dinero currencies
export const CURRENCY_MAP: Record<string, { code: string; base: number; exponent: number }> = {};

// Populate CURRENCY_MAP with all available Dinero currencies
Object.entries(DineroCurrencies).forEach(([key, value]) => {
  if (typeof value === 'object' && value !== null && 'code' in value && 'base' in value && 'exponent' in value) {
    CURRENCY_MAP[key] = value as { code: string; base: number; exponent: number };
  }
});

export type ExchangeRates = Record<string, number>;

/**
 * Fetches the latest exchange rates from custom API
 * Falls back to hardcoded rates if the API fails
 * @returns Exchange rates object with USD as the base currency (all rates relative to USD)
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    // Use fallback URL if API_BASE_URL is not configured
    const baseUrl = API_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/exchange-rates`);

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }

    const data = await response.json();
    
    // The API returns rates with USD as base - return them directly
    return data.conversion_rates;
  } catch (error) {
    console.warn("Error fetching exchange rates from API, using fallback data:", error);
    
    // Use hardcoded fallback rates (USD as base)
    return FALLBACK_EXCHANGE_RATES;
  }
}

/**
 * Converts an amount from one currency to another using Dinero.js with proper precision
 * @param amount The amount to convert (in decimal format, e.g., 10.50 for $10.50)
 * @param fromCurrency The source currency
 * @param toCurrency The target currency
 * @param exchangeRates The exchange rates object (rates relative to base currency)
 * @returns The converted amount in decimal format
 */
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyType,
  toCurrency: CurrencyType,
  exchangeRates: ExchangeRates
): number {
  // If same currency, return original amount
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromCurrencyObj = CURRENCY_MAP[fromCurrency];
  const toCurrencyObj = CURRENCY_MAP[toCurrency];

  // Get the exchange rates - these are relative to the base currency
  const fromRate = exchangeRates[fromCurrency];
  const toRate = exchangeRates[toCurrency];

  if (!fromRate || !toRate) {
    console.warn(`No exchange rate found for ${!fromRate ? fromCurrency : toCurrency}`);
    throw new Error(`Exchange rate not available. Please try again later.`);
  }

  // If both currencies are supported by Dinero.js, use it for precision
  if (fromCurrencyObj && toCurrencyObj && fromCurrencyObj.exponent !== undefined && toCurrencyObj.exponent !== undefined) {
    try {
      // IMPORTANT: To preserve precision for round-trip conversions, we need to:
      // 1. Use a higher scale for the input amount if it has fractional minor units
      // 2. Use a very high precision scale for the exchange rate
      
      // Check if the amount has fractional minor units (e.g., 0.019 USD has fractional cents)
      const minorUnitsExact = amount * Math.pow(10, fromCurrencyObj.exponent);
      const hasFractionalMinorUnits = minorUnitsExact !== Math.floor(minorUnitsExact);
      
      let dineroAmount;
      
      if (hasFractionalMinorUnits) {
        // Use a higher scale to preserve fractional minor units
        // Scale of 4 means we add 4 more decimal places beyond the currency's exponent
        const highPrecisionScale = fromCurrencyObj.exponent + 4;
        const highPrecisionAmount = Math.round(amount * Math.pow(10, highPrecisionScale));
        dineroAmount = dinero({ 
          amount: highPrecisionAmount, 
          currency: fromCurrencyObj,
          scale: highPrecisionScale
        });
      } else {
        // Standard conversion: use normal minor units
        const minorUnits = Math.round(amount * Math.pow(10, fromCurrencyObj.exponent));
        dineroAmount = dinero({ amount: minorUnits, currency: fromCurrencyObj });
      }

      // Calculate the direct conversion rate: toRate / fromRate
      // This gives us how many units of toCurrency equals 1 unit of fromCurrency
      const directRate = toRate / fromRate;

      // Use maximum precision (12 decimal places) for the rate to minimize rounding errors
      // This is critical for accurate round-trip conversions
      const rateScale = 12;
      const rateAmount = Math.round(directRate * Math.pow(10, rateScale));

      const rateScaled = {
        amount: rateAmount,
        scale: rateScale,
      };

      // Convert to the new currency
      const convertedDinero = convert(dineroAmount, toCurrencyObj, {
        [toCurrency]: rateScaled,
      });

      // Extract the amount and convert back to decimal
      const snapshot = toSnapshot(convertedDinero);
      
      // The snapshot contains the amount in the smallest unit of the target currency
      // and a scale that indicates how to interpret it
      // DO NOT round here - return the precise value
      // Rounding should only happen when displaying to the user
      const convertedDecimal = snapshot.amount / Math.pow(10, snapshot.scale);

      return convertedDecimal;
    } catch (error) {
      console.warn(`Dinero conversion failed, using simple conversion:`, error);
      // Fall through to simple conversion
    }
  }

  // Simple conversion for currencies not supported by Dinero.js
  // Convert to base currency first, then to target currency
  const inBaseCurrency = amount / fromRate;
  const inTargetCurrency = inBaseCurrency * toRate;
  
  // Round to reasonable precision (8 decimal places) to avoid floating point errors
  return Math.round(inTargetCurrency * 100000000) / 100000000;
}

/**
 * Converts all financial data when user changes currency
 * @param oldCurrency The previous currency
 * @param newCurrency The new currency
 * @param totalBalance The total balance to convert
 * @param monthlyData The monthly data to convert
 * @param transactions The transactions array to convert
 * @param exchangeRates The exchange rates object (optional, will fetch if not provided)
 * @returns Converted financial data including transactions
 */
export async function convertAllFinancialData(
  oldCurrency: CurrencyType,
  newCurrency: CurrencyType,
  totalBalance: number,
  monthlyData: Record<string, { income: number; expenses: Record<string, number> }>,
  transactions: Transaction[],
  exchangeRates?: ExchangeRates
): Promise<{
  totalBalance: number;
  monthlyData: Record<string, { income: number; expenses: Record<string, number> }>;
  transactions: Transaction[];
}> {
  // Fetch rates if not provided (rates are always relative to USD)
  const rates = exchangeRates || await fetchExchangeRates();

  // Convert total balance
  const convertedBalance = convertCurrency(totalBalance, oldCurrency, newCurrency, rates);

  // Convert monthly data
  const convertedMonthlyData: typeof monthlyData = {};
  
  for (const [monthKey, data] of Object.entries(monthlyData)) {
    const convertedIncome = convertCurrency(data.income, oldCurrency, newCurrency, rates);
    
    const convertedExpenses: Record<string, number> = {};
    for (const [category, expenseAmount] of Object.entries(data.expenses)) {
      convertedExpenses[category] = convertCurrency(expenseAmount, oldCurrency, newCurrency, rates);
    }

    convertedMonthlyData[monthKey] = {
      income: convertedIncome,
      expenses: convertedExpenses,
    };
  }

  // Convert all transaction amounts
  const convertedTransactions: Transaction[] = transactions.map((transaction): Transaction => ({
    ...transaction,
    amount: convertCurrency(transaction.amount, oldCurrency, newCurrency, rates),
  }));

  return {
    totalBalance: convertedBalance,
    monthlyData: convertedMonthlyData,
    transactions: convertedTransactions,
  } as {
    totalBalance: number;
    monthlyData: Record<string, { income: number; expenses: Record<string, number> }>;
    transactions: Transaction[];
  };
}

