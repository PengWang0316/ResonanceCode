import { READING_FETCH_RECENT_SUCCESS, ADDREADING_CLICK_COIN, CLEAR_ADD_READING_TEMP_STATE, CREATE_READING_SUCESS, DELETE_READING_SUCCESS, FEATCH_SEARCH_READINGS_SUCCESS } from '../actions/ActionTypes';

export const readings = (state = [], action) => {
  switch (action.type) {
    case READING_FETCH_RECENT_SUCCESS:
      // console.log(Object.assign({}, action.readings));
      return action.readings.slice(0);
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
