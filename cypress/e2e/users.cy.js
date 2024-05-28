import { testValidation, visitLoginPage } from "./utils"

const usersListSelector = '[data-cy="users-list"]'
const userDetailsBtnSelector = '[data-cy="user-details-btn"]'
const userDetailsSelector = '[data-cy="user-details"]'
const userEditSelector = '[data-cy="user-edit"]'
const userAddSelector = '[data-cy="users-add-user"]'
const userDeleteSelector = '[data-cy="user-delete"]'
const userContextMenuSelector = '[data-cy="user-context-menu"]'
const userToggleActivationSelector = '[data-cy="user-toggle-activation"]'

const inviteNewFieldsRules = [
  {
    fieldName: "mail",
    fieldVal: "test",
    errorMessage: "mail muss eine gültige E-Mail-Adresse sein",
  },
  {
    fieldName: "mail",
    fieldVal: "",
    errorMessage: "mail ist ein Pflichtfeld",
  },
]

const inviteToCompanyFieldsRules = [
  {
    fieldName: "Customer",
    fieldVal: "",
    errorMessage: "Customer ist ein Pflichtfeld",
  },
  {
    fieldName: "role",
    fieldVal: "",
    errorMessage: "role ist ein Pflichtfeld",
  },
]

const userEditFieldsRules = [
  {
    fieldName: "firstName",
    fieldVal: "",
    errorMessage: "firstName ist ein Pflichtfeld",
  },
  {
    fieldName: "lastName",
    fieldVal: "",
    errorMessage: "lastName ist ein Pflichtfeld",
  },
]

const userRoles = {
  Admin: "CustomerAdmin",
  Editor: "UserEdit",
  Viewer: "UserView",
  Developer: "Developer",
}

const addTestUser = (userRole) => {
  cy.intercept("/api/customers/*/invite", { body: {} }).as("inviteUser")
  cy.contains("Add User").click()
  cy.contains("Add new user").should("be.visible")
  cy.get('[name="mail"]').type("any@email.com")
  cy.get('[name="firstname"]').type("First")
  cy.get('[name="lastname"]').type("Last")
  cy.get('[name="role"]').click()
  cy.get(".vs__dropdown-option").contains(userRole).click()
  cy.get("button[type=submit]").contains("Invite").should("be.visible")
  cy.get("button[type=submit]").contains("Invite").click()
  cy.wait("@inviteUser")
  cy.get("@inviteUser").should(({ request }) => {
    expect(request.body.users[0]).to.include({ role: userRoles[userRole] })
  })
  cy.get(usersListSelector).should("be.visible")
}

const deleteTestUser = (email) => {
  // TODO - delete via api call

  cy.contains(email).siblings(".actions").find(userDeleteSelector).click()

  cy.contains("Yes, remove").click()
  cy.get(usersListSelector).should("be.visible")
  cy.contains(email).should("not.exist")
}

describe("users", () => {
  beforeEach(() => {
    visitLoginPage()
  })

  describe("customer admin", () => {
    beforeEach(() => {
      cy.loginCustomerAdmin()
      cy.visit("app/users")
    })

    it(`can access users list`, () => {
      cy.get(usersListSelector).should("be.visible")
      cy.screenshot()
    })

    it(`can add user`, () => {
      cy.get(userAddSelector).should("be.visible")
      cy.screenshot()
    })

    it(`can edit user`, () => {
      cy.get(userEditSelector).first().click()

      cy.intercept("/api/users/*", { body: {} }).as("updateUser")

      cy.get('[name="firstName"]').type("First")
      cy.get('[name="lastName"]').type("Last")
      cy.get('[name="role"]').click()
      cy.get(".vs__dropdown-option").first().click()

      cy.contains("Save changes").click()

      cy.wait("@updateUser").should(({ request }) => {
        expect(request.method).to.equal("PATCH")
      })
      cy.screenshot()
    })

    it(`can remove user from company`, () => {
      cy.get(userDeleteSelector).first().click()

      cy.intercept("/api/customers/*/users", { body: {} }).as(
        "deactivateCustomerRelation",
      )

      cy.contains("Yes, remove").click()
      cy.wait("@deactivateCustomerRelation").should(({ request }) => {
        expect(request.method).to.equal("DELETE")
      })
    })
  })

  describe("superadmin", () => {
    beforeEach(() => {
      cy.loginSu()
      cy.visit("app/users")
    })

    it(`can access users list`, () => {
      cy.visit("app/users")
      cy.get(usersListSelector).should("be.visible")
      cy.screenshot()
    })

    it(`can add user`, () => {
      cy.visit("app/users")
      cy.get(userAddSelector).should("be.visible")
      cy.screenshot()
    })

    it(`can access user details`, () => {
      cy.get(userDetailsBtnSelector).first().click()
      cy.get(userDetailsSelector).should("be.visible")
      cy.screenshot()
    })

    it.skip(`can activate and deactivate user`, () => {
      cy.intercept("/api/users/*").as("activateUser")
      cy.get(userToggleActivationSelector).first().click()

      cy.wait("@activateUser").should(({ request }) => {
        expect(request.method).to.equal("DELETE")
      })

      cy.screenshot()
      cy.get(userToggleActivationSelector).first().click()

      cy.wait("@activateUser").should(({ request }) => {
        expect(request.method).to.equal("POST")
      })

      cy.screenshot()
    })

    it("can invite user to a company", () => {
      cy.get(userDetailsBtnSelector).first().click()
      cy.contains("Invite to another company").should("be.visible")
      cy.contains("Invite to another company").click()
      cy.get('[name="Customer"]').type("Test")

      // Relies on proper customer data existing in the db
      cy.get(".lc-suggestion_list-item").contains("Test").click()
      cy.get('[name="role"]').click()
      cy.get(".vs__dropdown-option").contains("Viewer").click()
      cy.get("button[type=submit]").contains("Invite").should("be.visible")
      cy.get("button[type=submit]").contains("Invite").click()
      cy.contains("Invitation sent").should("be.visible")
    })

    it("can change user role in a company", () => {
      cy.get(userDetailsBtnSelector).first().click()
      cy.get(userContextMenuSelector).should("be.visible")
      cy.get(userContextMenuSelector).first().click()
      cy.contains("Change role").click()

      cy.get('[name="role"]').click()
      cy.get(".vs__dropdown-option").contains("Developer").click()
      cy.get("button[type=submit]").contains("Save").should("be.visible")
      cy.get("button[type=submit]").contains("Save").click()
      cy.get(".badge-text").first().should("have.text", "Developer")
      cy.screenshot()
    })

    it("can remove user from a company", () => {
      cy.get(userDetailsBtnSelector).first().click()
      cy.get(userContextMenuSelector).should("be.visible")
      cy.get(userContextMenuSelector).first().click()

      cy.intercept("/api/customers/*/users").as("deactivateCustomerRelation")

      cy.contains("Remove relation").click()

      cy.contains("Yes, remove").click()
      cy.wait("@deactivateCustomerRelation").should(({ request }) => {
        expect(request.method).to.equal("DELETE")
      })
    })

    it.skip("sees form errors in invite user form", () => {
      cy.get(userDetailsBtnSelector).first().click()
      cy.contains("Invite to another company").should("be.visible")
      cy.contains("Invite to another company").click()

      inviteToCompanyFieldsRules.forEach(
        ({ fieldName, fieldVal, errorMessage }) =>
          testValidation(fieldName, fieldVal, errorMessage),
      )
    })

    it("sees form errors in edit user form", () => {
      cy.get(userDetailsBtnSelector).first().click()
      cy.get(userEditSelector).should("be.visible")
      cy.get(userEditSelector).click()

      userEditFieldsRules.forEach(({ fieldName, fieldVal, errorMessage }) =>
        testValidation(fieldName, fieldVal, errorMessage),
      )
    })
  })

  describe("invite user", () => {
    beforeEach(() => {
      cy.loginCustomerAdmin()
      cy.visit("app/users")
    })

    Object.keys(userRoles).forEach((userRole) =>
      it(`sends invitation to a new user with role ${userRole} after filling in form in a dialog`, () => {
        addTestUser(userRole)

        cy.contains("Invitation sent").should("be.visible")
      }),
    )

    it("shows form errors when invalid data is filled in", () => {
      cy.get(userAddSelector).click()
      cy.contains("Add new user").should("be.visible")

      inviteNewFieldsRules.forEach(({ fieldName, fieldVal, errorMessage }) =>
        testValidation(fieldName, fieldVal, errorMessage),
      )
      cy.contains("Invite").click()
      cy.get(".error").contains("role ist ein Pflichtfeld").should("be.visible")
    })

    it("closes add new user dialog when cancel is clicked", () => {
      cy.get(userAddSelector).click()
      cy.contains("Add new user").should("be.visible")

      cy.contains("Cancel").click()
      cy.contains("Add new user").should("not.exist")
    })
  })
})
