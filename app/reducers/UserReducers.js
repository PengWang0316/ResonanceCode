import { PARSER_USER_FROM_JWT } from "../actions/ActionTypes";

export const user = (state={isAuth: false}, action) => {
  switch (action.type){
    case PARSER_USER_FROM_JWT:
      // console.log("reducer: ", action.user);
      return Object.assign({isLoaded: true}, action.user);
    default:
      return state;
  }
};
