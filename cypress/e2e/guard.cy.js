import { visitLoginPage } from "./utils"

describe("guard", () => {
  beforeEach(() => {
    visitLoginPage()
  })

  it("guard doesn't allow unauthenticated user to access dashboard", () => {
    cy.wait(1000)
    cy.visit("app/dashboard")
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/login")
    })
    cy.screenshot()
  })

  it("guard doesn't allow unauthenticated user to access custumers", () => {
    cy.wait(1000)
    cy.visit("app/dashboard")
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/login")
    })
    cy.screenshot()
  })

  it("guard doesn't allow unauthenticated user to access settings", () => {
    cy.wait(1000)
    cy.visit("app/settings/my-account")
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/login")
    })
    cy.screenshot()
  })
})
