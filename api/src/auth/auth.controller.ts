import {
	Body,
	Controller,
	HttpCode,
	Post,
	Put,
	UnauthorizedException,
} from "@nestjs/common";
import { pbkdf2Sync, randomBytes } from "crypto";
import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { SignInDto } from "./sign-in.dto";
import { SignUpDto } from "./sign-up.dto";
import { User } from "./user.entity";
import { MagicLinkDto } from "./magic-link.dto";
import { MailerService } from "@nestjs-modules/mailer";

@Controller()
export class AuthController {
	constructor(private readonly mail: MailerService) {}

	@Post("/sign-in")
	@HttpCode(200)
	async signIn(@Body() signInDto: SignInDto) {
		try {
			const user = await getRepository(User).findOneOrFail({
				email: signInDto.email,
			});

			const isPasswordCorrect =
				this.getPasswordHash(signInDto.password, user.passwordSalt) ===
				user.passwordHash;

			if (isPasswordCorrect) {
				return {
					token: this.getUserToken(user),
				};
			} else {
				throw Error();
			}
		} catch (error) {
			throw new UnauthorizedException([
				"There was an error logging in - either your password was incorrect or you need to sign up.",
			]);
		}
	}

	@Post("/magic-link")
	@HttpCode(200)
	async sendMagicEmailLink(@Body() magicLinkDto: MagicLinkDto) {
		try {
			const user = await getRepository(User).findOne({
				email: magicLinkDto.email,
			});

			if (user) {
				const token = this.getUserToken(user);

				await this.mail.sendMail({
					from: `'Glasshour' <${process.env.EMAIL_USER}>`,
					to: magicLinkDto.email,
					subject: "Glasshour Sign In Link",
					html: `
	<h1>
		Glasshour Sign In Link
	</h1>
	<p>
		Hi ${user.name},
	</p>
	<p style="max-width: 60ch;">
		To sign in to your account simply use the following magic link to be automatically signed in. It would be a good idea to then change your password once you've successfully signed in.
	</p>
	<p>
		<a href="${process.env.APPLICATION_URL}/sign-in?token=${token}">Sign in to Glasshour</a>
	</p>
	<p>
	Glasshour ❤️
	</p>`,
				});
			}
		} catch (error) {}

		return {
			message:
				"If a matching account was found then an email with a sign in link will be sent to your inbox.",
		};
	}

	@Put("/sign-up")
	async signUp(@Body() signUpDto: SignUpDto) {
		const user = new User();

		const passwordSalt = randomBytes(64).toString("base64");
		const passwordHash = this.getPasswordHash(signUpDto.password, passwordSalt);

		user.passwordHash = passwordHash;
		user.passwordSalt = passwordSalt;
		user.email = signUpDto.email;
		user.name = signUpDto.name;
		user.role = signUpDto.role;

		await getRepository(User).save(user);

		return { token: this.getUserToken(user) };
	}

	private getUserToken(user: User) {
		return sign(
			{ email: user.email, name: user.name, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);
	}

	private getPasswordHash(password, salt) {
		return pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("base64");
	}
}
