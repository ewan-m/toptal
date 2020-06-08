import { Controller, Get, Param } from "@nestjs/common";
import { getRepository } from "typeorm";
import { UserPreference } from "./user-preferences.entity";

@Controller()
export class UserPreferenceController {
	@Get("/preferred-hours/:userId")
	getPreferredHours(@Param() params) {
		return 12;
	}
}
