export function getUpdatedFields<T>(original: T, updated: T) {
	return Object.keys(updated).reduce((diff, key) => {
		if (original[key as keyof T] === updated[key as keyof T]) return diff;
		return {
			...diff,
			[key]: updated[key as keyof T],
		};
	}, {});
}
