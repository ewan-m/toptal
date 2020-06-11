import * as React from "react";
import { MouseEvent, useEffect, useState } from "react";
import SuccessImage from "../../assets/illustrations/fast_working_monochromatic.svg";
import { Errors } from "../../components/Errors";
import { Icon } from "../../components/Icon";
import { useHttpClient } from "../../hooks/use-http-client";
import { useTokenManager } from "../../hooks/use-token-manager";

enum State {
	Unset,
	Loading,
	Set,
	Saving,
	Saved,
}

export const PreferredHours = () => {
	const [situation, setSituation] = useState(State.Loading);
	const [hours, setHours] = useState(1);
	const [errors, setErrors] = useState([] as string[]);
	const http = useHttpClient();
	const tokenManager = useTokenManager();

	useEffect(() => {
		(async () => {
			try {
				const result = await http.request({
					method: "GET",
					uri: `user-preferences/${tokenManager.getUserId()}`,
					withAuth: true,
				});
				if (result.preferredHours) {
					setSituation(State.Set);
					setHours(result.preferredHours);
				} else {
					setSituation(State.Unset);
				}
			} catch (error) {
				setSituation(State.Unset);
			}
		})();
	}, []);

	const saveHours = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const previousSituation = situation;
		setSituation(State.Saving);

		(async () => {
			try {
				const result = await http.request({
					method: "POST",
					uri: `user-preferences/${tokenManager.getUserId()}`,
					withAuth: true,
					body: { preferredHours: hours },
				});
				if (result.preferredHours) {
					setSituation(State.Saved);
				} else {
					if (result.error) {
						setErrors(result.message);
					}
					setSituation(previousSituation);
				}
			} catch (error) {
				setSituation(previousSituation);
				setErrors(["Something went wrong saving your preferred hours."]);
			}
		})();
	};

	return (
		<>
			{situation === State.Loading && (
				<p className="paragraph">Fetching your preferred hours.</p>
			)}
			{situation === State.Saved && (
				<>
					<p className="paragraph">
						Your preferred schedule of {hours} working hours per day has been saved.
						You can now close this dialog using the close button or by pressing
						outside it.
					</p>
					<img
						src={SuccessImage}
						className="modal__image"
						alt="A drawing of someone riding a rocket"
					/>
				</>
			)}

			{[State.Set, State.Unset, State.Saving].includes(situation) && (
				<>
					<p className="paragraph">
						Choosing this makes it easy to see which days you have worked
						fewer hours than you want to.
					</p>
					<form>
						<label className="form__label">
							Preferred working hours per day
							<select
								className="form__input"
								style={{ width: "10ch" }}
								onChange={(e) => {
									if (e.target.value) {
										setHours(parseInt(e.target.value));
									}
								}}
								value={hours}
							>
								{[...Array(24).keys()].map((hour) => (
									<option key={hour + 1} value={hour + 1}>
										{hour + 1}
									</option>
								))}
							</select>
						</label>
						<button
							onClick={saveHours}
							className="button button__primary"
							type="submit"
							disabled={situation === State.Saving}
						>
							<Icon withMargin="left">schedule</Icon>Save preferred working hours
						</button>
						<Errors errors={errors} />
					</form>
				</>
			)}
		</>
	);
};
