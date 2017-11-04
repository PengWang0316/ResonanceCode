import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { FETCH_LINES_BIGRAMS_SUCCESS, IS_LOADING } from '../../app/actions/ActionTypes';
import { API_FETCH_LINES_BIGRAMS } from '../../app/actions/ApiUrls';
import fetchLinesBigrams from '../../app/actions/BigramsActions';

const axiosMock = new MockAdapter(axios); // Setting up a mock for axios.
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Test BigramsActions', () => {
  test('fetchLinesBigrams', () => {
    const bigramIdObject = {};
    const readingId = 'readingId';
    axiosMock.onGet(API_FETCH_LINES_BIGRAMS, { params: bigramIdObject })
      .reply(200, { lines: 1, bigrams: 2 }); // Setting the mock for the axios call.
    const expectedActions = [
      { type: IS_LOADING, isLoading: true },
      {
        type: FETCH_LINES_BIGRAMS_SUCCESS,
        bigramInfo: { bigrams: { lines: 1, bigrams: 2 }, readingId }
      },
      { type: IS_LOADING, isLoading: false }
    ]; // Setting up the expect action this action should call.
    const store = mockStore({ isLoading: null, bigramInfo: null }); // Setting up the default store.
    return store.dispatch(fetchLinesBigrams(bigramIdObject, readingId))
      .then(_ => expect(store.getActions()).toEqual(expectedActions));
  });
});
