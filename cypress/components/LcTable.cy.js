import { mount } from "@cypress/vue"
import { createI18n } from "vue-i18n"
import * as messages from "@/locales/en.json";

const i18nOptions = {
  locale: "en",
  runtimeOnly: true,
  compositionOnly: true,
  include: [""],
  messages,
}

const i18n = createI18n(i18nOptions)
const t = i18n.global.t
import LcTable from "../../src/components/base/LcTable.vue"

describe('LcTable', () => {
  it('second column should be visible', () => {
    const props = {
      identifier: "1",
      columns:[
        {key: '0', title: "column 0"},
        {key: '1', title: "column 1"},
        {key: '2', title: "column 2"},
        {key: '3', title: "column 3"},
      ],
      data: [],
      selectable: true,
      isLoading: false,
    }
    mount(LcTable, {
      "props": props,
      global: { mocks: { $t: t } }
    })
    cy.contains("column 0").should("not.exist")
    expect(cy.contains('column 1')).to.exist
    expect(cy.contains('column 2')).to.exist
    expect(cy.contains('column 3')).to.exist
  })
  
  it('on loading the loader is shown', () => {
    const props = {
      identifier: "1",
      columns:[],
      data: [],
      selectable: false,
      isLoading: true,
    }
    mount(LcTable, { "props": props })
    cy.get(".table__nodata").should("exist");
    cy.get(".lc-loader").should("exist");
    cy.screenshot()
  })
  
  it('on empty data the message is shown', () => {
    const props = {
      identifier: "1",
      columns:[],
      data: [],
      selectable: false,
      isLoading: false,
    }
    mount(LcTable, {
      "props": props,
      global: { mocks: { $t: t } }
    })
    cy.get(".table__nodata").should("exist");
    expect(cy.contains(t('common.no_data'))).to.exist
    cy.screenshot()
  })
})