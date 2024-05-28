import { mount } from "@cypress/vue"
import { h } from "vue"
import LcFormItem from "../../src/components/base/LcFormItem.vue"
import LcInput from "../../src/components/base/LcInput.vue"

const LcFormItemSelector = ".field--wrapper"
const LcFormItemLabelSelector = ".label"
const LcFormItemAnnotationSelector = ".annotation"
const LcInputSelector = ".test-input"
const props = {
  name: "test",
  label: "label",
  className: "test-form-item",
  annotation: "test annotation",
  type: "text",
  defaultValue: "default value",
}

const slots = {
  default: h(LcInput, {
    type: "email",
    required: true,
    class: "test-input",
    placeholder: "email",
  }),
}

describe("LcFormItem", () => {
  context("renders correctly with minimum required props", () => {
    it("should create a field wrapper by default", () => {
      mount(LcFormItem, { props: { name: props.name }, slots })
      cy.get(LcFormItemSelector).should("exist")
      cy.screenshot()
    })
  })

  context("renders correctly with optional props", () => {
    it("renders correctly with optional props", () => {
      mount(LcFormItem, {
        props: {
          name: props.name,
          type: props.type,
          className: props.className,
          annotation: props.annotation,
          label: props.label,
        },
        slots,
      })
      cy.get(LcFormItemSelector).should("exist")
      cy.get(LcFormItemAnnotationSelector).should("contain", props.annotation)
      cy.get(LcFormItemLabelSelector).should("contain", props.label)
      cy.screenshot()
    })

    it("should render slots correctly", () => {
      mount(LcFormItem, {
        props: {
          name: props.name,
          type: props.type,
          className: props.className,
          annotation: props.annotation,
          label: props.label,
        },
        slots,
      })
      cy.get(LcInputSelector).should("exist")
      cy.get(LcInputSelector).should("have.attr", "required")
      cy.get(LcInputSelector)
        .invoke("attr", "placeholder")
        .should("contain", "email")
      cy.get(LcInputSelector).invoke("attr", "type").should("contain", "email")
      cy.screenshot()
    })
  })

  context("behaves correctly", () => {
    it("should show typed value", () => {
      mount(LcFormItem, {
        props: {
          name: props.name,
          type: props.type,
          className: props.className,
        },
        slots,
      })
      cy.get(LcInputSelector).type("testValue")
      cy.get(LcInputSelector)
        .invoke("val")
        .then((val) => {
          expect(val).to.equal("testValue")
        })
      expect(cy.get(LcInputSelector).should("be.visible"))
      cy.screenshot()
    })
  })
})
