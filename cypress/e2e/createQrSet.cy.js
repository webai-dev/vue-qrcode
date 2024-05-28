import { visitLoginPage } from "./utils"

const generateQrsSelector = '[data-cy="generate-qrs"]'
const lcGeneratorSettingFormItemSelector = ".lc-generator-setting-form-item"
const lcGeneratorContextMenuSelector = '[data-cy="project-actions-menu"]'
const lcGeneratorAddNewUrlInputSelector = 'input[name="url"]'
const lcGeneratorSettingFormItemInputSelector = "input[name='Start value']"
const lcGeneratorSettingOverviewPartSelector =
  ".lc-generator-setting-overview-id-part"
const lcGeneratorAddQrAmountInputSelector = 'input[name="Amount"]'
const singleQrSuccessSelector = ".generator-single-qr__success"
// const lcGeneratorAddNewShortUrlInputSelector =
//   'input[data-cy="short-url-input"]'
const lcGeneratorLongUrlDropdownSelector = '[data-cy="long-url-dropdown"]'

describe.skip("generators url set CRUD", () => {
  beforeEach(() => {
    visitLoginPage()
    cy.loginUserEditor()
    cy.visit("app/generator")
  })

  afterEach(() => {
    cy.visit("app/generator")
    cy.get(lcGeneratorContextMenuSelector).should("be.visible")
    cy.get(lcGeneratorContextMenuSelector).first().click()
    cy.contains("Delete Id Project").click()
    cy.contains("Delete project").click()
  })

  it("adds new single QR code with custom url when new project is created", () => {
    cy.contains("Add project").click()

    cy.get(generateQrsSelector).click()
    cy.contains("Single QR code").click()
    cy.contains("Generate QR code").click()
    cy.get(".error").contains("url ist ein Pflichtfeld").should("be.visible")

    cy.get(lcGeneratorAddNewUrlInputSelector).type("test.url")
    cy.get(".error").should("not.exist")
    cy.contains("Generate QR code").click()

    cy.get(singleQrSuccessSelector).should("be.visible")
  })

  it("adds new QR codes set with custom url when new project is created", () => {
    cy.contains("Add project").click()

    cy.get(generateQrsSelector).click()
    cy.contains("Multiple QR codes").click()

    cy.contains("Add new target link").click()
    cy.get(lcGeneratorAddNewUrlInputSelector).type("new.test.url")
    cy.contains("Save Target Link").click()

    // TODO - control data so that we can test forked short url form properly
    // cy.contains("Use custom short URL").click()
    // cy.contains("Customize your short URL").should("be.visible")
    // cy.get(lcGeneratorAddNewShortUrlInputSelector).type("new.test.short.url")
    // cy.contains("Save short URL").click()

    cy.contains("Next").click()

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

    cy.contains("Generate QR codes").click()
    cy.get(".error").contains("Amount ist ein Pflichtfeld").should("be.visible")

    cy.get(lcGeneratorAddQrAmountInputSelector).type(2)
    cy.get(".error").should("not.exist")
    cy.contains("Generate QR codes").click()

    cy.contains("Your QR codes are being generated").should("be.visible")
  })

  it("adds new QR codes set with url selected from dropdown when new project is created", () => {
    cy.contains("Add project").click()

    cy.get(generateQrsSelector).click()
    cy.contains("Multiple QR codes").click()

    cy.get(lcGeneratorLongUrlDropdownSelector).click()
    cy.contains("new.test.url").click()

    cy.contains("Next").click()

    cy.contains("Use custom short URL").should("be.visible")

    cy.contains("Next").click()

    cy.get(lcGeneratorSettingFormItemSelector).should("have.length", 1)
    cy.get(lcGeneratorSettingFormItemInputSelector).eq(0).type("123")

    cy.contains("Next").click()
    cy.get(lcGeneratorSettingOverviewPartSelector)
      .eq(0)
      .contains("123")
      .should("be.visible")

    cy.get(lcGeneratorAddQrAmountInputSelector).type(2)
    cy.contains("Generate QR codes").click()

    cy.contains("Your QR codes are being generated").should("be.visible")
  })
})
