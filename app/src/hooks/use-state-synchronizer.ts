import { useEffect } from "react";
import { RecoilValueReadOnly, useRecoilValue } from "recoil";

export const useStateSynchronizer = (
	key: string,
	selector: RecoilValueReadOnly<any>
) => {
	let value = useRecoilValue(selector);

	useEffect(() => {
		if (typeof value !== "string") {
			value = JSON.stringify(value);
		}
		if (key && localStorage.getItem(key) !== value) {
			localStorage.setItem(key, value);
		}
	}, [value]);
};
