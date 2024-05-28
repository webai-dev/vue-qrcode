import { mount } from "@cypress/vue"
import LcDropdown from "../../src/components/base/LcDropdown.vue"

const LcDropdownSelector = ".vs__search"
const LcDropdownSelectedOptionSelector = ".vs__selected"

const props = {
  label: "test label",
  modelValue: "option 2",
  placeholder: "LcDropdown placeholder",
  options: ["option 1", "option 2"],
  value: "option 1",
  disabled: false,
}

describe("LcDropdown", () => {
  context("renders correctly with minimum required props", () => {
    it("should render a search field by default", () => {
      mount(LcDropdown, { props: { label: props.label } })
      cy.get(LcDropdownSelector).should("exist")
      cy.screenshot()
    })
  })

  context("renders correctly with optional props", () => {
    it("should be disabled if props is true", () => {
      props.disabled = true
      mount(LcDropdown, {
        props: { label: props.label, disabled: true },
      })
      cy.get(LcDropdownSelector).should("be.disabled")
      cy.screenshot()
    })

    it("should set placeholder correctly", () => {
      mount(LcDropdown, {
        props: {
          label: props.label,
          placeholder: props.placeholder,
        },
      })
      cy.get(LcDropdownSelector)
        .invoke("attr", "placeholder")
        .should("contain", "LcDropdown placeholder")
      cy.screenshot()
    })

    it("prioritize modelValue prop over value prop ", () => {
      mount(LcDropdown, {
        props: {
          label: props.label,
          modelValue: props.modelValue,
          placeholder: props.placeholder,
          options: props.options,
          value: props.value,
        },
      })
      cy.get(LcDropdownSelectedOptionSelector).should(
        "contain.text",
        props.modelValue,
      )
      cy.screenshot()
    })
  })

  context("behaves correctly", () => {
    it("should show options on typing ", () => {
      mount(LcDropdown, {
        props: {
          label: props.label,
          modelValue: props.modelValue,
          placeholder: props.placeholder,
          options: props.options,
          value: props.value,
        },
      })
      cy.get(LcDropdownSelector).type("option")
      cy.get(".vs__dropdown-menu").should("exist")
      cy.get(".vs__dropdown-menu").should("be.visible")
      cy.screenshot()
    })
  })
})
