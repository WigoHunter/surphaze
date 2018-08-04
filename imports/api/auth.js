import { ServiceConfiguration } from "meteor/service-configuration";
import { Accounts } from "meteor/accounts-base";
import { keys } from "../../keys.json";

ServiceConfiguration.configurations.remove({
	service: "facebook"
});

ServiceConfiguration.configurations.insert({
	service: "facebook",
	appId: keys.facebook.appId,
	secret: keys.facebook.secret
});

ServiceConfiguration.configurations.remove({
	service: "github"
});

ServiceConfiguration.configurations.insert({
	service: "github",
	clientId: keys.github.clientId,
	secret: keys.github.secret,
});

ServiceConfiguration.configurations.remove({
	service: "linkedin"
});

ServiceConfiguration.configurations.insert({
	service: "linkedin",
	clientId: keys.linkedin.clientId,
	secret: keys.linkedin.secret,
});

// const processHandle = str => str.replace(" ", "").toLowerCase();

Accounts.onCreateUser(function (options, user) {
	if (!user.services.facebook) {
		return user;
	}
	user.handle = user._id;
	user.emails = [{address: user.services.facebook.email}];
	// TO REMOVE: TESTING
	user.surphaze = {
		location: null,
		connections: [],
		await_invitation: [],
		profile: {
			name: user.services.facebook.name,
			bio: "",
			interested: ["Meeting Friends on Surphaze"],
			position: {
				title: "Maker",
				company: "Hello World",
				city: "",
			},
			links: {
				twitter: "",
				facebook: "",
				medium: "",
				linkedin: "",
				github: "",
				producthunt: "",
			}
		}
	};

	return user;
});