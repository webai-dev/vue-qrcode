import { mount } from "@cypress/vue"
import { createMemoryHistory, createRouter } from "vue-router"
import LcSidebar from "../../src/components/shared/LcSidebar.vue"
import LcWholePageOverlay from "../../src/components/base/LcWholePageOverlay.vue"
import { routes } from "../../src/router/router"
import { testUtilityStore } from "../support/component"
import CheckIcon from "../../src/assets/icons/icon-check.svg"

const LcWholePageHeaderSelector = ".lc-whole-page-overlay__header"
const LcWholePageHeadSelector = ".lc-whole-page-overlay__content-head"
const LcWholePageHeadTitleSelector =
  ".lc-whole-page-overlay__content-head-title"
const LcWholePageSubtitleSelector =
  ".lc-whole-page-overlay__content-head-subtitle"
const LcWholePageProjectNameSelector =
  ".lc-whole-page-overlay__header-project-name"
const LcWholePageContentSelector =
  ".lc-whole-page-overlay__content-body-container"

const props = {
  icon: CheckIcon,
  pageTitle: "Test title",
  subtitle: "Test subtitle",
  closeRoutePath: "/app/dashboard",
  hidePrevBtn: true,
  projectName: "Test name",
}

const fallbackProjectName = "No project name"
const text = "Content"
const slots = {
  default: () => text,
}

const router = createRouter({ routes, history: createMemoryHistory() })
const store = testUtilityStore()

describe("LcWholePageOverlay", () => {
  context("renders correctly with minimum required props", () => {
    // icon and pageTitle
    it("should show icon and page title", () => {
      mount(LcWholePageOverlay, {
        props: {
          icon: props.icon,
          pageTitle: props.pageTitle,
          closeRoutePath: props.closeRoutePath,
        },
        slots: { ...slots },
        global: {
          plugins: [router, store],
        },
      })
      cy.get(LcWholePageHeadSelector).should("exist")
      cy.get(LcWholePageHeadSelector).children("svg").should("exist")
      cy.get(LcWholePageHeadTitleSelector)
        .contains(props.pageTitle)
        .should("exist")
      cy.screenshot()
    })

    it("should show 'No project name' if no project name is given", () => {
      mount(LcWholePageOverlay, {
        props: {
          icon: props.icon,
          pageTitle: props.pageTitle,
          closeRoutePath: props.closeRoutePath,
        },
        slots: { ...slots },
        global: {
          plugins: [router, store],
        },
      })
      cy.get(LcWholePageProjectNameSelector).should(
        "have.text",
        fallbackProjectName,
      )
      cy.screenshot()
    })

    it("should show a prev and a close button in header", () => {
      mount(LcWholePageOverlay, {
        props: {
          icon: props.icon,
          pageTitle: props.pageTitle,
          closeRoutePath: props.closeRoutePath,
        },
        slots: { ...slots },
        global: {
          plugins: [router, store],
        },
      })
      cy.get(LcWholePageHeaderSelector)
        .children("button")
        .should("have.length", 2)
      cy.screenshot()
    })

    // default slot
    it("should show passed slot content", () => {
      mount(LcWholePageOverlay, {
        props: {
          icon: props.icon,
          pageTitle: props.pageTitle,
          closeRoutePath: props.closeRoutePath,
        },
        slots: { ...slots },
        global: {
          plugins: [router, store],
        },
      })
      cy.get(LcWholePageContentSelector).contains(text).should("exist")
      cy.screenshot()
    })
  })

  context("renders correctly with optional props", () => {
    // subtitle
    it("should show subtitle", () => {
      mount(LcWholePageOverlay, {
        props: {
          icon: props.icon,
          pageTitle: props.pageTitle,
          closeRoutePath: props.closeRoutePath,
          subtitle: props.subtitle,
        },
        slots: slots.default(),
        global: {
          plugins: [router, store],
        },
      })
      cy.get(LcWholePageSubtitleSelector).should("exist")
      cy.get(LcWholePageSubtitleSelector)
        .contains(props.subtitle)
        .should("exist")
      cy.screenshot()
    })

    // hide prev button
    it("should hide prev button if prop is set true", () => {
      mount(LcWholePageOverlay, {
        props: {
          icon: props.icon,
          pageTitle: props.pageTitle,
          closeRoutePath: props.closeRoutePath,
          hidePrevBtn: props.hidePrevBtn,
        },
        slots: { ...slots },
        global: {
          plugins: [router, store],
        },
      })
      cy.get(LcWholePageHeaderSelector)
        .children("button")
        .should("have.length", 1)
      cy.get(LcWholePageProjectNameSelector).next("button").should("exist")
      cy.get(LcWholePageProjectNameSelector).prev("button").should("not.exist")
      cy.screenshot()
    })

    // project name
    it("should show project name", () => {
      mount(LcWholePageOverlay, {
        props: {
          icon: props.icon,
          pageTitle: props.pageTitle,
          closeRoutePath: props.closeRoutePath,
          projectName: props.projectName,
          untitledCount: props.untitledCount,
        },
        slots: { ...slots },
        global: {
          plugins: [router, store],
        },
      })
      cy.get(LcWholePageProjectNameSelector).should(
        "have.text",
        props.projectName,
      )
      cy.screenshot()
    })
  })

  context("behaves correctly", () => {
    // toggles project name input visibility
    it("should toggle and focus project name input on click", () => {
      mount(LcWholePageOverlay, {
        props: {
          icon: props.icon,
          pageTitle: props.pageTitle,
          closeRoutePath: props.closeRoutePath,
        },
        slots: { ...slots },
        global: {
          plugins: [router, store],
        },
      })
      cy.get(LcWholePageProjectNameSelector)
        .should("have.text", fallbackProjectName)
        .click()

      cy.get(LcWholePageProjectNameSelector).should("not.exist")

      cy.get(LcWholePageHeaderSelector)
        .find("input")
        .should("exist")
        .should("be.focused")
        .blur()

      cy.get(LcWholePageProjectNameSelector).should("exist")
    })

    // returns updated project name
    it("should return updated project name", () => {
      cy.mount(LcWholePageOverlay, {
        props: {
          icon: props.icon,
          pageTitle: props.pageTitle,
          closeRoutePath: props.closeRoutePath,
        },
        slots: { ...slots },
        global: {
          plugins: [router, store],
        },
      })
      cy.get(LcWholePageProjectNameSelector)
        .should("have.text", fallbackProjectName)
        .click()

      cy.get(LcWholePageHeaderSelector)
        .find("input")
        .type(props.projectName)
        .blur()

      cy.get("@vue").should((wrapper) => {
        expect(wrapper.emitted("updateProjectName")).to.have.lengthOf(1)
        expect(wrapper.emitted("updateProjectName")[0][0]).to.equal(
          props.projectName,
        )
      })
    })
  })
})
