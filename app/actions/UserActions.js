import axios from 'axios';
import { PARSER_USER_FROM_JWT, FETCH_ALL_USER_LIST_SUCCESS, FETCH_USERS_AMOUNT_SUCCESS } from './ActionTypes';
import { JWT_MESSAGE, NUMBER_OF_USER_PER_PAGE } from '../config';
import isLoading from './LoadingActions';
import { API_JWTMESSAGE_VERIFY, API_USERNAME_PASSWORD_LOGIN, API_CHECK_USERNAME_AVAILABLE, API_REGISTER_NEW_USER, API_UPDATE_SETTING_COIN_MODE, API_FETCH_ALL_USER_LIST, API_FETCH_USERS_AMOUNT, API_SAVE_PUSH_SUBSCRIPTION, API_TURN_OFF_PUSH_SUBSCRIPTION, API_UPDATE_USER_GROUP, API_DELETE_USER_GROUP, API_SAVE_CUSTOM_NAME } from './ApiUrls';

const parserUserFromJwt = user => ({ type: PARSER_USER_FROM_JWT, user });
const fetchAllUserListSuccess = users => ({ type: FETCH_ALL_USER_LIST_SUCCESS, users });
const fetchUsersAmountSuccess = usersAmount => ({ type: FETCH_USERS_AMOUNT_SUCCESS, usersAmount });

// const fetchUserGroupsSuccess = userGroups => ({ type: FETCH_USER_GROUPS_SUCCESS, userGroups });

const verifyJwt = (jwtMessage, dispatch) =>
  axios.get(API_JWTMESSAGE_VERIFY, { params: { jwtMessage } })
    .then(response => dispatch(parserUserFromJwt(response.data)));

export const checkAuthentication = (queryJwt = '') => dispatch => {
  const queryJwtMessage = queryJwt.match(/^\?.+=(.+)/);
  if (queryJwtMessage) {
    localStorage.setItem(JWT_MESSAGE, queryJwtMessage[1]);
    return verifyJwt(queryJwtMessage[1], dispatch);
  } else if (localStorage.getItem(JWT_MESSAGE))
    return verifyJwt(localStorage.getItem(JWT_MESSAGE), dispatch);
  dispatch(parserUserFromJwt({ isAuth: false }));
  return null;
};


export const usernamePasswordLogin = params => dispatch =>
  axios.get(API_USERNAME_PASSWORD_LOGIN, { params }).then(response => {
    if (response.data.jwt) localStorage.setItem(JWT_MESSAGE, response.data.jwt);
    dispatch(parserUserFromJwt(response.data.user));
  });

export const checkUserNameAvailable = username => dispatch =>
  axios.get(API_CHECK_USERNAME_AVAILABLE, { params: { username } })
    .then(response => dispatch(parserUserFromJwt(response.data)));


export const registerNewUser = params => dispatch =>
  axios.post(API_REGISTER_NEW_USER, params).then(response => {
    localStorage.setItem(JWT_MESSAGE, response.data.jwt);
    dispatch(parserUserFromJwt(response.data.user));
  });

export const logout = _ => dispatch => {
  localStorage.removeItem(JWT_MESSAGE);
  dispatch(parserUserFromJwt({ isAuth: false }));
};

export const updateSettingCoinMode = isCoinMode => dispatch =>
  axios.put(API_UPDATE_SETTING_COIN_MODE, {
    jwtMessage: localStorage.getItem(JWT_MESSAGE), coinMode: isCoinMode
  }).then(response => {
    localStorage.setItem(JWT_MESSAGE, response.data.jwt);
    dispatch(parserUserFromJwt(response.data.user));
  });

export const fetchAllUserList = pageNumber => dispatch => {
  dispatch(isLoading(true));
  return axios.get(API_FETCH_ALL_USER_LIST, {
    params: { pageNumber, numberPerpage: NUMBER_OF_USER_PER_PAGE }
  }).then(response => {
    dispatch(fetchAllUserListSuccess(response.data));
    dispatch(isLoading(false));
  });
};

export const fetchUsersAmount = _ => dispatch =>
  axios.get(API_FETCH_USERS_AMOUNT)
    .then(response => dispatch(fetchUsersAmountSuccess(response.data)));

export const savePushSubscription = pushSubscription => dispatch =>
  axios.put(API_SAVE_PUSH_SUBSCRIPTION, {
    pushSubscription, jwtMessage: localStorage.getItem(JWT_MESSAGE)
  }).then(({ data }) => {
    localStorage.setItem(JWT_MESSAGE, data.jwt);
    dispatch(parserUserFromJwt(data.user));
  });

export const turnOffPushSubscription = () => dispatch =>
  axios.put(API_TURN_OFF_PUSH_SUBSCRIPTION, {
    jwtMessage: localStorage.getItem(JWT_MESSAGE)
  }).then(({ data }) => {
    localStorage.setItem(JWT_MESSAGE, data.jwt);
    dispatch(parserUserFromJwt(data.user));
  });

export const updateUserGroup = params => dispatch =>
  axios.put(API_UPDATE_USER_GROUP, { jwtMessage: localStorage.getItem(JWT_MESSAGE), ...params })
    .then(({ data }) => dispatch(parserUserFromJwt(data)));

export const deleteUserGroup = groupName => dispatch =>
  axios.delete(API_DELETE_USER_GROUP, {
    params: { groupName, jwtMessage: localStorage.getItem(JWT_MESSAGE) }
  }).then(({ data }) => dispatch(parserUserFromJwt(data)));

export const saveCustomName = customName => dispatch =>
  axios.put(API_SAVE_CUSTOM_NAME, { customName, jwtMessage: localStorage.getItem(JWT_MESSAGE) })
    .then(({ data }) => dispatch(parserUserFromJwt(data)));
