import { defineConfig } from "cypress"
import dotenv from "dotenv"

dotenv.config()

export default defineConfig({
  viewportHeight: 1200,
  viewportWidth: 1600,
  defaultCommandTimeout: 4000,
  e2e: {
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser: any = {}, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push(
            "--use-file-for-fake-video-capture=cypress/support/cam/barcodevideo.y4m",
          )
        }
        return launchOptions
      })
      return require("./cypress/plugins/index.js")(on, config)
    },
    baseUrl: "http://localhost:3000",
  },
  component: {
    setupNodeEvents(on, config) {},
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
    specPattern: "cypress/components/*.*",
  },
  env: {
    credentials_superuser_mail: process.env.CYPRESS_CREDENTIALS_SUPERUSER_MAIL,
    credentials_superuser_password:
      process.env.CYPRESS_CREDENTIALS_SUPERUSER_PASSWORD,
    credentials_customer_admin_mail:
      process.env.CYPRESS_CREDENTIALS_CUSTOMER_ADMIN_MAIL,
    credentials_customer_admin_password:
      process.env.CYPRESS_CREDENTIALS_CUSTOMER_ADMIN_PASSWORD,
    credentials_developer_mail: process.env.CYPRESS_CREDENTIALS_DEVELOPER_MAIL,
    credentials_developer_password:
      process.env.CYPRESS_CREDENTIALS_DEVELOPER_PASSWORD,
    credentials_user_editor_mail:
      process.env.CYPRESS_CREDENTIALS_USER_EDITOR_MAIL,
    credentials_user_editor_password:
      process.env.CYPRESS_CREDENTIALS_USER_EDITOR_PASSWORD,
    credentials_user_viewer_mail:
      process.env.CYPRESS_CREDENTIALS_USER_VIEWER_MAIL,
    credentials_user_viewer_password:
      process.env.CYPRESS_CREDENTIALS_USER_VIEWER_PASSWORD,
    credentials_company_switcher_mail:
      process.env.CYPRESS_CREDENTIALS_COMPANY_SWITCHER_MAIL,
    credentials_company_switcher_password:
      process.env.CYPRESS_CREDENTIALS_COMPANY_SWITCHER_PASSWORD,
    MAILSLURP_API_KEY: process.env.CYPRESS_MAILSLURP_API_KEY,
  },
})
