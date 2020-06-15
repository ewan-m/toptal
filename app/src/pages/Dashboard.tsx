import moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Icon } from "../components/Icon";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Modal } from "../components/Modal";
import { useHttpClient } from "../hooks/use-http-client";
import { selectUserDetails } from "../store/auth.state";
import { selectDateFilter } from "../store/work-log-filter.state";
import { WorkLog } from "../types/work-log.type";
import { DateFilter } from "./dialogs/DateFilter";
import { DeleteResource } from "./dialogs/DeleteResource";
import { PreferredHours } from "./dialogs/PreferredHours";
import { UpsertWorkLog } from "./dialogs/UpsertWorkLog";
import { getWorkLogsAsHtml } from "./helpers/get-work-logs-as-html";

type ModalWindows = "none" | "work" | "hours" | "delete" | "filter";

enum Situation {
	loading,
	loaded,
	error,
}
const getQueryParams = (object: any) => {
	const params: string[] = [];

	Object.keys(object).forEach((key) => {
		if (object?.[key]) {
			params.push(`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`);
		}
	});

	return `${params.join("&")}`;
};

export const Dashboard = () => {
	const [situation, setSituation] = useState(Situation.loading);
	const [visibleModal, setVisibleModal] = useState("none" as ModalWindows);
	const [workLogs, setWorkLogs] = useState([] as WorkLog[]);
	const [showTargetMetStyling, setShowTargetMetStyling] = useState(false);
	const [preferredHours, setPreferredHours] = useState(
		{} as { [userId: number]: number }
	);
	const [selectedWorkLog, setSelectedWorkLog] = useState(null as WorkLog | null);
	const http = useHttpClient();
	const userDetails = useRecoilValue(selectUserDetails);
	const dateFilter = useRecoilValue(selectDateFilter);
	const history = useHistory();

	useEffect(() => {
		if (userDetails?.role === "userManager") {
			history.push("/user");
		}
	}, [userDetails?.role]);

	useEffect(() => {
		fetchPreferences();
		fetchLogs();
	}, []);

	const fetchPreferences = async () => {
		try {
			const result = await http.request({
				method: "GET",
				uri: `user-preferences${
					userDetails?.role === "user" ? `/${userDetails?.id}` : ""
				} `,
				withAuth: true,
			});
			if (result.preferredHours) {
				setPreferredHours(result.preferredHours);
			}
		} catch (error) {}
	};

	const fetchLogs = async () => {
		setWorkLogs([]);
		setSituation(Situation.loading);
		try {
			const result = await http.request({
				method: "GET",
				uri: `work-log?${getQueryParams(dateFilter)}`,
				withAuth: true,
			});
			if (Array.isArray(result)) {
				setWorkLogs(result);
				setSituation(Situation.loaded);
			} else {
				setSituation(Situation.error);
			}
		} catch (error) {
			setSituation(Situation.error);
		}
	};

	const closeModal = () => {
		fetchLogs();
		fetchPreferences();
		setVisibleModal("none");
	};

	const getTargetMetStatus = (
		date: string,
		userId: number
	): "success" | "failure" | "unknown" => {
		if (!preferredHours[userId]) {
			return "unknown";
		}

		const workLogsForUserOnDate = workLogs.filter(
			(workLog) => workLog.date === date && workLog.user.id === userId
		);

		const cumulativeHoursOnDateForUser = workLogsForUserOnDate.reduce(
			(accumulator, current) => accumulator + current.hoursWorked,
			0
		);

		return cumulativeHoursOnDateForUser >= preferredHours[userId]
			? "success"
			: "failure";
	};

	return (
		<>
			<div className="page">
				<h2 className="page__title">Dashboard</h2>
				<div className="buttonRow">
					<button
						onClick={() => {
							setSelectedWorkLog(null);
							setVisibleModal("work");
						}}
						className="button button__secondary"
					>
						<Icon withMargin="left">work</Icon>Add a work log
					</button>
					<button
						onClick={() => {
							setVisibleModal("filter");
						}}
						className="button button__secondary"
					>
						<Icon withMargin="left">filter_alt</Icon>Filter work logs
					</button>
					<button
						onClick={() => {
							setVisibleModal("hours");
						}}
						className="button button__secondary"
					>
						<Icon withMargin="left">schedule</Icon>Choose your preferred hours
					</button>
					{workLogs && workLogs?.length > 0 && (
						<a
							href={getWorkLogsAsHtml(workLogs)}
							download="WorkLogs.html"
							className="button button__secondary"
						>
							<Icon withMargin="left">cloud_download</Icon>Export
						</a>
					)}

					<button
						className="button button__secondary"
						onClick={() => {
							setShowTargetMetStyling(!showTargetMetStyling);
						}}
					>
						{showTargetMetStyling ? (
							<>
								<Icon withMargin="left">visibility_off</Icon>Hide targets
							</>
						) : (
							<>
								<Icon withMargin="left">visibility</Icon>Show targets
							</>
						)}
					</button>
				</div>
				{situation === Situation.loading && <LoadingSpinner />}
				{situation === Situation.error && (
					<p className="paragraph paragraph--error card">
						<Icon withMargin="left">error</Icon> Something went wrong loading work
						logs. Please try again later.
					</p>
				)}
				{situation === Situation.loaded && (
					<>
						{workLogs.length === 0 && (
							<p className="paragraph card">No work logs to show.</p>
						)}
						{workLogs.length >= 1 && (
							<>
								{showTargetMetStyling && (
									<p className="paragraph paragraph--informational">
										The green highlighting indicates days where users met their target
										number of hours. The red indicates days they missed and grey means the
										user hasn't supplied a target number of hours.
									</p>
								)}
								<table className="table">
									<thead>
										<tr>
											{userDetails?.role === "admin" && <th>User</th>}
											<th>Note</th>
											<th>Date</th>
											<th>Hours worked</th>
											<th className="table__cell--fixedWidth"></th>
											<th className="table__cell--fixedWidth"></th>
										</tr>
									</thead>
									<tbody>
										{workLogs.map((log) => (
											<tr
												key={log.id}
												className={
													showTargetMetStyling
														? `table__${getTargetMetStatus(log.date, log.user.id)}Row`
														: ""
												}
											>
												{userDetails?.role === "admin" && <td>{log.user.name}</td>}
												<td>{log.note}</td>
												<td>{moment(log.date).format("LL")}</td>
												<td>{log.hoursWorked}</td>
												<td className="table__cell--fixedWidth">
													<button
														onClick={() => {
															setSelectedWorkLog(log);
															setVisibleModal("work");
														}}
														className="button button__secondary"
													>
														<Icon withMargin="left">edit</Icon>Edit
													</button>
												</td>
												<td className="table__cell--fixedWidth">
													<button
														className="button button__destructive"
														onClick={() => {
															setSelectedWorkLog(log);
															setVisibleModal("delete");
														}}
													>
														<Icon withMargin="left">delete</Icon>Delete
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</>
						)}
					</>
				)}
			</div>

			<Modal
				isVisible={visibleModal === "work"}
				onClose={closeModal}
				title={selectedWorkLog ? "Edit work log" : "Add a work log"}
			>
				<UpsertWorkLog closeDialog={closeModal} workLog={selectedWorkLog} />
			</Modal>
			<Modal
				isVisible={visibleModal === "hours"}
				onClose={closeModal}
				title="Choose your preferred hours"
			>
				<PreferredHours closeDialog={closeModal} />
			</Modal>
			<Modal
				isVisible={visibleModal === "delete"}
				onClose={closeModal}
				title="Delete work log"
			>
				<DeleteResource
					closeDialog={closeModal}
					uri={`work-log/${selectedWorkLog?.id}`}
					resourceName="work log"
				/>
			</Modal>
			<Modal
				isVisible={visibleModal === "filter"}
				onClose={closeModal}
				title="Filter work logs"
			>
				<DateFilter closeDialog={closeModal} />
			</Modal>
		</>
	);
};
