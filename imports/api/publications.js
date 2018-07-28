import { Meteor } from "meteor/meteor";

if (Meteor.isServer) {
	Meteor.publish("userData", function() {
		return Meteor.users.find(this.userId, {
			fields: {
				_id: 1,
				emails: 1,
				services: 1,
				surphaze: 1,
				username: 1,
			}
		});
	});

	// NEED ANOTHER PUBLISHMENT FOR UNLOGGED IN USERS

	Meteor.publish("users", function() {
		return Meteor.users.find({}, {
			fields: {
				_id: 1,
				emails: 1,
				services: 1,
				surphaze: 1,
				username: 1,
			}
		});
	});
}
