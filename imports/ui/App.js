import React, { Component } from "react";
import MapComponent from "./MapComponent";
import Forum from "./Forum";
import ErrorCatcher from "./ErrorCatcher";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Loading from "./Loading";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Styles
import "../less/App.less";

class App extends Component {
	static propTypes = {
		loading: PropTypes.bool,
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router>
				<ErrorCatcher>
					<div className="app-container">
						{this.props.loading && <Loading />}
						<MapComponent />
						<Route path="/" component={Forum} />
					</div>
				</ErrorCatcher>
			</Router>
		);
	}
}

const mapStateToProps = state => {
	return {
		loading: state.ui.loading
	};
};

export default connect(mapStateToProps, null)(App);