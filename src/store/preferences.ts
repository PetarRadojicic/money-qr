import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark";
export type Language = "en" | "sr";
export type Currency = 
  | "USD" | "AED" | "AFN" | "ALL" | "AMD" | "ANG" | "AOA" | "ARS" | "AUD" | "AWG"
  | "AZN" | "BAM" | "BBD" | "BDT" | "BGN" | "BHD" | "BIF" | "BMD" | "BND" | "BOB"
  | "BRL" | "BSD" | "BTN" | "BWP" | "BYN" | "BZD" | "CAD" | "CDF" | "CHF" | "CLP"
  | "CNY" | "COP" | "CRC" | "CUP" | "CVE" | "CZK" | "DJF" | "DKK" | "DOP" | "DZD"
  | "EGP" | "ERN" | "ETB" | "EUR" | "FJD" | "FKP" | "FOK" | "GBP" | "GEL" | "GGP"
  | "GHS" | "GIP" | "GMD" | "GNF" | "GTQ" | "GYD" | "HKD" | "HNL" | "HRK" | "HTG"
  | "HUF" | "IDR" | "ILS" | "IMP" | "INR" | "IQD" | "IRR" | "ISK" | "JEP" | "JMD"
  | "JOD" | "JPY" | "KES" | "KGS" | "KHR" | "KID" | "KMF" | "KRW" | "KWD" | "KYD"
  | "KZT" | "LAK" | "LBP" | "LKR" | "LRD" | "LSL" | "LYD" | "MAD" | "MDL" | "MGA"
  | "MKD" | "MMK" | "MNT" | "MOP" | "MRU" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR"
  | "MZN" | "NAD" | "NGN" | "NIO" | "NOK" | "NPR" | "NZD" | "OMR" | "PAB" | "PEN"
  | "PGK" | "PHP" | "PKR" | "PLN" | "PYG" | "QAR" | "RON" | "RSD" | "RUB" | "RWF"
  | "SAR" | "SBD" | "SCR" | "SDG" | "SEK" | "SGD" | "SHP" | "SLE" | "SLL" | "SOS"
  | "SRD" | "SSP" | "STN" | "SYP" | "SZL" | "THB" | "TJS" | "TMT" | "TND" | "TOP"
  | "TRY" | "TTD" | "TVD" | "TWD" | "TZS" | "UAH" | "UGX" | "UYU" | "UZS" | "VES"
  | "VND" | "VUV" | "WST" | "XAF" | "XCD" | "XCG" | "XDR" | "XOF" | "XPF" | "YER"
  | "ZAR" | "ZMW" | "ZWL";

interface PreferencesState {
  theme: ThemePreference;
  language: Language;
  currency: Currency;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;
  resetPreferences: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      theme: Appearance.getColorScheme() === "dark" ? "dark" : "light",
      language: "en",
      currency: "USD",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set(({ theme }) => ({ theme: theme === "light" ? "dark" : "light" })),
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      resetPreferences: () =>
        set({
          theme: Appearance.getColorScheme() === "dark" ? "dark" : "light",
          language: "en",
          currency: "USD",
        }),
    }),
    {
      name: "preferences",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ theme, language, currency }) => ({ theme, language, currency }),
    }
  )
);

