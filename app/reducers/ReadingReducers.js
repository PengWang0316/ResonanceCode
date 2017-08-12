import { READING_FETCH_RECENT_SUCCESS } from "../actions/ActionTypes";

export const readings = (state = [], action) => {
  switch (action.type){
    case READING_FETCH_RECENT_SUCCESS:
      // console.log("action READING_FETCH_RECENT_SUCCESS");
      return action.readings;
    default:
      // console.log("action reading default:", state);
      return state;
  }
};
