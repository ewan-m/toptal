import {
	IsDateString,
	IsInt,
	IsString,
	Max,
	Min,
	ValidateIf,
} from "class-validator";

export class UpdateWorkLogDto {
	@ValidateIf((w) => w.date !== undefined)
	@IsDateString()
	date?: string;

	@ValidateIf((w) => w.hoursWorked !== undefined)
	@IsInt()
	@Min(0)
	@Max(24)
	hoursWorked?: number;

	@ValidateIf((w) => w.note !== undefined)
	@IsString()
	note?: string;
}
