import { Role } from "./roles.type";

export type User = {
	role: Role;
	name: string;
	email: string;
    id: number;
    isDeleted: boolean;
};
