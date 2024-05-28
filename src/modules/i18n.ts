import { createI18n } from "vue-i18n"
import { setLocale } from "@vee-validate/i18n"
// Import i18n files
import messages from "@intlify/vite-plugin-vue-i18n/messages"
import type { UserModule } from "~/types/types"
import { localStore } from "~/modules/localStore"
import {
  SUPPORTED_LOCALES,
  LOCALSTORAGE_LOCALE_KEY,
  DEFAULT_LOCALE,
} from "~/constants/i18n"
import type { Locale } from "~/constants/i18n"

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LOCALE,
  fallbackLocale: "en",
  missingWarn: false,
  fallbackWarn: false,
  messages,
})

export const isSupportedLocale = (localeName: Locale) =>
  SUPPORTED_LOCALES.includes(localeName)

export const setSavedLocale = (localeName: Locale) => {
  localStore.set(LOCALSTORAGE_LOCALE_KEY, localeName)
  setLocale(localeName)
  i18n.global.locale.value = localeName
}

/**
 * Obtain saved locale.
 * Update to default, if nos settings found or locale is not supported
 */
export const getSavedLocale = (): Locale => {
  let locale = localStore.get(LOCALSTORAGE_LOCALE_KEY)
  if (!locale || !isSupportedLocale(locale)) {
    locale = DEFAULT_LOCALE
    setSavedLocale(locale)
  }

  return locale
}

export const install: UserModule = ({ app }) => {
  const savedLocale = getSavedLocale()
  i18n.global.locale.value = savedLocale
  setLocale(savedLocale)

  app.use(i18n)
}
