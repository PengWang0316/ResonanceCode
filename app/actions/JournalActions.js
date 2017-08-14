import { FETCH_JOURNAL_SUCCESS } from "./ActionTypes";
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

const featchJournalSuccess = (journal) => {
  return {
    type: FETCH_JOURNAL_SUCCESS,
    journal
  };
};
