/// <reference types="cypress" />
import moment from "moment";

describe("User management", () => {
	beforeEach(() => {
		cy.visit("http://localhost:1234/sign-in");

		cy
			.get(":nth-child(1) > .form__input")
			.type(`test-userManager@ewanmorrison.co.uk`);
		cy.get(":nth-child(2) > .form__input").type("Password123!");

		cy.get(".button.button__primary").click();
		cy.url().should("equal", "http://localhost:1234/user");
	});

	it("should let you add a work log", () => {
		cy.get(".button.button__secondary").contains("Add a user").click();
		const name = `AUTOMATED_TEST_${new moment().format("YYYY-MM-DD.hh-mm-ss")}`;
		const email = `${name}@ewanmorrison.co.uk`;

		cy.get(":nth-child(1) > .form__input").type(name);
		cy.get(":nth-child(3) > .form__input").type(email);
		cy.get(".button.button__primary").contains("Create").click();
		cy.contains("Ok, close dialog").click();

		cy.get("tbody > :last-child > :nth-child(1)").should("contain.text", name);
		cy.get("tbody > :last-child > :nth-child(2)").should("contain.text", email);
	});

	it("should let you edit a work log", () => {
		const name = `AUTOMATED_TEST_${new moment().format("YYYY-MM-DD.hh-mm-ss")}`;

		cy.get("tbody > :last-child").contains("Edit").click();
		cy.get(":nth-child(1) > .form__input").clear().type(name);
		cy.contains("Save changes").click();
		cy.contains("Ok, close dialog").click();

		cy.get("tbody > :last-child > :nth-child(1)").should("contain.text", name);
	});
});
