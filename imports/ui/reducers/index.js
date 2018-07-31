import { combineReducers } from "redux";
import forums from "./forums";
import auths from "./auth";
import ui from "./ui";
import profile from "./profile";

const appReducer = combineReducers({
	auths,
	ui,
	forums,
	profile
});

export default appReducer;