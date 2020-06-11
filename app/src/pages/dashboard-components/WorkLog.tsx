import moment from "moment";
import * as React from "react";
import { useState } from "react";
import { Errors } from "../../components/Errors";
import { Icon } from "../../components/Icon";

export const WorkLog = () => {
	const [date, setDate] = useState(moment());
	const [note, setNote] = useState("");
	const [hours, setHours] = useState(1);
	const [errors, setErrors] = useState([]);

	return (
		<>
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
					Hours spent working
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
				<button className="button button__primary button--large" type="submit">
					<Icon withMargin="left">add</Icon>Add work log
				</button>
				<Errors errors={errors} />
			</form>
		</>
	);
};
