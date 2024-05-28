import { mount } from "@cypress/vue"
import LcDialog from "../../src/components/base/LcDialog.vue"
import CheckIcon from "../../src/assets/icons/icon-check.svg"

const LcDialogContentSelector = ".dialog"
const LcDialogContainerSelector = ".modal"
const DestructiveButtonSelector = ".btn--destructive"
const ConfirmButtonSelector = ".btn--primary"
const CloseButtonSelector = ".btn--tertiary"

const props = {
  show: true,
  icon: CheckIcon,
  headline: "test Title",
  description: "test description",
  cancelLabel: "Cancel",
  confirmLabel: "Confirm",
  destructive: false,
}

const slots = { default: () => "Model Test Content" }

describe("LcDialog", () => {
  context("renders correctly with minimum required props", () => {
    it("should create a dialog by default", () => {
      mount(LcDialog, { props: { show: props.show, headline: props.headline } })
      cy.get(LcDialogContentSelector).should("exist")
      cy.screenshot()
    })
  })

  context("renders correctly with optional props", () => {
    it("it should render description", () => {
      mount(LcDialog, {
        props: {
          show: props.show,
          headline: props.headline,
          description: props.description,
        },
      })
      cy.get(LcDialogContainerSelector).should("contain", props.headline)
      cy.get(LcDialogContainerSelector).should("contain", props.description)
      cy.screenshot()
    })

    it("should set destructive class if prop is set to true ", () => {
      mount(LcDialog, {
        props: {
          show: props.show,
          headline: props.headline,
          destructive: true,
          confirmLabel: props.confirmLabel,
        },
      })
      expect(cy.get(DestructiveButtonSelector)).to.exist
      cy.screenshot()
    })

    it("should render cancel label and confirm label", () => {
      mount(LcDialog, {
        props: {
          show: props.show,
          headline: props.headline,
          cancelLabel: props.cancelLabel,
          confirmLabel: props.confirmLabel,
          onClose: () => {},
        },
      })
      cy.get(LcDialogContentSelector).should("contain", props.cancelLabel)
      cy.get(LcDialogContentSelector).should("contain", props.confirmLabel)
      cy.screenshot()
    })

    it("renders correctly with slots", () => {
      mount(LcDialog, {
        props: { show: props.show, headline: props.headline },
        slots: { ...slots },
      })
      cy.get(LcDialogContentSelector).should("contain", "Model Test Content")
      cy.screenshot()
    })
  })

  context("behaves correctly", () => {
    it("should calls onConfirm passed in props", () => {
      const onConfirm = cy.stub()
      mount(LcDialog, {
        props: {
          show: props.show,
          headline: props.headline,
          onConfirm,
        },
      })
      cy.get(ConfirmButtonSelector)
        .click()
        .then(() => {
          expect(onConfirm).to.be.calledOnce
        })
      cy.screenshot()
    })

    it("should calls function onClose passed in props", () => {
      const onClose = cy.stub()
      mount(LcDialog, {
        props: {
          show: props.show,
          headline: props.headline,
          onClose,
        },
      })
      cy.get(CloseButtonSelector)
        .click()
        .then(() => {
          expect(onClose).to.be.calledOnce
        })
      cy.screenshot()
    })
  })
})
