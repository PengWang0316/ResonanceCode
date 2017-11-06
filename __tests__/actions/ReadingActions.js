import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as ReadingActions from '../../app/actions/ReadingActions';
import { JWT_MESSAGE, NUMBER_OF_READING_PER_PAGE, NUMBER_OF_READING_PER_PAGE_RECENT_READINGS } from '../../app/config';
import { API_FETCH_READINGS, API_FETCH_READINGS_BASEON_HEXAGRAM, API_SEARCH_READINGS, API_CREATE_READING, API_DELETE_READING, API_FETCH_SEARCH_READINGS, API_FETCH_ALL_READING_LIST, API_FETCH_READINGS_AMOUNT } from '../../app/actions/ApiUrls';
import { READING_FETCH_RECENT_SUCCESS, ADDREADING_CLICK_COIN, CLEAR_ADD_READING_TEMP_STATE, CREATE_READING_SUCESS, DELETE_READING_SUCCESS, FEATCH_SEARCH_READINGS_SUCCESS, FETCH_READINGS_AMOUNT_SUCCESS, IS_LOADING, SEND_EXTRA_MESSAGE, FETCH_HEXAGRAMS_SUCCESS, ALL_READING_LIST_FETCH_SUCCESS } from '../../app/actions/ActionTypes';

const mockStore = configureMockStore([thunk]);
const mockAxios = new MockAdapter(axios);
const jwtMessage = 'jwtMessage';
localStorage.__STORE__[JWT_MESSAGE] = jwtMessage;
const NO_RESULT_MESSAGE = 'No reading was found! :(';
const EMPTY_MESSAGE = '';

describe('Test ReadingActions', () => {
  test('fetchRecentReadingsSuccess', () => {
    const store = mockStore();
    const readings = [{ _id: 11 }, { _id: 22 }];
    const expectedActions = [{ type: READING_FETCH_RECENT_SUCCESS, readings }];
    store.dispatch(ReadingActions.fetchRecentReadingsSuccess(readings));
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('deleteReadingSuccess', () => {
    const store = mockStore();
    const readingId = '11';
    const expectedActions = [{ type: DELETE_READING_SUCCESS, readingId }];
    store.dispatch(ReadingActions.deleteReadingSuccess(readingId));
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('clearReadings', () => {
    const store = mockStore();
    const expectedActions = [{ type: READING_FETCH_RECENT_SUCCESS, readings: [] }];
    store.dispatch(ReadingActions.clearReadings());
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('fetchRecentReadings', () => {
    const store = mockStore();
    const readings = [{ _id: 111 }, { _id: 22 }];
    const startNumber = 0;
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: IS_LOADING, isLoading: false },
      { type: READING_FETCH_RECENT_SUCCESS, readings }
    ];
    mockAxios.onGet(API_FETCH_READINGS, {
      params: {
        jwt: jwtMessage, startNumber, limitedNumber: NUMBER_OF_READING_PER_PAGE_RECENT_READINGS
      }
    }).reply(200, readings);
    return store.dispatch(ReadingActions.fetchRecentReadings(startNumber))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('fetchAllReadingList with zero result', () => {
    const store = mockStore();
    const pageNumber = 1;
    const readings = [];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: NO_RESULT_MESSAGE },
      { type: ALL_READING_LIST_FETCH_SUCCESS, readings },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_FETCH_ALL_READING_LIST, {
      params: { jwt: jwtMessage, numberPerpage: NUMBER_OF_READING_PER_PAGE, pageNumber }
    }).reply(200, readings);
    return store.dispatch(ReadingActions.fetchAllReadingList(pageNumber))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('fetchAllReadingList with results', () => {
    const store = mockStore();
    const pageNumber = 1;
    const readings = [{ _id: 11 }, { _id: 22 }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: EMPTY_MESSAGE },
      { type: ALL_READING_LIST_FETCH_SUCCESS, readings },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_FETCH_ALL_READING_LIST, {
      params: { jwt: jwtMessage, numberPerpage: NUMBER_OF_READING_PER_PAGE, pageNumber }
    }).reply(200, readings);
    return store.dispatch(ReadingActions.fetchAllReadingList(pageNumber))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('searchReadings with zero result', () => {
    const store = mockStore();
    const searchCriterias = { _id: '11', others: 'others' };
    const readings = [];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: NO_RESULT_MESSAGE },
      { type: READING_FETCH_RECENT_SUCCESS, readings },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_SEARCH_READINGS, { params: { searchCriterias, jwt: jwtMessage } })
      .reply(200, readings);
    return store.dispatch(ReadingActions.searchReadings(searchCriterias))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('searchReadings with results', () => {
    const store = mockStore();
    const searchCriterias = { _id: '11', others: 'others' };
    const readings = [{ _id: 11 }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: EMPTY_MESSAGE },
      { type: READING_FETCH_RECENT_SUCCESS, readings },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_SEARCH_READINGS, { params: { searchCriterias, jwt: jwtMessage } })
      .reply(200, readings);
    return store.dispatch(ReadingActions.searchReadings(searchCriterias))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('fetchReadingsBaseOnHexagram with zero result', () => {
    const store = mockStore();
    const imgArray = '1-3-4-5-6';
    const readings = [];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: NO_RESULT_MESSAGE },
      { type: FETCH_HEXAGRAMS_SUCCESS, hexagrams: [] },
      { type: READING_FETCH_RECENT_SUCCESS, readings },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_FETCH_READINGS_BASEON_HEXAGRAM, {
      params: { img_arr: imgArray, jwt: jwtMessage }
    }).reply(200, readings);
    return store.dispatch(ReadingActions.fetchReadingsBaseOnHexagram(imgArray))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('fetchReadingsBaseOnHexagram with results', () => {
    const store = mockStore();
    const imgArray = '1-3-4-5-6';
    const readings = [{ _id: 11 }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: EMPTY_MESSAGE },
      { type: FETCH_HEXAGRAMS_SUCCESS, hexagrams: [] },
      { type: READING_FETCH_RECENT_SUCCESS, readings },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_FETCH_READINGS_BASEON_HEXAGRAM, {
      params: { img_arr: imgArray, jwt: jwtMessage }
    }).reply(200, readings);
    return store.dispatch(ReadingActions.fetchReadingsBaseOnHexagram(imgArray))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('clickCoin', () => {
    const store = mockStore();
    const addReadingTempState = { someStates: 'someStates' };
    const expectedActions = [{ type: ADDREADING_CLICK_COIN, addReadingTempState }];
    store.dispatch(ReadingActions.clickCoin(addReadingTempState));
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('clearAddReadingTempState', () => {
    const store = mockStore();
    const expectedActions = [{ type: CLEAR_ADD_READING_TEMP_STATE }];
    store.dispatch(ReadingActions.clearAddReadingTempState());
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('createReading', () => {
    const store = mockStore();
    const params = { _id: 11 };
    const reading = { _id: 11, content: 22 };
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: CREATE_READING_SUCESS, reading },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onPost(API_CREATE_READING, params).reply(200, reading);
    return store.dispatch(ReadingActions.createReading(params))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('deleteReading', () => {
    const store = mockStore();
    const readingId = 'id';
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: DELETE_READING_SUCCESS, readingId },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onDelete(API_DELETE_READING).reply(200, null);
    return store.dispatch(ReadingActions.deleteReading(readingId))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('fetchReadingBasedOnName', () => {
    const store = mockStore();
    const keyWord = 'keyword';
    const readings = [{ _id: 11 }, { _id: 22 }];
    const expectedActions = [{ type: FEATCH_SEARCH_READINGS_SUCCESS, searchReadings: readings }];
    mockAxios.onGet(API_FETCH_SEARCH_READINGS, { params: { keyWord, jwtMessage } })
      .reply(200, readings);
    return store.dispatch(ReadingActions.fetchReadingBasedOnName(keyWord))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('fetchReadingsAmount', () => {
    const store = mockStore();
    const readingsAmount = 10;
    const expectedActions = [{ type: FETCH_READINGS_AMOUNT_SUCCESS, readingsAmount }];
    mockAxios.onGet(API_FETCH_READINGS_AMOUNT, { params: { jwtMessage } })
      .reply(200, readingsAmount);
    return store.dispatch(ReadingActions.fetchReadingsAmount())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('clearSearchReadings', () => {
    const store = mockStore();
    const expectedActions = [{ type: FEATCH_SEARCH_READINGS_SUCCESS, searchReadings: [] }];
    store.dispatch(ReadingActions.clearSearchReadings());
    expect(store.getActions()).toEqual(expectedActions);
  });
});
