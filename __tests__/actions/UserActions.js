import axios from 'axios';
import Adapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { PARSER_USER_FROM_JWT, IS_LOADING, FETCH_ALL_USER_LIST_SUCCESS, FETCH_USERS_AMOUNT_SUCCESS } from '../../app/actions/ActionTypes';
import { JWT_MESSAGE, NUMBER_OF_USER_PER_PAGE } from '../../app/config';
import { API_JWTMESSAGE_VERIFY, API_USERNAME_PASSWORD_LOGIN, API_CHECK_USERNAME_AVAILABLE, API_REGISTER_NEW_USER, API_UPDATE_SETTING_COIN_MODE, API_FETCH_ALL_USER_LIST, API_FETCH_USERS_AMOUNT, API_SAVE_PUSH_SUBSCRIPTION, API_TURN_OFF_PUSH_SUBSCRIPTION, API_UPDATE_USER_GROUP, API_DELETE_USER_GROUP } from '../../app/actions/ApiUrls';
import * as UserActions from '../../app/actions/UserActions';

const mockAxios = new Adapter(axios);
const mockStore = configureMockStore([thunk]);
const jwtMessage = 'jwtMessage';
// localStorage.__STORE__[JWT_MESSAGE] = jwtMessage; Some method will delete or change the vaule in the localStorage. So, we cannot define the vaule here.

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

  test('fetchAllUserList', () => {
    const store = mockStore();
    const pageNumber = 2;
    const users = [{ _id: '1', name: 'nameA' }, { _id: '2', name: 'nameB' }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: FETCH_ALL_USER_LIST_SUCCESS, users },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onGet(API_FETCH_ALL_USER_LIST, {
      params: { pageNumber, numberPerpage: NUMBER_OF_USER_PER_PAGE }
    }).reply(200, users);
    return store.dispatch(UserActions.fetchAllUserList(pageNumber))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('fetchUsersAmount', () => {
    const store = mockStore();
    const usersAmount = 10;
    const expectedActions = [{ type: FETCH_USERS_AMOUNT_SUCCESS, usersAmount }];
    mockAxios.onGet(API_FETCH_USERS_AMOUNT).reply(200, usersAmount);
    return store.dispatch(UserActions.fetchUsersAmount())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('savePushSubscription', () => {
    const store = mockStore();
    localStorage.__STORE__[JWT_MESSAGE] = jwtMessage;
    const pushSubscription = { endPoint: 'xxx', others: 'xxa' };
    const updatedUser = { _id: 'xx', pushSubscription };
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user: updatedUser }];
    mockAxios.onPut(API_SAVE_PUSH_SUBSCRIPTION, { jwtMessage, pushSubscription }).reply(200, { user: updatedUser, jwt: 'testJwt' });
    return store.dispatch(UserActions.savePushSubscription(pushSubscription))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenCalledWith(JWT_MESSAGE);
        expect(localStorage.setItem).toHaveBeenLastCalledWith(JWT_MESSAGE, 'testJwt');
      });
  });

  test('turnOffPushSubscription', () => {
    const store = mockStore();
    localStorage.__STORE__[JWT_MESSAGE] = jwtMessage;
    const updatedUser = { _id: 'xx', settings: { isPushNotification: false } };
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user: updatedUser }];
    mockAxios.onPut(API_TURN_OFF_PUSH_SUBSCRIPTION, { jwtMessage }).reply(200, { user: updatedUser, jwt: 'testJwt' });
    return store.dispatch(UserActions.turnOffPushSubscription())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenCalledWith(JWT_MESSAGE);
        expect(localStorage.setItem).toHaveBeenLastCalledWith(JWT_MESSAGE, 'testJwt');
      });
  });

  test('updateUserGroup', () => {
    const store = mockStore();
    localStorage.__STORE__[JWT_MESSAGE] = jwtMessage;
    const params = {
      isUpdate: true,
      oldGroupName: 'oldGroupName',
      newGroupName: 'newGroupName',
      userList: [
        { id: '1', displayName: 'name A', photo: 'photo A' },
        { id: '2', displayName: 'name B', photo: 'photo B' }
      ],
      jwtMessage
    };
    const user = { id: 'userId' };
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user }];
    mockAxios.onPut(API_UPDATE_USER_GROUP, params).reply(200, user);
    return store.dispatch(UserActions.updateUserGroup(params))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('deleteUserGroup', () => {
    const store = mockStore();
    localStorage.__STORE__[JWT_MESSAGE] = jwtMessage;
    const groupName = 'name';
    const user = { id: '1' };
    const expectedActions = [{ type: PARSER_USER_FROM_JWT, user }];
    mockAxios.onDelete(API_DELETE_USER_GROUP).reply(200, user); // Because the delete method should not have any body, so the mock axios could not send params. Otherwise, the axios will return a 404.
    return store.dispatch(UserActions.deleteUserGroup(groupName))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  /*
  test('fetchUserGroups', () => {
    const store = mockStore();
    localStorage.__STORE__[JWT_MESSAGE] = jwtMessage;
    const userGroups = [
      { userId: '1', displayName: 'nameA', photo: 'photoA' },
      { userId: '2', displayName: 'nameB', photo: 'photoB' }
    ];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: FETCH_USER_GROUPS_SUCCESS, userGroups },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onGet(API_FETCH_USER_GROUPS, { params: { jwtMessage } }).reply(200, userGroups);
    return store.dispatch(UserActions.fetchUserGroups())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });
  */
});
