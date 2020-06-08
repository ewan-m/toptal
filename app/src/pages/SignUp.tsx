import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import { useState, MouseEvent } from "react";
import { roles, Role } from "../constants/roles";
import { useHttpClient } from "../hooks/use-http-client";
import { useTokenManager } from "../hooks/use-token-manager";
import { Icon } from "../components/Icon";
import { Errors } from "../components/Errors";

export const SignUp = () => {
	const [name, setName] = useState("");
	const [role, setRole] = useState("user" as Role);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([]);

	const history = useHistory();
	const http = useHttpClient();
	const tokenManager = useTokenManager();

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setErrors([]);

		const result = await http.request({
			method: "PUT",
			uri: "sign-up",
			body: { email, password, name, role },
			withAuth: false,
		});

		if (result.token) {
			tokenManager.setToken(result.token);
			history.push("/dashboard");
		}

		if (result.error) {
			setErrors(result.message);
		}
	};

	return (
		<div className="page">
			<h2 className="page__title">Sign up</h2>
			<p className="paragraph">
				To create your account we first need some information about you.
			</p>
			<form className="form card">
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
							setRole(e.target.value as Role);
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
					Email
					<input
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
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
					Sign up<Icon withMargin="right">arrow_forward_ios</Icon>
				</button>
				<Errors errors={errors} />
			</form>
			<p className="paragraph paragraph--informational">
				Already have an account? No problem, simply{" "}
				<Link to="/sign-in">click here to sign in</Link>.
			</p>
		</div>
	);
};
