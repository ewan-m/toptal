import * as React from "react";
import { Link } from "react-router-dom";

export const SignUp = () => {
	return (
		<div className="page">
			<h2 className="page__title">Sign up</h2>
			<p className="paragraph">
				It doesn't take much to create an account and enjoy all our features.
			</p>
			<form className="form">
				<label className="form__label">
					Name
					<input className="form__input" type="text" />
				</label>
				<label className="form__label">
					Role
					<select className="form__input">
						<option>User</option>
						<option>User manager</option>
						<option>Admin</option>
					</select>
				</label>
				<label className="form__label">
					Username
					<input className="form__input" type="text" />
				</label>
				<label className="form__label">
					Password
					<input className="form__input" type="password" />
				</label>
				<button className="button button__primary button--large" type="submit">
					Sign up
				</button>
			</form>
			<section>
				<p className="paragraph paragraph--informational">
					Already have an account? No problem, simply{" "}
					<Link to="/sign-in">click here to sign in</Link>.
				</p>
			</section>
		</div>
	);
};
