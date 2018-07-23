import React from "react";
import { Meteor } from "meteor/meteor";
import { Route, Link, Switch } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import forumActionCreators from "./actions/forum-actions";

// Pages
import Profile from "./Profile";
import Landing from "./Landing";
import NoFound from "./NoFound";

class Forum extends React.Component {
	static propTypes = {
		loggingIn: PropTypes.bool,
		forumHidden: PropTypes.bool,
		forumActions: PropTypes.object,
		showingOthersProfile: PropTypes.bool,
	};

	constructor(props) {
		super(props);
	}

	toggleForum() {
		if (Meteor.userId()) {
			this.props.forumActions.toggleForum();
		}
	}

	render() {
		const { forumHidden, showingOthersProfile } = this.props;

		return (
			<div className={`forum ${forumHidden && "hide"} ${showingOthersProfile && "others-profile"}`}>
				<div className="tools">
					<div className="top">
						<p className="close" onClick={() => this.toggleForum()}>＋</p>
					</div>
					<div className="bot">
						{!this.props.loggingIn && Meteor.user() && Meteor.user().services &&
							<Link to="/profile"><div className="user-pic" style={{ background: `url(https://res.cloudinary.com/outwerspace/image/facebook/w_100,h_100,r_max/${Meteor.user().services.facebook.id}.png)` }}></div></Link>
						}
						<Link to="/"><img className="small-logo" src="/small-logo.svg" alt="logo" /></Link>
					</div>
				</div>

				{
					this.props.loggingIn
						? 
						<img src="/spinner.svg" className="spinner" alt="spinner" />
						:
						<Switch>
							<Route exact path="/" component={Landing} />
							<Route exact path="/profile" component={Profile} />
							<Route path="/:id" component={Profile} />
							<Route component={NoFound} />
						</Switch>
				}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		forumHidden: state.forums.forumHidden,
		showingOthersProfile: state.forums.showingOthersProfile,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		forumActions: bindActionCreators(forumActionCreators, dispatch)
	};
};

const ForumContainer = withTracker((props) => {
	const loggingIn = Meteor.loggingIn();
	
	return {
		...props,
		loggingIn
	};
})(Forum);

export default connect(mapStateToProps, mapDispatchToProps)(ForumContainer);