export const SUPPORTED_LOCALES = [
  'en',
  'ru',
  'es',
  'fr',
  'ar',
  'hi',
  'pt-BR',
  'id',
  'ms',
  'tr',
  'zh-CN',
] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية',
  hi: 'हिन्दी',
  'pt-BR': 'Português',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  tr: 'Türkçe',
  'zh-CN': '中文',
}

export const INTERFACE_LANGUAGE_LABEL: Record<Locale, string> = {
  en: 'Language',
  ru: 'Язык',
  es: 'Idioma',
  fr: 'Langue',
  ar: 'اللغة',
  hi: 'भाषा',
  'pt-BR': 'Idioma',
  id: 'Bahasa',
  ms: 'Bahasa',
  tr: 'Dil',
  'zh-CN': '语言',
}
