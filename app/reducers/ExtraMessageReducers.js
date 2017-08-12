import { SEND_EXTRA_MESSAGE } from "../actions/ActionTypes";

export const extraMessage = (state="", action) => {
  switch (action.type){
    case SEND_EXTRA_MESSAGE:
      return action.message;
    default:
      return state;
  }
};
