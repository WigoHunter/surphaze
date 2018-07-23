import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

const UserNotFound = ({ history }) => (
	<div className="welcome">
		<img className="logo" src="/icon.svg" alt="logo" />
		<p>Oops! Seems there{"'"}s no such user...</p>
		<button className="start" onClick={() => history.push("/")}>BACK TO HOME</button>
	</div>
);

UserNotFound.propTypes = {
	history: PropTypes.object
};

export default withRouter(UserNotFound);