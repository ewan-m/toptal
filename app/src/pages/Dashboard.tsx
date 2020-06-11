import * as React from "react";
import { Modal } from "../components/Modal";
import { useState } from "react";
import { Icon } from "../components/Icon";
import { WorkLog } from "./dashboard-components/WorkLog";
import { PreferredHours } from "./dashboard-components/PreferredHours";

export const Dashboard = () => {
	const [visibleModal, setVisibleModal] = useState(
		"none" as "none" | "work" | "hours"
	);
	const closeModal = () => {
		setVisibleModal("none");
	};

	return (
		<>
			<div className="page">
				<h2 className="page__title">Dashboard</h2>
				<div className="buttonRow">
					<button
						onClick={() => {
							setVisibleModal("work");
						}}
						className="button button__secondary"
					>
						<Icon withMargin="left">work</Icon>Add a work log
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
						<Icon withMargin="left">cloud_download</Icon>Export your work
					</button>
				</div>
			</div>

			<Modal
				isVisible={visibleModal === "work"}
				onClose={closeModal}
				title="Add a work log"
			>
				<WorkLog />
			</Modal>
			<Modal
				isVisible={visibleModal === "hours"}
				onClose={closeModal}
				title="Choose your preferred hours"
			>
				<PreferredHours />
			</Modal>
		</>
	);
};
