import { IS_LOADING } from "../actions/ActionTypes";

export const isLoading = (state=false, action) => {
  switch (action.type){
    case IS_LOADING:
      // console.log("action IS_LOADING: ", action.isLoading);
      return action.isLoading;
    default:
      // console.log("action isloading: ", state);
      return state;
  }
};
