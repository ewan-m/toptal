import {
	IsNumber,
	IsEmail,
	IsNotEmpty,
	IsInt,
	Min,
	Max,
} from "class-validator";

export class WorkingHoursDto {
	@IsNumber()
	@IsInt()
	@Min(1)
	@Max(24)
	preferredHours: number;
}
