import axios from 'axios';
import Adapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { PARSER_USER_FROM_JWT } from '../../app/actions/ActionTypes';
import { JWT_MESSAGE } from '../../app/config';
import { API_JWTMESSAGE_VERIFY, API_USERNAME_PASSWORD_LOGIN, API_CHECK_USERNAME_AVAILABLE, API_REGISTER_NEW_USER, API_UPDATE_SETTING_COIN_MODE } from '../../app/actions/ApiUrls';
import * as UserActions from '../../app/actions/UserActions';

const mockAxios = new Adapter(axios);
const mockStore = configureMockStore([thunk]);
const jwtMessage = 'jwtMessage';
// localStorage.__STORE__[JWT_MESSAGE] = jwtMessage;

describe('Test UserActions', () => {
  test('checkAuthentication without queryJwt and localStore value', () => {
    const store = mockStore();
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user: { isAuth: false } }];
    store.dispatch(UserActions.checkAuthentication());
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('checkAuthentication has localStore value without queryJwt', () => {
    const store = mockStore();
    localStorage.__STORE__[JWT_MESSAGE] = jwtMessage;
    const user = { _id: 11, isAuth: true };
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user }];
    mockAxios.onGet(API_JWTMESSAGE_VERIFY, { params: { jwtMessage } }).reply(200, user);
    return store.dispatch(UserActions.checkAuthentication())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
        delete localStorage.__STORE__[JWT_MESSAGE];
      });
  });

  test('checkAuthentication has queryJwt', () => {
    const store = mockStore();
    const queryJwt = '?jwt=testJwt';
    const user = { _id: 11, isAuth: true };
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user }];
    mockAxios.onGet(API_JWTMESSAGE_VERIFY, { params: { jwtMessage: 'testJwt' } }).reply(200, user);
    return store.dispatch(UserActions.checkAuthentication(queryJwt))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.setItem).toHaveBeenLastCalledWith(JWT_MESSAGE, 'testJwt');
      });
  });

  test('usernamePasswordLogin with jwt', () => {
    const store = mockStore();
    const params = { username: 'xx', pd: 'xx' };
    const user = { _id: 11, isAuth: true };
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user }];
    mockAxios.onGet(API_USERNAME_PASSWORD_LOGIN, { params }).reply(200, { user, jwt: 'testJwt' });
    return store.dispatch(UserActions.usernamePasswordLogin(params))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.setItem).toHaveBeenLastCalledWith(JWT_MESSAGE, 'testJwt');
      });
  });

  test('usernamePasswordLogin without jwt', () => {
    const store = mockStore();
    const params = { username: 'xx', pd: 'xx' };
    const user = { _id: 11, isAuth: true };
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user }];
    mockAxios.reset();
    mockAxios.onGet(API_USERNAME_PASSWORD_LOGIN, { params }).reply(200, { user });
    return store.dispatch(UserActions.usernamePasswordLogin(params))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('checkUserNameAvailable', () => {
    const store = mockStore();
    const username = 'username';
    const user = { _id: 11, isAuth: true };
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user }];
    mockAxios.onGet(API_CHECK_USERNAME_AVAILABLE, { params: { username } }).reply(200, user);
    return store.dispatch(UserActions.checkUserNameAvailable(username))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('registerNewUser', () => {
    const store = mockStore();
    const params = { username: 'username' };
    const user = { _id: 11, isAuth: true };
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user }];
    mockAxios.onPost(API_REGISTER_NEW_USER, params).reply(200, { user, jwt: 'testJwt' });
    return store.dispatch(UserActions.registerNewUser(params))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.setItem).toHaveBeenLastCalledWith(JWT_MESSAGE, 'testJwt');
      });
  });

  test('logout', () => {
    const store = mockStore();
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user: { isAuth: false } }];
    store.dispatch(UserActions.logout());
    expect(store.getActions()).toEqual(expectedActions);
    expect(localStorage.removeItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
  });

  test('updateSettingCoinMode', () => {
    const store = mockStore();
    localStorage.__STORE__[JWT_MESSAGE] = jwtMessage;
    const coinMode = false;
    const user = { _id: 11, isAuth: true, coinMode: false };
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user }];
    mockAxios.onPut(API_UPDATE_SETTING_COIN_MODE, { jwtMessage, coinMode }).reply(200, { user, jwt: 'testJwt' });
    return store.dispatch(UserActions.updateSettingCoinMode(coinMode))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenCalledWith(JWT_MESSAGE);
        expect(localStorage.setItem).toHaveBeenLastCalledWith(JWT_MESSAGE, 'testJwt');
        delete localStorage.__STORE__[JWT_MESSAGE];
      });
  });
});
