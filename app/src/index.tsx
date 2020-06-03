import { createBrowserHistory } from "history";
import * as React from "react";
import { render } from "react-dom";
import { Route, Router, Switch } from "react-router-dom";
import { SiteContainer } from "./components/SiteContainer";
import "./index.scss";
import "./pages/Page.scss";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";

const history = createBrowserHistory();

const Index = () => {
	return (
		<Router history={history}>
			<SiteContainer>
				<Switch>
					<Route path="/sign-in" exact component={SignIn} />
					<Route path="/sign-up" exact component={SignUp} />
				</Switch>
			</SiteContainer>
		</Router>
	);
};

render(<Index />, document.getElementById("root"));
