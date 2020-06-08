import { IsNotEmpty, IsEmail } from "class-validator";

export class MagicLinkDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;
}
