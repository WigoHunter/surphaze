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

Accounts.onCreateUser(function (options, user) {
	if (!user.services.facebook) {
		return user;
	}
	user.username = user.services.facebook.name;
	user.emails = [{address: user.services.facebook.email}];
	user.surphaze = {
		location: null
	};

	return user;
});