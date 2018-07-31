const initialState = {
	editBio: false,
	editInterests: false,
	editFB: false,
	editTwitter: false,
	editLinkedIn: false,
	editGitHub: false,
	editMedium: false,
	editProductHunt: false,
};

function profile(state = initialState, action) {
	switch (action.type) {

	case "TOGGLE_EDIT_BIO":
		return {
			...state,
			editBio: !state.editBio
		};

	case "TOGGLE_EDIT_INTERESTS":
		return {
			...state,
			editInterests: !state.editInterests
		};

	case "TOGGLE_EDIT_FB":
		return {
			...state,
			editFB: !state.editFB
		};

	case "TOGGLE_EDIT_TWITTER":
		return {
			...state,
			editTwitter: !state.editTwitter
		};

	case "TOGGLE_EDIT_LINKEDIN":
		return {
			...state,
			editLinkedIn: !state.editLinkedIn
		};

	case "TOGGLE_EDIT_GITHUB":
		return {
			...state,
			editGitHub: !state.editGitHub
		};

	case "TOGGLE_EDIT_MEDIUM":
		return {
			...state,
			editMedium: !state.editMedium
		};
	
	case "TOGGLE_EDIT_PRODUCTHUNT":
		return {
			...state,
			editProductHunt: !state.editProductHunt
		};

	default: 
		return state;

	}
}

export default profile;