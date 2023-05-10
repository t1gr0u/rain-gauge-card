import * as en from './languages/en.json';
import * as fr from './languages/fr.json';
import * as pt from './languages/pt.json';
import * as sl from './languages/sl.json';
import * as nl from './languages/nl.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const languages: any = {
  en: en,
  fr: fr,
  pt: pt,
  sl: sl,
  nl: nl,
};

export const CARD_LANGUAGES = [...Object.keys(languages), ''].sort();

export function getLocalLanguage(): string {
  return (localStorage.getItem('selectedLanguage') || 'en').replace(/['"]+/g, '').replace('-', '_');
}

export function localize(string: string, search = '', replace = '', language = '' ): string {
  let translated: string;

  if (language === '') {
    language = getLocalLanguage();
  }

  try {
    translated = string.split('.').reduce((o, i) => o[i], languages[language]);
  } catch (e) {
    translated = string.split('.').reduce((o, i) => o[i], languages['en']);
  }

  if (translated === undefined) translated = string.split('.').reduce((o, i) => o[i], languages['en']);

  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}