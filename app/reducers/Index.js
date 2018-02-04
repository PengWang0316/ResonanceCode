import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';


import { readings, addReadingTempState, searchReadings, readingsAmount, allReadingList, sharedReadings, sharedReadingsAmount } from '../reducers/ReadingReducers';
import isLoading from '../reducers/LoadingReducers';
// import { addReadingTempState } from '../reducers/AddReadingReducers';
import extraMessage from '../reducers/ExtraMessageReducers';
import { hexagrams, hexagram } from '../reducers/HexagramsReducers';
import { journal, journals, allJournal } from '../reducers/JournalReducers';
// import { login as user }  from "../reducers/LoginReducers";
import { user, users, usersAmount } from '../reducers/UserReducers';
// import bigrams from '../reducers/BigramsReducers';

export default combineReducers({
  addReadingTempState,
  allJournal,
  allReadingList,
  // bigrams,
  extraMessage,
  hexagram,
  hexagrams,
  isLoading,
  journal,
  journals,
  readings,
  readingsAmount,
  user,
  users,
  usersAmount,
  // userGroups,
  searchReadings,
  sharedReadings,
  sharedReadingsAmount
  // router: routerReducer
});
