import { visitLoginPage } from "./utils"

const newpassword = `${Math.random().toString(36).substr(2, 5)}A1!`

const email = Cypress.env("MAILSLURP_MAIL")
const inboxId = Cypress.env("MAILSLURP_PASSWORD")

const PasswordResetLinkSelector = ".link-forgot-password"
const EmailInputSelector = "input[name='Email']"
const PasswordInputSelector = "input[name='password']"
const LoginButtonSelector = ".btn--primary"
const ResetCodeInputSelectors = [
  "[name=code-1]",
  "[name=code-2]",
  "[name=code-3]",
  "[name=code-4]",
  "[name=code-5]",
  "[name=code-6]",
]

describe("set password", () => {
  beforeEach(() => {
    visitLoginPage()
  })
  context("User Password Reset", () => {
    it("allows user to reset password", () => {
      cy.intercept("/api/users/password/resend").as("resendPassword")

      cy.get(PasswordResetLinkSelector).click()
      cy.get(EmailInputSelector).type(email)
      cy.get(LoginButtonSelector).click()
      cy.wait("@resendPassword")
      cy.mailslurp()
        .then((mailslurp) => mailslurp.waitForLatestEmail(inboxId, 5000, true))
        .then((email) => /.*(\d{6}).*/.exec(email.body)[1])
        .then((code) => {
          cy.get(ResetCodeInputSelectors[0]).type(code[0]).trigger("change")
          cy.get(ResetCodeInputSelectors[1]).type(code[1]).trigger("change")
          cy.get(ResetCodeInputSelectors[2]).type(code[2]).trigger("change")
          cy.get(ResetCodeInputSelectors[3]).type(code[3]).trigger("change")
          cy.get(ResetCodeInputSelectors[4]).type(code[4]).trigger("change")
          cy.get(ResetCodeInputSelectors[5]).type(code[5])
        })
        .then(() => {
          cy.get(PasswordInputSelector).type(newpassword)
          cy.get(LoginButtonSelector).click()

          cy.loginWith(email, newpassword, false)

          expect(cy.contains("Hello,"))
          cy.screenshot()
        })
    })
  })
})
