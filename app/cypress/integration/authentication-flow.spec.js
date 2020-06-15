/// <reference types="cypress" />
import moment from "moment";

describe("Signing up, signing in, and signing out", () => {
	it("should allow you to navigate to the sign up page", () => {
		cy.visit("localhost:1234");

		cy.contains("Sign up").click();

		cy.url().should("equal", "http://localhost:1234/sign-up");
	});

	it("should tell you name requirements on error", () => {
		cy.visit("localhost:1234/sign-up");

		cy.get(".button.button__primary").click();

		cy.contains("Name should not be empty.").should("exist");
		cy.contains("Email must be an email.").should("exist");
		cy
			.contains(
				"Password must contain letters (lowercase and uppercase), number(s), special character(s) and be at least 8 characters long."
			)
			.should("exist");
	});

	it("should tell you email requirements on error", () => {
		cy.visit("localhost:1234/sign-up");

		cy.get(".button.button__primary").click();

		cy.contains("Email must be an email.").should("exist");
	});

	it("should tell you password requirements on error", () => {
		cy.visit("localhost:1234/sign-up");

		cy.get(".button.button__primary").click();

		cy
			.contains(
				"Password must contain letters (lowercase and uppercase), number(s), special character(s) and be at least 8 characters long."
			)
			.should("exist");
	});

	it("should let you sign up", () => {
		cy.visit("localhost:1234/sign-up");
		const name = `AUTOMATED_TEST_${new moment().format("YYYY-MM-DD.hh-mm-ss")}`;

		cy.get(":nth-child(1) > .form__input").type(name);
		cy.get(":nth-child(2) > .form__input").type("user");
		cy.get(":nth-child(3) > .form__input").type(`${name}@ewanmorrison.co.uk`);
		cy.get(":nth-child(4) > .form__input").type("Password123!");

		cy.get(".button.button__primary").click();

		cy.url().should("equal", "http://localhost:1234/dashboard");
		cy.window().then((window) => {
			const token = window.localStorage.getItem("token");

			expect(token).to.be.a("string").and.to.include("ey");
		});
	});

	it("should let you sign up, sign out then sign in", () => {
		cy.visit("localhost:1234/sign-up");
		const name = `AUTOMATED_TEST_${new moment().format("YYYY-MM-DD.hh-mm-ss")}`;

		cy.get(":nth-child(1) > .form__input").type(name);
		cy.get(":nth-child(2) > .form__input").type("user");
		cy.get(":nth-child(3) > .form__input").type(`${name}@ewanmorrison.co.uk`);
		cy.get(":nth-child(4) > .form__input").type("Password123!");

		cy.get(".button.button__primary").click();

		cy.url().should("equal", "http://localhost:1234/dashboard");
		cy.window().then((window) => {
			const token = window.localStorage.getItem("token");
			expect(token).to.be.a("string").and.to.include("ey");
		});

		cy.contains("Sign out").click();
		cy.url().should("equal", "http://localhost:1234/");
		cy.window().then((window) => {
			const token = window.localStorage.getItem("token");
			expect(token).to.be.a("string").and.to.equal("");
		});

		cy.contains("Sign in").click();
		cy.url().should("equal", "http://localhost:1234/sign-in");

		cy.get(":nth-child(1) > .form__input").type(`${name}@ewanmorrison.co.uk`);
		cy.get(":nth-child(2) > .form__input").type("Password123!");

		cy.get(".button.button__primary").click();
		cy.url().should("equal", "http://localhost:1234/dashboard");
	});

	it("should let you send a magic email link", () => {
		cy.visit("localhost:1234/sign-in");

		cy.contains("magic link").click();
		cy.url().should("equal", "http://localhost:1234/magic-link");

		cy.get(".form__input").type("magic@ewanmorrison.co.uk");
		cy.get(".button.button__primary").click();

		cy
			.contains(
				"If you have an account registered with us by that email you should find a magic sign in link in your inbox."
			)
			.should("exist");
	});
});
