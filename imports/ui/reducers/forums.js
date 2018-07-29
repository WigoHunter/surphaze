const initialState = {
	forumHidden: false,
	showingOthersProfile: false,
	gridMode: false
};

function forums(state = initialState, action) {
	switch (action.type) {

	case "TOGGLE_FORUM":
		return {
			...state,
			forumHidden: !state.forumHidden
		};

	case "OPEN_FORUM":
		return {
			...state,
			forumHidden: false,
		};

	case "CLOSE_FORUM":
		return {
			...state,
			forumHidden: true,
		};

	case "OPEN_GRID_MODE":
		return {
			...state,
			gridMode: true,
		};

	case "CLOSE_GRID_MODE":
		return {
			...state,
			gridMode: false,
		};

	case "SHOWING_OTHERS_PROFILE":
		return {
			...state,
			showingOthersProfile: true,
		};

	case "CLOSING_OTHERS_PROFILE":
		return {
			...state,
			showingOthersProfile: false,
		};

	default: 
		return state;

	}
}

export default forums;