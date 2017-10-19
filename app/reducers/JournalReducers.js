import { FETCH_JOURNAL_SUCCESS, CLEAR_JOURNAL_STATE, FETCH_JOURNALS_SUCCESS } from '../actions/ActionTypes';

export const journal = (state = null, action) => {
  switch (action.type) {
    case FETCH_JOURNAL_SUCCESS:
      return action.journal;
    case CLEAR_JOURNAL_STATE:
      return null;
    default:
      return state;
  }
};

export const journals = (state = [], action) => {
  switch (action.type) {
    case FETCH_JOURNALS_SUCCESS:
      return action.journals;
    default:
      return state;
  }
};
