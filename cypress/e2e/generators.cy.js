import { visitLoginPage } from "./utils"

const lcGeneratorProjectActionsSelector = '[data-cy="project-actions"]'
const lcGeneratorEditBtnSelector = '[data-cy="project-actions-edit"]'
const lcGeneratorContextMenuSelector = '[data-cy="project-actions-menu"]'
const lcGeneratorProjectDeleteDialogSelector =
  '[data-cy="project-delete-dialog"]'
const lcGeneratorProjectEditTitleBtnSelector = '[data-cy="edit-title"]'
const lcGeneratorProjectEditTitleInputSelector = '[name="name"]'
const lcGeneratorOverlayCloseSelector = '[data-cy="close"]'

const createGeneratorProject = (name) => {
  cy.contains("Add project").click()
  cy.get(lcGeneratorProjectEditTitleBtnSelector).click()
  cy.get(lcGeneratorProjectEditTitleInputSelector).clear()
  cy.wait(500)
  cy.get(lcGeneratorProjectEditTitleInputSelector).type(name)
  cy.wait(1000)
  cy.get(lcGeneratorOverlayCloseSelector).click()
}

const deleteLastGeneratorProject = (count = 1) => {
  for (let i = count; i > 0; i--) {
    cy.wait(1000)
    cy.get(lcGeneratorContextMenuSelector).first().click()
    cy.contains("Delete Id Project").click()
    cy.contains("Delete project").click()
    cy.wait(1000)
  }
}

describe("generators overview page", () => {
  beforeEach(() => {
    visitLoginPage()
    cy.loginUserEditor()
    cy.wait(1000)
    cy.visit("app/generator")
    cy.wait(1000)
  })

  it.skip("can be accessed by UserEditor", () => {
    expect(cy.contains("ID Projects")).to.exist
    cy.screenshot()
  })

  describe("generators CRUD", () => {
    it.skip("allows to create new project", () => {
      createGeneratorProject("Test Project CREATE")
      expect(cy.contains("Test Project CREATE")).to.exist
      cy.screenshot()
      deleteLastGeneratorProject()
    })

    it.skip("contains a list of projects", () => {
      createGeneratorProject("Test Project LIST 1")
      createGeneratorProject("Test Project LIST 2")
      cy.wait(1000)
      expect(cy.contains("Test Project LIST 1")).to.exist
      expect(cy.contains("Test Project LIST 2")).to.exist
      cy.screenshot()
      deleteLastGeneratorProject(2)
    })

    it.skip("allows to generate new set for each project", () => {
      createGeneratorProject("Test Project GENERATE SET")
      cy.wait(1000)
      cy.contains("Test Project GENERATE SET")
        .parent()
        .siblings(lcGeneratorProjectActionsSelector)
        .contains("Add Set")
        .click()
      expect(cy.contains("Add set")).to.exist
      cy.screenshot()
      cy.get(lcGeneratorOverlayCloseSelector).click()
      cy.wait(500)
      deleteLastGeneratorProject()
    })

    it.skip("allows to update project", () => {
      createGeneratorProject("Test Project UPDATE")

      cy.contains("Test Project UPDATE")
        .parent()
        .siblings(lcGeneratorProjectActionsSelector)
        .find(lcGeneratorEditBtnSelector)
        .click()

      cy.screenshot()
      cy.get(lcGeneratorProjectEditTitleBtnSelector).click()
      cy.get(lcGeneratorProjectEditTitleInputSelector).clear()

      cy.wait(500)
      cy.get(lcGeneratorProjectEditTitleInputSelector).type(
        "Project with updated name",
      )
      cy.contains("Save").click()
      cy.wait(500)
      expect(cy.contains("Project with updated name")).to.exist
      deleteLastGeneratorProject()
    })

    it.skip("allows to delete project", () => {
      createGeneratorProject("Test Project DELETE")
      cy.wait(1000)

      cy.contains("Test Project DELETE")
        .parent()
        .siblings(lcGeneratorProjectActionsSelector)
        .find(lcGeneratorContextMenuSelector)
        .click()
      cy.wait(1000)
      cy.contains("Delete Id Project").click()
      cy.wait(1000)
      cy.get(lcGeneratorProjectDeleteDialogSelector).should("be.visible")
      cy.screenshot()

      cy.contains("Delete project").click()
      cy.wait(1000)
      cy.contains("Test Project DELETE").should("not.exist")
    })
  })
})
