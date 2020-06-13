import * as React from "react";
import { useState } from "react";
import DeleteImage from "../../assets/illustrations/recycling__monochromatic.svg";
import { Errors } from "../../components/Errors";
import { Icon } from "../../components/Icon";
import { useHttpClient } from "../../hooks/use-http-client";
import { DialogComponent } from "./dialog-component.interface";

enum Situation {
	Confirm,
	Deleting,
	Deleted,
}

export const DeleteResource: DialogComponent<{
	uri: string;
	resourceName: string;
}> = ({ uri, resourceName, closeDialog }) => {
	const [situation, setSituation] = useState(Situation.Confirm);
	const [errors, setErrors] = useState([] as string[]);
	const http = useHttpClient();

	const deleteResource = async () => {
		setSituation(Situation.Deleting);
		try {
			const result = await http.request({ method: "DELETE", uri, withAuth: true });
			if (result.error || result.message) {
				setSituation(Situation.Confirm);

				setErrors(
					Array.isArray(result.message)
						? result.message
						: [`Something went wrong deleting ${resourceName}.`]
				);
			} else {
				setSituation(Situation.Deleted);
			}
		} catch (error) {
			setSituation(Situation.Confirm);
			setErrors([`Something went wrong deleting ${resourceName}.`]);
		}
	};

	return (
		<>
			{[Situation.Confirm, Situation.Deleting].includes(situation) && (
				<>
					<p className="paragraph">
						Are you sure you want to delete this {resourceName}?
					</p>
					<div className="buttonRow">
						<button
							disabled={situation === Situation.Deleting}
							className="button button__destructive"
							onClick={deleteResource}
						>
							<Icon>delete</Icon>Yes, delete {resourceName}
						</button>
						<button
							onClick={() => closeDialog()}
							className="button button__secondary"
						>
							No, cancel
						</button>
					</div>
					<Errors errors={errors} />
				</>
			)}
			{situation === Situation.Deleted && (
				<>
					<p className="paragraph">The {resourceName} has been deleted.</p>
					<img
						src={DeleteImage}
						className="modal__image"
						alt="A drawing of someone putting rubbish in bins"
					/>
					<button onClick={() => closeDialog()} className="button button__primary">
						Ok, close dialog
					</button>
				</>
			)}
		</>
	);
};
