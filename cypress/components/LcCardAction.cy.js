import { mount } from "@cypress/vue";
import LcCardActions from "../../src/components/base/LcCardActions.vue";

describe("LcCardAction", () => {

    it("tests if LcCardAction component is visible", function () {
        mount(LcCardActions);
        expect(cy.get(".LcCardActions")).to.exist;
        cy.screenshot();
    });

})