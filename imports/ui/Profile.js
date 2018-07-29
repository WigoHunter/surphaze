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

const getAKA = user => {
	if (user.surphaze.profile.position.title.length > 0) {
		return (
			<span>
				AKA {user.surphaze.profile.position.title}{user.surphaze.profile.position.company && ` @${user.surphaze.profile.position.company}`}
			</span>
		);
	} else if (user.services.linkedin.addon.positions) {
		return (
			<span>
				AKA {user.services.linkedin.addon.positions.values[0].title}{` @${user.services.linkedin.addon.positions.values[0].company.name}`}
			</span>
		);
	}

	return null;
};

const getBio = user =>
	user.surphaze.profile.bio.length > 0
		? user.surphaze.profile.bio
		: user.services.github
			? user.services.github.addon && user.services.github.addon.bio
			: user.services.linkedin
				? user.services.linkedin.addon && user.services.linkedin.addon.summary
				: "";

const processBio = (bio, shorten, toggle) => {
	if (bio && bio.length > 300) {
		if (shorten) {
			return (
				<span>
					{bio.substr(0, 300)} <span onClick={() => toggle()}>...</span>
				</span>
			);
		}

		return (
			<span>
				{bio} <span className="close" onClick={() => toggle()}>(close)</span>
			</span>
		);
	}

	return bio;
};

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

		this.state = {
			shortenBio: true,
			shortenInterest: true,
		};

		this.toggleBio = this.toggleBio.bind(this);
		this.toggleInterest = this.toggleInterest.bind(this);
	}

	componentWillUnmount() {
		this.props.forumActions.closingOthersProfile();
		this.props.forumActions.closeGridMode();
	}

	componentDidMount() {
		if (!this.props.loading && (!this.props.user._id || this.props.user.surphaze.location == null)) {
			this.props.history.push("/");
		}
		this.getUserSetup();
		console.log("mounting", this.props); // eslint-disable-line
	}

	componentDidUpdate() {
		this.props.forumActions.openGridMode();
	}

	getUserSetup() {
		this.props.forumActions.openForum();
	}

	toggleBio() {
		this.setState({
			shortenBio: !this.state.shortenBio,
		});
	}

	toggleInterest() {
		this.setState({
			shortenInterest: !this.state.shortenInterest,
		});
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
				<p className="aka">{getAKA(this.props.user)}</p>
				<p className="count">{this.props.user.surphaze.connections.length} Connections</p>
				
				<div className="buttons">
					<button>CONNECT</button>
					<button>CHAT</button>
				</div>
				
				<p className="short-bio">{processBio(getBio(this.props.user), this.state.shortenBio, this.toggleBio)}</p>
				
				{/* db.users.find({"surphaze.profile.interested": {$all: ["React"]}} */}
				<div className="topics-wrapper">
					<h3>#Interested Topics</h3>
					<div className="topics">
						{this.props.user.surphaze && this.props.user.surphaze.profile.interested.map((topic, i) => (
							<Link key={i} className="topic" onClick={() => alert("You will be able to search by tags soon!")} to={`/tag/${topic}`}>{topic}</Link>
						))}
					</div>
				</div>

				<div className="socials-wrapper">
					<h3>#Social Media</h3>
					<div className="social-medias">
						{this.props.user.surphaze && this.props.user.surphaze.profile.links.facebook &&
							<a className="sm" rel="noopener noreferrer" target="_blank" href={this.props.user.surphaze.profile.links.facebook}><i className="fa fa-facebook" /></a>
						}

						{this.props.user.surphaze && this.props.user.surphaze.profile.links.twitter &&
							<a className="sm" rel="noopener noreferrer" target="_blank" href={this.props.user.surphaze.profile.links.facebook}><i className="fa fa-twitter" /></a>
						}

						{this.props.user.surphaze && this.props.user.surphaze.profile.links.linkedin &&
							<a className="sm" rel="noopener noreferrer" target="_blank" href={this.props.user.surphaze.profile.links.facebook}><i className="fa fa-linkedin" /></a>
						}

						{this.props.user.surphaze && this.props.user.surphaze.profile.links.github &&
							<a className="sm" rel="noopener noreferrer" target="_blank" href={this.props.user.surphaze.profile.links.facebook}><i className="fa fa-github" /></a>
						}

						{this.props.user.surphaze && this.props.user.surphaze.profile.links.medium &&
							<a className="sm" rel="noopener noreferrer" target="_blank" href={this.props.user.surphaze.profile.links.facebook}><i className="fa fa-medium" /></a>
						}
					</div>
				</div>

				{!this.props.showingOthersProfile && this.props.user.services.github == null &&
					<button className="github" onClick={() => this.linkWithGitHub()}>
						<i className="fa fa-github" />
					</button>
				}
				{!this.props.showingOthersProfile && this.props.user.services.linkedin == null &&
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