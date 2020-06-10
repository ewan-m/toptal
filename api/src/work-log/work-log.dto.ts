import { IsInt, IsDateString, IsString, IsNotEmpty } from "class-validator";

export class WorkLogDto {
	@IsDateString()
	date: string;

	@IsInt()
	hoursWorked: number;

	@IsString()
	@IsNotEmpty()
	notes: string;
}
