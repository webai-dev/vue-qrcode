import { mount } from "@cypress/vue"
import LcBadge from "../../src/components/base/LcBadge.vue"
import CheckIcon from "../../src/assets/icons/icon-check.svg"

const BadgeSelector = ".badge"

const props = {
  text: "test text",
  color: "purple",
  size: "lg",
  avatar: "true",
  icon: CheckIcon,
}

describe("LcBadge", () => {
  context("renders correctly without props", () => {
    it("should render badge component by default", () => {
      mount(LcBadge)
      cy.get(BadgeSelector).should("exist")
      cy.screenshot()
    })
  })

  context("renders correctly with optional props", () => {
    it("should append classes to component based on props", () => {
      mount(LcBadge, { props })
      cy.get(`.badge--${props.color}`).should("exist")
      cy.get(`.badge--${props.size}`).should("exist")
      cy.get(BadgeSelector).should("contain", "test text")
      cy.get(BadgeSelector)
        .children("svg")
        .should("exist")
        .should("have.class", "avatar")
      cy.screenshot()
    })
  })
})
