import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";

export function loadUser() {
	return dispatch => {
		Tracker.autorun(() => {
			dispatch({
				type: "USER_DATA",
				data: {
					user: Meteor.user(),
					subscription: Meteor.subscribe("userData"),
				}
			});
		});
	};
}