import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { IsDateFormatCorrect } from "./date-format.validator";

export class DateFilterDto {
	@IsDateFormatCorrect()
	from: string;

	@IsDateFormatCorrect()
	to: string;
}

export function getDateQuery(filter: DateFilterDto) {
	if (!filter.from && !filter.to) {
		return null;
	} else if (filter.from && filter.to) {
		return Between(filter.from, filter.to);
	} else if (filter.from) {
		return MoreThanOrEqual(filter.from);
	} else {
		return LessThanOrEqual(filter.to);
	}
}
