import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { environment } from "../environment";
import { tokenAtom } from "../store/auth.state";

interface Request {
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	uri: string;
	headers?: any;
	body?: any;
	withAuth: boolean;
}

export const useHttpClient = () => {
	const [token, setToken] = useRecoilState(tokenAtom);
	const history = useHistory();

	const request = async ({ method, uri, headers, body, withAuth }: Request) => {
		const url = environment.apiUrl + uri;
		headers = {
			...headers,
			"mode": "cors",
			"Content-Type": "application/json",
			...(withAuth ? { Authorization: `Bearer ${token}` } : {}),
		};
		body = JSON.stringify(body);

		const result = (
			await fetch(url.toString(), {
				headers,
				method,
				body,
			})
		).json();
		result.then((resolved) => {
			if (resolved?.message?.includes("Invalid token")) {
				setToken("");
				history.push("/");
			}
		});
		return result;
	};

	return { request };
};
