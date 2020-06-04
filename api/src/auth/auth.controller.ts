import { Controller, Post, Body } from "@nestjs/common";
import { SignInDto } from "./sign-in.dto";
import { SignUpDto } from "./sign-up.dto";

@Controller()
export class AuthController {
	constructor() {}

	@Post("/sign-in")
	signIn(@Body() signInDto: SignInDto): string {
		return JSON.stringify(signInDto);
	}

	@Post("/sign-up")
	signUp(@Body() signUpDto: SignUpDto): string {
		return JSON.stringify(signUpDto);
	}
}
