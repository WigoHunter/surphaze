import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { Tracker } from "meteor/tracker";

// Redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import appReducer from "../imports/ui/reducers";

import App from "../imports/ui/App";

const store = createStore(
	appReducer,
	applyMiddleware(thunk),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

Meteor.startup(() => {
	Tracker.autorun(() => {
		Meteor.subscribe("userData");
		// redux get location?
	});

	render(
		<Provider store={store}>
			<App />
		</Provider>,
		window.document.getElementById("react-root"));
});
