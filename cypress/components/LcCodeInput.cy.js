import { mount } from "@cypress/vue"
import LcCodeInput from "@/components/base/LcCodeInput.vue"

const lcCodeInputWrapperBaseSelector = ".number__code"
const lcCodeInputBaseSelector = ".code-input"

const LETTER_SYMBOL = "a"
const DIGIT_SYMBOL = "1"

const props = {
  count: 3,
  pattern: ["numerical", "alpha", "alphanumeric"],
}

describe("LcCodeInput", () => {
  context("renders correctly without props", () => {
    it("should render a code input with default props", () => {
      mount(LcCodeInput)
      cy.get(lcCodeInputWrapperBaseSelector).should("exist")
      cy.get(lcCodeInputBaseSelector).should("have.length", 6)
      cy.get(lcCodeInputBaseSelector)
        .first()
        .type(LETTER_SYMBOL)
        .should("have.value", "")
      cy.get(lcCodeInputBaseSelector)
        .first()
        .type(DIGIT_SYMBOL)
        .should("have.value", DIGIT_SYMBOL)
      cy.screenshot()
    })
  })

  context("renders correctly with props", () => {
    it(`should have ${props.count} inputs if 'count' prop is set`, () => {
      mount(LcCodeInput, { props: { count: props.count } })
      cy.get(lcCodeInputWrapperBaseSelector).should("exist")
      cy.get(lcCodeInputBaseSelector).should("have.length", props.count)
      cy.screenshot()
    })

    it(`should allow to type only letters if corresponding prop is set`, () => {
      mount(LcCodeInput, { props: { pattern: props.pattern[1] } })
      cy.get(lcCodeInputBaseSelector)
        .first()
        .type(DIGIT_SYMBOL)
        .should("have.value", "")
      cy.get(lcCodeInputBaseSelector)
        .first()
        .type(LETTER_SYMBOL)
        .should("have.value", LETTER_SYMBOL)
      cy.screenshot()
    })

    it(`should allow to type any symbols if corresponding prop is set`, () => {
      mount(LcCodeInput, { props: { pattern: props.pattern[2] } })
      cy.get(lcCodeInputBaseSelector)
        .first()
        .type(DIGIT_SYMBOL)
        .should("have.value", DIGIT_SYMBOL)
        .next()
        .type(LETTER_SYMBOL)
        .should("have.value", LETTER_SYMBOL)
      cy.screenshot()
    })
  })

  context("behaves correctly", () => {
    it("should fill inputs one by one", () => {
      mount(LcCodeInput)
      cy.get(lcCodeInputBaseSelector).first().type("123456")
      cy.get(lcCodeInputBaseSelector)
        .first()
        .should("have.value", "1")
        .next()
        .should("have.value", "2")
        .next()
        .should("have.value", "3")
        .next()
        .should("have.value", "4")
        .next()
        .should("have.value", "5")
        .next()
        .should("have.value", "6")
      cy.screenshot()
    })
  })
})
