import { dinero, convert, toSnapshot } from "dinero.js";
import * as DineroCurrencies from "@dinero.js/currencies";
import type { Currency as CurrencyType } from "../store/preferences";
import { API_BASE_URL } from "@env";

// Map currency codes to Dinero currency objects
// We'll dynamically create this map from available Dinero currencies
export const CURRENCY_MAP: Record<string, any> = {};

// Populate CURRENCY_MAP with all available Dinero currencies
Object.entries(DineroCurrencies).forEach(([key, value]) => {
  if (typeof value === 'object' && value !== null && 'code' in value) {
    CURRENCY_MAP[key] = value;
  }
});

export type ExchangeRates = Record<string, number>;

/**
 * Fetches the latest exchange rates from custom API
 * @param baseCurrency The base currency to get rates for (defaults to USD as the API base)
 * @returns Exchange rates object
 */
export async function fetchExchangeRates(baseCurrency: CurrencyType = 'USD'): Promise<ExchangeRates> {
  try {
    const response = await fetch(`${API_BASE_URL}/exchange-rates`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // The API returns rates with USD as base
    const usdRates = data.conversion_rates;
    
    // If the base currency is USD, return rates directly
    if (baseCurrency === 'USD') {
      return usdRates;
    }
    
    // Otherwise, convert all rates to the requested base currency
    const baseRate = usdRates[baseCurrency];
    if (!baseRate) {
      console.warn(`Base currency ${baseCurrency} not found, using USD`);
      return usdRates;
    }
    
    // Convert all rates to the new base
    const convertedRates: ExchangeRates = {};
    Object.entries(usdRates).forEach(([currency, rate]) => {
      convertedRates[currency] = (rate as number) / baseRate;
    });
    
    return convertedRates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Throw error so it can be caught and shown to the user
    throw new Error(`Failed to fetch exchange rates. Please check your internet connection and try again.`);
  }
}

/**
 * Converts an amount from one currency to another using Dinero.js or simple math
 * @param amount The amount to convert (in decimal format, e.g., 10.50 for $10.50)
 * @param fromCurrency The source currency
 * @param toCurrency The target currency
 * @param exchangeRates The exchange rates object
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

  // Get the exchange rate for the target currency
  const rate = exchangeRates[toCurrency];
  
  if (!rate) {
    console.warn(`No exchange rate found for ${toCurrency}`);
    throw new Error(`Exchange rate not available for ${toCurrency}. Please try again later.`);
  }

  // If both currencies are supported by Dinero.js, use it for precision
  if (fromCurrencyObj && toCurrencyObj) {
    try {
      // Convert decimal amount to minor units (cents) for Dinero
      const minorUnits = Math.round(amount * Math.pow(10, fromCurrencyObj.exponent));

      // Create a Dinero object with the amount in minor units
      const dineroAmount = dinero({ amount: minorUnits, currency: fromCurrencyObj });

      // Convert the rate to a scaled amount for precision
      const rateScaled = {
        amount: Math.round(rate * 1000000),
        scale: 6,
      };

      // Convert to the new currency
      const convertedDinero = convert(dineroAmount, toCurrencyObj, {
        [toCurrency]: rateScaled,
      });

      // Extract the amount from the converted Dinero object and convert back to decimal
      const snapshot = toSnapshot(convertedDinero);
      const convertedDecimal = snapshot.amount / Math.pow(10, snapshot.scale);
      
      return convertedDecimal;
    } catch (error) {
      console.warn(`Dinero conversion failed, using simple conversion:`, error);
      // Fall through to simple conversion
    }
  }

  // Simple conversion for currencies not supported by Dinero.js
  return amount * rate;
}

/**
 * Converts all financial data when user changes currency
 * @param oldCurrency The previous currency
 * @param newCurrency The new currency
 * @param totalBalance The total balance to convert
 * @param monthlyData The monthly data to convert
 * @param exchangeRates The exchange rates object
 * @returns Converted financial data
 */
export async function convertAllFinancialData(
  oldCurrency: CurrencyType,
  newCurrency: CurrencyType,
  totalBalance: number,
  monthlyData: Record<string, { income: number; expenses: Record<string, number> }>,
  exchangeRates?: ExchangeRates
) {
  // Fetch rates if not provided
  const rates = exchangeRates || await fetchExchangeRates(oldCurrency);

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

  return {
    totalBalance: convertedBalance,
    monthlyData: convertedMonthlyData,
  };
}

