import { decode } from "jsonwebtoken";
import { atom, selector } from "recoil";
import { TokenPayload } from "../types/token-payload.type";

export const TOKEN_SYNC_KEY = "token";

export const tokenAtom = atom({
	key: "tokenAtom",
	default: localStorage.getItem(TOKEN_SYNC_KEY) || "",
});

export const selectToken = selector({
	key: "selectToken",
	get: ({ get }) => get(tokenAtom),
});

export const selectUserDetails = selector({
	key: "selectUserDetails",
	get: ({ get }) => {
		try {
			const token = get(tokenAtom);
			if (token) {
				return decode(token) as TokenPayload;
			}
		} catch (error) {}
		return null;
	},
});
