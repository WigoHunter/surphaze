const initialState = {
	loading: false,
	confirmingLocation: false,
};

function ui (state = initialState, action) {
	switch (action.type) {

	case "TOGGLE_LOADING":
		return {
			...state,
			loading: !state.loading
		};

	case "TOGGLE_CONFIRMING_LOCATION":
		return {
			...state,
			confirmingLocation: !state.confirmingLocation
		};

	case "END_CONFIRMING_LOCATION":
		return {
			...state,
			confirmingLocation: false,
		};

	default: 
		return state;

	}
}

export default ui;