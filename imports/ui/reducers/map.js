const initialState = {
	maxZoom: 3
};

function map(state = initialState, action) {
	const { type } = action;

	switch(type) {
	case "ALLOW_ZOOM":
		return {
			...state,
			maxZoom: 13,
		};
	
	default:
		return state;
	}
}

export default map;