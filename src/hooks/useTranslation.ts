import { useCallback } from "react";

import { translations, type TranslationKey } from "../i18n/translations";
import { usePreferencesStore } from "../store/preferences";

type TranslationParams = Record<string, string | number>;

export const useTranslation = () => {
  const language = usePreferencesStore((state) => state.language);

  const translate = useCallback(
    (key: TranslationKey, params?: TranslationParams): string => {
      const template = translations[language][key] ?? key;

      if (!params) {
        return template;
      }

      return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, token: keyof TranslationParams) => {
        const replacement = params[token];
        return replacement !== undefined ? String(replacement) : "";
      });
    },
    [language]
  );

  return {
    t: translate,
    language,
  };
};

export type TranslateFunction = ReturnType<typeof useTranslation>["t"];

