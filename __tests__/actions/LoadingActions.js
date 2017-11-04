// import MockAdapter from 'axios-mock-adapter';
// import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { IS_LOADING } from '../../app/actions/ActionTypes';
import isLoading from '../../app/actions/LoadingActions';

const mockStore = configureMockStore([thunk]);
// const mockAxios = new MockAdapter(axios);

describe('Test LoadingActions', () => {
  test('isLoading true', () => {
    const store = mockStore();
    const expectedActions = [{ type: IS_LOADING, isLoading: true }];
    store.dispatch(isLoading(true));
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('isLoading false', () => {
    const store = mockStore();
    const expectedActions = [{ type: IS_LOADING, isLoading: false }];
    store.dispatch(isLoading(false));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
