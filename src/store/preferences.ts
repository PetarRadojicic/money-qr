import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark";
export type Language = "en" | "sr";

interface PreferencesState {
  theme: ThemePreference;
  language: Language;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      theme: Appearance.getColorScheme() === "dark" ? "dark" : "light",
      language: "en",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set(({ theme }) => ({ theme: theme === "light" ? "dark" : "light" })),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "preferences",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ theme, language }) => ({ theme, language }),
    }
  )
);

