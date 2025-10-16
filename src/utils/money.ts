/**
 * Money utilities using dinero.js for safe monetary calculations
 * All monetary values are stored as decimal numbers in the app
 * This module handles conversion to/from dinero objects for calculations
 */

import { dinero, add as dineroAdd, subtract as dineroSubtract, multiply as dineroMultiply, convert as dineroConvert, toSnapshot, greaterThan, lessThan, equal, toDecimal } from "dinero.js";
import * as DineroCurrencies from "@dinero.js/currencies";
import type { Dinero, Currency as DineroCurrency } from "dinero.js";
import type { Currency } from "../store/preferences";

// Map currency codes to Dinero currency objects
export const CURRENCY_MAP: Record<string, DineroCurrency<number>> = {};

// Populate CURRENCY_MAP with all available Dinero currencies
Object.entries(DineroCurrencies).forEach(([key, value]) => {
  if (typeof value === 'object' && value !== null && 'code' in value && 'base' in value && 'exponent' in value) {
    CURRENCY_MAP[key] = value as DineroCurrency<number>;
  }
});

/**
 * Convert a decimal amount to a Dinero object
 * @param amount Decimal amount (e.g., 10.50)
 * @param currencyCode Currency code (e.g., "USD")
 * @returns Dinero object
 */
export function toDinero(amount: number, currencyCode: Currency = "USD"): Dinero<number> {
  const currency = CURRENCY_MAP[currencyCode] || CURRENCY_MAP.USD;
  const minorUnits = Math.round(amount * Math.pow(10, currency.exponent));
  return dinero({ amount: minorUnits, currency });
}

/**
 * Convert a Dinero object to a decimal amount
 * @param money Dinero object
 * @returns Decimal amount
 */
export function fromDinero(money: Dinero<number>): number {
  const snapshot = toSnapshot(money);
  return snapshot.amount / Math.pow(10, snapshot.scale);
}

/**
 * Safely add two monetary amounts
 * @param a First amount
 * @param b Second amount
 * @param currencyCode Currency code (default: USD)
 * @returns Sum as decimal
 */
export function add(a: number, b: number, currencyCode: Currency = "USD"): number {
  const dineroA = toDinero(a, currencyCode);
  const dineroB = toDinero(b, currencyCode);
  const result = dineroAdd(dineroA, dineroB);
  return fromDinero(result);
}

/**
 * Safely subtract two monetary amounts
 * @param a First amount (minuend)
 * @param b Second amount (subtrahend)
 * @param currencyCode Currency code (default: USD)
 * @returns Difference as decimal
 */
export function subtract(a: number, b: number, currencyCode: Currency = "USD"): number {
  const dineroA = toDinero(a, currencyCode);
  const dineroB = toDinero(b, currencyCode);
  const result = dineroSubtract(dineroA, dineroB);
  return fromDinero(result);
}

/**
 * Safely multiply a monetary amount by a multiplier
 * @param amount Amount to multiply
 * @param multiplier Multiplier (can be decimal, e.g., 0.15 for 15%)
 * @param currencyCode Currency code (default: USD)
 * @returns Product as decimal
 */
export function multiply(amount: number, multiplier: number, currencyCode: Currency = "USD"): number {
  const dineroAmount = toDinero(amount, currencyCode);
  // Use scaled amount for precision
  const scale = Math.max(2, String(multiplier).split('.')[1]?.length || 0);
  const scaledMultiplier = Math.round(multiplier * Math.pow(10, scale));
  const result = dineroMultiply(dineroAmount, { amount: scaledMultiplier, scale });
  return fromDinero(result);
}

/**
 * Compare two monetary amounts
 * @param a First amount
 * @param b Second amount
 * @param currencyCode Currency code (default: USD)
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compare(a: number, b: number, currencyCode: Currency = "USD"): -1 | 0 | 1 {
  const dineroA = toDinero(a, currencyCode);
  const dineroB = toDinero(b, currencyCode);
  
  if (greaterThan(dineroA, dineroB)) return 1;
  if (lessThan(dineroA, dineroB)) return -1;
  return 0;
}

/**
 * Check if two amounts are equal
 */
export function isEqual(a: number, b: number, currencyCode: Currency = "USD"): boolean {
  const dineroA = toDinero(a, currencyCode);
  const dineroB = toDinero(b, currencyCode);
  return equal(dineroA, dineroB);
}

/**
 * Sum an array of amounts
 * @param amounts Array of amounts
 * @param currencyCode Currency code (default: USD)
 * @returns Total as decimal
 */
export function sum(amounts: number[], currencyCode: Currency = "USD"): number {
  if (amounts.length === 0) return 0;
  
  const currency = CURRENCY_MAP[currencyCode] || CURRENCY_MAP.USD;
  const zero = dinero({ amount: 0, currency });
  
  const total = amounts.reduce((acc, amount) => {
    const dineroAmount = toDinero(amount, currencyCode);
    return dineroAdd(acc, dineroAmount);
  }, zero);
  
  return fromDinero(total);
}

/**
 * Convert amount from one currency to another
 * @param amount Amount to convert
 * @param fromCurrency Source currency
 * @param toCurrency Target currency
 * @param exchangeRates Exchange rates object (rates relative to USD base)
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRates: Record<string, number>
): number {
  // If same currency, return original amount
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromCurrencyObj = CURRENCY_MAP[fromCurrency];
  const toCurrencyObj = CURRENCY_MAP[toCurrency];

  // Get the exchange rates - these are relative to the base currency (USD)
  const fromRate = exchangeRates[fromCurrency];
  const toRate = exchangeRates[toCurrency];

  if (!fromRate || !toRate) {
    throw new Error(`Exchange rate not available for ${!fromRate ? fromCurrency : toCurrency}`);
  }

  // If both currencies are supported by Dinero.js, use it for precision
  if (fromCurrencyObj && toCurrencyObj) {
    try {
      // Use a high-precision scale (8 decimal places beyond the currency exponent)
      // This helps maintain precision during conversions
      const highPrecisionScale = fromCurrencyObj.exponent + 8;
      const highPrecisionAmount = Math.round(amount * Math.pow(10, highPrecisionScale));
      
      const dineroAmount = dinero({ 
        amount: highPrecisionAmount, 
        currency: fromCurrencyObj,
        scale: highPrecisionScale
      });

      // Calculate the direct conversion rate: toRate / fromRate
      const directRate = toRate / fromRate;

      // Use maximum precision (16 decimal places) for the rate to minimize rounding errors
      const rateScale = 16;
      const rateAmount = Math.round(directRate * Math.pow(10, rateScale));

      const rateScaled = {
        amount: rateAmount,
        scale: rateScale,
      };

      // Convert to the new currency
      const convertedDinero = dineroConvert(dineroAmount, toCurrencyObj, {
        [toCurrency]: rateScaled,
      });

      return fromDinero(convertedDinero);
    } catch (error) {
      console.warn(`Dinero conversion failed, using simple conversion:`, error);
      // Fall through to simple conversion
    }
  }

  // Simple conversion for currencies not supported by Dinero.js
  const inBaseCurrency = amount / fromRate;
  const inTargetCurrency = inBaseCurrency * toRate;
  
  // Round to reasonable precision to avoid floating point errors
  return Math.round(inTargetCurrency * 100000000) / 100000000;
}

/**
 * Format a monetary amount as a string
 * @param amount Amount to format
 * @param currencyCode Currency code
 * @returns Formatted string
 */
export function formatMoney(amount: number, currencyCode: Currency = "USD"): string {
  if (!Number.isFinite(amount)) {
    amount = 0;
  }

  try {
    const currency = CURRENCY_MAP[currencyCode];

    // If currency is not supported by Dinero.js, use fallback formatting
    if (!currency) {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 2,
      }).format(amount);
    }

    const money = toDinero(amount, currencyCode);

    // Format using toDecimal with a transformer
    const formatted = toDecimal(money, ({ value: decimalValue }) => {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: currency.exponent,
      }).format(Number(decimalValue));
    });

    return formatted;
  } catch (error) {
    console.warn("Failed to format currency", error);
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}