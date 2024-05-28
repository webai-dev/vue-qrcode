import { mount } from "@cypress/vue"
import LcInput from "../../src/components/base/LcInput.vue"
import MailIcon from "../../src/assets/icons/icon-mail.svg"

const LcInputSelector = ".input"

const props = {
  modelValue: "modelValue",
  placeholder: "placeholder",
  disabled: false,
  prefix: "prefix",
  type: "text",
  icon: MailIcon,
  addonBefore: true,
  addonAfter: true,
  value: "value",
  useValueInsteadOfModel: true,
}

describe("LcInput", () => {
  context("renders correctly without props", () => {
    it("should render input by default", () => {
      mount(LcInput)
      expect(cy.get(LcInputSelector)).to.exist
      cy.screenshot()
    })
  })

  context("renders correctly with optional props", () => {
    it("should have value when passed in props", () => {
      mount(LcInput, {
        props: {
          value: props.value,
          useValueInsteadOfModel: props.useValueInsteadOfModel,
        },
      })
      cy.get(LcInputSelector).should("have.value", props.value)
      cy.screenshot()
    })

    it("should be disabled if set true", () => {
      mount(LcInput, { props: { disabled: true } })
      cy.get(LcInputSelector).should("be.disabled")
      cy.screenshot()
    })

    it("should render type and placeholder correctly", () => {
      mount(LcInput, {
        props: {
          placeholder: props.placeholder,
          type: props.type,
        },
      })
      cy.get(LcInputSelector)
        .invoke("attr", "placeholder")
        .should("contain", props.placeholder)
      cy.get(LcInputSelector)
        .invoke("attr", "type")
        .should("contain", props.type)
      cy.screenshot()
    })

    it(`should contain icon on the right side of the input if prop addonBefore is set true`, () => {
      mount(LcInput, {
        props: { icon: props.icon, addonBefore: props.addonBefore },
      })
      cy.get(LcInputSelector).prev("svg").should("exist")
    })

    it(`should contain icon on the right side of the input if prop addonAfter is set true`, () => {
      mount(LcInput, {
        props: { icon: props.icon, addonAfter: props.addonAfter },
      })
      cy.get(LcInputSelector).prev("svg").should("exist")
    })

    it("should prioritize modelValue", () => {
      mount(LcInput, {
        props: { value: props.value, modelValue: props.modelValue },
      })
      cy.get(LcInputSelector).should("have.value", props.modelValue)
      cy.screenshot()
    })
  })
  context("behaves correctly", () => {
    it("should set value on typing", () => {
      mount(LcInput)
      cy.get(LcInputSelector).type(props.value)
      cy.get(LcInputSelector).should("contain.value", props.value)
      cy.screenshot()
    })
  })
})
