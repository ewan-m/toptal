import * as React from "react";
import { MouseEvent, useState } from "react";
import SuccessImage from "../../assets/illustrations/authentication__monochromatic.svg";
import { Errors } from "../../components/Errors";
import { Icon } from "../../components/Icon";
import { useHttpClient } from "../../hooks/use-http-client";
import { DialogComponent } from "./dialog-component.interface";

enum Situation {
	Ready,
	Saving,
	Saved,
}

export const ResetPassword: DialogComponent = ({ closeDialog }) => {
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([] as string[]);
	const [situation, setSituation] = useState(Situation.Ready);

	const http = useHttpClient();

	const saveUser = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setSituation(Situation.Saving);
		setErrors([]);

		(async () => {
			try {
				const result = await http.request({
					method: "POST",
					uri: `reset-password`,
					withAuth: true,
					body: { password },
				});
				if (result.error) {
					setSituation(Situation.Ready);

					setErrors(
						Array.isArray(result.message)
							? result.message
							: ["Something went wrong updating your password."]
					);
				} else {
					setSituation(Situation.Saved);
				}
			} catch (error) {
				setSituation(Situation.Ready);
				setErrors(["Something went wrong updating your password."]);
			}
		})();
	};

	return (
		<>
			{situation === Situation.Saved && (
				<>
					<p className="paragraph">Your password has been successfully reset.</p>
					<img
						src={SuccessImage}
						className="modal__image"
						alt="A drawing of someone working on their laptop"
					/>
					<button onClick={closeDialog} className="button button__primary">
						Ok, close dialog
					</button>
				</>
			)}

			{[Situation.Ready, Situation.Saving].includes(situation) && (
				<form className="form">
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
						className="button button__primary"
						type="submit"
						onClick={saveUser}
						disabled={situation === Situation.Saving}
					>
						<Icon withMargin="left">lock</Icon>
						Reset password
					</button>
					<Errors errors={errors} />
				</form>
			)}
		</>
	);
};
