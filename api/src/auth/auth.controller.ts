import { MailerService } from "@nestjs-modules/mailer";
import {
	Body,
	Controller,
	Headers,
	HttpCode,
	InternalServerErrorException,
	Post,
	Put,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { pbkdf2Sync, randomBytes } from "crypto";
import { decode, sign } from "jsonwebtoken";
import { HasValidTokenGuard } from "src/guards/has-valid-token.guard";
import { Repository } from "typeorm";
import { MagicLinkDto } from "./dto/magic-link.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { TokenPayload } from "./token-payload.type";
import { User } from "./user.entity";

@Controller()
export class AuthController {
	constructor(
		private readonly mail: MailerService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	@Post("/sign-in")
	@HttpCode(200)
	async signIn(@Body() signInDto: SignInDto) {
		try {
			const user = await this.userRepository.findOneOrFail({
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
			const user = await this.userRepository.findOne({
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

	@Post("/reset-password")
	@UseGuards(HasValidTokenGuard)
	async resetPassword(
		@Body() resetPasswordDto: ResetPasswordDto,
		@Headers("authorization") authHeader: string
	) {
		const token = authHeader.split(" ")?.[1];

		if (token) {
			try {
				const userId = (decode(token) as TokenPayload).id;
				const user = await this.userRepository.findOneOrFail(userId);
				const passwordSalt = this.getSalt();
				user.passwordSalt = passwordSalt;
				user.passwordHash = this.getPasswordHash(
					resetPasswordDto.password,
					passwordSalt
				);
				await this.userRepository.save(user);

				return {};
			} catch (error) {}
		}

		throw new InternalServerErrorException([
			"Something went wrong updating your password",
		]);
	}

	@Put("/sign-up")
	async signUp(@Body() signUpDto: SignUpDto) {
		const user = new User();

		const passwordSalt = this.getSalt();
		const passwordHash = this.getPasswordHash(signUpDto.password, passwordSalt);

		user.passwordHash = passwordHash;
		user.passwordSalt = passwordSalt;
		user.email = signUpDto.email;
		user.name = signUpDto.name;
		user.role = signUpDto.role;

		await this.userRepository.save(user);

		return { token: this.getUserToken(user) };
	}

	private getUserToken(user: User) {
		return sign(
			{
				email: user.email,
				name: user.name,
				role: user.role,
				id: user.id,
			} as TokenPayload,
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);
	}

	private getPasswordHash(password, salt) {
		return pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("base64");
	}

	private getSalt() {
		return randomBytes(64).toString("base64");
	}
}
