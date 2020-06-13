import { FunctionComponent } from "react";

export interface DialogComponent<T = {}>
	extends FunctionComponent<
		{
			closeDialog: () => void;
		} & T
	> {}
