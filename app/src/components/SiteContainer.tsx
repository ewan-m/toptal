import * as React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import "./SiteContainer.scss";
import { Link, useHistory } from "react-router-dom";
import { useTokenManager } from "../hooks/use-token-manager";
import { Icon } from "./Icon";

export const SiteContainer: FunctionComponent = ({ children }) => {
	const tokenManager = useTokenManager();
	const history = useHistory();
	const [isSignedIn, setIsSignedIn] = useState(tokenManager.isLoggedIn());

	const signOut = () => {
		tokenManager.removeToken();
		history.push("/");
	};

	history.listen(() => {
		setIsSignedIn(tokenManager.isLoggedIn());
	});

	return (
		<div className="siteContainer">
			<header className="siteHeader">
				<div className="siteHeader__container">
					<Link className="siteHeader__a" to="/">
						<h1 className="siteHeader__h1">
							<span style={{ fontWeight: 300 }}>glass</span>
							<span style={{ fontWeight: 500 }}>hour</span>
						</h1>
					</Link>
					{isSignedIn && (
						<nav className="siteHeader__nav">
							<Link className="siteHeader__a siteHeader__nav__link" to="/account">
								Account
							</Link>
							<button onClick={signOut} className="button button__secondary">
								<Icon withMargin="left">person</Icon>Sign out
							</button>
						</nav>
					)}
					{!isSignedIn && (
						<nav className="siteHeader__nav">
							<Link to="/sign-up" className="siteHeader__a siteHeader__nav__link">
								Sign up
							</Link>
							<Link to="/sign-in" className="button button__secondary ">
								<Icon withMargin="left">person</Icon>Sign in
							</Link>
						</nav>
					)}
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
