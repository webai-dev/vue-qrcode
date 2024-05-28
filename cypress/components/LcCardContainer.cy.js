import { mount } from "@cypress/vue";
import LcCardContainer from "../../src/components/base/LcCardContainer.vue";

describe("LcCardContainer", () => {

    it("tests if LcCardContainer component is visible", function () {
        mount(LcCardContainer);
        expect(cy.get(".card-container")).to.exist;
        cy.screenshot();
    });

})