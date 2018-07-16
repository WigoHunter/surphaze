import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import forumActionCreators from "./actions/forum-actions";

class Forum extends React.Component {
	constructor(props) {
		super(props);
	}

	toggleForum() {
		if (Meteor.userId()) {
			this.props.forumActions.toggleForum();
		}

		/*
		else if (!toast.isActive(this.toastId)) {
			this.toastId = toast.warn("Please Login First :)", {
				position: "top-left",
				draggable: false,
			});
		}
		*/
	}

	login() {
		Meteor.loginWithFacebook({requestPermissions: ["public_profile", "email"]}, (err) => {
			if (err) {
				alert("Login Failed: Come back later :)");
			}
		});
	}

	render() {
		const { forumHidden } = this.props;

		return (
			<div className={`forum ${forumHidden && "hide"}`}>
				<div className="tools">
					<div className="top">
						<p className="close" onClick={() => this.toggleForum()}>＋</p>
					</div>
					<div className="bot">
						{!this.props.loggingIn &&
							<div className="user-pic" style={{ background: `url(https://res.cloudinary.com/outwerspace/image/facebook/w_100,h_100,r_max/${Meteor.user().services.facebook.id}.png)` }}></div>
						}
					</div>
				</div>

				<div className="welcome">
					<h2>Hello <span onClick={() => this.login()}>Surphaze</span></h2>
				</div>
			</div>
		);
	}
}

Forum.propTypes = {
	loggingIn: PropTypes.bool,
	forumHidden: PropTypes.bool,
	forumActions: PropTypes.object
};

function mapStateToProps(state) {
	return {
		forumHidden: state.forums.forumHidden
	};
}

function mapDispatchToProps(dispatch) {
	return {
		forumActions: bindActionCreators(forumActionCreators, dispatch)
	};
}

const ForumContainer = withTracker((props) => {
	const loggingIn = Meteor.loggingIn();
	
	return {
		...props,
		loggingIn
	};
})(Forum);

export default connect(mapStateToProps, mapDispatchToProps)(ForumContainer);