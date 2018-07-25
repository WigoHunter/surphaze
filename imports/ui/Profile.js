import React from "react";
import { Meteor } from "meteor/meteor";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import "whatwg-fetch";

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
				<h2 onClick={() => this.props.history.push("/hi")}>{this.props.user.username}</h2>
				<button className="github" onClick={() => this.linkWithGitHub()}>
					<i className="fa fa-github" /> GitHub
				</button>
			</div>
		);
	}
}

const mapStateToProps = () => {
	return {

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