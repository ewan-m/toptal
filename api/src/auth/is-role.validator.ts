import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import { roles } from "src/constants/roles";

@ValidatorConstraint()
export class IsRoleConstraint implements ValidatorConstraintInterface {
	validate(role: string, args: ValidationArguments) {
		return role in roles;
	}
}

export function IsRole(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: {
				message: `${propertyName} must be either '${Object.keys(roles).join(
					"', '"
				)}'`,
				...validationOptions,
			},
			constraints: [],
			validator: IsRoleConstraint,
		});
	};
}
