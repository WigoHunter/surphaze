import { combineReducers } from "redux";
import forums from "./forums";
import auths from "./auth";
import ui from "./ui";

const appReducer = combineReducers({
	auths,
	ui,
	forums
});

export default appReducer;