import { mount } from "@cypress/vue";
import { createI18n } from "vue-i18n";
import LcPaginator from "../../src/components/base/LcPaginator.vue";
import * as messages from "../../src/locales/en.json";

const i18nOptions = {
  locale: "en",
  runtimeOnly: true,
  compositionOnly: true,
  include: [""],
  messages
};
const i18n = createI18n(i18nOptions);
const t = i18n.global.t;

describe("LcPaginator", () => {

  it("both paginator buttons not disabled when not on first or last page", () => {
    const props = {
      page: 2,
      pageSize: 10,
      totalPages: 10,
      total: 100
    };

    mount(LcPaginator, {
      props,
      global: { mocks: { $t: t } }
    });
    expect(cy.contains("page {page} of {totalPages}")).to.exist;
    cy.get(".paginator__btn--left").should("not.be.disabled");
    cy.get(".paginator__btn--right").should("not.be.disabled");
    cy.screenshot();
  });

  it("paginator left button  disabled on first page", () => {
    const props = {
      page: 1,
      pageSize: 10,
      totalPages: 10,
      total: 100
    };

    mount(LcPaginator, {
      props,
      global: { mocks: { $t: t } }
    });
    expect(cy.contains("page {page} of {totalPages}")).to.exist;
    cy.get(".paginator__btn--left").should("be.disabled");
    cy.get(".paginator__btn--right").should("not.be.disabled");
    cy.screenshot();
  });

  it("paginator right button disabled when on last page", () => {
    const props = {
      page: 10,
      pageSize: 10,
      totalPages: 10,
      total: 100
    };

    mount(LcPaginator, {
      props,
      global: { mocks: { $t: t } }
    });
    expect(cy.contains("page {page} of {totalPages}")).to.exist;
    cy.get(".paginator__btn--left").should("not.be.disabled");
    cy.get(".paginator__btn--right").should("be.disabled");
    cy.screenshot();
  });

  it("paginator right and left button disabled no props are passed", () => {
    mount(LcPaginator, {
      global: { mocks: { $t: t } }
    });
    expect(cy.contains("page {page} of {totalPages}")).to.exist;
    cy.get(".paginator__btn--left").should("be.disabled");
    cy.get(".paginator__btn--right").should("be.disabled");
    cy.screenshot();
  });
});