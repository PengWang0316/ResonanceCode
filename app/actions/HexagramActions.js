import { FETCH_HEXAGRAMS_SUCCESS } from "./ActionTypes";
import { isLoading } from "./LoadingActions";
// import { getHexagrams } from "../apis/DatabaseApi";
import { clearReadings } from "./ReadingActions";
import { API_FETCH_HEXAGRAMS } from "./ApiUrls";
import axios from "axios";

export const fetchHexagrams = searchCriterians => {
  return dispatch => {
    dispatch(isLoading(true));
    axios.get(API_FETCH_HEXAGRAMS, {params: searchCriterians}).then(response => {
      dispatch(isLoading(false));
      dispatch(clearReadings()); // setting readings area to blank //
      dispatch(fetchHexagramsSuccess(response.data));
    });

    /*getHexagrams(searchCriterians).then(result => {
      dispatch(isLoading(false));
      dispatch(clearReadings()); // setting readings area to blank //
      dispatch(fetchHexagramsSuccess(result.data));
    });*/

  };
};

export const fetchHexagramsSuccess = hexagrams => {
  return {
    type: FETCH_HEXAGRAMS_SUCCESS,
    hexagrams
  };
};
