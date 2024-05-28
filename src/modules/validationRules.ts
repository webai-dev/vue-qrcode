import {
  required,
  email,
  integer,
  is,
  min,
  max_value,
  regex,
  alpha,
  alpha_num,
  length,
  numeric,
} from "@vee-validate/rules"
import isURL from "validator/lib/isURL"
import { defineRule, configure } from "vee-validate"
import { localize } from "@vee-validate/i18n"
import de from "@vee-validate/i18n/dist/locale/de.json"
import en from "@vee-validate/i18n/dist/locale/en.json"
import es from "@vee-validate/i18n/dist/locale/es.json"
import fr from "@vee-validate/i18n/dist/locale/fr.json"
import it from "@vee-validate/i18n/dist/locale/it.json"
import ru from "@vee-validate/i18n/dist/locale/ru.json"

configure({
  generateMessage: localize({
    de,
    en,
    es,
    fr,
    it,
    ru,
  }),
})

export const rules = () => {
  defineRule("required", required)
  defineRule("email", email)
  defineRule("number", integer)
  defineRule("is", is)
  defineRule("min", min)
  defineRule("maxVal", max_value)
  defineRule("regex", regex)
  defineRule("alpha", alpha)
  defineRule("alpha_num", alpha_num)
  defineRule("length", length)
  defineRule("num", numeric)

  defineRule("hex", (value: string) => {
    if (value === "" || /[\da-f]+/i.test(value)) return true
    return `Darf nur Zahlen und Buchstabend von a - f enthalten`
  })

  defineRule("an_ex", (value: string) => {
    if (value === "" || (/[\w]/g.test(value) && !/[iIlLoO0]/g.test(value))) {
      return true
    }
    return "Muss alphanumerisch sein, ohne i,I,l,L,o,O oder null"
  })

  defineRule("url", (value: string) => {
    if (value === "" || isURL(value)) return true
    return `Keine gültige url`
  })
}
