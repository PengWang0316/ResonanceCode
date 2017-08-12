import { FETCH_HEXAGRAMS_SUCCESS } from "./ActionTypes";
import { isLoading } from "./LoadingActions";
import { getHexagrams } from "../apis/DatabaseApi";
import { fetchRecentReadingsSuccess } from "./ReadingActions";

export const fetchHexagrams = searchCriterians => {
  return dispatch => {
    dispatch(isLoading(true));
    getHexagrams(searchCriterians).then(result => {
      dispatch(isLoading(false));
      dispatch(fetchRecentReadingsSuccess([])); /* setting readings area to blank */
      dispatch(fetchHexagramsSuccess(result.data));
    });
  };
};

export const fetchHexagramsSuccess = hexagrams => {
  return {
    type: FETCH_HEXAGRAMS_SUCCESS,
    hexagrams
  };
};
