import { Role } from "../constants/roles";
import { IsNotEmpty, IsEmail, IsAlpha } from "class-validator";
import { IsRole } from "./is-role.validator";

export class SignUpDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	@IsRole()
	role: Role;
}
