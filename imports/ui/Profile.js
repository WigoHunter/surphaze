import React from "react";
import { Meteor } from "meteor/meteor";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import ReactTooltip from "react-tooltip";
import "whatwg-fetch";
import fetchJsonp from "fetch-jsonp";

import UserNotFound from "./UserNotFound";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import forumActionCreators from "./actions/forum-actions";
import profileActionCreators from "./actions/profile";

const getAKA = user => {
	if (user.surphaze.profile.position.title.length > 0) {
		return (
			<span>
				{user.surphaze.profile.position.title}{user.surphaze.profile.position.company && ` @${user.surphaze.profile.position.company}`}
			</span>
		);
	} else if (user.services.linkedin.addon.positions) {
		return (
			<span>
				{user.services.linkedin.addon.positions.values[0].title}{` @${user.services.linkedin.addon.positions.values[0].company.name}`}
			</span>
		);
	}

	return null;
};

const getProfilePic = user =>
	user.services.facebook != undefined
		? `url(https://res.cloudinary.com/outwerspace/image/facebook/w_100,h_100,r_max/${user.services.facebook.id}.png)`
		: "";

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
		edit: PropTypes.bool,
		profileActions: PropTypes.object,
	}

	constructor(props) {
		super(props);

		this.state = {
			shortenBio: true,
			shortenInterest: true,
			interested: [],
			name: "",
			handle: "",
			bio: "",
			position: {
				title: "",
				company: ""
			},
			links: {
				twitter: "",
				facebook: "",
				medium: "",
				linkedin: "",
				github: "",
				producthunt: "",
			}
		};

		this.toggleBio = this.toggleBio.bind(this);
		this.toggleInterest = this.toggleInterest.bind(this);
		this.initEdit = this.initEdit.bind(this);
		this.cancelEdit = this.cancelEdit.bind(this);
		this.handleInterestChange = this.handleInterestChange.bind(this);

		this.handleFBChange = this.handleFBChange.bind(this);
		this.handleGitHubChange = this.handleGitHubChange.bind(this);
		this.handleLinkedInChange = this.handleLinkedInChange.bind(this);
		this.handleMediumChange = this.handleMediumChange.bind(this);
		this.handleTwitterChange = this.handleTwitterChange.bind(this);
		this.handlePHChange = this.handlePHChange.bind(this);
		this.handleBioChange = this.handleBioChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleHandleChange = this.handleHandleChange.bind(this);
		this.handleCompanyChange = this.handleCompanyChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.submitChanges = this.submitChanges.bind(this);
	}

	componentWillUnmount() {
		this.props.forumActions.closingOthersProfile();
		this.props.forumActions.closeGridMode();
		this.props.profileActions.closeEdit();
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

	initEdit() {
		try {
			this.setState({
				interested: this.props.user.surphaze.profile.interested,
				name: this.props.user.surphaze.profile.name,
				handle: this.props.user.handle,
				bio: this.props.user.surphaze.profile.bio,
				position: this.props.user.surphaze.profile.position,
				links: this.props.user.surphaze.profile.links,
			});
		} catch(e) {
			alert("Something went wrong... Can't fetch profile :(");
			this.props.history.push("/");	
		}
		
		this.props.profileActions.toggleEdit();
	}

	cancelEdit() {
		this.props.profileActions.toggleEdit();
	}

	handleInterestChange(interested) {
		if (interested.length > 6) {
			alert("Please limit to 6 interests :)");
		} else {
			this.setState({ interested });
		}
	}

	handleBioChange(e) {
		this.setState({
			bio: e.target.value
		});
	}

	handleFBChange(e) {
		this.setState({
			links: {
				...this.state.links,
				facebook: e.target.value
			}
		});
	}

	handleGitHubChange(e) {
		this.setState({
			links: {
				...this.state.links,
				github: e.target.value
			}
		});
	}

	handleLinkedInChange(e) {
		this.setState({
			links: {
				...this.state.links,
				linkedin: e.target.value
			}
		});
	}

	handlePHChange(e) {
		this.setState({
			links: {
				...this.state.links,
				producthunt: e.target.value
			}
		});
	}

	handleMediumChange(e) {
		this.setState({
			links: {
				...this.state.links,
				medium: e.target.value
			}
		});
	}

	handleTwitterChange(e) {
		this.setState({
			links: {
				...this.state.links,
				twitter: e.target.value
			}
		});
	}

	handleNameChange(e) {
		this.setState({
			name: e.target.value
		});
	}

	handleHandleChange(e) {
		this.setState({
			handle: e.target.value
		});
	}

	handleCompanyChange(e) {
		this.setState({
			position: {
				...this.state.position,
				company: e.target.value
			}
		});
	}

	handleTitleChange(e) {
		this.setState({
			position: {
				...this.state.position,
				title: e.target.value
			}
		});
	}

	submitChanges() {
		//validate handle against Meteor.users
		if (this.state.handle != this.props.user.handle && Meteor.users.findOne({ handle: this.state.handle })) {
			alert(`Oops. Someone has taken the handle @${this.state.handle}`);
		} else {
			const updates = {
				interested: this.state.interested,
				name: this.state.name,
				handle: this.state.handle,
				bio: this.state.bio,
				position: this.state.position,
				links: this.state.links,
			};

			Meteor.call("update.user.profile", updates, (err) => {
				if (err) {
					alert("Profile update failed...");
					this.props.history.push("/");
				} else {
					alert("Profile updated successfuly!");
					this.props.profileActions.toggleEdit();
				}
			});
		}
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
					<div className="user-pic" style={{ background: getProfilePic(this.props.user) }}></div>
					{!this.props.showingOthersProfile && this.props.edit
						?
						<input type="text" className="name-edit"  value={this.state.name} onChange={this.handleNameChange} />
						:
						<h2 refs="name">{this.props.user.surphaze.profile.name}</h2>
					}
					{!this.props.showingOthersProfile && this.props.edit
						?
						<div className="handle-wrap">@ <input type="text" className="handle-edit"  value={this.state.handle} onChange={this.handleHandleChange} /></div>
						:
						<Link to={`/${this.props.user.handle}`}>@{this.props.user.handle}</Link>
					}
				</div>
				{!this.props.showingOthersProfile && this.props.edit
					?
					<div className="position-wrap">
						<input type="text" value={this.state.position.title} onChange={this.handleTitleChange} />
						<div className="company-wrap">
							@<input type="text" value={this.state.position.company} onChange={this.handleCompanyChange} />
						</div>
					</div>
					:
					<p className="aka">{getAKA(this.props.user)}</p>
				}
				<p className="count">{this.props.user.surphaze.connections.length} Connections</p>

				{this.props.showingOthersProfile
					?
					<div className="buttons own">	{/* <div className={`buttons ${this.props.user._id == Meteor.userId() && "own"}`}> */}
						<button data-tip data-for="connect">CONNECT</button>
						<button data-tip data-for="chat">CHAT</button>
						<ReactTooltip id="connect" effect="solid"><span>Feature coming soon!</span></ReactTooltip>
						<ReactTooltip id="chat" effect="solid"><span>Feature coming soon!</span></ReactTooltip>
					</div>
					: !this.props.edit &&
						<div className="buttons">
							<button onClick={() => this.initEdit()}><i className="fa fa-pencil-square-o profiled" /> Edit</button>
						</div>
				}
				
				{this.props.showingOthersProfile
					?
					<p className="short-bio">
						{processBio(getBio(this.props.user), this.state.shortenBio, this.toggleBio)}
					</p>
					: this.props.edit
						?
						<textarea className="bio-edit" placeholder="Tell us about you!" value={this.state.bio} onChange={this.handleBioChange} />
						:
						<div className="short-bio-edit">
							<p>{getBio(this.props.user)}</p>
						</div>
				}
				
				{/* db.users.find({"surphaze.profile.interested": {$all: ["React"]}} */}
				<div className="topics-wrapper">
					<h3>#Interested Topics</h3>
					{!this.props.showingOthersProfile && this.props.edit
						?
						<TagsInput value={this.state.interested} onChange={this.handleInterestChange} />
						:
						<div className="topics">
							{this.props.user.surphaze && this.props.user.surphaze.profile.interested.map((topic, i) => (
								<Link key={i} className="topic" data-tip data-for="beta2" onClick={() => alert("You will be able to search by tags soon!")} to={`/tag/${topic}`}>{topic}</Link>
							))}

							<ReactTooltip id="beta2" effect="solid">
								<span>Feature scheduled in beta 2!</span>
							</ReactTooltip>
						</div>
					}
				</div>

				<div className="socials-wrapper">
					<h3>#Social Media</h3>
					{!this.props.showingOthersProfile && this.props.edit
						?
						<div className="social-medias-edit">
							<div className="sm">
								<i className="fa fa-facebook" />
								<input type="text" value={this.state.links.facebook} onChange={this.handleFBChange} />
							</div>

							<div className="sm">
								<i className="fa fa-twitter" />
								<input type="text" value={this.state.links.twitter} onChange={this.handleTwitterChange} />
							</div>

							<div className="sm">
								<i className="fa fa-linkedin" />
								<input type="text" value={this.state.links.linkedin} onChange={this.handleLinkedInChange} />
							</div>

							<div className="sm">
								<i className="fa fa-github" />
								<input type="text" value={this.state.links.github} onChange={this.handleGitHubChange} />
							</div>
							
							<div className="sm">
								<i className="fa fa-medium" />
								<input type="text" value={this.state.links.medium} onChange={this.handleMediumChange} />
							</div>

							<div className="sm">
								<i className="fa fa-product-hunt" />
								<input type="text" value={this.state.links.producthunt} onChange={this.handlePHChange} />
							</div>
						</div>
						:
						<div className="social-medias">
							{this.props.user.surphaze && this.props.user.surphaze.profile.links.facebook &&
								<a className="sm" rel="noopener noreferrer" target="_blank" href={this.props.user.surphaze.profile.links.facebook}><i className="fa fa-facebook" /></a>
							}

							{this.props.user.surphaze && this.props.user.surphaze.profile.links.twitter &&
								<a className="sm" rel="noopener noreferrer" target="_blank" href={this.props.user.surphaze.profile.links.twitter}><i className="fa fa-twitter" /></a>
							}

							{this.props.user.surphaze && this.props.user.surphaze.profile.links.linkedin &&
								<a className="sm" rel="noopener noreferrer" target="_blank" href={this.props.user.surphaze.profile.links.linkedin}><i className="fa fa-linkedin" /></a>
							}

							{this.props.user.surphaze && this.props.user.surphaze.profile.links.github &&
								<a className="sm" rel="noopener noreferrer" target="_blank" href={this.props.user.surphaze.profile.links.github}><i className="fa fa-github" /></a>
							}

							{this.props.user.surphaze && this.props.user.surphaze.profile.links.medium &&
								<a className="sm" rel="noopener noreferrer" target="_blank" href={this.props.user.surphaze.profile.links.medium}><i className="fa fa-medium" /></a>
							}

							{this.props.user.surphaze && this.props.user.surphaze.profile.links.producthunt &&
								<a className="sm" rel="noopener noreferrer" target="_blank" href={this.props.user.surphaze.profile.links.producthunt}><i className="fa fa-product-hunt" /></a>
							}
						</div>
					}
				</div>

				{!this.props.showingOthersProfile && this.props.edit &&
					<div className="buttons">
						<button onClick={() => this.cancelEdit()}>Cancel</button>
						<button onClick={() => this.submitChanges()}>Submit</button>
					</div>
				}

				{/*
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
				*/}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		showingOthersProfile: state.forums.showingOthersProfile,
		edit: state.profile.edit
	};
};

const mapDispatchToProps = dispatch => {
	return {
		forumActions: bindActionCreators(forumActionCreators, dispatch),
		profileActions: bindActionCreators(profileActionCreators, dispatch),
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
					{ handle: props.match.params.id }
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