import { ConnectionOptions } from "typeorm";
import { User } from "./auth/user.entity";
import { UserPreference } from "./user-preference/user-preferences.entity";
import { WorkLog } from "./entities/work-log";
import { First1591454702269 } from "./migrations/1591454702269-First";

export default {
	type: "mssql",
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: "glasshour",
	host: "localhost",
	synchronize: false,
	migrationsRun: true,
	options: {
		enableArithAbort: true,
	},
	migrations: [First1591454702269],
	entities: [UserPreference, User, WorkLog],
	port: 11,
} as ConnectionOptions;
