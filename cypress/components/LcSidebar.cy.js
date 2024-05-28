import { mount } from "@cypress/vue"
import { createI18n } from "vue-i18n"
import { createMemoryHistory, createRouter } from "vue-router"
import { testSessionStore } from "../support/component"
import LcSidebar from "@/components/shared/LcSidebar.vue"
import { routes } from "@/router/router.ts"
import en from "@/locales/en.json"

const LcSideBarSelector = ".sidebar"
const LcSideBarProfileSelector = ".sidebar-profile"
const LcSideBarActiveItemSelector = ".sidebar-nav__item--active"
const LcSideBarFooter = ".sidebar-footer"

const i18nOptions = {
  locale: "en",
  runtimeOnly: true,
  compositionOnly: true,
  include: [""],
  messages: { en },
}

const i18n = createI18n(i18nOptions)
const t = i18n.global.t
const router = createRouter({ routes, history: createMemoryHistory() })
const store = testSessionStore()
const props = { isMobile: true }

describe("LcSidebar", () => {
  context("it renders correctly without props", () => {
    it("it renders correctly", () => {
      mount(LcSidebar, {
        props: {},
        global: {
          mocks: { $t: t },
          plugins: [router, store],
        },
      })
      cy.get(LcSideBarSelector).should("exist")
      cy.get(LcSideBarSelector).should("be.visible")
      cy.get(LcSideBarProfileSelector).should("exist")
      cy.contains(t("navbar.add_label"))
      cy.contains(t("navbar.all_labels"))
      cy.contains(t("navbar.analytics"))
      cy.contains(t("common.users"))
      cy.contains(t("navbar.workspaces"))
      cy.contains(t("common.settings"))
      cy.contains(t("navbar.logout"))
      cy.get(LcSideBarSelector).should("contain", t("navbar.add_label"))
      cy.get(LcSideBarSelector).should("contain", t("navbar.all_labels"))
      cy.get(LcSideBarSelector).should("contain", t("navbar.analytics"))
      cy.get(LcSideBarSelector).should("contain", t("common.users"))
      cy.get(LcSideBarSelector).should("contain", t("navbar.workspaces"))
      cy.get(LcSideBarSelector).should("contain", t("common.settings"))
      cy.get(LcSideBarSelector).should("contain", t("navbar.logout"))
      cy.get(LcSideBarActiveItemSelector).should(
        "contain",
        t("navbar.all_labels"),
      )
      cy.screenshot()
    })
  })

  context("it renders correctly with optional props", () => {
    it("should not render logo when is mobile set true", () => {
      cy.viewport("iphone-6")
      mount(LcSidebar, {
        props: { isMobile: props.isMobile },
        global: {
          mocks: { $t: t },
          plugins: [router, store],
        },
      })
      cy.get(LcSideBarSelector).should("exist")
      cy.get(LcSideBarSelector).should("be.visible")
      cy.get(LcSideBarFooter).should("not.be.visible")
      cy.screenshot()
    })
  })

  context("behaves correctly", () => {
    it("should call the function passed in menuCallback", () => {
      cy.viewport("iphone-6")
      const menuCallback = cy.stub()
      cy.wait(1000)
      mount(LcSidebar, {
        props: { isMobile: props.isMobile, menuCallback },
        global: {
          mocks: { $t: t },
          plugins: [router, store],
        },
      })
      cy.get(".sidebar-nav .sidebar-nav__item:first")
        .click()
        .then(() => {
          expect(menuCallback).to.be.calledOnce
        })
      cy.screenshot()
    })
  })
})
