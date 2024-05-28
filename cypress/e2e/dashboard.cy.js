import { visitLoginPage } from "./utils"

describe("dashboard", () => {
  beforeEach(() => {
    visitLoginPage()
  })

  it("Dashboard have analytics", () => {
    cy.loginSu()
    cy.wait(3000)
    cy.get(".stat h3:first")
      .invoke("text")
      .should("match", /^[0-9]\d*(\.\d+)?$/)
    cy.get(".stat h3:nth(1)")
      .invoke("text")
      .should("match", /^[0-9]\d*(\.\d+)?$/)
    cy.screenshot()
  })
})
