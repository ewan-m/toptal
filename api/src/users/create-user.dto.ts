import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Role } from "../auth/roles.type";
import { IsRole } from "../auth/validators/is-role.validator";
import { IsUniqueEmail } from "../auth/validators/is-unique-email.validator";

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	@IsUniqueEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@IsRole()
	role: Role;
}
