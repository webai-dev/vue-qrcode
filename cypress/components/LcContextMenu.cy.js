import { mount } from "@cypress/vue"
import LcContextMenu from "../../src/components/base/LcContextMenu.vue"

const LcContextMenuSelector = ".lc-context-popover"
const LcContextIconSelector = ".lc-context-icon"

const props = { showMenu: true }
const slots = { default: () => "slot content" }

describe("LcContextMenu", () => {
  context("renders correctly with required props", () => {
    it("it should show toggle icon when showMenu prop set true", () => {
      mount(LcContextMenu, { props: { showMenu: props.showMenu }, slots })
      cy.get(LcContextIconSelector).click()
      cy.get(LcContextMenuSelector).should("exist")
      cy.screenshot()
    })

    it("it should show menu when showMenu prop set false", () => {
      mount(LcContextMenu, { props: { showMenu: !props.showMenu }, slots })
      cy.get(LcContextMenuSelector).should("not.exist")
      cy.screenshot()
    })

    it("it should render slots", () => {
      mount(LcContextMenu, { props: { showMenu: props.showMenu }, slots })
      cy.get(LcContextIconSelector).click()
      cy.get(LcContextMenuSelector).should("exist")
      cy.get(LcContextMenuSelector).should("contain.text", "slot content")
      cy.screenshot()
    })
  })
})
