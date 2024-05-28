import { mount } from "@cypress/vue";
import LcCardContent from "../../src/components/base/LcCardContent.vue";

describe("LcCardContent ", () => {

    it("tests if LcCardContent component is visible", function () {
        mount(LcCardContent);
        expect(cy.get(".lc-card-content")).to.exist;
        cy.screenshot();
    });

})