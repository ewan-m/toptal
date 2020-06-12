import { atom, selector } from "recoil";

export const DATE_FILTER_SYNC_KEY = "date-filter";

const stored = localStorage.getItem(DATE_FILTER_SYNC_KEY);

export const dateFilterAtom = atom({
	key: "dateFilterAtom",
	default: stored
		? JSON.parse(stored)
		: {
				from: "",
				to: "",
		  },
});

export const selectDateFilter = selector({
	key: "selectDateFilterFrom",
	get: ({ get }) => get(dateFilterAtom),
});
