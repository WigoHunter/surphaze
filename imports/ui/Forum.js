import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";

class Forum extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hide: false,
		};

		this.toggleForum = this.toggleForum.bind(this);
	}

	toggleForum() {
		if (Meteor.userId()) {
			this.setState({
				hide: !this.state.hide
			});
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
		return (
			<div className={`forum ${this.state.hide && "hide"}`}>
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
};

export default withTracker((props) => {
	const loggingIn = Meteor.loggingIn();
	
	return {
		...props,
		loggingIn
	};
})(Forum);