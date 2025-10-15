/**
 * Currency conversion service
 * Handles fetching exchange rates and converting financial data between currencies
 */

import { API_BASE_URL } from "@env";
import { FALLBACK_EXCHANGE_RATES } from "../constants/exchangeRates";
import { convertCurrency } from "../utils/money";
import type { Currency as CurrencyType } from "../store/preferences";
import type { Transaction } from "../store/finance";

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
  // If same currency, return unchanged
  if (oldCurrency === newCurrency) {
    return { totalBalance, monthlyData, transactions };
  }

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
  };
}
