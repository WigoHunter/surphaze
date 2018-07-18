import { Meteor } from "meteor/meteor";

if (Meteor.isServer) {
	Meteor.publish("userData", function() {
		return Meteor.users.find(this.userId, {
			fields: {
				_id: 1,
				emails: 1,
				services: 1,
				surphaze: 1,
			}
		});
	});
}
