import { mount } from "@cypress/vue";
import LcCard from "../../src/components/base/LcCard.vue";

describe("LcCard", () => {

    it("tests if LcCard component is visible", function () {
        mount(LcCard);
        expect(cy.get(".card")).to.exist
        cy.screenshot();
    });

})