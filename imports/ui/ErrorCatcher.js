import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class ErrorCatcher extends React.Component {
	static propTypes = {
		history: PropTypes.object
	}

	constructor(props) {
		super(props);

		this.state = {
			error: false,
		};
	}

	componentDidCatch(error, info) {
		alert("Something went wrong... Redirecting...");
		this.props.history.push("/");
		// TODO: Meteor call 'error.occur' to inform me.
		console.log(info);			// eslint-disable-line
	}

	render() {
		return this.props.children;		// eslint-disable-line
	}
}

export default withRouter(ErrorCatcher);