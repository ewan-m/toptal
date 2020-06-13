import { createBrowserHistory } from "history";
import * as React from "react";
import { render } from "react-dom";
import { Route, Router, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SiteContainer } from "./components/SiteContainer";
import "./index.scss";
import { Four04 } from "./pages/404";
import { Dashboard } from "./pages/Dashboard";
import { Landing } from "./pages/Landing";
import { MagicLink } from "./pages/MagicLink";
import "./pages/Page.scss";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { UserManager } from "./pages/UserManager";

const history = createBrowserHistory();

const Index = () => (
	<RecoilRoot>
		<Router history={history}>
			<SiteContainer>
				<Switch>
					<Route path="/" exact component={Landing} />
					<Route path="/sign-in" exact component={SignIn} />
					<Route path="/sign-up" exact component={SignUp} />
					<Route path="/magic-link" exact component={MagicLink} />
					<Route path="/dashboard" exact component={Dashboard} />
					<Route path="/user" exact component={UserManager} />
					<Route component={Four04} />
				</Switch>
			</SiteContainer>
		</Router>
	</RecoilRoot>
);

render(<Index />, document.getElementById("root"));
