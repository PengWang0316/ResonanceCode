import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as ReadingActions from '../../app/actions/ReadingActions';
import { getDateString } from '../../app/apis/Util';
import { JWT_MESSAGE, NUMBER_OF_READING_PER_PAGE, NUMBER_OF_READING_PER_PAGE_RECENT_READINGS } from '../../app/config';
import { API_FETCH_READINGS, API_FETCH_READINGS_BASEON_HEXAGRAM, API_SEARCH_READINGS, API_CREATE_READING, API_DELETE_READING, API_FETCH_SEARCH_READINGS, API_FETCH_ALL_READING_LIST, API_FETCH_READINGS_AMOUNT, API_FETCH_SHARED_READINGS, API_FETCH_SHARED_READINGS_AMOUNT, API_OUTPUT_PDF_BASEON_ID } from '../../app/actions/ApiUrls';
import { READING_FETCH_RECENT_SUCCESS, ADDREADING_CLICK_COIN, CLEAR_ADD_READING_TEMP_STATE, CREATE_READING_SUCESS, DELETE_READING_SUCCESS, FEATCH_SEARCH_READINGS_SUCCESS, FETCH_READINGS_AMOUNT_SUCCESS, IS_LOADING, SEND_EXTRA_MESSAGE, FETCH_HEXAGRAMS_SUCCESS, ALL_READING_LIST_FETCH_SUCCESS, FETCH_SHARED_READINGS_SUCCESS, FETCH_SHARED_READINGS_AMOUNT_SUCCESS, ADD_READINGS_AMOUNT, REDUCE_READINGS_AMOUNT } from '../../app/actions/ActionTypes';

const mockStore = configureMockStore([thunk]);
const mockAxios = new MockAdapter(axios);
const jwtMessage = 'jwtMessage';
const NO_RESULT_MESSAGE = 'No reading was found! :(';
const EMPTY_MESSAGE = '';

// Mock the canvas.
const mockCanvas = { toDataURL: jest.fn() };
mockCanvas.toDataURL.mockReturnValue('mockedDataURL');
// Mock the html2canvas library.
jest.mock('html2canvas', () => () => new Promise((resolve, reject) => resolve(mockCanvas)));
// Mock window's methods
const mockWindowOpen = jest.fn();
const mockWrite = jest.fn();
mockWindowOpen.mockReturnValue({ document: { write: mockWrite } });
global.open = mockWindowOpen;


describe('Test ReadingActions', () => {
  beforeAll(() => localStorage.setItem(JWT_MESSAGE, jwtMessage));
  afterAll(() => localStorage.removeItem(JWT_MESSAGE));

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
    const pageNumber = 0;
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: IS_LOADING, isLoading: false },
      { type: READING_FETCH_RECENT_SUCCESS, readings }
    ];
    mockAxios.onGet(API_FETCH_READINGS, {
      params: {
        jwtMessage, pageNumber, numberPerpage: NUMBER_OF_READING_PER_PAGE_RECENT_READINGS
      }
    }).reply(200, readings);
    return store.dispatch(ReadingActions.fetchRecentReadings(pageNumber))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('fetchAllReadingList with zero result', () => {
    const store = mockStore();
    const pageNumber = 1;
    const allReadingList = [];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: NO_RESULT_MESSAGE },
      { type: ALL_READING_LIST_FETCH_SUCCESS, allReadingList },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_FETCH_ALL_READING_LIST, {
      params: { jwtMessage, numberPerpage: NUMBER_OF_READING_PER_PAGE, pageNumber }
    }).reply(200, allReadingList);
    return store.dispatch(ReadingActions.fetchAllReadingList(pageNumber))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('fetchAllReadingList with results', () => {
    const store = mockStore();
    const pageNumber = 1;
    const allReadingList = [{ _id: 11 }, { _id: 22 }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: EMPTY_MESSAGE },
      { type: ALL_READING_LIST_FETCH_SUCCESS, allReadingList },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_FETCH_ALL_READING_LIST, {
      params: { jwtMessage, numberPerpage: NUMBER_OF_READING_PER_PAGE, pageNumber }
    }).reply(200, allReadingList);
    return store.dispatch(ReadingActions.fetchAllReadingList(pageNumber))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('searchReadings with zero result', () => {
    const store = mockStore();
    const searchCriterias = { _id: '11', others: 'others' };
    const searchReadings = [];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: NO_RESULT_MESSAGE },
      { type: FEATCH_SEARCH_READINGS_SUCCESS, searchReadings },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_SEARCH_READINGS, { params: { searchCriterias, jwtMessage } })
      .reply(200, searchReadings);
    return store.dispatch(ReadingActions.searchReadings(searchCriterias))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('searchReadings with results', () => {
    const store = mockStore();
    const searchCriterias = { _id: '11', others: 'others' };
    const searchReadings = [{ _id: 11 }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: EMPTY_MESSAGE },
      { type: FEATCH_SEARCH_READINGS_SUCCESS, searchReadings },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_SEARCH_READINGS, { params: { searchCriterias, jwtMessage } })
      .reply(200, searchReadings);
    return store.dispatch(ReadingActions.searchReadings(searchCriterias))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('fetchReadingsBaseOnHexagram with zero result', () => {
    const store = mockStore();
    const imgArray = '1-3-4-5-6';
    const searchReadings = [];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: NO_RESULT_MESSAGE },
      { type: FETCH_HEXAGRAMS_SUCCESS, hexagrams: [] },
      { type: FEATCH_SEARCH_READINGS_SUCCESS, searchReadings },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_FETCH_READINGS_BASEON_HEXAGRAM, {
      params: { imageArray: imgArray, jwtMessage }
    }).reply(200, searchReadings);
    return store.dispatch(ReadingActions.fetchReadingsBaseOnHexagram(imgArray))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('fetchReadingsBaseOnHexagram with results', () => {
    const store = mockStore();
    const imgArray = '1-3-4-5-6';
    const searchReadings = [{ _id: 11 }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: SEND_EXTRA_MESSAGE, message: EMPTY_MESSAGE },
      { type: FETCH_HEXAGRAMS_SUCCESS, hexagrams: [] },
      { type: FEATCH_SEARCH_READINGS_SUCCESS, searchReadings },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.reset();
    mockAxios.onGet(API_FETCH_READINGS_BASEON_HEXAGRAM, {
      params: { imageArray: imgArray, jwtMessage }
    }).reply(200, searchReadings);
    return store.dispatch(ReadingActions.fetchReadingsBaseOnHexagram(imgArray))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
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
    // const params = { _id: 11 };
    const reading = { _id: 11, content: 22 };
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: CREATE_READING_SUCESS, reading },
      { type: ADD_READINGS_AMOUNT },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onPost(API_CREATE_READING, { reading, jwtMessage }).reply(200, reading);
    return store.dispatch(ReadingActions.createReading(reading))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('deleteReading', () => {
    const store = mockStore();
    const readingId = 'id';
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: DELETE_READING_SUCCESS, readingId },
      { type: REDUCE_READINGS_AMOUNT },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onDelete(API_DELETE_READING).reply(200, null);
    return store.dispatch(ReadingActions.deleteReading(readingId))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('fetchReadingBasedOnName', () => {
    const store = mockStore();
    const keyWord = 'keyword';
    const readings = [{ _id: 11 }, { _id: 22 }];
    const expectedActions = [{ type: FEATCH_SEARCH_READINGS_SUCCESS, searchReadings: readings }];
    mockAxios.onGet(API_FETCH_SEARCH_READINGS, { params: { keyWord, jwtMessage } })
      .reply(200, readings);
    return store.dispatch(ReadingActions.fetchReadingBasedOnName(keyWord))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('fetchReadingsAmount', () => {
    const store = mockStore();
    const readingsAmount = 10;
    const expectedActions = [{ type: FETCH_READINGS_AMOUNT_SUCCESS, readingsAmount }];
    mockAxios.onGet(API_FETCH_READINGS_AMOUNT, { params: { jwtMessage } })
      .reply(200, readingsAmount);
    return store.dispatch(ReadingActions.fetchReadingsAmount())
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('clearSearchReadings', () => {
    const store = mockStore();
    const expectedActions = [{ type: FEATCH_SEARCH_READINGS_SUCCESS, searchReadings: [] }];
    store.dispatch(ReadingActions.clearSearchReadings());
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('fetchSharedReadings', () => {
    const store = mockStore();
    const sharedReadings = [{ _id: '1', userName: 'peng', journal_entries: [] }];
    const pageNumber = 0;
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: FETCH_SHARED_READINGS_SUCCESS, sharedReadings },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onGet(API_FETCH_SHARED_READINGS, {
      params: { jwtMessage, pageNumber, numberPerpage: NUMBER_OF_READING_PER_PAGE_RECENT_READINGS }
    }).reply(200, sharedReadings);
    return store.dispatch(ReadingActions.fetchSharedReadings(pageNumber))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('fetchSharedReadingsAmount', () => {
    const store = mockStore();
    const sharedReadingsAmount = 10;
    const expectedActions = [{ type: FETCH_SHARED_READINGS_AMOUNT_SUCCESS, sharedReadingsAmount }];
    mockAxios.onGet(API_FETCH_SHARED_READINGS_AMOUNT, { params: { jwtMessage } })
      .reply(200, sharedReadingsAmount);
    return store.dispatch(ReadingActions.fetchSharedReadingsAmount())
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('outputReadingAndJournals', () => {
    const store = mockStore();
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: IS_LOADING, isLoading: false }
    ];
    const cloneNode = {};
    const readingHtmlElement = { cloneNode: () => cloneNode };

    const readingDate = new Date();
    const readingId = 'id';
    const readingName = 'name';
    const result = 'result data';

    mockAxios.onPost(API_OUTPUT_PDF_BASEON_ID).reply(200, result);

    return store.dispatch(ReadingActions.outputReadingAndJournals({
      readingHtmlElement, readingId, readingName, readingDate
    })).then(() => {
      expect(mockCanvas.toDataURL.mock.calls.length).toBe(1);
      expect(mockWindowOpen.mock.calls.length).toBe(1);
      expect(mockWindowOpen.mock.calls[0][0]).toBe('');
      expect(mockWindowOpen.mock.calls[0][1]).toBe('_blank');
      expect(mockWrite.mock.calls.length).toBe(1);
      expect(mockWrite.mock.calls[0][0]).toBe(`<html><body><center><a title="Download File" style="font-family: 'Verdana';color: #333;text-decoration: none;font-weight: 600;" download="${readingName} ${getDateString(readingDate)}.pdf" href=${result}>Download File</a></center><br><object width=100% height=100% type="application/pdf" data=${result}><embed type="application/pdf" src=${result} id="embed_pdf"></embed></object></body></html>`);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test('outputReadingAndJournals has mainDiv', () => {
    const store = mockStore();
    const cloneNode = {};
    const readingHtmlElement = { cloneNode: () => cloneNode };
    const readingDate = new Date();
    const readingId = 'id';
    const readingName = 'name';
    const mockInserBeforeFn = jest.fn();
    const mockRemoveChildFn = jest.fn();
    // const mockMainDiv = jest.fn().mockReturnValue();
    document.getElementsByTagName = jest.fn().mockReturnValue([{
      insertBefore: mockInserBeforeFn, removeChild: mockRemoveChildFn
    }]);
    mockAxios.onPost(API_OUTPUT_PDF_BASEON_ID).reply(200);

    return store.dispatch(ReadingActions.outputReadingAndJournals({
      readingHtmlElement, readingId, readingName, readingDate
    })).then(() => {
      expect(mockInserBeforeFn).toHaveBeenCalledTimes(1);
      expect(mockRemoveChildFn).toHaveBeenCalledTimes(1);
    });
  });
});
