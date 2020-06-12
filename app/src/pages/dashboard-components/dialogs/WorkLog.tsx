import moment from "moment";
import * as React from "react";
import { FunctionComponent, MouseEvent, useState, useEffect } from "react";
import SuccessImage from "../../../assets/illustrations/focused_working_monochromatic.svg";
import { Errors } from "../../../components/Errors";
import { Icon } from "../../../components/Icon";
import { useHttpClient } from "../../../hooks/use-http-client";

enum Situation {
	Ready,
	Saving,
	Saved,
}

export const WorkLog: FunctionComponent<{ workLog: any }> = ({ workLog }) => {
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [note, setNote] = useState("");
	const [hoursWorked, setHoursWorked] = useState(1);
	const [errors, setErrors] = useState([] as string[]);
	const [situation, setSituation] = useState(Situation.Ready);

	useEffect(() => {
		if (workLog?.date) {
			setDate(moment(workLog.date).format("YYYY-MM-DD"));
		}
		setNote(workLog?.note ?? "");
		setHoursWorked(workLog?.hoursWorked ?? 1);
	}, [workLog]);
	const http = useHttpClient();

	const saveWorkLog = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setSituation(Situation.Saving);
		setErrors([]);

		(async () => {
			try {
				const result = await http.request({
					method: workLog ? "PATCH" : "POST",
					uri: `work-log${workLog ? `/${workLog.id}` : ""}`,
					withAuth: true,
					body: {
						date: moment(date, "YYYY-MM-DD").toISOString(),
						hoursWorked,
						note,
					},
				});
				if (result.error) {
					setSituation(Situation.Ready);

					setErrors(
						Array.isArray(result.message)
							? result.message
							: ["Something went wrong saving your work log."]
					);
				} else {
					setSituation(Situation.Saved);
				}
			} catch (error) {
				setSituation(Situation.Ready);
				setErrors(["Something went wrong saving your work log."]);
			}
		})();
	};

	return (
		<>
			{situation === Situation.Saved && (
				<>
					<p className="paragraph">
						The work log has been {workLog ? "updated" : "saved"}. You can now close
						this dialog using the close button or by pressing outside it.
					</p>
					<img
						src={SuccessImage}
						className="modal__image"
						alt="A drawing of someone working on their laptop"
					/>
				</>
			)}

			{[Situation.Ready, Situation.Saving].includes(situation) && (
				<form className="form">
					<label className="form__label">
						Note
						<input
							value={note}
							onChange={(e) => {
								setNote(e.target.value);
							}}
							className="form__input"
							type="text"
						/>
					</label>
					<label className="form__label">
						Hours spent
						<select
							className="form__input"
							style={{ width: "10ch" }}
							onChange={(e) => {
								if (e.target.value) {
									setHoursWorked(parseInt(e.target.value));
								}
							}}
							value={hoursWorked}
						>
							{[...Array(24).keys()].map((hour) => (
								<option key={hour + 1} value={hour + 1}>
									{hour + 1}
								</option>
							))}
						</select>
					</label>
					<label className="form__label">
						Date worked
						<input
							className="form__input"
							type="date"
							value={date}
							style={{ width: "20ch" }}
							onChange={(e) => {
								console.log(e.target.value);
								setDate(e.target.value);
							}}
						/>
					</label>
					<button
						className="button button__primary"
						type="submit"
						onClick={saveWorkLog}
						disabled={situation === Situation.Saving}
					>
						<Icon withMargin="left">work</Icon>
						{workLog ? "Save changes" : "Add work log"}
					</button>
					<Errors errors={errors} />
				</form>
			)}
		</>
	);
};