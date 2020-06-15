/// <reference types="cypress" />
import moment from "moment";

describe("Dashboard, work logs", () => {
	beforeEach(() => {
		cy.visit("http://localhost:1234/sign-in");

		cy.get(":nth-child(1) > .form__input").type(`test-user@ewanmorrison.co.uk`);
		cy.get(":nth-child(2) > .form__input").type("Password123!");

		cy.get(".button.button__primary").click();
		cy.url().should("equal", "http://localhost:1234/dashboard");
	});

	it("should let you add a work log", () => {
		cy.get(".button.button__secondary").contains("Add a work log").click();
		const note = `AUTOMATED_TEST_${new moment().format("YYYY-MM-DD.hh-mm-ss")}`;

		cy.get(":nth-child(1) > .form__input").type(note);
		cy.get(":nth-child(2) > .form__input").select("5");
		cy.get(":nth-child(3) > .form__input").type("2020-01-01");
		cy.contains("Add work log").click();
		cy.contains("Ok, close dialog").click();

		cy.get("tbody > :last-child > :nth-child(1)").should("contain.text", note);
		cy
			.get("tbody > :last-child > :nth-child(2)")
			.should("contain.text", "January 1, 2020");
		cy.get("tbody > :last-child > :nth-child(3)").should("contain.text", "5");
	});

	it("should let you edit a work log", () => {
		const newNote = `AUTOMATED_TEST_${new moment().format(
			"YYYY-MM-DD.hh-mm-ss"
		)}`;

		cy.get("tbody > :last-child").contains("Edit").click();
		cy.get(":nth-child(1) > .form__input").clear().type(newNote);
		cy.contains("Save changes").click();
		cy.contains("Ok, close dialog").click();

		cy.get("tbody > :last-child > :nth-child(1)").should("contain.text", newNote);
	});
});
