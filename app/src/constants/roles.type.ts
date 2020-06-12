export const roles: { [role in Role]: string } = {
	user: "User",
	userManager: "User Manager",
	admin: "Admin",
};

export type Role = "user" | "userManager" | "admin";
