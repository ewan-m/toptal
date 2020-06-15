import { IsEmail, IsString, ValidateIf } from "class-validator";
import { Role } from "../auth/roles.type";
import { IsRole } from "../auth/validators/is-role.validator";
import { IsUniqueEmail } from "../auth/validators/is-unique-email.validator";

export class UpdateUserDto {
	@ValidateIf(u => u.name !== undefined)
	@IsString()

	name?: string;

	@ValidateIf(u => u.email !== undefined)
	@IsString()
	@IsEmail()
	@IsUniqueEmail()
	email?: string;

	@ValidateIf(u => u.role !== undefined)
	@IsString()
	@IsRole()
	role?: Role;
}
