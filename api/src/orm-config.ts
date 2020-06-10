import { ConnectionOptions } from "typeorm";
import { User } from "./auth/user.entity";
import { UserPreference } from "./user-preferences/user-preferences.entity";
import { WorkLog } from "./work-log/work-log.entity";
import { CreateTables1591786112692 } from "./migrations/1591786112692-CreateTables";
import { RenameInvalidColumn1591791275462 } from "./migrations/1591791275462-RenameInvalidColumn";

const config = {
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
	migrations: [CreateTables1591786112692, RenameInvalidColumn1591791275462],
	entities: [UserPreference, User, WorkLog],
	port: 11,
} as ConnectionOptions;

export = config;
