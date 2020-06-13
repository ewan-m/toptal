import { IsEmail, IsString } from "class-validator";
import { Role } from "../auth/roles.type";
import { IsRole } from "../auth/validators/is-role.validator";
import { IsUniqueEmail } from "../auth/validators/is-unique-email.validator";

export class UpdateUserDto {
	@IsString()
	name?: string;

	@IsString()
	@IsEmail()
	@IsUniqueEmail()
	email?: string;

	@IsString()
	@IsRole()
	role?: Role;
}
