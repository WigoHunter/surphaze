import React from "react";
import { Meteor } from "meteor/meteor";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

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
		this.getUserSetup();
		console.log("mounting", this.props); // eslint-disable-line
	}

	componentDidUpdate() {
		this.getUserSetup();
		console.log("updating", this.props); // eslint-disable-line
	}

	getUserSetup() {
		// TO FIX: Seems to override toggle forum
		this.props.forumActions.openForum();
	}

	render() {
		if (this.props.loading) {
			return null;
		}

		if (!this.props.user) {
			return (
				<UserNotFound />
			);
		}

		return (
			<div className="profile" onClick={() => this.props.history.push("/hi")}>{this.props.user._id}</div>
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
			user: Meteor.users.findOne({ _id: props.match.params.id }),
		};
	}

	props.forumActions.closingOthersProfile();
	return {
		user: Meteor.user()
	};
})(Profile);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfileContainer));