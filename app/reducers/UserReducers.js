import { PARSER_USER_FROM_JWT, FETCH_ALL_USER_LIST_SUCCESS, FETCH_USERS_AMOUNT_SUCCESS } from '../actions/ActionTypes';

const DEFAULT_ROLE = 3;
const DEFAULT_COIN_MODE = true;

export const user = (state = { isAuth: false }, action) => {
  switch (action.type) {
    case PARSER_USER_FROM_JWT:
      // Using DEFAULT_ROLE to make sure all user has a role level.
      return Object.assign({
        isLoaded: true, role: DEFAULT_ROLE, settings: { coinMode: DEFAULT_COIN_MODE }
      }, action.user);
    default:
      return state;
  }
};

export const users = (state = [], action) => {
  switch (action.type) {
    case FETCH_ALL_USER_LIST_SUCCESS:
      return action.users;
    default:
      return state;
  }
};

export const usersAmount = (state = null, action) => {
  switch (action.type) {
    case FETCH_USERS_AMOUNT_SUCCESS:
      return action.usersAmount;
    default:
      return state;
  }
};
