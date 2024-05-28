import { visitLoginPage } from "./utils"

describe("create labels", () => {
  before(() => {
    cy.clearCookies()
    visitLoginPage()
  })

  beforeEach(() => {
    // this value is dynamically generated when logging in
    const sessionToken = Cypress.env("auth.token")
    if (sessionToken) {
      cy.setCookie("auth.token", sessionToken)
    }
  })

  it("expects to have been logged in", () => {
    cy.loginCompanySwitch()
    cy.visit("app/generator")
  })

  it("expects to have been logged in", () => {
    // wait until the page is loaded
    cy.get("div.title").should("be.visible")
    // check that the url is correct
    cy.url().should("include", "/app/generator")
  })

  it("navigates to the create labels page and expects to have three cards", () => {
    cy.get('[href="/app/labels/add"] > .sidebar-nav__item').click()

    cy.get(".cards__container").should("be.visible")
    // check that the page container has 3 children
    cy.get(".cards__container").children().should("have.length", 3)
  })

  it("clicks on the last child and should be navigated to the QR Links Page", () => {
    cy.get(".cards__container").children().last().click()
    cy.url().should("include", "/app/labels/add/qr")
    // check that the page has two dropdowns
    cy.get("#vs1__combobox, #vs2__combobox").should("be.visible")
    cy.get("#vs1__combobox, #vs2__combobox").should("have.length", 2)
    cy.get(
      "div.lc-page-content > div:nth-child(1) > div:nth-child(3) > div.stepperContent > div:nth-child(2) > button",
    ).should("be.visible")
    cy.get(
      "div.lc-page-content > div:nth-child(1) > div:nth-child(3) > div.stepperContent > div:nth-child(2) > button",
    ).click()
    // check that it has an ID part form
    cy.get(
      "div.lc-page-content > div:nth-child(1) > div:nth-child(3) > div.stepperContent > div:nth-child(2) > div.lc-draggable",
    ).should("be.visible")
    // check that export form inputs have the correct values
    cy.get(":nth-child(1) > .wrapper > .input__number").should(
      "have.value",
      "100",
    )
    cy.get(":nth-child(2) > .wrapper > .input__number").should(
      "have.value",
      "100",
    )
    cy.get(".input__name").scrollIntoView()
    cy.get(".input__name").should(($el) => {
      // get the element's text
      const text = $el.val()

      // assert the text is one of the two possible values
      expect(text).to.satisfy(
        (text) => text === "New project" || text === "Neues Projekt",
      )
    })
  })

  it("submits the form and expects to be navigated to the in-process page", () => {
    cy.get(".btn--primary").click()
    cy.url().should("include", "in-process")
  })

  it("expects to have a new project on the table", () => {
    cy.get('[href="/app/generator"] > .sidebar-nav__item', {
      timeout: 10000,
    }).click()
    cy.url().should("include", "/app/generator")
    cy.get(".lc-loader").should("be.visible")
    cy.get("#app > div > div.main > div > div > div:nth-child(2) > div", {
      timeout: 10000,
    }).should("be.visible")
    // check that the title is correct
    cy.get(
      "#app > div > div.main > div > div > div:nth-child(2) > div span:first",
    ).should(($el) => {
      const text = $el.text()

      expect(text).to.satisfy(
        (text) => text === "New project" || text === "Neues Projekt",
      )
    })
  })

  it("logs out the user", () => {
    // logs out
    cy.get(".sidebar-nav-container > :nth-child(3) > :nth-child(2)").click()
    // check that the url is correct
    cy.url().should("include", "login")
  })
})
