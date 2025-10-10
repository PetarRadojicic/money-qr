import { dinero, toDecimal } from "dinero.js";
import { CURRENCY_MAP } from "../services/currencyConversion";
import type { Currency } from "../store/preferences";

export const formatCurrency = (value: number, currencyCode: Currency = "USD"): string => {
  if (!Number.isFinite(value)) {
    value = 0;
  }

  try {
    // Get the Dinero currency object
    const currency = CURRENCY_MAP[currencyCode];
    
    // Convert decimal value to minor units (e.g., 10.50 -> 1050 cents for USD)
    const minorUnits = Math.round(value * Math.pow(10, currency.exponent));
    
    // Create a Dinero object with the amount in minor units
    const money = dinero({ amount: minorUnits, currency });
    
    // Format using a transformer that uses Intl.NumberFormat
    const formatted = toDecimal(money, ({ value: decimalValue }) => {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 2,
      }).format(Number(decimalValue));
    });
    
    return formatted;
  } catch (error) {
    console.warn("Failed to format currency", error);
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value);
  }
};


