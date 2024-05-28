import { getUniqueTestEmail, testValidation } from "./utils"

const fieldsRules = [
  {
    fieldName: "email",
    fieldVal: "test",
    errorMessage: "email muss eine gültige E-Mail-Adresse sein",
  },
  {
    fieldName: "email",
    fieldVal: "",
    errorMessage: "email ist ein Pflichtfeld",
  },
  {
    fieldName: "password",
    fieldVal: "123",
    errorMessage: "The password must contain at least",
  },
  {
    fieldName: "firstname",
    fieldVal: "",
    errorMessage: "firstname ist ein Pflichtfeld",
  },
  {
    fieldName: "lastname",
    fieldVal: "",
    errorMessage: "lastname ist ein Pflichtfeld",
  },
]

describe("sign up", () => {
  beforeEach(() => {
    cy.visit("register")
  })

  it("Redirects to a 2FA page after providing all required new user data", () => {
    cy.get('[name="email"]').type(getUniqueTestEmail())
    cy.get('[name="password"]').type("1Ab!qwer")
    cy.get('[name="firstname"]').type("First")
    cy.get('[name="lastname"]').type("Last")
    cy.get('.checkbox-label[for="terms"]').click()
    cy.get('button[type="submit"]').click()
    cy.wait(500)
    cy.contains("Please paste (or type) your 6-digit code").should("be.visible")
  })

  it("Shows form errors when invalid data input", () => {
    fieldsRules.forEach(({ fieldName, fieldVal, errorMessage }) =>
      testValidation(fieldName, fieldVal, errorMessage),
    )
    cy.get('button[type="submit"]').click()
    cy.get(".error").contains("terms ist ein Pflichtfeld").should("be.visible")
  })
})
