import axios from 'axios';

import { FETCH_JOURNAL_SUCCESS, CLEAR_JOURNAL_STATE, FETCH_JOURNALS_SUCCESS } from './ActionTypes';
import isLoading from './LoadingActions';
import { API_FETCH_UNATTACHED_JOURNALS, API_FETCH_JOURNALS, API_UPDATE_JOURNAL, API_CREATE_JOURNAL, API_FETCH_JOURNAL_BASED_ON_ID, API_DELETE_UNATTACHED_JOURNAL, API_DELETE_JOURNAL, API_FETCH_JOURNAL_BASED_ON_READING_JOURANL_ID, API_UPDATE_JOURNAL_SHARE_LIST } from './ApiUrls';
import { JWT_MESSAGE } from '../config';

const featchJournalSuccess = journal => ({ type: FETCH_JOURNAL_SUCCESS, journal });

const fetchJournalsSuccessful = journals => ({ type: FETCH_JOURNALS_SUCCESS, journals });

export const clearJournalState = _ => ({ type: CLEAR_JOURNAL_STATE });

export const fetchUnattachedJournals = _ => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_UNATTACHED_JOURNALS, {
    params: {
      jwtMessage: localStorage.getItem(JWT_MESSAGE)
    }
  }).then(response => {
    dispatch(fetchJournalsSuccessful(response.data));
    dispatch(isLoading(false));
  });
};

export const fetchJournals = readingId => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_JOURNALS, {
    params: { jwtMessage: localStorage.getItem(JWT_MESSAGE), readingId }
  }).then(response => {
    dispatch(fetchJournalsSuccessful(response.data));
    dispatch(isLoading(false));
  });
};

export const fetchJournal = journalId => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_JOURNAL_BASED_ON_ID, {
    params: {
      journalId,
      jwtMessage: localStorage.getItem(JWT_MESSAGE)
    }
  }).then(response => {
    dispatch(featchJournalSuccess(response.data));
    dispatch(isLoading(false));
  });
};

export const fetchJournalBasedOnReadingJournal = ({ readingId, journalId }) => dispatch =>
  axios.get(API_FETCH_JOURNAL_BASED_ON_READING_JOURANL_ID, {
    params: {
      readingId, journalId, jwtMessage: localStorage.getItem(JWT_MESSAGE)
    }
  }).then(response => dispatch(featchJournalSuccess(response.data)));

export const fetchUnattachedJournal = journalId => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_JOURNAL_BASED_ON_ID, {
    params: {
      journalId,
      jwtMessage: localStorage.getItem(JWT_MESSAGE),
      isUnattachedJournal: true
    }
  }).then(response => {
    dispatch(featchJournalSuccess(response.data));
    dispatch(isLoading(false));
  });
};

export const updateJournal = journal => dispatch => {
  dispatch(isLoading(true));
  return axios.put(API_UPDATE_JOURNAL, {
    journal,
    jwtMessage: localStorage.getItem(JWT_MESSAGE)
  }).then(_ => {
    dispatch(clearJournalState());
    dispatch(isLoading(false));
  });
};

export const createJournal = journal => dispatch => {
  dispatch(isLoading(true));
  return axios.post(API_CREATE_JOURNAL, {
    journal,
    jwtMessage: localStorage.getItem(JWT_MESSAGE)
  }).then(_ => {
    dispatch(clearJournalState());
    dispatch(isLoading(false));
  });
};

export const deleteJournal = ({ journalId, readingIds }) => dispatch => {
  dispatch(isLoading(true));
  // THe reason of why user "post" instead of "delete" is we need to send an array that contains all reading's id related to this journal. If this journal is attaching to too many readings, the url may hit the limitation when we use the delete.
  return axios.post(API_DELETE_JOURNAL, {
    journalId,
    readingIds,
    jwtMessage: localStorage.getItem(JWT_MESSAGE)
  }).then(_ => {
    dispatch(clearJournalState());
    dispatch(isLoading(false));
  });
};

export const deleteUnattachedJournal = journalId => dispatch => {
  dispatch(isLoading(true));
  return axios.delete(API_DELETE_UNATTACHED_JOURNAL, {
    params: {
      journalId,
      jwtMessage: localStorage.getItem(JWT_MESSAGE)
    }
  }).then(_ => {
    dispatch(clearJournalState());
    dispatch(isLoading(false));
  });
};

export const updateJournalShareList = params => dispatch =>
  axios.put(API_UPDATE_JOURNAL_SHARE_LIST, {
    ...params, jwtMessage: localStorage.getItem(JWT_MESSAGE)
  }).then(_ => dispatch(clearJournalState()));
