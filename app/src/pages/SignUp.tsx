import * as React from "react";
import { Link } from "react-router-dom";
import { useState, MouseEvent } from "react";
import { roles } from "../constants/roles";

export const SignUp = () => {
	const [name, setName] = useState("");
	const [role, setRole] = useState(roles.user);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const onSubmit = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		console.log({ username, password, name, role });
	};

	return (
		<div className="page">
			<h2 className="page__title">Sign up</h2>
			<p className="paragraph">
				To create your account we first need some information about you.
			</p>
			<form className="form">
				<label className="form__label">
					Name
					<input
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
						className="form__input"
						type="text"
					/>
				</label>
				<label className="form__label">
					Role
					<select
						className="form__input"
						onChange={(e) => {
							setRole(e.target.value);
						}}
						value={role}
					>
						{Object.entries(roles).map(([roleValue, roleDisplay]) => (
							<option key={roleValue} value={roleValue}>
								{roleDisplay}
							</option>
						))}
					</select>
				</label>
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
					onClick={onSubmit}
					className="button button__primary button--large"
					type="submit"
				>
					Sign up
				</button>
			</form>
			<p className="paragraph paragraph--informational">
				Already have an account? No problem, simply{" "}
				<Link to="/sign-in">click here to sign in</Link>.
			</p>
		</div>
	);
};
