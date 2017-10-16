import axios from 'axios';
import { READING_FETCH_RECENT_SUCCESS, ADDREADING_CLICK_COIN, CLEAR_ADD_READING_TEMP_STATE, CREATE_READING_SUCESS, DELETE_READING_SUCCESS } from './ActionTypes';
import isLoading from './LoadingActions';
import sendExtraMessage from './ExtraMessageActions';
import { fetchHexagramsSuccess } from './HexagramActions';
import { JWT_MESSAGE } from '../config';
import { API_FETCH_READINGS, API_FETCH_READINGS_BASEON_HEXAGRAM, API_SEARCH_READINGS, API_CREATE_READING, API_DELETE_READING } from './ApiUrls';
// import { getRecentReadings, getReadings, getReadingsBasedOnHexagram } from "../apis/DatabaseApi";

const NO_RESULT_MESSAGE = 'No reading was found! :(';
const EMPTY_MESSAGE = '';
const createReadingSuccess = reading => ({
  type: CREATE_READING_SUCESS,
  reading
});

export const fetchRecentReadingsSuccess = readings => ({
  type: READING_FETCH_RECENT_SUCCESS,
  readings
});

export const deleteReadingSuccess = readingId => ({
  type: DELETE_READING_SUCCESS,
  readingId
});

export const clearReadings = _ => fetchRecentReadingsSuccess([]);

export const fetchRecentReadings = startNumber => dispatch => {
  dispatch(isLoading(true));
  axios.get(API_FETCH_READINGS, { params: { jwt: localStorage.getItem(JWT_MESSAGE), startNumber, limitedNumber: 5 } })
    .then(response => {
      dispatch(isLoading(false));
      dispatch(fetchRecentReadingsSuccess(response.data));
    });
  /* getRecentReadings(userId, startNumber).then(result => {
      dispatch(isLoading(false));
      dispatch(fetchRecentReadingsSuccess(result.data));
    }); */
};

export const searchReadings = searchCriterias => dispatch => {
  dispatch(isLoading(true));
  axios.get(API_SEARCH_READINGS, { params: { searchCriterias, jwt: localStorage.getItem(JWT_MESSAGE) } }).then(response => {
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
  axios.get(API_FETCH_READINGS_BASEON_HEXAGRAM, { params: { img_arr: imgArr, jwt: localStorage.getItem(JWT_MESSAGE) } }).then(response => {
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
  axios.post(API_CREATE_READING, params).then(response => {
    dispatch(createReadingSuccess(response.data));
    dispatch(isLoading(false));
  });
};

export const deleteReading = readingId => dispatch => {
  dispatch(isLoading(true));
  axios.delete(API_DELETE_READING, {
    params: { readingId, jwtMessage: localStorage.getItem(JWT_MESSAGE) }
  }).then(_ => {
    dispatch(deleteReadingSuccess(readingId));
    dispatch(isLoading(false));
  });
};
