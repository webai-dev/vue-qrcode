import { mount } from "@cypress/vue"
import LcCheckbox from "@/components/base/LcCheckbox.vue"

const lcCheckboxBaseSelector = ".checkbox"
const lcCheckboxInputSelector = ".checkbox-input"
const lcCheckboxLabelSelector = ".checkbox-label"
const lcCheckIconSelector = "[data-cy=check-icon]"
const lcMinusIconSelector = "[data-cy=minus-icon]"
const lcCheckboxDescriptionSelector = ".checkbox-description"
const lcCheckboxErrorSelector = `${lcCheckboxBaseSelector}.error`

const props = {
  description: "Test description",
  disabled: true,
  indeterminate: true,
  size: ["sm", "md"],
  meta: {
    valid: false,
    dirty: true,
  },
  modelValue: true,
}

const slots = { default: () => "Checkbox" }

describe("LcCheckbox", () => {
  context("renders correctly without props", () => {
    it("should render a checkbox with slot and default props", () => {
      mount(LcCheckbox, { slots })
      cy.get(lcCheckboxBaseSelector)
        .should("exist")
        .and(
          "have.class",
          `${lcCheckboxBaseSelector.slice(1)}-${props.size[0]}`,
        )
      cy.get(lcCheckboxInputSelector).should("not.be.disabled")
      cy.get(lcCheckboxLabelSelector).should("contain", "Checkbox")
      cy.screenshot()
    })
  })

  context("renders correctly with props", () => {
    it(`should have description if corresponding prop is set`, () => {
      mount(LcCheckbox, { slots, props: { description: props.description } })
      cy.get(lcCheckboxDescriptionSelector).should("contain", props.description)
      cy.screenshot()
    })

    it(`should be disabled if 'disabled' prop is set to true`, () => {
      mount(LcCheckbox, { slots, props: { disabled: props.disabled } })
      cy.get(lcCheckboxInputSelector).should("be.disabled")
      cy.screenshot()
    })

    it(`should have medium size if 'size' prop is set to '${props.size[1]}'`, () => {
      mount(LcCheckbox, { slots, props: { size: props.size[1] } })
      cy.get(lcCheckboxBaseSelector)
        .should("exist")
        .and(
          "have.class",
          `${lcCheckboxBaseSelector.slice(1)}-${props.size[1]}`,
        )
      cy.screenshot()
    })

    it(`should have error state if 'meta.valid' prop is set to false`, () => {
      mount(LcCheckbox, { slots, props: { meta: props.meta } })
      cy.get(lcCheckboxErrorSelector).should("exist")
      cy.screenshot()
    })

    it("should be checked if 'modelValue' prop is set to true", () => {
      mount(LcCheckbox, {
        slots,
        props: { modelValue: props.modelValue },
      })
      cy.get(lcCheckboxInputSelector).should("be.checked")
      cy.get(lcCheckIconSelector).should("exist")
      cy.screenshot()
    })

    it("should have minus icon if 'indeterminate' prop is set to true", () => {
      mount(LcCheckbox, {
        slots,
        props: { indeterminate: props.indeterminate },
      })
      cy.get(lcMinusIconSelector).should("exist")
      cy.screenshot()
    })
  })

  context("behaves correctly", () => {
    it("should emit event once when it is clicked ", () => {
      cy.mount(LcCheckbox, { slots })
      cy.get(lcCheckboxInputSelector).check({ force: true })
      cy.get("@vue").should((wrapper) => {
        expect(wrapper.emitted("change")).to.have.lengthOf(1)
      })
      cy.screenshot()
    })
  })
})
