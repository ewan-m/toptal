import * as React from "react";
import { FunctionComponent } from "react";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useStateSynchronizer } from "../hooks/use-state-synchronizer";
import { selectToken, tokenAtom, TOKEN_SYNC_KEY } from "../store/auth.state";
import { Icon } from "./Icon";
import "./SiteContainer.scss";
import {
	DATE_FILTER_SYNC_KEY,
	selectDateFilter,
} from "../store/work-log-filter.state";

export const SiteContainer: FunctionComponent = ({ children }) => {
	const history = useHistory();
	const [token, setToken] = useRecoilState(tokenAtom);
	useStateSynchronizer(TOKEN_SYNC_KEY, selectToken);
	useStateSynchronizer(DATE_FILTER_SYNC_KEY, selectDateFilter);

	const signOut = () => {
		setToken("");
		history.push("/");
	};

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
					{!!token && (
						<nav className="siteHeader__nav">
							<Link className="siteHeader__a siteHeader__nav__link" to="/account">
								Account
							</Link>
							<button onClick={signOut} className="button button__secondary">
								<Icon withMargin="left">person</Icon>Sign out
							</button>
						</nav>
					)}
					{!token && (
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
