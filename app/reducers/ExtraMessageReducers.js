import { SEND_EXTRA_MESSAGE } from '../actions/ActionTypes';

const extraMessage = (state = '', action) => {
  switch (action.type) {
    case SEND_EXTRA_MESSAGE:
      return action.message;
    default:
      return state;
  }
};
export default extraMessage;
