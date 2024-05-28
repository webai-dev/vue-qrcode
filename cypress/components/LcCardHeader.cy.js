import { mount } from "@cypress/vue";
import LcCardHeader from "../../src/components/base/LcCardHeader.vue";

describe("LcCardHeader", () => {

    it("tests if LcCardHeader component is visible", function () {
        const props = {
            title: "Title test",
            subtitle: "Subtitle test"
        }
        mount(LcCardHeader, { props });
        expect(cy.get(".header")).to.not.be.empty;
        expect(cy.contains('Title test')).to.exist;
        expect(cy.contains('Subtitle test')).to.exist;
        expect(cy.get(".header")).to.exist;
        expect(cy.get(".header")).to.exist;
        expect(cy.get(".header__titles")).to.exist;
        expect(cy.get(".header__subtitle")).to.exist;
        cy.screenshot();
    });

})