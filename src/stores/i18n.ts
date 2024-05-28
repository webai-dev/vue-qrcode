import { defineStore } from "pinia"
import {
  getSavedLocale,
  setSavedLocale,
  isSupportedLocale,
} from "~/modules/i18n"
import { DEFAULT_LOCALE } from "~/constants/i18n"
import type { Locale } from "~/constants/i18n"

export const useI18nStore = defineStore("i18n", {
  state: () => ({
    current: getSavedLocale(),
  }),
  actions: {
    /**
     * Provide i18n from the component
     * @param localeName
     */
    setCurrent(localeName: Locale) {
      const newLocale = isSupportedLocale(localeName)
        ? localeName
        : DEFAULT_LOCALE
      setSavedLocale(newLocale)
      this.current = newLocale
    },
  },
})
