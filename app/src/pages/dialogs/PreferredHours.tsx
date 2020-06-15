import * as React from "react";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import SuccessImage from "../../assets/illustrations/fast_working__monochromatic.svg";
import { Errors } from "../../components/Errors";
import { Icon } from "../../components/Icon";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useHttpClient } from "../../hooks/use-http-client";
import { selectUserDetails } from "../../store/auth.state";
import { DialogComponent } from "./dialog-component.interface";
import { TokenPayload } from "../../types/token-payload.type";

enum State {
	Unset,
	Loading,
	Set,
	Saving,
	Saved,
}

export const PreferredHours: DialogComponent = ({ closeDialog }) => {
	const [situation, setSituation] = useState(State.Loading);
	const [hours, setHours] = useState(1);
	const [errors, setErrors] = useState([] as string[]);
	const http = useHttpClient();
	const userDetails = useRecoilValue(selectUserDetails) as TokenPayload;

	useEffect(() => {
		(async () => {
			try {
				const result = await http.request({
					method: "GET",
					uri: `user-preferences/${userDetails?.id}`,
					withAuth: true,
				});
				if (result.preferredHours) {
					setSituation(State.Set);
					setHours(result.preferredHours[userDetails.id]);
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
		setErrors([]);

		(async () => {
			try {
				const result = await http.request({
					method: "POST",
					uri: `user-preferences/${userDetails?.id}`,
					withAuth: true,
					body: { preferredHours: hours },
				});
				if (result.preferredHours) {
					setSituation(State.Saved);
				} else {
					if (result.error) {
						setErrors(
							Array.isArray(result.message)
								? result.message
								: ["Something went wrong saving your preferred hours."]
						);
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
				<p className="paragraph paragraph--hero">
					<LoadingSpinner />
				</p>
			)}
			{situation === State.Saved && (
				<>
					<p className="paragraph">
						Your preferred schedule of {hours} working hours per day has been saved.
					</p>
					<img
						src={SuccessImage}
						className="modal__image"
						alt="A drawing of someone riding a rocket"
					/>
					<button onClick={() => closeDialog()} className="button button__primary">
						Ok, close dialog
					</button>
				</>
			)}

			{[State.Set, State.Unset, State.Saving].includes(situation) && (
				<>
					<p className="paragraph">
						Choosing this makes it easy to see which days you have worked fewer hours
						than you want to.
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
							<Icon withMargin="left">schedule</Icon>Save preferred hours
						</button>
						<Errors errors={errors} />
					</form>
				</>
			)}
		</>
	);
};
