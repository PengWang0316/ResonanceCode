import { FETCH_JOURNAL_SUCCESS } from "../actions/ActionTypes";

export const journal = (state = null, action) => {
  switch (action.type){
    case FETCH_JOURNAL_SUCCESS:
      return action.journal;
    default:
      return state;
  }
};
