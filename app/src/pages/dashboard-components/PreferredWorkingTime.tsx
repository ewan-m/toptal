import * as React from "react";
import { useState, useEffect } from "react";
import { useHttpClient } from "../../hooks/use-http-client";

enum State {
	Unset,
	Loading,
	Set,
}

export const PreferredWorkingTime = () => {
	const [situation, setSituation] = useState(State.Loading);
	const [hours, setHours] = useState(10);
	const http = useHttpClient();

	useEffect(() => {});

	switch (situation) {
		case State.Unset:
			return (
				<>
					<p className="paragraph">
						You haven't told us how many hours you want to work per day yet.
					</p>
					<button className="button button__primary button--large">
						Choose number of hours
					</button>
				</>
			);
		case State.Loading:
			return <p>Fetching your number of hours.</p>;
		case State.Set:
			return (
				<>
					<p>Your preferred number of hours is {hours}.</p>
					<button className="button button__primary button--large">
						Change number of hours
					</button>
				</>
			);

		default:
			return <p>Something went wrong fetching your preferred number of hours.</p>;
	}
};
