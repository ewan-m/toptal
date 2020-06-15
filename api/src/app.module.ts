import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth/auth.controller";
import { User } from "./auth/user.entity";
import { IsUniqueEmailConstraint } from "./auth/validators/is-unique-email.validator";
import { HasValidTokenGuard } from "./guards/has-valid-token.guard";
import { IsAdminGuard } from "./guards/is-admin.guard";
import { IsNotUserManagerGuard } from "./guards/is-not-user-manager.guard";
import { TokenIdMatchesRequestedIdGuard } from "./guards/token-id-matches-requested-id.guard";
import config from "./orm-config";
import { UserPreferencesController } from "./user-preferences/user-preferences.controller";
import { UserPreference } from "./user-preferences/user-preferences.entity";
import { UsersController } from "./users/users.controller";
import { WorkLogController } from "./work-log/work-log.controller";
import { WorkLog } from "./work-log/work-log.entity";

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
	controllers: [
		AuthController,
		UsersController,
		UserPreferencesController,
		WorkLogController,
	],
	providers: [
		HasValidTokenGuard,
		TokenIdMatchesRequestedIdGuard,
		IsUniqueEmailConstraint,
		IsNotUserManagerGuard,
		IsAdminGuard,
	],
})
export class AppModule {}
