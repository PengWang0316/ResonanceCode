import { SEND_EXTRA_MESSAGE } from "./ActionTypes";

export const sendExtraMessage = (message) =>{
  return {
    type: SEND_EXTRA_MESSAGE,
    message
  };
};
