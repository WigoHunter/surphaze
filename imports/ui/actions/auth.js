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

export function initLocation() {
	return {
		type: "INIT_LOCATION"
	};
}

export function doneLocation() {
	return {
		type: "DONE_LOCATION"
	};
}

export function setUserLocation(data) {
	return {
		type: "SET_LOCATION",
		data
	};
}