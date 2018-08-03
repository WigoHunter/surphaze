const initialState = {
	edit: false
};

function profile(state = initialState, action) {
	switch (action.type) {

	case "TOGGLE_EDIT":
		return {
			...state,
			edit: !state.edit
		};

	case "CLOSE_EDIT":
		return {
			...state,
			edit: false
		};

	default: 
		return state;

	}
}

export default profile;