import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import {storage} from '../../utils/mmkvStorage';
import {DEFAULT_LANGUAGE, LANGUAGE_KEY} from '../constants';
import i18next from '../i18n';
import {selectSupportedLanguage, systemLanguage} from '../utils';

interface LocalizationContextProviderProps {
  children?: ReactNode;
}

type LocalizationContextType = {
  language: string;
  updateLanguage: (languageCode: string) => void;
};

const INITIAL_LOCALIZATION_CONTEXT = {
  language: DEFAULT_LANGUAGE,
  updateLanguage: () => {},
};

export const LocalizationContext = createContext<LocalizationContextType>(
  INITIAL_LOCALIZATION_CONTEXT,
);

export const LocalizationContextProvider = ({
  children,
}: LocalizationContextProviderProps) => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  const setI18nLanguage = async (i18nLanguage?: string | null) => {
    const resolvedLanguage = selectSupportedLanguage(
      i18nLanguage || systemLanguage(),
    );

    setLanguage(resolvedLanguage);
    await i18next.changeLanguage(resolvedLanguage);
  };

  const setupLanguage = useCallback(async () => {
    const savedLanguage = storage.getString(LANGUAGE_KEY);
    await setI18nLanguage(savedLanguage);
  }, []);

  const updateLanguage = async (languageCode: string) => {
    await setI18nLanguage(languageCode);
    storage.set(LANGUAGE_KEY, languageCode);
  };

  useEffect(() => {
    void setupLanguage();
  }, [setupLanguage]);

  return (
    <LocalizationContext.Provider
      value={{
        language,
        updateLanguage,
      }}>
      {children}
    </LocalizationContext.Provider>
  );
};
