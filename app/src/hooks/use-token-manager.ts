import { decode } from "jsonwebtoken";
import { Role } from "../constants/roles";

export type TokenPayload = {
	role: Role;
	name: string;
	email: string;
	id: number;
};

export const useTokenManager = () => {
	const tokenStorageKey = "TOKEN";

	const getToken = () => sessionStorage.getItem(tokenStorageKey);
	const setToken = (token: string) =>
		sessionStorage.setItem(tokenStorageKey, token);
	const removeToken = () => sessionStorage.removeItem(tokenStorageKey);

	const getUserDetails = (): TokenPayload | null => {
		const token = getToken();

		if (token) {
			const parsed = decode(token);
			return parsed as TokenPayload;
		}
		return null;
	};

	const getUserId = () => {
		return getUserDetails()?.["id"];
	};

	const isLoggedIn = () => !!getToken();

	return {
		getToken,
		setToken,
		removeToken,
		getUserDetails,
		isLoggedIn,
		getUserId,
	};
};
