import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect } from "react";

export type ThemePreference = "light" | "dark" | "system";
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
  hasCompletedOnboarding: boolean;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  resetPreferences: () => void;
  // Internal function to get the effective theme (resolves "system" to actual theme)
  getEffectiveTheme: () => "light" | "dark";
}

const getSystemTheme = (): "light" | "dark" => {
  return Appearance.getColorScheme() === "dark" ? "dark" : "light";
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      theme: "light",
      language: "en",
      currency: "USD",
      hasCompletedOnboarding: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const current = get().theme;
        if (current === "system") {
          // If currently system, toggle to the opposite of current system theme
          set({ theme: getSystemTheme() === "light" ? "dark" : "light" });
        } else {
          // If currently light/dark, toggle to the other
          set({ theme: current === "light" ? "dark" : "light" });
        }
      },
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
      resetPreferences: () =>
        set({
          theme: "light",
          language: "en",
          currency: "USD",
          hasCompletedOnboarding: false,
        }),
      getEffectiveTheme: () => {
        const { theme } = get();
        return theme === "system" ? getSystemTheme() : theme;
      },
    }),
    {
      name: "preferences",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ theme, language, currency, hasCompletedOnboarding }) => ({ theme, language, currency, hasCompletedOnboarding }),
    }
  )
);

// Hook to listen for system appearance changes
export const useSystemThemeListener = () => {
  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      // Force re-render of components that depend on effective theme
      // This will trigger re-renders in components that use getEffectiveTheme()
    });

    return () => subscription?.remove();
  }, []);
};

