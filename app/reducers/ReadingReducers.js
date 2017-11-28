import { READING_FETCH_RECENT_SUCCESS, ADDREADING_CLICK_COIN, CLEAR_ADD_READING_TEMP_STATE, CREATE_READING_SUCESS, DELETE_READING_SUCCESS, FEATCH_SEARCH_READINGS_SUCCESS, FETCH_READINGS_AMOUNT_SUCCESS, ALL_READING_LIST_FETCH_SUCCESS, FETCH_SHARED_READINGS_SUCCESS, FETCH_SHARED_READINGS_AMOUNT_SUCCESS, ADD_READINGS_AMOUNT, REDUCE_READINGS_AMOUNT } from '../actions/ActionTypes';

export const readings = (state = [], action) => {
  switch (action.type) {
    case READING_FETCH_RECENT_SUCCESS:
      // console.log(Object.assign({}, action.readings));
      return action.readings;
    case CREATE_READING_SUCESS:
      return [action.reading, ...state];
    case DELETE_READING_SUCCESS:
      return state.filter(reading => reading._id !== action.readingId);
    default:
      // console.log("action reading default:", state);
      return state;
  }
};

export const searchReadings = (state = [], action) => {
  switch (action.type) {
    case FEATCH_SEARCH_READINGS_SUCCESS:
      return action.searchReadings;
    default:
      return state;
  }
};

const getDefaultAddReadingTempState = _ =>
  ({
    line0: {
      side1: '', middle1: '', side2: '', middle2: ''
    },
    line1: {
      side1: '', middle1: '', side2: '', middle2: ''
    },
    line2: {
      side1: '', middle1: '', side2: '', middle2: ''
    },
    line3: {
      side1: '', middle1: '', side2: '', middle2: ''
    },
    line4: {
      side1: '', middle1: '', side2: '', middle2: ''
    },
    line5: {
      side1: '', middle1: '', side2: '', middle2: ''
    },
    changeLines: '',
    availableArr: [true, false, false, false, false, false, false],
    /* readingName: "",
  date: Util.getCurrentDateString(),
  people: "",
  isWriting: false, */
    imageArrays: { img1: [], img2: [] },
    changeLinesNumberArray: []
  });

export const addReadingTempState = (state = getDefaultAddReadingTempState(), action) => {
  switch (action.type) {
    case ADDREADING_CLICK_COIN:
      return action.addReadingTempState;
    case CLEAR_ADD_READING_TEMP_STATE:
      return getDefaultAddReadingTempState();
    default:
      return state;
  }
};

export const allReadingList = (state = [], action) => {
  switch (action.type) {
    case ALL_READING_LIST_FETCH_SUCCESS:
      return action.allReadingList;
    default:
      return state;
  }
};

export const readingsAmount = (state = null, action) => {
  switch (action.type) {
    case FETCH_READINGS_AMOUNT_SUCCESS:
      return action.readingsAmount;
    case ADD_READINGS_AMOUNT:
      return state ? state + 1 : state;
    case REDUCE_READINGS_AMOUNT:
      return state ? state - 1 : state;
    default:
      return state;
  }
};

export const sharedReadingsAmount = (state = null, action) => {
  switch (action.type) {
    case FETCH_SHARED_READINGS_AMOUNT_SUCCESS:
      return action.sharedReadingsAmount;
    default:
      return state;
  }
};

export const sharedReadings = (state = [], action) => {
  switch (action.type) {
    case FETCH_SHARED_READINGS_SUCCESS:
      return action.sharedReadings;
    default:
      return state;
  }
};
