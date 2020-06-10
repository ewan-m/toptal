import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth/auth.controller";
import { IsUniqueEmailConstraint } from "./auth/validators/is-unique-email.validator";
import { User } from "./auth/user.entity";
import { HasValidTokenGuard } from "./guards/has-valid-token.guard";
import config from "./orm-config";
import { UserPreferencesController } from "./user-preference/user-preferences.controller";
import { UserPreference } from "./user-preference/user-preferences.entity";
import { WorkLog } from "./work-log/work-log.entity";
import { TokenIdMatchesRequestedId } from "./guards/token-id-matches-requested-id.guard";

@Module({
	imports: [
		TypeOrmModule.forRoot(config),
		TypeOrmModule.forFeature([User, UserPreference, WorkLog]),
		MailerModule.forRoot({
			transport: {
				service: "gmail",
				auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
			},
		}),
	],
	controllers: [AuthController, UserPreferencesController],
	providers: [
		HasValidTokenGuard,
		TokenIdMatchesRequestedId,
		IsUniqueEmailConstraint,
	],
})
export class AppModule {}
