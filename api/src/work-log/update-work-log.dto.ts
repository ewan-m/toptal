import {
	IsInt,
	IsDateString,
	IsString,
	IsNotEmpty,
	Min,
	Max,
} from "class-validator";

export class UpdateWorkLogDto {
	@IsDateString()
	date?: string;

	@IsInt()
	@Min(0)
	@Max(24)
	hoursWorked?: number;

	@IsString()
	note?: string;
}
