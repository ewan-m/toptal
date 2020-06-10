import { IsInt, Max, Min } from "class-validator";

export class UserPreferencesDto {
	@IsInt()
	@Min(1)
	@Max(24)
	preferredHours: number;
}
