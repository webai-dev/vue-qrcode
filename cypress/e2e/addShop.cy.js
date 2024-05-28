import { visitLoginPage } from "./utils"

const SidebarSelector = ".sidebar"
const SidebarTouchpointSelector = ".sidebar-nav__item:contains('Touchpoint')"
const AddTouchPointButtonSelector = ".header button:contains('Add Location')"
const LcSelectSelector = ".vs__search"
const LcSelectOptionSelector = "#vs1__option-222"
const LocationNameInputSelector = "input[name='name']"
const LocationlocationIdInputSelector = "input[name='locationId']"
const ModalConfirmSelector = ".modal form .btn--primary"
const ModalConfirmRemoveSelector = ".modal .btn--destructive"
const RemoveButtonSelector =
  ".table__row:contains('test') .lc-table-actions svg:first"

describe("add shop", () => {
  beforeEach(() => {
    cy.clearCookies()
    visitLoginPage()
  })

  context("Admin can't access Touchpoint", () => {
    it("doesn't render shop menu for super admin", () => {
      cy.loginSu()
      cy.get(SidebarSelector).should("not.contain", "Touchpoint")
      cy.screenshot()
    })
  })

  context("Developer and UserViewer can't add location", () => {
    it("renders shop menu for Developer but doesn't allow adding new location", () => {
      cy.loginDeveloper()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(AddTouchPointButtonSelector).should("not.exist")
      cy.screenshot()
    })

    it("renders shop menu for UserViewer but doesn't allow adding new location", () => {
      cy.loginUserViewer()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(AddTouchPointButtonSelector).should("not.exist")
      cy.screenshot()
    })
  })

  context("UserEditor and CustomerAdmin can add location", () => {
    it("allows UserEditor to add new location", () => {
      cy.loginUserEditor()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(AddTouchPointButtonSelector).should("exist")
      cy.get(AddTouchPointButtonSelector).click()
      cy.get(LcSelectSelector).click()
      cy.get(LcSelectOptionSelector).click()
      cy.get(LocationNameInputSelector).type("test")
      cy.get(LocationlocationIdInputSelector).type("test")
      cy.get(ModalConfirmSelector).click()
      cy.get(RemoveButtonSelector).click()
      cy.get(ModalConfirmRemoveSelector).click()
      cy.screenshot()
    })

    it("allows CustomerAdmin to add new location", () => {
      cy.loginCustomerAdmin()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(AddTouchPointButtonSelector).should("exist")
      cy.get(AddTouchPointButtonSelector).click()
      cy.get(LcSelectSelector).click()
      cy.get(LcSelectOptionSelector).click()
      cy.get(LocationNameInputSelector).type("test")
      cy.get(LocationlocationIdInputSelector).type("test")
      cy.get(ModalConfirmSelector).click()
      cy.get(RemoveButtonSelector).click()
      cy.get(ModalConfirmRemoveSelector).click()
      cy.screenshot()
    })
  })

  context("all fields are required on add location", () => {
    it("doesn't allow adding location with empty loactionId", () => {
      cy.loginUserEditor()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(AddTouchPointButtonSelector).should("exist")
      cy.get(AddTouchPointButtonSelector).click()
      cy.get(LcSelectSelector).click()
      cy.get(LcSelectOptionSelector).click()
      cy.get(LocationNameInputSelector).type("test")
      cy.get(ModalConfirmSelector).click()
      cy.get(".toast-body").should("be.visible")
      cy.get(".toast-body").should("contain", "Could not create new location")
      cy.screenshot()
    })

    it("doesn't allow adding location with empty loactionName", () => {
      cy.loginUserEditor()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(AddTouchPointButtonSelector).should("exist")
      cy.get(AddTouchPointButtonSelector).click()
      cy.get(LcSelectSelector).click()
      cy.get(LcSelectOptionSelector).click()
      cy.get(LocationlocationIdInputSelector).type("test")
      cy.get(ModalConfirmSelector).click()
      cy.get(".toast-body").should("be.visible")
      cy.get(".toast-body").should("contain", "Could not create new location")
      cy.screenshot()
    })

    it("doesn't allow adding location with empty country", () => {
      cy.loginUserEditor()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(AddTouchPointButtonSelector).should("exist")
      cy.get(AddTouchPointButtonSelector).click()
      cy.get(LocationNameInputSelector).type("test")
      cy.get(LocationlocationIdInputSelector).type("test")
      cy.get(ModalConfirmSelector).click()
      cy.get(".toast-body").should("be.visible")
      cy.get(".toast-body").should("contain", "Could not create new location")
      cy.screenshot()
    })
  })
})
