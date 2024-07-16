import * as cs from './languages/cs.json';
import * as de from './languages/de.json';
import * as en from './languages/en.json';
import * as fr from './languages/fr.json';
import * as it from './languages/it.json';
import * as nl from './languages/nl.json';
import * as pt from './languages/pt.json';
import * as sk from './languages/sk.json';
import * as sl from './languages/sl.json';
import * as sv from './languages/sv.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const languages: any = {
  cs: cs,
  de: de,
  en: en,
  fr: fr,
  it: it,
  nl: nl,
  pt: pt,
  sk: sk,
  sl: sl,
  sv: sv,
  pl: pl,
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
