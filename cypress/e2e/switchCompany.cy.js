import { visitLoginPage } from "./utils"

const SidebarHeadlineSelector = ".sidebar-headline"
const SwitchCompanyLinkSelector = ".lc-company-switch-link"
const CompanyItemSelector = ".switch-customer-item:first"

describe("switch company", () => {
  beforeEach(() => {
    cy.clearCookies()
    visitLoginPage()
  })
  context("Switch company not accessible to SuperAdmin", () => {
    it("doesn't render switch company utility to SuperAdmin", () => {
      cy.loginSu()
      cy.get(SwitchCompanyLinkSelector).should("not.exist")
      cy.screenshot()
    })
  })

  context(
    "Access to switch company allowed to non SuperAdmin user if it belongs to many companies",
    () => {
      it("allows a User to switch company", () => {
        cy.loginCompanySwitch()
        cy.get(SidebarHeadlineSelector).then((firstValue) => {
          cy.get(SwitchCompanyLinkSelector).click()
          cy.get(CompanyItemSelector).click()
          cy.get(SidebarHeadlineSelector).should(
            "not.contain",
            firstValue.text(),
          )
          cy.screenshot()
        })
      })
    },
  )

  context(
    "Switch company not accessible to non SuperAdmin user if it belongs to only one company",
    () => {
      it("doesn't render switch company utility to CustomerAdmin if it belongs to one company", () => {
        cy.loginCustomerAdmin()
        cy.get(SwitchCompanyLinkSelector).should("not.exist")
        cy.screenshot()
      })

      it("doesn't render switch company utility to Developer if it belongs to one company", () => {
        cy.loginDeveloper()
        cy.get(SwitchCompanyLinkSelector).should("not.exist")
        cy.screenshot()
      })

      it("doesn't render switch company utility to UserEditor if it belongs to one company", () => {
        cy.loginUserEditor()
        cy.get(SwitchCompanyLinkSelector).should("not.exist")
        cy.screenshot()
      })
    },
  )
})
