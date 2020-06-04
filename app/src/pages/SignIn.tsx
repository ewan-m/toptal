import * as React from "react";
import { Link } from "react-router-dom";
import { useState, MouseEvent } from "react";

export const SignIn = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const onSubmit = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		console.log({ username, password });
	};

	return (
		<div className="page">
			<h2 className="page__title">Sign in</h2>
			<p className="paragraph">Enter your username and password to get started.</p>
			<form className="form">
				<label className="form__label">
					Username
					<input
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						className="form__input"
						type="text"
					/>
				</label>
				<label className="form__label">
					Password
					<input
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						className="form__input"
						type="password"
					/>
				</label>
				<button
					className="button button__primary button--large"
					onClick={onSubmit}
					type="submit"
				>
					Sign in
				</button>
			</form>
			<p className="paragraph paragraph--informational">
				Don't have an account? No problem, simply{" "}
				<Link to="/sign-up">click here to sign up</Link>.
			</p>
		</div>
	);
};
