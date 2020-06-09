import * as React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import LostImage from "../assets/illustrations/web_development__monochromatic.svg";

export const Four04 = () => (
	<div className="page page--flex">
		<div className="page__row">
			<div className="page__col page__col--fixedWidth">
				<p className="paragraph paragraph--hero">
					<strong>404</strong> Page not found
				</p>
				<p className="paragraph">
					Sorry, we couldn't find the page that you were looking for.
				</p>
				<Link to="/" className="button button__primary button--large">
					Go home<Icon withMargin="right">arrow_forward_ios</Icon>
				</Link>
			</div>
			<div className="page__col page__col--centerImage">
				<img className="page__mainImage" src={LostImage} />
			</div>
		</div>
	</div>
);
