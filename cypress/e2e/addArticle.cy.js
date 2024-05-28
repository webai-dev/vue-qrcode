import { visitLoginPage } from "./utils"

const SidebarSelector = ".sidebar"
const SidebarTouchpointSelector = ".sidebar-nav__item:contains('Touchpoint')"
const DetailsButtonSelector = ".table__row:first button:contains('Details')"
const NameOfFirstRowSelector = ".table__row:first [data-label='name']"
const StoreNameSelector = ".main .content .title"
const AddByEANButtonSelector = "button:contains('Add articles by EAN')"
const InputEANSelector = "input[name=ean]"
const ModalConfirmSelector = "#modal .btn--primary"
const ModalConfirmRemoveSelector = ".modal .btn--destructive"
const TableSelector = "table"
const TableRowSelector = ".table__row:contains('test')"
const TableRowRemoveButtonSelector =
  ".table__row:contains('test') .lc-table-actions svg:first"

const addArticleTest = () => {
  cy.get(SidebarSelector).should("contain", "Touchpoint")
  cy.get(SidebarTouchpointSelector).click()
  cy.get(NameOfFirstRowSelector).then((firstStore) => {
    cy.get(DetailsButtonSelector).click()
    cy.get(StoreNameSelector).should("contain", firstStore.text())
    cy.get(AddByEANButtonSelector).click()
    cy.get(InputEANSelector).type("test")
    cy.get(ModalConfirmSelector).click()
    cy.get(TableSelector).should("contain.text", "test")
    cy.screenshot()
    /* remove test data */
    cy.get(TableRowRemoveButtonSelector).click()
    cy.get(ModalConfirmRemoveSelector).click()
  })
}

describe("add article", () => {
  beforeEach(() => {
    visitLoginPage()
  })

  context("UserEditor and CustomerAdmin can add article", () => {
    it("allows UserEditor to add article", () => {
      cy.loginUserEditor()
      addArticleTest()
      cy.screenshot()
    })

    it("allows CustomerAdmin to add article", () => {
      cy.loginCustomerAdmin()
      addArticleTest()
      cy.screenshot()
    })
  })

  context("UserViewer and Developer can not add articles", () => {
    it("UserViewer should not be able to add articles", () => {
      cy.loginUserViewer()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(NameOfFirstRowSelector).then((firstStore) => {
        cy.get(DetailsButtonSelector).click()
        cy.get(StoreNameSelector).should("contain", firstStore.text())
        cy.get(AddByEANButtonSelector).should("not.exist")
        cy.screenshot()
      })
    })
    it("Developer should not be able to add articles", () => {
      cy.loginDeveloper()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(NameOfFirstRowSelector).then((firstStore) => {
        cy.get(DetailsButtonSelector).click()
        cy.get(StoreNameSelector).should("contain", firstStore.text())
        cy.get(AddByEANButtonSelector).should("not.exist")
        cy.screenshot()
      })
    })
  })

  context("Add article behavior", () => {
    it("should not add an article twice", () => {
      cy.loginUserEditor()
      cy.get(SidebarSelector).should("contain", "Touchpoint")
      cy.get(SidebarTouchpointSelector).click()
      cy.get(DetailsButtonSelector).click()
      cy.get(AddByEANButtonSelector).click()
      cy.get(InputEANSelector).type("test")
      cy.get(ModalConfirmSelector).click()
      cy.get(TableSelector).should("contain.text", "test")
      cy.get(AddByEANButtonSelector).click()
      cy.get(InputEANSelector).type("test")
      cy.get(ModalConfirmSelector).click()
      cy.get(TableSelector).should("contain.text", "test")
      cy.get(TableRowSelector).should("have.length", 1)
      cy.get(TableRowRemoveButtonSelector).click()
      cy.get(ModalConfirmRemoveSelector).click()
    })
  })
})
