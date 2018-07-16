const initialState = {
	forumHidden: false
};

function forums(state = initialState, action) {
	switch (action.type) {

	case "TOGGLE_FORUM": {
		return {
			...state,
			forumHidden: !state.forumHidden
		};
	}
	default: {
		return state;
	}

	}
}

export default forums;