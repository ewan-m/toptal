import { Controller, Get, Param, UseGuards, Post, Body } from "@nestjs/common";
import { HasValidTokenGuard } from "src/guards/has-valid-token.guard";
import { Repository } from "typeorm";
import { UserPreference } from "./user-preferences.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../auth/user.entity";
import { TokenIdMatchesRequestedId } from "src/guards/token-id-matches-requested-id.guard";
import { UserPreferencesDto } from "./user-preferences.dto";

@Controller()
export class UserPreferencesController {
	constructor(
		@InjectRepository(UserPreference)
		private readonly userPreferenceRepository: Repository<UserPreference>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	@Get("/user-preferences/:userId")
	@UseGuards(HasValidTokenGuard, TokenIdMatchesRequestedId)
	async getPreferredHours(@Param() { userId }) {
		const result = await this.userPreferenceRepository.findOne({
			user: { id: userId },
		});

		return result ? { preferredHours: result.preferredWorkingHourPerDay } : {};
	}

	@Post("/user-preferences/:userId")
	@UseGuards(HasValidTokenGuard, TokenIdMatchesRequestedId)
	async updatePreferredHours(
		@Param() { userId },
		@Body() userPreferencesDto: UserPreferencesDto
	) {
		const matchingUser = await this.userRepository.findOne({ id: userId });

		let userPreferences = await this.userPreferenceRepository.findOne({
			user: matchingUser,
		});

		if (!userPreferences) {
			userPreferences = new UserPreference();
			userPreferences.user = matchingUser;
		}
		userPreferences.preferredWorkingHourPerDay =
			userPreferencesDto.preferredHours;

		await this.userPreferenceRepository.save(userPreferences);
		return userPreferencesDto;
	}
}
