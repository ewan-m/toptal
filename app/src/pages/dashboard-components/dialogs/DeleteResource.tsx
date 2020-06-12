import * as React from "react";
import { FunctionComponent, useState } from "react";
import DeleteImage from "../../../assets/illustrations/recycling_monochromatic.svg";
import { Icon } from "../../../components/Icon";
import { useHttpClient } from "../../../hooks/use-http-client";
import { Errors } from "../../../components/Errors";

enum Situation {
	Confirm,
	Deleting,
	Deleted,
}

export const DeleteResource: FunctionComponent<{
	uri: string;
	resourceName: string;
}> = ({ uri, resourceName }) => {
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
					<button
						disabled={situation === Situation.Deleting}
						className="button button__destructive"
						onClick={deleteResource}
					>
						<Icon>delete</Icon>Yes, delete {resourceName}
					</button>
					<Errors errors={errors} />
				</>
			)}
			{situation === Situation.Deleted && (
				<>
					<p className="paragraph">
						The {resourceName} has been deleted. You can now close this dialog using
						the close button or by pressing outside it.
					</p>
					<img
						src={DeleteImage}
						className="modal__image"
						alt="A drawing of someone putting rubbish in bins"
					/>
				</>
			)}
		</>
	);
};
