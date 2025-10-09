import { useMemo } from "react";

import { translations, type TranslationKey } from "../i18n/translations";
import { usePreferencesStore } from "../store/preferences";

export const useTranslation = () => {
  const language = usePreferencesStore((state) => state.language);

  const translate = useMemo(() => {
    return (key: TranslationKey): string => translations[language][key];
  }, [language]);

  return {
    t: translate,
    language,
  };
};

