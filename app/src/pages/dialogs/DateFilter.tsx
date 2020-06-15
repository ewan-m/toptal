import * as React from "react";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Icon } from "../../components/Icon";
import { dateFilterAtom } from "../../store/work-log-filter.state";
import "./DateFilter.scss";
import { DialogComponent } from "./dialog-component.interface";
import { workLogsFetchStatus } from "../../store/http-request.state";

export const DateFilter: DialogComponent = ({ closeDialog }) => {
	const [_, setWorkLogFetchStatus] = useRecoilState(workLogsFetchStatus);
	const [filter, setFilter] = useRecoilState(dateFilterAtom);
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");

	useEffect(() => {
		setFrom(filter.from);
		setTo(filter.to);
	}, [filter]);

	const saveFilter = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setWorkLogFetchStatus("stale");
		setFilter({ from, to });
	};
	const removeFilter = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setWorkLogFetchStatus("stale");
		setFilter({ from: "", to: "" });
	};

	return (
		<>
			<form>
				<div className="dateFilter__row">
					<label className="form__label dateFilter__container">
						From
						<input
							className="form__input"
							type="date"
							value={from}
							onChange={(e) => {
								setFrom(e.target.value);
							}}
							max={to}
						/>
					</label>

					<label className="form__label dateFilter__container">
						To
						<input
							className="form__input"
							type="date"
							value={to}
							onChange={(e) => {
								setTo(e.target.value);
							}}
							min={from}
						/>
					</label>
				</div>
				<div className="buttonRow">
					<button
						className="button button__primary"
						type="submit"
						onClick={saveFilter}
					>
						<Icon withMargin="left">filter_alt</Icon>Apply filter
					</button>
					{(filter.from || filter.to) && (
						<button
							className="button button__destructive"
							type="submit"
							onClick={removeFilter}
						>
							<Icon withMargin="left">filter_alt</Icon>Remove filter
						</button>
					)}
				</div>
			</form>
		</>
	);
};
