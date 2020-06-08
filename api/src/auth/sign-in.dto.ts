import { IsNotEmpty, IsEmail } from "class-validator";
import { IsPasswordComplex } from "./is-password-complex.validator";

export class SignInDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@IsPasswordComplex()
	password: string;
}
