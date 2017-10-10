import axios from "axios";
import { READING_FETCH_RECENT_SUCCESS } from "./ActionTypes";
import { isLoading } from "./LoadingActions";
import { sendExtraMessage } from "./ExtraMessageActions";
import { fetchHexagramsSuccess } from "./HexagramActions";
import { JWT_MESSAGE } from "../config";
import { API_FETCH_READINGS, API_FETCH_READINGS_BASEON_HEXAGRAM, API_SEARCH_READINGS } from "./ApiUrls";
// import { getRecentReadings, getReadings, getReadingsBasedOnHexagram } from "../apis/DatabaseApi";

const NO_RESULT_MESSAGE = "No reading was found! :(",
      EMPTY_MESSAGE = "";

export const fetchRecentReadings = startNumber => dispatch => {
    dispatch(isLoading(true));
    axios.get(API_FETCH_READINGS, {params: {jwt: localStorage.getItem(JWT_MESSAGE), startNumber, limitedNumber: 5}}).then(response => {
      dispatch(isLoading(false));
      dispatch(fetchRecentReadingsSuccess(response.data));
    });
    /*getRecentReadings(userId, startNumber).then(result => {
      dispatch(isLoading(false));
      dispatch(fetchRecentReadingsSuccess(result.data));
    });*/

  };

export const searchReadings = searchCriterias => dispatch => {
    dispatch(isLoading(true));
    axios.get(API_SEARCH_READINGS, {params: {searchCriterias, jwt: localStorage.getItem(JWT_MESSAGE)}}).then(response => {
      dispatch(isLoading(false));
      response.data.length === 0 ? dispatch(sendExtraMessage(NO_RESULT_MESSAGE)) : dispatch(sendExtraMessage(EMPTY_MESSAGE));
      dispatch(fetchRecentReadingsSuccess(response.data));
    });
/* Deprecated old version
    getReadings(searchCriterias).then(result => {
      dispatch(isLoading(false));
      result.data.length === 0 ? dispatch(sendExtraMessage(NO_RESULT_MESSAGE)) : dispatch(sendExtraMessage(EMPTY_MESSAGE));
      dispatch(fetchRecentReadingsSuccess(result.data));
    });*/
  };


export const fetchReadingsBaseOnHexagram = (img_arr) => {
  return dispatch => {
    dispatch(isLoading(true));
    axios.get(API_FETCH_READINGS_BASEON_HEXAGRAM, {params: {img_arr, jwt: localStorage.getItem(JWT_MESSAGE)}}).then(response => {
      dispatch(isLoading(false));
      response.data.length === 0 ? dispatch(sendExtraMessage(NO_RESULT_MESSAGE)) : dispatch(sendExtraMessage(EMPTY_MESSAGE));
      dispatch(fetchHexagramsSuccess([])); // setting hexagram area to blank
      dispatch(fetchRecentReadingsSuccess(response.data));
    });

    /*getReadingsBasedOnHexagram(img_arr, userId).then(result => {
      dispatch(isLoading(false));
      result.data.length === 0 ? dispatch(sendExtraMessage(NO_RESULT_MESSAGE)) : dispatch(sendExtraMessage(EMPTY_MESSAGE));
      dispatch(fetchHexagramsSuccess([])); // setting hexagram area to blank
      dispatch(fetchRecentReadingsSuccess(result.data));
    });*/
  };
};

export const clearReadings = _ => fetchRecentReadingsSuccess([]);

export const fetchRecentReadingsSuccess = readings => ({type: READING_FETCH_RECENT_SUCCESS, readings});