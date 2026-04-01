export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    title: 'English',
  },
  {
    code: 'de',
    title: 'Deutsch',
  },
];

export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_KEY = 'language';

export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(
  ({code}) => code,
);
