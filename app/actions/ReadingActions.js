import axios from 'axios';

import { READING_FETCH_RECENT_SUCCESS, ADDREADING_CLICK_COIN, CLEAR_ADD_READING_TEMP_STATE, CREATE_READING_SUCESS, DELETE_READING_SUCCESS, FEATCH_SEARCH_READINGS_SUCCESS, FETCH_READINGS_AMOUNT_SUCCESS, ALL_READING_LIST_FETCH_SUCCESS } from './ActionTypes';
import isLoading from './LoadingActions';
import sendExtraMessage from './ExtraMessageActions';
import { fetchHexagramsSuccess } from './HexagramActions';
import { JWT_MESSAGE, NUMBER_OF_READING_PER_PAGE, NUMBER_OF_READING_PER_PAGE_RECENT_READINGS } from '../config';
import { API_FETCH_READINGS, API_FETCH_READINGS_BASEON_HEXAGRAM, API_SEARCH_READINGS, API_CREATE_READING, API_DELETE_READING, API_FETCH_SEARCH_READINGS, API_FETCH_ALL_READING_LIST, API_FETCH_READINGS_AMOUNT } from './ApiUrls';
// import { getRecentReadings, getReadings, getReadingsBasedOnHexagram } from "../apis/DatabaseApi";

const NO_RESULT_MESSAGE = 'No reading was found! :(';
const EMPTY_MESSAGE = '';

const createReadingSuccess = reading => ({
  type: CREATE_READING_SUCESS,
  reading
});

const fetchReadingsAmountSuccess = readingsAmount => ({
  type: FETCH_READINGS_AMOUNT_SUCCESS,
  readingsAmount
});

export const fetchRecentReadingsSuccess = readings => ({
  type: READING_FETCH_RECENT_SUCCESS,
  readings
});

export const fetchAllReadingListSuccess = allReadingList => ({
  type: ALL_READING_LIST_FETCH_SUCCESS,
  allReadingList
});

export const deleteReadingSuccess = readingId => ({
  type: DELETE_READING_SUCCESS,
  readingId
});

const fetchSearchReadingsSuccess = searchReadings => ({
  type: FEATCH_SEARCH_READINGS_SUCCESS,
  searchReadings
});

export const clearReadings = _ => fetchRecentReadingsSuccess([]);

export const fetchRecentReadings = startNumber => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_READINGS, {
    params: {
      jwt: localStorage.getItem(JWT_MESSAGE),
      startNumber,
      limitedNumber: NUMBER_OF_READING_PER_PAGE_RECENT_READINGS
    }
  }).then(response => {
    dispatch(isLoading(false));
    dispatch(fetchRecentReadingsSuccess(response.data));
  });
  /* getRecentReadings(userId, startNumber).then(result => {
      dispatch(isLoading(false));
      dispatch(fetchRecentReadingsSuccess(result.data));
    }); */
};

export const fetchAllReadingList = pageNumber => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_ALL_READING_LIST, {
    params: {
      jwt: localStorage.getItem(JWT_MESSAGE), pageNumber, numberPerpage: NUMBER_OF_READING_PER_PAGE
    }
  }).then(response => {
    if (response.data.length === 0) dispatch(sendExtraMessage(NO_RESULT_MESSAGE));
    else dispatch(sendExtraMessage(EMPTY_MESSAGE));
    dispatch(fetchAllReadingListSuccess(response.data));
    dispatch(isLoading(false));
  });
};

export const searchReadings = searchCriterias => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_SEARCH_READINGS, {
    params: { searchCriterias, jwt: localStorage.getItem(JWT_MESSAGE) }
  }).then(response => {
    if (response.data.length === 0) dispatch(sendExtraMessage(NO_RESULT_MESSAGE));
    else dispatch(sendExtraMessage(EMPTY_MESSAGE));
    dispatch(fetchRecentReadingsSuccess(response.data));
    dispatch(isLoading(false));
  });
/* Deprecated old version
    getReadings(searchCriterias).then(result => {
      dispatch(isLoading(false));
      result.data.length === 0 ? dispatch(sendExtraMessage(NO_RESULT_MESSAGE)) : dispatch(sendExtraMessage(EMPTY_MESSAGE));
      dispatch(fetchRecentReadingsSuccess(result.data));
    }); */
};


export const fetchReadingsBaseOnHexagram = imgArr => dispatch => {
  dispatch(isLoading(true));
  return axios.get(
    API_FETCH_READINGS_BASEON_HEXAGRAM,
    { params: { img_arr: imgArr, jwt: localStorage.getItem(JWT_MESSAGE) } }
  ).then(response => {
    if (response.data.length === 0) dispatch(sendExtraMessage(NO_RESULT_MESSAGE));
    else dispatch(sendExtraMessage(EMPTY_MESSAGE));
    dispatch(fetchHexagramsSuccess([])); // setting hexagram area to blank
    dispatch(fetchRecentReadingsSuccess(response.data));
    dispatch(isLoading(false));
  });

  /* getReadingsBasedOnHexagram(img_arr, userId).then(result => {
      dispatch(isLoading(false));
      result.data.length === 0 ? dispatch(sendExtraMessage(NO_RESULT_MESSAGE)) : dispatch(sendExtraMessage(EMPTY_MESSAGE));
      dispatch(fetchHexagramsSuccess([])); // setting hexagram area to blank
      dispatch(fetchRecentReadingsSuccess(result.data));
    }); */
};

export const clickCoin = addReadingTempState => ({
  type: ADDREADING_CLICK_COIN,
  addReadingTempState
});

export const clearAddReadingTempState = _ => ({
  type: CLEAR_ADD_READING_TEMP_STATE
});

/** Creating a new reading
* @param {object} params contains two objects. Reading and JWT.
* @return {null} No return.
*/
export const createReading = params => dispatch => {
  dispatch(isLoading(true));
  return axios.post(API_CREATE_READING, params).then(response => {
    dispatch(createReadingSuccess(response.data));
    dispatch(isLoading(false));
  });
};

export const deleteReading = readingId => dispatch => {
  dispatch(isLoading(true));
  return axios.delete(API_DELETE_READING, {
    params: { readingId, jwtMessage: localStorage.getItem(JWT_MESSAGE) }
  }).then(_ => {
    dispatch(deleteReadingSuccess(readingId));
    dispatch(isLoading(false));
  });
};

export const fetchReadingBasedOnName = keyWord => dispatch =>
  axios.get(API_FETCH_SEARCH_READINGS, {
    params: {
      keyWord,
      jwtMessage: localStorage.getItem(JWT_MESSAGE)
    }
  }).then(response => dispatch(fetchSearchReadingsSuccess(response.data)));

export const fetchReadingsAmount = _ => dispatch =>
  axios.get(API_FETCH_READINGS_AMOUNT, {
    params: { jwtMessage: localStorage.getItem(JWT_MESSAGE) }
  }).then(response => dispatch(fetchReadingsAmountSuccess(response.data)));

export const clearSearchReadings = _ => fetchSearchReadingsSuccess([]);
