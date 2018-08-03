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
	},

	"user.update.linkedin"(data) {
		Meteor.users.update({
			_id: Meteor.userId()
		}, {
			$set: {
				"services.linkedin.addon": data
			}
		});
	},

	"update.user.profile"(data) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not authorized");
		}

		Meteor.users.update({
			_id: Meteor.userId()
		}, {
			$set: {
				"surphaze.profile": {
					name: data.name,
					bio: data.bio,
					position: data.position,
					interested: data.interested,
					links: data.links,
				},
				"handle": data.handle
			}
		});
	}
});
