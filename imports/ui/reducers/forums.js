const initialState = {
	forumHidden: false,
	showingOthersProfile: false,
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