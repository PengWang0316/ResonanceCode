import axios from 'axios';
import html2canvas from 'html2canvas';
// import fileDownload from 'react-file-download';
// import * as pdfmake from 'pdfmake/build/pdfmake';

import {
  READING_FETCH_RECENT_SUCCESS, ADDREADING_CLICK_COIN, CLEAR_ADD_READING_TEMP_STATE, CREATE_READING_SUCESS, DELETE_READING_SUCCESS, FEATCH_SEARCH_READINGS_SUCCESS, FETCH_READINGS_AMOUNT_SUCCESS, ALL_READING_LIST_FETCH_SUCCESS, FETCH_SHARED_READINGS_SUCCESS, FETCH_SHARED_READINGS_AMOUNT_SUCCESS, REDUCE_READINGS_AMOUNT, ADD_READINGS_AMOUNT
} from './ActionTypes';
import isLoading from './LoadingActions';
import sendExtraMessage from './ExtraMessageActions';
import { fetchHexagramsSuccess } from './HexagramActions';
import { JWT_MESSAGE, NUMBER_OF_READING_PER_PAGE, NUMBER_OF_READING_PER_PAGE_RECENT_READINGS } from '../config';
import {
  API_FETCH_READINGS, API_FETCH_READINGS_BASEON_HEXAGRAM, API_SEARCH_READINGS, API_CREATE_READING, API_DELETE_READING, API_FETCH_SEARCH_READINGS, API_FETCH_ALL_READING_LIST, API_FETCH_READINGS_AMOUNT, API_FETCH_SHARED_READINGS, API_FETCH_SHARED_READINGS_AMOUNT, API_OUTPUT_PDF_BASEON_ID
} from './ApiUrls';
import { getDateString } from '../apis/Util';
// import { getRecentReadings, getReadings, getReadingsBasedOnHexagram } from "../apis/DatabaseApi";

const NO_RESULT_MESSAGE = 'No reading was found! :(';
const EMPTY_MESSAGE = '';

const createReadingSuccess = reading => ({
  type: CREATE_READING_SUCESS,
  reading
});

const reduceReadingsAmount = _ => ({ type: REDUCE_READINGS_AMOUNT });

const addReadingsAmount = _ => ({ type: ADD_READINGS_AMOUNT });

const fetchReadingsAmountSuccess = readingsAmount => ({
  type: FETCH_READINGS_AMOUNT_SUCCESS,
  readingsAmount
});

const fetchSharedReadingsSuccess = sharedReadings => ({
  type: FETCH_SHARED_READINGS_SUCCESS,
  sharedReadings
});

const fetchSharedReadingsAmountSuccess = sharedReadingsAmount => ({
  type: FETCH_SHARED_READINGS_AMOUNT_SUCCESS,
  sharedReadingsAmount
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

export const fetchRecentReadings = pageNumber => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_READINGS, {
    params: {
      jwt: localStorage.getItem(JWT_MESSAGE),
      pageNumber,
      numberPerpage: NUMBER_OF_READING_PER_PAGE_RECENT_READINGS
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
    dispatch(fetchSearchReadingsSuccess(response.data));
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
    { params: { imageArray: imgArr, jwt: localStorage.getItem(JWT_MESSAGE) } }
  ).then(response => {
    if (response.data.length === 0) dispatch(sendExtraMessage(NO_RESULT_MESSAGE));
    else dispatch(sendExtraMessage(EMPTY_MESSAGE));
    dispatch(fetchHexagramsSuccess([])); // setting hexagram area to blank
    dispatch(fetchSearchReadingsSuccess(response.data));
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
* @param {reading} reading contains reading's information.
* @return {null} No return.
*/
export const createReading = reading => dispatch => {
  dispatch(isLoading(true));
  return axios.post(API_CREATE_READING, {
    reading, jwtMessage: localStorage.getItem(JWT_MESSAGE)
  }).then(response => {
    dispatch(createReadingSuccess(response.data));
    dispatch(addReadingsAmount());
    dispatch(isLoading(false));
  });
};

/** Delete a reading.
* @param {string} readingId is the reading's id.
* @return {null} No return.
*/
export const deleteReading = readingId => dispatch => {
  dispatch(isLoading(true));
  return axios.delete(API_DELETE_READING, {
    params: { readingId, jwtMessage: localStorage.getItem(JWT_MESSAGE) }
  }).then(_ => {
    dispatch(deleteReadingSuccess(readingId));
    dispatch(reduceReadingsAmount());
    dispatch(isLoading(false));
  });
};

/** Fetching the readings that based on readings' names.
* @param {string} keyWord is the part of reading's name.
* @return {null} No return.
*/
export const fetchReadingBasedOnName = keyWord => dispatch => axios.get(API_FETCH_SEARCH_READINGS, {
  params: {
    keyWord,
    jwtMessage: localStorage.getItem(JWT_MESSAGE)
  }
}).then(response => dispatch(fetchSearchReadingsSuccess(response.data)));

/** Fetching the amount of readings.
* @return {null} No return.
*/
export const fetchReadingsAmount = () => dispatch => axios.get(API_FETCH_READINGS_AMOUNT, {
  params: { jwtMessage: localStorage.getItem(JWT_MESSAGE) }
}).then(response => dispatch(fetchReadingsAmountSuccess(response.data)));

/** Clearing the reading state.
* @return {null} No return.
*/
export const clearSearchReadings = () => fetchSearchReadingsSuccess([]);

/** Fetching the shared readings for a user. Starting at pageNumber a user gives.
* @param {int} pageNumber is a number the user wants to start to see.
* @return {null} No return.
*/
export const fetchSharedReadings = pageNumber => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_SHARED_READINGS, {
    params: {
      jwtMessage: localStorage.getItem(JWT_MESSAGE),
      pageNumber,
      numberPerpage: NUMBER_OF_READING_PER_PAGE_RECENT_READINGS
    }
  }).then(response => {
    dispatch(fetchSharedReadingsSuccess(response.data));
    dispatch(isLoading(false));
  });
};

/** Fetching the amount of shared readings.
* @return {null} No return.
*/
export const fetchSharedReadingsAmount = () => dispatch => axios.get(API_FETCH_SHARED_READINGS_AMOUNT, {
  params: { jwtMessage: localStorage.getItem(JWT_MESSAGE) }
}).then(response => dispatch(fetchSharedReadingsAmountSuccess(response.data)));

/** Output a reading and its all journal to a PDF file.
  * TODO this just work for Chrom and FireFox but not Edge.
* @param {object} params includes readingHtmlElement (the html dom element for the reading section), readingId (reading's id), readingName (reading's name), and readingDate (readeing's creating date).
* @return {promise} Return a promise.
*/
export const outputReadingAndJournals = ({
  readingHtmlElement, readingId, readingName, readingDate
}) => dispatch => new Promise((resolve, reject) => {
  dispatch(isLoading(true));
  // The html2canvas library will clip the html element offscreen. So, create clone of element and add it as the first element of main element. Remove it after canvas is created.
  const clone = readingHtmlElement.cloneNode(true);
  const mainDiv = document.getElementsByTagName('main')[0];
  if (mainDiv) mainDiv.insertBefore(clone, mainDiv.firstChild);

  html2canvas(clone).then(canvas => {
    // remove the clone element after canvas is created.
    if (mainDiv) mainDiv.removeChild(clone);
    // Get the reading and all journal.
    axios.post(API_OUTPUT_PDF_BASEON_ID, {
      readingId, jwtMessage: localStorage.getItem(JWT_MESSAGE), readingDataUrl: canvas.toDataURL()
    }).then(result => {
      // Putting a embed element to a new window in order to load pdf data. Chrome does not allow to navigate top frame to data URL, so we have to make this tradeoff.
      // The Chrome also has problem when the user clicks the download button. I put a download link for a temporary solution.
      // TODO this just work for Chrom and FireFox but not Edge.
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`<html><body><center><a title="Download File" style="font-family: 'Verdana';color: #333;text-decoration: none;font-weight: 600;" download="${readingName} ${getDateString(readingDate)}.pdf" href=${result.data}>Download File</a></center><br><object width=100% height=100% type="application/pdf" data=${result.data}><embed type="application/pdf" src=${result.data} id="embed_pdf"></embed></object></body></html>`);

      // Making a handler for formHTML method
      // const ourtputText = assembleHtmlText({
      //   journal_entries, canvas, width, height, readingId
      // });
      dispatch(isLoading(false));
      resolve();
    });
  });
});
