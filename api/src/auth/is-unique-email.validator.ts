import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import { getRepository } from "typeorm";
import { User } from "./user.entity";

@ValidatorConstraint({ async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
	async validate(email: any, args: ValidationArguments) {
		return !(await getRepository(User).findOne({ email: email }));
	}
}

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: {
				message: `${propertyName} already exists in our system.`,
				...validationOptions,
			},
			constraints: [],
			validator: IsUniqueEmailConstraint,
		});
	};
}
