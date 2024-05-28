export enum Locale {
  EN = "en",
  DE = "de",
  ES = "es",
  FR = "fr",
  IT = "it",
  RU = "ru",
}

export const DEFAULT_LOCALE = Locale.DE
// German, English, Russian, French, Italian, Spanish
export const SUPPORTED_LOCALES = [
  Locale.DE,
  Locale.EN,
  Locale.ES,
  Locale.FR,
  Locale.IT,
  Locale.RU,
]
export const LOCALSTORAGE_LOCALE_KEY = "locale"

export const LOCALE_TO_LANG_NAME = {
  [Locale.DE]: "Deutsch",
  [Locale.EN]: "English",
  [Locale.ES]: "Español",
  [Locale.FR]: "Français",
  [Locale.IT]: "Italiano",
  [Locale.RU]: "Русский",
}
