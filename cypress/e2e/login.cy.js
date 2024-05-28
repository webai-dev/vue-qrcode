import { visitLoginPage } from "./utils"
/* eslint-disable no-unused-expressions */

describe("login", () => {
  const users = [
    { userName: "Labelcloud TestingSuperAdmin", loginFn: cy.loginSu },
    { userName: "Customer Admin", loginFn: cy.loginCustomerAdmin },
    { userName: "Testing Developer", loginFn: cy.loginDeveloper },
    { userName: "User Editor", loginFn: cy.loginUserEditor },
    { userName: "User Viewer", loginFn: cy.loginUserViewer },
  ]

  beforeEach(() => {
    visitLoginPage()
  })

  users.forEach(({ userName, loginFn }) => {
    it(`redirects user ${userName} to dashboard and greets them`, () => {
      loginFn()
      expect(cy.contains(`Hello, ${userName}!`)).to.exist
      cy.screenshot()
    })
  })

  it("throws error when trying to log in with nonexisting user", () => {
    cy.loginWith("non-existent@user.com", "nonExistentPassword", false)
    cy.contains("Incorrect username or password").should("be.visible")
    cy.contains("Log in").should("be.visible")
  })

  it("throws error when trying to log in with wrong password", () => {
    cy.loginWith("labelcloud.test+superadmin@gmail.com", "wrongPassword", false)
    cy.contains("Incorrect username or password").should("be.visible")
    cy.contains("Log in").should("be.visible")
  })
})
