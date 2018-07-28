import React from "react";
import { Meteor } from "meteor/meteor";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import "whatwg-fetch";
import fetchJsonp from "fetch-jsonp";

import UserNotFound from "./UserNotFound";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import forumActionCreators from "./actions/forum-actions";

class Profile extends React.Component {
	static propTypes = {
		history: PropTypes.object,
		loading: PropTypes.bool,
		user: PropTypes.object,
		forumActions: PropTypes.object,
		showingOthersProfile: PropTypes.bool,
	}

	constructor(props) {
		super(props);
	}

	componentWillUnmount() {
		this.props.forumActions.closingOthersProfile();
	}

	componentDidMount() {
		if (!this.props.loading && (!this.props.user._id || this.props.user.surphaze.location == null)) {
			this.props.history.push("/");
		}
		this.getUserSetup();
		console.log("mounting", this.props); // eslint-disable-line
	}

	getUserSetup() {
		this.props.forumActions.openForum();
	}

	linkWithLinkedIn() {
		Meteor.linkWithLinkedIn({
			requestPermissions: ["r_basicprofile"]
		}, () => {
			if (Meteor.user().services.linkedin) {
				fetchJsonp(`https://api.linkedin.com/v1/people/~:(headline,summary,positions)?oauth2_access_token=${Meteor.user().services.linkedin.accessToken}&format=jsonp`)
					.then(res => res.json())
					.then(json => {
						Meteor.call("user.update.linkedin", {
							headline: json.headline,
							positions: json.positions,
							summary: json.summary
						});
					});
			}
		});
	}

	linkWithGitHub() {
		Meteor.linkWithGithub({
			requestPermissions: ["user", "public_repo"]
		}, () => {
			if (Meteor.user().services.github) {
				fetch(`https://api.github.com/users/${Meteor.user().services.github.username}`)
					.then(res => res.json())
					.then(json => {
						Meteor.call("user.update.github", {
							company: json.company,
							website: json.blog,
							bio: json.bio,
							repos_url: json.repos_url,
						});
					});
			}
			
		});
	}

	render() {
		if (this.props.loading) {
			return null;
		}

		if (!this.props.user._id) {
			return (
				<UserNotFound />
			);
		}

		return (
			<div className="profile">
				<div className="bg" style={{ background: `url(${"/background.png"})`, backgroundSize: "cover" }}></div>
				
				<div className="me">
					<div className="user-pic" style={{ background: `url(https://res.cloudinary.com/outwerspace/image/facebook/w_100,h_100,r_max/${this.props.user.services.facebook.id}.png)` }}></div>
					<h2>{this.props.user.username}</h2>
					<Link to={`/${this.props.user.username}`}>@{this.props.user.username}</Link>
				</div>
				<p className="count">{this.props.user.surphaze.connections.length} Connections</p>
				
				<div className="buttons">
					<button>CONNECT</button>
					<button>CHAT</button>
				</div>
				
				<p className="short-bio">{this.props.user.services.github.addon.bio}</p>
				
				{!this.props.showingOthersProfile &&
					<button className="github" onClick={() => this.linkWithGitHub()}>
						<i className="fa fa-github" />
					</button>
				}
				{!this.props.showingOthersProfile &&
					<button className="linkedin" onClick={() => this.linkWithLinkedIn()}>
						<i className="fa fa-linkedin" />
					</button>
				}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		showingOthersProfile: state.forums.showingOthersProfile,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		forumActions: bindActionCreators(forumActionCreators, dispatch)
	};
};

const ProfileContainer = withTracker((props) => {
	if (props.match.params.id) {
		props.forumActions.showingOthersProfile();
		const sub = Meteor.subscribe("userData", props.match.params.id);

		return {
			loading: !sub.ready(),
			user: Meteor.users.findOne({
				$or: [
					{ _id: props.match.params.id },
					{ username: props.match.params.id }
				]
			}) || {},
		};
	}

	props.forumActions.closingOthersProfile();
	return {
		user: Meteor.user() || {}
	};
})(Profile);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfileContainer));