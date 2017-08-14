import { combineReducers } from "redux";

import { readings } from "../reducers/ReadingReducers";
import { isLoading } from "../reducers/LoadingReducers";
import { addReadingTempState } from "../reducers/AddReadingReducers";
import { extraMessage } from "../reducers/ExtraMessageReducers";
import { hexagrams } from "../reducers/HexagramsReducers";
import { journal } from "../reducers/JournalReducers";
// import { login as user }  from "../reducers/LoginReducers";

export default combineReducers({
  readings,
  isLoading,
  addReadingTempState,
  extraMessage,
  hexagrams,
  journal
});
