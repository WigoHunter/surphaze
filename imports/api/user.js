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
	},

	"user.update.github"(data) {
		Meteor.users.update({
			_id: Meteor.userId()
		}, {
			$set: {
				"services.github.addon": data
			}
		});
	}
});