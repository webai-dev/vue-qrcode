import { v4 as uuidv4 } from "uuid"

export const visitLoginPage = () => {
  cy.visit("http://localhost:3000")
}

export const testValidation = (fieldName, fieldVal, errorMessage) => {
  fieldVal
    ? cy.get(`[name="${fieldName}"]`).type(fieldVal)
    : cy.get(`[name="${fieldName}"]`).clear()
  cy.get('button[type="submit"]').click()
  cy.get(".error").contains(errorMessage).should("be.visible")
}

export const getUniqueTestEmail = () => `test-${uuidv4()}@somedomain.com`
