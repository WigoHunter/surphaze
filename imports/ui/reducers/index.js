import { combineReducers } from "redux";
import forums from "./forums";
import auths from "./auth";

const appReducer = combineReducers({
	auths,
	forums
});

export default appReducer;