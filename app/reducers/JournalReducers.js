import { FETCH_JOURNAL_SUCCESS, CLEAR_JOURNAL_STATE } from "../actions/ActionTypes";

export const journal = (state = null, action) => {
  switch (action.type){
    case FETCH_JOURNAL_SUCCESS:
      return Object.assign({}, action.journal);
    case CLEAR_JOURNAL_STATE:
      return null;
    default:
      return state;
  }
};
