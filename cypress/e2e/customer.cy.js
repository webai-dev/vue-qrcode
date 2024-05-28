import { visitLoginPage, testValidation } from "./utils"

const fieldsRules = [
  {
    fieldName: "name",
    fieldVal: "",
    errorMessage: "name ist ein Pflichtfeld",
  },
  {
    fieldName: "address",
    fieldVal: "",
    errorMessage: "address ist ein Pflichtfeld",
  },
  {
    fieldName: "city",
    fieldVal: "",
    errorMessage: "city ist ein Pflichtfeld",
  },
  {
    fieldName: "postCode",
    fieldVal: "",
    errorMessage: "postCode ist ein Pflichtfeld",
  },
  {
    fieldName: "contactPhone",
    fieldVal: "",
    errorMessage: "contactPhone ist ein Pflichtfeld",
  },
  {
    fieldName: "contactPhone",
    fieldVal: "aaaa",
    errorMessage: "contactPhone ist ungültig",
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
  {
    fieldName: "contactMail",
    fieldVal: "",
    errorMessage: "contactMail ist ein Pflichtfeld",
  },
  {
    fieldName: "contactMail",
    fieldVal: "abc",
    errorMessage: "contactMail muss eine gültige E-Mail-Adresse sein",
  },
]

describe("customers", () => {
  const customerAddSelector = '[data-cy="customer-add"]'
  const customerDetailsSelector = ".customer-details"
  const users = [{ name: "super admin", loginFn: () => cy.loginSu() }]

  users.forEach(({ name, loginFn }) => {
    describe(`${name}`, () => {
      beforeEach(() => {
        visitLoginPage()
        loginFn()
        cy.wait(1000)
        cy.visit("app/customers")
      })

      it("can access customers list", () => {
        cy.contains("Customers").should("exist")
        cy.screenshot()
      })

      it("shows form errors when invalid data input", () => {
        cy.get(customerAddSelector).click()
        fieldsRules.forEach(({ fieldName, fieldVal, errorMessage }) =>
          testValidation(fieldName, fieldVal, errorMessage),
        )
      })

      it("can add a customer", () => {
        const adminData = {
          email: "admin@admin.com",
          firstName: "admin",
          lastName: "suradmin",
          role: "CustomerAdmin",
        }
        const customerData = {
          name: "test customer",
          address: "Street 1",
          postCode: "123455",
          city: "City",
          state: "none",
          country: "DE",
          contactPhone: "123456789",
          contactMail: adminData.email,
          logo: "none.jpg",
        }

        cy.intercept("POST", "/api/customers", {
          statusCode: 200,
        }).as("addCustomer")

        cy.get(customerAddSelector).click()

        cy.get('[name="name"]').type(customerData.name)
        cy.get('[name="address"]').type(customerData.address)
        cy.get('[name="city"]').type(customerData.city)
        cy.get('[name="postCode"]').type(customerData.postCode)
        cy.get('[name="contactPhone"]').type(customerData.contactPhone)
        cy.get('[name="firstname"]').type(adminData.firstName)
        cy.get('[name="lastname"]').type(adminData.lastName)
        cy.get('[name="contactMail"]').type(adminData.email)

        cy.contains("Save").click()

        cy.wait("@addCustomer").should(({ request }) => {
          expect(request.body).to.deep.equal(customerData)
        })
      })

      it("can access customer details", () => {
        cy.get("table button:first").click()
        cy.get(customerDetailsSelector).should("be.visible")
        cy.screenshot()
      })
    })
  })
})
