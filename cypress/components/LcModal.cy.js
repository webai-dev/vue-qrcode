import { mount } from 'cypress/vue'
import LcModal from "../../src/components/base/LcModal.vue"

describe('modal', () => {

  it('modal should be visible', () => {
    const props = {
      show: true,
      title: "test Title",
      description: "test description",
      closeButton: true,
      destructive:true
    }
    mount(LcModal, { props })
    expect(cy.get('.modal')).to.exist
    cy.screenshot()
  })

  it('title and subtitle should be visible', () => {
    const props = {
      show: true,
      title: "test Title",
      description: "test description",
    }
    mount(LcModal, { props })
    expect(cy.contains('test Title')).to.exist
    expect(cy.contains('test description')).to.exist
    cy.screenshot()
  })

  it('close button should be visible', () => {
    const props = {
      show: true,
      title: "test Title",
      description: "test description",
      closeButton: true
    }
    mount(LcModal, { props })
    expect(cy.get('.close-button')).to.exist
    cy.screenshot()
  })

  it('only required props', () => {
    mount(LcModal, { props:{show: true} })
    expect(cy.get('.modal')).to.exist
    cy.get(".close-button").should("not.exist");
    cy.get(".content__title").should("not.exist");
    cy.get(".content__description").should("not.exist");
    cy.screenshot()
  })

})
