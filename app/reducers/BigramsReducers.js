import { FETCH_LINES_BIGRAMS_SUCCESS } from '../actions/ActionTypes';

const bigrams = (state = {}, action) => {
  switch (action.type) {
    case FETCH_LINES_BIGRAMS_SUCCESS:
      return Object.assign({}, state, {
        [action.bigramInfo.readingId]: action.bigramInfo.bigrams
      });
    default:
      return state;
  }
};
export default bigrams;
