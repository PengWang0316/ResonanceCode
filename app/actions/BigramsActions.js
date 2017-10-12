import axios from 'axios';
import { FETCH_LINES_BIGRAMS_SUCCESS } from './ActionTypes';
import isLoading from './LoadingActions';
import { API_FETCH_LINES_BIGRAMS } from './ApiUrls';

const fetchLinesBigramsSuccess = (bigrams, readingId) => ({
  type: FETCH_LINES_BIGRAMS_SUCCESS,
  bigramInfo: { bigrams, readingId }
});

const fetchLinesBigrams = (bigramIdObject, readingId) => dispatch => {
  dispatch(isLoading(true));
  axios.get(API_FETCH_LINES_BIGRAMS, { params: bigramIdObject }).then(response => {
    dispatch(fetchLinesBigramsSuccess(response.data, readingId));
    dispatch(isLoading(false));
  });
};
export default fetchLinesBigrams;
