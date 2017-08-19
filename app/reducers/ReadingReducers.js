import { READING_FETCH_RECENT_SUCCESS } from "../actions/ActionTypes";

export const readings = (state = [], action) => {
  switch (action.type){
    case READING_FETCH_RECENT_SUCCESS:
      // console.log(Object.assign({}, action.readings));
      return action.readings.slice(0);
    default:
      // console.log("action reading default:", state);
      return state;
  }
};
