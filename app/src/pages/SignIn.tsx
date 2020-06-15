import * as React from "react";
import { MouseEvent, useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import SignInImage from "../assets/illustrations/authentication__monochromatic.svg";
import { Errors } from "../components/Errors";
import { Icon } from "../components/Icon";
import { useHttpClient } from "../hooks/use-http-client";
import { tokenAtom } from "../store/auth.state";

export const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([] as string[]);
	const [isSendingRequest, setIsSendingRequest] = useState(false);

	const [_, setToken] = useRecoilState(tokenAtom);

	const token = new URLSearchParams(useLocation().search).get("token");
	const http = useHttpClient();
	const history = useHistory();

	useEffect(() => {
		if (token) {
			setToken(token);
			history.push("/dashboard");
		}
	}, [token]);

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setErrors([]);
		setIsSendingRequest(true);

		try {
			const result = await http.request({
				method: "POST",
				uri: "sign-in",
				body: { email, password },
				withAuth: false,
			});

			setIsSendingRequest(false);
			if (result.token) {
				setToken(result.token);
				history.push("/dashboard");
			}

			if (result.error) {
				setErrors(result.message);
			}
		} catch (error) {
			setIsSendingRequest(false);
			setErrors(["Something went wrong signing you in."]);
		}
	};

	return (
		<div className="page page--flex">
			<div className="page__row">
				<div className="page__col page__col--fixedWidth">
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
								type="email"
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
							disabled={isSendingRequest}
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
				<div className="page__col">
					<img
						className="page__mainImage"
						alt="Vector illustration of a sign in screen"
						src={SignInImage}
					/>
				</div>
			</div>
		</div>
	);
};
