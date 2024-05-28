import { visitLoginPage } from "./utils"

const ViewPort = "iphone-6"

const ToggleMenuButtonSelector = ".hamburger-wrapper"
const SidebarSelector = ".sidebar"
const SidebarTouchpointSelector = ".sidebar-nav__item:contains('Touchpoint')"
const TouchpointDetailsButtonSelector =
  ".table__row:first button:contains('Details')"
const ScanButtonSelector = "button:contains('Scan')"
const ScannerCloseButtonSelector = "#modal .scanner-close-button button"
const TestRowSelector = ".table__row:contains('123456789012')"
const TestRowRemoveButtonSelector =
  ".table__row:contains('123456789012') .lc-table-actions svg:first"
const ModalConfirmRemoveSelector = ".btn--destructive:contains('Delete')"
const ScanDeleteButtonSelector = ".delete-button"

const testscan = () => {
  cy.wait(2000)
  cy.get(ToggleMenuButtonSelector).click()
  cy.get(SidebarSelector).should("contain", "Touchpoint")
  cy.get(SidebarTouchpointSelector).click()
  cy.get(TouchpointDetailsButtonSelector).click()
  cy.wait(1000)
  cy.get(ScanButtonSelector).should("exist")
  cy.get(ScanButtonSelector).click()
  cy.wait(4000)
  cy.get(ScannerCloseButtonSelector).click()
  // the support video file contains a generated barcode of 123456789012
  cy.get(TestRowSelector).should("exist")
  cy.screenshot()
  // remove test data
  cy.get(TestRowRemoveButtonSelector).click()
  cy.get(ModalConfirmRemoveSelector).click({ force: true })
  cy.wait(1000)
}

describe("scan barcode", () => {
  beforeEach(() => {
    // disabling the error thrown when switching from a test to another caused by unclosing camera
    Cypress.on("uncaught:exception", (err, runnable, promise) => {
      if (promise) {
        return false
      }
    })
    cy.clearCookies()
    cy.viewport(ViewPort)
    visitLoginPage()
    cy.wait(3000)
  })

  context("CustomerAdmin, UserEditor can add article by scan", () => {
    it("allows a CustomerAdmin can add an article by scanning barcode", () => {
      cy.loginCustomerAdmin()
      testscan()
    })

    it("allows a UserEditor can add an article by scanning barcode", () => {
      cy.loginUserEditor()
      testscan()
    })
  })

  context("Developer, SuperAdmin, UserViewer can't access scan", () => {
    it("doesn't allow a Developer to access scan", () => {
      cy.loginDeveloper()
      cy.wait(2000)
      cy.get(ToggleMenuButtonSelector).click()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(ScanButtonSelector).should("not.exist")
    })

    it("doesn't allow a SuperAdmin to access scan", () => {
      cy.loginSu()
      cy.wait(2000)
      cy.get(ToggleMenuButtonSelector).click()
      cy.get(SidebarSelector).should("not.contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).should("not.exist")
    })

    it("doesn't allow a UserViewer to access scan", () => {
      cy.loginUserViewer()
      cy.wait(2000)
      cy.get(ToggleMenuButtonSelector).click()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(ScanButtonSelector).should("not.exist")
    })
  })

  context("Scan Behavior", () => {
    it("should not allow a product to be added if it already exist", () => {
      cy.loginUserEditor()
      cy.wait(2000)
      cy.get(ToggleMenuButtonSelector).click()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(TouchpointDetailsButtonSelector).click()
      cy.wait(1000)
      // add the article for the first time
      cy.get(ScanButtonSelector).should("exist")
      cy.get(ScanButtonSelector).click()
      cy.wait(3000)
      cy.get(ScannerCloseButtonSelector).click()
      cy.get(TestRowSelector).should("exist")
      // add the article for the second time
      cy.get(ScanButtonSelector).should("exist")
      cy.get(ScanButtonSelector).click()
      cy.wait(3000)
      cy.get(ScanDeleteButtonSelector).should("exist")
      cy.get(ScannerCloseButtonSelector).click()
      cy.get(TestRowSelector).should("have.length", 1)
      cy.get(TestRowSelector).should("exist")
      // add the article for the third time
      cy.get(ScanButtonSelector).should("exist")
      cy.get(ScanButtonSelector).click()
      cy.wait(3000)
      cy.get(ScannerCloseButtonSelector).click()
      cy.get(TestRowSelector).should("have.length", 1)
    })
  })
})
