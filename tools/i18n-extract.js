const path = require("path")
const fs = require("fs")
const VueI18NExtract = require("vue-i18n-extract")

const EN_LOCALE_PATH = path.resolve(__dirname, "../src/locales/en.json")

VueI18NExtract.createI18NReport({
  vueFiles: path.resolve(__dirname, "../src/**/*.?(ts|vue)"),
  languageFiles: EN_LOCALE_PATH,
  add: true,
  remove: true, // if some translations aren't detected remove this and handle this case manually
  separator: "separatorShouldBeIgnoredBecauseStructureIsFlat", // structure of localisation is flat
}).then(() => {
  const updatedLocale = require(EN_LOCALE_PATH)
  let added = false
  Object.entries(updatedLocale).forEach(([key, value]) => {
    if (value === "") {
      updatedLocale[key] = key
      added = true
    }
  })
  const updatedLocaleOrdered = Object.keys(updatedLocale)
    .sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1)
    .reduce((all, key) => {
      all[key] = updatedLocale[key]
      return all
    }, {})

  if (added) {
    fs.writeFileSync(
      EN_LOCALE_PATH,
      JSON.stringify(updatedLocaleOrdered, null, "  "),
      "utf8",
    )
  }
})
