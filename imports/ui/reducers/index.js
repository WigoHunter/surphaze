import { combineReducers } from "redux";
import forums from "./forums";
import auths from "./auth";
import ui from "./ui";
import profile from "./profile";
import map from "./map";

const appReducer = combineReducers({
	auths,
	ui,
	forums,
	profile,
	map
});

export default appReducer;