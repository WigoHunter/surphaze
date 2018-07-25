import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withRouter } from "react-router-dom";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import forumActionCreators from "./actions/forum-actions";
import authActionCreators from "./actions/auth";
import uiActionCreators from "./actions/ui";

class Landing extends React.Component {
	static propTypes = {
		loggingIn: PropTypes.bool,
		forumActions: PropTypes.object,
		authActions: PropTypes.object,
		uiActions: PropTypes.object,
		confirmingLocation: PropTypes.bool,
		history: PropTypes.object,
		user: PropTypes.object,
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

	setUserLocation() {
		if (Meteor.userId()) {
			this.props.uiActions.endConfirmingLocation();
			this.props.authActions.doneLocation();
			this.props.forumActions.openForum();

			Meteor.call("user.setLocation", this.props.user.surphaze.location);
		} else {
			alert("Wait... Seems you are not logged in yet!");
			this.props.history.push("/");
		}
	}

	confirmLocation() {
		// If User is not in the confirming stage
		if (!this.props.confirmingLocation) {
			toast.success(() =>
				<div className="toast-for-location">
					Confirm your location?
					<p>You can adjust later too!</p>
					<div>
						<button onClick={() => this.setUserLocation()}>Yep!</button>
						<button onClick={() => this.props.uiActions.endConfirmingLocation()}>Let me adjust now.</button>
					</div>
				</div>,
			{
				autoClose: false,
				position: "top-left",
				closeButton: <span></span>
			}
			);
		}

		// Turn to confirming stage
		this.props.uiActions.toggleConfirmingLocation();
	}

	getCurrentLocation() {
		if (navigator.geolocation) {
			this.props.authActions.initLocation();
			this.props.uiActions.toggleLoading();

			navigator.geolocation.getCurrentPosition((res) => {
				this.props.authActions.setUserLocation({
					lat: res.coords.latitude,
					lng: res.coords.longitude,
				});

				this.props.uiActions.toggleLoading();
				this.confirmLocation();
			});
		} else {
			toast.error("Oops, 看來您的瀏覽器不支援定位", {
				position: "top-left",
				autoClose: 5000,
				pauseOnHover: true
			});

			setTimeout(() => {
				this.startAdjustingLocation();
			}, 2000);
		}
	}

	startInputtingLocation() {
		this.props.authActions.initLocation();

		toast.success("Start by clicking the map! :)", {
			position: "top-left",
			autoClose: 5000,
			pauseOnHover: true
		});
	}

	initLocation() {
		if (Meteor.userId()) {
			this.props.forumActions.toggleForum();

			if (!toast.isActive(this.toastId)) {
				this.toast = toast.success(() =>
					<div className="toast-for-location">
						Use browser GPS to facilitate?
						<p>Adjustments can be made afterwards</p>
						<div>
							<button onClick={() => this.getCurrentLocation()}>Sure!</button>
							<button onClick={() => this.startInputtingLocation()}>Do it manually</button>
						</div>
					</div>, 
				{
					autoClose: false,
					position: "top-left"
				}
				);
			}
		}
	}

	render() {
		if (Meteor.user()) {
			if (Meteor.user().surphaze && Meteor.user().surphaze.location == null) {
				return (
					<div className="getting-location">
						<ToastContainer />
						<h1>Thank you for signing up!</h1>
						<p>Now let{"'"}s share your location with peers</p>
						<button className="start" onClick={() => this.initLocation()}>Start</button>
					</div>
				);
			} else {
				return (
					<div className="welcome">
						<img className="logo" src="/icon.svg" alt="logo" />
						<p>Surface a VC / Developer / Designer nearby!</p>
						<button className="start" onClick={() => this.props.forumActions.toggleForum()}>START BROWSING</button>
					</div>
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

const mapStateToProps = state => {
	return {
		confirmingLocation: state.ui.confirmingLocation,
		user: state.auths.user,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		forumActions: bindActionCreators(forumActionCreators, dispatch),
		authActions: bindActionCreators(authActionCreators, dispatch),
		uiActions: bindActionCreators(uiActionCreators, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Landing));