import {
	IsInt,
	IsDateString,
	IsString,
	IsNotEmpty,
	Min,
	Max,
} from "class-validator";

export class WorkLogDto {
	@IsDateString()
	date: string;

	@IsInt()
	@Min(0)
	@Max(24)
	hoursWorked: number;

	@IsString()
	@IsNotEmpty()
	note: string;
}
