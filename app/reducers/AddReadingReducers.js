import { ADDREADING_CLICK_COIN } from "../actions/ActionTypes";
// import Util from "../apis/Util";

let defaultAddReadingTempState = {
  line0: {side1: "", middle1: "",side2: "", middle2: ""},
  line1: {side1: "", middle1: "",side2: "", middle2: ""},
  line2: {side1: "", middle1: "",side2: "", middle2: ""},
  line3: {side1: "", middle1: "",side2: "", middle2: ""},
  line4: {side1: "", middle1: "",side2: "", middle2: ""},
  line5: {side1: "", middle1: "",side2: "", middle2: ""},
  changeLines: "",
  availableArr: [true,false,false,false,false,false,false],
  /*readingName: "",
  date: Util.getCurrentDateString(),
  people: "",
  isWriting: false,*/
  imageArrays: {img1:[],img2:[]},
  changeLinesNumberArray: []
};

export const addReadingTempState = (state = defaultAddReadingTempState, action) => {
  switch(action.type){
    case ADDREADING_CLICK_COIN:
      return Object.assign({}, action.addReadingTempState);
    default:
      return state;
  }
};
