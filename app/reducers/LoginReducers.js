import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../actions/ActionTypes";

export const login = (state = null, action) => {
  // console.log("action: ", action, state);
  switch (action.type){
    case LOGIN_SUCCESS:
      return action.user;
    case LOGOUT_SUCCESS:
      return null;
    default:
      return state;
  }
};
