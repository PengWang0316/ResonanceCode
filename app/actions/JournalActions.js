import { FETCH_JOURNAL_SUCCESS, CLEAR_JOURNAL_STATE } from "./ActionTypes";
import { isLoading } from "./LoadingActions";
import { getJournalBasedOnId, getUnattachedJournalBasedOnId } from "../apis/DatabaseApi";

export const fetchJournal = journalId => {
  return dispatch => {
    dispatch(isLoading(true));
    getJournalBasedOnId(journalId).then(result => {
      dispatch(isLoading(false));
      dispatch(featchJournalSuccess(result.data));
    });
  };
};

export const fetchUnattachedJournal = journalId => {
  return dispatch => {
    dispatch(isLoading(true));
    getUnattachedJournalBasedOnId(journalId).then(result => {
      dispatch(isLoading(false));
      dispatch(featchJournalSuccess(result.data));
    });
  };
};

export const clearJournalState = _ => ({type: CLEAR_JOURNAL_STATE});

const featchJournalSuccess = (journal) => {
  return {
    type: FETCH_JOURNAL_SUCCESS,
    journal
  };
};
