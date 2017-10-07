import { READING_FETCH_RECENT_SUCCESS } from "./ActionTypes";
import { isLoading } from "./LoadingActions";
import { sendExtraMessage } from "./ExtraMessageActions";
import { getRecentReadings, getReadings, getReadingsBasedOnHexagram } from "../apis/DatabaseApi";
import { fetchHexagramsSuccess } from "./HexagramActions";
import axios from "axios";
import { JWT_MESSAGE } from "../config";
import { API_FETCH_READINGS } from "./ApiUrls";

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

export const fetchReadings = searchCriterias => {
  return dispatch => {
    dispatch(isLoading(true));
    getReadings(searchCriterias).then(result => {
      dispatch(isLoading(false));
      result.data.length === 0 ? dispatch(sendExtraMessage(NO_RESULT_MESSAGE)) : dispatch(sendExtraMessage(EMPTY_MESSAGE));
      dispatch(fetchRecentReadingsSuccess(result.data));
    });
  };
};

export const fetchReadingsBaseOnHexagram = (img_arr, userId) => {
  return dispatch => {
    dispatch(isLoading(true));
    getReadingsBasedOnHexagram(img_arr, userId).then(result => {
      dispatch(isLoading(false));
      result.data.length === 0 ? dispatch(sendExtraMessage(NO_RESULT_MESSAGE)) : dispatch(sendExtraMessage(EMPTY_MESSAGE));
      dispatch(fetchHexagramsSuccess([])); /* setting hexagram area to blank */
      dispatch(fetchRecentReadingsSuccess(result.data));
    });
  };
};

export const fetchRecentReadingsSuccess = readings => {return {type: READING_FETCH_RECENT_SUCCESS, readings}};
