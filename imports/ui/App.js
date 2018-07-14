import React, { Component } from "react";
import MapComponent from "./MapComponent";
import Forum from "./Forum";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Styles
import "../less/App.less";

class App extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<Router>
				<div className="app-container">
					<MapComponent />
					<Route path="/" component={Forum} />
				</div>
			</Router>
		);
	}
}

export default App;