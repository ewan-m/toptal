import * as React from "react";
import { Link } from "react-router-dom";

export const SignIn = () => {
	return (
		<div className="page">
			<h2 className="page__title">Sign in</h2>
			<p className="paragraph">
				Just pop in your username and password and enjoy!
			</p>
			<form className="form">
				<label className="form__label">
					Username
					<input className="form__input" type="text" />
				</label>
				<label className="form__label">
					Password
					<input className="form__input" type="password" />
				</label>
				<button className="button button__primary button--large" type="submit">
					Sign in
				</button>
			</form>
			<section>
				<p className="paragraph paragraph--informational">
					Don't have an account? No problem, simply{" "}
					<Link to="/sign-up">click here to sign up</Link>.
				</p>
			</section>
		</div>
	);
};
