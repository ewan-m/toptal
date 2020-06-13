import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import moment from "moment";

@ValidatorConstraint()
export class IsDateFormatCorrectConstraint
	implements ValidatorConstraintInterface {
	validate(date: string, args: ValidationArguments) {
		return moment(date, "YYYY-MM-DD").isValid();
	}
}

export function IsDateFormatCorrect(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: {
				message: `The '${propertyName}' date must be in format 'YYYY-MM-DD'.`,
				...validationOptions,
			},
			constraints: [],
			validator: IsDateFormatCorrect,
		});
	};
}
