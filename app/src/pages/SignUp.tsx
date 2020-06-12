import * as React from "react";
import { MouseEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import SignUpImage from "../assets/illustrations/receptionist_monochromatic.svg";
import { Errors } from "../components/Errors";
import { Icon } from "../components/Icon";
import { Role, roles } from "../constants/roles.type";
import { useHttpClient } from "../hooks/use-http-client";
import { tokenAtom } from "../store/auth.state";

export const SignUp = () => {
	const [name, setName] = useState("");
	const [role, setRole] = useState("user" as Role);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([] as string[]);

	const [_, setToken] = useRecoilState(tokenAtom);
	const [isSendingRequest, setIsSendingRequest] = useState(false);

	const history = useHistory();
	const http = useHttpClient();

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setErrors([]);
		setIsSendingRequest(true);

		try {
			const result = await http.request({
				method: "POST",
				uri: "sign-up",
				body: { email, password, name, role },
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
			setErrors(["Something went wrong signing you up."]);
		}
	};

	return (
		<div className="page">
			<div className="page__row">
				<div className="page__col page__col--fixedWidth">
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
							disabled={isSendingRequest}
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
				<div className="page__col page__col--centerImage">
					<img
						alt="Vector illustration of a receptionist"
						className="page__mainImage"
						src={SignUpImage}
					/>
				</div>
			</div>
		</div>
	);
};
