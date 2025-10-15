import { useCallback } from "react";

import { translations, type TranslationKey } from "../i18n/translations";
import { usePreferencesStore } from "../store/preferences";

type TranslationParams = Record<string, string | number>;

export const useTranslation = () => {
  const language = usePreferencesStore((state) => state.language);

  const translate = useCallback(
    (key: TranslationKey, params?: TranslationParams): string => {
      // Handle pluralization
      if (params?.count !== undefined) {
        const count = Number(params.count);
        let pluralKey: TranslationKey;
        
        if (language === 'sr') {
          // Serbian pluralization rules for transactions
          if (count === 1) {
            pluralKey = `${key}_one` as TranslationKey;
          } else if (count >= 2 && count <= 4) {
            pluralKey = `${key}_few` as TranslationKey;
          } else {
            pluralKey = `${key}_other` as TranslationKey;
          }
        } else {
          // English pluralization rules
          if (count === 1) {
            pluralKey = `${key}_one` as TranslationKey;
          } else {
            pluralKey = `${key}_other` as TranslationKey;
          }
        }
        
        const template = translations[language][pluralKey] ?? translations[language][key] ?? key;
        
        return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, token: keyof TranslationParams) => {
          const replacement = params[token];
          return replacement !== undefined ? String(replacement) : "";
        });
      }

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

