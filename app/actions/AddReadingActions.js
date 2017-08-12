import { ADDREADING_CLICK_COIN } from "./ActionTypes";

export const clickCoin = (addReadingTempState) => {
  return {
    type: ADDREADING_CLICK_COIN,
    addReadingTempState
  };
};
