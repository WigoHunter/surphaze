import React, { Component } from "react";

// Styles
import "../less/App.less";

class App extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div className="app">
				<h1>Hello World</h1>
			</div>
		);
	}
}

export default App;