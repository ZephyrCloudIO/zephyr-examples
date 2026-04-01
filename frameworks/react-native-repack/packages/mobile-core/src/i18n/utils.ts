import * as RNLocalize from 'react-native-localize';

import {DEFAULT_LANGUAGE, SUPPORTED_LANGUAGE_CODES} from './constants.ts';

export const selectSupportedLanguage = (language: string | null) =>
  language && SUPPORTED_LANGUAGE_CODES.includes(language)
    ? language
    : DEFAULT_LANGUAGE;

export const systemLanguage = () => RNLocalize.getLocales()[0].languageCode;
