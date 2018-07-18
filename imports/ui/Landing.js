import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import forumActionCreators from "./actions/forum-actions";

class Landing extends React.Component {
	static propTypes = {
		loggingIn: PropTypes.bool,
		forumActions: PropTypes.object,
	};

	constructor(props) {
		super(props);
	}

	login() {
		Meteor.loginWithFacebook({requestPermissions: ["public_profile", "email"]}, (err) => {
			if (err) {
				alert("Login Failed: Come back later :)");
			}
		});
	}

	initLocation() {
		if (Meteor.userId()) {
			this.props.forumActions.toggleForum();
		}
	}

	render() {
		if (Meteor.user()) {
			if (Meteor.user().surphaze.location == null) {
				return (
					<div className="getting-location">
						<h1>Thank you for signing up!</h1>
						<p>Now let{"'"}s share your location with peers</p>
						<button onClick={() => this.initLocation()}>Start</button>
					</div>
				);
			} else {
				return (
					<div>{/* RENDER REAL FORUM; USER HAS BOTH ACCOUNT AND LOCATION */}</div>
				);
			}
		}

		return (
			<div className="welcome">
				<img className="logo" src="/icon.svg" alt="logo" />
				<p>Surface a VC / Developer / Designer nearby!</p>
				<button onClick={() => this.login()} className="facebook-button">LOGIN WITH FACEBOOK</button>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		forumActions: bindActionCreators(forumActionCreators, dispatch),
	};
};

export default connect(null, mapDispatchToProps)(Landing);