import { visitLoginPage } from "./utils"

describe("companies", () => {
  beforeEach(() => {
    visitLoginPage()
  })

  it("A super admin access settings", () => {
    cy.loginSu()
    cy.wait(1000)
    cy.visit("app/settings/my-account")
    cy.wait(1000)
    cy.screenshot()
  })
})
