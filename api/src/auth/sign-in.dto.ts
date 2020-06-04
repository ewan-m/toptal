import { IsNotEmpty, IsEmail } from "class-validator";

export class SignInDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	password: string;
}
