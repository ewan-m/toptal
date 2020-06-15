import { User } from "./user.type";

export type WorkLog = {
	date: string;
	hoursWorked: number;
	id: number;
	note: string;
	user: User;
};
