import { mount } from "@cypress/vue"
import LcTableCard from "../../src/components/base/LcTableCard.vue"

describe('LcTableCard', () => {
  it('title, subtitle and pagination should exist', () => {
    const props = {
      paginated: true,
      title: "title testing",
      subtitle: "subtitle testing"
    }
    mount(LcTableCard, { "props": props })
    expect(cy.contains('title testing')).to.exist
    expect(cy.contains('subtitle testing')).to.exist
    expect(cy.get(".pagination")).to.exist
    cy.screenshot()
  })

  it('without props the dom elements are not created', () => {
    mount(LcTableCard, { "props": {} })
    cy.get(".header__titles").should("not.exist");
    cy.get(".header__subtitle").should("not.exist");
    cy.get(".pagination").should("not.exist");
    cy.screenshot()
  })
})