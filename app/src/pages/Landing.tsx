import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import HeroImage from "../assets/illustrations/innovation__monochromatic.svg";
import { Icon } from "../components/Icon";
import { selectToken } from "../store/auth.state";

export const Landing = () => {
	const history = useHistory();
	const token = useRecoilValue(selectToken);
	if (token) {
		history.push("/dashboard");
	}

	return (
		<div className="page page--flex">
			<div className="page__row">
				<div className="page__col page__col--fixedWidth">
					<p className="paragraph paragraph--hero">
						Manage <strong>your time</strong> and boost{" "}
						<strong>your productivity</strong> with ease.
					</p>
					<p className="paragraph">
						Unlock your full potential, with easy, productivity boosting, time
						management tools.
					</p>
					<Link to="/sign-in" className="button button__primary button--large">
						Get started<Icon withMargin="right">arrow_forward_ios</Icon>
					</Link>
				</div>
				<div className="page__col page__col--centerImage">
					<img
						className="page__mainImage"
						alt="Isometric illustration of a working man"
						src={HeroImage}
					/>
				</div>
			</div>
		</div>
	);
};
