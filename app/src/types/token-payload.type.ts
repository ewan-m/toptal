import { Role } from "./roles.type";

export type TokenPayload = {
	role: Role;
	name: string;
	email: string;
	id: number;
};
