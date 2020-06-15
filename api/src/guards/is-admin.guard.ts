import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { decode } from "jsonwebtoken";
import { TokenPayload } from "src/auth/token-payload.type";

@Injectable()
export class IsAdminGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const authToken = request?.headers?.["authorization"]?.split(" ")?.[1];

		if (authToken) {
			const tokenPayload = decode(authToken) as TokenPayload;
			if (tokenPayload.role === "admin") {
				return true;
			}
		}

		throw new ForbiddenException(["Insufficient permissions."]);
	}
}
