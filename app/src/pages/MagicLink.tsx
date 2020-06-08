import * as React from "react";
import { MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useHttpClient } from "../hooks/use-http-client";
import { Icon } from "../components/Icon";
import { Errors } from "../components/Errors";

enum Situation {
	initial,
	sending,
	success,
}

export const MagicLink = () => {
	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState([] as string[]);
	const [situation, setSituation] = useState(Situation.initial);
	const http = useHttpClient();

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setSituation(Situation.sending);
		setErrors([]);

		const result = await http.request({
			method: "POST",
			uri: "magic-link",
			body: { email },
			withAuth: false,
		});

		if (result.error) {
			setErrors(result.message);
			setSituation(Situation.initial);
		} else {
			setSituation(Situation.success);
		}
	};

	return (
		<div className="page">
			<h2 className="page__title">Magic link</h2>
			{situation === Situation.initial && (
				<>
					<p className="paragraph">
						Enter the email you signed up with to send a sign in link to your email.
					</p>
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
						<button
							className="button button__primary button--large"
							onClick={onSubmit}
							type="submit"
						>
							Send a magic link<Icon withMargin="right">arrow_forward_ios</Icon>
						</button>
						<Errors errors={errors} />
					</form>
				</>
			)}
			{situation === Situation.sending && (
				<p className="card">Sending your magic link.</p>
			)}
			{situation === Situation.success && (
				<p className="card">
					If you have an account registered with us by that email you should find a
					magic sign in link in your inbox.
				</p>
			)}
			<p className="paragraph paragraph--informational">
				Remembered your password? No problem, simply{" "}
				<Link to="/sign-in">click here to sign in</Link>.
			</p>
		</div>
	);
};
