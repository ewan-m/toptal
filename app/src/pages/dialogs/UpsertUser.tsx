import * as React from "react";
import { MouseEvent, useEffect, useState } from "react";
import SuccessImage from "../../assets/illustrations/focused_working__monochromatic.svg";
import { Errors } from "../../components/Errors";
import { Icon } from "../../components/Icon";
import { useHttpClient } from "../../hooks/use-http-client";
import { Role, roles } from "../../types/roles.type";
import { DialogComponent } from "./dialog-component.interface";
import { User } from "../../types/user.type";
import { getUpdatedFields } from "../helpers/get-updated-fields";

enum Situation {
	Ready,
	Saving,
	Saved,
}

export const UpsertUser: DialogComponent<{ user: User | null }> = ({
	user,
	closeDialog,
}) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("user" as Role);
	const [errors, setErrors] = useState([] as string[]);
	const [situation, setSituation] = useState(Situation.Ready);

	useEffect(() => {
		setName(user?.name ?? "");
		setEmail(user?.email ?? "");
		setRole(user?.role ?? "user");
	}, [user]);
	const http = useHttpClient();

	const saveUser = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setSituation(Situation.Saving);
		setErrors([]);

		try {
			const updated = { name, email, role } as User;
			const result = await http.request({
				method: user ? "PATCH" : "POST",
				uri: `users${user ? `/${user.id}` : ""}`,
				withAuth: true,
				body: user ? getUpdatedFields(user, updated) : updated,
			});
			if (result.error) {
				setSituation(Situation.Ready);

				setErrors(
					Array.isArray(result.message)
						? result.message
						: ["Something went wrong saving this user."]
				);
			} else {
				setSituation(Situation.Saved);
			}
		} catch (error) {
			setSituation(Situation.Ready);
			setErrors(["Something went wrong saving this user."]);
		}
	};

	return (
		<>
			{situation === Situation.Saved && (
				<>
					<p className="paragraph">
						The user has been {user ? "updated" : "saved"}.
					</p>
					<img
						src={SuccessImage}
						className="modal__image"
						alt="A drawing of someone working on their laptop"
					/>
					<button onClick={() => closeDialog()} className="button button__primary">
						Ok, close dialog
					</button>
				</>
			)}

			{[Situation.Ready, Situation.Saving].includes(situation) && (
				<form className="form">
					<label className="form__label">
						Name
						<input
							value={name}
							onChange={(e) => {
								setName(e.target.value);
							}}
							className="form__input"
							type="text"
						/>
					</label>
					<label className="form__label">
						Role
						<select
							className="form__input"
							onChange={(e) => {
								setRole(e.target.value as Role);
							}}
							value={role}
						>
							{Object.entries(roles).map(([roleValue, roleDisplay]) => (
								<option key={roleValue} value={roleValue}>
									{roleDisplay}
								</option>
							))}
						</select>
					</label>

					<label className="form__label">
						Email
						<input
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							className="form__input"
							type="email"
						/>
					</label>
					<button
						className="button button__primary"
						type="submit"
						onClick={saveUser}
						disabled={situation === Situation.Saving}
					>
						<Icon withMargin="left">person</Icon>
						{user ? "Save changes" : "Create user"}
					</button>
					<Errors errors={errors} />
				</form>
			)}
		</>
	);
};
