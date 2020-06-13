import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { decode } from "jsonwebtoken";
import { TokenPayload } from "src/auth/token-payload.type";

@Injectable()
export class HasUserManagementPrivileges implements CanActivate {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const requestingId = request?.params?.userId;
		const authToken = request?.headers?.["authorization"]?.split(" ")?.[1];

		if (authToken && requestingId !== null && requestingId !== undefined) {
			const tokenPayload = decode(authToken) as TokenPayload;

			if (
				requestingId.toString() === tokenPayload?.id.toString() ||
				(tokenPayload?.role && tokenPayload?.role !== "user")
			) {
				return true;
			}
		}

		throw new ForbiddenException(["Insufficient permissions to manage users."]);
	}
}
