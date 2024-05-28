import * as deLocale from "~/locales/de.json"
import * as enLocale from "~/locales/en.json"

const allLabelsPageSelector = "[data-cy='all-labels']"
const generateIdsSelector = "[data-cy='generate-ids']"
const idPartFormItemSelector = "[data-cy='id-part-form-item']"
const idPartPreviewItemSelector = "[data-cy='id-part-preview-item']"
const projectListItemSelector = "[data-cy='project-list-item']"
const amountExportFieldSelector = "input[name='amount']"
const perExportedExportFieldSelector = "input[name='per-exported']"
const projectNameExportFieldSelector = "input[name='project-name']"
const inProcessAnimationSelector = "[data-cy='in-process-animation']"
const tableRowSelector = "[data-cy='table-row']"

const CURRENT_LOCALE = "de"
const locale = CURRENT_LOCALE === "de" ? deLocale : enLocale
const allLabelsPageUrl = "/app/generator"

const data = {
  projectName: "E2E - Create serial numbers",
}

const getIdPartPreviewItemText = (index) => `ID Part #${index}`

describe("Create serial numbers as customer admin", () => {
  it("should be created successfully", () => {
    cy.loginCustomerAdminWithApi()

    // navigate to add label page
    cy.visit(allLabelsPageUrl)
    cy.contains(locale.navbar.add_label, { timeout: 10000 }).click()
    cy.get(generateIdsSelector).click()

    // check default values
    cy.get(idPartFormItemSelector).should("have.length", 1)
    cy.get(idPartPreviewItemSelector)
      .should("have.length", 1)
      .and("contain", getIdPartPreviewItemText(1))
    cy.get(amountExportFieldSelector).should("have.value", "100.000")
    cy.get(perExportedExportFieldSelector).should("have.value", "100.000")
    cy.get(projectNameExportFieldSelector).should(
      "have.value",
      locale.generator.default_project_name,
    )
    cy.screenshot()

    // add one more id part
    cy.get("button").contains("Add ID part").click()
    cy.get(idPartFormItemSelector).should("have.length", 2)
    cy.get(idPartPreviewItemSelector)
      .should("have.length", 2)
      .last()
      .should("contain", getIdPartPreviewItemText(2))
    cy.screenshot()

    cy.get(projectNameExportFieldSelector).clear().type(data.projectName)
    cy.get("button").contains("Create").click()

    cy.get(inProcessAnimationSelector).should("be.visible")
    cy.screenshot()

    // navigate to all labels page
    cy.get("button").contains(locale.common.continue).click()
    cy.location("pathname").should("include", allLabelsPageUrl)
    cy.get(allLabelsPageSelector).should("be.visible")

    // check that the created project is on the list
    cy.get(projectListItemSelector).should("contain", data.projectName)
    cy.contains(data.projectName)
      .parents(projectListItemSelector)
      .find(tableRowSelector)
      .should("have.length", 1)
    cy.screenshot()

    cy.logoutWithApi()
  })
})
