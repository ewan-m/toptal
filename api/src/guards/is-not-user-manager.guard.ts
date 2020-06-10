import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";
import { decode } from "jsonwebtoken";
import { TokenPayload } from "src/auth/token-payload.type";

@Injectable()
export class IsNotUserManagerGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const authToken = request?.headers?.["authorization"]?.split(" ")?.[1];

		if (authToken) {
			try {
				const token = decode(authToken) as TokenPayload;
				if (token && token.role !== "userManager") {
					return true;
				}
			} catch (error) {}
		} else {
			throw new UnauthorizedException(["Mangled token"]);
		}
	}
}
