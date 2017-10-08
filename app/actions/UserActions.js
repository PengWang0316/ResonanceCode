import { PARSER_USER_FROM_JWT } from "./ActionTypes";
import axios from "axios";
import { JWT_MESSAGE } from "../config";
import { API_JWTMESSAGE_VERIFY, API_USERNAME_PASSWORD_LOGIN, API_CHECK_USERNAME_AVAILABLE, API_REGISTER_NEW_USER } from "./ApiUrls";

export const checkAuthentication = (queryJwt = "") => dispatch => {
  const queryJwtMessage = queryJwt.match(/^\?.+=(.+)/);
  if(queryJwtMessage){
    localStorage.setItem(JWT_MESSAGE, queryJwtMessage[1]);
    verifyJwt(queryJwtMessage[1], dispatch);
  } else if (localStorage.getItem(JWT_MESSAGE)){
    verifyJwt(localStorage.getItem(JWT_MESSAGE), dispatch);
  } else dispatch(parserUserFromJwt({isAuth: false}));
};

const verifyJwt = (jwtMessage, dispatch) => {
  axios.get(API_JWTMESSAGE_VERIFY, {params: {jwtMessage}}).then( response => dispatch(parserUserFromJwt(response.data)));
};

export const usernamePasswordLogin = params => dispatch => {
  axios.get(API_USERNAME_PASSWORD_LOGIN, {params: params}).then(response => {
    if(response.data.jwt) localStorage.setItem(JWT_MESSAGE, response.data.jwt);
    dispatch(parserUserFromJwt(response.data.user));
  });
};

export const checkUserNameAvailable = username => dispatch => {
  axios.get(API_CHECK_USERNAME_AVAILABLE, {params: {username}}).then(response => dispatch(parserUserFromJwt(response.data)));
};

export const registerNewUser = params => dispatch => {
  axios.post(API_REGISTER_NEW_USER, params).then(response => {
    localStorage.setItem(JWT_MESSAGE, response.data.jwt);
    dispatch(parserUserFromJwt(response.data.user));
  });
};

export const logout = _ => dispatch => {
  localStorage.removeItem(JWT_MESSAGE);
  dispatch(parserUserFromJwt({isAuth: false}));
};

/*export const checkAuthentication = _ => dispatch => {
  const jwtMessage = localStorage.getItem(JWT_MESSAGE);
  if(!jwtMessage) dispatch(parserUserFromJwt({isAuth: false}));
  else {
    // If the jwt message has already existed in the localStore, get it and send
    // send it to server to verify and parse
    axios.post(API_JWTMESSAGE_VERIFY, {jwtMessage: jwtMessage}).then( response => dispatch(parserUserFromJwt(response.data)));
  }
};*/

const parserUserFromJwt = user => ({type: PARSER_USER_FROM_JWT, user});
