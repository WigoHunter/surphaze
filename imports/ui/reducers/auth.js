const initialState = {
	user: {},
};

function auths (state = initialState, action) {
	const { data, type } = action;

	switch(type) {
	case "USER_DATA":
		return {
			...state,
			user: data.user || {},
			isLoaded: data.subscription.ready(),
		};
	
	default:
		return state;
	}
}

export default auths;