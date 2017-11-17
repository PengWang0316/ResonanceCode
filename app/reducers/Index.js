import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';


import { readings, addReadingTempState, searchReadings, readingsAmount, allReadingList } from '../reducers/ReadingReducers';
import isLoading from '../reducers/LoadingReducers';
// import { addReadingTempState } from '../reducers/AddReadingReducers';
import extraMessage from '../reducers/ExtraMessageReducers';
import { hexagrams, hexagram } from '../reducers/HexagramsReducers';
import { journal, journals } from '../reducers/JournalReducers';
// import { login as user }  from "../reducers/LoginReducers";
import { user, users, usersAmount } from '../reducers/UserReducers';
import bigrams from '../reducers/BigramsReducers';

export default combineReducers({
  user,
  users,
  usersAmount,
  readings,
  readingsAmount,
  allReadingList,
  isLoading,
  addReadingTempState,
  searchReadings,
  extraMessage,
  hexagrams,
  hexagram,
  journal,
  journals,
  bigrams
  // router: routerReducer
});
