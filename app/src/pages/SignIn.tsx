import * as React from "react";
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
import { useState, MouseEvent, useEffect } from "react";
import { useHttpClient } from "../hooks/use-http-client";
import { useTokenManager } from "../hooks/use-token-manager";
import { Icon } from "../components/Icon";
import { Errors } from "../components/Errors";

export const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([] as string[]);
	const token = new URLSearchParams(useLocation().search).get("token");
	const http = useHttpClient();
	const tokenManager = useTokenManager();
	const history = useHistory();

	useEffect(() => {
		if (token) {
			tokenManager.setToken(token);
			history.push("/dashboard");
		}
	}, [token]);

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setErrors([]);

		const result = await http.request({
			method: "POST",
			uri: "sign-in",
			body: { email, password },
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
			<h2 className="page__title">Sign in</h2>
			<p className="paragraph">Enter your email and password to get started.</p>
			<form className="form card">
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
					className="button button__primary button--large"
					onClick={onSubmit}
					type="submit"
				>
					Sign in<Icon withMargin="right">arrow_forward_ios</Icon>
				</button>
				<Errors errors={errors} />
			</form>
			<p className="paragraph paragraph--informational">
				Don't have an account? No problem, simply{" "}
				<Link to="/sign-up">click here to sign up</Link>.
			</p>

			<p className="paragraph paragraph--informational">
				Forgotten your password? No problem, simply{" "}
				<Link to="/magic-link">click here to get a magic link</Link>.
			</p>
		</div>
	);
};
