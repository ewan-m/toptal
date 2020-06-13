import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsString,
	Max,
	Min,
} from "class-validator";

export class CreateWorkLogDto {
	@IsNotEmpty()
	@IsDateString()
	date: string;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(24)
	hoursWorked: number;

	@IsNotEmpty()
	@IsString()
	note: string;
}
