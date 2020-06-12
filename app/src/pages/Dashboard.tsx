import moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Icon } from "../components/Icon";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Modal } from "../components/Modal";
import { useHttpClient } from "../hooks/use-http-client";
import { selectUserDetails } from "../store/auth.state";
import { selectDateFilter } from "../store/work-log-filter.state";
import { DateFilter } from "./dashboard-components/dialogs/DateFilter";
import { DeleteResource } from "./dashboard-components/dialogs/DeleteResource";
import { PreferredHours } from "./dashboard-components/dialogs/PreferredHours";
import { WorkLog } from "./dashboard-components/dialogs/WorkLog";

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

	return `?${params.join("&")}`;
};

export const Dashboard = () => {
	const [situation, setSituation] = useState(Situation.loading);
	const [visibleModal, setVisibleModal] = useState("none" as ModalWindows);
	const [workLogs, setWorkLogs] = useState([] as any[]);
	const [selectedWorkLog, setSelectedWorkLog] = useState(null as any);
	const http = useHttpClient();
	const userDetails = useRecoilValue(selectUserDetails);
	const dateFilter = useRecoilValue(selectDateFilter);

	const fetchLogs = async () => {
		setWorkLogs([]);
		setSituation(Situation.loading);
		try {
			let uri = "work-log";
			if (dateFilter?.from || dateFilter?.to) {
				uri += getQueryParams(dateFilter);
			}
			const result = await http.request({
				method: "GET",
				uri: uri,
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
	useEffect(() => {
		fetchLogs();
	}, []);

	const closeModal = () => {
		fetchLogs();
		setVisibleModal("none");
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
					<button className="button button__secondary">
						<Icon withMargin="left">cloud_download</Icon>Export
					</button>
				</div>
				{situation === Situation.loading && <LoadingSpinner />}
				{situation === Situation.loaded && (
					<>
						{workLogs.length === 0 && (
							<p className="paragraph card">No work logs to show.</p>
						)}
						{workLogs.length >= 1 && (
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
										<tr key={log.id}>
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
						)}
					</>
				)}
			</div>

			<Modal
				isVisible={visibleModal === "work"}
				onClose={closeModal}
				title={selectedWorkLog ? "Edit work log" : "Add a work log"}
			>
				<WorkLog workLog={selectedWorkLog} />
			</Modal>
			<Modal
				isVisible={visibleModal === "hours"}
				onClose={closeModal}
				title="Choose your preferred hours"
			>
				<PreferredHours />
			</Modal>
			<Modal
				isVisible={visibleModal === "delete"}
				onClose={closeModal}
				title="Delete work log"
			>
				<DeleteResource
					uri={`work-log/${selectedWorkLog?.id}`}
					resourceName="work log"
				/>
			</Modal>
			<Modal
				isVisible={visibleModal === "filter"}
				onClose={closeModal}
				title="Filter work logs"
			>
				<DateFilter />
			</Modal>
		</>
	);
};
