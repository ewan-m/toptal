import * as React from "react";
import { PreferredWorkingTime } from "./dashboard-components/PreferredWorkingTime";

export const Dashboard = () => {
	return (
		<div className="page">
			<h2 className="page__title">Dashboard</h2>
			<PreferredWorkingTime />
		</div>
	);
};
