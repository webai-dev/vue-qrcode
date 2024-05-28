import { i18n } from "~/modules/i18n"

export const TAB = {
  myAccount: {
    key: "my-account",
    text: i18n.global.t("settings.my_account"),
    url: "app.settings.myAccount",
  },
  apiKeys: {
    key: "api-keys",
    text: i18n.global.t("common.api_keys"),
    url: "app.settings.apiKeys",
  },
  urlSettings: {
    key: "url-settings",
    text: i18n.global.t("common.domains"),
    url: "app.settings.urlSettings",
  },
  termsOfUse: {
    key: "terms-of-use",
    text: i18n.global.t("common.terms_of_use"),
    url: "app.settings.terms_of_use",
  },
  billing: {
    key: "billing",
    text: "Billing",
    url: "app.settings.myAccount",
  },
}
