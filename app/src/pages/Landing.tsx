import * as React from "react";
import { Link } from "react-router-dom";

export const Landing = () => (
	<div className="page">
		<div className="heroContainer">
			<p className="paragraph paragraph--hero">
				Manage <strong>your time</strong> and boost{" "}
				<strong>your productivity</strong> with ease.
			</p>
			<p className="paragraph">
				Unlock your full potential, with easy, productivity boosting, time
				management tools.
			</p>
			<Link to="/sign-in" className="button button__primary button--large">
				Get started
			</Link>
		</div>
	</div>
);
