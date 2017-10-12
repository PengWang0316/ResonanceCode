import axios from 'axios';
import { FETCH_JOURNAL_SUCCESS, CLEAR_JOURNAL_STATE, FETCH_JOURNALS_SUCCESS } from './ActionTypes';
import isLoading from './LoadingActions';
import { getJournalBasedOnId, getUnattachedJournalBasedOnId } from '../apis/DatabaseApi';
import { API_FETCH_UNATTACHED_JOURNALS, API_FETCH_JOURNALS } from './ApiUrls';
import { JWT_MESSAGE } from '../config';

const featchJournalSuccess = journal => ({ type: FETCH_JOURNAL_SUCCESS, journal });

const fetchJournalsSuccessful = journals => ({ type: FETCH_JOURNALS_SUCCESS, journals });

export const fetchUnattachedJournals = _ => dispatch => {
  dispatch(isLoading(true));
  axios.get(API_FETCH_UNATTACHED_JOURNALS, { params: { jwt: localStorage.getItem(JWT_MESSAGE) } })
    .then(response => {
      dispatch(fetchJournalsSuccessful(response.data));
      dispatch(isLoading(false));
    });
};

export const fetchJournals = readingId => dispatch => {
  dispatch(isLoading(true));
  axios.get(API_FETCH_JOURNALS, { params: { jwt: localStorage.getItem(JWT_MESSAGE), readingId } })
    .then(response => {
      dispatch(fetchJournalsSuccessful(response.data));
      dispatch(isLoading(false));
    });
};

export const fetchJournal = journalId => dispatch => {
  dispatch(isLoading(true));
  getJournalBasedOnId(journalId).then(result => {
    dispatch(featchJournalSuccess(result.data));
    dispatch(isLoading(false));
  });
};

export const fetchUnattachedJournal = journalId => dispatch => {
  dispatch(isLoading(true));
  getUnattachedJournalBasedOnId(journalId).then(result => {
    dispatch(featchJournalSuccess(result.data));
    dispatch(isLoading(false));
  });
};

export const clearJournalState = _ => ({ type: CLEAR_JOURNAL_STATE });
