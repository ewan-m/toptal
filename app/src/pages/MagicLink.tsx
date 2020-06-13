import * as React from "react";
import { MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useHttpClient } from "../hooks/use-http-client";
import { Icon } from "../components/Icon";
import { Errors } from "../components/Errors";
import MagicLinkImage from "../assets/illustrations/new_message__monochromatic.svg";

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

		try {
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
		} catch (error) {
			setErrors(["Something went wrong sending you a magic link."]);
			setSituation(Situation.initial);
		}
	};

	return (
		<div className="page page--flex">
			<div className="page__row">
				<div className="page__col page__col--fixedWidth">
					<h2 className="page__title">Magic link</h2>
					<p className="paragraph">
						Enter the email you signed up with to send a sign in link to your inbox.
					</p>
					{(situation === Situation.initial || situation === Situation.sending) && (
						<>
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
									disabled={situation === Situation.sending}
								>
									Send a magic link<Icon withMargin="right">arrow_forward_ios</Icon>
								</button>
								<Errors errors={errors} />
							</form>
						</>
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
				<div className="page__col page__col--centerImage">
					<img
						className="page__mainImage"
						src={MagicLinkImage}
						alt="Vector illustration of new message"
					/>
				</div>
			</div>
		</div>
	);
};
