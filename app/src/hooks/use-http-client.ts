import { environment } from "../environment";
import { useHistory } from "react-router-dom";
import { useTokenManager } from "./use-token-manager";

interface Request {
	method: string;
	uri: string;
	headers?: any;
	body?: any;
	withAuth: boolean;
}

export const useHttpClient = () => {
	const history = useHistory();
	const tokenManager = useTokenManager();

	const request = async ({ method, uri, headers, body, withAuth }: Request) => {
		const url = environment.apiUrl + uri;
		headers = {
			...headers,
			"mode": "cors",
			"Content-Type": "application/json",
			...(withAuth ? { Authorization: `Bearer ${tokenManager.getToken()}` } : {}),
		};
		body = JSON.stringify(body);

		return (
			await fetch(url.toString(), {
				headers,
				method,
				body,
			})
		).json();
	};

	return { request };
};
