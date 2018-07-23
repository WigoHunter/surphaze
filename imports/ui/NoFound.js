import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class NoFound extends React.Component {
	static propTypes = {
		history: PropTypes.object
	}

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.history.push("/");
	}

	render() {
		return;
	}
}

export default withRouter(NoFound);