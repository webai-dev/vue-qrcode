import { mount } from "@cypress/vue"
import LcButton from "../../src/components/base/LcButton.vue"
import CheckIcon from "../../src/assets/icons/icon-check.svg"

/** define all classes in the top **/
const lcButtonPrimarySelector = ".btn--primary"
const lcButtonSmSizeSelector = ".btn--sm"
const lcButtonMdSizeSelector = ".btn--md"
const lcButtonXlSizeSelector = ".btn--xl"
const lcButtonLinkSelector = ".btn--link"
const lcButtonDestructiveSelector = ".btn--destructive"
const lcButtonTextSelector = ".button__text"

/** define props object in the top so that it gets directly visible which props
 *  are being tested **/
const props = {
  variant: [
    "primary",
    "secondary",
    "secondary-gray",
    "tertiary",
    "tertiary-gray",
    "link",
    "link-gray",
  ],
  size: ["sm", "md", "lg", "xl", "2xl", "full-width"],
  destructive: true,
  disabled: true,
  icon: CheckIcon,
  trailingIcon: true,
  round: true,
  iconOnly: true,
}

/** define slots object in the top so that it gets directly visible which slots
 *  are being tested **/
const slots = {
  default: () => "Click me!",
}

describe("LcButton", () => {
  context("renders correctly without props", () => {
    it("should render a primary variant button by default", () => {
      mount(LcButton, { slots: { ...slots } })
      cy.get(lcButtonPrimarySelector).should("exist")
      cy.screenshot()
    })

    it("should not be disabled by default", () => {
      mount(LcButton, { slots: { ...slots } })
      cy.get(lcButtonPrimarySelector).should("not.be.disabled")
      cy.screenshot()
    })

    it("should have medium size by default", () => {
      mount(LcButton, { slots: { ...slots } })
      cy.get(lcButtonMdSizeSelector).should("exist")
      cy.screenshot()
    })
  })

  context("renders correctly with props", () => {
    // variants
    it(`should have link class if variant is set to ${props.variant[5]}`, () => {
      mount(LcButton, {
        slots: { ...slots },
        props: { variant: props.variant[5] },
      })
      cy.get(lcButtonLinkSelector).should("exist")
      cy.screenshot()
    })

    // sizes
    it(`should have small size if prop "${props.size[0]}" is set`, () => {
      mount(LcButton, { slots: { ...slots }, props: { size: props.size[0] } })
      cy.get(lcButtonSmSizeSelector).should("exist")
      cy.screenshot()
    })

    it(`should have extra large size if prop "${props.size[3]}" is set`, () => {
      mount(LcButton, { slots: { ...slots }, props: { size: props.size[3] } })
      cy.get(lcButtonXlSizeSelector).should("exist")
      cy.screenshot()
    })

    // destructive
    it("should set destructive class if prop is set to true", () => {
      mount(LcButton, {
        slots: { ...slots },
        props: { destructive: props.destructive },
      })
      cy.get(lcButtonDestructiveSelector).should("exist")
      cy.screenshot()
    })

    // disabled
    it("should be disabled if prop is set to true", () => {
      mount(LcButton, {
        slots: { ...slots },
        props: { disabled: props.disabled },
      })
      cy.get(lcButtonPrimarySelector).should("be.disabled")
      cy.screenshot()
    })

    // icon
    it("should contain an icon on the left side of the button text when icon prop is set", () => {
      mount(LcButton, {
        slots: { ...slots },
        props: { icon: props.icon },
      })
      cy.get(lcButtonTextSelector).prev("svg").should("exist")
      cy.get(lcButtonTextSelector).next("svg").should("not.exist")
      cy.screenshot()
    })

    it(`should contain icon on the right side of the button text if prop trailingIcon is set true`, () => {
      mount(LcButton, {
        slots: { ...slots },
        props: { icon: props.icon, trailingIcon: props.trailingIcon },
      })
      cy.get(lcButtonTextSelector).prev("svg").should("not.exist")
      cy.get(lcButtonTextSelector).next("svg").should("exist")
      cy.screenshot()
    })

    // round
    it("should have round corners if prop round is set to true", () => {
      mount(LcButton, {
        slots: { ...slots },
        props: { round: props.round },
      })
      cy.get(lcButtonPrimarySelector).should("have.css", "border-radius", "50%")
      cy.screenshot()
    })

    // icon-only
    it("should have no gap if prop icon-only is set to true", () => {
      mount(LcButton, {
        slots: { ...slots },
        props: { iconOnly: props.iconOnly },
      })
      cy.get(lcButtonPrimarySelector).should("have.css", "gap", "0px")
      cy.screenshot()
    })
  })

  context("behaves correctly", () => {
    // click works
    it("should emit event once when it is clicked ", () => {
      cy.mount(LcButton, { slots: { ...slots } })
      cy.get(lcButtonPrimarySelector).click()
      cy.get("@vue").should((wrapper) => {
        expect(wrapper.emitted("click")).to.have.lengthOf(1)
      })
    })
  })
})
