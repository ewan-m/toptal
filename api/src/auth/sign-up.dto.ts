import { IsEmail, IsNotEmpty } from "class-validator";
import { IsPasswordComplex } from "./is-password-complex.validator";
import { IsRole } from "./is-role.validator";
import { IsUniqueEmail } from "./is-unique-email.validator";
import { Role } from "./roles.type";

export class SignUpDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	@IsUniqueEmail()
	email: string;

	@IsNotEmpty()
	@IsPasswordComplex()
	password: string;

	@IsNotEmpty()
	@IsRole()
	role: Role;
}
