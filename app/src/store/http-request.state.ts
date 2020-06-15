import { atom } from "recoil";

export type FetchStatus = "initial" | "error" | "loading" | "loaded" | "stale";

export const workLogsFetchStatus = atom({
	key: "workLogFetchStatus",
	default: "initial" as FetchStatus,
});

export const userPreferencesStatus = atom({
	key: "userPreferencesStatus",
	default: "initial" as FetchStatus,
});

export const usersFetchStatus = atom({
	key: "usersFetchStatus",
	default: "initial" as FetchStatus,
});
