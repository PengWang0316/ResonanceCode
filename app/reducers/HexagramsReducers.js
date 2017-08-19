import { FETCH_HEXAGRAMS_SUCCESS } from "../actions/ActionTypes";

export const hexagrams = (state = [], action) => {
  switch (action.type) {
    case FETCH_HEXAGRAMS_SUCCESS:
      return action.hexagrams.slice(0);
    default:
      return state;
  }
};
