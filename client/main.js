import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { Tracker } from "meteor/tracker";

// Redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import appReducer from "../imports/ui/reducers";
import { loadUser } from "../imports/ui/actions/auth";

import App from "../imports/ui/App";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(appReducer, composeEnhancers(applyMiddleware(thunk)));

Meteor.startup(() => {
	Tracker.autorun(() => {
		Meteor.subscribe("userData");
		Meteor.subscribe("unauth_users");
	});

	store.dispatch(loadUser());
	
	render(
		<Provider store={store}>
			<App />
		</Provider>,
		window.document.getElementById("react-root"));
});
