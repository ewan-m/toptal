import * as React from "react";
import { FunctionComponent } from "react";
import "./SiteContainer.scss";
import { Link } from "react-router-dom";

export const SiteContainer: FunctionComponent = ({ children }) => {
	return (
		<div className="siteContainer">
			<header className="siteHeader">
				<div className="siteHeader__container">
					<Link className="siteHeader__a" to="/">
						<h1 className="siteHeader__h1">
							<span style={{ fontWeight: 400 }}>glass</span>
							<span style={{ fontWeight: 600 }}>hour.</span>
						</h1>
					</Link>
				</div>
			</header>
			<main className="siteMain">{children}</main>
			<footer className="siteFooter">
				<p className="siteFooter__p">
					© 2020 Ewan Morrison for Toptal screening process
				</p>
			</footer>
		</div>
	);
};
