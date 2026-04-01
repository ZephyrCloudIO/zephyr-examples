import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';

import {DEFAULT_LANGUAGE, SUPPORTED_LANGUAGE_CODES} from './constants.ts';
import {translations} from './translations';

void i18next.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: translations,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGE_CODES,
  interpolation: {
    escapeValue: false,
  },
  fallbackNS: 'common',
  simplifyPluralSuffix: false,
});

export default i18next;
