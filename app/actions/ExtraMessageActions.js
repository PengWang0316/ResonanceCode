import { SEND_EXTRA_MESSAGE } from './ActionTypes';

const sendExtraMessage = message => ({
  type: SEND_EXTRA_MESSAGE,
  message,
});
export default sendExtraMessage;
