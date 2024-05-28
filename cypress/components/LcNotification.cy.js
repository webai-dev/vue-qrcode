import { mount } from "cypress/vue"
import LcNotification from "@/components/base/LcNotification.vue"

const lcNotificationBaseSelector = ".lc-notification"
const lcNotificationBodySelector = `${lcNotificationBaseSelector}__body`
const lcNotificationCloseButtonSelector = `${lcNotificationBaseSelector}__close`

const getIconSelector = (type) => `[data-cy="${type}-icon"]`

const props = {
  type: ["success", "info", "warning", "error"],
  title: "Test title",
}

const slots = { default: () => "Notification content" }

describe("LcNotification", () => {
  context("renders correctly without props", () => {
    it("should render a notification with slot and default props", () => {
      mount(LcNotification, { slots })
      cy.get(lcNotificationBaseSelector)
        .should("exist")
        .and(
          "have.class",
          `${lcNotificationBaseSelector.slice(1)}--${props.type[1]}`,
        )
      cy.get(lcNotificationBodySelector).should(
        "contain",
        "Notification content",
      )
      cy.screenshot()
    })
  })

  context("renders correctly with props", () => {
    it("should have title if corresponding prop is set", () => {
      mount(LcNotification, { slots, props: { title: props.title } })
      cy.get(lcNotificationBaseSelector).should("contain", props.title)
      cy.screenshot()
    })

    for (const type of props.type) {
      it(`should have correct type if corresponding prop is set to ${type}`, () => {
        mount(LcNotification, { slots, props: { type } })
        cy.get(lcNotificationBaseSelector).should(
          "have.class",
          `${lcNotificationBaseSelector.slice(1)}--${type}`,
        )
        cy.get(getIconSelector(type)).should("exist")
        cy.screenshot()
      })
    }
  })

  context("behaves correctly", () => {
    it("emit event once when close button is clicked", () => {
      cy.mount(LcNotification, { slots })
      cy.get(lcNotificationCloseButtonSelector).children("svg").click()
      cy.get("@vue").should((wrapper) => {
        expect(wrapper.emitted("close")).to.have.lengthOf(1)
      })
      cy.screenshot()
    })
  })
})
