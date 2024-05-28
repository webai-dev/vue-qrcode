import { visitLoginPage } from "./utils"

const generateUrlsSelector = '[data-cy="generate-urls"]'
const lcGeneratorSettingFormItemSelector = ".lc-generator-setting-form-item"
const lcGeneratorContextMenuSelector = '[data-cy="project-actions-menu"]'
const lcGeneratorAddNewShortUrlInputSelector = 'input[name="shortUrl"]'
const lcGeneratorAddNewUrlInputSelector = 'input[name="url"]'
const lcGeneratorSettingFormItemInputSelector = "input[name='Start value']"
const lcGeneratorSettingOverviewPartSelector =
  ".lc-generator-setting-overview-id-part"
const lcGeneratorAddUrlAmountInputSelector = 'input[name="Amount"]'
const lcGeneratorLongUrlDropdownSelector = '[data-cy="long-url-dropdown"]'

describe.skip("generators url set CRUD", () => {
  beforeEach(() => {
    visitLoginPage()
    cy.loginUserEditor()
    cy.visit("app/generator")
  })

  afterEach(() => {
    cy.visit("app/generator")
    cy.get(lcGeneratorContextMenuSelector).first().click()
    cy.contains("Delete Id Project").click()
    cy.contains("Delete project").click()
  })

  it.skip("adds new url set with custom urls when new project is created", () => {
    cy.contains("Add project").click()

    cy.get(generateUrlsSelector).click()

    cy.contains("Add new target link").click()
    cy.get(lcGeneratorAddNewUrlInputSelector).type("new.test.url")
    cy.contains("Save Target Link").click()
    cy.contains("Use custom short URL").click()
    cy.contains("Customize your short URL").should("be.visible")
    // TODO - prepare data for all existing possible options
    // cy.contains("Add new one").click()
    cy.get(lcGeneratorAddNewShortUrlInputSelector).type("new.test.short.url")
    cy.contains("Save short URL").click()
    cy.contains("Next").click()
    cy.contains("Generate serialised Short Links for existing IDs").should(
      "be.visible",
    )

    cy.get(lcGeneratorSettingFormItemSelector).should("have.length", 1)
    cy.contains("Add ID part").click()
    cy.get(lcGeneratorSettingFormItemSelector).should("have.length", 2)
    cy.get(lcGeneratorSettingFormItemInputSelector).eq(0).type("123")
    cy.get(lcGeneratorSettingFormItemInputSelector).eq(1).type("abc")

    cy.contains("Next").click()
    cy.get(lcGeneratorSettingOverviewPartSelector)
      .eq(0)
      .contains("123")
      .should("be.visible")

    cy.get(lcGeneratorSettingOverviewPartSelector)
      .eq(1)
      .contains("abc")
      .should("be.visible")

    cy.get(lcGeneratorAddUrlAmountInputSelector).type(2)

    cy.contains("Generate links").click()

    cy.contains("Your links are being generated").should("be.visible")
  })

  it("adds new url set with urls selected from dropdown", () => {
    cy.contains("Add project").click()

    cy.get(generateUrlsSelector).click()

    cy.get(lcGeneratorLongUrlDropdownSelector).click()
    cy.contains("new.test.url").click()

    cy.contains("Next").click()

    cy.contains("Short URL").should("be.visible")
    cy.contains("Your Target Link").should("be.visible")

    cy.contains("Next").click()
    cy.get(lcGeneratorSettingFormItemSelector).should("have.length", 1)

    cy.get(lcGeneratorSettingFormItemInputSelector).eq(0).type("123")

    cy.contains("Next").click()

    cy.get(lcGeneratorSettingOverviewPartSelector)
      .eq(0)
      .contains("123")
      .should("be.visible")

    cy.get(lcGeneratorAddUrlAmountInputSelector).type(2)

    cy.contains("Generate links").click()

    cy.contains("Your links are being generated").should("be.visible")
  })
})
