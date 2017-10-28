import { PARSER_USER_FROM_JWT } from '../actions/ActionTypes';

const DEFAULT_ROLE = 3;
const DEFAULT_COIN_MODE = true;

const user = (state = { isAuth: false }, action) => {
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
export default user;
