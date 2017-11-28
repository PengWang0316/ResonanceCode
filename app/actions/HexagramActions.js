import axios from 'axios';

import { FETCH_HEXAGRAMS_SUCCESS, FETCH_HEXAGRAM_SUCCESS } from './ActionTypes';
import isLoading from './LoadingActions';
// import { getHexagrams } from "../apis/DatabaseApi";
import { clearSearchReadings } from './ReadingActions';
import { API_FETCH_HEXAGRAMS, API_FETCH_ALL_HEXAGRAMS, API_FETCH_HEXAGRAM_BASED_ON_IMG, API_UPDATE_HEXAGRAM } from './ApiUrls';
import { JWT_MESSAGE } from '../config';

const fetchHexagramSuccess = hexagram => ({
  type: FETCH_HEXAGRAM_SUCCESS,
  hexagram
});

export const clearHexagram = _ => fetchHexagramSuccess(null);

export const fetchHexagramsSuccess = hexagrams => ({
  type: FETCH_HEXAGRAMS_SUCCESS,
  hexagrams
});

export const clearHexagrams = _ => fetchHexagramsSuccess([]);

export const fetchHexagrams = searchCriterians => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_HEXAGRAMS, { params: searchCriterians }).then(response => {
    dispatch(isLoading(false));
    dispatch(clearSearchReadings()); // setting readings area to blank //
    dispatch(fetchHexagramsSuccess(response.data));
  });
};

export const getAllHexagrams = _ => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_ALL_HEXAGRAMS, {
    params: { jwtMessage: localStorage.getItem(JWT_MESSAGE) }
  }).then(response => {
    dispatch(fetchHexagramsSuccess(response.data));
    dispatch(isLoading(false));
  });
};

export const fetchHexagramBasedOnImg = imgArray => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_HEXAGRAM_BASED_ON_IMG, { params: { imgArray } })
    .then(response => {
      dispatch(fetchHexagramSuccess(response.data));
      dispatch(isLoading(false));
    });
};

export const updateHexagram = hexagram => dispatch => {
  dispatch(isLoading(true));
  return axios.put(API_UPDATE_HEXAGRAM, { hexagram }).then(response => {
    dispatch(isLoading(false));
  });
};
