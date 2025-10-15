/**
 * Formatting utilities
 * Delegates to money utilities for currency formatting
 */

import { formatMoney } from "./money";
import type { Currency } from "../store/preferences";

/**
 * Format a currency value
 * @param value The amount to format
 * @param currencyCode The currency code
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currencyCode: Currency = "USD"): string => {
  return formatMoney(value, currencyCode);
};
