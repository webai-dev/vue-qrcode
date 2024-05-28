const generateIdsSelector = '[data-cy="generate-ids"]'
const lcGeneratorSettingFormItemSelector = ".lc-generator-setting-form-item"
const lcGeneratorSettingFormItemInputSelector = "input[name='Start value']"
const lcGeneratorSettingOverviewPartSelector =
  ".lc-generator-setting-overview-id-part"
const lcGeneratorSettingFormDeleteButton =
  ".lc-generator-setting-form-item-delete-icon"
const lcFormItemDropdownSelector = ".vs__selected"
const lcGeneratorAmountInputSelector = "input[name='Amount']"

const addIdPart = (idx, val, clickOutside = true) => {
  cy.get(lcGeneratorSettingFormItemInputSelector).eq(idx).should("be.visible")
  cy.get(lcGeneratorSettingFormItemInputSelector).eq(idx).click()
  cy.get(lcGeneratorSettingFormItemInputSelector).eq(idx).type(val)
  clickOutside && cy.get("body").click(0, 0)
}

const addIdPartAndAssertPartFilled = (idx, val) => {
  addIdPart(idx, val)
  cy.get(lcGeneratorSettingOverviewPartSelector)
    .eq(idx)
    .contains(val)
    .should("be.visible")
}

let stores
let testProjectIds = []

const deletePreviousTestProjects = async () => {
  testProjectIds = await testProjectIds.reduce(
    async (projectIds, projectId) => {
      try {
        if (!stores.sessionStore.getSelectedCustomerId) {
          await stores.sessionStore.loadCurrentUser()
        }

        await stores.generatorStore.deleteProject({
          customerId: stores.sessionStore.getSelectedCustomerId,
          projectId,
        })
        return projectIds.filter((id) => id !== projectId)
      } catch (e) {
        return [...projectIds, projectId]
      }
    },
    testProjectIds,
  )
}

describe("generators creating id page", () => {
  after(async () => {
    await deletePreviousTestProjects()
  })

  beforeEach(() => {
    cy.loginUserEditorWithApi()
    cy.visit("app/generator").then(async (window) => {
      stores = window.testStores

      await deletePreviousTestProjects()

      cy.intercept("/api/customers/*/generator/projects").as("createProject")

      //  Add project
      cy.contains("Add project").click()

      cy.wait("@createProject").should(({ request }) => {
        expect(request.method).to.equal("POST")

        // remember project ids to remove
        testProjectIds = [
          ...new Set([
            ...testProjectIds,
            ...(stores.generatorStore.getProjectId
              ? [stores.generatorStore.getProjectId]
              : []),
          ]),
        ]
      })
    })
  })

  it("Opens create new project page when clicking create project button", () => {
    cy.contains("Create").should("be.visible")
    cy.get(generateIdsSelector).should("be.visible")
  })

  describe("generators creating id flow", () => {
    beforeEach(() => {
      cy.get(generateIdsSelector).click()
    })

    it("opens generate new ids page when clicking ids on create new project page", () => {
      cy.contains("Generate new IDs").should("be.visible")
    })

    it("cancel button redirects back to generator projects page", () => {
      cy.contains("Generate new IDs").should("be.visible")
      cy.contains("Cancel").click()
      cy.contains("ID Projects").should("be.visible")
    })

    it("adds id part item when clickin add id part button", () => {
      cy.get(lcGeneratorSettingFormItemSelector).should("have.length", 1)
      cy.contains("Add ID part").click()
      cy.get(lcGeneratorSettingFormItemSelector).should("have.length", 2)
    })

    it.skip("shows error message if trying to click next without creating an id part", () => {
      cy.contains("Next").click()
      cy.contains("Please provide at least one ID setting").should("be.visible")
    })

    it("fills in part preview when item is defined", () => {
      cy.intercept(
        "POST",
        "api/customers/*/generator/projects/*/settings/id/parts",
      ).as("addIdPart")
      addIdPartAndAssertPartFilled(0, "123")
      cy.contains("Add ID part").click()
      cy.wait("@addIdPart")
      addIdPartAndAssertPartFilled(1, "456")
      cy.contains("Add ID part").click()
      cy.wait("@addIdPart")
      addIdPartAndAssertPartFilled(2, "789")
    })

    it("allows to delete id part if there are more than 1", () => {
      cy.intercept(
        "POST",
        "api/customers/*/generator/projects/*/settings/id/parts",
      ).as("addIdPart")

      cy.get(lcGeneratorSettingFormItemSelector).should("have.length", 1)

      cy.get(lcGeneratorSettingFormDeleteButton).should("not.exist")
      addIdPart(0, "123")
      cy.contains("Add ID part").click()
      cy.wait("@addIdPart")

      cy.get(lcGeneratorSettingFormItemSelector).should("have.length", 2)
      cy.get(lcGeneratorSettingFormDeleteButton).should("have.length", 2)
      cy.get(lcGeneratorSettingOverviewPartSelector).should("have.length", 2)
      addIdPart(1, "456")
      cy.get(lcGeneratorSettingFormDeleteButton).eq(1).click()
      cy.contains("Remove ID part?").should("be.visible")
      cy.contains("Yes, remove").click()
      cy.wait(1000)
      cy.get(lcGeneratorSettingFormDeleteButton).should("have.length", 0)
      cy.get(lcGeneratorSettingFormItemSelector).should("have.length", 1)
      cy.get(lcGeneratorSettingOverviewPartSelector).should("have.length", 1)
    })

    it("disables next button if value provided in part input is invalid", () => {
      cy.contains("Next").should("not.be.disabled")
      addIdPart(0, "abc")
      cy.get(lcFormItemDropdownSelector).click()
      cy.get(".vs__dropdown-option").contains("+1").click()
      cy.contains("Next").should("be.disabled")
    })

    it.skip("moves on to generate new ids amount page after creating parts successfully", () => {
      addIdPart(0, "123")
      cy.contains("Add ID part").click()
      addIdPart(1, "456")
      cy.contains("Next").click()
      cy.get(lcGeneratorAmountInputSelector).type(5)
      cy.contains("Generate IDs").click()
      cy.contains("Your IDs are being generated").should("be.visible")
    })

    it.skip("saves id part that was not saved by deselect to avoid race condition and removes empty parts properly when moving to generate ids page", () => {
      addIdPart(0, "123")
      cy.contains("Add ID part").click()
      cy.get(lcGeneratorSettingFormItemInputSelector).eq(1).should("be.visible")

      addIdPart(1, "456")
      cy.contains("Add ID part").click()
      cy.contains("Next").click()

      cy.contains("Generate IDs").should("be.visible")
      cy.get(lcGeneratorSettingOverviewPartSelector).should("have.length", 2)
    })
  })
})
