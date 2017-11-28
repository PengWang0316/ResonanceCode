import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { FETCH_HEXAGRAMS_SUCCESS, FETCH_HEXAGRAM_SUCCESS, IS_LOADING, FEATCH_SEARCH_READINGS_SUCCESS } from '../../app/actions/ActionTypes';
import * as HexagramActions from '../../app/actions/HexagramActions';
import { API_FETCH_HEXAGRAMS, API_FETCH_ALL_HEXAGRAMS, API_FETCH_HEXAGRAM_BASED_ON_IMG, API_UPDATE_HEXAGRAM } from '../../app/actions/ApiUrls';
import { JWT_MESSAGE } from '../../app/config';

const mockStore = configureMockStore([thunk]);
const mockAxios = new MockAdapter(axios);

describe('Test HexagramActions', () => {
  test('clearHexagram', () => {
    const store = mockStore();
    const expectedActions = [{ type: FETCH_HEXAGRAM_SUCCESS, hexagram: null }];
    store.dispatch(HexagramActions.clearHexagram());
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('fetchHexagramsSuccess', () => {
    const store = mockStore();
    const hexagrams = [{ _id: 111, content: 'content' }, { _id: 222, content: 'content2' }];
    const expectedActions = [{ type: FETCH_HEXAGRAMS_SUCCESS, hexagrams }];
    store.dispatch(HexagramActions.fetchHexagramsSuccess(hexagrams));
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('clearHexagrams', () => {
    const store = mockStore();
    const expectedActions = [{ type: FETCH_HEXAGRAMS_SUCCESS, hexagrams: [] }];
    store.dispatch(HexagramActions.clearHexagrams());
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('fetchHexagrams', () => {
    const store = mockStore();
    const hexagrams = [{ _id: 111, content: 'content' }, { _id: 222, content: 'content2' }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: IS_LOADING, isLoading: false },
      { type: FEATCH_SEARCH_READINGS_SUCCESS, searchReadings: [] },
      { type: FETCH_HEXAGRAMS_SUCCESS, hexagrams },
    ];
    const params = { _id: 111 };
    mockAxios.onGet(API_FETCH_HEXAGRAMS, { params }).reply(200, hexagrams);
    return store.dispatch(HexagramActions.fetchHexagrams(params))
      .then(_ => expect(store.getActions()).toEqual(expectedActions));
  });

  test('getAllHexagrams', () => {
    const store = mockStore();
    const hexagrams = [{ _id: 111, content: 'content' }, { _id: 222, content: 'content2' }];
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: FETCH_HEXAGRAMS_SUCCESS, hexagrams },
      { type: IS_LOADING, isLoading: false },
    ];
    localStorage.__STORE__[JWT_MESSAGE] = 111; // Setting up a value for jwtMessage in the local storage.
    // const params = { jwtMessage: 111 };
    mockAxios.onGet(API_FETCH_ALL_HEXAGRAMS, { params: { jwtMessage: 111 } }).reply(200, hexagrams);
    return store.dispatch(HexagramActions.getAllHexagrams())
      .then(_ => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem).toHaveBeenLastCalledWith(JWT_MESSAGE);
      });
  });

  test('fetchHexagramBasedOnImg', () => {
    const store = mockStore();
    const imageArray = '1-2-3-4-5-6';
    const params = { imgArray: imageArray };
    const hexagram = { _id: 1 };
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: FETCH_HEXAGRAM_SUCCESS, hexagram },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onGet(API_FETCH_HEXAGRAM_BASED_ON_IMG, { params }).reply(200, hexagram);
    return store.dispatch(HexagramActions.fetchHexagramBasedOnImg(imageArray))
      .then(_ => expect(store.getActions()).toEqual(expectedActions));
  });

  it('updateHexagram', () => {
    const store = mockStore();
    const hexagram = { _id: 11 };
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      { type: IS_LOADING, isLoading: false }
    ];
    mockAxios.onPut(API_UPDATE_HEXAGRAM, { hexagram }).reply(200, null);
    return store.dispatch(HexagramActions.updateHexagram(hexagram))
      .then(_ => expect(store.getActions()).toEqual(expectedActions));
  });
});
