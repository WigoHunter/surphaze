import { Meteor } from "meteor/meteor";

Meteor.methods({
	"user.setLocation"(data) {
		Meteor.users.update({
			_id: Meteor.userId()
		}, {
			$set: {
				"surphaze.location": data
			}
		});
	}
});