import { combineReducers } from 'redux';

import { readings } from '../reducers/ReadingReducers';
import { isLoading } from '../reducers/LoadingReducers';
import { addReadingTempState } from '../reducers/AddReadingReducers';
import { extraMessage } from '../reducers/ExtraMessageReducers';
import { hexagrams } from '../reducers/HexagramsReducers';
import { journal, journals } from '../reducers/JournalReducers';
// import { login as user }  from "../reducers/LoginReducers";
import { user } from '../reducers/UserReducers';
import bigrams from '../reducers/BigramsReducers';

export default combineReducers({
  user,
  readings,
  isLoading,
  addReadingTempState,
  extraMessage,
  hexagrams,
  journal,
  journals,
  bigrams
});
