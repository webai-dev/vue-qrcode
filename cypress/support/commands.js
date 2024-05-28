import "cypress-mailslurp"
/* eslint-disable no-unused-expressions */
let stores

Cypress.Commands.add("loginWithApi", (email, password) => {
  cy.visit("/").then(async (window) => {
    stores = window.testStores
    await stores.sessionStore.login({
      email,
      password,
    })
  })
})

Cypress.Commands.add("loginSuWithApi", () =>
  cy.loginWithApi(
    Cypress.env("credentials_superuser_mail"),
    Cypress.env("credentials_superuser_password"),
  ),
)

Cypress.Commands.add("loginCustomerAdminWithApi", () =>
  cy.loginWithApi(
    Cypress.env("credentials_customer_admin_mail"),
    Cypress.env("credentials_customer_admin_password"),
  ),
)

Cypress.Commands.add("loginDeveloperWithApi", () =>
  cy.loginWithApi(
    Cypress.env("credentials_developer_mail"),
    Cypress.env("credentials_developer_password"),
  ),
)

Cypress.Commands.add("loginUserEditorWithApi", () =>
  cy.loginWithApi(
    Cypress.env("credentials_user_editor_mail"),
    Cypress.env("credentials_user_editor_password"),
  ),
)

Cypress.Commands.add("loginUserViewerWithApi", () =>
  cy.loginWithApi(
    Cypress.env("credentials_user_viewer_mail"),
    Cypress.env("credentials_user_viewer_password"),
  ),
)

Cypress.Commands.add("loginCompanySwitchWithApi", () =>
  cy.loginWithApi(
    Cypress.env("credentials_company_switcher_mail"),
    Cypress.env("credentials_company_switcher_password"),
  ),
)

Cypress.Commands.add("loginWith", (email, password, success = true) => {
  expect(email, "email was set").to.be.a("string").and.not.be.empty

  if (typeof password !== "string" || !password || !password.length) {
    throw new Error(
      "Missing password value, set CYPRESS_password in environment",
    )
  }

  cy.get('[name="email"]').type(email)
  cy.get('[name="password"]').type(password, { log: false })
  cy.get('button[type="submit"]').click()

  if (success) {
    cy.get(".loading-prompt-inner").should("exist")
  }

  // Store the session cookie
  cy.getCookie("auth.token").then((cookie) => {
    if (cookie) {
      cy.saveGlobalValue(cookie.name, cookie.value)
      Cypress.Cookies.preserveOnce("auth.token")
    }
  })
})

Cypress.Commands.add("loginSu", () =>
  cy.loginWith(
    Cypress.env("credentials_superuser_mail"),
    Cypress.env("credentials_superuser_password"),
  ),
)

Cypress.Commands.add("loginCustomerAdmin", () =>
  cy.loginWith(
    Cypress.env("credentials_customer_admin_mail"),
    Cypress.env("credentials_customer_admin_password"),
  ),
)

Cypress.Commands.add("loginDeveloper", () =>
  cy.loginWith(
    Cypress.env("credentials_developer_mail"),
    Cypress.env("credentials_developer_password"),
  ),
)

Cypress.Commands.add("loginUserEditor", () =>
  cy.loginWith(
    Cypress.env("credentials_user_editor_mail"),
    Cypress.env("credentials_user_editor_password"),
  ),
)

Cypress.Commands.add("loginUserViewer", () =>
  cy.loginWith(
    Cypress.env("credentials_user_viewer_mail"),
    Cypress.env("credentials_user_viewer_password"),
  ),
)

Cypress.Commands.add("loginCompanySwitch", () =>
  cy.loginWith(
    Cypress.env("credentials_company_switcher_mail"),
    Cypress.env("credentials_company_switcher_password"),
  ),
)

Cypress.Commands.add("saveGlobalValue", (valueName, value) => {
  cy.wrap(value).as(valueName)
  Cypress.env(valueName, value)
})

Cypress.Commands.add("logoutWithApi", () => {
  cy.window().then(async (window) => {
    stores = window.testStores
    await stores.sessionStore.logout()
    cy.location("pathname").should("include", "/login")
  })
})
