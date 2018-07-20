const initialState = {
	user: {},
	initLocation: false
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
	
	case "INIT_LOCATION":
		return {
			...state,
			initLocation: true
		};
	
	case "DONE_LOCATION":
		return {
			...state,
			initLocation: false
		};

	case "SET_LOCATION":
		return state.initLocation ? {
			...state,
			user: {
				...state.user,
				surphaze: {
					...state.user.surphaze,
					location: data
				}
			}
		} : state;
	
	default:
		return state;
	}
}

export default auths;