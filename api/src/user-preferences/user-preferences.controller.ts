import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UseGuards,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { Repository } from "typeorm";
import { TokenIdMatchesRequestedIdGuard } from "../guards/token-id-matches-requested-id.guard";
import { UserPreferencesDto } from "./user-preferences.dto";
import { UserPreference } from "./user-preferences.entity";
import { IsAdminGuard } from "../guards/is-admin.guard";

@Controller()
export class UserPreferencesController {
	constructor(
		@InjectRepository(UserPreference)
		private readonly userPreferenceRepository: Repository<UserPreference>
	) {}

	@Get("/user-preferences")
	@UseGuards(HasValidTokenGuard, IsAdminGuard)
	async getAllPreferredHours() {
		const preferences = await this.userPreferenceRepository.find();

		const preferredHours = {};
		preferences.forEach((preference) => {
			preferredHours[preference.user.id] = preference.preferredWorkingHourPerDay;
		});

		return { preferredHours };
	}

	@Get("/user-preferences/:userId")
	@UseGuards(HasValidTokenGuard, TokenIdMatchesRequestedIdGuard)
	async getPreferredHours(@Param() { userId }) {
		try {
			const result = await this.userPreferenceRepository.findOneOrFail({
				user: { id: userId },
			});
			return { preferredHours: { [userId]: result.preferredWorkingHourPerDay } };
		} catch (error) {
			throw new NotFoundException(["The requested resource wasn't found."]);
		}
	}

	@Post("/user-preferences/:userId")
	@UseGuards(HasValidTokenGuard, TokenIdMatchesRequestedIdGuard)
	async updatePreferredHours(
		@Param() { userId },
		@Body() userPreferencesDto: UserPreferencesDto
	) {
		let userPreferences = await this.userPreferenceRepository.findOne({
			user: { id: userId },
		});

		if (!userPreferences) {
			userPreferences = new UserPreference();
			userPreferences.user = { id: userId } as any;
		}
		userPreferences.preferredWorkingHourPerDay =
			userPreferencesDto.preferredHours;

		await this.userPreferenceRepository.save(userPreferences);
		return { preferredHours: { [userId]: userPreferencesDto.preferredHours } };
	}
}
