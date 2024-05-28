import { mount } from "@cypress/vue"
import LcToggle from "../../src/components/base/LcToggle.vue"

const lcToggleBaseSelector = ".toggle"
const lcToggleInputBaseSelector = ".toggle-input"
const lcToggleSmSizeSelector = ".toggle-sm"
const lcToggleMdSizeSelector = ".toggle-md"
const lcToggleErrorSelector = ".error"

const props = {
  size: ["sm", "md"],
  checked: true,
  disabled: true,
  meta: {
    valid: false,
  },
  description: "Some fake description",
}

const slots = {
  default: () => "Toggle!",
}

describe("LcToggle", () => {
  context("renders correctly without props", () => {
    it("should render a toggle with slot and default props", () => {
      mount(LcToggle, { slots })
      cy.get(lcToggleBaseSelector)
        .should("contain", "Toggle!")
        .and("not.be.disabled")
      cy.get(lcToggleSmSizeSelector).should("exist")
      cy.get(lcToggleInputBaseSelector).should("not.be.checked")
      cy.screenshot()
    })
  })

  context("renders correctly with props", () => {
    it(`should have medium size if 'size' prop  is set to '${props.size[1]}'`, () => {
      mount(LcToggle, { slots, props: { size: props.size[1] } })
      cy.get(lcToggleMdSizeSelector).should("exist")
      cy.screenshot()
    })

    it("should be checked if 'checked' prop is set to true", () => {
      mount(LcToggle, {
        slots,
        props: { checked: props.checked },
      })
      cy.get(lcToggleInputBaseSelector).should("have.value", "true")
      cy.screenshot()
    })

    it("should set error class if 'meta.valid' prop is set to false", () => {
      mount(LcToggle, {
        slots,
        props: { meta: props.meta },
      })
      cy.get(lcToggleErrorSelector).should("exist")
      cy.screenshot()
    })

    it("should be disabled if 'disabled' prop is set to true", () => {
      mount(LcToggle, {
        slots,
        props: { disabled: props.disabled },
      })
      cy.get(lcToggleInputBaseSelector).should("be.disabled")
      cy.screenshot()
    })

    // description
    it("should have description if 'description' prop is set", () => {
      mount(LcToggle, {
        slots,
        props: { description: props.description },
      })
      cy.get(lcToggleBaseSelector).should("contain", props.description)
      cy.screenshot()
    })
  })

  context("behaves correctly", () => {
    // click works
    it("should emit event once when it is clicked ", () => {
      cy.mount(LcToggle, { slots })
      cy.get(lcToggleBaseSelector).click()
      cy.get("@vue").should((wrapper) => {
        expect(wrapper.emitted("click")).to.have.lengthOf(1)
      })
    })
  })
})
