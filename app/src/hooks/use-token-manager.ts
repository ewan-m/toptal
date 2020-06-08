import { decode } from "jsonwebtoken";

export const useTokenManager = () => {
	const tokenStorageKey = "TOKEN";

	const getToken = () => sessionStorage.getItem(tokenStorageKey);
	const setToken = (token: string) =>
		sessionStorage.setItem(tokenStorageKey, token);
	const removeToken = () => sessionStorage.removeItem(tokenStorageKey);

	const getUserDetails = () => {
		const token = getToken();

		if (token) {
			const parsed = decode(token);
			return parsed;
		}
		return {};
	};
	const isLoggedIn = () => !!getToken();

	return { getToken, setToken, removeToken, getUserDetails, isLoggedIn };
};
