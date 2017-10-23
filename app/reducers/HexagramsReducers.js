import { FETCH_HEXAGRAMS_SUCCESS, FETCH_HEXAGRAM_SUCCESS } from '../actions/ActionTypes';

export const hexagrams = (state = [], action) => {
  switch (action.type) {
    case FETCH_HEXAGRAMS_SUCCESS:
      return action.hexagrams.slice(0);
    default:
      return state;
  }
};

export const hexagram = (state = null, action) => {
  switch (action.type) {
    case FETCH_HEXAGRAM_SUCCESS:
      return action.hexagram;
    default:
      return state;
  }
};
