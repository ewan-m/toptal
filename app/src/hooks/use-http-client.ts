import { useRecoilValue } from "recoil";
import { environment } from "../environment";
import { selectToken } from "../store/auth.state";

interface Request {
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	uri: string;
	headers?: any;
	body?: any;
	withAuth: boolean;
}

export const useHttpClient = () => {
	const token = useRecoilValue(selectToken);

	const request = async ({ method, uri, headers, body, withAuth }: Request) => {
		const url = environment.apiUrl + uri;
		headers = {
			...headers,
			"mode": "cors",
			"Content-Type": "application/json",
			...(withAuth ? { Authorization: `Bearer ${token}` } : {}),
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
